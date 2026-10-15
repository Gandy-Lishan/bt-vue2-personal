<template>
  <div v-if="statusText" class="retrieve-status" :class="statusTone">
    <span class="status-dot" />
    <span class="status-label">{{ statusText }} {{ isActive ? elapsedDisplay : '' }}</span>
  </div>
</template>

<script>
export default {
  name: 'CopilotRetrieveStatus',
  props: {
    statuses: { type: Array, default: () => [] },
    toolCalls: { type: Array, default: () => [] },
    latestReasoning: { type: String, default: '' },
    isLoading: { type: Boolean, default: false },
    isStreaming: { type: Boolean, default: false },
  },
  data() {
    return {
      elapsedMs: 0,
      timerId: null,
      _startedAt: 0,
      _hiddenAt: 0,
      _backgroundMs: 0,
      _visibilityHandler: null,
    }
  },
  computed: {
    lastStatus() {
      return this.statuses[this.statuses.length - 1] || null
    },
    isActive() {
      return this.isLoading || this.isStreaming || Boolean(this.lastStatus && this.lastStatus.type !== 'completed')
    },
    statusText() {
      if (!this.isActive) return ''

      if (this.toolCalls.length > 0) {
        const names = this.toolCalls.map(tool => {
          const name = tool.name || ''
          return name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
        })
        if (names.length === 1) return `Running ${names[0]}...`
        return `Running ${names.join(', ')}...`
      }
      if (this.isStreaming || this.lastStatus?.type === 'assessing') return 'Generating response...'
      if (!this.isLoading && !this.isStreaming && (!this.lastStatus || this.lastStatus.type === 'completed')) return ''

      const type = this.lastStatus?.type
      if (type === 'initial') return 'Analyzing request...'
      if (type === 'retrieving') return 'Searching knowledge base...'
      if (type === 'completed') return ''
      if (type === 'error') return this.lastStatus.message || ''
      if (type === 'insufficient') return 'Knowledge base has limited info'
      if (this.lastStatus?.message) return this.lastStatus.message

      if (this.latestReasoning) {
        const text = this.latestReasoning.trim()
        if (text) return text.length > 60 ? text.slice(0, 60) + '…' : text
      }
      return 'Thinking...'
    },
    statusTone() {
      if (this.toolCalls.length > 0) return 'tool-running'
      if (!this.isActive) return ''
      if (this.lastStatus?.type === 'assessing') return 'generating'
      if (this.lastStatus?.type === 'retrieving') return 'retrieving'
      if (this.lastStatus?.type === 'insufficient') return 'warning'
      if (this.latestReasoning) return 'thinking'
      return 'thinking'
    },
    elapsedDisplay() {
      const s = Math.floor(this.elapsedMs / 1000)
      const ms = Math.floor((this.elapsedMs % 1000) / 100)
      return `(${s}.${ms}s)`
    },
  },
  watch: {
    isActive(val, oldVal) {
      if (val && !oldVal) this.startTimer()
      else if (!val) this.stopTimer()
    },
  },
  mounted() {
    if (this.isActive) this.startTimer()
    this._visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        if (this._hiddenAt) {
          this._backgroundMs += Date.now() - this._hiddenAt
          this._hiddenAt = 0
        }
        if (this._startedAt) {
          this._tickElapsed()
        }
      } else {
        this._hiddenAt = Date.now()
      }
    }
    document.addEventListener('visibilitychange', this._visibilityHandler)
  },
  beforeDestroy() {
    this.stopTimer()
    document.removeEventListener('visibilitychange', this._visibilityHandler)
  },
  methods: {
    startTimer() {
      this.elapsedMs = 0
      this._startedAt = Date.now()
      this._hiddenAt = 0
      this._backgroundMs = 0
      this.stopTimer()
      this.timerId = setInterval(() => {
        this._tickElapsed()
      }, 100)
    },
    stopTimer() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
      this._hiddenAt = 0
      this._backgroundMs = 0
    },
    _tickElapsed() {
      const now = Date.now()
      const currentBackgroundMs = this._hiddenAt ? now - this._hiddenAt : 0
      this.elapsedMs = now - this._startedAt - this._backgroundMs - currentBackgroundMs
    },
  },
}
</script>

<style scoped>
.retrieve-status {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 22px;
  padding: 2px 0 4px;
  font-size: 12px;
  color: #64748b;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 1.2s ease-in-out infinite;
  flex-shrink: 0;
}

.status-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.retrieve-status.thinking {
  color: #3b82f6;
}

.retrieve-status.generating {
  color: #8b5cf6;
}

.retrieve-status.retrieving {
  color: #f59e0b;
}

.retrieve-status.tool-running {
  color: #10b981;
}

.retrieve-status.warning {
  color: #f97316;
}

@keyframes pulse {
  0%, 100% { opacity: 0.35; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.15); }
}
</style>
