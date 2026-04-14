<template>
  <div class="my-indicator-list-container">
    <div class="strategy-header">
        <div class="tableHeader">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Indicator'" :class="{ 'selected': selectedTitle === 'Indicator' }">My Indicator List</h4>
            <h4  @click="selectedTitle = 'Sample'" :class="{ 'selected': selectedTitle === 'Sample' }">My Indicator Samples</h4>
          </div>
        </div>
      </div>
    <MITable v-show="selectedTitle === 'Indicator'"  ref="Indicator"></MITable>
    <SampleTable v-show="selectedTitle === 'Sample'"  ref="Sample" @changeTab="changeTab"></SampleTable>
  </div>
</template>

<script>
import MITable from "./table.vue"
import SampleTable from "./sampleTable.vue"
export default {
  name: 'MIList',
  data() {
    return {
      selectedTitle: 'Indicator'
    }
  },
  beforeRouteEnter(to, _, next) {
    debugger
		if (to.path === '/myindicator/') {
			next((_this) => {
				if (to.params.source && (to.params.source === 'Sample')) {
          _this.selectedTitle = 'Sample'
				}
			})
		} else {
			next()
		}
	},
  components: {
    MITable,
    SampleTable
  },
  methods: {
    changeTab(tabName) {
      this.selectedTitle = tabName;
      if(this.selectedTitle == 'Indicator') this.$refs.Indicator.getTableData(1)
    }
  }
}
</script>

<style lang="less" scoped>
.my-indicator-list-container {
  min-height: 74vh;
  margin: 50px 50px 0px 50px;
  background-color: #ffffff;
  .strategy-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .tableHeader {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      border-bottom: 2px solid #e9e9e9;
			padding: 30px 0px 0px 0px;
    }
    .searchBox {
      align-content: flex-end;
      margin-left: 20px;
      .el-input-group {
        width: 400px;
      }
    }
    h4 {
      margin: 0;
      margin-right: 20px;
      padding: 1.33em 0;
      cursor: pointer;
      &:hover{
        color: #1d4ed7;
      }
      &.selected {
        border-bottom: 2px solid #1d4ed7;
        color: #1d4ed7;
      }
    }
    .headerSelect {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btns {
      display: flex;
      justify-content: space-between;
      button.el-button.el-button--primary.el-button--mini {
        width: 52px;
      }
    }
	// padding-top: 50px;
	margin-right: auto;
	margin-left: auto;
}
}
</style>