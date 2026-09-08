/**
 * AIClient — SSE 流式聊天客户端
 * 适配 ai-runtime HTTP/SSE 协议
 *
 * 特性：
 * - SSE 自动重连（最多3次，指数退避）
 * - DoubleBufferQueue RAF 批量更新（16ms 节流）
 * - 工具调用续传循环（前端工具本地执行 → POST tool-result）
 * - AbortController 取消支持
 */

import Cookies from 'universal-cookie'
import { getCookieData } from '@/utils/cryptoUtils/cookie'

const cookies = new Cookies()

// ============ AI Runtime 基础 URL ============
// 生产环境默认值，开发环境由 useAICopilot 传入空字符串走 devServer proxy
const AI_RUNTIME_BASE_URL = 'https://agent.sentimentrader.com'

// ============ 重连配置 ============
const RECONNECT_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
}

function calculateBackoffDelay(retryCount) {
  return Math.min(RECONNECT_CONFIG.baseDelay * Math.pow(2, retryCount), RECONNECT_CONFIG.maxDelay)
}

function isRetryableError(error) {
  const msg = (error.message || '').toLowerCase()
  if (msg.includes('abort')) return false
  if (msg.includes('unauthorized')) return false
  if (msg.includes('forbidden')) return false
  if (msg.includes('not found') && !msg.includes('fetch')) return false
  if (msg.includes('network')) return true
  if (msg.includes('timeout')) return true
  if (msg.includes('fetch')) return true
  if (msg.includes('failed')) return true
  if (msg.includes('http 5')) return true
  if (msg.includes('rate limit')) return true
  return false
}

// ============ DoubleBufferQueue — RAF 双缓冲队列 ============
class DoubleBufferQueue {
  constructor() {
    this.writeBuffer = []
    this.readBuffer = []
    this.rafId = null
    this.callback = null
  }

  setCallback(callback) {
    this.callback = callback
  }

  hasData() {
    return this.writeBuffer.length > 0 || this.readBuffer.length > 0
  }

  write(messageId, chunk) {
    const existing = this.writeBuffer.find(b => b.messageId === messageId)
    if (existing) {
      existing.chunks.push(chunk)
    } else {
      this.writeBuffer.push({ messageId, chunks: [chunk] })
    }
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.flush.bind(this))
    }
  }

  flush() {
    const temp = this.writeBuffer
    this.writeBuffer = this.readBuffer
    this.readBuffer = temp

    const pending = [...this.readBuffer]
    this.readBuffer = []

    if (this.callback && pending.length > 0) {
      for (const buffer of pending) {
        this.callback(buffer.messageId, buffer.chunks.join(''))
      }
    }

    if (this.writeBuffer.length > 0) {
      this.rafId = requestAnimationFrame(this.flush.bind(this))
    } else {
      this.rafId = null
    }
  }

  destroy() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.writeBuffer = []
    this.readBuffer = []
  }
}

// ============ SSE 解析器 ============
function parseSSEChunk(line) {
  if (!line.startsWith('data: ')) return null
  const data = line.slice(6)
  if (data === '[DONE]') return { type: 'done' }
  try {
    return JSON.parse(data)
  } catch {
    return { type: 'text', content: data }
  }
}

function resolveAIUserId() {
  try {
    const session = getCookieData()
    return session?.account_code || session?.username || cookies.get('devbt2Userid') || ''
  } catch {
    return cookies.get('devbt2Userid') || ''
  }
}

function isValidConversationId(conversationId) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId || '')
}

// ============ AIClient ============
// ============ Mock SSE 生成器 ============
function createMockStream(chunks, delayMs = 80) {
  let idx = 0
  return new ReadableStream({
    pull(controller) {
      if (idx >= chunks.length) {
        controller.close()
        return
      }
      const chunk = chunks[idx++]
      controller.enqueue(new TextEncoder().encode(chunk))
      if (idx < chunks.length) {
        return new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  })
}

function buildMockResponse(options) {
  const msg = typeof options.message === 'string' ? options.message : ''
  const lower = msg.toLowerCase()
  const chunks = []
  const cid = 'mock-' + Date.now()

  // RAG retrieve status 模拟
  if (lower.includes('search') || lower.includes('find') || lower.includes('look')) {
    chunks.push(`data: ${JSON.stringify({ type: 'retrieve_status', status: { type: 'initial', query: msg, message: 'Preparing search...' } })}
\n\n`)
    chunks.push(`data: ${JSON.stringify({ type: 'retrieve_status', status: { type: 'retrieving', message: 'Searching knowledge base...' } })}
\n\n`)
    chunks.push(`data: ${JSON.stringify({ type: 'retrieve_status', status: { type: 'completed', totalRounds: 2, totalChunks: 12, message: 'Search completed' } })}
\n\n`)
  }

  // tool_call 模拟
  if (lower.includes('stop loss') || lower.includes('set stop')) {
    const toolCall = {
      id: 'mock_tool_' + Date.now(),
      name: 'setStopLoss',
      input: { value: 0.03 },
    }
    chunks.push(`data: ${JSON.stringify({ type: 'tool_call', toolCall })}
\n\n`)
  } else if (lower.includes('backtest') || lower.includes('run')) {
    const toolCall = {
      id: 'mock_tool_' + Date.now(),
      name: 'runBacktest',
      input: { strategyId: 'sma_crossover' },
    }
    chunks.push(`data: ${JSON.stringify({ type: 'tool_call', toolCall })}
\n\n`)
  } else if (lower.includes('navigate') || lower.includes('go to')) {
    const toolCall = {
      id: 'mock_tool_' + Date.now(),
      name: 'navigateTo',
      input: { path: '/backtester/sr' },
    }
    chunks.push(`data: ${JSON.stringify({ type: 'tool_call', toolCall })}
\n\n`)
  }

  // 文本内容模拟（打字机效果，逐词发送）
  const responses = [
    "Sure, I can help with that! ",
    "Let me analyze the data for you...\n\n",
    "Based on the current market conditions, ",
    "here's what I found:",
    "\n\n1. **RSI** is currently at 62.3, indicating moderate bullish momentum.",
    "\n2. **MACD** shows a bullish crossover on the daily timeframe.",
    "\n3. **Volume** is above the 20-day average, supporting the trend.",
    "\n\nWould you like me to run a backtest with these parameters?",
  ]

  const fullText = responses.join('')
  const words = fullText.split(/(?<=\s)/)
  for (const word of words) {
    chunks.push(`data: ${JSON.stringify({ type: 'text', content: word })}
\n\n`)
  }

  chunks.push(`data: ${JSON.stringify({ type: 'done', conversation_id: cid })}
\n\n`)

  return {
    headers: new Map([['X-Conversation-Id', cid], ['X-Request-Id', 'mock_req_' + Date.now()]]),
    body: createMockStream(chunks, 60),
  }
}

// ============ AIClient ============
export class AIClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL !== undefined ? options.baseURL : AI_RUNTIME_BASE_URL
    this.apiKey = options.apiKey || ''
    this.mock = options.mock || false
    this.abortController = null
    this.buffer = new DoubleBufferQueue()
    this.currentRequestId = null
    this.currentConversationId = null
    this.isCompleted = false
  }

  _getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    }
    const userId = resolveAIUserId()
    if (userId) {
      headers['X-User-Id'] = userId
    }
    return headers
  }

  /**
   * 发送消息并接收 SSE 流
   *
   * @param {Object} options
   * @param {string} options.message — 用户消息内容
   * @param {string} [options.conversationId] — 会话 ID
   * @param {Array} [options.history] — 历史消息（离线恢复场景）
   * @param {Array<string>} [options.availableTools] — 前端注册的工具名
   * @param {Object} [options.context] — 额外上下文
   * @param {Object} callbacks — 事件回调
   * @param {Function} callbacks.onChunk — (messageId, content) => void，RAF 批量触发
   * @param {Function} callbacks.onToolCall — (toolCall, messageId) => void
   * @param {Function} callbacks.onToolResult — (toolCall, messageId) => void
   * @param {Function} callbacks.onRetrieveStatus — (status, messageId) => void
   * @param {Function} callbacks.onDone — (conversationId) => void
   * @param {Function} callbacks.onError — (error) => void
   * @param {string} aiMessageId — 当前 AI 消息的本地 ID（用于关联 chunk）
   */
  async send(options, callbacks, aiMessageId) {
    this.isCompleted = false
    this.buffer.destroy()
    this.buffer = new DoubleBufferQueue()
    if (callbacks.onChunk) {
      this.buffer.setCallback(callbacks.onChunk)
      this._onChunkDirect = callbacks.onChunk
    }
    if (callbacks.onReasoningChunk) {
      this._onReasoningChunkDirect = callbacks.onReasoningChunk
    }

    const body = {
      message: options.message,
      conversation_id: isValidConversationId(options.conversationId) ? options.conversationId : undefined,
      history: options.history || undefined,
      available_tools: options.availableTools || [],
      context: options.context || undefined,
    }

    // 清理 undefined 字段
    Object.keys(body).forEach(key => {
      if (body[key] === undefined) delete body[key]
    })

    let retryCount = 0

    const attempt = async () => {
      if (this.isCompleted) return

      this.abortController = new AbortController()

      try {
        let res
        if (this.mock) {
          res = buildMockResponse(options)
        } else {
          res = await fetch(`${this.baseURL}/v1/chat/completions`, {
            method: 'POST',
            headers: this._getHeaders(),
            body: JSON.stringify(body),
            credentials: 'include',
            signal: this.abortController.signal,
          })
        }

        if (!this.mock && !res.ok) {
          if (res.status === 401) {
            throw new Error('Authentication failed, please check API Key configuration')
          }
          if (res.status === 429) {
            const retryAfter = res.headers.get('Retry-After')
            const seconds = retryAfter ? parseInt(retryAfter, 10) : null
            const waitMsg = seconds ? `${seconds} seconds` : 'a moment'
            throw new Error(`Rate limit exceeded, please retry after ${waitMsg}`)
          }
          throw new Error(`HTTP ${res.status}`)
        }
        if (!res.body) {
          throw new Error('No response body')
        }

        const newConversationId = this.mock ? res.headers.get('X-Conversation-Id') : res.headers.get('X-Conversation-Id')
        const requestId = this.mock ? res.headers.get('X-Request-Id') : res.headers.get('X-Request-Id')
        if (requestId) this.currentRequestId = requestId

        const reader = res.body.getReader()
        await this._consumeStream(reader, callbacks, aiMessageId, newConversationId)

        if (!this.isCompleted) {
          this.isCompleted = true
          if (callbacks.onDone) callbacks.onDone(newConversationId)
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          this.isCompleted = true
          if (callbacks.onDone) callbacks.onDone(null)
          return
        }

        const canRetry = !this.mock && isRetryableError(err) && retryCount < RECONNECT_CONFIG.maxRetries && !this.isCompleted
        if (canRetry) {
          // 429 rate limit — use server Retry-After, otherwise exponential backoff
          const match = err.message.match(/retry after (\d+) seconds/)
          const delay = match ? parseInt(match[1], 10) * 1000 : calculateBackoffDelay(retryCount)
          retryCount++
          await new Promise(resolve => setTimeout(resolve, delay))
          await attempt()
          return
        }

        this.isCompleted = true
        if (callbacks.onError) callbacks.onError(err)
      }
    }

    await attempt()
  }

  async _processLine(line, callbacks, aiMessageId, conversationId) {
    const chunk = parseSSEChunk(line)
    if (!chunk) return

    try {
      switch (chunk.type) {
        case 'start':
          if (chunk.conversation_id) {
            this.currentConversationId = chunk.conversation_id
            if (callbacks.onStart) callbacks.onStart(chunk.conversation_id, chunk.user_message_id)
          }
          break
        case 'done':
          this.isCompleted = true
          const doneSources = chunk.sources || null
          const doneLatency = chunk.total_latency_ms || null
          if (callbacks.onDone) callbacks.onDone(chunk.conversation_id || conversationId, chunk.assistant_message_id, doneSources, doneLatency)
          break
        case 'reasoning':
          if (chunk.content && aiMessageId) {
            if (callbacks.onReasoningChunk) {
              await this._writeReasoningChunk(aiMessageId, chunk.content)
            } else if (callbacks.onReasoning) {
              callbacks.onReasoning({ content: chunk.content, seq: chunk.seq }, aiMessageId)
            }
          }
          break
        case 'error':
          this.isCompleted = true
          if (callbacks.onError) callbacks.onError(new Error(chunk.error || 'Generation failed'))
          break
        case 'text':
          if (chunk.content && aiMessageId) {
            await this._writeTextChunk(aiMessageId, chunk.content)
          }
          break
        case 'tool_call':
          if (chunk.toolCall && callbacks.onToolCall) {
            await callbacks.onToolCall(chunk.toolCall, aiMessageId)
          }
          break
        case 'tool_result':
          if (chunk.toolCall && callbacks.onToolResult) {
            callbacks.onToolResult(chunk.toolCall, aiMessageId)
          }
          break
        case 'retrieve_status':
          if ((chunk.status || chunk.retrieveStatus) && callbacks.onRetrieveStatus) {
            callbacks.onRetrieveStatus(chunk.status || chunk.retrieveStatus, aiMessageId)
          }
          break
        default:
          break
      }
    } catch (callbackErr) {
      if (callbacks.onError && !this.isCompleted) {
        callbacks.onError(callbackErr)
      }
    }
  }

  async _processBuffer(buffer, callbacks, aiMessageId, conversationId) {
    for (const line of buffer.split('\n')) {
      await this._processLine(line, callbacks, aiMessageId, this.currentConversationId || conversationId)
    }
  }

  async _writeReasoningChunk(messageId, content) {
    if (!content || !messageId) return
    // Reasoning content from LLM is typically short-to-medium length.
    // Use the same fake-typing treatment as text for visual consistency.
    if (this._onReasoningChunkDirect) {
      const parts = content.match(/\S+\s*/g) || [content]
      for (const part of parts) {
        if (this.abortController?.signal.aborted || this.isCompleted) break
        this._onReasoningChunkDirect(messageId, part)
        await new Promise(resolve => setTimeout(resolve, 24))
      }
    }
  }

  async _writeTextChunk(messageId, content) {
    if (!content || !messageId) return
    // For short content, write directly through buffer (RAF-timed)
    if (content.length <= 80 || this.isCompleted) {
      this.buffer.write(messageId, content)
      return
    }

    // For long content, bypass RAF and call onChunk directly
    // so content block is created before any subsequent tool events.
    // We still do the fake-typing animation for visual effect,
    // but the block is created synchronously.
    if (this._onChunkDirect) {
      const parts = content.match(/\S+\s*/g) || [content]
      for (const part of parts) {
        if (this.abortController?.signal.aborted || this.isCompleted) break
        this._onChunkDirect(messageId, part)
        await new Promise(resolve => setTimeout(resolve, 24))
      }
    } else {
      // Fallback: use buffer
      const parts = content.match(/\S+\s*/g) || [content]
      for (const part of parts) {
        if (this.abortController?.signal.aborted || this.isCompleted) break
        this.buffer.write(messageId, part)
        await new Promise(resolve => setTimeout(resolve, 24))
      }
    }
  }

  async _consumeStream(reader, callbacks, aiMessageId, conversationId) {
    const decoder = new TextDecoder()
    let buffer = ''
    if (conversationId) this.currentConversationId = conversationId

    while (true) {
      if (this.abortController?.signal.aborted) {
        reader.cancel()
        break
      }

      const { done, value } = await reader.read()
      if (done) {
        if (buffer.trim()) {
          await this._processBuffer(buffer, callbacks, aiMessageId, this.currentConversationId || conversationId)
        }
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        await this._processLine(line, callbacks, aiMessageId, this.currentConversationId || conversationId)
      }
    }

    reader.releaseLock()
  }

  /**
   * 提交前端工具执行结果，恢复 SSE 流
   * 返回 Response（body 为 SSE 流），需调用方消费
   */
  async submitToolResult(conversationId, toolCallId, output, status = 'completed', availableTools = []) {
    this.abortController = new AbortController()

    const body = {
      conversation_id: conversationId,
      tool_call_id: toolCallId,
      output: typeof output === 'string' ? output : JSON.stringify(output),
      status,
      available_tools: availableTools,
    }

    if (this.mock) {
      const chunks = []
      chunks.push(`data: ${JSON.stringify({ type: 'text', content: 'Tool executed successfully. ' })}\n\n`)
      chunks.push(`data: ${JSON.stringify({ type: 'done', conversation_id: conversationId })}\n\n`)
      return {
        ok: true,
        body: createMockStream(chunks, 60),
      }
    }

    const res = await fetch(`${this.baseURL}/v1/chat/tool-result`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
      signal: this.abortController.signal,
    })

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed, please check API Key configuration')
      }
      const data = await res.json().catch(() => ({}))
      if (res.status === 404 && data.error === 'checkpoint_expired') {
        throw new Error('checkpoint_expired')
      }
      throw new Error(`HTTP ${res.status}`)
    }

    return res
  }

  /**
   * 重新生成上一条 AI 回复
   */
  async regenerate(options, callbacks, aiMessageId) {
    if (!isValidConversationId(options.conversationId)) {
      if (callbacks.onError) callbacks.onError(new Error('Invalid conversation ID'))
      return
    }

    this.isCompleted = false
    this.buffer.destroy()
    this.buffer = new DoubleBufferQueue()
    if (callbacks.onChunk) {
      this.buffer.setCallback(callbacks.onChunk)
      this._onChunkDirect = callbacks.onChunk
    }
    if (callbacks.onReasoningChunk) {
      this._onReasoningChunkDirect = callbacks.onReasoningChunk
    }

    this.abortController = new AbortController()

    try {
      const res = await fetch(`${this.baseURL}/v1/chat/regenerate`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify({
          conversation_id: options.conversationId,
          available_tools: options.availableTools || [],
        }),
        credentials: 'include',
        signal: this.abortController.signal,
      })

      if (!res.ok) {
        if (res.status === 401) throw new Error('Authentication failed, please check API Key configuration')
        throw new Error(`HTTP ${res.status}`)
      }
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      await this._consumeStream(reader, callbacks, aiMessageId, options.conversationId)
      if (!this.isCompleted) {
        this.isCompleted = true
        if (callbacks.onDone) callbacks.onDone(options.conversationId)
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      this.isCompleted = true
      if (callbacks.onError) callbacks.onError(err)
    }
  }

  /**
   * 取消当前流式请求
   */
  abort() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
    this.buffer.destroy()
    this.isCompleted = true
  }

  /**
   * 服务端 abort（面板关闭时调用）
   */
  async serverAbort(conversationId) {
    const targetConversationId = conversationId || this.currentConversationId
    if (!isValidConversationId(targetConversationId)) return
    const res = await fetch(`${this.baseURL}/v1/chat/abort`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify({ conversation_id: targetConversationId }),
      credentials: 'include',
    })
    if (!res.ok && res.status !== 404) {
      throw new Error(`HTTP ${res.status}`)
    }
  }

  /**
   * 删除对话（清空数据库中的会话和消息）
   */
  async deleteConversation(conversationId) {
    if (!isValidConversationId(conversationId)) {
      return false
    }

    try {
      const res = await fetch(`${this.baseURL}/v1/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: this._getHeaders(),
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 404) return false
        throw new Error(`HTTP ${res.status}`)
      }
      return true
    } catch (err) {
      console.error('[AIClient] deleteConversation failed:', err)
      return false
    }
  }

  /**
   * 删除单条消息
   */
  async deleteMessage(conversationId, messageId) {
    if (!isValidConversationId(conversationId) || !messageId) {
      return false
    }

    try {
      const res = await fetch(`${this.baseURL}/v1/conversations/${conversationId}/messages/${messageId}`, {
        method: 'DELETE',
        headers: this._getHeaders(),
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 404) return false
        throw new Error(`HTTP ${res.status}`)
      }
      return true
    } catch (err) {
      console.error('[AIClient] deleteMessage failed:', err)
      throw err
    }
  }

  /**
   * 编辑用户消息并重新生成
   */
  async editMessage(conversationId, messageId, content, availableTools = []) {
    if (!isValidConversationId(conversationId) || !messageId || !content) {
      throw new Error('Invalid edit parameters')
    }

    this.isCompleted = false
    this.buffer.destroy()
    this.buffer = new DoubleBufferQueue()
    this.abortController = new AbortController()

    const body = {
      conversation_id: conversationId,
      message_id: messageId,
      content,
      available_tools: availableTools,
    }

    const res = await fetch(`${this.baseURL}/v1/chat/edit`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(body),
      credentials: 'include',
      signal: this.abortController.signal,
    })

    if (!res.ok) {
      if (res.status === 401) throw new Error('Authentication failed, please check API Key configuration')
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || `HTTP ${res.status}`)
    }
    if (!res.body) throw new Error('No response body')

    return res
  }

  /**
   * 提交消息反馈（点赞/点踩）
   */
  async submitFeedback(messageId, feedback) {
    const res = await fetch(`${this.baseURL}/v1/chat/feedback`, {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify({ message_id: messageId, feedback }),
      credentials: 'include',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || `HTTP ${res.status}`)
    }
    return res.json()
  }

  /**
   * 上传图片到对象存储，返回 { url, path }
   */
  async uploadImage(base64DataUrl, filename = 'image.jpg') {
    const res = await fetch(`${this.baseURL}/v1/upload/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({ image: base64DataUrl, filename }),
      credentials: 'include',
    })
    if (!res.ok) {
      if (res.status === 401) throw new Error('Authentication failed')
      throw new Error(`Upload failed: HTTP ${res.status}`)
    }
    const data = await res.json()
    return { url: data.url, path: data.path }
  }

  /**
   * 删除已上传的图片（通过 storage path）
   */
  async deleteImage(path) {
    if (!path) return false
    try {
      const res = await fetch(`${this.baseURL}/v1/upload/image?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
        headers: this._getHeaders(),
        credentials: 'include',
      })
      return res.ok
    } catch (err) {
      console.error('[AIClient] deleteImage failed:', err)
      return false
    }
  }

  /**
   * 轮询等待 AI 响应完成（刷新页面后检测正在处理的请求）
   */
  async pollForResponse(conversationId, { lastMessageTimestamp, intervalMs = 2000, maxWaitMs = 120000 } = {}) {
    if (!isValidConversationId(conversationId)) return null
    console.log('[pollForResponse] start, conv:', conversationId.slice(0,8), 'maxWait:', maxWaitMs, 'interval:', intervalMs)
    const startTime = Date.now()
    let pollCount = 0
    while (Date.now() - startTime < maxWaitMs) {
      pollCount++
      const t0 = Date.now()
      const messages = await this.fetchHistory(conversationId)
      const elapsed = Date.now() - t0
      console.log('[pollForResponse] poll #' + pollCount, '- took:', elapsed + 'ms', '- msgCount:', messages ? messages.length : 0)
      if (!messages || messages.length === 0) {
        await new Promise(resolve => setTimeout(resolve, intervalMs))
        continue
      }
      const last = messages[messages.length - 1]
      console.log('[pollForResponse] poll #' + pollCount, '- last:', last.role, '- hasContent:', !!last.content, '- hasToolCalls:', !!(last.tool_calls && last.tool_calls.length))
      // 最后一条变成 assistant → 响应已完成
      if (last.role === 'assistant' && last.content) {
        console.log('[pollForResponse] found assistant response after', pollCount, 'polls')
        return last
      }
      // 最后一条还是 user 但不是最近发的 → 超时/异常
      if (lastMessageTimestamp && Date.now() - lastMessageTimestamp > maxWaitMs) {
        console.log('[pollForResponse] timeout - last message too old')
        return null
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs))
    }
    console.log('[pollForResponse] timed out after', pollCount, 'polls')
    return null
  }

  /**
   * 获取会话列表
   */
  async fetchConversations({ limit = 20, offset = 0 } = {}) {
    try {
      const res = await fetch(`${this.baseURL}/v1/conversations?limit=${limit}&offset=${offset}`, {
        headers: this._getHeaders(),
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 401) throw new Error('Authentication failed')
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      return data.conversations || []
    } catch (err) {
      console.error('[AIClient] fetchConversations failed:', err)
      return []
    }
  }

  /**
   * 更新会话标题
   */
  async updateConversationTitle(conversationId, title) {
    if (!isValidConversationId(conversationId)) return false
    try {
      const res = await fetch(`${this.baseURL}/v1/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: this._getHeaders(),
        body: JSON.stringify({ title }),
        credentials: 'include',
      })
      if (!res.ok) {
        if (res.status === 401) throw new Error('Authentication failed')
        throw new Error(`HTTP ${res.status}`)
      }
      return true
    } catch (err) {
      console.error('[AIClient] updateConversationTitle failed:', err)
      return false
    }
  }

  /**
   * 拉取历史消息
   */
  async fetchHistory(conversationId) {
    if (!isValidConversationId(conversationId)) {
      return null
    }

    const t0 = Date.now()
    try {
      const res = await fetch(`${this.baseURL}/v1/conversations/${conversationId}/messages`, {
        headers: this._getHeaders(),
        credentials: 'include',
      })
      const elapsed = Date.now() - t0
      if (!res.ok) {
        console.log('[fetchHistory] HTTP ' + res.status, '(' + elapsed + 'ms)')
        if (res.status === 404) return null
        if (res.status === 503) return []
        throw new Error(`HTTP ${res.status}`)
      }
      const data = await res.json()
      console.log('[fetchHistory] ok,', data.messages?.length || 0, 'msgs,', elapsed + 'ms')
      return data.messages || []
    } catch (err) {
      const elapsed = Date.now() - t0
      console.error('[fetchHistory] failed,', elapsed + 'ms:', err)
      return []
    }
  }
}

export { DoubleBufferQueue }
