<template>
	<div class="statistics-container">
		<div>
			<el-table header-align="center" class="CPM-summary" :data="summaryData">
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
					label="MEDIAN RETURN %"
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
				</el-table-column>
				<!-- <el-table-column
                prop="tzScore"
                label="Z-SCORE"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.tzScore >= 0">{{
                        scope.row.tzScore
                    }}</span>
                    <span v-else-if="isNaN(scope.row.tzScore)">0</span>
                    <span v-else style="color: #dd3a13">{{ scope.row.tzScore }}</span>
                </template>
            </el-table-column> -->
				<!-- <el-table-column
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
						</el-table-column> -->
				<el-table-column
					show-overflow-tooltip
					prop="buyHoldGain"
					label="BUY & HOLD %"
					align="center"
				>
					<template slot-scope="scope">
						<span v-if="scope.row.buyHoldGain >= 0">{{
							scope.row.buyHoldGain + '%'
						}}</span>
						<span v-else-if="isNaN(scope.row.buyHoldGain)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.buyHoldGain + '%'
						}}</span>
					</template>
				</el-table-column>
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
			</el-table>
			<el-table class="CPM-summary" header-align="center" :data="summaryData">
			</el-table>
			<el-table class="CPM-summary" header-align="center" :data="summaryData">
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
						<span v-else-if="isNaN(scope.row.averageWin)"></span>
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
						<span v-else-if="isNaN(scope.row.averageLoss)"></span>
						<span v-else style="color: #dd3a13">{{
							scope.row.averageLoss + '%'
						}}</span>
					</template>
				</el-table-column>
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
				<!-- <el-table-column
							show-overflow-tooltip
							prop="maxRisk"
							label="MAX RISK%"
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
						</el-table-column> -->
			</el-table>
			<el-table class="CPM-summary" header-align="center" :data="summaryData">
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
		<div class="CPM-trades">
			<el-table
				header-align="center"
				:row-class-name="tableRowClassName"
				:data="tradesData"
				border
				@sort-change="onSortChange"
			>
				<el-table-column
					prop="TradeDate"
					label="Trade Date"
					show-overflow-tooltip
					align="center"
					sortable="custom"
					width="140px"
				>
					<template slot-scope="scope">
						<span>{{ scope.row.TradeDate }}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="SymbolClose"
					label="Symbol Close"
					show-overflow-tooltip
					align="center"
					sortable="custom"
				>
					<template slot-scope="scope">
						<span :style="scope.row.SymbolClose >= 0 ? '' : 'color: #dd3a13'">{{
							scope.row.SymbolClose
						}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="CorrelationPercentage"
					label="Correlation Percentage"
					show-overflow-tooltip
					align="center"
					sortable="custom"
				>
					<template slot-scope="scope">
						<span
							:style="
								scope.row.CorrelationPercentage >= 0 ? '' : 'color: #dd3a13'
							"
							>{{ scope.row.CorrelationPercentage }}%</span
						>
					</template>
				</el-table-column>
				<el-table-column
					prop="Return"
					label="Return"
					show-overflow-tooltip
					align="center"
					sortable="custom"
				>
					<template slot-scope="scope">
						<span :style="scope.row.Return >= 0 ? '' : 'color: #dd3a13'">{{
							scope.row.Return + '%'
						}}</span>
					</template>
				</el-table-column>	
				<el-table-column
                prop="MarketCondition"
                label="Market Condition"
                align="center"
            >
            <template slot="header">
                Market Condition
                    <el-tooltip effect="dark" placement="top" style="display: inline">
                    <span slot="content" v-html="textContent['MarketCondition']">
                    </span>
                    <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
            </template>
            <template slot-scope="scope">
							<span v-if="scope.row.MarketCondition">{{scope.row.MarketCondition}}</span>
							<span v-else></span>
            </template>
        </el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Statistics',
	data() {
		return {
			summaryData: [{}],
			tradesData: [],
   textContent: {'MarketCondition': 'Indicates the market environment for this transaction:<br/> "Bear" stands for "Bear Market",<br/> "Bull" stands for "Bull Market",<br/> "Rec" stands for "Recession", "Ease" refers to "FOMC Easing",<br/> and "Tight" represents "FOMC Tightening".'},
			currentSort: {}, // 当前的排序信息
		}
	},
	methods: {
		tableRowClassName(obj) {
			const { row, rowIndex } = obj
			if (rowIndex % 2 === 1) {
				return 'darken-row'
			}
			return ''
		},
		displayData(data, transformedResult) {
			this.summaryData = [
				{
					...data
				}
			]
			this.tradesData = transformedResult.map(item => {item.Return = item.Return.toFixed(2); return item})
		},
		exportData() {
			return {summaryData: this.summaryData, tradesData: this.tradesData};
		},
		onSortChange(column){
			const sortingOrder = column.order
			const colName = column.prop
      console.log('colName', colName)
      this.currentSort = {
        prop: colName,
        order: sortingOrder
      };
			// 数字字符串转数字类型排序
			if (['SymbolClose', 'CorrelationPercentage', 'Return'].includes(colName)) {
					const parseValue = val => {
							if (typeof val === 'number') return val;
							if (typeof val === 'string') {
									// 去除 %、$ 等符号，只保留数字部分，转成 float
									const match = val.match(/-?\d+(\.\d+)?/);
									return match ? parseFloat(match[0]) : 0;
							}
							return 0;
					};

					if (sortingOrder === 'ascending') {
							this.tradesData.sort((a, b) => parseValue(a[colName]) - parseValue(b[colName]));
					} else if (sortingOrder === 'descending') {
							this.tradesData.sort((a, b) => parseValue(b[colName]) - parseValue(a[colName]));
					}
			}
			// 日期类型排序
			if(['TradeDate'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.tradesData.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.tradesData.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
		},
	}
}
</script>

<style lang="less" scoped>
.CPM-summary {
	margin: 5px 0;
}
.statistics-container {
	margin: 0 auto;
}
@media (min-width: 1600px) {
	.statistics-container {
		width: 1093px
	}
}
@media (min-width: 1280px) and (max-width: 1600px) {
	.statistics-container{
		width: 830px
	}
}
</style>