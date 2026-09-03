<template>
  <div class="copilot-page">
    <!-- Sidebar -->
    <div :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-inner">
        <!-- Top: Search + New Chat -->
        <div class="sidebar-top">
          <div class="search-placeholder">
            <i class="fa fa-search" aria-hidden="true"></i>
            <span>Search...</span>
          </div>
          <button class="new-chat-btn" @click="handleNewChat">
            <i class="fa fa-plus" aria-hidden="true"></i>
            <span>New chat</span>
          </button>
        </div>

        <!-- Conversation List -->
        <div ref="listRef" class="sidebar-list" @scroll="handleScroll">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            :class="['sidebar-item', { active: conv.id === currentConversationId }]"
            @click="handleSelectConversation(conv.id)"
            @mouseenter="hoveredId = conv.id"
            @mouseleave="hoveredId = null"
          >
            <div class="item-icon">
              <i class="fa fa-align-left" aria-hidden="true"></i>
            </div>
            <div class="item-content">
              <div class="item-title">{{ conv.title || 'New Chat' }}</div>
              <div class="item-time">{{ formatTime(conv.updated_at || conv.created_at) }}</div>
            </div>
            <el-popconfirm
              v-show="hoveredId === conv.id"
              title="Delete this conversation?"
              confirm-button-text="Delete"
              cancel-button-text="Cancel"
              icon="el-icon-warning"
              icon-color="#ef4444"
              @confirm="handleDeleteConversation(conv.id)"
            >
              <button slot="reference" class="item-delete" title="Delete">
                <i class="fa fa-trash-o" aria-hidden="true"></i>
              </button>
            </el-popconfirm>
          </div>

          <div v-if="conversationsLoading" class="list-loading">
            <div class="spinner" />
          </div>

          <div v-if="!conversationsLoading && conversations.length === 0" class="list-empty">
            No conversations
          </div>
        </div>
      </div>
    </div>

    <!-- Main Area -->
    <div class="main-area">
      <!-- Header -->
      <div class="main-header">
        <button class="toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed" title="Toggle sidebar">
          <i :class="sidebarCollapsed ? 'fa fa-chevron-right' : 'fa fa-chevron-left'" aria-hidden="true"></i>
        </button>
        <div class="header-center">
          <span class="header-title">{{ headerTitle }}</span>
          <span class="header-status">
            <span class="status-dot" />
            {{ statusText }}
          </span>
        </div>
        <div class="header-actions">
        </div>
      </div>

      <!-- Messages -->
      <div class="main-content">
        <CopilotMessages
          :messages="messages"
          :is-loading="isLoading"
          :is-history-loading="isHistoryLoading"
          @example-click="handleExample"
          @regenerate="handleRegenerate"
          @delete-message="handleDeleteMessage"
          @edit-message="handleEditMessage"
          @update-feedback="handleUpdateFeedback"
        />
      </div>

      <!-- Input -->
      <div class="main-footer">
        <CopilotInput
          ref="copilotInput"
          :is-loading="isLoading"
          :disabled="isLoading || isHistoryLoading"
          :show-screenshot="false"
          :upload-image="uploadImage"
          :delete-image="deleteImage"
          @send="handleSend"
          @cancel="handleCancel"
          @error="handleInputError"
        >
          <template #status>
            <CopilotRetrieveStatus
              :statuses="activeStatuses"
              :is-loading="isActiveAssistantLoading"
              :is-streaming="isStreaming"
            />
          </template>
        </CopilotInput>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { useAICopilot } from '@/composables/useAICopilot'
import CopilotMessages from '@/components/ai-copilot/CopilotMessages.vue'
import CopilotInput from '@/components/ai-copilot/CopilotInput.vue'
import CopilotRetrieveStatus from '@/components/ai-copilot/CopilotRetrieveStatus.vue'

export default {
  name: 'CopilotPage',
  components: { CopilotMessages, CopilotInput, CopilotRetrieveStatus },
  data() {
    return {
      copilot: null,
      isHistoryLoading: false,
      sidebarCollapsed: false,
      conversationOffset: 0,
      hoveredId: null,
    }
  },
  computed: {
    ...mapState('aiCopilot', ['messages', 'isLoading', 'isStreaming', 'error', 'conversations', 'conversationsLoading', 'conversationsHasMore']),
    ...mapGetters('aiCopilot', ['lastAssistantMessage']),
    headerTitle() {
      const id = this.$store.state.aiCopilot.conversationId
      if (!id) return 'AI Copilot'
      const conv = this.conversations.find(c => c.id === id)
      return conv?.title || 'AI Copilot'
    },
    statusText() {
      if (this.isStreaming) return 'Typing...'
      if (this.isLoading) return 'Thinking...'
      return 'Online'
    },
    currentConversationId() {
      return this.$store.state.aiCopilot.conversationId
    },
    activeAssistantMessage() {
      const last = this.lastAssistantMessage
      if (!last || last.status === 'done' || last.status === 'error') return null
      return last
    },
    activeStatuses() {
      return this.activeAssistantMessage?.retrieveStatuses || []
    },
    isActiveAssistantLoading() {
      return Boolean(this.activeAssistantMessage && this.isLoading)
    },
  },
  created() {
    this.copilot = useAICopilot()
    this.initPage()
  },
  methods: {
    async initPage() {
      const conversationId = this.$store.state.aiCopilot.conversationId
      if (conversationId) {
        this.isHistoryLoading = true
        try {
          await this.copilot.loadHistory()
        } finally {
          this.isHistoryLoading = false
        }
      }
      this.loadConversations()
    },
    async loadConversations() {
      this.conversationOffset = 0
      await this.copilot.loadConversations({ limit: 20, offset: 0 })
    },
    async handleSelectConversation(conversationId) {
      this.isHistoryLoading = true
      try {
        await this.copilot.switchConversation(conversationId)
      } finally {
        this.isHistoryLoading = false
      }
    },
    async handleNewChat() {
      await this.copilot.createNewConversation()
    },
    async handleDeleteConversation(conversationId) {
      // Confirmation is handled in CopilotHistoryPanel
      await this.copilot.deleteConversation(conversationId)
    },
    async handleLoadMoreConversations() {
      if (this.conversationsLoading || !this.conversationsHasMore) return
      this.conversationOffset += 20
      await this.copilot.loadConversations({ limit: 20, offset: this.conversationOffset, append: true })
    },
    handleScroll() {
      const el = this.$refs.listRef
      if (!el || this.conversationsLoading || !this.conversationsHasMore) return
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40
      if (nearBottom) {
        this.handleLoadMoreConversations()
      }
    },
    async handleSend(content) {
      try {
        await this.copilot.send(content)
      } catch (err) {
        console.error('[CopilotPage] send error:', err)
      }
    },
    handleCancel() {
      this.copilot.abort()
    },
    handleRegenerate() {
      this.copilot.regenerate()
    },
    async handleDeleteMessage(message) {
      await this.copilot.deleteMessage(message)
    },
    async handleEditMessage({ message, newContent }) {
      await this.copilot.editMessage(message, newContent)
    },
    handleExample(prompt) {
      this.handleSend(prompt)
    },
    async handleUpdateFeedback({ messageId, feedback }) {
      await this.copilot.submitFeedback(messageId, feedback)
    },
    handleInputError(msg) {
      console.error('[CopilotPage] input error:', msg)
    },
    uploadImage(base64, filename) {
      return this.copilot.client.uploadImage(base64, filename)
    },
    deleteImage(path) {
      return this.copilot.client.deleteImage(path)
    },
    formatTime(iso) {
      if (!iso) return ''
      const d = new Date(iso)
      const now = new Date()
      const diffMs = now - d
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`

      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    },
  },
}
</script>

<style scoped>
.copilot-page {
  display: flex;
  position: fixed;
  top: 124px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  overflow: hidden;
  background: #f8fafc;
  z-index: 1;
}

/* Sidebar */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.sidebar.collapsed {
  width: 0;
  border-right: none;
}

.sidebar-inner {
  width: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 260px;
}

.sidebar-top {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-placeholder {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 13px;
  cursor: not-allowed;
}

.search-placeholder i {
  font-size: 12px;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.new-chat-btn:hover {
  border-color: #2563eb;
  background: #f0f7ff;
  color: #2563eb;
}

/* Sidebar List */
.sidebar-list {
  flex: 1;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.sidebar-item:hover {
  background: #f3f4f6;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #9ca3af;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-time {
  font-size: 11px;
  color: #9ca3af;
}

.item-delete {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s, background 0.15s;
}

.sidebar-item:hover .item-delete {
  opacity: 1;
}

.item-delete:hover {
  background: #fee2e2;
  color: #ef4444;
}

.list-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.list-empty {
  text-align: center;
  padding: 40px 16px;
  font-size: 13px;
  color: #9ca3af;
}

/* Main Area */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
}

.main-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.15s;
}

.toggle-btn:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.header-status {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.header-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.15s;
}

.header-btn:hover {
  background: #f3f4f6;
  color: #ef4444;
}

.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.main-footer {
  flex-shrink: 0;
  padding-bottom: 12px;
  background: #fff;
}
</style>
