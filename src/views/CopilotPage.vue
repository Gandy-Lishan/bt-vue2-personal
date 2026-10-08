<template>
  <div class="copilot-page">
    <!-- Sidebar -->
    <div :class="['sidebar', { collapsed: sidebarCollapsed }]">
      <div class="sidebar-inner">
        <!-- Top: Search + New Chat -->
        <div class="sidebar-top">
          <div class="search-trigger" @click="openSearch">
            <i class="fa fa-search" aria-hidden="true"></i>
            <span>Search...</span>
            <kbd>⌘K</kbd>
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
            <button class="toolbar-btn cancel" @click="exitSelectionMode">Cancel</button>
            <button class="toolbar-btn delete" @click="confirmBatchDelete" :disabled="selectedIds.size === 0">
              Delete({{ selectedIds.size }})
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

    <!-- Search Modal -->
    <div v-if="searchOpen" class="search-overlay" @click.self="closeSearch">
      <div class="search-modal">
        <div class="search-modal-input-row">
          <i class="fa fa-search" aria-hidden="true"></i>
          <input
            ref="searchInput"
            v-model="searchQuery"
            class="search-modal-input"
            type="text"
            placeholder="Search conversations..."
            @input="onSearchInput"
          />
          <button class="search-modal-close" @click="closeSearch" title="Close">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>

        <div v-if="searchLoading" class="search-results">
          <div v-for="i in 4" :key="i" class="search-skeleton-item">
            <div class="skeleton-avatar" />
            <div class="skeleton-lines">
              <div class="skeleton-line short" />
              <div class="skeleton-line" />
            </div>
          </div>
        </div>

        <div v-else-if="searchQuery && searchResults.length === 0" class="search-results search-empty">
          <i class="fa fa-search" aria-hidden="true"></i>
          <span>No results found</span>
        </div>

        <div v-else-if="searchQuery" class="search-results">
          <div
            v-for="(result, idx) in searchResults"
            :key="result.message_id"
            class="search-result-item"
            :class="{ active: activeResultIdx === idx }"
            @click="handleSelectSearchResult(result)"
          >
            <div class="result-avatar">
              <i class="fa fa-commenting-o" aria-hidden="true"></i>
            </div>
            <div class="result-content">
              <div class="result-title">{{ result.conversation_title || 'Untitled' }}</div>
              <div class="result-snippet" v-html="highlightSnippet(result.snippet)"></div>
            </div>
            <div class="result-date">{{ formatDate(result.created_at) }}</div>
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
          :show-screenshot="true"
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
      searchOpen: false,
      searchQuery: '',
      searchResults: [],
      searchLoading: false,
      activeResultIdx: -1,
      _searchTimer: null,
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
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', this._visibilityHandler)
    document.removeEventListener('keydown', this.handleKeydown)
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
      // Abort any active stream and clear input state
      this.copilot.abort()
      this.$refs.copilotInput?.clear()
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
    openSearch() {
      this.searchOpen = true
      this.searchQuery = ''
      this.searchResults = []
      this.activeResultIdx = -1
      this.$nextTick(() => {
        this.$refs.searchInput?.focus()
      })
    },
    closeSearch() {
      this.searchOpen = false
      this.searchQuery = ''
      this.searchResults = []
      this.searchLoading = false
      if (this._searchTimer) {
        clearTimeout(this._searchTimer)
        this._searchTimer = null
      }
    },
    onSearchInput() {
      if (this._searchTimer) clearTimeout(this._searchTimer)
      if (!this.searchQuery.trim()) {
        this.searchResults = []
        this.searchLoading = false
        return
      }
      this.searchLoading = true
      this._searchTimer = setTimeout(async () => {
        const data = await this.copilot.searchConversations(this.searchQuery)
        this.searchResults = data.results || []
        this.searchLoading = false
      }, 300)
    },
    handleKeydown(e) {
      // Cmd+K / Ctrl+K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (this.searchOpen) {
          this.closeSearch()
        } else {
          this.openSearch()
        }
        return
      }
      // Escape to close search
      if (e.key === 'Escape' && this.searchOpen) {
        this.closeSearch()
        return
      }
      // Arrow navigation in results
      if (!this.searchOpen || this.searchLoading || this.searchResults.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        this.activeResultIdx = Math.min(this.activeResultIdx + 1, this.searchResults.length - 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        this.activeResultIdx = Math.max(this.activeResultIdx - 1, 0)
      } else if (e.key === 'Enter' && this.activeResultIdx >= 0) {
        e.preventDefault()
        this.handleSelectSearchResult(this.searchResults[this.activeResultIdx])
      }
    },
    handleSelectSearchResult(result) {
      this.closeSearch()
      this.handleSelectConversation(result.conversation_id)
      // After switching conversation, scroll to the matched message
      this.$nextTick(() => {
        const el = document.querySelector(`[data-message-id="${result.message_id}"]`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.add('search-highlight-pulse')
          setTimeout(() => el.classList.remove('search-highlight-pulse'), 2000)
        }
      })
    },
    highlightSnippet(snippet) {
      if (!snippet) return ''
      // Replace **keyword** with <mark>keyword</mark>
      return snippet.replace(/\*\*(.*?)\*\*/g, '<mark>$1</mark>')
    },
    formatDate(iso) {
      if (!iso) return ''
      const d = new Date(iso)
      const now = new Date()
      const diffMs = now - d
      const diffDays = Math.floor(diffMs / 86400000)
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
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

/* ── Search trigger in sidebar ── */
.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 0 12px 8px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s;
}

.search-trigger:hover {
  border-color: #d1d5db;
  background: #fff;
  color: #6b7280;
}

.search-trigger kbd {
  margin-left: auto;
  padding: 1px 5px;
  font-size: 11px;
  font-family: inherit;
  background: #e5e7eb;
  border-radius: 4px;
  color: #6b7280;
}

/* ── Search overlay / modal ── */
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}

.search-modal {
  width: 560px;
  max-width: 90vw;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.search-modal-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
}

.search-modal-input-row .fa-search {
  color: #9ca3af;
  font-size: 14px;
  flex-shrink: 0;
}

.search-modal-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #1f2937;
  background: transparent;
}

.search-modal-input::placeholder {
  color: #9ca3af;
}

.search-modal-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.15s;
}

.search-modal-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.search-results {
  max-height: 50vh;
  overflow-y: auto;
  padding: 8px 0;
}

.search-skeleton-item {
  display: flex;
  gap: 12px;
  padding: 12px 18px;
  align-items: flex-start;
}

.skeleton-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  flex-shrink: 0;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: #e5e7eb;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-line.short {
  width: 40%;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1 }
  50% { opacity: 0.5 }
}

.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 18px;
  color: #9ca3af;
}

.search-empty .fa-search {
  font-size: 24px;
  margin-bottom: 8px;
}

.search-result-item {
  display: flex;
  gap: 12px;
  padding: 12px 18px;
  cursor: pointer;
  transition: background 0.1s;
  align-items: flex-start;
}

.search-result-item:hover,
.search-result-item.active {
  background: #f3f4f6;
}

.result-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #6b7280;
  font-size: 14px;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.result-snippet {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-snippet mark {
  background: #fef08a;
  color: #1f2937;
  padding: 0 2px;
  border-radius: 2px;
  font-weight: 600;
}

.result-date {
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Search highlight pulse on matched message */
.search-highlight-pulse {
  animation: highlight-pulse 2s ease-out;
}

@keyframes highlight-pulse {
  0% { background: #fef08a }
  100% { background: transparent }
}
</style>
