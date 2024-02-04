<template>
	<div id="optimizeBT">
		<div class="optimize-panel">
			<div class="header">
				<h2>Backtest Optimization Result</h2>
				<h4>The best condition in 20 backtests</h4>
			</div>
			<div class="table">
				<el-table
					header-align="center"
					:data="dataList"
					v-loading="loading"
					:element-loading-text="loadTest"
					:default-expand-all="false"
					element-loading-spinner="el-icon-loading"
					style="width: 100%; height: 100%"
					:row-class-name="tableRowClassName"
					element-loading-background="rgba(0, 0, 0, 0.8)"
				>
        <el-table-column
          width="50px"
          align="center"
				>
					<template scope="scope">
						<el-checkbox
							v-model="scope.row.select"
							@change="
								selectBT(
									scope.row
								)
							"
						></el-checkbox>
					</template>
				</el-table-column>
					<el-table-column type="index" align="center">
						<template scope="scope">
							<span>{{ scope.$index + 1 }}</span>
						</template>
					</el-table-column>
					<template v-for="item in tableCol">
						<el-table-column
							v-if="['Name', 'Symbol'].includes(item.label)"
							:label="item.label"
							:key="item.label"
              :prop="item.field"
							:width="item.width"
							show-overflow-tooltip
							align="center"
						>
            	<template slot-scope="scope">
								{{ scope.row.data[item.field] }}
							</template>
						</el-table-column>
						<el-table-column
							v-if="item.label == 'DesExpand'"
							:type="item.type"
							:key="item.label"
						>
							<template slot-scope="scope">
								<div class="expandArea">
									<div class="descriptionBox">
										<div class="entryBox">
											<p>Entry Description</p>
											<template
												v-for="(des, index) in scope.row.data.entry_description"
											>
												<p :key="index">
													<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
													>{{ des.commentDes }}
												</p>
											</template>
										</div>
										<div class="exitBox">
											<p>Exit Description</p>
											<template
												v-for="(des, index) in scope.row.data.exit_description"
											>
												<p :key="index">
													<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
													>{{ des.commentDes }}
												</p>
											</template>
										</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							v-if="item.label == 'Entry & Exit'"
							:label="item.label"
							:key="item.label"
							align="center"
						>
							<template slot-scope="scope">
								{{ scope.row.data.entry_description[0].commentDes }}<br />
								<br />
								{{ scope.row.data.exit_description[0].commentDes }}<br />
							</template>
						</el-table-column>
						<el-table-column
							v-if="['Improved returns', 'Profit'].includes(item.label)"
							:label="item.label"
							:key="item.label"
							:width="item.width"
							:prop="item.field"
							show-overflow-tooltip
							align="center"
							:sortable="
								['Improved returns', 'Profit'].includes(item.label)
									? 'custom'
									: false
							"
							:sort-orders="['ascending', 'descending', item.field]"
						>
							<template slot-scope="scope">
								<span>{{ scope.row[item.field] }}%</span>
							</template>
						</el-table-column>
					</template>
					<div slot="empty" style="text-align: left">
						<el-empty image-size="80" description="No Data"></el-empty>
					</div>
				</el-table>
			</div>
      <div class="btn-group">
      <button class="cancel" @click="cancel">
          <span>Cancel</span>
				</button>
        <button class="add-to-list" @click="addToList">
          <span>Add to List</span>
				</button>
    </div>
		</div>
	</div>
</template>

<script>
import { CommonMethodsMixin } from "@/components/common/mixins/commonMethodsMixin"
import {
	copyBacktest,
  runOPT,
} from '@/service/service.js'
import factory from 'highcharts/modules/exporting'

export default {
	name: 'Optimize',
	components: {},
  mixins: [CommonMethodsMixin],
	data() {
		return {
      dataList: [],
//       [
//     {
//         "id": "21e85a32-3a20-3a29-2d7d-6b0680a07f85",
//         "user": "04f7c8dc-93fb-4f38-b680-638b06e108b7",
//         "name": "indicator ma with index below no value",
//         "capital": 100000,
//         "symbol": "XLU",
//         "benchmark": "XLU",
//         "entry": "{\"relation\": 1, \"score\": 1, \"delay_bars\": 0, \"signals_in_market\": 1, \"signals\": [{\"code\": \"SI:XLU Aggregated Put/Call Ratio;IDS:EO80/EP20;SC:SVMA100/0/1.0\"}], \"cond\": [{\"newCondition\": \"0\", \"conditionPeriod\": \"5\"}]}",
//         "exit": "{\"score\":1,\"signals_in_market\":1,\"relation\":0,\"delay_bars\":0,\"signals\":[{\"code\":\"SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999\"}],\"cond\":[null]}",
//         "create_date": "2023-11-16T07:00:02.679267Z",
//         "start_date": "1800-10-01",
//         "end_date": "2023-11-16",
//         "capital_alloc": "1.000000",
//         "commission": "0.0010",
//         "slippage": "0.1000",
//         "frequency": "Daily",
//         "win_rate": "0.0000",
//         "risk_control": "//1",
//         "user_tag": "client",
//         "report_url": "",
//         "direction": "Long",
//         "favorites": true,
//         "entry_description": [
//             {
//                 "commentDes": "E: Long; Single Condition XLU Aggregated Put/Call Ratio moving average 100 > 1.0;",
//                 "rocCond": {
//                     "newCondition": "0",
//                     "conditionPeriod": "5"
//                 }
//             },
//             {
//                 "commentDes": "XLU Aggregated Put/Call Ratio moving average 100 > 1.0",
//                 "rocCond": {
//                     "newCondition": "0",
//                     "conditionPeriod": "5"
//                 }
//             }
//         ],
//         "exit_description": [
//             {
//                 "commentDes": "X: Close:   Time In Market 1(Bars)",
//                 "rocCond": null
//             }
//         ],
//         "indicator_layout": "{\"formIndicators\": {\"entry\": [\"xlu_put_call_ratio\"], \"exit\": [\"\"]}, \"technicalIndicators\": [], \"savedTechSD\": [{\"type\": \"xlu_put_call_ratio\", \"inputs\": {\"Period\": 13, \"Overlay\": false, \"id\": \"$r001$xlu_put_call_ratio$r001$ (13,n)\", \"display\": \"$r001$xlu_put_call_ratio$r001$ (13,n)\"}, \"outputs\": {}, \"parameters\": {\"studyOverZonesEnabled\": false, \"studyOverBoughtValue\": 80, \"studyOverBoughtColor\": \"#FF0000\", \"studyOverSoldValue\": 20, \"studyOverSoldColor\": \"#00DD00\", \"chartName\": \"chart\", \"editMode\": true}, \"panel\": \"$r001$xlu_put_call_ratio$r001$ (13,n)\"}, {\"type\": \"ST MA\", \"inputs\": {\"Period\": \"100\", \"Field\": \"etf_thirty\", \"Type\": \"ma\", \"Offset\": 0, \"display\": \"ST MA\", \"id\": \"$r001$ST MA$r001$ (5,etf_thirty,ma,0)\"}, \"outputs\": {\"MA\": \"#FF000\"}, \"parameters\": {\"criteria\": \"entry\", \"index\": 0, \"chartName\": \"chart\", \"editMode\": true}, \"panel\": \"$r001$etf_thirty$r001$ (13,n)\"}], \"activatedMA\": [{\"period\": 21, \"url\": \"\"}, {\"period\": \"100\", \"url\": \"xlu_put_call_ratio\", \"criteria\": \"entry\", \"index\": 0}]}",
//         "status": 2,
//         "strategy": "Signal",
//         "result": "{\"Total Trades\": 329, \"Total Return (%)\": -35.68}",
//         "seconds": 23,
//         "url_data": "",
//         "backtest_period": "21",
//         "trade_price": 2,
//         "exclude_oo": 0,
//         "total_trader": 329,
//         "total_return": -35.68,
//         "description": "backtest",
//         "last_entry_signal_date": null,
//         "last_exit_signal_date": null,
//         "market_environment": 0,
//         "index_moving_average_slope": 0
//     },
//     {
//         "id": "793291f9-cb52-848c-83aa-78c87d123a12",
//         "user": "04f7c8dc-93fb-4f38-b680-638b06e108b7",
//         "name": "8-year_with_index_ma",
//         "capital": 100000,
//         "symbol": "HYG",
//         "benchmark": "HYG",
//         "entry": "{\"score\": 2, \"signals_in_market\": 1, \"relation\": 2, \"delay_bars\": 0, \"signals\": [{\"code\": \"SI:Analyst Price Changes;IDS:EO80/EP20;SC:SV/3/100.0\"}, {\"code\": \"TI:Moving Average;IDS:SMA;SC:SC/0/MA10\"}], \"cond\": [{\"newCondition\": \"3\", \"conditionPeriod\": \"5\"}, {\"newCondition\": 0, \"conditionPeriod\": \"5\"}, \"\"]}",
//         "exit": "{\"score\":1,\"signals_in_market\":1,\"relation\":0,\"delay_bars\":0,\"signals\":[{\"code\":\"SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999\"}],\"cond\":[null]}",
//         "create_date": "2023-11-16T06:55:47.075872Z",
//         "start_date": "2015-11-16",
//         "end_date": "2023-11-16",
//         "capital_alloc": "1.000000",
//         "commission": "0.0010",
//         "slippage": "0.1000",
//         "frequency": "Daily",
//         "win_rate": "0.0000",
//         "risk_control": "//1",
//         "user_tag": "client",
//         "report_url": "",
//         "direction": "Long",
//         "favorites": true,
//         "entry_description": [
//             {
//                 "commentDes": "E: Long; SameBar Multi Condition; Score: 2;  ",
//                 "rocCond": {
//                     "newCondition": "3",
//                     "conditionPeriod": "5"
//                 }
//             },
//             {
//                 "commentDes": "Analyst Price Changes CrossAbove 100.0",
//                 "rocCond": {
//                     "newCondition": "3",
//                     "conditionPeriod": "5"
//                 }
//             },
//             {
//                 "commentDes": "Symbol Close  > Moving Average 10",
//                 "rocCond": null
//             }
//         ],
//         "exit_description": [
//             {
//                 "commentDes": "X: Close:   Time In Market 1(Bars)",
//                 "rocCond": null
//             }
//         ],
//         "indicator_layout": "{\"formIndicators\": {\"entry\": [\"survey_analysts\", \"ma\"], \"exit\": [\"\"]}, \"technicalIndicators\": [\"ma\"], \"savedTechSD\": [{\"type\": \"ma\", \"inputs\": {\"Period\": \"10\", \"Field\": \"Close\", \"Type\": \"simple\", \"Offset\": 0, \"id\": \"$r001$ma$r001$ (10,C,ma,0)\", \"display\": \"$r001$ma$r001$ (10,C,ma,0)\"}, \"outputs\": {\"MA\": \"#FF0000\"}, \"parameters\": {\"criteria\": \"entry\", \"index\": 1, \"chartName\": \"chart\", \"editMode\": true}, \"panel\": \"chart\"}], \"activatedMA\": [], \"activatedMALayout\": [{\"period\": \"10\", \"type\": \"simple\", \"field\": \"Close\", \"criteria\": \"entry\", \"index\": 1}]}",
//         "status": 2,
//         "strategy": "Signal",
//         "result": "{\"Total Trades\": 15, \"Total Return (%)\": -2.89}",
//         "seconds": 9,
//         "url_data": "",
//         "backtest_period": "8",
//         "trade_price": 2,
//         "exclude_oo": 0,
//         "total_trader": 15,
//         "total_return": -2.89,
//         "description": "backtest",
//         "last_entry_signal_date": null,
//         "last_exit_signal_date": null,
//         "market_environment": 0,
//         "index_moving_average_slope": 0
//     },
//     {
//         "id": "43f16e4c-db94-28f0-31a9-183159a9d42e",
//         "user": "04f7c8dc-93fb-4f38-b680-638b06e108b7",
//         "name": "Yearly test",
//         "capital": 100000,
//         "symbol": "XLU",
//         "benchmark": "XLU",
//         "entry": "{\"relation\": 1, \"score\": 1, \"delay_bars\": 0, \"signals_in_market\": 1, \"signals\": [{\"code\": \"SI:XLU Aggregated Put/Call Ratio;IDS:EO80/EP20;SC:SV/0/2.0\"}], \"cond\": [{\"newCondition\": \"0\", \"conditionPeriod\": \"5\"}]}",
//         "exit": "{\"score\":1,\"signals_in_market\":1,\"relation\":0,\"delay_bars\":0,\"signals\":[{\"code\":\"SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999\"}],\"cond\":[null]}",
//         "create_date": "2023-11-16T02:02:36.405059Z",
//         "start_date": "1800-10-01",
//         "end_date": "2023-11-16",
//         "capital_alloc": "1.000000",
//         "commission": "0.0010",
//         "slippage": "0.1000",
//         "frequency": "Monthly",
//         "win_rate": "0.0000",
//         "risk_control": "//1",
//         "user_tag": "client",
//         "report_url": "",
//         "direction": "Long",
//         "favorites": true,
//         "entry_description": [
//             {
//                 "commentDes": "E: Long; Single Condition XLU Aggregated Put/Call Ratio > 2.0;",
//                 "rocCond": {
//                     "newCondition": "0",
//                     "conditionPeriod": "5"
//                 }
//             },
//             {
//                 "commentDes": "XLU Aggregated Put/Call Ratio > 2.0",
//                 "rocCond": {
//                     "newCondition": "0",
//                     "conditionPeriod": "5"
//                 }
//             }
//         ],
//         "exit_description": [
//             {
//                 "commentDes": "X: Close:   Time In Market 1(Bars)",
//                 "rocCond": null
//             }
//         ],
//         "indicator_layout": "{\"formIndicators\": {\"entry\": [\"xlu_put_call_ratio\"], \"exit\": [\"\"]}, \"technicalIndicators\": [], \"savedTechSD\": [{\"type\": \"xlu_put_call_ratio\", \"inputs\": {\"Period\": 13, \"Overlay\": false, \"id\": \"$r001$xlu_put_call_ratio$r001$ (13,n)\", \"display\": \"$r001$sxlu_put_call_ratio$r001$ (13,n)\"}, \"outputs\": {}, \"parameters\": {\"studyOverZonesEnabled\": false, \"studyOverBoughtValue\": 70, \"studyOverBoughtColor\": \"#FF0000\", \"studyOverSoldValue\": null, \"studyOverSoldColor\": \"#00DD00\", \"chartName\": \"chart\", \"editMode\": true}, \"panel\": \"$r001$xlu_put_call_ratio$r001$ (13,n)\"}], \"activatedMA\": []}",
//         "status": 2,
//         "strategy": "Signal",
//         "result": "{\"Total Trades\": 1, \"Total Return (%)\": 3.93}",
//         "seconds": 7,
//         "url_data": "",
//         "backtest_period": "21",
//         "trade_price": 2,
//         "exclude_oo": 0,
//         "total_trader": 1,
//         "total_return": 3.93,
//         "description": "backtest",
//         "last_entry_signal_date": null,
//         "last_exit_signal_date": null,
//         "market_environment": 0,
//         "index_moving_average_slope": 0
//     },
// ],
      tableCol: [
        {
          label: 'Name',
          field: 'name',
          width: '250px'
        },
        {
          label: 'Symbol',
          field: 'symbol',
          width: '70px'
        },
        {
          label: 'DesExpand',
          type: 'expand'
        },
        {
          label: 'Entry & Exit',
        },
        {
          label: 'Improved returns',
          field: 'improved_returns',
          width: '125px'
        },
        {
          label: 'Profit',
          field: 'profit',
          width: '125px'
        }
      ],
      loading: false,
      loadTest: 'Generating optimization solutions...',
    }
	},
	computed: {},
	watch: {},
	methods: {
    selectBT(val) {
      debugger
    },
		cancel() {
			// this.$router.push('/backtester/list/favorites')
			const optimizeBT = document.querySelector('#optimizeBT')
			optimizeBT.classList.remove('activated')
		},
    async addToList() {
			try {
				this.loading = true
				const copyName = `${data.name}(opt)`

					data = JSON.parse(JSON.stringify(data))
	
          // data = this.editSignalsCond(data, 'entry', 10)

					for (const key in data) {
						if (data.hasOwnProperty(key)) {
							if (data[key] !== null && (typeof data[key] === 'object' || Array.isArray(data[key]))) {
								data[key] = JSON.stringify(data[key]);
							}
						}
					}

					// 获取参数并准备复制
					const params = {
						...data,
						name: copyName,
						favorites: false,
						user_tag: 'client'
					}
					delete params.uuid
					delete params.results
					delete params.user_id
					delete params.status
					delete params.backtest_id
					delete params.old_uuid

					// 发起复制请求
					await copyBacktest(this.$qs.stringify(params))

					// // 重置查询页码并获取数据 History
					// if (this.currentPage === 'History') {
					// 	this.queryInfo.page = 1
					// 	await this.getDataList(null)
					// }
					// if (['Sample', 'Favorites', 'Analyst'].includes(this.currentPage)) {
					// 	this.$router.push('/backtester/list/history')
					// }
					// this.popUpMsgBox('Copy successfully')

				//this.loading = false
			} catch (error) {
				console.error('An error occurred:', error)
				//this.loading = false
			}
    },
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 0) {
			return 'dark-row'
			}
			return ''
		},
		async optimizeBacktest(data) {
			const optimizeBT = document.querySelector('#optimizeBT')
			optimizeBT.classList.add('activated')
this.loading = true
      let response = await runOPT(data.id)
      if(response.data.status == 200) {
        // 根据轮询结果返回的值修改指定回测的值并copy
        const OPTResults = await this.pollingOPTResults(data)
        this.dataList = OPTResults.map(item=> {
          const optimizedValue = item['Optimized_values']
          let signalCond 
          debugger
          signalCond = this.editSignalsCond(data, 'entry', optimizedValue[0])
          if(optimizedValue.length >=2){
            signalCond = this.editSignalsCond(data, 'exit', optimizedValue[1])
          }
           debugger
          return {
            data: signalCond,
            improved_returns: item['Improved returns'],
            profit: item['Profit']
          } 
        })
        this.loading = false
      }
		},
	}
}
</script>

<style lang="less" scoped>
h1 {
  font-size: 30px;
}
#optimizeBT {
	visibility: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #8b8a8a91;
	position: fixed !important;
	z-index: 9998;
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transition: opacity 0.3s;
	&.activated {
		visibility: visible;
	}
	.optimize-panel {
		width: 60vw;
    padding: 35px;
		background: white;
		display: grid;
		grid-template-rows: 1fr 3fr 1fr;
		align-items: center;
		.header {
			text-align: center;
		}
		.table {
			background: yellowgreen;
      height: 100%;
		}
    .btn-group {
  display: flex;
  justify-content: center;
  button.add-to-list,
  .cancel {
    border: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 42px;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    margin: 0 10px 10px 0;
    span {
      color: #ffffff;
    }
  }
  .cancel {
      background: #fbc05c;
      &:hover {
        background: #f59e0b;
        box-shadow: 0 6px 20px #f59e0b;
      }
  }
  .add-to-list {
      background: #5b9bd1;
      &:hover {
        background: #3787c9;
        box-shadow: 0 6px 20px #3787c9;
      }
  }
}
	}
}

/deep/ .el-table .cell {
	padding: 0px 10px 0px 10px;
	word-wrap: break-word;
}
.el-table__body-wrapper {
	overflow-x: scroll;
}
.descriptionBox {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	> * {
		flex: 1;
	}
	.entryBox {
		p:first-child {
			font-weight: 500;
			color: #99a9bf;
		}
	}
	.exitBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
}
</style>