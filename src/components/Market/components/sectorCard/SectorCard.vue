<template>
  <div class="card sector-card" :class="{ 'no-border': disableBorder }">
    <div v-if="isLoading" class="card-loading">Loading data...</div>
    <div v-else>
      <h3 class="sector-title">{{ title }}</h3>
      <div v-if="region" class="sector-region">{{ region }}</div>
      <div class="sector-metrics">
        <div class="metric">
          <div class="value" :style="totalPremiumColor ? { color: totalPremiumColor } : {}">{{ totalPremium }}</div>
        </div>
        <div v-if="countryRisk !== undefined" class="metric">
          <div class="value" :style="countryRiskColor ? { color: countryRiskColor } : {}">{{ countryRisk }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectorCard',
  props: {
    title: {
      type: String,
    },
    region: {
      type: String,
      required: false,
      default: undefined
    },
    totalPremium: {
      type: [Number, String],
    },
    totalPremiumColor: {
      type: String,
      default: undefined
    },
    countryRisk: {
      type: [Number, String],
      default: undefined
    },
    countryRiskColor: {
      type: String,
      default: undefined
    },
    isLoading: { type: Boolean, default: false },
    // 添加 disableBorder prop
    disableBorder: { 
      type: Boolean, 
      default: false 
    },
  }
}
</script>

<style scoped lang="scss">
@import "@/components/Market/market.scss";

.sector-card {
  min-width: 200px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); */
  transition: all 0.3s ease;
  cursor: pointer;
  // 默认边框，如果需要，可以取消注释或添加
  // border: 1px solid #e0e0e0; // 假设有一个默认边框
}

// 新增的类，用于控制无边框状态
.sector-card.no-border {
  border: none; // 移除边框
  box-shadow: none; // 如果有默认阴影，也一并移除
}


.sector-card:hover {
  transform: translateY(-2px);
  // box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.sector-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.sector-region {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.sector-metrics {
  display: flex;
  gap: 24px;
}

.metric {
  flex: 1;
}

.value {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.label {
  font-size: 12px;
  color: #666;
}

.card-loading, .card-error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #888;
  font-style: italic;
  border: 1px dashed #ccc;
  box-sizing: border-box;
}
.card-error {
  color: #D32F2F;
  background-color: #FFEBEE;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #FFCDD2;
}
</style>