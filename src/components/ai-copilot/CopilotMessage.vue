<template>
  <div class="message-row" :class="message.role" :data-message-id="message.id">
    <!-- Avatar -->
    <div class="message-avatar">
      <img v-if="!isUser" src="/assets/avatar-sentimen.png" alt="AI Copilot" />
      <i v-else class="fa fa-user" aria-hidden="true"></i>
    </div>

    <!-- Content -->
    <div class="message-main">
      <!-- Meta (hidden for now) -->
      <!-- <div class="message-meta">
        <span class="meta-role">{{ isUser ? 'You' : 'AI Copilot' }}</span>
        <span class="meta-time">{{ formatTime(message.timestamp) }}</span>
      </div> -->

      <!-- Bubble -->
      <div class="message-bubble" :class="{ 'editing': isUser && isEditing }">
        <!-- User: plain text + attachments -->
        <template v-if="isUser">
          <div v-if="message.attachments && message.attachments.length" class="attachments">
            <div v-for="att in message.attachments" :key="att.id" class="attachment">
              <img v-if="att.type === 'image'" :src="att.url" :alt="att.name" class="clickable-preview" @click="openPreview(att.url)" />
              <div v-else class="attachment-file"><i class="fa fa-paperclip" aria-hidden="true"></i> {{ att.name }}</div>
            </div>
          </div>
          <template v-if="isEditing">
            <div class="edit-bubble">
              <textarea v-model="editContent" class="edit-input" ref="editTextarea" rows="1" />
            </div>
          </template>
          <template v-else>
            <div v-if="contentImages.length" class="attachments">
              <div v-for="(img, idx) in contentImages" :key="'img-' + idx" class="attachment">
                <img :src="img.url" alt="uploaded image" class="clickable-preview" @click="openPreview(img.url)" />
              </div>
            </div>
            <p class="user-text">{{ contentText }}</p>
          </template>
        </template>

        <!-- Assistant: unified Thought + Content + Tool Call (interleaved) -->
        <template v-else>
          <!-- Duration header + toggle chevron -->
          <div
            v-if="durationText || hasThinkingBlocks || _streamStatusText || message.status === 'pending' || message.status === 'streaming'"
            class="duration-label"
            :class="{ 'has-toggle': hasThinkingBlocks }"
            @click="hasThinkingBlocks && toggleThoughts()"
          >
            <!-- 流状态文本：始终渲染，RAF 直接控制内容和显隐，绕过 Vue 异步刷新 -->
            <span ref="streamingStatusSpan" class="streaming-status">{{ _streamStatusText }}</span>
            <span v-if="!_streamStatusText && durationText">{{ durationText }}</span>
            <i
              v-if="hasThinkingBlocks"
              :class="thoughtsOpen ? 'fa fa-chevron-up' : 'fa fa-chevron-down'"
              aria-hidden="true"
            ></i>
          </div>

          <!-- Collapsible thinking area: blocks in stream order -->
          <!-- When done, the last content block is extracted as final answer (see below) -->
          <div v-show="thoughtsOpen" class="thoughts-body" v-if="hasThinkingBlocks">
            <div v-for="(block, bi) in message.blocks || []" :key="'t_' + bi" v-if="!isFinalAnswer(bi)">
              <details v-if="block.type === 'reasoning'" class="thought-block" :open="isReasoningOpen(bi)">
                <summary class="thought-header">
                  <span class="thought-label">Thought</span>
                  <i class="fa fa-chevron-down thought-chevron" aria-hidden="true"></i>
                </summary>
                <div class="thought-content">
                  <p class="thought-text">{{ block.content }}</p>
                </div>
              </details>
              <CopilotToolResult
                v-else-if="block.type === 'tool'"
                :tool-calls="[block.toolCall]"
              />
              <CopilotMarkdown
                v-else-if="block.type === 'content'"
                class="inline-content"
                :content="block.content"
                :status="message.status"
                :error="message.error"
                :has-activity="false"
              />
            </div>
          </div>

          <!-- Final answer: extracted from blocks after stream completes -->
          <div v-if="hasFinalAnswer" class="final-answer-wrapper">
            <CopilotMarkdown
              class="final-answer"
              :content="message.blocks[lastContentIndex].content"
              :status="message.status"
              :error="message.error"
              :has-activity="false"
            />
          </div>

          <!-- Error state: show error even for empty placeholder messages -->
          <CopilotMarkdown
            v-if="!isUser && message.status === 'error' && message.error && !contentText && !hasContentBlocks"
            :content="message.error"
            :status="message.status"
            :error="message.error"
            :has-activity="false"
          />

          <!-- Fallback: legacy messages without content blocks render content at the bottom -->
          <CopilotMarkdown
            v-if="contentText && !hasContentBlocks"
            :content="message.content"
            :status="message.status"
            :error="message.error"
            :has-activity="hasActivity"
          />
        </template>
      </div>

      <!-- Edit actions (outside bubble) -->
      <div v-if="isUser && isEditing" class="edit-actions">
        <button class="edit-btn cancel" @click="cancelEdit">Cancel</button>
        <button class="edit-btn update" :disabled="!editContent.trim() || isEditContentUnchanged" @click="saveEdit">Update</button>
      </div>

      <!-- Actions -->
      <div class="message-actions" v-show="!isEditing">
        <el-tooltip content="Copy to clipboard" placement="top" :open-delay="300">
          <button class="action-btn" @click="copyContent">
            <i :class="copied ? 'fa fa-check' : 'fa fa-copy'" aria-hidden="true"></i>
          </button>
        </el-tooltip>
        <el-tooltip v-if="isUser && isLastUserMessage && !isEditing" content="Edit message" placement="top" :open-delay="300">
          <button class="action-btn" @click="startEdit">
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </button>
        </el-tooltip>
        <el-tooltip v-if="!isUser && isLastAssistantMessage" content="Regenerate response" placement="top" :open-delay="300">
          <button class="action-btn" @click="regenerate">
            <i class="fa fa-refresh" aria-hidden="true"></i>
          </button>
        </el-tooltip>
        <!-- Feedback buttons (assistant only) -->
        <template v-if="!isUser">
          <el-tooltip content="Good response" placement="top" :open-delay="300">
            <button
              class="action-btn"
              :class="{ active: feedback === 1 }"
              @click="submitFeedback(1)"
            >
              <i class="fa fa-thumbs-up" aria-hidden="true"></i>
            </button>
          </el-tooltip>
          <el-tooltip content="Bad response" placement="top" :open-delay="300">
            <button
              class="action-btn"
              :class="{ active: feedback === -1 }"
              @click="submitFeedback(-1)"
            >
              <i class="fa fa-thumbs-down" aria-hidden="true"></i>
            </button>
          </el-tooltip>
          <el-tooltip v-if="message.sources && message.sources.length" placement="top" :open-delay="200" :hide-after="0" popper-class="sources-tooltip">
            <template #content>
              <div class="tooltip-sources-list">
                <div class="tooltip-sources-title">参考来源</div>
                <div v-for="(src, idx) in message.sources" :key="idx" class="tooltip-source-item">
                  <span class="tooltip-source-index">{{ idx + 1 }}</span>
                  <span class="tooltip-source-name">{{ src.title || src.source }}</span>
                  <span v-if="src.score" class="tooltip-source-score">{{ (src.score * 100).toFixed(0) }}%</span>
                </div>
              </div>
            </template>
            <button class="action-btn sources-btn" disabled>
              <i class="fa fa-book" aria-hidden="true"></i>
              <span class="source-badge">{{ message.sources.length }}</span>
            </button>
          </el-tooltip>
        </template>
        <el-tooltip content="Delete message" placement="top" :open-delay="300">
          <button v-if="canDelete" class="action-btn danger" @click="deleteMessage">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
        </el-tooltip>
      </div>
    </div>

    <!-- Image preview modal -->
    <ImagePreview
      :visible="previewVisible"
      :src="previewUrl"
      @close="previewVisible = false"
    />
  </div>
</template>

<script>
import CopilotToolResult from './CopilotToolResult.vue'
import CopilotMarkdown from './CopilotMarkdown.vue'
import ImagePreview from '../common/ImagePreview.vue'

export default {
  name: 'CopilotMessage',
  components: { CopilotToolResult, CopilotMarkdown, ImagePreview },
  props: {
    message: { type: Object, required: true },
    isLastUserMessage: { type: Boolean, default: false },
    isLastAssistantMessage: { type: Boolean, default: false },
  },
  data() {
    return {
      copied: false,
      isEditing: false,
      editContent: '',
      feedback: null,
      expandedMap: {},
      thoughtsManualOpen: null,
      _streamStartedAt: 0,
      _streamRafId: null,
      _streamStatusText: '',
      previewVisible: false,
      previewUrl: '',
    }
  },
  mounted() {
    this.feedback = this.message.user_feedback || null
    if (this.message.status === 'pending' || this.message.status === 'streaming') {
      this._startStreamTimer()
    }
  },
  beforeDestroy() {
    this._stopStreamTimer()
  },
  watch: {
    'message.status'(newStatus) {
      if (newStatus === 'pending' || newStatus === 'streaming') {
        this._startStreamTimer()
      } else if (newStatus === 'done' || newStatus === 'error') {
        this._stopStreamTimer()
      }
    },
  },
  computed: {
    /** Auto-collapse when done, expand when streaming. User can override via toggle. */
    thoughtsOpen() {
      if (this.thoughtsManualOpen !== null) return this.thoughtsManualOpen
      return this.message.status === 'streaming' || this.message.status === 'pending'
    },
    isUser() {
      return this.message.role === 'user'
    },
    canDelete() {
      return this.message.id && this.message.status !== 'pending' && this.message.status !== 'streaming'
    },
    hasActivity() {
      return Boolean(
        (this.message.toolCalls && this.message.toolCalls.length) ||
        (this.message.retrieveStatuses && this.message.retrieveStatuses.length) ||
        (this.message.reasoning_chunks && this.message.reasoning_chunks.length)
      )
    },
    hasContentBlocks() {
      return (this.message.blocks || []).some(b => b.type === 'content')
    },
    /** Index of the last content block — only meaningful after stream completes. */
    lastContentIndex() {
      const blocks = this.message.blocks || []
      for (let i = blocks.length - 1; i >= 0; i--) {
        if (blocks[i].type === 'content') return i
      }
      return -1
    },
    /** True when stream finished and there's a content block to extract as final answer. */
    hasFinalAnswer() {
      return this.message.status === 'done' && this.lastContentIndex >= 0
    },
    /** True if there are thinking blocks (reasoning or tool blocks). */
    hasThinkingBlocks() {
      return (this.message.blocks || []).some(b => b.type === 'reasoning' || b.type === 'tool')
    },
    durationText() {
      if (!this.message.startedAt || !this.message.completedAt) return ''
      const ms = this.message.completedAt - this.message.startedAt
      if (ms <= 0) return ''
      const totalSec = Math.floor(ms / 1000)
      if (totalSec < 60) return `Worked for ${totalSec}s`
      const m = Math.floor(totalSec / 60)
      const s = totalSec % 60
      return `Worked for ${m}m ${s}s`
    },
    isEditContentUnchanged() {
      return this.editContent.trim() === this.contentText
    },
    contentText() {
      const c = this.message.content
      if (typeof c === 'string') return c
      if (!Array.isArray(c)) return ''
      const texts = []
      for (const part of c) {
        if (typeof part === 'object' && part !== null && part.type === 'text') {
          texts.push(part.text || '')
        }
      }
      return texts.join('\n')
    },
    contentImages() {
      const c = this.message.content
      if (!Array.isArray(c)) return []
      const images = []
      for (const part of c) {
        if (typeof part === 'object' && part !== null && part.type === 'image_url') {
          const url = part.image_url?.url || part.image_url || ''
          if (url) images.push({ url })
        }
      }
      return images
    }
  },
  methods: {
    _startStreamTimer() {
      this._stopStreamTimer()
      this._streamStartedAt = Date.now()
      this._streamLoop()
    },
    _stopStreamTimer() {
      if (this._streamRafId) {
        cancelAnimationFrame(this._streamRafId)
        this._streamRafId = null
      }
      this._streamStatusText = ''
      const el = this.$refs.streamingStatusSpan
      if (el) el.style.display = 'none'
    },
    _streamLoop() {
      this._updateStreamDisplay()
      this._streamRafId = requestAnimationFrame(this._streamLoop.bind(this))
    },
    _updateStreamDisplay() {
      const elapsed = Date.now() - this._streamStartedAt
      const s = Math.floor(elapsed / 1000)
      const ms = Math.floor((elapsed % 1000) / 100)
      const timeStr = `(${s}.${ms}s)`

      const toolCalls = (this.message.blocks || [])
        .filter(b => b.type === 'tool' && b.toolCall?.status !== 'completed')
        .map(b => b.toolCall)

      if (toolCalls.length > 0) {
        const names = toolCalls.map(t => (t.name || '').replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()))
        this._streamStatusText = `Running ${names.length === 1 ? names[0] : names.join(', ')}... ${timeStr}`
      } else if (this.message.status === 'streaming') {
        this._streamStatusText = `Generating response... ${timeStr}`
      } else {
        const statuses = this.message.retrieveStatuses || []
        const last = statuses[statuses.length - 1] || null
        const type = last?.type
        if (type === 'initial') this._streamStatusText = `Analyzing request... ${timeStr}`
        else if (type === 'retrieving') this._streamStatusText = `Searching knowledge base... ${timeStr}`
        else if (type === 'completed') this._streamStatusText = ''
        else if (type === 'error') this._streamStatusText = `${last.message || ''} ${timeStr}`
        else if (type === 'insufficient') this._streamStatusText = `Knowledge base has limited info ${timeStr}`
        else if (last?.message) this._streamStatusText = `${last.message} ${timeStr}`
        else {
          const chunks = this.message.reasoning_chunks || []
          const reasoning = chunks.length ? chunks[chunks.length - 1].content : ''
          if (reasoning?.trim()) {
            const t = reasoning.trim()
            this._streamStatusText = `${t.length > 60 ? t.slice(0, 60) + '…' : t} ${timeStr}`
          } else {
            this._streamStatusText = `Thinking... ${timeStr}`
          }
        }
      }

      const el = this.$refs.streamingStatusSpan
      if (el) {
        el.textContent = this._streamStatusText
        el.style.display = this._streamStatusText ? '' : 'none'
      }
    },
    toggleThoughts() {
      this.thoughtsManualOpen = !this.thoughtsOpen
    },
    formatTime(ts) {
      const d = new Date(ts)
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    async copyContent() {
      const text = this.contentText
      try {
        await navigator.clipboard.writeText(text)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2000)
      } catch {
        // fallback
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2000)
      }
    },
    regenerate() {
      this.$emit('regenerate')
    },
    deleteMessage() {
      this.$emit('delete-message', this.message)
    },
    startEdit() {
      this.isEditing = true
      this.editContent = this.contentText
      this.$nextTick(() => {
        if (this.$refs.editTextarea) {
          this.$refs.editTextarea.focus()
        }
      })
    },
    saveEdit() {
      const trimmed = this.editContent.trim()
      if (!trimmed || trimmed === this.contentText) {
        this.cancelEdit()
        return
      }
      this.$emit('edit-message', { message: this.message, newContent: trimmed })
      this.isEditing = false
    },
    cancelEdit() {
      this.isEditing = false
      this.editContent = ''
    },
    async submitFeedback(value) {
      // Toggle: clicking same value removes feedback
      const newFeedback = this.feedback === value ? null : value
      this.feedback = newFeedback

      // Update local message state
      this.$emit('update-feedback', {
        messageId: this.message.id,
        feedback: newFeedback === 1 ? 1 : newFeedback === -1 ? -1 : 0,
      })
    },
    toggleItem(key) {
      this.$set(this.expandedMap, key, !this.expandedMap[key])
    },
    /** Whether this block index is the final answer content block (only when done). */
    isFinalAnswer(bi) {
      return this.message.status === 'done' && bi === this.lastContentIndex
    },
    /** Thought block open state.
     *  During streaming: open if the following tool blocks haven't completed yet
     *    (status is pending or running) — meaning this is the current thinking round.
     *  After done: all collapsed. */
    isReasoningOpen(bi) {
      const blocks = this.message.blocks || []
      if (this.message.status !== 'pending' && this.message.status !== 'streaming') return false
      for (let i = bi + 1; i < blocks.length; i++) {
        if (blocks[i].type === 'tool') {
          const tc = blocks[i].toolCall
          // If the tool is still pending/running, this reasoning is current → keep open
          if (tc && (tc.status === 'pending' || tc.status === 'running')) return true
          // Tool completed → this reasoning is past → collapse
          return false
        }
      }
      return true
    },
    openPreview(url) {
      this.previewUrl = url
      this.previewVisible = true
    },
  }
}
</script>

<style scoped>
.message-row {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 100%;
  min-width: 0;
}

.message-row.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 4px;
}

.message-avatar img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.message-row.user .message-avatar {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #1d4ed8 100%);
  color: #fff;
  display: none;
}

.message-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 80%;
  min-width: 0;
}

.message-row.user .message-main {
  align-items: flex-end;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.meta-role {
  font-weight: 600;
  color: #374151;
}

.meta-time {
  color: #9ca3af;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
}

/* User 消息：保留右侧气泡 */
.message-row.user .message-bubble {
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #1d4ed8 100%);
  color: #fff;
  border-bottom-right-radius: 6px;
  /* box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18); */
}

/* 编辑态：隐藏蓝色气泡背景 */
.message-row.user .message-bubble.editing {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

/* Assistant 消息：无框文档流式布局（参考 Gemini / 豆包） */
.message-row.assistant .message-main {
  max-width: 100%;
  min-width: 0;
}

.message-row.assistant .message-bubble {
  background: transparent;
  border: none;
  box-shadow: none;
  border-radius: 0;
  padding: 0;
}

/* 内容元素间距 */
.message-row.assistant .message-bubble :deep(.markdown-body p) {
  margin: 0 0 16px 0;
  line-height: 1.75;
}

.message-row.assistant .message-bubble :deep(.markdown-body h1),
.message-row.assistant .message-bubble :deep(.markdown-body h2),
.message-row.assistant .message-bubble :deep(.markdown-body h3),
.message-row.assistant .message-bubble :deep(.markdown-body h4) {
  margin: 24px 0 12px 0;
  font-weight: 700;
  color: #111827;
}

.message-row.assistant .message-bubble :deep(.markdown-body h2) {
  font-size: 18px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 8px;
}

.message-row.assistant .message-bubble :deep(.markdown-body h3) {
  font-size: 16px;
}

.message-row.assistant .message-bubble :deep(.markdown-body ul),
.message-row.assistant .message-bubble :deep(.markdown-body ol) {
  margin: 12px 0;
  padding-left: 28px;
}

.message-row.assistant .message-bubble :deep(.markdown-body li) {
  margin: 8px 0;
}

.message-row.assistant .message-bubble :deep(.markdown-body pre) {
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  background: #f8fafc;
}

.message-row.assistant .message-bubble :deep(.markdown-body table) {
  border-color: #e2e8f0;
  margin: 20px 0;
}

.message-row.assistant .message-bubble :deep(.markdown-body th) {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.message-row.assistant .message-bubble :deep(.markdown-body td) {
  border-color: #f1f5f9;
}

/* Tool lines — no styling needed, CopilotToolResult handles it */

.message-row.assistant .message-bubble :deep(.section-code) {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
}

/* Meta 信息 */
.message-row.assistant .message-meta {
  margin-bottom: 4px;
}

/* 参考来源 — action bar 按钮 */
.sources-btn {
  position: relative;
}
.sources-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.source-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  border-radius: 7px;
  background: #2563eb;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Tooltip 内来源列表 */
.sources-tooltip {
  min-width: 0 !important;
}

.tooltip-sources-list {
  padding: 4px 0;
}

.tooltip-sources-title {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 2px 12px 6px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 4px;
}

.tooltip-source-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  font-size: 12px;
}

.tooltip-source-item:hover {
  background: #f8fafc;
}

.tooltip-source-index {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: #e2e8f0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  flex-shrink: 0;
}

.tooltip-source-name {
  color: #475569;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tooltip-source-score {
  color: #94a3b8;
  font-size: 11px;
  flex-shrink: 0;
}

/* Action 按钮 */
.message-row.assistant .message-actions {
  margin-top: 4px;
}

.user-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.edit-bubble {
  background: #f5f5f5;
  border: 2px solid #2563eb;
  border-radius: 24px;
  padding: 12px 20px;
  max-width: 100%;
}

.edit-input {
  width: 100%;
  border: none;
  background: transparent;
  color: #111827;
  font-size: 15px;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  outline: none;
  min-height: 24px;
  max-height: 200px;
  overflow-y: auto;
  box-sizing: border-box;
}

.edit-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-right: 4px;
}

.edit-btn {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.edit-btn.cancel {
  background: transparent;
  color: #6b7280;
}

.edit-btn.cancel:hover {
  background: #f3f4f6;
  color: #374151;
}

.edit-btn.update {
  background: #2563eb;
  color: #fff;
}

.edit-btn.update:hover:not(:disabled) {
  background: #1d4ed8;
}

.edit-btn.update:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.attachment img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.attachment img.clickable-preview {
  cursor: pointer;
}

.attachment-file {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  font-size: 12px;
}

.message-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-row:hover .message-actions {
  opacity: 1;
}

.action-btn {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #eff6ff;
  border-color: #dbeafe;
  color: #2563eb;
}

.action-btn.danger:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.action-btn.active {
  background: #eff6ff;
  border-color: #dbeafe;
  color: #2563eb;
}

/* Duration header + toggle chevron */
.duration-label {
  font-size: 12.4px;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.streaming-status:empty {
  display: none;
}

.duration-label.has-toggle {
  cursor: pointer;
  padding: 2px 4px;
  margin-left: -4px;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}

.duration-label.has-toggle:hover {
  color: #374151;
  background: #f1f5f9;
}

.duration-label.has-toggle i {
  font-size: 10px;
  transition: transform 0.15s;
}

/* Collapsible thinking area */
.thoughts-body {
  margin-bottom: 8px;
}

/* Thought block — native details/summary, muted compact style */
.thought-block {
  margin-bottom: 4px;
  color: #64748b;
  font-size: 12.4px;
}

.thought-block summary {
  list-style: none;
}

.thought-block summary::-webkit-details-marker {
  display: none;
}

.thought-header {
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  padding: 2px 4px;
  margin-left: -4px;
  border-radius: 4px;
  cursor: pointer;
  transition: color 0.15s;
  font-weight: 600;
  line-height: 1;
}

.thought-header:hover {
  color: #374151;
}

.thought-chevron {
  font-size: 10px;
  color: #94a3b8;
  transition: transform 0.2s;
}

.thought-block[open] .thought-chevron {
  transform: rotate(180deg);
}

.thought-content {
  margin: 8px 0 10px 6px;
  padding-left: 10px;
  border-left: 1px solid #e2e8f0;
}

.thought-text {
  margin: 0;
  font-size: 12.4px;
  line-height: 1.5;
  color: #475569;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Inline content between thoughts/tools */
.inline-content {
  color: #111827;
  font-size: 14px;
  margin: 8px 0;
}

/* Final answer wrapper — visually separated from thinking area */
.final-answer-wrapper {
  margin-top: 16px;
}
</style>
