<template>
  <div class="company-stats">
    <!-- Company Details Section -->
    <div class="stats-section">
      <h3 class="section-title">Company Details</h3>
      <div class="stats-list">
        <div
          v-for="(item, index) in companyDetails"
          :key="index"
          class="stats-item"
        >
          <span class="stats-label">
            {{ item.label }}
            <el-tooltip v-if="item['desc']" effect="dark" placement="top">
              <span slot="content" v-html="item['desc']">
							</span>
              <i class="iconfont icon-wenhao" style="font-size: 14px;font-weight: 300;"></i>
            </el-tooltip>
          </span>
          <span class="stats-value" :class="{ 'negative': item.isNegative }">
            {{ item.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- Trading Stats Section -->
    <div class="stats-section">
      <h3 class="section-title">Trading Stats</h3>
      <div class="stats-list">
        <div
          v-for="(item, index) in tradingStats"
          :key="index"
          class="stats-item"
        >
          <span class="stats-label">{{ item.label }}</span>
          <span class="stats-value" :class="{ 'negative': item.isNegative }">
            {{ item.value }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyStats',
  props: {
    companyDetails: {
      type: Array,
      required: true,
      default: () => []
    },
    tradingStats: {
      type: Array,
      required: true,
      default: () => []
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/components/Market/market.scss";
.company-stats {
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  width: 100%;
  margin: 0 auto;
}

.stats-section {
  padding: 10px;
}

.stats-section:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #3b82f6;
  display: inline-block;
  width: 100%;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}

.stats-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 400;
  flex: 1;
}

.stats-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  text-align: right;
  min-width: 80px;
}

.stats-value.negative {
  color: #dc2626;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .company-stats {
    max-width: 100%;
    margin: 0;
  }
  
  .stats-section {
    padding: 16px;
  }
  
  .stats-item {
    gap: 8px;
  }
  
  .stats-label {
    font-size: 13px;
  }
  
  .stats-value {
    font-size: 13px;
    min-width: 70px;
  }
}

/* 悬停效果 */
.stats-item:hover {
  background-color: #f9fafb;
  padding: 4px 8px;
  margin: -4px -8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}
</style>

