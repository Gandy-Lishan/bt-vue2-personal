<template>
  <div>
    <!-- Screenshot overlay -->
    <div
      v-if="isScreenshotMode"
      class="screenshot-overlay"
      @mousedown="onScreenshotMouseDown"
    >
      <div class="screenshot-hint">拖拽选择截图区域，按 ESC 取消</div>
      <div
        v-if="screenshotSelection"
        class="screenshot-selection"
        :style="screenshotSelectionStyle"
      />
    </div>

    <!-- Chat Window -->
    <Transition name="slide-up">
      <div
        ref="copilotWindow"
        v-show="isOpen"
        class="copilot-window"
        :style="windowStyle"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop.prevent="handleDrop"
      >
        <!-- Drag overlay -->
        <div v-if="isDragging" class="drag-overlay">
          <div class="drag-overlay-content">
            <i class="fa fa-cloud-upload drag-icon" aria-hidden="true"></i>
            <span class="drag-title">Drop images here</span>
            <span class="drag-subtitle">Supports JPG, PNG, WebP, GIF</span>
          </div>
        </div>

        <span v-if="canResizeHeight" class="resize-handle resize-handle-top" @mousedown="startResize($event, 'top')"></span>
        <span v-if="canResizeWidth" class="resize-handle resize-handle-left" @mousedown="startResize($event, 'left')"></span>
        <span v-if="canResizeWidth" class="resize-handle resize-handle-right" @mousedown="startResize($event, 'right')"></span>
        <span v-if="canResizeHeight" class="resize-handle resize-handle-bottom" @mousedown="startResize($event, 'bottom')"></span>
        <span v-if="canResizeBoth" class="resize-handle resize-handle-corner resize-handle-top-left" @mousedown="startResize($event, 'top-left')"></span>
        <span v-if="canResizeBoth" class="resize-handle resize-handle-corner resize-handle-top-right" @mousedown="startResize($event, 'top-right')"></span>
        <span v-if="canResizeBoth" class="resize-handle resize-handle-corner resize-handle-bottom-left" @mousedown="startResize($event, 'bottom-left')"></span>
        <span v-if="canResizeBoth" class="resize-handle resize-handle-corner resize-handle-bottom-right" @mousedown="startResize($event, 'bottom-right')"></span>
        <!-- Header -->
        <div class="copilot-header" @mousedown="startDrag">
          <div class="header-left">
            <button class="header-btn menu-btn" @click="toggleHistory" title="History">
              <i class="fa fa-bars" aria-hidden="true"></i>
            </button>
            <!-- <span class="header-avatar"><i class="fa fa-commenting" aria-hidden="true"></i></span> -->
            <div class="header-info">
              <span class="header-title">{{ headerTitle }}</span>
              <span class="header-status">
                <span class="status-dot" />
                {{ statusText }}
              </span>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" @click="handleNewChat" :disabled="atConversationLimit" title="New chat">
              <i class="fa fa-plus" aria-hidden="true"></i>
            </button>
            <button class="header-btn" @click="openStandalone" title="Open in full page">
              <i class="fa fa-external-link" aria-hidden="true"></i>
            </button>
            <button class="header-btn" @click="close" title="Minimize">
              <i class="fa fa-minus" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- Messages -->
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

        <!-- Rate limit toast -->
        <div v-if="rateLimitSeconds !== null" class="rate-limit-toast">
          <i class="fa fa-warning" aria-hidden="true"></i>
          <span>Call limit reached. Try again in <strong>{{ rateLimitSeconds }}s</strong>.</span>
        </div>

        <!-- Input -->
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
          @start-screenshot-mode="handleStartScreenshotMode"
        >
          <template #status>
            <CopilotRetrieveStatus
              :statuses="activeStatuses"
              :tool-calls="activeToolCalls"
              :latest-reasoning="latestReasoningContent"
              :is-loading="isActiveAssistantLoading"
              :is-streaming="isStreaming"
            />
          </template>
        </CopilotInput>

        <!-- History Panel -->
        <CopilotHistoryPanel
          :visible="showHistory"
          :conversations="conversations"
          :total-count="estimatedTotalConversations"
          :current-conversation-id="$store.state.aiCopilot.conversationId"
          :loading="conversationsLoading"
          :has-more="conversationsHasMore"
          :selection-mode="selectionMode"
          :selected-ids="selectedIds"
          new-chat-icon="fa-plus"
          @close="showHistory = false"
          @select="handleSelectConversation"
          @new-chat="handleNewChatFromHistory"
          @delete="handleDeleteConversation"
          @load-more="handleLoadMoreConversations"
          @enter-selection="enterSelectionMode"
          @exit-selection="exitSelectionMode"
          @toggle-select="toggleSelect"
          @batch-delete="confirmBatchDelete"
          @search="openSearch"
        />

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
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { useAICopilot } from '@/composables/useAICopilot'
import EventBus from '@/event-bus'
import CopilotMessages from './CopilotMessages.vue'
import CopilotInput from './CopilotInput.vue'
import CopilotRetrieveStatus from './CopilotRetrieveStatus.vue'
import CopilotHistoryPanel from './CopilotHistoryPanel.vue'

export default {
  name: 'AICopilot',
  components: { CopilotMessages, CopilotInput, CopilotRetrieveStatus, CopilotHistoryPanel },
  props: {
    layout: { type: String, default: 'default' },
  },
  data() {
    return {
      isOpen: false,
      copilot: null,
      isHistoryLoading: false,
      windowWidth: 480,
      windowHeight: 600,
      windowLeft: null,
      windowTop: null,
      resizeState: null,
      dragState: null,
      isDragging: false,
      dragCounter: 0,
      isScreenshotMode: false,
      screenshotSelection: null,
      isSelecting: false,
      showHistory: false,
      conversationOffset: 0,
      isUnderMaintenance: false,
      // Search
      searchOpen: false,
      searchQuery: '',
      searchResults: [],
      searchLoading: false,
      activeResultIdx: -1,
      _searchTimer: null,
      // Selection mode
      selectionMode: false,
      selectedIds: new Set(),
      conversationCount: 0,
      // Visibility sync
      _lastHiddenAt: 0,
      _visibilityHandler: null,
      // Rate limit countdown
      rateLimitSeconds: null,
      _rateLimitTimer: null,
    }
  },
  watch: {
    // When a response finishes while the copilot was minimized, emit a
    // notification event so the header can alert the user.
    isLoading(newVal) {
      if (
        !newVal &&
        !this.isStreaming &&
        this.$store.state.aiCopilot.minimizedWhileStreaming
      ) {
        this.$store.commit('aiCopilot/SET_MINIMIZED_WHILE_STREAMING', false)
        // Only notify on successful completion (not on error)
        const lastMsg = this.lastAssistantMessage
        if (lastMsg && (lastMsg.status === 'done' || lastMsg.status === 'pending' || !lastMsg.status)) {
          EventBus.emit('ai-copilot:response-ready')
        }
      }
    },
    // Rate limit countdown from store
    rateLimitRetryAfter(newVal) {
      if (this._rateLimitTimer) {
        clearInterval(this._rateLimitTimer)
        this._rateLimitTimer = null
      }
      if (newVal != null && newVal > 0) {
        this.rateLimitSeconds = Math.ceil(newVal)
        this._rateLimitTimer = setInterval(() => {
          if (this.rateLimitSeconds <= 1) {
            clearInterval(this._rateLimitTimer)
            this._rateLimitTimer = null
            this.rateLimitSeconds = null
            this.$store.commit('aiCopilot/SET_RATE_LIMIT_RETRY_AFTER', null)
          } else {
            this.rateLimitSeconds--
          }
        }, 1000)
      } else {
        this.rateLimitSeconds = null
      }
    },
  },
  computed: {
    ...mapState('aiCopilot', ['messages', 'isLoading', 'isStreaming', 'error', 'conversations', 'conversationsLoading', 'conversationsHasMore', 'rateLimitRetryAfter']),
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
    activeAssistantMessage() {
      const last = this.lastAssistantMessage
      if (!last || last.status === 'done' || last.status === 'error') return null
      return last
    },
    activeStatuses() {
      return this.activeAssistantMessage?.retrieveStatuses || []
    },
    activeToolCalls() {
      const blocks = this.activeAssistantMessage?.blocks || []
      // Include pending tools so the status bar shows tool names during execution,
      // not just while the graph node is actively running
      return blocks.filter(b => b.type === 'tool' && b.toolCall?.status !== 'completed').map(b => b.toolCall)
    },
    latestReasoningContent() {
      const chunks = this.activeAssistantMessage?.reasoning_chunks || []
      if (!chunks.length) return ''
      return chunks[chunks.length - 1].content || ''
    },
    isActiveAssistantLoading() {
      return Boolean(this.activeAssistantMessage && this.isLoading)
    },
    estimatedTotalConversations() {
      // If there are more pages, estimate based on pagination
      if (this.conversationsHasMore) {
        return this.conversations.length + 20 // at least this many
      }
      return this.conversations.length
    },
    atConversationLimit() {
      return this.conversationCount >= 50
    },
    windowStyle() {
      if (this.layout === 'bottom') return { height: `${this.windowHeight}px` }
      if (this.layout === 'side') return { width: `${this.windowWidth}px` }
      return {
        width: `${this.windowWidth}px`,
        height: `${this.windowHeight}px`,
        left: this.windowLeft !== null ? `${this.windowLeft}px` : undefined,
        top: this.windowTop !== null ? `${this.windowTop}px` : undefined,
      }
    },
    canResizeWidth() {
      return this.layout === 'default' || this.layout === 'side'
    },
    canResizeHeight() {
      return this.layout === 'default' || this.layout === 'bottom'
    },
    canResizeBoth() {
      return this.layout === 'default'
    },
    screenshotSelectionStyle() {
      if (!this.screenshotSelection) return {}
      const { x1, y1, x2, y2 } = this.screenshotSelection
      const left = Math.min(x1, x2)
      const top = Math.min(y1, y2)
      const width = Math.abs(x2 - x1)
      const height = Math.abs(y2 - y1)
      return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }
    }
  },
  created() {
    this.copilot = useAICopilot()
    // 注册项目专属工具（实际 handler 由父组件或初始化代码注入）
    this.$emit('register-tools', this.copilot.registerTool)
    // Header entry button toggles the panel via EventBus
    this._toggleHandler = () => {
      if (this.isOpen) {
        this.close()
      } else {
        this.open()
      }
    }
    EventBus.on('ai-copilot:toggle', this._toggleHandler)
    // Visibility change handler for tab-sync
    this._visibilityHandler = () => {
      if (document.visibilityState === 'visible' && this.isOpen) {
        const awayMs = Date.now() - this._lastHiddenAt
        const convId = this.$store.state.aiCopilot.conversationId
        if (convId && awayMs > 30000 && !this.isLoading && !this.isStreaming) {
          this._syncHistoryOnReturn()
        }
      } else {
        this._lastHiddenAt = Date.now()
      }
    }
    // Keyboard shortcut handler (Cmd+K for search, Escape for screenshot)
    this._keydownHandler = (e) => {
      // Cmd+K / Ctrl+K to open search (only when copilot is open)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && this.isOpen) {
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
      // Arrow navigation in search results
      if (this.searchOpen && !this.searchLoading && this.searchResults.length > 0) {
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
      }
    }
  },
  mounted() {
    document.addEventListener('visibilitychange', this._visibilityHandler)
    document.addEventListener('keydown', this._keydownHandler)
  },
  beforeDestroy() {
    this.stopResize()
    if (this._rateLimitTimer) {
      clearInterval(this._rateLimitTimer)
      this._rateLimitTimer = null
    }
    document.removeEventListener('visibilitychange', this._visibilityHandler)
    document.removeEventListener('keydown', this._keydownHandler)
    if (this._toggleHandler) {
      EventBus.off('ai-copilot:toggle', this._toggleHandler)
    }
  },
  methods: {
    async open() {
      this.applyLayoutSize()
      this.isOpen = true
      this.showHistory = false
      // Clear the minimized-while-streaming flag — user is back
      this.$store.commit('aiCopilot/SET_MINIMIZED_WHILE_STREAMING', false)
      EventBus.emit('ai-copilot:opened')
      console.log('[AICopilot] open, messages:', this.messages.length, 'convId:', this.$store.state.aiCopilot.conversationId?.slice(0, 8))
      // 首次打开尝试加载历史
      if (this.messages.length === 0) {
        console.log('[AICopilot] loading history (first open)')
        this.isHistoryLoading = true
        try {
          await this.copilot.loadHistory()
        } finally {
          this.isHistoryLoading = false
          console.log('[AICopilot] history loaded, messages:', this.messages.length)
        }
      }
      // Load conversation list so header title shows the actual conversation title
      await this.copilot.loadConversations({ limit: 20, offset: 0 })
    },
    close() {
      // Track if user minimizes while response is still generating
      if (this.isLoading || this.isStreaming) {
        this.$store.commit('aiCopilot/SET_MINIMIZED_WHILE_STREAMING', true)
      }
      this.isOpen = false
      this.showHistory = false
      EventBus.emit('ai-copilot:closed')
    },
    openStandalone() {
      this.close()
      this.$router.push('/copilot?access=st2026')
    },
    uploadImage(base64, filename) {
      return this.copilot.client.uploadImage(base64, filename)
    },
    deleteImage(path) {
      return this.copilot.client.deleteImage(path)
    },
    handleInputError(msg) {
      console.error('[AICopilot] input error:', msg)
    },
    async handleSend(content) {
      try {
        await this.copilot.send(content)
      } catch (err) {
        console.error('[AICopilot] send error:', err)
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
    async toggleHistory() {
      this.showHistory = !this.showHistory
      if (this.showHistory) {
        this.conversationOffset = 0
        await this.copilot.loadConversations({ limit: 20, offset: 0 })
      }
    },
    async handleSelectConversation(conversationId) {
      this.showHistory = false
      this.isHistoryLoading = true
      try {
        await this.copilot.switchConversation(conversationId)
      } finally {
        this.isHistoryLoading = false
      }
    },
    async handleNewChatFromHistory() {
      this.showHistory = false
      await this.copilot.createNewConversation()
    },
    async handleNewChat() {
      if (this.atConversationLimit) return
      await this.copilot.createNewConversation()
      this.refreshConversationCount()
    },
    async handleDeleteConversation(conversationId) {
      await this.copilot.deleteConversation(conversationId)
    },
    async handleLoadMoreConversations() {
      if (this.conversationsLoading || !this.conversationsHasMore) return
      this.conversationOffset += 20
      await this.copilot.loadConversations({ limit: 20, offset: this.conversationOffset, append: true })
    },
    async refreshConversationCount() {
      try {
        this.conversationCount = await this.copilot.fetchConversationCount()
      } catch {
        // Silent failure
      }
    },
    async _syncHistoryOnReturn() {
      const convId = this.$store.state.aiCopilot.conversationId
      if (!convId) return
      try {
        await this.copilot.loadHistory()
      } catch {
        // Silent failure
      }
    },
    // Search
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
    handleSelectSearchResult(result) {
      this.closeSearch()
      this.handleSelectConversation(result.conversation_id)
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
      return snippet.replace(/\*\*(.*?)\*\*/g, '<mark>$1</mark>')
    },
    formatDate(iso) {
      if (!iso) return ''
      const d = new Date(iso.endsWith('Z') ? iso : iso + 'Z')
      const now = new Date()
      const diffMs = now - d
      const diffDays = Math.floor(diffMs / 86400000)
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays}d ago`
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    },
    // Selection mode
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
      this.selectedIds = new Set(this.selectedIds)
    },
    async confirmBatchDelete() {
      if (this.selectedIds.size === 0) return
      const ids = Array.from(this.selectedIds)
      const deletedCurrent = ids.includes(this.$store.state.aiCopilot.conversationId)
      const result = await this.copilot.deleteConversations(ids)
      this.exitSelectionMode()
      this.refreshConversationCount()
      if (deletedCurrent) {
        await this.copilot.createNewConversation()
        this.refreshConversationCount()
      }
    },
    applyLayoutSize() {
      if (this.layout === 'bottom') {
        this.windowHeight = Math.min(Math.round(window.innerHeight * 0.72), 680)
      } else if (this.layout === 'side') {
        this.windowWidth = 480
      }
    },
    startResize(event, direction) {
      event.preventDefault()
      const rect = this.$refs.copilotWindow.getBoundingClientRect()
      this.resizeState = {
        direction,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: this.windowWidth,
        startHeight: this.windowHeight,
        startLeft: rect.left,
        startTop: rect.top,
      }
      window.addEventListener('mousemove', this.handleResize)
      window.addEventListener('mouseup', this.stopResize)
    },
    handleResize(event) {
      if (!this.resizeState) return
      const { direction, startX, startY, startWidth, startHeight, startLeft, startTop } = this.resizeState
      const minWidth = 480
      const minHeight = 420
      const dx = event.clientX - startX
      const dy = event.clientY - startY

      if (direction.includes('left')) {
        const nextWidth = Math.min(Math.max(startWidth - dx, minWidth), window.innerWidth - 48)
        this.windowWidth = nextWidth
        this.windowLeft = startLeft + dx
      }
      if (direction.includes('right')) {
        const nextWidth = Math.min(Math.max(startWidth + dx, minWidth), window.innerWidth - 48)
        this.windowWidth = nextWidth
      }
      if (direction.includes('top')) {
        const nextHeight = Math.min(Math.max(startHeight - dy, minHeight), window.innerHeight - 130)
        this.windowHeight = nextHeight
        this.windowTop = startTop + dy
      }
      if (direction.includes('bottom')) {
        const nextHeight = Math.min(Math.max(startHeight + dy, minHeight), window.innerHeight - 130)
        this.windowHeight = nextHeight
      }
    },
    stopResize() {
      if (!this.resizeState) return
      window.removeEventListener('mousemove', this.handleResize)
      window.removeEventListener('mouseup', this.stopResize)
      this.resizeState = null
    },
    startDrag(event) {
      if (event.target.closest('button')) return
      event.preventDefault()
      const rect = this.$refs.copilotWindow.getBoundingClientRect()
      this.dragState = {
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left,
        startTop: rect.top,
      }
      window.addEventListener('mousemove', this.handleDrag)
      window.addEventListener('mouseup', this.stopDrag)
    },
    handleDrag(event) {
      if (!this.dragState) return
      const dx = event.clientX - this.dragState.startX
      const dy = event.clientY - this.dragState.startY
      this.windowLeft = Math.max(0, Math.min(window.innerWidth - this.windowWidth, this.dragState.startLeft + dx))
      this.windowTop = Math.max(0, Math.min(window.innerHeight - this.windowHeight, this.dragState.startTop + dy))
    },
    stopDrag() {
      if (!this.dragState) return
      window.removeEventListener('mousemove', this.handleDrag)
      window.removeEventListener('mouseup', this.stopDrag)
      this.dragState = null
    },
    // Drag & drop handling
    handleDragOver(e) {
      e.dataTransfer.dropEffect = 'copy'
      this.dragCounter++
      this.isDragging = true
    },
    handleDragLeave(e) {
      // Only decrement if the leave is from the window itself, not a child
      if (e.target === this.$refs.copilotWindow) {
        this.dragCounter--
        if (this.dragCounter <= 0) {
          this.isDragging = false
          this.dragCounter = 0
        }
      }
    },
    handleDrop(e) {
      this.dragCounter = 0
      this.isDragging = false
      const files = Array.from(e.dataTransfer?.files || [])
      if (files.length > 0) {
        this.$refs.copilotInput?.handleFiles(files)
      }
    },
    // Screenshot handling
    handleStartScreenshotMode() {
      this.isOpen = false
      this.$nextTick(() => {
        this.isScreenshotMode = true
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', this.handleScreenshotKeydown)
      })
    },
    handleScreenshotKeydown(e) {
      if (e.key === 'Escape') {
        this.exitScreenshotMode()
      }
    },
    onScreenshotMouseDown(e) {
      this.isSelecting = true
      const startX = e.clientX
      const startY = e.clientY
      this.screenshotSelection = { x1: startX, y1: startY, x2: startX, y2: startY }

      this._onScreenshotMouseMove = (moveEvent) => {
        this.screenshotSelection = {
          x1: startX,
          y1: startY,
          x2: moveEvent.clientX,
          y2: moveEvent.clientY,
        }
      }
      this._onScreenshotMouseUp = async () => {
        window.removeEventListener('mousemove', this._onScreenshotMouseMove)
        window.removeEventListener('mouseup', this._onScreenshotMouseUp)
        this.isSelecting = false

        const rect = this.getScreenshotRect()
        if (rect.width < 10 || rect.height < 10) {
          this.exitScreenshotMode()
          return
        }

        await this.captureSelection(rect)
      }

      window.addEventListener('mousemove', this._onScreenshotMouseMove)
      window.addEventListener('mouseup', this._onScreenshotMouseUp)
    },
    getScreenshotRect() {
      const { x1, y1, x2, y2 } = this.screenshotSelection
      return {
        x: Math.min(x1, x2) + window.scrollX,
        y: Math.min(y1, y2) + window.scrollY,
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1),
      }
    },
    async captureSelection(rect) {
      this.isScreenshotMode = false
      this.screenshotSelection = null
      this.isSelecting = false
      window.removeEventListener('keydown', this.handleScreenshotKeydown)
      document.body.style.overflow = ''

      // 等待 DOM 更新，确保遮罩完全移除
      await this.$nextTick()
      await new Promise(resolve => requestAnimationFrame(resolve))

      try {
        const html2canvas = (await import('html2canvas')).default
        const fullCanvas = await html2canvas(document.documentElement, {
          scale: window.devicePixelRatio || 1,
          useCORS: true,
          logging: false,
        })

        const dpr = window.devicePixelRatio || 1
        const cropCanvas = document.createElement('canvas')
        cropCanvas.width = Math.round(rect.width * dpr)
        cropCanvas.height = Math.round(rect.height * dpr)
        const ctx = cropCanvas.getContext('2d')

        ctx.drawImage(
          fullCanvas,
          Math.round(rect.x * dpr),
          Math.round(rect.y * dpr),
          cropCanvas.width,
          cropCanvas.height,
          0,
          0,
          cropCanvas.width,
          cropCanvas.height
        )

        const base64 = cropCanvas.toDataURL('image/png')

        this.isOpen = true
        this.$nextTick(() => {
          this.$refs.copilotInput?.addImageFromBase64(base64, 'screenshot.png')
          this.$refs.copilotInput?.focus()
        })
      } catch (err) {
        console.error('[AICopilot] screenshot capture failed:', err)
        this.isOpen = true
      }
    },
    exitScreenshotMode() {
      this.isScreenshotMode = false
      this.screenshotSelection = null
      this.isSelecting = false
      document.body.style.overflow = ''
      window.removeEventListener('keydown', this.handleScreenshotKeydown)
      if (this._onScreenshotMouseMove) {
        window.removeEventListener('mousemove', this._onScreenshotMouseMove)
      }
      if (this._onScreenshotMouseUp) {
        window.removeEventListener('mouseup', this._onScreenshotMouseUp)
      }
      this.isOpen = true
    },
  }
}
</script>

<style scoped>

.copilot-window {
  position: fixed;
  top: 100px;
  right: 24px;
  background: #fff;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(37, 99, 235, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overscroll-behavior: contain;
  z-index: 9999;
}

/* Maintenance badge */
.copilot-maintenance-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #ea580c;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(234, 88, 12, 0.15);
  cursor: default;
}

/* Rate limit toast */
.rate-limit-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  margin: 0 6px 14px;
  border-radius: 10px;
  background: #fef9c3;
  border: 1px solid #fde047;
  color: #a16207;
  font-size: 13px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(161, 98, 7, 0.1);
}

.rate-limit-toast .fa-warning {
  font-size: 14px;
  color: #ca8a04;
  flex-shrink: 0;
}

.rate-limit-toast strong {
  font-weight: 700;
  color: #854d0e;
}

/* Drag overlay */
.drag-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #2563eb;
  border-radius: 18px;
  margin: 6px;
}

.drag-overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #374151;
}

.drag-icon {
  font-size: 40px;
  color: #2563eb;
  opacity: 0.8;
}

.drag-title {
  font-size: 18px;
  font-weight: 600;
}

.drag-subtitle {
  font-size: 13px;
  color: #6b7280;
}

.resize-handle {
  position: absolute;
  z-index: 2;
  background: transparent;
}

.resize-handle-top {
  top: 0;
  left: 12px;
  right: 12px;
  height: 8px;
  cursor: ns-resize;
}

.resize-handle-left {
  top: 12px;
  bottom: 12px;
  left: 0;
  width: 8px;
  cursor: ew-resize;
}

.resize-handle-corner {
  top: 0;
  left: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
}

.resize-handle-top-right {
  top: 0;
  left: auto;
  right: 4px;
  cursor: nesw-resize;
}

.resize-handle-bottom-left {
  top: auto;
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}

.resize-handle-bottom-right {
  top: auto;
  bottom: 0;
  left: auto;
  right: 4px;
  cursor: nwse-resize;
}

.resize-handle-right {
  top: 12px;
  bottom: 12px;
  left: auto;
  right: -6px;
  width: 8px;
  cursor: ew-resize;
}

.resize-handle-bottom {
  top: auto;
  bottom: 0;
  left: 12px;
  right: 12px;
  height: 8px;
  cursor: ns-resize;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.copilot-header {
  padding: 16px 18px;
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #1d4ed8 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  cursor: move;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
}

.header-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.header-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.header-status {
  font-size: 12px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6ee7b7;
  box-shadow: 0 0 0 1px rgba(110, 231, 183, 0.45);
}

.header-actions {
  display: flex;
  gap: 4px;
}

.header-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.menu-btn {
  margin-right: 4px;
}

/* Screenshot overlay */
.screenshot-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 10002;
  cursor: crosshair;
}

.screenshot-hint {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  pointer-events: none;
  z-index: 10003;
  white-space: nowrap;
}

.screenshot-selection {
  position: fixed;
  border: 2px solid #2563eb;
  background: rgba(37, 99, 235, 0.12);
  pointer-events: none;
  z-index: 10003;
}

/* ── Search overlay / modal ── */
.search-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
  border-radius: 18px;
}

.search-modal {
  width: 440px;
  max-width: 90%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.search-modal-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
}

.search-modal-input-row .fa-search {
  color: #9ca3af;
  font-size: 13px;
  flex-shrink: 0;
}

.search-modal-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #1f2937;
  background: transparent;
}

.search-modal-input::placeholder {
  color: #9ca3af;
}

.search-modal-close {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  transition: all 0.15s;
}

.search-modal-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.search-results {
  max-height: 40vh;
  overflow-y: auto;
  padding: 6px 0;
}

.search-skeleton-item {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  align-items: flex-start;
}

.skeleton-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  flex-shrink: 0;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.skeleton-line {
  height: 10px;
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
  padding: 36px 14px;
  color: #9ca3af;
}

.search-empty .fa-search {
  font-size: 20px;
  margin-bottom: 6px;
}

.search-result-item {
  display: flex;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.1s;
  align-items: flex-start;
}

.search-result-item:hover,
.search-result-item.active {
  background: #f3f4f6;
}

.result-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #6b7280;
  font-size: 12px;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.result-snippet {
  font-size: 11px;
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
  font-size: 10px;
  color: #9ca3af;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Search highlight pulse */
.search-highlight-pulse {
  animation: highlight-pulse 2s ease-out;
}

@keyframes highlight-pulse {
  0% { background: #fef08a }
  100% { background: transparent }
}

/* History panel selection mode overrides */
.history-panel .toolbar-btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}

.history-panel .toolbar-btn.cancel {
  background: #fff;
  color: #6b7280;
}

.history-panel .toolbar-btn.cancel:hover {
  background: #f3f4f6;
}

.history-panel .toolbar-btn.delete {
  background: #ef4444;
  border-color: #ef4444;
  color: #fff;
}

.history-panel .toolbar-btn.delete:hover {
  background: #dc2626;
  border-color: #dc2626;
}

.history-panel .toolbar-btn.delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-panel .select-btn {
  width: auto;
  padding: 4px;
}

.history-panel .search-btn {
  width: auto !important;
  padding: 4px !important;
}

.history-panel .item-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}

.history-panel .item-checkbox input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #2563eb;
}
</style>
