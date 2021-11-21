<template>
   <el-tabs v-model="activePerTag" type="card" @tab-click="handleClick">
    <el-tab-pane label="Summary" name="first">
      <div class="summaryContainer">
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="totalReturn"
        label="TOTAL RETURN"
        align="center"
        algin="center">
        <template slot-scope="scope">
          <span v-if="scope.row.totalReturn >= 0">{{ scope.row.totalReturn + '%' }}</span>
          <span v-else style="color: red">{{scope.row.totalReturn + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="medianReturn"
        label="MEDIAN RETURN"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.medianReturn >= 0">{{ scope.row.medianReturn + '%' }}</span>
          <span v-else style="color: red">{{scope.row.medianReturn + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="averageReturn"
        label="AVERAGE RETURN"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.averageReturn >= 0">{{ scope.row.averageReturn + '%' }}</span>
          <span v-else style="color: red">{{scope.row.averageReturn + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tzScore"
        label="Z_SCORE"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tzScore >= 0">{{ scope.row.tzScore }}</span>
          <span v-else style="color: red">{{scope.row.tzScore}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="stdDev"
        label="STD. DEV"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.stdDev >= 0">{{ scope.row.stdDev }}</span>
          <span v-else style="color: red">{{scope.row.stdDev}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="buyHoldGain"
        label="BUY & HOLD"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.buyHoldGain >= 0">{{ scope.row.buyHoldGain + '%' }}</span>
          <span v-else style="color: red">{{scope.row.buyHoldGain + '%'}}</span>
        </template>
      </el-table-column>
    </el-table>


    <el-table
      header-align="center"
      :data="tableData"
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="winRate"
        label="WIN RATE"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.winRate >= 0">{{ scope.row.winRate + '%' }}</span>
          <span v-else style="color: red">{{scope.row.winRate + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="averageWin"
        label="AVERAGE WIN %"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.averageWin >= 0">{{ scope.row.averageWin + '%' }}</span>
          <span v-else style="color: red">{{scope.row.averageWin + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="averageLoss"
        label="AVERAGE LOSS %"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.averageLoss >= 0">{{ scope.row.averageLoss + '%' }}</span>
          <span v-else style="color: red">{{scope.row.averageLoss + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="maxRisk"
        label="MAX RISK"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.maxRisk >= 0">{{ scope.row.maxRisk + '%' }}</span>
          <span v-else style="color: red">{{scope.row.maxRisk + '%'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      header-align="center"
      :data="tableData"
      style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="totalTrades"
        label="TOTAL TRADES"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.totalTrades >= 0">{{ scope.row.totalTrades }}</span>
          <span v-else style="color: red">{{scope.row.totalTrades}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPositive"
        label="TOTAL POSITIVE"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.totalPositive >= 0">{{ scope.row.totalPositive }}</span>
          <span v-else style="color: red">{{scope.row.totalPositive}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalNegative"
        label="TOTAL NEGATIVE"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.totalNegative >= 0">{{ scope.row.totalNegative }}</span>
          <span v-else style="color: red">{{scope.row.totalNegative}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="timeInMarket"
        label="% TIME IN MARKET"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.timeInMarket >= 0">{{ scope.row.timeInMarket + '%' }}</span>
          <span v-else style="color: red">{{scope.row.timeInMarket + '%'}}</span>
        </template>
      </el-table-column>
    </el-table>
      </div>
      <div class="imgBox">
        <div class="benchmarkReturnImg">
          <img :src="returnImgUrl" alt="" width="100%">
        </div>
        <div class="drawDownReturnImg">
          <img :src="drawDownImgUrl" alt="" width="100%">
        </div>
        <div class="monthReturnImg">
          <img :src="monthReturnImgUrl" alt="" width="100%">
        </div>
        <div class="annualReturnImg">
          <img :src="annualReturnImgUrl" alt="" width="100%">
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Trades" name="second">Trades</el-tab-pane>
    <el-tab-pane label="Detailed Statistics" name="third">Detailed Statistics</el-tab-pane>
   </el-tabs>
</template>
<script>
import formateData from '../../../../../responseData/eb_test_response.json'
export default {
  data() {
    return {
      activePerTag: 'first',
      formateData,
      tableData: [],
      returnImgUrl: '',
      drawDownImgUrl: '',
      monthReturnImgUrl: '',
      annualReturnImgUrl: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleClick(tab, event) {
        console.log(tab, event);
      },
      getData() {
        let initalData = this.formateData
        let data = {}
        data.uuid = initalData["UUID"]
        data.symbol = initalData["Symbol"]
        data.frequency = initalData["Frequency"]
        data.totalTrades = initalData["Total Trades"]
        data.totalPositive = initalData["Total Positive"]
        data.totalNegative = initalData["Total Negative"]
        data.scratch = initalData["Scratch"]
        data.averageWin = initalData["Average Win %"]
        data.averageLoss = initalData["Average Loss %"]
        data.medianGain = initalData["Median Gain"]
        data.medianLoss = initalData["Median Loss"]
        data.averageReturn = initalData["Average Return"]
        data.medianReturn = initalData["Median Return"]
        data.buyHoldGain = initalData["BuyHoldGain"]
        data.winRate = initalData["Win Rate"]
        data.timeInMarket = initalData["Time in Market"]
        data.totalReturn = initalData["Total Return (%)"]
        data.tzScore = initalData["Z-score"]
        data.standardDeviation = initalData["Standard Deviation"]
        data.s3_status_response = initalData["s3_status_response"]
        data.cagr = initalData["CAGR"]
        data.annual_volatiltiy = initalData["annual_volatiltiy"]
        data.calmar_ratio = initalData["calmar_ratio"]
        data.sortino_ratio = initalData["sortino_ratio"]
        data.tail_ratio = initalData["tail_ratio"]
        data.var = initalData["VAR"]
        data.capture = initalData["capture"]
        data.alpha = initalData["alpha"]
        data.beta = initalData["beta"]
        data.information_ratio = initalData["information_ratio"]
        data.sharpeRatio = initalData["Sharpe Ratio"]
        data.drawDown = initalData["DrawDown"]
        data.drawDownPeriod = initalData["DrawDown Period"]
        data.drawDownImageUploaded = initalData["DrawDown Image Uploaded"]
        data.ddFileURL = initalData["DD File URL"]
        data.returnsImageUploaded = initalData["Returns Image Uploaded"]
        data.returnsFileURL = initalData["Returns File URL"]
        data.annualReturnsImageUploaded = initalData["Annual Returns Image Uploaded"]
        data.annualReturnsFileURL = initalData["Annual Returns File URL"]
        data.returnsheatmapImageUploadedURL = initalData["Returns Heatmap Image Uploaded"]
        data.returnsHeatmapFileURL = initalData["Returns Heatmap File URL"]
        this.tableData.push(data)
        this.returnImgUrl = data.returnsFileURL
        this.drawDownImgUrl = data.ddFileURL
        this.monthReturnImgUrl = data.returnsHeatmapFileURL
        this.annualReturnImgUrl = data.annualReturnsFileURL
      }
  }
}
</script>
<style scoped>
.imgBox {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.imgBox div{
  margin: 60px 0px 20px 0px;
}
</style>