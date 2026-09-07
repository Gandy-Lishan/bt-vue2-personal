<template>
  <Transition name="slide-from-left">
    <div v-if="visible" class="history-panel">
      <!-- Header -->
      <div class="history-header">
        <button class="header-btn back" @click="$emit('close')" title="Back">
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </button>
        <span class="header-title">History</span>
        <div class="header-actions">
          <button class="header-btn new-chat" @click="handleNewChat" title="New chat">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
          </button>
          <button class="header-btn close" @click="$emit('close')" title="Close">
            <i class="fa fa-times" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <!-- List -->
      <div ref="listRef" class="history-list" @scroll="handleScroll">
        <!-- Capacity hint -->
        <div v-if="conversationCount >= 50" class="capacity-hint">
          <i class="fa fa-info-circle" aria-hidden="true"></i>
          <span>{{ conversationCount }} conversations. Consider deleting old ones to stay organized.</span>
        </div>

        <div
          v-for="conv in conversations"
          :key="conv.id"
          class="history-item"
          :class="{ active: conv.id === currentConversationId }"
          @click="handleSelect(conv.id)"
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
            @confirm="$emit('delete', conv.id)"
          >
            <button slot="reference" class="item-delete" title="Delete">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
            </button>
          </el-popconfirm>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="history-loading">
          <div class="spinner" />
        </div>

        <!-- Empty -->
        <div v-if="!loading && conversations.length === 0" class="history-empty">
          No conversations yet
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'CopilotHistoryPanel',
  props: {
    visible: { type: Boolean, default: false },
    conversations: { type: Array, default: () => [] },
    currentConversationId: { type: String, default: null },
    loading: { type: Boolean, default: false },
    hasMore: { type: Boolean, default: true },
    totalCount: { type: Number, default: 0 },
  },
  computed: {
    conversationCount() {
      return this.totalCount || this.conversations.length
    },
  },
  data() {
    return {
      hoveredId: null,
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.hoveredId = null
        this.$nextTick(() => {
          this.$refs.listRef?.scrollTo(0, 0)
        })
      }
    },
  },
  methods: {
    handleSelect(conversationId) {
      this.$emit('select', conversationId)
    },
    handleNewChat() {
      this.$emit('new-chat')
    },
    handleScroll() {
      const el = this.$refs.listRef
      if (!el || this.loading || !this.hasMore) return
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40
      if (nearBottom) {
        this.$emit('load-more')
      }
    },
    formatTime(iso) {
      if (!iso) return ''
      // MySQL returns datetime without timezone info (UTC).
      // Append 'Z' so new Date() treats it as UTC, not local time.
      const utcIso = iso.endsWith('Z') ? iso : iso + 'Z'
      const d = new Date(utcIso)
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
.history-panel {
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.history-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 18px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.15s;
}

.header-btn:hover {
  background: #f3f4f6;
  color: #2563eb;
}

/* List */
.history-list {
  flex: 1;
  overflow-y: auto;
}

.capacity-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 12px;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #f0f0f0;
}
.capacity-hint .fa {
  color: #f59e0b;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}

.history-item:hover {
  background: #f3f4f6;
}
/*
.history-item.active {
  background: #eff6ff;
} */

.item-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
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

.history-item:hover .item-delete {
  opacity: 1;
}

.item-delete:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* Loading */
.history-loading {
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

/* Empty */
.history-empty {
  text-align: center;
  padding: 40px 16px;
  font-size: 13px;
  color: #9ca3af;
}

/* Transition: slide from left */
.slide-from-left-enter-active,
.slide-from-left-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s;
}

.slide-from-left-enter-from,
.slide-from-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
