<template>
  <div class="tool-result-list">
    <details
      v-for="(toolCall, index) in toolCalls"
      :key="toolCall.id || `tool-${index}`"
      class="tool-line"
      :class="toolCall.status"
      :open="isExpanded(toolCall.id || index)"
    >
      <summary class="tool-line-content" @click.prevent="toggle(toolCall.id || index)">
        <span class="tool-status-icon">
          <i :class="statusIcon(toolCall.status)" aria-hidden="true"></i>
        </span>
        <span class="tool-name" :title="toolCall.display_name || displayName(toolCall.name)">
          {{ toolCall.display_name || displayName(toolCall.name) }}
        </span>
      </summary>

      <div v-if="toolCall.input || toolCall.output" class="tool-detail">
        <div v-if="toolCall.input && Object.keys(toolCall.input).length > 0" class="tool-section">
          <div class="section-label">Arguments</div>
          <pre class="section-code">{{ formatContent(toolCall.input) }}</pre>
        </div>
        <div v-if="toolCall.output" class="tool-section">
          <div class="section-label">Result</div>
          <pre class="section-code result-code">{{ formatContent(toolCall.output) }}</pre>
        </div>
        <div v-if="toolCall.status === 'error' && !toolCall.output" class="tool-error">
          Tool execution failed.
        </div>
      </div>
    </details>
  </div>
</template>

<script>
const STATUS_ICONS = {
  pending: 'fa fa-circle-o-notch',
  running: 'fa fa-circle-o-notch fa-spin',
  calling: 'fa fa-circle-o-notch fa-spin',
  completed: 'fa fa-check',
  error: 'fa fa-times',
}

// camelCase display names for tool badges
const TOOL_DISPLAY_NAMES = {
  retrieve_knowledge_base: 'searchKnowledgeBase',
  fetch_sentimentrader_data: 'fetchIndicatorData',
  run_sentimentrader_script: 'runAnalysis',
  list_sentimentrader_scripts: 'listScripts',
  run_cpm_backtest: 'runCpmBacktest',
}

export default {
  name: 'CopilotToolResult',
  props: {
    toolCalls: { type: Array, default: () => [] }
  },
  data() {
    return {
      expandedMap: {},
    }
  },
  methods: {
    displayName(name) {
      if (TOOL_DISPLAY_NAMES[name]) return TOOL_DISPLAY_NAMES[name]
      return (name || '').replace(/^[a-z]+_/, '').replace(/_/g, ' ')
    },
    statusIcon(status) {
      return STATUS_ICONS[status] || '•'
    },
    isExpanded(key) {
      return this.expandedMap[key] || false
    },
    toggle(key) {
      this.$set(this.expandedMap, key, !this.expandedMap[key])
    },
    formatContent(content) {
      if (typeof content === 'string') return content
      try {
        return JSON.stringify(content, null, 2)
      } catch {
        return String(content)
      }
    }
  }
}
</script>

<style scoped>
.tool-result-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin: 0 0 8px 0;
  color: #64748b;
  font-size: 12.4px;
}

/* Lightweight inline tool line — no card borders */
.tool-line {
  display: flex;
  flex-direction: column;
}

.tool-line summary {
  list-style: none;
}

.tool-line summary::-webkit-details-marker {
  display: none;
}

.tool-line-content {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
  margin-left: -4px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12.4px;
  line-height: 1.25;
  font-weight: 600;
  transition: color 0.15s;
}

.tool-line-content:hover {
  color: #374151;
}

.tool-status-icon {
  display: flex;
  align-items: center;
  width: 16px;
  justify-content: center;
  flex-shrink: 0;
}

.tool-status-icon .fa-check {
  color: #10b981;
  font-size: 13px;
}

.tool-status-icon .fa-circle-o-notch {
  color: #3b82f6;
  font-size: 12px;
}

.tool-status-icon .fa-times {
  color: #9ca3af;
  font-size: 13px;
}

.tool-name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Error state */
.tool-line.error .tool-name {
  color: #9ca3af;
}

/* Expanded detail section */
.tool-detail {
  margin: 6px 0 8px 18px;
  padding: 0 10px;
}

.tool-section {
  margin-bottom: 10px;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-label {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
  font-weight: 600;
}

.section-code {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  color: #374151;
  margin: 0;
}

.section-code.result-code {
  max-height: 200px;
  overflow-y: auto;
}

.tool-error {
  font-size: 12px;
  color: #9ca3af;
}
</style>
