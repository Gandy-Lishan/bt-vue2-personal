/**
 * useAICopilot — Vue 2 Composable
 * 工具注册 + 续传循环 + 消息发送
 *
 * 使用方式（在组件 methods / created 中）：
 *   const copilot = useAICopilot(this.$store)
 *   copilot.send('Hello')
 */

import { AIClient } from '@/services/AIClient'
import store from '@/store'

let client = null

function getClient() {
  if (!client) {
    // 开发环境传入空字符串，走 devServer proxy（相对路径请求）
    // 生产环境不传 baseURL，AIClient 使用默认值 agent.sentimentrader.com
    const devBaseURL = process.env.NODE_ENV === 'development' ? '' : undefined
    client = new AIClient({ baseURL: devBaseURL })
  }
  return client
}

// 项目专属工具注册表
const localTools = {}

function isValidConversationId(conversationId) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId || '')
}

function parseMessageContent(content) {
  if (content == null) return ''
  if (typeof content !== 'string') return content
  const trimmed = content.trim()
  if (!trimmed.startsWith('[')) return content
  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) return parsed
  } catch {}
  return content
}

export function useAICopilot() {
  const aiClient = getClient()

  // AbortController for in-flight fetchHistory requests.
  // Switched/deleted conversations should cancel the pending load so stale
  // messages are not written to the store.
  let historyAbortController = null

  /**
   * 注册前端工具
   * @param {string} name — 工具名（与 available_tools 对应）
   * @param {Function} handler — 异步/同步执行函数
   */
  function registerTool(name, handler) {
    localTools[name] = handler
    // 同步更新 store 中的可用工具列表
    const current = store.state.aiCopilot.availableTools || []
    if (!current.includes(name)) {
      store.commit('aiCopilot/SET_AVAILABLE_TOOLS', [...current, name])
    }
  }

  /**
   * 处理前端工具调用（send / regenerate 复用）
   * 提交结果后消费 resume SSE 流
   */
  async function handleToolCall(toolCall, messageId, callbacks) {
    const conversationId = store.state.aiCopilot.conversationId
    const availableTools = store.state.aiCopilot.availableTools

    // 更新消息上的 toolCall 状态为 running
    store.commit('aiCopilot/UPDATE_MESSAGE_TOOL_CALL', {
      messageId,
      toolCall: { ...toolCall, status: 'running' },
    })

    const handler = localTools[toolCall.name]
    if (!handler) {
      // Server-side tool: keep status as 'running' — the tool_result SSE event
      // will update it to completed/error when the backend finishes execution.
      // Don't preemptively set completed here, or isReasoningOpen will think
      // this reasoning round is already in the past.
      return
    }

    try {
      const result = await handler(toolCall.input)
      const res = await aiClient.submitToolResult(
        conversationId,
        toolCall.id,
        result,
        'completed',
        availableTools
      )
      store.commit('aiCopilot/UPDATE_MESSAGE_TOOL_CALL', {
        messageId,
        toolCall: { ...toolCall, status: 'completed', output: JSON.stringify(result) },
      })
      // 消费 resume SSE
      if (res.body) {
        const reader = res.body.getReader()
        await aiClient._consumeStream(reader, callbacks, messageId, conversationId)
      }
    } catch (err) {
      try {
        const res = await aiClient.submitToolResult(
          conversationId,
          toolCall.id,
          String(err),
          'error',
          availableTools
        )
        if (res.body) {
          const reader = res.body.getReader()
          await aiClient._consumeStream(reader, callbacks, messageId, conversationId)
        }
      } catch (submitErr) {
        if (callbacks.onError) callbacks.onError(submitErr)
      }
      store.commit('aiCopilot/UPDATE_MESSAGE_TOOL_CALL', {
        messageId,
        toolCall: { ...toolCall, status: 'error', output: String(err) },
      })
    }
  }

  /**
   * 发送消息（完整续传循环）
   */
  async function send(content, options = {}) {
    const conversationId = store.state.aiCopilot.conversationId
    const availableTools = store.state.aiCopilot.availableTools

    // 1. 添加用户消息 + AI 占位
    const userMsg = store.dispatch('aiCopilot/addUserMessage', content)
    const aiMsg = store.dispatch('aiCopilot/addAssistantPlaceholder')
    const [userMessage, assistantMessage] = await Promise.all([userMsg, aiMsg])

    store.commit('aiCopilot/SET_LOADING', true)
    store.commit('aiCopilot/SET_STREAMING', false)
    store.commit('aiCopilot/SET_ERROR', null)
    store.commit('aiCopilot/SET_RATE_LIMIT_RETRY_AFTER', null)

    // 2. 启动 SSE
    const callbacks = {
      onStart: (newConversationId, userMessageId) => {
        if (newConversationId && newConversationId !== conversationId && isValidConversationId(newConversationId)) {
          store.commit('aiCopilot/SET_CONVERSATION_ID', newConversationId)
          // Optimistically prepend new conversation to the list so sidebar/history reflects it immediately.
          // Title is always "New Chat" — matches backend's create_conversation(title="New Chat").
          // Real title is generated asynchronously after the loop completes.
          store.commit('aiCopilot/PREPEND_CONVERSATION', {
            id: newConversationId,
            title: 'New Chat',
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          })
        }
        if (userMessageId && userMessage && userMessage.id !== userMessageId) {
          store.commit('aiCopilot/UPDATE_MESSAGE_ID', { oldId: userMessage.id, newId: userMessageId })
        }
      },

      onChunk: (messageId, chunkContent) => {
        if (!store.state.aiCopilot.isStreaming) {
          store.commit('aiCopilot/SET_STREAMING', true)
        }
        store.commit('aiCopilot/APPEND_TO_MESSAGE', {
          id: messageId,
          chunk: chunkContent,
        })
      },

      onToolCall: async (toolCall, messageId) => {
        store.commit('aiCopilot/SET_STREAMING', false)
        await handleToolCall(toolCall, messageId, callbacks)
      },

      onToolResult: (toolCall, messageId) => {
        store.commit('aiCopilot/UPDATE_MESSAGE_TOOL_CALL', {
          messageId,
          toolCall,
        })
      },

      onRetrieveStatus: (status, messageId) => {
        store.commit('aiCopilot/UPDATE_MESSAGE_RETRIEVE_STATUSES', {
          messageId,
          status,
        })
      },

      onAbort: () => {
        store.commit('aiCopilot/SET_STREAMING', false)
        store.commit('aiCopilot/SET_LOADING', false)
        store.commit('aiCopilot/SET_CONVERSATION_ABORTED', conversationId)
      },

      onReasoningChunk: (messageId, chunkContent) => {
        store.commit('aiCopilot/APPEND_REASONING_CHUNK', {
          messageId,
          chunk: chunkContent,
        })
      },

      onReasoning: (chunk, messageId) => {
        store.commit('aiCopilot/SET_MESSAGE_REASONING_CHUNK', { messageId, chunk })
        store.commit('aiCopilot/ADD_REASONING_BLOCK', { messageId, chunk })
      },

      onUIElement: (chunk, messageId) => {
        store.commit('aiCopilot/ADD_UI_ELEMENT_BLOCK', { messageId, block: chunk })
      },

      onDone: (newConversationId, assistantMessageId, sources, totalLatencyMs) => {
        store.commit('aiCopilot/SET_LOADING', false)
        store.commit('aiCopilot/SET_STREAMING', false)
        if (assistantMessageId && assistantMessage && assistantMessage.id !== assistantMessageId) {
          store.commit('aiCopilot/UPDATE_MESSAGE_ID', { oldId: assistantMessage.id, newId: assistantMessageId })
        }
        const targetId = assistantMessageId || assistantMessage.id
        store.commit('aiCopilot/SET_MESSAGE_STATUS', {
          id: targetId,
          status: 'done',
        })
        if (totalLatencyMs) {
          store.commit('aiCopilot/SET_MESSAGE_LATENCY', { messageId: targetId, totalLatencyMs })
        }
        // The backend now always returns total_latency_ms (real processing time).
        // Use startedAt + totalLatencyMs so "Worked for X" reflects actual work,
        // not wall-clock time spent while the tab was in the background.
        const startedAt = assistantMessage?.startedAt || Date.now()
        const completedAt = startedAt + (totalLatencyMs || 0)
        store.commit('aiCopilot/SET_MESSAGE_COMPLETED_AT', { id: targetId, completedAt })
        if (sources && sources.length > 0) {
          store.commit('aiCopilot/SET_MESSAGE_SOURCES', {
            messageId: targetId,
            sources,
          })
        }
        if (newConversationId && newConversationId !== conversationId && isValidConversationId(newConversationId)) {
          store.commit('aiCopilot/SET_CONVERSATION_ID', newConversationId)
        }
        // Refresh conversation list after a short delay so the async title
        // generation on the backend has time to write the new title to DB.
        if (newConversationId || !conversationId) {
          setTimeout(async () => {
            try {
              const conversations = await aiClient.fetchConversations({ limit: 20, offset: 0 })
              store.commit('aiCopilot/SET_CONVERSATIONS', conversations)
              store.commit('aiCopilot/SET_CONVERSATIONS_HAS_MORE', conversations.length >= 20)
            } catch {
              // Silent failure — title refresh is best-effort
            }
          }, 800)
        }
      },

      onError: (error) => {
        store.commit('aiCopilot/SET_LOADING', false)
        store.commit('aiCopilot/SET_STREAMING', false)
        if (error.message === 'conversation_not_found') {
          store.commit('aiCopilot/SET_CONVERSATION_ID', null)
        }
        // Detect call_budget_exceeded 429 from route-layer guardrail
        if (error.retryAfter != null) {
          store.commit('aiCopilot/SET_RATE_LIMIT_RETRY_AFTER', error.retryAfter)
          // Don't set message error status — the toast replaces the red error
          // Remove the optimistic user + assistant messages since the request never reached the server
          store.commit('aiCopilot/DELETE_MESSAGE', assistantMessage.id)
          const lastUser = store.getters['aiCopilot/lastUserMessage']
          if (lastUser && lastUser.timestamp >= Date.now() - 5000) {
            store.commit('aiCopilot/DELETE_MESSAGE', lastUser.id)
          }
          return
        }
        store.commit('aiCopilot/SET_MESSAGE_STATUS', {
          id: assistantMessage.id,
          status: 'error',
          error: error.message,
        })
        store.commit('aiCopilot/SET_ERROR', error.message)
      },
    }

    await aiClient.send(
      {
        message: content,
        conversationId,
        history: options.history,
        availableTools,
        context: options.context,
      },
      callbacks,
      assistantMessage.id
    )

    return assistantMessage.id
  }

  /**
   * 取消当前流
   */
  function abort() {
    const conversationId = store.state.aiCopilot.conversationId || aiClient.currentConversationId
    aiClient.abort()
    if (conversationId) {
      aiClient.serverAbort(conversationId).catch(error => {
        console.warn('[AI Copilot] server abort failed:', error)
      })
    }
    store.commit('aiCopilot/SET_LOADING', false)
    store.commit('aiCopilot/SET_STREAMING', false)
    // Mark this conversation as intentionally aborted so loadHistory won't regenerate
    store.commit('aiCopilot/SET_CONVERSATION_ABORTED', conversationId)
  }

  /**
   * 重新生成最后一条 AI 回复
   */
  async function regenerate() {
    const conversationId = store.state.aiCopilot.conversationId
    if (!conversationId) {
      console.error('[regenerate] No conversation ID')
      return
    }

    // 删除最后一条 AI 消息
    const lastAssistant = store.getters['aiCopilot/lastAssistantMessage']
    if (lastAssistant) {
      store.commit('aiCopilot/DELETE_MESSAGE', lastAssistant.id)
    }

    // 添加新的 AI 占位
    const aiMsg = await store.dispatch('aiCopilot/addAssistantPlaceholder')
    store.commit('aiCopilot/SET_LOADING', true)
    store.commit('aiCopilot/SET_STREAMING', false)

    const callbacks = {
      onStart: (newConversationId, userMessageId) => {
        if (newConversationId && newConversationId !== conversationId && isValidConversationId(newConversationId)) {
          store.commit('aiCopilot/SET_CONVERSATION_ID', newConversationId)
        }
      },

      onChunk: (messageId, chunkContent) => {
        if (!store.state.aiCopilot.isStreaming) {
          store.commit('aiCopilot/SET_STREAMING', true)
        }
        store.commit('aiCopilot/APPEND_TO_MESSAGE', {
          id: messageId,
          chunk: chunkContent,
        })
      },
      onToolCall: async (toolCall, messageId) => {
        store.commit('aiCopilot/SET_STREAMING', false)
        await handleToolCall(toolCall, messageId, callbacks)
      },
      onToolResult: (toolCall, messageId) => {
        store.commit('aiCopilot/UPDATE_MESSAGE_TOOL_CALL', {
          messageId,
          toolCall,
        })
      },
      onRetrieveStatus: (status, messageId) => {
        store.commit('aiCopilot/UPDATE_MESSAGE_RETRIEVE_STATUSES', {
          messageId,
          status,
        })
      },
      onAbort: () => {
        store.commit('aiCopilot/SET_STREAMING', false)
        store.commit('aiCopilot/SET_LOADING', false)
        store.commit('aiCopilot/SET_CONVERSATION_ABORTED', aiClient.currentConversationId)
      },
      onReasoning: (chunk, messageId) => {
        store.commit('aiCopilot/SET_MESSAGE_REASONING_CHUNK', { messageId, chunk })
        store.commit('aiCopilot/ADD_REASONING_BLOCK', { messageId, chunk })
      },
      onUIElement: (chunk, messageId) => {
        store.commit('aiCopilot/ADD_UI_ELEMENT_BLOCK', { messageId, block: chunk })
      },
      onDone: (newConversationId, assistantMessageId, sources, totalLatencyMs) => {
        store.commit('aiCopilot/SET_LOADING', false)
        store.commit('aiCopilot/SET_STREAMING', false)
        if (assistantMessageId && aiMsg && aiMsg.id !== assistantMessageId) {
          store.commit('aiCopilot/UPDATE_MESSAGE_ID', { oldId: aiMsg.id, newId: assistantMessageId })
        }
        const targetId = assistantMessageId || aiMsg.id
        store.commit('aiCopilot/SET_MESSAGE_STATUS', {
          id: targetId,
          status: 'done',
        })
        if (totalLatencyMs) {
          store.commit('aiCopilot/SET_MESSAGE_LATENCY', { messageId: targetId, totalLatencyMs })
        }
        const startedAt = aiMsg?.startedAt || Date.now()
        const completedAt = startedAt + (totalLatencyMs || 0)
        store.commit('aiCopilot/SET_MESSAGE_COMPLETED_AT', { id: targetId, completedAt })
        if (sources && sources.length > 0) {
          store.commit('aiCopilot/SET_MESSAGE_SOURCES', {
            messageId: targetId,
            sources,
          })
        }
      },
      onError: (error) => {
        store.commit('aiCopilot/SET_LOADING', false)
        store.commit('aiCopilot/SET_STREAMING', false)
        store.commit('aiCopilot/SET_MESSAGE_STATUS', {
          id: aiMsg.id,
          status: 'error',
          error: error.message,
        })
      },
    }

    const availableTools = store.state.aiCopilot.availableTools
    await aiClient.regenerate(
      { conversationId, availableTools },
      callbacks,
      aiMsg.id
    )
  }

  /**
   * 加载会话列表
   */
  async function loadConversations({ limit = 20, offset = 0, append = false } = {}) {
    store.commit('aiCopilot/SET_CONVERSATIONS_LOADING', true)
    try {
      const conversations = await aiClient.fetchConversations({ limit, offset })
      if (append) {
        store.commit('aiCopilot/APPEND_CONVERSATIONS', conversations)
      } else {
        store.commit('aiCopilot/SET_CONVERSATIONS', conversations)
      }
      store.commit('aiCopilot/SET_CONVERSATIONS_HAS_MORE', conversations.length >= limit)
      return conversations
    } catch (err) {
      console.error('[useAICopilot] loadConversations failed:', err)
      return []
    } finally {
      store.commit('aiCopilot/SET_CONVERSATIONS_LOADING', false)
    }
  }

  /**
   * 切换会话
   */
  async function switchConversation(conversationId) {
    if (!isValidConversationId(conversationId)) return false
    if (conversationId === store.state.aiCopilot.conversationId) {
      return true
    }

    // Abort any active stream before switching conversations to prevent
    // a race where background stream callbacks write to a message object
    // that gets replaced by SET_MESSAGES from loadHistory().
    if (aiClient.abortController && !aiClient.isCompleted) {
      abort()
    }

    // Cancel any pending history fetch for the previous conversation so it
    // cannot overwrite messages after we switch.
    if (historyAbortController) {
      historyAbortController.abort()
      historyAbortController = null
    }

    // Always reset loading/streaming state when switching conversations
    store.commit('aiCopilot/SET_LOADING', false)
    store.commit('aiCopilot/SET_STREAMING', false)

    store.commit('aiCopilot/SET_CONVERSATION_ID', conversationId)
    store.commit('aiCopilot/SET_ERROR', null)
    return loadHistory()
  }

  /**
   * 新建会话
   */
  async function createNewConversation() {
    store.commit('aiCopilot/SET_CONVERSATION_ID', null)
    store.commit('aiCopilot/CLEAR_MESSAGES')
    store.commit('aiCopilot/SET_ERROR', null)
    store.commit('aiCopilot/CLEAR_ABORTED_CONVERSATIONS')
    return true
  }

  /**
   * 删除会话
   */
  async function deleteConversation(conversationId) {
    if (!isValidConversationId(conversationId)) return false

    // Cancel any pending history fetch for this conversation before deleting.
    // Otherwise the stale response could arrive after deletion and render
    // messages for a conversation that no longer exists.
    if (store.state.aiCopilot.conversationId === conversationId && historyAbortController) {
      historyAbortController.abort()
      historyAbortController = null
    }

    const deleted = await aiClient.deleteConversation(conversationId)
    if (deleted) {
      store.commit('aiCopilot/DELETE_CONVERSATION', conversationId)
      // If we deleted the current conversation, clear it
      if (store.state.aiCopilot.conversationId === conversationId) {
        store.commit('aiCopilot/SET_CONVERSATION_ID', null)
        store.commit('aiCopilot/CLEAR_MESSAGES')
      }
    }
    return deleted
  }

  /**
   * 批量删除会话
   */
  async function deleteConversations(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { deleted: [], failed: ids || [] }
    }

    // Cancel any pending history fetch if the current conversation is being deleted.
    const currentId = store.state.aiCopilot.conversationId
    if (currentId && ids.includes(currentId) && historyAbortController) {
      historyAbortController.abort()
      historyAbortController = null
    }

    const result = await aiClient.deleteConversations(ids)
    if (result.deleted && result.deleted.length) {
      for (const id of result.deleted) {
        store.commit('aiCopilot/DELETE_CONVERSATION', id)
      }
      const currentId = store.state.aiCopilot.conversationId
      if (currentId && result.deleted.includes(currentId)) {
        store.commit('aiCopilot/SET_CONVERSATION_ID', null)
        store.commit('aiCopilot/CLEAR_MESSAGES')
      }
    }
    return result
  }

  /**
   * 获取当前用户会话总数
   */
  async function fetchConversationCount() {
    return aiClient.fetchConversationCount()
  }

  /**
   * 加载历史消息
   */
  async function loadHistory() {
    const conversationId = store.state.aiCopilot.conversationId
    if (!conversationId) return

    console.log('[loadHistory] conversationId:', conversationId, 'existing messages:', store.state.aiCopilot.messages.length)

    // Cancel any previous history fetch and create a new controller for this one.
    if (historyAbortController) {
      historyAbortController.abort()
    }
    historyAbortController = new AbortController()
    const controller = historyAbortController

    try {
      const messages = await aiClient.fetchHistory(conversationId, controller.signal)
      if (messages === null) {
        console.log('[loadHistory] no conversation found, clearing')
        store.dispatch('aiCopilot/clearConversation')
        return
      }
      console.log('[loadHistory] fetched', messages.length, 'messages')

      // 第一轮：构建 normalized 消息（不含 startedAt/completedAt）
      const normalized = messages.map(m => {
        // MySQL returns datetime without timezone (UTC). Append 'Z' for correct parsing.
        const createdAt = m.created_at
          ? (m.created_at.endsWith('Z') ? m.created_at : m.created_at + 'Z')
          : null
        const timestamp = createdAt ? new Date(createdAt).getTime() : Date.now()
        const toolCalls = m.tool_calls || []
        const reasoningChunks = m.reasoning_content
          ? [{ id: 'hist_0', content: m.reasoning_content, seq: 0 }]
          : []

        // Use stored blocks if available (preserves exact interleaved order from SSE stream)
        let blocks = m.blocks || []
        if (blocks.length === 0) {
          // Fallback: reconstruct from aggregated data for old messages
          if (m.reasoning_content) {
            blocks.push({ type: 'reasoning', seq: 0, content: m.reasoning_content })
          }
          for (const tc of toolCalls) {
            blocks.push({ type: 'tool', id: tc.id, toolCall: tc })
          }
          const contentStr = typeof m.content === 'string' ? m.content : ''
          if (contentStr) {
            blocks.push({ type: 'content', content: contentStr })
          }
        } else if (m.reasoning_content && !blocks.some(b => b.type === 'reasoning')) {
          // Blocks exist but no reasoning — patch it in from aggregated field
          blocks = [{ type: 'reasoning', seq: 0, content: m.reasoning_content }, ...blocks]
        }

        return {
          ...m,
          id: m.id || ('msg_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now()),
          timestamp,
          status: 'done',
          content: parseMessageContent(m.content),
          toolCalls,
          reasoning_chunks: reasoningChunks,
          blocks,
        }
      })

      // 第二轮：用 DB 的 total_latency_ms 计算 startedAt/completedAt
      // assistant 消息：startedAt = timestamp - total_latency_ms, completedAt = timestamp
      // 这样 "Worked for" 显示的是实际处理耗时，而不是消息间的时间间隔
      for (let i = 0; i < normalized.length; i++) {
        const msg = normalized[i]
        if (msg.role === 'assistant') {
          const latency = msg.total_latency_ms || 0
          msg.startedAt = msg.timestamp - latency
          msg.completedAt = msg.timestamp
        } else if (msg.role === 'user') {
          msg.startedAt = msg.timestamp
          msg.completedAt = msg.timestamp
        }
      }

      // Guard against stale responses: the conversation may have been switched
      // or deleted while the fetch was in flight. If it is no longer the
      // current conversation, do not render its messages.
      // Note: we intentionally do NOT check whether the conversation still
      // exists in the conversations list — on page refresh loadConversations
      // runs concurrently and the list may not be populated yet.
      if (store.state.aiCopilot.conversationId === conversationId) {
        store.commit('aiCopilot/SET_MESSAGES', normalized)
      } else {
        console.log('[loadHistory] conversation switched while loading, discarding stale messages')
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('[loadHistory] aborted')
        return
      }
      console.error('[loadHistory] failed:', err)
    }
  }

  /**
   * 清空对话（先删数据库，再清本地）
   */
  async function clearConversation() {
    const conversationId = store.state.aiCopilot.conversationId
    if (aiClient.abortController && !aiClient.isCompleted) {
      abort()
    }
    if (conversationId) {
      await aiClient.deleteConversation(conversationId)
      store.commit('aiCopilot/DELETE_CONVERSATION', conversationId)
    }
    store.dispatch('aiCopilot/clearConversation')
  }

  /**
   * 提交消息反馈（点赞/点踩）
   */
  async function submitFeedback(messageId, feedback) {
    try {
      const result = await aiClient.submitFeedback(messageId, feedback)
      // Update local message state
      store.commit('aiCopilot/SET_MESSAGE_FEEDBACK', { messageId, feedback })
      return result
    } catch (err) {
      console.error('[submitFeedback] error:', err)
      return false
    }
  }

  async function deleteMessage(message) {
    const conversationId = store.state.aiCopilot.conversationId
    if (!message || !message.id) return false
    if (message.status === 'pending' || message.status === 'streaming') return false

    if (!conversationId) {
      store.commit('aiCopilot/DELETE_MESSAGE', message.id)
      return true
    }

    try {
      const deleted = await aiClient.deleteMessage(conversationId, message.id)
      if (deleted) {
        store.commit('aiCopilot/DELETE_MESSAGE', message.id)
      }
      return deleted
    } catch (err) {
      store.commit('aiCopilot/SET_ERROR', err.message)
      return false
    }
  }

  async function editMessage(message, newContent) {
    const conversationId = store.state.aiCopilot.conversationId
    if (!conversationId || !message || !message.id || !newContent) return false

    // Find message index
    const messages = store.state.aiCopilot.messages
    const idx = messages.findIndex(m => m.id === message.id)
    if (idx === -1) return false

    // Delete all messages from this index onward (excluding the edited one)
    const messagesAfter = messages.slice(idx + 1)
    for (const m of messagesAfter) {
      store.commit('aiCopilot/DELETE_MESSAGE', m.id)
    }

    // Update the edited message content
    store.commit('aiCopilot/EDIT_MESSAGE', { id: message.id, content: newContent })

    // Add new assistant placeholder
    const aiMsg = await store.dispatch('aiCopilot/addAssistantPlaceholder')

    store.commit('aiCopilot/SET_LOADING', true)
    store.commit('aiCopilot/SET_STREAMING', false)
    store.commit('aiCopilot/SET_ERROR', null)

    const availableTools = store.state.aiCopilot.availableTools

    try {
      const res = await aiClient.editMessage(conversationId, message.id, newContent, availableTools)
      if (res.body) {
        const reader = res.body.getReader()
        await aiClient._consumeStream(reader, {
          onStart: (newConversationId, userMessageId) => {
            if (newConversationId && newConversationId !== conversationId && isValidConversationId(newConversationId)) {
              store.commit('aiCopilot/SET_CONVERSATION_ID', newConversationId)
            }
          },
          onChunk: (messageId, chunkContent) => {
            if (!store.state.aiCopilot.isStreaming) {
              store.commit('aiCopilot/SET_STREAMING', true)
            }
            store.commit('aiCopilot/APPEND_TO_MESSAGE', { id: messageId, chunk: chunkContent })
          },
          onToolCall: async (toolCall, messageId) => {
            store.commit('aiCopilot/SET_STREAMING', false)
            await handleToolCall(toolCall, messageId, {
              onStart: (cid) => { if (cid && cid !== conversationId && isValidConversationId(cid)) store.commit('aiCopilot/SET_CONVERSATION_ID', cid) },
              onChunk: (mid, chunk) => {
                if (!store.state.aiCopilot.isStreaming) store.commit('aiCopilot/SET_STREAMING', true)
                store.commit('aiCopilot/APPEND_TO_MESSAGE', { id: mid, chunk })
              },
              onToolCall: null,
              onToolResult: (tc, mid) => { store.commit('aiCopilot/UPDATE_MESSAGE_TOOL_CALL', { messageId: mid, toolCall: tc }) },
              onRetrieveStatus: (status, mid) => { store.commit('aiCopilot/UPDATE_MESSAGE_RETRIEVE_STATUSES', { messageId: mid, status }) },
              onReasoning: (chunk, mid) => { store.commit('aiCopilot/SET_MESSAGE_REASONING_CHUNK', { messageId: mid, chunk }) },
              onDone: () => {},
              onError: () => {},
            })
          },
          onToolResult: (toolCall, messageId) => {
            store.commit('aiCopilot/UPDATE_MESSAGE_TOOL_CALL', { messageId, toolCall })
          },
          onRetrieveStatus: (status, messageId) => {
            store.commit('aiCopilot/UPDATE_MESSAGE_RETRIEVE_STATUSES', { messageId, status })
          },
          onReasoning: (chunk, messageId) => {
            store.commit('aiCopilot/SET_MESSAGE_REASONING_CHUNK', { messageId, chunk })
          },
          onUIElement: (chunk, messageId) => {
            store.commit('aiCopilot/ADD_UI_ELEMENT_BLOCK', { messageId, block: chunk })
          },
          onDone: (newConversationId, assistantMessageId, sources, totalLatencyMs) => {
            store.commit('aiCopilot/SET_LOADING', false)
            store.commit('aiCopilot/SET_STREAMING', false)
            if (assistantMessageId && aiMsg && aiMsg.id !== assistantMessageId) {
              store.commit('aiCopilot/UPDATE_MESSAGE_ID', { oldId: aiMsg.id, newId: assistantMessageId })
            }
            const targetId = assistantMessageId || aiMsg.id
            store.commit('aiCopilot/SET_MESSAGE_STATUS', { id: targetId, status: 'done' })
            if (totalLatencyMs) {
              store.commit('aiCopilot/SET_MESSAGE_LATENCY', { messageId: targetId, totalLatencyMs })
            }
            // Avoid inflating duration with background-tab wall-clock time.
            const startedAt = aiMsg?.startedAt || Date.now()
            const completedAt = totalLatencyMs ? startedAt + totalLatencyMs : Date.now()
            store.commit('aiCopilot/SET_MESSAGE_COMPLETED_AT', { id: targetId, completedAt })
            if (sources && sources.length > 0) {
              store.commit('aiCopilot/SET_MESSAGE_SOURCES', {
                messageId: targetId,
                sources,
              })
            }
            if (newConversationId && newConversationId !== conversationId && isValidConversationId(newConversationId)) {
              store.commit('aiCopilot/SET_CONVERSATION_ID', newConversationId)
            }
          },
          onError: (error) => {
            store.commit('aiCopilot/SET_LOADING', false)
            store.commit('aiCopilot/SET_STREAMING', false)
            store.commit('aiCopilot/SET_MESSAGE_STATUS', { id: aiMsg.id, status: 'error', error: error.message })
            store.commit('aiCopilot/SET_ERROR', error.message)
          },
        }, aiMsg.id, conversationId)
      }
      return true
    } catch (err) {
      store.commit('aiCopilot/SET_LOADING', false)
      store.commit('aiCopilot/SET_STREAMING', false)
      store.commit('aiCopilot/SET_MESSAGE_STATUS', { id: aiMsg.id, status: 'error', error: err.message })
      store.commit('aiCopilot/SET_ERROR', err.message)
      return false
    }
  }

  /**
   * 搜索会话内容
   */
  async function searchConversations(query) {
    return aiClient.searchConversations(query)
  }

  return {
    client: aiClient,
    send,
    abort,
    regenerate,
    loadHistory,
    clearConversation,
    deleteMessage,
    editMessage,
    submitFeedback,
    registerTool,
    loadConversations,
    switchConversation,
    createNewConversation,
    deleteConversation,
    deleteConversations,
    fetchConversationCount,
    searchConversations,
  }
}

// 单例导出，方便非组件代码直接 import 使用
export const aiCopilot = useAICopilot()
