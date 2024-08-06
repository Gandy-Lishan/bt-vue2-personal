// Summary & Trades
<template>
	<div class="result-container">
		<el-skeleton :rows="12" :loading="loading" animated>
			<template>
				<div class="summaryContainer">
					<el-table
						header-align="center"
						:data="tableData"
						class="aisummaryTable">
						<el-table-column
								show-overflow-tooltip
								prop="CAGR"
								label="ANNUAL RETURN % (CAGR)"
								align="center"
							>
								<template slot-scope="scope">
									<span v-if="scope.row.CAGR >= 0">{{
										scope.row.CAGR + '%'
									}}</span>
									<span v-else-if="isNaN(scope.row.CAGR) || !scope.row.CAGR || scope.row.CAGR=='null' || scope.row.CAGR=='0'"></span>
									<span v-else style="color: #dd3a13">{{
										scope.row.CAGR + '%'
									}}</span>
								</template>
						</el-table-column>
						<el-table-column
								show-overflow-tooltip
								prop="medianReturn"
								label="MEDIAN RETURN %"
								align="center"
						>
								<template slot-scope="scope">
									<span v-if="scope.row.medianReturn >= 0">{{
										scope.row.medianReturn + '%'
									}}</span>
									<span v-else-if="isNaN(scope.row.medianReturn) || !scope.row.medianReturn || scope.row.medianReturn=='null' || scope.row.medianReturn=='0'"></span>
									<span v-else style="color: #dd3a13">{{
										scope.row.medianReturn + '%'
									}}</span>
								</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="averageReturn"
							label="AVERAGE RETURN %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.averageReturn >= 0">{{
									scope.row.averageReturn + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.averageReturn) || !scope.row.averageReturn || scope.row.averageReturn=='null' || scope.row.averageReturn=='0'"></span>
								<span v-else style="color: #dd3a13">{{
									scope.row.averageReturn + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="standardDeviation"
							label="STD. DEV"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.standardDeviation >= 0">{{
									scope.row.standardDeviation
								}}</span>
								<span v-else-if="isNaN(scope.row.standardDeviation) || !scope.row.standardDeviation || scope.row.standardDeviation=='null' || scope.row.standardDeviation=='0'"></span>
								<span v-else style="color: #dd3a13">{{
									scope.row.standardDeviation
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							show-overflow-tooltip
							prop="maxRisk"
							label="MAX RISK %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.maxRisk >= 0">{{
									scope.row.maxRisk + '%'
								}}</span>
								<span v-else-if="isNaN(scope.row.maxRisk) || !scope.row.maxRisk || scope.row.maxRisk=='null' || scope.row.maxRisk=='0'"></span>
								<span v-else style="color: #dd3a13">{{
									scope.row.maxRisk + '%'
								}}</span>
							</template>
						</el-table-column>
					</el-table>
					<el-table
						header-align="center"
						:data="tableData"
						class="aisummaryTable"
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
								<span v-else style="color: #dd3a13">{{
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
								<span v-else style="color: #dd3a13">{{
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
								<span v-else style="color: #dd3a13">{{
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
								<span v-else style="color: #dd3a13">{{
									scope.row.drawDown + '%'
								}}</span>
							</template>
						</el-table-column> -->
					</el-table>
					<el-table
						header-align="center"
						:data="tableData"
						class="aisummaryTable"
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
								<span v-else style="color: #dd3a13">{{
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
								<span v-else style="color: #dd3a13">{{
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
								<span v-else style="color: #dd3a13">{{
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
								<span v-else style="color: #dd3a13">{{
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
						:row-class-name="tableRowClassName"
						:data="historyData"
						class="aisummaryTable"
						show-summary
						:summary-method="getSummaries"
						border
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
								<span>{{
									scope.row.entryDate
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exitDate"
							label="EXIT DATE"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span>{{
									scope.row.exitDate
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="exitReason"
							label="EXIT REASON"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span>{{
									scope.row.exitReason
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="eachReturn"
							label="EACH RETURN"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								<span  :class="getCellStyle(scope.row['eachReturn'])">{{
									scope.row.eachReturn.toFixed(2) + '%'
								}}</span>
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
		this.historyData = [
			
		]
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
		// lishan 新增字段
		data.CAGR = resultObj['AnnualReturn']
		data.medianReturn = resultObj['MedianReturn']
		data.averageReturn = resultObj['AvgReturn']
		data.standardDeviation = resultObj['StdDev']
		data.maxRisk = resultObj['MaxRisk']
		//data.timeInMarket = resultObj['TimeInMarket']
		this.tableData.push(data)

		const entryTradeDate = this.other['EntryTradeDate']? eval('(' + this.other['EntryTradeDate'] + ')') : []
		const exitTradeDate = this.other['ExitTradeDate']? eval('(' + this.other['ExitTradeDate'] + ')') : []
		const exitReason = this.other['ExitReason']? eval('(' + this.other['ExitReason'] + ')') : []
		const eachReturn = this.other['EachReturn']? eval('(' + this.other['EachReturn'] + ')') : []
		for(let i = 0;i<entryTradeDate.length;i++){
			this.historyData.push( {
				entryDate: entryTradeDate?entryTradeDate[i]:'',
				exitDate: exitTradeDate?exitTradeDate[i]:'',
				eachReturn: eachReturn?eachReturn[i]:0,
				exitReason: exitReason?exitReason[i]:''
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
			sums[index] = sums[index] + '%'
		})
		return sums
	}
	getCellStyle(value: any) {
	// Check if the value is negative and return a class name accordingly
	return {
		'negative-value': value < 0,
	}
	}
	tableRowClassName(obj: any) {
		const {row, rowIndex} = obj
			if (rowIndex%2 === 1) {
			return 'darken-row';
			}
			return '';
	}
	exportData() {
		return {
			tableData: this.tableData,
			historyData: this.historyData
		}
	}
}
</script>

<style scoped lang="scss">
.hint {
	position: absolute;
	font-size: 0.8rem;
	color: black !important;
	right: 8px;
	font-weight: 300;
}
.result-container {
	padding-bottom: 20px;
}
.historyContainer{
	margin: 50px 0 0 0;
}
.darken-row {
	background-color: #f9f9f9;
}
.summaryContainer{
	margin-top: 20px;
}
.aisummaryTable{
	margin: 0 auto; 
	margin-top: 20px; 
}
@media (min-width: 1600px) {
	.aisummaryTable{
	width: 1140px; 
	}
}
@media (min-width: 1280px) and (max-width: 1600px) {
	.aisummaryTable{
		width: 830px
	}
}
</style>

