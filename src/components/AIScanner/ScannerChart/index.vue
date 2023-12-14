<template>
	<div class="main-content">
		<Chart
			v-if="isAsyncDown"
			:symbol="rowData ? rowData.Symbol : 'AAPL'"
			:other="other"
			:direction="rowData ? rowData.Direction : null"
		/>
		<div class="gradient"></div>
		<!-- <el-card class="form-box"> -->
		<div class="form-box">
			<el-tabs v-model="activePerTag" type="card" stretch>
				<el-tab-pane label="History" name="first">
					<div class="history-container">
						<div class="form-label">
							<h2>Backtest Results</h2>
							<div class="form-label-detail">
								Symbol: {{ rowData ? rowData.Symbol : '' }}
							</div>
						</div>
						<el-skeleton :rows="6" :loading="loading" animated>
							<template>
								<el-table
									:data="backtestResultList"
									stripe
									show-summary
									:summary-method="getSummaries"
									class="aiResultsTable"
									border
								>
										<template v-for="(l, index) in defaultTableLabels">
											<el-table-column
												:label="l"
												:prop="l"
												:key="index"
											>
												<template slot-scope="scope">
													<p class="tableText" :class="getCellStyle(scope.row[l])">
														{{ scope.row[l] }}
													</p>
												</template>
											</el-table-column>
										</template>
								</el-table>
							</template>
						</el-skeleton>
						<div class="zscore-container">
							<el-skeleton :rows="2" :loading="loading" animated>
								<template>
									<el-table
										:data="result_quotes"
										:show-header="false"
										stripe
										class="aiResultsTable"
										border
									>

										<template v-for="column in defaultTableLabels">
											
										<el-table-column prop="property" label="Property" v-if="column == 'Entry Date'" :key="column">
										</el-table-column>
											<el-table-column
												v-else
												:key="column"
												:label="column"
												:prop="column"
											>
												<template slot-scope="scope">
													<p class="tableText" :class="getCellStyle(scope.row[column])">
														{{
															!Number.isNaN(scope.row[column])
																? typeof scope.row[column] == 'string'
																	? scope.row[column]
																	: parseFloat(
																			scope.row[column]
																		).toFixed(1)
																: null
														}}
													</p>
												</template>
											</el-table-column>
										</template>
									</el-table>
								</template>
							</el-skeleton>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane
					label="Summary"
					name="second"
				>
					<Result
						v-if="isAsyncDown"
						:other="other"
						currTabPage="BacktestResult.Summary.tableCol"
					/>
				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- </el-card> -->
	</div>
</template>
<script>
import Result from './components/PerformanceComponent'
import Chart from './components/ChartComponent.vue'
import { mapGetters } from 'vuex'
import { getBacktestInfo } from '@/service/ai'

export default {
	name: 'scannerai_chart',
	components: {
		Chart,
		Result
	},
	 data() {
		return {
			activePerTag : 'first',
			loading : true,
			rowData : this.$route.query.rowData
				? JSON.parse(this.$route.query.rowData)
				: null,
			other : {},
			isAsyncDown : false,
			backtestResultList : [],
			defaultTableLabels: [
			'Entry Date',
			'1 Week [%]',
			'2 Weeks [%]',
			'1 Month [%]',
			'2 Months [%]',
			'3 Months [%]',
			'6 Months [%]',
			'12 Months [%]'
			],
			currTabPage : 'BacktestResult',
			translateTabelCol : [],
			result_quotes: []
		}
	},
computed: {
		...mapGetters(['getBacktestResult', 'getBacktestZScoreResult']),
		backtestResult() {
			return this.getBacktestResult
		},
		backtestZScoreResult() {
			return this.getBacktestZScoreResult
		},
	},
	watch: {
		backtestResult: {
			handler(newVal) {
				this.backtestResultList = newVal
			},
			immediate: true,
			deep: true
		},
		backtestZScoreResult: {
			handler(newVal) {
				this.result_quotes = newVal
				console.log('this.backtestZScoreResult',newVal)
			},
			immediate: true,
			deep: true
		},
	},
	created() {
		this.loading = false
		this.getBacktestInfo({
			symbol: this.rowData['Symbol'],
			date: this.rowData['Date'],
			signal: this.rowData['_Signal'],
			category: this.rowData['Category'],
		})
	},
	mounted() {},
	methods: {
		async getBacktestInfo(date) {
			let BacktestInfoContent = await getBacktestInfo(date)

			this.other = BacktestInfoContent

			this.isAsyncDown = true

			return BacktestInfoContent
		},
		getSummaries(param) {
			const { columns, data } = param

			const sums = [] //声明变量
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = 'Average'
					return
				}
				// if (index === 1) {
				// 	return
				// }
				const values = data.map((item) => {
					return Number(
						item[column.property].slice(0, item[column.property].length - 1)
					)
				})
				let totalCount = 0 // 求平均数使用
				sums[index] = values.reduce((prev, curr) => {
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
		},
		getCellStyle(value) {
			return {
        'negative-value': value < 0,
      };
		}

	},

}
</script>

<style scoped lang="less">
.gradient {
	padding-top: 88px;
	background: linear-gradient(180deg, #dde0e4, rgba(249, 250, 251, 0));
}
.main-content {
	//background: $dark_white;

	display: grid;
	grid-auto-rows: auto 1fr;
	grid-gap: 20px;
}
.chart_box {
	margin: 50px 50px;
	resize: vertical;
	overflow: hidden;
	border: 1px solid black;
	border-radius: 5px;

	//预设高度
	height: 510px;
}
.form-box {
	margin: 0 50px 50px 50px;
	overflow: hidden;
}
.form-label h2 {
	color: black;
	text-align: center;
	margin-bottom: 5px;
}
.form-label-detail {
	font-size: 0.8rem;
	text-align: center;
}

// mobile
@media only screen and (max-width: 992px) {
	.chart_box {
		margin: 20px 15px;
	}
	.form-box {
		margin: 0 50px 15px 15px;
	}
}
.aiResultsTable{
	width: 1140px; 
	height: 100%; 
	margin: 0 auto
}
</style>

