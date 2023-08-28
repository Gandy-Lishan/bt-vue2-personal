<template>
  <div class="setup">
    <div class="setupBox">
      <BasicInfo ref="basicInfo"></BasicInfo>
  </div>
  <div class="set-up-container">
			<div class="criteria-container">
        <div class="criteria">
        <Criteria
        ref="entryChild"
        :config="setConfig('entry')"
				:isRiskControl="false"
        @getEntryRelation="getEntryRelation"
        @sendEntrySignalIndex="sendEntrySignalIndex"
      ></Criteria>
        </div>
      <div class="divider"></div>
        <div class="criteria">
      <Criteria
        ref="exitChild"
        :config="setConfig('exit')"
				:isRiskControl="isRiskControl"
        @isOnlyRiskControl="isOnlyRiskControl"
        @getExitRelation="getExitRelation"
        @sendExitSignalIndex="sendExitSignalIndex"
      ></Criteria>
      </div>
    </div>
  </div>
	<div class="backtest-btns">
		<el-tooltip
			class="item"
			effect="dark"
			content="Clear the backtest set up form "
			placement="bottom"
		>
			<el-button type="danger" @click="clearForm">
				Clear Form</el-button
			>
		</el-tooltip>
		<el-tooltip
			class="item"
			effect="dark"
			content="Complete the form filling, run the backtest, and view the results"
			placement="bottom"
		>
			<el-button type="success" @click="runBacktest"
				>Run Backtest</el-button
			></el-tooltip
		>
		<!-- <el-checkbox style="margin-left:10px" v-model="test" label="download test csv" border></el-checkbox> -->
	</div>
  </div>
</template>

<script>
import BasicInfo from "./basicInfo"
import Criteria from "./criteria"
import { generateConfig } from "./criteria/config"
export default {
  name: 'SetUp',
  components: {
    BasicInfo,
    Criteria
  },
  data() {
    return {
			isRiskControl: true
    }
  },
  methods: {
    setConfig(criteria) {
			// 传入 entry 和 exit 的配置
      return generateConfig(criteria)
    },
		runBacktest() {
			// 将所有数据存入 vuex 中
			const vm = this
			vm.$refs['basicInfo'].saveData()
		},
		clearForm() {
			this.$refs['basicInfo'].clearForm()
		},
  }
}
</script>

<style lang="less" scoped>
.setup {
	padding: 5px;
    background-color: #fff;
    border-radius: 12px;

}

.criteria {
	// margin-left: 40px;
	margin-bottom: 10px;
	flex: 1;
}
.criteria-container {
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #797979;
	align-items: flex-start;
}
.backtest-btns {
	margin-top: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20px;
	padding-bottom: 10px;
	margin-bottom: 12px;
	.el-button:first-child {
		background: rgb(251, 192, 92);
		border: none;
		width: 250px;
	}
	.el-button:first-child:hover {
		background-color: #f59e0b;
	}
	.el-button:last-child {
		background: #5b9bd1;
		border: none;
		width: 250px;
	}
	.el-button:last-child:hover {
		background-color: #409eff;
	}
}
@media (min-width: 820px) and (max-width: 1279px) {
	.criteria-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.criteria-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.criteria-container  {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
	.backtest-btns {
		.el-button {
			padding: 7px;
			font-size: 12px;
		}
	}
}
.divider {
	width: 1.5px;
	background-color: #e8e6e6;
	opacity: 0.8;
	margin: 10px;
	align-self: stretch;
}
@media (min-width: 1280px) and (max-width: 1365px) {
	.criteria {
		margin: 0px 10px 10px 10px;
	}
}
@media (min-width: 820px) and (max-width: 1279px) {
	.criteria {
		margin: 0px 40px 10px 40px;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.criteria {
		margin: 0px 40px 10px 40px;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.criteria {
		border-bottom: 1px solid #797979;
	}
	.criteria {
		margin: 0px 0px 10px 0px;
	}
	.criteria-title {
		font-size: 15px;
	}
}

</style>