// Summary & Trades
<template>
	<div class="result-container">
		<el-skeleton :rows="12" :loading="loading" animated>
			<template>
				<div class="summaryContainer">
					<el-table
						header-align="center"
						:data="tableData"
						style="width: 100%; margin-top: 20px"
					>
						<el-table-column
							prop="winRate"
							label="WIN RATE %"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.winRate >= 0">{{
									scope.row.winRate + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.winRate)">0</span>
								<span v-else style="color: red">{{
									scope.row.winRate + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="averageWin"
							label="AVERAGE WIN %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.averageWin >= 0">{{
									scope.row.averageWin + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.averageWin)">0</span>
								<span v-else style="color: red">{{
									scope.row.averageWin + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="averageLoss"
							label="AVERAGE LOSS %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.averageLoss >= 0">{{
									scope.row.averageLoss + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.averageLoss)">0</span>
								<span v-else style="color: red">{{
									scope.row.averageLoss + '%'
								}}</span>
							</template>
						</el-table-column>
						<!-- <el-table-column
							prop="drawDown"
							label="MAX RISK %"
							align="center"
							show-overflow-tooltip
						>
							<template slot-scope="scope">
								<span v-if="scope.row.drawDown >= 0">{{
									scope.row.drawDown + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.drawDown)">0</span>
								<span v-else style="color: red">{{
									scope.row.drawDown + '%'
								}}</span>
							</template>
						</el-table-column> -->
					</el-table>
					<el-table
						header-align="center"
						:data="tableData"
						style="width: 100%; margin-top: 20px"
					>
						<el-table-column
							prop="totalTrades"
							label="TOTAL TRADES"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.totalTrades >= 0">{{
									scope.row.totalTrades
								}}</span>
								<span v-else style="color: red">{{
									scope.row.totalTrades
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="totalPositive"
							label="TOTAL POSITIVE"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.totalPositive >= 0">{{
									scope.row.totalPositive
								}}</span>
								<span v-else style="color: red">{{
									scope.row.totalPositive
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="totalNegative"
							show-overflow-tooltip
							label="TOTAL NEGATIVE"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.totalNegative >= 0">{{
									scope.row.totalNegative
								}}</span>
								<span v-else style="color: red">{{
									scope.row.totalNegative
								}}</span>
							</template>
						</el-table-column>
						<!-- <el-table-column
							prop="timeInMarket"
							show-overflow-tooltip
							label="TIME IN MARKET %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.timeInMarket >= 0">{{
									scope.row.timeInMarket + '%'
								}}</span>
								<span v-else style="color: red">{{
									scope.row.timeInMarket + '%'
								}}</span>
							</template>
						</el-table-column> -->
					</el-table>
				</div>
			</template>
		</el-skeleton>

		<el-skeleton :rows="12" :loading="loading" animated>
			<template>
				<div class="historyContainer">
					<el-table
						header-align="center"
						:data="historyData"
						style="width: 100%; margin-top: 20px"
						show-summary
						:summary-method="getSummaries"
					>
						<el-table-column
							type="index"
							show-overflow-tooltip
							align="center"
							width="50"
						>
						</el-table-column>
						<el-table-column
							prop="entryDate"
							label="ENTRY DATE"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.entryDate }}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exitDate"
							label="EXIT DATE"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.exitDate }}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exitReason"
							label="EXIT REASON"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.exitReason }}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="eachReturn"
							label="EACH RETURN"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span>{{ scope.row.eachReturn.toFixed(2) + ' %' }}</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</template>
		</el-skeleton>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'

@Component
export default class PerformanceComponent extends Vue {
	@Prop() other!: any
	@Prop() currTabPage!: string
	tableData: Array<any>
	historyData: Array<any>
	loading: boolean
	constructor() {
		super()
		this.loading = true
		this.tableData = []
		this.historyData = []
	}
	created() {
		this.getResultData()
	}
	getResultData() {
		// todo
		this.loading = false
		let data: any = {}
		let resultObj = this.other
		// data.totalReturn = resultObj['TotalReturn']
		// data.CAGR = resultObj['AnnualReturn']
		// data.medianReturn = resultObj['MedianReturn']
		// data.averageReturn = resultObj['AvgReturn']
		// data.tzScore = resultObj['Z_Score']
		// data.standardDeviation = resultObj['StdDev']
		// data.buyHoldGain = resultObj['BuyHold']
		data.winRate = resultObj['WinRate']
		data.averageWin = resultObj['AvgWin']
		data.averageLoss = resultObj['AvgLoss']
		//data.drawDown = resultObj['DrawDown']
		data.totalTrades = resultObj['TradeNumber']
		data.totalPositive = Math.round(
			(resultObj['TradeNumber'] * resultObj['WinRate']) / 100
		)
		data.totalNegative = Math.round(
			resultObj['TradeNumber'] -
				(resultObj['TradeNumber'] * resultObj['WinRate']) / 100
		)
		//data.timeInMarket = resultObj['TimeInMarket']
		this.tableData.push(data)

		const entryTradeDate = eval('(' + this.other['EntryTradeDate'] + ')')
		const exitTradeDate = eval('(' + this.other['ExitTradeDate'] + ')')
		const exitReason = eval('(' + this.other['ExitReason'] + ')')
		const eachReturn = eval('(' + this.other['EachReturn'] + ')')
		for (let i = 0; i < entryTradeDate.length; i++) {
			this.historyData.push({
				entryDate: entryTradeDate[i],
				exitDate: exitTradeDate[i],
				eachReturn: eachReturn[i],
				exitReason: exitReason[i]
			})
		}
		console.log(this.historyData)
	}
	getSummaries(param: any) {
		const { columns, data } = param

		const sums: Array<any> = [] //声明变量
		columns.forEach((column: any, index: any) => {
			if (index === 3) {
				sums[index] = 'Average:'
				return
			}
			if (index !== 4) {
				return
			}

			const values = data.map((item: any) => {
				return item[column.property]
			})

			let totalCount = 0 // 求平均数使用
			sums[index] = values.reduce((prev: any, curr: any) => {
				const value = Number(curr)
				if (!isNaN(value) && value != 0) {
					totalCount++
					return prev + curr
				} else {
					return prev
				}
			}, 0)

			sums[index] = sums[index] / totalCount

			// ***********演示完要删**************************************
			// if(this.rowData && this.rowData.Symbol=='WWW' && sums[index]<0){
			//   sums[index] = -sums[index]
			// }
			// *****************************************************

			sums[index] = sums[index].toFixed(2)
			sums[index] = sums[index] + ' %'
		})
		return sums
	}
}
</script>

<style scoped lang="less">
.hint {
	position: absolute;
	font-size: 0.8rem;
	color: black !important;
	right: 8px;
	font-weight: 300;
}

.imgBox {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.imgBox div {
	margin: 60px 0px 20px 0px;
}
.result-container {
	padding-bottom: 20px;
}
.historyContainer {
	margin: 50px 0 0 0;
}
</style>

