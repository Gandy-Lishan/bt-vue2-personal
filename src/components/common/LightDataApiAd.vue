<template>
  <section v-if="shouldShowAd" class="light-data-ad" :style="adStyle" aria-label="Light Data API promotion">
    <div class="light-data-ad__content">
      <div class="light-data-ad__icon" aria-hidden="true">
        <i class="fa fa-database"></i>
      </div>
      <span class="light-data-ad__badge">NEW</span>
      <div class="light-data-ad__copy">
        <strong class="light-data-ad__title">Use SentimenTrader data in your own system with Light Data API</strong>
      </div>
      <a
        class="light-data-ad__cta"
        href="https://sentimentrader.com/light-indicator-api"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>Explore Light Data API</span>
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </a>
    </div>
  </section>
</template>

<script>
import { getCookieData } from '@/utils/cryptoUtils/cookie'

const CONTENT_WIDTH_SELECTORS = [
  '.container',
  '.strategy-container',
  '.page-content-wrapper',
  '.backtest_container',
  '.result-container',
  '.setup_container',
  '.set-up-container',
  '.aiscanner-container',
  '.indicators-container',
  '.portfolio-container',
  '.page-content'
]
const STRATEGY_CONTENT_WIDTH = 1170
const HIDDEN_AD_ACCESS_LEVELS = ['premium-data-yearly', 'light-data-yearly']

export default {
  name: 'LightDataApiAd',
  data() {
    return {
      shouldShowAd: true,
      contentWidth: null,
      contentResizeObserver: null,
      contentMutationObserver: null,
      observedContentWrapperElement: null,
      observedContentElement: null,
      refreshTimer: null,
      delayedRefreshTimer: null
    }
  },
  computed: {
    adStyle() {
      if (this.isStrategyRoute) {
        return {
          '--light-data-ad-content-width': `${STRATEGY_CONTENT_WIDTH}px`
        }
      }
      if (!this.contentWidth) return {}
      return {
        '--light-data-ad-content-width': `${this.contentWidth}px`
      }
    },
    isStrategyRoute() {
      return this.$route && this.$route.path && this.$route.path.startsWith('/strategy')
    }
  },
  watch: {
    $route() {
      this.refreshAdVisibility()
    }
  },
  mounted() {
    this.refreshAdVisibility()
    if (!this.shouldShowAd) return

    this.observeContentWrapper()
    this.scheduleContentWidthRefresh()
    window.addEventListener('resize', this.scheduleContentWidthRefresh)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.scheduleContentWidthRefresh)
    clearTimeout(this.refreshTimer)
    clearTimeout(this.delayedRefreshTimer)
    this.disconnectContentObserver()
    this.disconnectContentMutationObserver()
  },
  methods: {
    refreshAdVisibility() {
      this.shouldShowAd = !this.hasHiddenAdAccessLevel()

      if (!this.shouldShowAd) {
        this.contentWidth = null
        clearTimeout(this.refreshTimer)
        clearTimeout(this.delayedRefreshTimer)
        this.disconnectContentObserver()
        this.disconnectContentMutationObserver()
        return
      }

      this.scheduleContentWidthRefresh()
    },
    hasHiddenAdAccessLevel() {
      let accessLevel = []

      try {
        accessLevel = getCookieData()?.access_level || []
      } catch {
        return false
      }

      if (!Array.isArray(accessLevel)) return false

      return accessLevel.some(level => HIDDEN_AD_ACCESS_LEVELS.includes(String(level)))
    },
    scheduleContentWidthRefresh() {
      if (!this.shouldShowAd) return

      clearTimeout(this.refreshTimer)
      clearTimeout(this.delayedRefreshTimer)
      this.refreshTimer = setTimeout(this.updateContentWidth, 0)
      this.delayedRefreshTimer = setTimeout(this.updateContentWidth, 120)
    },
    updateContentWidth() {
      this.$nextTick(() => {
        window.requestAnimationFrame(() => {
          this.observeContentWrapper()
          const contentElement = this.findContentWidthElement()
          if (!contentElement) {
            this.contentWidth = null
            this.disconnectContentObserver()
            return
          }

          const width = Math.round(contentElement.getBoundingClientRect().width)
          this.contentWidth = width > 0 ? width : null
          this.observeContentElement(contentElement)
        })
      })
    },
    observeContentWrapper() {
      const wrapper = document.querySelector('.content-wrapper')
      if (!wrapper || typeof window.MutationObserver === 'undefined') return
      if (this.observedContentWrapperElement === wrapper) return

      this.disconnectContentMutationObserver()
      this.observedContentWrapperElement = wrapper
      this.contentMutationObserver = new window.MutationObserver(() => {
        this.scheduleContentWidthRefresh()
      })
      this.contentMutationObserver.observe(wrapper, {
        childList: true,
        subtree: true
      })
    },
    findContentWidthElement() {
      const wrapper = document.querySelector('.content-wrapper')
      if (!wrapper) return null

      const matchedElement = CONTENT_WIDTH_SELECTORS
        .map(selector => wrapper.querySelector(selector))
        .find(element => this.isVisibleElement(element))

      if (matchedElement) return matchedElement

      return Array.from(wrapper.children).find(element => this.isVisibleElement(element)) || wrapper
    },
    isVisibleElement(element) {
      if (!element) return false
      const rect = element.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    },
    observeContentElement(contentElement) {
      if (this.observedContentElement === contentElement) return

      this.disconnectContentObserver()
      this.observedContentElement = contentElement

      if (typeof window.ResizeObserver === 'undefined') return

      this.contentResizeObserver = new window.ResizeObserver(entries => {
        const entry = entries[0]
        if (!entry || !entry.target) return

        const width = Math.round(entry.target.getBoundingClientRect().width)
        this.contentWidth = width > 0 ? width : null
      })
      this.contentResizeObserver.observe(contentElement)
    },
    disconnectContentObserver() {
      if (this.contentResizeObserver) {
        this.contentResizeObserver.disconnect()
      }
      this.contentResizeObserver = null
      this.observedContentElement = null
    },
    disconnectContentMutationObserver() {
      if (this.contentMutationObserver) {
        this.contentMutationObserver.disconnect()
      }
      this.contentMutationObserver = null
      this.observedContentWrapperElement = null
    }
  }
}
</script>

<style lang="less" scoped>
.light-data-ad {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 44px;
  margin: 0 0 8px;
  padding: 7px 16px;
  box-sizing: border-box;
  border-top: 1px solid #eef4ff;
  border-bottom: 1px solid #dde9fb;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  color: #0c155f;
  font-family: "Open Sans", sans-serif;
}

.light-data-ad__content {
  display: flex;
  align-items: center;
  gap: 14px;
  width: var(--light-data-ad-content-width, 100%);
  max-width: 100%;
  min-width: 0;
}

.light-data-ad__icon {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0066ff;
  font-size: 13px;
}

.light-data-ad__badge {
  flex: 0 0 auto;
  min-width: 46px;
  height: 24px;
  padding: 0 12px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #0066ff;
  color: #ffffff;
  font-size: 12px;
  line-height: 1;
  font-weight: 700;
}

.light-data-ad__copy {
  flex: 1 1 auto;
  min-width: 220px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  text-align: left;
}

.light-data-ad__title {
  min-width: 0;
  color: #0b155f;
  font-size: 14px;
  line-height: 1.25;
  font-weight: 700;
}

.light-data-ad__cta {
  flex: 0 0 auto;
  min-height: 28px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 4px;
  background: #0066ff;
  color: #ffffff;
  font-size: 13px;
  line-height: 1;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 6px 12px rgba(0, 102, 255, 0.14);
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;
}

.light-data-ad__cta:hover,
.light-data-ad__cta:focus {
  background: #0059df;
  color: #ffffff;
  box-shadow: 0 10px 18px rgba(0, 102, 255, 0.22);
}

@media (max-width: 1480px) {
  .light-data-ad {
    padding: 7px 14px;
  }

  .light-data-ad__content,
  .light-data-ad__copy {
    gap: 12px;
  }

  .light-data-ad__title {
    font-size: 14px;
  }

  .light-data-ad__cta {
    font-size: 13px;
  }
}

@media (max-width: 767px) {
  .light-data-ad__content {
    flex-wrap: wrap;
  }

  .light-data-ad__copy {
    flex: 1 1 auto;
  }
}

@media (max-width: 768px) {
  .light-data-ad {
    align-items: center;
    margin: 0 0 8px;
    padding: 8px 10px;
  }

  .light-data-ad__content {
    justify-content: center;
    gap: 10px;
  }

  .light-data-ad__icon {
    width: 16px;
    height: 16px;
    font-size: 13px;
  }

  .light-data-ad__badge {
    min-width: 50px;
    height: 22px;
    padding: 0 10px;
    font-size: 11px;
  }

  .light-data-ad__copy {
    flex: 1 1 100%;
    order: 2;
    display: flex;
    justify-content: center;
    min-width: 0;
    text-align: center;
  }

  .light-data-ad__title {
    display: block;
    font-size: 14px;
  }

  .light-data-ad__cta {
    order: 3;
    min-height: 32px;
    padding: 0 12px;
    font-size: 13px;
  }
}
</style>
