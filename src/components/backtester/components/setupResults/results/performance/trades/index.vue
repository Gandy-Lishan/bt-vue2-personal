<template>
    <div class="trades-container history-container">
        <el-table
            :data="paginatedData"
            class="trades-table"
            border
        >
            <el-table-column
                show-overflow-tooltip
                prop="TradeNumber"
                label="#"
                width="50px"
                align="center"
            >
            <template slot-scope="scope">
                {{ Number(scope.row.TradeNumber) + 1 }}
            </template>
            </el-table-column>
            <el-table-column
                prop="Symbol"
                label="Symbol"
                align="center"
                width="100px"
                show-overflow-tooltip
            >
            <template slot-scope="scope">
                {{ getProcessedSymbol(scope.row.Symbol) }}
            </template>
            </el-table-column>
            <el-table-column
                prop="EntryDate"
                label="Entry Date"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="EntryAction"
                label="Entry Action"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="EntryPrice"
                label="Entry Price"
                align="center"
            >
            </el-table-column>
            <!-- <el-table-column
                prop="EntryIndicator"
                label="Entry Indicator"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.EntryIndicator" :key="index">
                        <p>{{ item }}</p>
                    </div>
                </template>
            </el-table-column> -->
            <el-table-column
                prop="ExitDate"
                label="Exit Date"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="ExitAction"
                label="Exit Action"
                align="center"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="ExitPrice"
                label="Exit Price"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="TradeReturn"
                label="Trade Return %"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.TradeReturn == 'none'">{{ '' }}</span>
                    <span v-else-if="scope.row.TradeReturn > 0">{{ scope.row.TradeReturn }}%</span>
                    <span v-else-if="scope.row.TradeReturn < 0" style="color: #dd3a13">{{ scope.row.TradeReturn }}%</span>
                    <span v-else-if="scope.row.TradeReturn == 0">{{ 0 }}%</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="TotalReturn"
                label="Total Return %"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.TotalReturn == 'none'">{{ '' }}</span>
                    <span v-else-if="scope.row.TotalReturn > 0">{{ scope.row.TotalReturn }}%</span>
                    <span v-else-if="scope.row.TotalReturn < 0" style="color: #dd3a13">{{ scope.row.TotalReturn }}%</span>
                    <span v-else-if="scope.row.TotalReturn == 0">{{ 0 }}%</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="ExitReason"
                label="Exit Reason"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="MarketCondition"
                label="Market Condition"
                align="center"
                width="120px"
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
                <div v-for="(item, index) in scope.row.MarketCondition" :key="index">
                    <p>{{ item }}</p>
                </div>
            </template>
            </el-table-column>
            <!-- <el-table-column
                prop="ExitIndicator"
                label="Exit Indicator"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.ExitIndicator" :key="index">
                        <p>{{ item }}</p>
                    </div>
                </template>
            </el-table-column> -->
            <div slot="empty" style="text-align: left">
                <el-empty image-size="80" description="No Data"></el-empty>
            </div>
        </el-table>
        <div class="pagination-container">
            <span style="font-size: 13px; font-weight: 400; margin-right: 10px"
                >Total {{ totalTradesNumber }}</span
            >
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="queryInfo.page"
                :page-size="20"
                layout="prev, pager, next,slot"
                :total="queryInfo.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
import { getSymbolInfo } from '@/utils/globalFunc'
export default {
	name: 'Summary',
	data() {
		return {
            queryInfo: {
                total: 0,
                page: 1
            },
            totalTradesNumber: 0,
            processedTradesData: [],
            textContent: {
                'MarketCondition': 'Indicates the market environment for this transaction:<br/> "Bear" stands for "Bear Market",<br/> "Bull" stands for "Bull Market",<br/> "Rec" stands for "Recession", "Ease" refers to "FOMC Easing",<br/> and "Tight" represents "FOMC Tightening".'
            }
		}
	},
	props: {
        tradesData: Array,
        strategy: String
	},
    created(){
    },
    computed: {
		// Filtered and paginated data to be displayed in the table
		paginatedData() {
			return this.processedTradesData.slice(
                20 * (this.queryInfo.page - 1),
                this.queryInfo.page * 20
            )
		},
	},
    watch: {
		tradesData: {
			handler(newValue, _){
                const mergedData = [];
                const _newValue = JSON.parse(JSON.stringify(newValue))
                for (let i = 0; i < newValue.length; i += 2) {
                    const entryData = newValue[i];
                    const exitData = newValue[i + 1] || {}; // 确保后面有对象或使用一个空对象
                    // 转换日期格式
                    const formatEntryDate = entryData['Date'].replaceAll('-','/')
                    const formatExitDate = exitData['Date'] ? exitData['Date'].replaceAll('-','/') : '';
                    console.log(`第${i}组数据`, _newValue[i])
                    if((i + 1) > newValue.length) return
                    console.log(`第${i+1}}组数据`, _newValue[i + 1])
                    if(_newValue[i + 1] && exitData.TradeStatus) {
                        mergedData.push({
                        'EntryDate': formatEntryDate,
                        'EntryAction': entryData.TradeStatus.toUpperCase(),
                        'EntryPrice': !isNaN(entryData.TradePrice) ? Number(entryData.TradePrice).toFixed(2) : '',
                        'EntryIndicator': entryData.Indicator || '',
                        'ExitDate': formatExitDate,
                        'ExitAction': exitData.TradeStatus.toUpperCase(),
                        'ExitPrice': !isNaN(exitData.TradePrice) ? Number(exitData.TradePrice).toFixed(2) : '',
                        'TradeReturn': !isNaN(exitData.TradeReturn) ? Number(exitData.TradeReturn).toFixed(2) : '',
                        'TotalReturn': !isNaN(exitData.Return) ? Number(exitData.Return * 100).toFixed(2) : '',
                        'ExitReason': exitData.ExitReason || '',
                        'MarketCondition': exitData.MarketCondition || ['N\/A'],
                        'ExitIndicator': exitData.Indicator || '',
                        'TradeNumber': exitData.trade_number,
                        'Symbol': exitData.Symbol
                        });
                    }
                }
                this.processedTradesData = mergedData
                console.log('mergedData', mergedData)
                this.queryInfo.total = mergedData.length
                this.totalTradesNumber = mergedData.length
			},
			deep: true
		},
	},
	methods: {
        // 处理custom symbol的特殊url显示
		getProcessedSymbol(symbol) {
			if (!symbol) return '';
			const { name, type } = getSymbolInfo(symbol);
			return type === 'custom' ? name : symbol;
		},
        handleCurrentChange(page){
            this.queryInfo.page = page
        }
    }
}
</script>

<style lang="less" scoped>
.trades-container {
    margin-bottom: 1rem;
}
.pagination-container {
    font-size: 12px;
}
.trades-table{
    margin-top: 20px;
}
</style>