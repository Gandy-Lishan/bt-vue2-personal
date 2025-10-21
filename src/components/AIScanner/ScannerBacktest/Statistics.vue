<template>
	<div class="statistics-container">
		<div class="statistics-title">
		</div>
		<div>
			<el-table header-align="center" class="CPM-summary" :data="summaryData" size="small">
				<el-table-column
					prop="totalReturn"
					show-overflow-tooltip
					label="TOTAL RETURN %"
					align="center"
					algin="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.totalReturn >= 0">{{
							scope.row.totalReturn + '%'
						}}</span>
						<span v-else-if="isNaN(scope.row.totalReturn)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.totalReturn + '%'
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="medianReturn"
					label="MEDIAN TRADE RETURN %"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.medianReturn >= 0">{{
							scope.row.medianReturn + '%'
						}}</span>
						<span
							v-else-if="
								isNaN(scope.row.medianReturn) ||
								!scope.row.medianReturn ||
								scope.row.medianReturn == 'null' ||
								scope.row.medianReturn == '0'
							"
						></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.medianReturn + '%'
						}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column
					show-overflow-tooltip
					prop="averageReturn"
					label="AVERAGE RETURN %"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.averageReturn >= 0">{{
							scope.row.averageReturn + '%'
						}}</span>
						<span
							v-else-if="
								isNaN(scope.row.averageReturn) ||
								!scope.row.averageReturn ||
								scope.row.averageReturn == 'null' ||
								scope.row.averageReturn == '0'
							"
						></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.averageReturn + '%'
						}}</span>
					</template>
				</el-table-column> -->
						<el-table-column
                prop="tzScore"
                label="Z-SCORE"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.tzScore >= 0">{{
                        scope.row.tzScore
                    }}</span>
                    <span v-else-if="scope.row.tzScore < 0" style="color: #dd3a13">{{ scope.row.tzScore }}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
						<el-table-column
								prop="standardDeviation"
								label="STD. DEV"
								show-overflow-tooltip
								align="center"
						>
								<template slot-scope="scope">
										<span v-if="scope.row.standardDeviation >= 0">{{
												scope.row.standardDeviation
										}}</span>
										<span v-else-if="scope.row.standardDeviation < 0" style="color: #dd3a13">{{
												scope.row.standardDeviation
										}}</span>
										<span v-else></span>
								</template>
						</el-table-column>
						<el-table-column
					show-overflow-tooltip
					prop="BUYandHOLD"
					label="BUY & HOLD %(SPX)"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.BUYandHOLD >= 0">{{
							scope.row.BUYandHOLD + '%'
						}}</span>
						<span v-else-if="isNaN(scope.row.BUYandHOLD)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.BUYandHOLD + '%'
						}}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-table class="CPM-summary" header-align="center" :data="summaryData" size="small">
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
								<span v-else-if="isNaN(scope.row.winRate)"></span>
								<span v-else style="color: #dd3a13">{{
									scope.row.winRate + '%'
								}}</span>
							</template>
						</el-table-column>
						<el-table-column
					show-overflow-tooltip
					prop="averageWin"
					label="AVERAGE TRADE WIN %"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.averageWin >= 0">{{
							scope.row.averageWin + '%'
						}}</span>
						<span v-else-if="isNaN(scope.row.averageWin)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.averageWin + '%'
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					show-overflow-tooltip
					prop="averageLoss"
					label="AVERAGE TRADE LOSS %"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.averageLoss >= 0">{{
							scope.row.averageLoss + '%'
						}}</span>
						<span v-else-if="isNaN(scope.row.averageLoss)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.averageLoss + '%'
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
			<el-table class="CPM-summary" header-align="center" :data="summaryData" size="small">
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
				<el-table-column
					prop="timeInMarket"
					show-overflow-tooltip
					label="TIME IN MARKET %"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.timeInMarket >= 0">{{
							scope.row.timeInMarket + '%'
						}}</span>
						<span v-else-if="isNaN(scope.row.timeInMarket)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.timeInMarket + '%'
						}}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="imgBox">
				<div
								v-if="
												!summaryData[0]?.DDFileURL &&
												!summaryData[0]?.ReturnsFileURL
								"
								style="text-align: left"
				>
								<el-empty image-size="80" description="No Data"></el-empty>
				</div>
			<el-image class="benchmarkReturnImg" v-if="summaryData[0]?.ReturnsFileURL" :src="summaryData[0]?.ReturnsFileURL" :fit="'contain'" lazy></el-image>
			<el-image class="benchmarkReturnImg" v-if="summaryData[0]?.DDFileURL" :src="summaryData[0]?.DDFileURL" :fit="'contain'" lazy></el-image>
</div>
	</div>
</template>
<script>
export default {
	name: 'Statistics',
	data() {
		return {
			summaryData: [{}]
		}
	},
	methods: {
		displayData(data) {
			debugger
			this.summaryData = [
				{
					...data
				}
			]
		},
		handleDownloadCsv() {
      const {summaryData} = this
      const summary = []
      summaryData.forEach((item, index) => {
        const obj = {}
        obj['TOTAL RETURN %'] = `${item.totalReturn}%`
        obj['MEDIAN TRADE RETURN %'] = `${item.medianReturn}%`
        obj['Z-SCORE'] = item.tzScore
				obj['STD. DEV'] = item.standardDeviation
				obj['BUY & HOLD %(SPX)'] = `${item.BUYandHOLD}%`
        obj['WIN RATE %'] = `${item.winRate}%`
        obj['AVERAGE TRADE WIN %'] = `${item.averageWin}%`
        obj['AVERAGE TRADE LOSS %'] =  `${item.averageLoss}%`
				obj['MAX RISK %'] = `${item.maxRisk}%`
        obj['TOTAL TRADES'] =  `${item.totalTrades}`
        obj['TOTAL POSITIVE'] = `${item.totalPositive}`
        obj['TOTAL NEGATIVE'] =`${item.totalNegative}`
        obj['TIME IN MARKET %'] = `${item.timeInMarket}%`
        summary.push(obj)
      })
			return summary
		}
	}
}
</script>

<style lang="less" scoped>
.statistics-container {
	padding: 20px;
	.statistics-title {
		padding: 30px 0px 30px 0px;
		border-bottom: 2px solid #dddddd;
	}
}
.CPM-summary {
	margin: 5px 0;
}
.CPM-trades {
	margin-top: 40px;
	border-top: 2px solid #dddddd;
}
.statistics-title {
	align-items: center;
	justify-content: flex-end;
	display: flex;
}
.imgBox {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.benchmarkReturnImg {
	width: 1000px;
	height: 600px; 
	margin: 20px 0px 20px 0px;
}
@media (max-width: 1200px) {
.benchmarkReturnImg {
    width: auto;
    height: auto;
}
}
</style>