<template>
  <div v-if="displayMessage" class="retrieve-status" :class="statusTone">
    <span class="status-dot" />
    <span class="status-label">{{ displayMessage }}</span>
  </div>
</template>

<script>
export default {
  name: 'CopilotRetrieveStatus',
  props: {
    statuses: { type: Array, default: () => [] },
    toolCalls: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    isStreaming: { type: Boolean, default: false },
  },
  data() {
    return {
      elapsedMs: 0,
      timerId: null,
    }
  },
  computed: {
    lastStatus() {
      return this.statuses[this.statuses.length - 1] || null
    },
    statusMessage() {
      // Active tool calls take priority
      if (this.toolCalls.length > 0) {
        const tool = this.toolCalls[0]
        const name = tool.name || ''
        const formatted = name.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
        return `Running ${formatted}...`
      }
      if (this.isStreaming || this.lastStatus?.type === 'assessing') return 'Generating response...'
      const type = this.lastStatus?.type
      if (type === 'initial') return 'Analyzing request...'
      if (type === 'retrieving') return 'Searching knowledge base...'
      if (type === 'completed') return ''
      if (type === 'error') return this.cleanMessage(this.lastStatus)
      if (type === 'insufficient') return 'Knowledge base has limited info'
      if (this.isLoading) return 'Thinking...'
      return ''
    },
    statusTone() {
      if (this.toolCalls.length > 0) return 'tool-running'
      if (this.isStreaming || this.lastStatus?.type === 'assessing') return 'generating'
      if (this.lastStatus?.type === 'retrieving') return 'retrieving'
      if (this.lastStatus?.type === 'insufficient') return 'warning'
      return 'thinking'
    },
    displayMessage() {
      if (!this.statusMessage) return ''
      const s = Math.floor(this.elapsedMs / 1000)
      const ms = Math.floor((this.elapsedMs % 1000) / 100)
      return `${this.statusMessage} (${s}.${ms}s)`
    },
    isActive() {
      return this.isLoading || this.isStreaming || Boolean(this.lastStatus && this.lastStatus.type !== 'completed')
    },
  },
  watch: {
    isActive(val, oldVal) {
      if (val && !oldVal) {
        this.startTimer()
      } else if (!val) {
        this.stopTimer()
      }
    },
  },
  mounted() {
    if (this.isActive) this.startTimer()
  },
  beforeDestroy() {
    this.stopTimer()
  },
  methods: {
    startTimer() {
      this.elapsedMs = 0
      this.stopTimer()
      this.timerId = setInterval(() => {
        this.elapsedMs += 100
      }, 100)
    },
    stopTimer() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
    },
    cleanMessage(status) {
      return status.message || ''
    }
  }
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
  /* border-top and background removed — status now lives inside the input container */
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
