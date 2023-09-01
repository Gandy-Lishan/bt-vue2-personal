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
				<el-button type="danger" @click="clearForm"> Clear Form</el-button>
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
import cloneDeep from 'lodash/cloneDeep'
import capitalizeFirstLetter from "@/tools/capitalizeFirstLetter"
import isJson from '@/tools/isJson'
import SignalCode from '@/tools/codeTool.js'
import { CIQ } from '@/components/common/chart/st-development/js'

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
    clearForm() {
      this.$refs['basicInfo'].clearForm()
    },
    runBacktest() {
      const _this = this
      _this.$refs['basicInfo'].saveData()
      const entryErr = _this.saveCriteriaData('entryChild')
      const exitErr = _this.saveCriteriaData('exitChild')
      if (!entryErr || !exitErr) return
      // 处理上传到后端的数据
      let entrySaveObj = _this.handleSavedData('entry')
     	let exitSaveObj =  _this.handleSavedData('exit')
			console.log('entrySaveObj', entrySaveObj)
			console.log('exitSaveObj', exitSaveObj)
    },
    async saveCriteriaData(criteriaRef) {
      const _this = this
      const tabLength = _this.$refs[criteriaRef].addSignalLength()
      for (let index = 0; index < tabLength; index++) {
        const valid = await _this.$refs[criteriaRef].saveData(index)
        if (!valid) return false
      }
      _this.$refs[criteriaRef].saveScoreValue()
      _this.$refs[criteriaRef].saveSignalsInMarket()
      _this.$refs[criteriaRef].saveDelayBar()
      _this.$refs[criteriaRef].saveRelation()
      return _this.$refs[criteriaRef].isSameSignal()
    },
    handleSavedData(criteria) {
      const backtestData = cloneDeep(this.$store.state.form.backtestInfo);
      const { signal_list } = this.encodeSignalList(criteria)
			let description = backtestData[`${criteria}_description`]
			let saveObj = {}
			if(isJson(description)) {
				description = JSON.parse(description)
			}
			const criteriaObj = {
				description: backtestData[criteria].description,
				score: backtestData[criteria].score,
				signals_in_market: backtestData[criteria].signals_in_market,
				relation: backtestData[criteria].relation,
				delay_bars: backtestData[criteria].delay_bars,
				signals: signal_list,
				cond: description.map((i) => i.rocCond)
			}
			saveObj['description'] = JSON.stringify(backtestData.description)
			saveObj[criteria] = JSON.stringify(criteriaObj)
			if(Array.isArray(description)) {
				saveObj[`${criteria}_description`] = JSON.stringify(description)
			}
			return saveObj
    },
    encodeSignalList(criteria) {
      const backtestData = cloneDeep(this.$store.state.form.backtestInfo);
      const signalList = backtestData[criteria].signals;
      const isOnlyUseRiskControl = backtestData.relation == 0;
      const criteriaCapFirstL = capitalizeFirstLetter(criteria);
      const signal_list = []
			const b = new SignalCode()

      if (!isOnlyUseRiskControl) {
        signalList.forEach(item => {
          const indicators = {
            sentimentIndicator: { indicator: item.sentimentIndicator, analysis: 'Sentiment' },
            technicalIndicator: { indicator: item.technicalIndicator, analysis: 'Technical' },
            riskIndicator: { indicator: 'RC', analysis: 'Exit' },
            symbolIndicator: { indicator: item.symbolIndicator, analysis: 'Symbol' },
            usersOwnIndicator: { indicator: item.usersOwnIndicator, analysis: 'User' }
          };

          for (const [key, value] of Object.entries(indicators)) {
            if (item[key]) {
              item.indicator = value.indicator;
              item.analysis = value.analysis;
              for (const deleteKey of Object.keys(indicators)) {
                delete item[deleteKey];
              }
            }
          }
        });
      }
      const findSignal = (item, index) => {
        let signal = CIQ.findSentiIndicator(item.indicator, null);
        if (!signal) {
          signal = CIQ.findBuiltinTechIndicator(item.indicator, null);
        }
				// 在 symbol indicator list内检索url
			 if (!signal) {
					if (CIQ.findSymbolIndicator(item.indicator,null)) {
						return item.indicator
					}
        const usersOwnList = this.$store.state.form[`usersOwn${criteriaCapFirstL}FileHash`];
        return usersOwnList[index] !== '' ? usersOwnList[index] : signal?.url || '';
      	};
			}

      let signal = backtestData[criteria].signals.map(findSignal);

      if (isOnlyUseRiskControl) {
        signal = [''];
        signal_list.push({
          code: 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'
        });
      } else {
        for (let i = 0; i < signalList.length; i++) {
          const code = b.encode(signalList[i]);
          signal_list.push({
            code: code
          });
        }
      }
      delete backtestData[criteria].signals;
			return {signal_list, signal}
    }

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
	.criteria-container {
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