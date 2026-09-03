<template>
  <div class="messages-wrapper">
    <div class="messages-container" ref="scrollRef">
      <!-- Empty state -->
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-icon"><i class="fa fa-commenting" aria-hidden="true"></i></div>
        <h3>AI Copilot</h3>
        <p>Ask me anything about SentimenTrader tools, correlation, seasonality, and more.</p>

        <!-- 精选推荐 -->
        <div class="example-section">
          <div class="section-label"><i class="fa fa-star" aria-hidden="true"></i> Recommended</div>
          <button v-for="(ex, i) in recommendedExamples" :key="'rec-' + i" @click="$emit('example-click', ex.text)">
            <span class="example-text">{{ ex.text }}</span>
          </button>
        </div>

        <!-- 板块分组 -->
        <div v-for="mod in moduleExamples" :key="mod.key" class="example-section">
          <button class="module-header" @click="toggleModule(mod)">
            <i :class="'fa ' + mod.icon + ' module-icon'" aria-hidden="true"></i>
            <span class="module-label">{{ mod.label }}</span>
            <i :class="mod.expanded ? 'fa fa-chevron-up' : 'fa fa-chevron-down'" class="module-arrow" aria-hidden="true"></i>
          </button>
          <div v-show="mod.expanded" class="module-questions">
            <div v-for="(q, i) in mod.questions" :key="mod.key + '-' + i" @click="$emit('example-click', q)" class="module-questions-item">
              <span>{{ q }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message list -->
      <div v-if="messages.length > 0" class="message-list">
        <CopilotMessage
          v-for="(msg, index) in messages"
          :key="msg.id || index"
          :message="msg"
          :is-last-user-message="msg.role === 'user' && msg.id === lastUserMessageId"
          :is-last-assistant-message="msg.role === 'assistant' && msg.id === lastAssistantMessageId"
          @regenerate="$emit('regenerate')"
          @delete-message="$emit('delete-message', $event)"
          @edit-message="$emit('edit-message', $event)"
          @update-feedback="$emit('update-feedback', $event)"
        />

        <!-- Bottom anchor for scroll -->
        <div ref="bottomRef" class="bottom-anchor" />
      </div>
    </div>

    <!-- History loading overlay -->
    <div v-if="isHistoryLoading" class="history-overlay">
      <div class="history-spinner" />
    </div>
  </div>
</template>

<script>
import CopilotMessage from './CopilotMessage.vue'

export default {
  name: 'CopilotMessages',
  components: { CopilotMessage },
  props: {
    messages: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false },
    isHistoryLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      // 5 个精选问题（覆盖 5 大板块）
      recommendedExamples: [
        { icon: 'fa-bar-chart', text: "帮我看看今天 Smart Stock Scanner 的扫描结果，我想找几个做多的机会。" },
        { icon: 'fa-lock', text: "我手里有一大笔闲置现金，想通过卖期权赚点稳健的时间价值，现在有什么深度价外的安全机会？" },
        { icon: 'fa-flask', text: "帮我跑一个策略回测：过去2年，胜率>70%的做多信号，10%止盈5%止损。" },
        { icon: 'fa-balance-scale', text: "我目前重仓了苹果（AAPL），市场上有哪个大类资产或个股最近跟它是完全反着走的？" },
        { icon: 'fa-university', text: "美联储下周要公布利率决议了，历史上 FOMC 决策日前后 3 天 SPX 的表现规律是什么？" },
      ],
      // 按板块分组的更多问题
      moduleExamples: [
        {
          key: 'scanner',
          label: 'Smart Stock Scanner',
          icon: 'fa-bar-chart',
          expanded: false,
          questions: [
            '什么是 Smart Stock Scanner？',
            '今天有哪些值得进一步研究的股票？',
            '哪些股票同时具备强趋势和强相对强度？',
          ]
        },
        {
          key: 'options',
          label: 'Smart Option Scanner',
          icon: 'fa-lock',
          expanded: false,
          questions: [
            '什么是 Smart Option Scanner？',
            '95% POP 的 Put 靠谱吗？',
            '我应该选高 POP 还是高 EV？',
          ]
        },
        {
          key: 'backtest',
          label: 'Scanner Backtest',
          icon: 'fa-flask',
          expanded: false,
          questions: [
            '什么是 Scanner Backtest？',
            '这个信号过去十年赚钱吗？',
            '这个策略是不是过拟合了？',
          ]
        },
        {
          key: 'correlation',
          label: 'Correlation',
          icon: 'fa-balance-scale',
          expanded: false,
          questions: [
            '什么是 Correlation Pattern Match？',
            '哪些股票和 NVDA 走势最同步？',
            '有没有和 TSLA 走势完全不同的股票？',
          ]
        },
        {
          key: 'seasonality',
          label: 'Seasonality',
          icon: 'fa-university',
          expanded: false,
          questions: [
            '什么是 Seasonality？',
            '一年中哪个月份最强？',
            'FOMC 前后市场通常怎么走？',
          ]
        },
      ],
      userScrolledUp: false,
    }
  },
  computed: {
    hasPendingAssistant() {
      const last = this.messages[this.messages.length - 1]
      return last && last.role === 'assistant' && (last.status === 'pending' || last.status === 'streaming')
    },
    lastUserMessageId() {
      for (let i = this.messages.length - 1; i >= 0; i--) {
        if (this.messages[i].role === 'user') return this.messages[i].id
      }
      return null
    },
    lastAssistantMessageId() {
      for (let i = this.messages.length - 1; i >= 0; i--) {
        if (this.messages[i].role === 'assistant') return this.messages[i].id
      }
      return null
    }
  },
  watch: {
    messages: {
      deep: true,
      handler() {
        // Only auto-scroll when user is at bottom
        if (!this.userScrolledUp) {
          this.$nextTick(() => {
            this.scrollToBottom()
          })
        }
      }
    }
  },
  mounted() {
    const container = this.$refs.scrollRef
    if (container) {
      container.addEventListener('scroll', this.onScroll)
    }
  },
  beforeDestroy() {
    const container = this.$refs.scrollRef
    if (container) {
      container.removeEventListener('scroll', this.onScroll)
    }
  },
  methods: {
    onScroll() {
      const el = this.$refs.scrollRef
      if (!el) return
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
      this.userScrolledUp = !nearBottom
    },
    scrollToBottom() {
      const el = this.$refs.scrollRef
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    },
    toggleModule(mod) {
      mod.expanded = !mod.expanded
    }
  }
}
</script>

<style scoped>
.messages-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  min-width: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px 20px;
  min-height: 0;
  border-radius: inherit;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 32px 16px 40px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.empty-state p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  max-width: 280px;
}

.example-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
  width: 100%;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 4px;
}

.section-label i {
  font-size: 10px;
  color: #fbbf24;
}

.example-section button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: white;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.example-section button:hover {
  border-color: #2563eb;
  background: #f0f7ff;
  color: #2563eb;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
}

.example-icon {
  width: 16px;
  text-align: center;
  color: #94a3b8;
  flex-shrink: 0;
  font-size: 15px;
}

.example-text {
  line-height: 1.4;
}

/* 板块折叠头 — 浅灰底文件夹标签 */
.example-section .module-header {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s;
  width: auto;
  box-shadow: none;
  text-align: left;
}

.example-section .module-header:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #2563eb;
}

.example-section .module-header:hover .module-icon {
  color: #2563eb;
}

.module-icon {
  width: 16px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}

.module-arrow {
  margin-left: auto;
  font-size: 11px;
  color: #94a3b8;
  transition: transform 0.2s;
}

/* 板块内问题 — 白底小卡片 */
.module-questions {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  margin-bottom: 16px;
}

.module-questions .module-questions-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: white;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  box-shadow: none;
}

.module-questions .module-questions-item:hover {
  background: #f3f4f6;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  max-width: 100%;
}

.loading-dots .dot:nth-child(1) { animation-delay: 0s; }
.loading-dots .dot:nth-child(2) { animation-delay: 0.2s; }
.loading-dots .dot:nth-child(3) { animation-delay: 0.4s; }

.bottom-anchor {
  height: 1px;
}

/* History loading overlay - covers messages-wrapper (not scrollable) */
.history-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(2px);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
