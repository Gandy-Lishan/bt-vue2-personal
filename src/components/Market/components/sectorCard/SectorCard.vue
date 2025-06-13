<!-- SectorCard.vue -->
<template>
  <div class="card sector-card">
    <h3 class="sector-title">{{ title }}</h3>
    <div v-if="region" class="sector-region">{{ region }}</div>
    <div class="sector-metrics">
      <div class="metric">
        <div class="value" :class="{ positive: totalPremium > 0, negative: totalPremium < 0 }">{{ totalPremium }}%</div>
        <div class="label">Total Premium</div>
      </div>
      <div v-if="countryRisk !== undefined" class="metric">
        <div class="value" :class="{ positive: countryRisk > 0, negative: countryRisk < 0 }">{{ countryRisk }}%</div>
        <div class="label">Country Risk</div>
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
      required: true
    },
    region: {
      type: String,
      required: false,
      default: undefined
    },
    totalPremium: {
      type: [Number, String],
      required: true
    },
    countryRisk: {
      type: [Number, String],
      required: false,
      default: undefined
    }
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

.value.positive {
  color: #4CAF50;
}

.value.negative {
  color: #F44336;
}

.label {
  font-size: 12px;
  color: #666;
}
</style> 