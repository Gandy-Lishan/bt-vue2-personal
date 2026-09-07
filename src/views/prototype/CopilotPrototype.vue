<template>
  <div class="copilot-prototype-page">
    <div :class="['prototype-copilot-host', activeVariant]">
      <AICopilot :layout="activeVariant" :bubble-icon="activeVariantIcon" :bubble-text="activeVariantBubbleText" @register-tools="registerAITools" />
    </div>

    <div class="prototype-switcher">
      <button class="switch-btn" @click="previousVariant">‹</button>
      <div class="switch-label">
        <span>{{ activeVariantMeta.title }}</span>
        <strong>{{ activeVariantMeta.description }}</strong>
      </div>
      <button class="switch-btn" @click="nextVariant">›</button>
    </div>
  </div>
</template>

<script>
import AICopilot from '@/components/ai-copilot/AICopilot.vue'

export default {
  name: 'CopilotPrototype',
  components: { AICopilot },
  data() {
    return {
      variants: [
        { key: 'bottom', title: '方案一', description: '底部栏弹出', icon: 'fa-terminal', bubbleText: 'Ask AI Copilot...' },
        { key: 'side', title: '方案二', description: '侧边栏弹出', icon: 'fa-columns', bubbleText: 'Copilot' },
        { key: 'default', title: '方案三', description: '默认按钮弹出', icon: 'fa-commenting', bubbleText: 'AI Copilot' },
      ],
    }
  },
  computed: {
    activeVariant() {
      const variant = String(this.$route.query.variant || 'bottom').toLowerCase()
      return this.variants.some(item => item.key === variant) ? variant : 'bottom'
    },
    activeVariantIndex() {
      return this.variants.findIndex(item => item.key === this.activeVariant)
    },
    activeVariantMeta() {
      return this.variants[this.activeVariantIndex]
    },
    activeVariantIcon() {
      return this.activeVariantMeta.icon
    },
    activeVariantBubbleText() {
      return this.activeVariantMeta.bubbleText
    },
  },
  methods: {
    setVariant(variant) {
      if (variant === this.activeVariant) return
      this.$router.replace({ path: '/prototype', query: { variant } })
    },
    previousVariant() {
      const index = (this.activeVariantIndex + this.variants.length - 1) % this.variants.length
      this.setVariant(this.variants[index].key)
    },
    nextVariant() {
      const index = (this.activeVariantIndex + 1) % this.variants.length
      this.setVariant(this.variants[index].key)
    },
    registerAITools(registerTool) {
      registerTool('setStopLoss', ({ value }) => {
        console.log('[AI Tool] setStopLoss', value)
        return { success: true, value }
      })
      registerTool('runBacktest', async ({ strategyId }) => {
        console.log('[AI Tool] runBacktest', strategyId)
        return { success: true, profit: 0.05, maxDrawdown: 0.02 }
      })
      registerTool('navigateTo', ({ path }) => {
        console.log('[AI Tool] navigateTo', path)
        this.$router.push(path)
        return { success: true, path }
      })
    },
  },
}
</script>

<style scoped>
.copilot-prototype-page {
  min-height: calc(100vh - 160px);
  background: #fff;
}

.prototype-switcher {
  position: fixed;
  left: 50%;
  top: 150px;
  z-index: 1100;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e0e7ff;
  box-shadow: 0 16px 40px rgba(37, 99, 235, 0.16);
  transform: translateX(-50%);
}

.switch-btn {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #1d4ed8 100%);
  color: #fff;
  cursor: pointer;
  font-size: 28px;
  line-height: 1;
  transition: transform 0.15s, box-shadow 0.15s;
}

.switch-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.2);
}

.switch-label {
  min-width: 140px;
  text-align: center;
  color: #64748b;
}

.switch-label span,
.switch-label strong {
  display: block;
}

.switch-label span {
  font-size: 12px;
}

.switch-label strong {
  margin-top: 1px;
  color: #172033;
  font-size: 15px;
}

/* ============================================================
   三方案差异化设计 — 修复 transform containing-block 问题
   关键：父容器 .ai-copilot 不设置 transform，避免截断 fixed/absolute 子元素
   ============================================================ */

/* ---------- 方案一：Bottom（底部命令栏 + 全宽底部抽屉） ---------- */
.prototype-copilot-host.bottom /deep/ .ai-copilot {
  left: 0;
  right: 0;
  bottom: 0;
  transform: none;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 底部命令栏 — 蓝色渐变 pill */
.prototype-copilot-host.bottom /deep/ .copilot-bubble {
  width: 420px;
  height: 48px;
  border-radius: 14px;
  gap: 10px;
  padding: 0 18px;
  justify-content: flex-start;
  font-size: 18px;
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #1d4ed8 100%);
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.24);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

.prototype-copilot-host.bottom /deep/ .copilot-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.32);
}

.prototype-copilot-host.bottom /deep/ .copilot-bubble .bubble-icon {
  color: #fff;
  font-size: 16px;
}

.prototype-copilot-host.bottom /deep/ .bubble-text {
  display: inline;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 500;
  flex: 1;
  text-align: left;
  letter-spacing: 0.01em;
}

/* 底部全宽抽屉 — 贴底占满整个视口宽度 */
.prototype-copilot-host.bottom /deep/ .copilot-window {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw !important;
  height: 72vh;
  max-height: 680px;
  border-radius: 24px 24px 0 0;
  transform: none;
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-bottom: none;
  box-shadow: 0 -20px 60px rgba(15, 23, 42, 0.1);
  pointer-events: auto;
}

/* Bottom 从底部升起动画 — 使用 .copilot-window 前缀提高选择器优先级 */
.prototype-copilot-host.bottom /deep/ .copilot-window.slide-up-enter-active,
.prototype-copilot-host.bottom /deep/ .copilot-window.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.prototype-copilot-host.bottom /deep/ .copilot-window.slide-up-enter,
.prototype-copilot-host.bottom /deep/ .copilot-window.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* ---------- 方案二：Side（右侧书签标签 + 全高侧边抽屉） ---------- */
.prototype-copilot-host.side /deep/ .ai-copilot {
  right: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  transform: none;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

/* 书签标签式触发器 — 蓝色渐变，transition 只过渡几何属性，避免文字抖动 */
.prototype-copilot-host.side /deep/ .copilot-bubble {
  width: 40px;
  height: 136px;
  border-radius: 10px 0 0 10px;
  flex-direction: column;
  gap: 10px;
  font-size: 18px;
  padding: 20px 0;
  background: linear-gradient(180deg, #60a5fa 0%, #2563eb 40%, #1d4ed8 100%);
  box-shadow: -6px 0 24px rgba(37, 99, 235, 0.2), inset -1px 0 0 rgba(255, 255, 255, 0.1);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
  position: relative;
  margin-right: -2px;
}

/* 标签左侧高光边 */
.prototype-copilot-host.side /deep/ .copilot-bubble::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  background: linear-gradient(180deg, transparent, #93c5fd, transparent);
  border-radius: 2px;
  opacity: 0.7;
}

.prototype-copilot-host.side /deep/ .copilot-bubble:hover {
  width: 48px;
  margin-right: 0;
  box-shadow: -10px 0 32px rgba(37, 99, 235, 0.28), inset -1px 0 0 rgba(255, 255, 255, 0.15);
}

.prototype-copilot-host.side /deep/ .copilot-bubble .bubble-icon {
  color: #fff;
  font-size: 16px;
}

.prototype-copilot-host.side /deep/ .bubble-text {
  display: inline;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

/* 全高侧边抽屉 — 贴右占满整个视口高度 */
.prototype-copilot-host.side /deep/ .copilot-window {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 480px;
  height: 100vh !important;
  border-radius: 0;
  background: #fff;
  border-left: 1px solid #e2e8f0;
  box-shadow: -8px 0 32px rgba(15, 23, 42, 0.08);
  transform: none;
  pointer-events: auto;
}

/* Side 从右侧完全滑入动画 */
.prototype-copilot-host.side /deep/ .copilot-window.slide-up-enter-active,
.prototype-copilot-host.side /deep/ .copilot-window.slide-up-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.prototype-copilot-host.side /deep/ .copilot-window.slide-up-enter,
.prototype-copilot-host.side /deep/ .copilot-window.slide-up-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* ---------- 方案三：Default（默认右下角浮动卡片） ---------- */
.prototype-copilot-host.default /deep/ .ai-copilot {
  right: 24px;
  bottom: 24px;
  transform: none;
  pointer-events: none;
}

/* 触发器 — 精致的圆角方形 */
.prototype-copilot-host.default /deep/ .copilot-bubble {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  font-size: 24px;
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 52%, #1d4ed8 100%);
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.24), 0 0 0 1px rgba(255, 255, 255, 0.08);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
}

.prototype-copilot-host.default /deep/ .copilot-bubble:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 16px 40px rgba(37, 99, 235, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.prototype-copilot-host.default /deep/ .bubble-text {
  display: none;
}

/* 弹出窗 — 浮动卡片 */
.prototype-copilot-host.default /deep/ .copilot-window {
  bottom: 80px;
  right: 0;
  width: 480px;
  height: 600px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.02);
  pointer-events: auto;
}

/* 默认缩放浮现 */
.prototype-copilot-host.default /deep/ .copilot-window.slide-up-enter-active,
.prototype-copilot-host.default /deep/ .copilot-window.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.prototype-copilot-host.default /deep/ .copilot-window.slide-up-enter,
.prototype-copilot-host.default /deep/ .copilot-window.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
</style>
