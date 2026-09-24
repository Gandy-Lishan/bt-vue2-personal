/**
 * AI Copilot — Vuex Module
 * 消息状态管理（单会话，扁平化 state）
 *
 * 设计：
 * - messages: 消息列表（含用户和助手）
 * - isLoading: 是否正在请求中
 * - isStreaming: 是否正在流式输出（UI 打字动画）
 * - conversationId: 当前会话 ID（localStorage 持久化）
 * - error: 最近一次错误
 */

function generateMessageId() {
  return 'msg_' + Math.random().toString(36).slice(2, 9) + '_' + Date.now()
}

function getStorageKey() {
  try {
    const userId = localStorage.getItem('role') || localStorage.getItem('devbt2Userid') || 'guest'
    return `ai-runtime:conv:${userId}`
  } catch {
    return 'ai-runtime:conv:guest'
  }
}

function isValidConversationId(conversationId) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId || '')
}

const state = {
  messages: [],
  isLoading: false,
  isStreaming: false,
  conversationId: (() => {
    try {
      const conversationId = localStorage.getItem(getStorageKey())
      if (isValidConversationId(conversationId)) return conversationId
      localStorage.removeItem(getStorageKey())
      return null
    } catch {
      return null
    }
  })(),
  error: null,
  availableTools: [], // 前端注册的工具名列表
  conversations: [], // 会话列表（按 updated_at 倒序）
  conversationsLoading: false,
  conversationsHasMore: true,
  abortedConversations: new Set(), // 用户主动 abort 的会话 ID
  minimizedWhileStreaming: false, // 用户最小化 copilot 时是否正在流式输出
}

const mutations = {
  SET_MESSAGES(state, messages) {
    state.messages = messages
  },
  ADD_MESSAGE(state, message) {
    state.messages.push(message)
  },
  UPDATE_MESSAGE(state, { id, updates }) {
    const idx = state.messages.findIndex(m => m.id === id)
    if (idx !== -1) {
      state.messages.splice(idx, 1, { ...state.messages[idx], ...updates })
    }
  },
  APPEND_TO_MESSAGE(state, { id, chunk }) {
    const idx = state.messages.findIndex(m => m.id === id)
    if (idx === -1) return
    const msg = state.messages[idx]
    const newContent = typeof msg.content === 'string'
      ? msg.content + chunk
      : chunk
    const blocks = (msg.blocks || []).slice()
    const lastBlock = blocks[blocks.length - 1]
    if (lastBlock && lastBlock.type === 'content') {
      blocks[blocks.length - 1] = { ...lastBlock, content: lastBlock.content + chunk }
    } else {
      blocks.push({ type: 'content', content: chunk })
    }
    state.messages.splice(idx, 1, { ...msg, content: newContent, blocks })
  },
  SET_MESSAGE_STATUS(state, { id, status, error }) {
    const idx = state.messages.findIndex(m => m.id === id)
    if (idx !== -1) {
      const msg = state.messages[idx]
      state.messages.splice(idx, 1, { ...msg, status, error: error !== undefined ? error : msg.error })
    }
  },
  DELETE_MESSAGE(state, id) {
    state.messages = state.messages.filter(m => m.id !== id)
  },
  UPDATE_MESSAGE_ID(state, { oldId, newId }) {
    const idx = state.messages.findIndex(m => m.id === oldId)
    if (idx !== -1) {
      state.messages.splice(idx, 1, { ...state.messages[idx], id: newId })
    }
  },
  EDIT_MESSAGE(state, { id, content }) {
    const idx = state.messages.findIndex(m => m.id === id)
    if (idx !== -1) {
      state.messages.splice(idx, 1, { ...state.messages[idx], content })
    }
  },
  DELETE_MESSAGES_FROM(state, id) {
    const idx = state.messages.findIndex(m => m.id === id)
    if (idx !== -1) {
      state.messages = state.messages.slice(0, idx)
    }
  },
  UPDATE_MESSAGE_RETRIEVE_STATUSES(state, { messageId, status }) {
    const idx = state.messages.findIndex(m => m.id === messageId)
    if (idx === -1) return
    const msg = state.messages[idx]
    const existing = (msg.retrieveStatuses || []).slice()
    const last = existing[existing.length - 1]
    const hasRound = status.round !== undefined && last && last.round === status.round
    if (last && last.type === status.type && hasRound) {
      existing[existing.length - 1] = status
    } else {
      existing.push(status)
    }
    state.messages.splice(idx, 1, { ...msg, retrieveStatuses: existing })
  },
  SET_LOADING(state, val) {
    state.isLoading = val
  },
  SET_STREAMING(state, val) {
    state.isStreaming = val
  },
  SET_CONVERSATION_ID(state, id) {
    const conversationId = isValidConversationId(id) ? id : null
    state.conversationId = conversationId
    try {
      if (conversationId) {
        localStorage.setItem(getStorageKey(), conversationId)
      } else {
        localStorage.removeItem(getStorageKey())
      }
    } catch {}
  },
  SET_ERROR(state, err) {
    state.error = err
  },
  CLEAR_MESSAGES(state) {
    state.messages = []
    state.conversationId = null
    try {
      localStorage.removeItem(getStorageKey())
    } catch {}
  },
  SET_AVAILABLE_TOOLS(state, tools) {
    state.availableTools = tools
  },
  SET_CONVERSATIONS(state, conversations) {
    state.conversations = conversations
  },
  APPEND_CONVERSATIONS(state, conversations) {
    state.conversations = [...state.conversations, ...conversations]
  },
  UPDATE_CONVERSATION(state, conversation) {
    const idx = state.conversations.findIndex(c => c.id === conversation.id)
    if (idx !== -1) {
      state.conversations.splice(idx, 1, { ...state.conversations[idx], ...conversation })
    } else {
      state.conversations.unshift(conversation)
    }
  },
  DELETE_CONVERSATION(state, conversationId) {
    state.conversations = state.conversations.filter(c => c.id !== conversationId)
  },
  SET_CONVERSATIONS_LOADING(state, val) {
    state.conversationsLoading = val
  },
  SET_CONVERSATIONS_HAS_MORE(state, val) {
    state.conversationsHasMore = val
  },
  PREPEND_CONVERSATION(state, conversation) {
    const idx = state.conversations.findIndex(c => c.id === conversation.id)
    if (idx !== -1) {
      state.conversations.splice(idx, 1)
    }
    state.conversations.unshift(conversation)
  },
  SET_CONVERSATION_ABORTED(state, conversationId) {
    state.abortedConversations.add(conversationId)
  },
  CLEAR_ABORTED_CONVERSATIONS(state) {
    state.abortedConversations.clear()
  },
  SET_MESSAGE_FEEDBACK(state, { messageId, feedback }) {
    const idx = state.messages.findIndex(m => m.id === messageId)
    if (idx !== -1) {
      state.messages.splice(idx, 1, { ...state.messages[idx], user_feedback: feedback })
    }
  },
  SET_MESSAGE_COMPLETED_AT(state, { id, completedAt }) {
    const idx = state.messages.findIndex(m => m.id === id)
    if (idx !== -1) {
      state.messages.splice(idx, 1, { ...state.messages[idx], completedAt })
    }
  },
  SET_MESSAGE_LATENCY(state, { messageId, totalLatencyMs }) {
    const idx = state.messages.findIndex(m => m.id === messageId)
    if (idx !== -1) {
      state.messages.splice(idx, 1, { ...state.messages[idx], totalLatencyMs })
    }
  },
  SET_MESSAGE_SOURCES(state, { messageId, sources }) {
    const idx = state.messages.findIndex(m => m.id === messageId)
    if (idx !== -1) {
      state.messages.splice(idx, 1, { ...state.messages[idx], sources })
    }
  },
  SET_MINIMIZED_WHILE_STREAMING(state, val) {
    state.minimizedWhileStreaming = val
  },
  SET_MESSAGE_REASONING_CHUNK(state, { messageId, chunk }) {
    const idx = state.messages.findIndex(m => m.id === messageId)
    if (idx === -1) return
    const msg = state.messages[idx]
    const chunks = (msg.reasoning_chunks || []).slice()
    chunks.push(chunk)
    state.messages.splice(idx, 1, { ...msg, reasoning_chunks: chunks })
  },
  UPDATE_MESSAGE_TOOL_CALL(state, { messageId, toolCall }) {
    const idx = state.messages.findIndex(m => m.id === messageId)
    if (idx === -1) return
    const msg = state.messages[idx]
    const existing = (msg.toolCalls || []).slice()
    const foundIdx = existing.findIndex(t => t.id === toolCall.id)
    if (foundIdx !== -1) {
      existing[foundIdx] = { ...existing[foundIdx], ...toolCall }
    } else {
      existing.push(toolCall)
    }
    // Update blocks for ordered rendering — update existing or push new
    const blocks = (msg.blocks || []).slice()
    const blockIdx = blocks.findIndex(b => b.type === 'tool' && b.id === toolCall.id)
    if (blockIdx !== -1) {
      blocks[blockIdx] = { ...blocks[blockIdx], toolCall }
    } else {
      blocks.push({ type: 'tool', id: toolCall.id, toolCall })
    }
    state.messages.splice(idx, 1, { ...msg, toolCalls: existing, blocks })
  },
  ADD_REASONING_BLOCK(state, { messageId, chunk }) {
    const idx = state.messages.findIndex(m => m.id === messageId)
    if (idx === -1) return
    const msg = state.messages[idx]
    const blocks = (msg.blocks || []).slice()
    blocks.push({ type: 'reasoning', seq: chunk.seq, content: chunk.content })
    state.messages.splice(idx, 1, { ...msg, blocks })
  },
  APPEND_REASONING_CHUNK(state, { messageId, chunk }) {
    const idx = state.messages.findIndex(m => m.id === messageId)
    if (idx === -1) return
    const msg = state.messages[idx]
    const blocks = (msg.blocks || []).slice()
    const lastBlock = blocks[blocks.length - 1]
    if (lastBlock && lastBlock.type === 'reasoning') {
      blocks[blocks.length - 1] = { ...lastBlock, content: lastBlock.content + chunk }
    } else {
      blocks.push({ type: 'reasoning', content: chunk })
    }
    state.messages.splice(idx, 1, { ...msg, blocks })
  },
}

const actions = {
  loadConversations({ commit, state }, { limit = 20, offset = 0, append = false } = {}) {
    // Return a promise so callers can await
    return new Promise((resolve) => {
      // We'll import AIClient dynamically or rely on useAICopilot composable
      // For now, this action is a no-op placeholder; the composable handles the actual fetch
      // because AIClient is a singleton there. This keeps store framework-agnostic.
      resolve(state.conversations)
    })
  },
  addUserMessage({ commit }, content) {
    const msg = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'done',
    }
    commit('ADD_MESSAGE', msg)
    return msg
  },
  addAssistantPlaceholder({ commit }) {
    const msg = {
      id: generateMessageId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      startedAt: Date.now(),
      status: 'pending',
      toolCalls: [],
      retrieveStatuses: [],
      blocks: [],
    }
    commit('ADD_MESSAGE', msg)
    return msg
  },
  setStreamingStatus({ commit }, { id, status, error }) {
    commit('SET_MESSAGE_STATUS', { id, status, error })
    commit('SET_STREAMING', status === 'streaming')
  },
  clearConversation({ commit }) {
    commit('CLEAR_MESSAGES')
    commit('SET_ERROR', null)
    commit('CLEAR_ABORTED_CONVERSATIONS')
  },
}

const getters = {
  lastUserMessage: state => {
    for (let i = state.messages.length - 1; i >= 0; i--) {
      if (state.messages[i].role === 'user') return state.messages[i]
    }
    return null
  },
  lastAssistantMessage: state => {
    for (let i = state.messages.length - 1; i >= 0; i--) {
      if (state.messages[i].role === 'assistant') return state.messages[i]
    }
    return null
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
