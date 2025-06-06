<!-- SectorCard.vue -->
<template>
  <div class="sector-card">
    <h3 class="sector-title">{{ title }}</h3>
    <div class="sector-region">{{ region }}</div>
    <div class="sector-metrics">
      <div class="metric">
        <div class="value positive">{{ totalPremium }}%</div>
        <div class="label">Total Premium</div>
      </div>
      <div class="metric">
        <div class="value positive">{{ countryRisk }}%</div>
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
      required: true
    },
    totalPremium: {
      type: [Number, String],
      required: true
    },
    countryRisk: {
      type: [Number, String],
      required: true
    }
  }
}
</script>

<style scoped>
.sector-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  min-width: 200px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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