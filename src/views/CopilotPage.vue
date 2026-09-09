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
          <div v-if="!selectionMode" class="top-actions">
            <button class="new-chat-btn" @click="handleNewChat" :disabled="atConversationLimit" :title="atConversationLimit ? 'Conversation limit reached (50/50)' : ''">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              <span>New chat</span>
            </button>
            <button class="select-btn" @click="enterSelectionMode" title="Select multiple">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2.5" y="3" width="3" height="3" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.2"/>
                <rect x="7" y="3.8" width="6.5" height="1.4" rx="0.4"/>
                <rect x="2.5" y="8" width="3" height="3" rx="0.6" fill="none" stroke="currentColor" stroke-width="1.2"/>
                <rect x="7" y="8.8" width="6.5" height="1.4" rx="0.4"/>
              </svg>
            </button>
          </div>
          <!-- Selection toolbar replaces New chat row -->
          <div v-if="selectionMode" class="top-actions">
            <button class="toolbar-btn cancel" @click="exitSelectionMode">取消</button>
            <button class="toolbar-btn delete" @click="confirmBatchDelete" :disabled="selectedIds.size === 0">
              删除({{ selectedIds.size }})
            </button>
          </div>
        </div>

        <!-- Conversation List -->
        <div ref="listRef" class="sidebar-list" @scroll="handleScroll">
          <div
            v-for="conv in conversations"
            :key="conv.id"
            :class="['sidebar-item', { active: conv.id === currentConversationId }]"
            @click="selectionMode ? toggleSelect(conv.id) : handleSelectConversation(conv.id)"
            @mouseenter="hoveredId = conv.id"
            @mouseleave="hoveredId = null"
          >
            <label v-if="selectionMode" class="item-checkbox" @click.stop>
              <input type="checkbox" :checked="selectedIds.has(conv.id)" @change="toggleSelect(conv.id)">
            </label>
            <div class="item-icon">
              <i class="fa fa-align-left" aria-hidden="true"></i>
            </div>
            <div class="item-content">
              <div class="item-title">{{ conv.title || 'New Chat' }}</div>
              <div class="item-time">{{ formatTime(conv.updated_at || conv.created_at) }}</div>
            </div>
            <el-popconfirm
              v-if="!selectionMode"
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
          <!-- Maintenance badge -->
          <div v-if="isUnderMaintenance" class="maintenance-badge">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
            <span>AI Copilot is currently under maintenance</span>
          </div>
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
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { useAICopilot } from '@/composables/useAICopilot'
import CopilotMessages from '@/components/ai-copilot/CopilotMessages.vue'
import CopilotInput from '@/components/ai-copilot/CopilotInput.vue'

export default {
  name: 'CopilotPage',
  components: { CopilotMessages, CopilotInput },
  data() {
    return {
      copilot: null,
      isHistoryLoading: false,
      sidebarCollapsed: false,
      conversationOffset: 0,
      hoveredId: null,
      isUnderMaintenance: false,
      _lastHiddenAt: 0,
      selectionMode: false,
      selectedIds: new Set(),
      conversationCount: 0,
    }
  },
  computed: {
    ...mapState('aiCopilot', ['messages', 'isLoading', 'isStreaming', 'error', 'conversations', 'conversationsLoading', 'conversationsHasMore']),
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
    atConversationLimit() {
      return this.conversationCount >= 50
    },
  },
  created() {
    this.copilot = useAICopilot()
    this.initPage()
    // Re-sync messages from server when user returns to this tab/page.
    // Only reload if user was away > 30s and no stream is active.
    // Prevents unnecessary refresh on quick app switches.
    this._visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        const awayMs = Date.now() - this._lastHiddenAt
        const convId = this.$store.state.aiCopilot.conversationId
        if (convId && awayMs > 30000 && !this.isLoading && !this.isStreaming) {
          this._syncHistoryOnReturn()
        }
      } else {
        this._lastHiddenAt = Date.now()
      }
    }
  },
  mounted() {
    document.addEventListener('visibilitychange', this._visibilityHandler)
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this._visibilityHandler)
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
      this.refreshConversationCount()
    },
    async refreshConversationCount() {
      try {
        this.conversationCount = await this.copilot.fetchConversationCount()
      } catch {
        // Silent failure
      }
    },
    async _syncHistoryOnReturn() {
      // Silent background re-sync — don't block UI or show loading spinner.
      const convId = this.$store.state.aiCopilot.conversationId
      if (!convId) return
      try {
        await this.copilot.loadHistory()
      } catch {
        // Silent failure — user can manually refresh if needed
      }
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
      if (this.atConversationLimit) return
      await this.copilot.createNewConversation()
      this.refreshConversationCount()
    },
    async handleDeleteConversation(conversationId) {
      await this.copilot.deleteConversation(conversationId)
      this.refreshConversationCount()
    },
    enterSelectionMode() {
      this.selectionMode = true
      this.selectedIds = new Set()
    },
    exitSelectionMode() {
      this.selectionMode = false
      this.selectedIds = new Set()
    },
    toggleSelect(id) {
      if (this.selectedIds.has(id)) {
        this.selectedIds.delete(id)
      } else {
        this.selectedIds.add(id)
      }
      // Force reactivity update
      this.selectedIds = new Set(this.selectedIds)
    },
    async confirmBatchDelete() {
      if (this.selectedIds.size === 0) return
      const ids = Array.from(this.selectedIds)
      const deletedCurrent = ids.includes(this.currentConversationId)
      const result = await this.copilot.deleteConversations(ids)
      this.exitSelectionMode()
      this.refreshConversationCount()
      // If we deleted the current conversation, create a new one
      if (deletedCurrent) {
        await this.copilot.createNewConversation()
        this.refreshConversationCount()
      }
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
  min-height: 0;
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
  gap: 6px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  flex: 1;
}

.new-chat-btn:hover {
  border-color: #2563eb;
  background: #f0f7ff;
  color: #2563eb;
}

.new-chat-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.new-chat-btn:disabled:hover {
  border-color: #e5e7eb;
  background: #fff;
  color: #374151;
}

.top-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.select-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.15s;
  flex-shrink: 0;
}

.select-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

/* Toolbar buttons (used in selection mode) */
.toolbar-btn {
  flex: 1;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.toolbar-btn.cancel {
  background: #fff;
  color: #6b7280;
}

.toolbar-btn.cancel:hover {
  background: #f3f4f6;
}

.toolbar-btn.delete {
  background: #ef4444;
  border-color: #ef4444;
  color: #fff;
}

.toolbar-btn.delete:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.toolbar-btn.delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sidebar List */
.sidebar-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
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

.item-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}

.item-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2563eb;
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
  align-items: center;
}

/* Maintenance badge */
.maintenance-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #ea580c;
  font-size: 12px;
  font-weight: 500;
}

.maintenance-badge i {
  font-size: 13px;
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
