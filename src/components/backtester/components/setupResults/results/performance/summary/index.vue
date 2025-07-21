<template>
    <div>
        <div class="summaryContainer">
            <el-table :data="tableData" class="summary-table">
                <el-table-column
                    prop="totalReturn"
                    show-overflow-tooltip
                    label="TOTAL RETURN %"
                    align="center"
                    algin="center"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.totalReturn >= 0">{{
                            displayData(scope.row.totalReturn) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.totalReturn)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.totalReturn) + '%'
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="CAGR"
                    show-overflow-tooltip
                    label="Annual Return % (CAGR)"
                    align="center"
                    algin="center"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.CAGR >= 0">{{
                            displayData(scope.row.CAGR) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.CAGR)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.CAGR) + '%'
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
                            displayData(scope.row.medianReturn) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.medianReturn)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.medianReturn) + '%'
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
                            displayData(scope.row.averageReturn) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.averageReturn)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.averageReturn) + '%'
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
                            displayData(scope.row.tzScore)
                        }}</span>
                        <span v-else-if="isNaN(scope.row.tzScore)">0.0</span>
                        <span v-else style="color: #dd3a13">{{ displayData(scope.row.tzScore) }}</span>
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
                            displayData(scope.row.standardDeviation)
                        }}</span>
                        <span v-else-if="isNaN(scope.row.standardDeviation)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.standardDeviation)
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
                            displayData(scope.row.buyHoldGain) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.buyHoldGain)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.buyHoldGain) + '%'
                        }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-table
                header-align="center"
                :data="tableData"
                class="summary-table"
            >
                <el-table-column
                    prop="winRate"
                    label="WIN RATE %"
                    show-overflow-tooltip
                    width="180"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.winRate >= 0">{{
                            displayData(scope.row.winRate) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.winRate)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.winRate) + '%'
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
                            displayData(scope.row.averageWin) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.averageWin)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.averageWin) + '%'
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
                            displayData(scope.row.averageLoss) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.averageLoss)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.averageLoss) + '%'
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="drawDown"
                    label="MAX RISK %"
                    align="center"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.drawDown >= 0">{{
                            displayData(scope.row.drawDown) + '%'
                        }}</span>
                        <span v-else-if="isNaN(scope.row.drawDown)">0.0</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.drawDown) + '%'
                        }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                header-align="center"
                :data="tableData"
               class="summary-table"
            >
                <el-table-column
                    prop="totalTrades"
                    label="TOTAL TRADES"
                    width="180"
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
                            displayData(scope.row.timeInMarket) + '%'
                        }}</span>
                        <span v-else style="color: #dd3a13">{{
                            displayData(scope.row.timeInMarket) + '%'
                        }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="imgBox">
            <div
                v-if="
                    !tableData[0]?.returnsFileURL &&
                    !tableData[0]?.ddFileURL &&
                    !tableData[0]?.returnsHeatmapFileURL &&
                    !tableData[0]?.annualReturnsFileURL
                "
                style="text-align: left"
            >
                <el-empty image-size="80" description="No Data"></el-empty>
            </div>
            <div class="benchmarkReturnImg">
                <el-image v-if="tableData[0]?.equityCurveFileURL" style="width: 1000px; height: 600px; margin: 40px 0px 20px 0px;" :src="tableData[0]?.equityCurveFileURL" :fit="'contain'" lazy></el-image>
            </div>
            <div class="benchmarkReturnImg">
                <el-image v-if="tableData[0]?.returnsFileURL" style="width: 1000px; height: 600px; margin: 20px 0px 20px 0px;" :src="tableData[0]?.returnsFileURL" :fit="'contain'" lazy></el-image>
            </div>
            <div class="drawDownReturnImg">
                <el-image v-if="tableData[0]?.ddFileURL" style="width: 1000px; height: 600px; margin: 20px 0px 20px 0px;" :src="tableData[0]?.ddFileURL" :fit="'contain'" lazy></el-image>
            </div>
            <div class="monthReturnImg">
                <el-image v-if="tableData[0]?.returnsHeatmapFileURL" style="width: 1000px; height: 600px; margin: 20px 0px 20px 0px;" :src="tableData[0]?.returnsHeatmapFileURL" :fit="'contain'" lazy></el-image>
            </div>
            <div class="annualReturnImg">
                <el-image v-if="tableData[0]?.annualReturnsFileURL" style="width: 1000px; height: 600px; margin: 20px 0px 20px 0px;" :src="tableData[0]?.annualReturnsFileURL" :fit="'contain'" lazy></el-image>
            </div>
            <div class="benchmarkReturnImg">
                <el-image v-if="tableData[0]?.wfd_file_url" style="width: 1000px; height: 600px; margin: 20px 0px 0px 0px;" :src="tableData[0]?.wfd_file_url" :fit="'contain'" lazy></el-image>
            </div>
            <div class="benchmarkReturnImg">
                <el-image v-if="tableData[0]?.eoy_file_url" style="width: 1000px; height: 700px" :src="tableData[0]?.eoy_file_url" :fit="'contain'" lazy></el-image> 
            </div>
            <div class="benchmarkReturnImg">
                <el-image v-if="tableData[0]?.rb_file_url" style="width: 1000px; height: 700px" :src="tableData[0]?.rb_file_url" :fit="'contain'" lazy></el-image> 
            </div>
        </div>
    </div>
</template>

<script>

export default {
	name: 'Summary',
	data() {
		return {
		}
	},
	props: {
		tableData: Array,
	},
    created(){

    },
	methods: {
    displayData(data) {
        const numberRegex = /^-?\d+(\.\d+)?$/
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/

        if (numberRegex.test(data)) {
            return data.toFixed(1)
        } else if (dateRegex.test(data)) {
            return data
        } else if(typeof data == 'string'){
            return data
        }else {
            return ''
        }
    },
    }
}
</script>

<style lang="less" scoped>
.imgBox {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
// .imgBox div {
// 	margin: 10px 0px 10px 0px;
// }
.summary-table{
    margin-top: 20px
}
</style>