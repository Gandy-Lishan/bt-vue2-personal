<template>
 <div class="strategy-container" >
  <div class="strategy-header">
    <div class="tableHeader">
      <div class="headerSelect">
        <h4  @click="()=>{handleTitleSelect('Trend')}" :class="{ 'selected': selectedTitle === 'Trend' }">Trend</h4>
        <h4  @click="()=>{handleTitleSelect('Historical')}" :class="{ 'selected': selectedTitle === 'Historical' }">Historical Volatility</h4>
      </div>
    </div>
  </div>
		<router-view></router-view>
 </div>
</template>

<script>

export default {
 name: 'TrendScore',
 data () {
   return {
     selectedTitle: 'Trend'
   }
 },
 async mounted() {
 },
 watch: {
  '$route'(to, _) {
			if (to.fullPath.includes('/trend_score/trend')) {
				this.selectedTitle = 'Trend'
			}else if (to.fullPath.includes('/trend_score/historical')) {
				this.selectedTitle = 'Historical'
			}else {
     this.selectedTitle = 'Trend'
			}
    },
	},
  mounted() {
    if(this.$route.fullPath.includes('/trend_score/trend')) {this.selectedTitle = 'Trend'}
    else if(this.$route.fullPath.includes('trend_score/historical')) {this.selectedTitle = 'Historical'}
    else {this.selectedTitle = 'Trend'}
  },
 methods: {
  handleTitleSelect(newValue) {
    if(newValue === 'Trend' && (!this.$route.path.includes('/trend_score/trend'))) this.$router.push({path: '/trend_score/trend'})
    else if(newValue === 'Historical' && (!this.$route.path.includes('/trend_score/historical'))) this.$router.push({path: '/trend_score/historical'})
  }
 }
}
</script>

<style lang="less" scoped>
@import "../index.less";
.indicator-left {
 display: flex;
 flex-wrap: wrap;
 align-items: stretch;
 flex-grow: 1;
 .indicators-chart {
   width: 50%;
 }
}
.showDetailsChart {
 margin-top: 50px;
}
/deep/ .virtualScroll .el-table--scrollable-x .el-table__body-wrapper {
 overflow-x: scroll !important;
}
// /deep/ .el-table__footer-wrapper, /deep/ .el-table__header-wrapper {
//   width: 100% !important; /* 确保宽度占满父容器 */
// }
.indicators-container {
  color: #000000;
  padding: 0 20px;
}
.indicators-table, .details-container, #indiChart {
  width: 50%;
}
.full-screen-table {
  width: 100%;
}
@media (max-width: 1200px) {
  .indicators-table, .details-container, #indiChart {
    width: 100%;
  }
}
.strategy-container {
}
</style>