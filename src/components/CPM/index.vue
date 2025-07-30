<template>
	<div class="cpm-container">
		<div class="strategy-header">
			<div class="tableHeader">
				<div class="headerSelect">
					<h4  @click="selectedTitle = 'CPM'" :class="{ 'selected': selectedTitle === 'CPM' }">Correlation Pattern Match</h4>
					<h4  @click="selectedTitle = 'Symbol'" :class="{ 'selected': selectedTitle === 'Symbol' }">Symbol Correlation</h4>
					<h4  @click="selectedTitle = 'Asset'" :class="{ 'selected': selectedTitle === 'Asset' }">Asset Correlation</h4>
					<h4 v-if="showSP500SectorTrendScore"  @click="selectedTitle = 'Pattern'" :class="{ 'selected': selectedTitle === 'Pattern' }">Date Range Correlation</h4>
				</div>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
import { getCookieData } from "@/utils/cryptoUtils/cookie";

export default {
	name: 'CPM',
	data() {
		return {
			selectedTitle: 'CPM'
		}
	},
 computed: {
  showSP500SectorTrendScore() {
    const email = getCookieData()?.username
		const allowedUserList = ['jay@sentimentrader.com', 'dean@sentimentrader.com', 'jason@sentimentrader.com', 'hao@sentimentrader.com', 'jinjing@elixiroftechnology.com'];
    return allowedUserList.includes(email)
  }
 },
	watch: {
		selectedTitle: {
			async handler(newValue, _){
				if(newValue === 'Symbol' && (!this.$route.path.includes('/cpm/symbol'))) this.$router.push({path: '/cpm/symbol'})
				else if(newValue === 'Asset' && (!this.$route.path.includes('/cpm/asset'))) this.$router.push({path: '/cpm/asset'})
				else if(newValue === 'CPM' && (this.$route.path !== '/cpm' && this.$route.path !== '/cpm/results' )) this.$router.push({path: '/cpm/list'})
        else if(newValue === 'Pattern' && (!this.$route.path.includes('/cpm/pattern'))) this.$router.push({path: '/cpm/pattern'})
			},
			deep: true
		},
    '$route'(to, _) {
			if (to.fullPath.includes('/cpm/symbol')) {
				this.selectedTitle = 'Symbol'
			}else if (to.fullPath.includes('/cpm/asset')) {
				this.selectedTitle = 'Asset'
			}else if (to.fullPath.includes('/cpm/pattern')) {
				this.selectedTitle = 'Pattern'
			}else {
        this.selectedTitle = 'CPM'
			}
    },
	},
  mounted() {
    if(this.$route.fullPath.includes('/cpm/symbol')) {this.selectedTitle = 'Symbol'}
    else if(this.$route.fullPath.includes('/cpm/asset')) {this.selectedTitle = 'Asset'}
    else if(this.$route.fullPath.includes('/cpm/pattern')) {this.selectedTitle = 'Pattern'}
    else {this.selectedTitle = 'CPM'}
  },
	methods: {

	}
}
</script>

<style lang="less" scoped>
.cpm-container {
  margin: 0 auto;
	font-family: "Open Sans",sans-serif;
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

@media (min-width: 768px) {
  .cpm-container {
      width: 750px;
  }
}
@media (min-width: 992px) {
  .cpm-container {
      width: 970px;
  }
}
@media (min-width: 1200px) {
  .cpm-container {
      width: 1170px;
  }
}
</style>