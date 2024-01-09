<template>
  <div class="statistics-container">
    <div class="CPM-summary">
      <el-table
        header-align="center"
        :data="summaryData">
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
                <span v-else-if="isNaN(scope.row.totalReturn)">0</span>
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
										scope.row.medianReturn + ' %'
									}}</span>
									<span v-else-if="isNaN(scope.row.medianReturn) || !scope.row.medianReturn || scope.row.medianReturn=='null' || scope.row.medianReturn=='0'"></span>
									<span v-else style="color: #dd3a13">{{
										scope.row.medianReturn + ' %'
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
									scope.row.averageReturn + ' %'
								}}</span>
								<span v-else-if="isNaN(scope.row.averageReturn) || !scope.row.averageReturn || scope.row.averageReturn=='null' || scope.row.averageReturn=='0'"></span>
								<span v-else style="color: #dd3a13">{{
									scope.row.averageReturn + ' %'
								}}</span>
							</template>
						</el-table-column>
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
                    <span v-else-if="isNaN(scope.row.tzScore)">0</span>
                    <span v-else style="color: #dd3a13">{{ scope.row.tzScore }}</span>
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
                prop="buyHoldGain"
                label="BUY & HOLD %"
                align="center"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.buyHoldGain >= 0">{{
                        scope.row.buyHoldGain + '%'
                    }}</span>
                    <span v-else-if="isNaN(scope.row.buyHoldGain)">0</span>
                    <span v-else style="color: #dd3a13">{{
                        scope.row.buyHoldGain + '%'
                    }}</span>
                </template>
            </el-table-column>
		  </el-table>
					<el-table
						header-align="center"
						:data="summaryData"
					>
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
						:data="summaryData"
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
						<el-table-column
							show-overflow-tooltip
							prop="maxRisk"
							label="MAX RISK %"
							align="center"
						>
							<template slot-scope="scope">
								<span v-if="scope.row.maxRisk >= 0">{{
									scope.row.maxRisk + ' %'
								}}</span>
								<span v-else-if="isNaN(scope.row.maxRisk) || !scope.row.maxRisk || scope.row.maxRisk=='null' || scope.row.maxRisk=='0'"></span>
								<span v-else style="color: #dd3a13">{{
									scope.row.maxRisk + ' %'
								}}</span>
							</template>
						</el-table-column>
					</el-table>
          <el-table
						header-align="center"
						:data="summaryData"
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
      >
        <el-table-column
          prop="TradeDate"
          label="Trade Date"
          show-overflow-tooltip
          align="center"
        >
        <template slot-scope="scope">
            <span>{{
              scope.row.TradeDate
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="SymbolClose"
          label="Symbol Close"
          show-overflow-tooltip
          align="center"
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
        >
          <template slot-scope="scope">
            <span :style="scope.row.CorrelationPercentage >= 0 ? '' : 'color: #dd3a13'">{{
              scope.row.CorrelationPercentage
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Return"
          label="Return"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span :style="scope.row.Return >= 0 ? '' : 'color: #dd3a13'">{{
              scope.row.Return.toFixed(2) + ' %'
            }}</span>
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
      summaryData: [{
          totalReturn: -30.3,
          medianReturn: -1.89,
          averageReturn: -2.33,
          tzScore: -0.4,
          standardDeviation: 6.6,
          buyHoldGain: 84.2,
          winRate: 31,
          averageWin: 5.0,
          averageLoss: -5.6,
          maxRisk: -20.9,
          totalTrades: 13,
          totalPositive: 4,
          totalNegative: 9,
          timeInMarket: 7.2
      }],
      tradesData: [
        {
          TradeDate: '2013-07-06',
          SymbolClose: 103.22,
          CorrelationPercentage: 1.06,
          Return: 3.24
        },
        {
          TradeDate: '2013-07-06',
          SymbolClose: -103.22,
          CorrelationPercentage: -1.06,
          Return: -3.24
        },
        {
          TradeDate: '2013-07-06',
          SymbolClose: 103.22,
          CorrelationPercentage: -1.06,
          Return: 3.24
        },
        {
          TradeDate: '2013-07-06',
          SymbolClose: 103.22,
          CorrelationPercentage: 1.06,
          Return: -3.24
        },
        {
          TradeDate: '2013-07-06',
          SymbolClose: 103.22,
          CorrelationPercentage: 1.06,
          Return: 3.24
        }
      ]
    }
  },
  methods: {
    tableRowClassName(obj) {
      const {row, rowIndex} = obj
        if (rowIndex%2 === 1) {
        return 'darken-row';
        }
        return '';
	  },
		displayData(data, transformedResult) {
			debugger
      this.summaryData = [{
        ...this.summaryData,
        ...data
      }]
			this.tradesData = transformedResult
    }
  }
}
</script>

<style lang="less" scoped>
.CPM-summary {
  margin: 30px 0;
}
.CPM-summary .el-table /deep/ td.el-table__cell,
.CPM-summary .el-table /deep/ th.el-table__cell.is-leaf {
  border: unset;
}
.CPM-summary .el-table /deep/ td.el-table__cell, .el-table /deep/ th.el-table__cell.is-leaf {
  border: unset;
}
.CPM-summary .el-table /deep/ th.el-table__cell>.cell {
  text-transform: uppercase;
  color: #333;
  font-size: 16px;
  font-weight: 400;
}
.CPM-summary .el-table--enable-row-transition /deep/ .el-table__body td.el-table__cell {
  font-size: 20px;
  font-weight: 350;
  padding: 0px 0px 30px 0px;
}
.CPM-trades .el-table /deep/ th.el-table__cell.is-leaf {
  border-bottom: 2px solid #dddddd;
}
.CPM-trades .el-table /deep/ th.el-table__cell>.cell {
  font-size: 14px;
  font-weight: 600;
  color: #333333b8;
}
.CPM-trades .el-table--enable-row-transition /deep/ .el-table__body td.el-table__cell {
  font-weight: 350;
  padding: 8px;
}
</style>