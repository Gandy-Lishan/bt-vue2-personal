<template>
  <div class="ai-copilot">
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

    <!-- Toggle Bubble — 注释掉，只保留独立页面 /copilot 入口 -->
    <!--
    <button
      v-if="!isOpen && !hideBubble"
      class="copilot-bubble"
      @click="open"
    >
      <i :class="'fa ' + bubbleIcon + ' bubble-icon'" aria-hidden="true"></i>
      <span class="bubble-text">{{ bubbleText }}</span>
      <span v-if="hasUnread" class="bubble-badge" />
    </button>
    -->

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
        <span v-if="canResizeBoth" class="resize-handle resize-handle-corner" @mousedown="startResize($event, 'top-left')"></span>
        <!-- Header -->
        <div class="copilot-header">
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
            <button class="header-btn" @click="openStandalone" title="Open in full page">
              <i class="fa fa-external-link" aria-hidden="true"></i>
            </button>
            <button class="header-btn" @click="close" title="Close">
              <i class="fa fa-times" aria-hidden="true"></i>
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

        <!-- Input -->
        <CopilotInput
          ref="copilotInput"
          :is-loading="isLoading"
          :disabled="isLoading || isHistoryLoading"
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
          @close="showHistory = false"
          @select="handleSelectConversation"
          @new-chat="handleNewChatFromHistory"
          @delete="handleDeleteConversation"
          @load-more="handleLoadMoreConversations"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { useAICopilot } from '@/composables/useAICopilot'
import CopilotMessages from './CopilotMessages.vue'
import CopilotInput from './CopilotInput.vue'
import CopilotRetrieveStatus from './CopilotRetrieveStatus.vue'
import CopilotHistoryPanel from './CopilotHistoryPanel.vue'

export default {
  name: 'AICopilot',
  components: { CopilotMessages, CopilotInput, CopilotRetrieveStatus, CopilotHistoryPanel },
  props: {
    bubbleIcon: { type: String, default: 'fa-commenting' },
    bubbleText: { type: String, default: 'AI Copilot' },
    layout: { type: String, default: 'default' },
  },
  data() {
    return {
      isOpen: false,
      copilot: null,
      isHistoryLoading: false,
      windowWidth: 480,
      windowHeight: 600,
      resizeState: null,
      isDragging: false,
      dragCounter: 0,
      isScreenshotMode: false,
      screenshotSelection: null,
      isSelecting: false,
      hideBubble: false,
      showHistory: false,
      conversationOffset: 0,
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
      return blocks.filter(b => b.type === 'tool' && b.toolCall?.status === 'running').map(b => b.toolCall)
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
    hasUnread() {
      const last = this.lastAssistantMessage
      return last && last.status === 'done' && !this.isOpen
    },
    windowStyle() {
      if (this.layout === 'bottom') return { height: `${this.windowHeight}px` }
      if (this.layout === 'side') return { width: `${this.windowWidth}px` }
      return {
        width: `${this.windowWidth}px`,
        height: `${this.windowHeight}px`,
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
  },
  beforeDestroy() {
    this.stopResize()
  },
  methods: {
    async open() {
      this.applyLayoutSize()
      this.isOpen = true
      this.showHistory = false
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
    },
    close() {
      this.isOpen = false
      this.showHistory = false
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
    async handleDeleteConversation(conversationId) {
      await this.copilot.deleteConversation(conversationId)
    },
    async handleLoadMoreConversations() {
      if (this.conversationsLoading || !this.conversationsHasMore) return
      this.conversationOffset += 20
      await this.copilot.loadConversations({ limit: 20, offset: this.conversationOffset, append: true })
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
      this.resizeState = {
        direction,
        startX: event.clientX,
        startY: event.clientY,
        startWidth: this.windowWidth,
        startHeight: this.windowHeight,
      }
      window.addEventListener('mousemove', this.handleResize)
      window.addEventListener('mouseup', this.stopResize)
    },
    handleResize(event) {
      if (!this.resizeState) return
      const { direction, startX, startY, startWidth, startHeight } = this.resizeState
      const minWidth = 480
      const minHeight = 420
      const maxWidth = Math.max(minWidth, window.innerWidth - 48)
      const maxHeight = Math.max(minHeight, window.innerHeight - 130)
      const nextWidth = direction.includes('left') ? startWidth + startX - event.clientX : startWidth
      const nextHeight = direction.includes('top') ? startHeight + startY - event.clientY : startHeight

      if (this.canResizeWidth) this.windowWidth = Math.min(Math.max(nextWidth, minWidth), maxWidth)
      if (this.canResizeHeight) this.windowHeight = Math.min(Math.max(nextHeight, minHeight), maxHeight)
    },
    stopResize() {
      if (!this.resizeState) return
      window.removeEventListener('mousemove', this.handleResize)
      window.removeEventListener('mouseup', this.stopResize)
      this.resizeState = null
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
      this.hideBubble = true
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

        this.hideBubble = false
        this.isOpen = true
        this.$nextTick(() => {
          this.$refs.copilotInput?.addImageFromBase64(base64, 'screenshot.png')
          this.$refs.copilotInput?.focus()
        })
      } catch (err) {
        console.error('[AICopilot] screenshot capture failed:', err)
        this.hideBubble = false
        this.isOpen = true
      }
    },
    exitScreenshotMode() {
      this.isScreenshotMode = false
      this.screenshotSelection = null
      this.isSelecting = false
      this.hideBubble = false
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
.ai-copilot {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.copilot-bubble {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #1d4ed8 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 14px 32px rgba(37, 99, 235, 0.24);
  transition: all 0.22s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  position: relative;
  color: #fff;
}

.copilot-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(37, 99, 235, 0.32);
}

.bubble-text {
  display: none;
}

.bubble-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.18);
}

.copilot-window {
  position: absolute;
  bottom: 82px;
  right: 0;
  background: #fff;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(37, 99, 235, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  z-index: 2000;
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
  z-index: 2001;
  white-space: nowrap;
}

.screenshot-selection {
  position: fixed;
  border: 2px solid #2563eb;
  background: rgba(37, 99, 235, 0.12);
  pointer-events: none;
  z-index: 2001;
}
</style>
