<template>
    <div style="width: 100%;">
        <div class="trades-container history-container">
            <el-table
                :data="paginatedData"
                class="trades-table"
                border
                v-loading="loading"
            >
                <el-table-column
                    prop="Symbol"
                    label="Symbol"
                    align="center"
                    width="100px"
                    show-overflow-tooltip
                >
                <template slot-scope="scope">
                    {{ symbol }}
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
                    :page-size="queryInfo.size"
                    layout="prev, pager, next,slot"
                    :total="queryInfo.total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { CIQ } from '@/components/common/chart/st-development/js/components'
import { mapGetters } from "vuex";

export default {
	name: 'Summary',
    props: {
        strategyIndex: Number
    },
	data() {
		return {
            queryInfo: {
                total: 0,
                page: 1,
                size: 10,
            },
            totalTradesNumber: 0,
            processedTradesData: [],
            textContent: {
                'MarketCondition': 'Indicates the market environment for this transaction:<br/> "Bear" stands for "Bear Market",<br/> "Bull" stands for "Bull Market",<br/> "Rec" stands for "Recession", "Ease" refers to "FOMC Easing",<br/> and "Tight" represents "FOMC Tightening".'
            },

            loading: true,
            symbol: CIQ.stxx.chart.symbol,
            strategies: [],
            strategiesOptions: [],
            selectedStrategyIndex: 0, // 保存选中的策略索引
            trendScore: [],
		}
	},
    created(){
    },
    mounted() {
        //try {
            this.loadTable();
        // } catch (error) {
        //     this.$emit('error');  // 向父组件发出 'error' 事件
        // }
    },
    watch: {
        strategyIndex: {
        handler(val) {
            if(val != this.selectedStrategyIndex) {
            this.$nextTick(async () => {
                this.selectedStrategyIndex = val
                await this.loadTable()
            })
            }
        },
        immediate: true
        }
    },
    computed: {
        ...mapGetters(['getTradingSignalStrategies']),
        // Filtered and paginated data to be displayed in the table
        paginatedData() {
            return this.processedTradesData.slice(
                this.queryInfo.size * (this.queryInfo.page - 1),
                this.queryInfo.page * this.queryInfo.size
            )
        },
	},
	methods: {
        async loadTable(e) {
            if(e?.target?.value) this.$emit('changeStrategyIndex', e?.target?.value || 0)
            if (this.strategies.length > 0) {
                this.updateTableWithSelectedStrategy(); // 根据当前选择的策略更新图表
                this.loading = false;
                return;
            }

            try {
                this.strategies = this.getTradingSignalStrategies // 保存所有策略数据
                this.strategiesOptions = this.strategies.map(item => (item.Signal)).map((ele,i) => ({label: ele, value: i}))
                this.trendScore = JSON.parse(this.strategies[0].trend_score)  // trendScore只存在第一个Strategy内并且通用, 所以作为唯一变量储存
                this.updateTableWithSelectedStrategy();
            } catch (error) {
                console.error(`Error fetching data for symbol: ${this.symbol}`, error);
                this.$emit('error');  // 向父组件发出 'error' 事件
            } finally {
                this.loading = false; // 无论成功或失败都结束 loading 状态
            }
        },
        updateTableWithSelectedStrategy() {
            this.queryInfo.page = 1

                // 用于根据日期查找价格
                function findPriceByDate(date, trend_score) {
                    const entry = trend_score.find(entry => entry.DT === date);
                    return entry ? entry.Close : null;
                }

                const selectedStrategy = this.strategies[this.selectedStrategyIndex];
                const { EntryDate, ExitDate } = selectedStrategy;
                this.processedTradesData =  EntryDate.map((entryDate, index) => {
                    const exitDate = ExitDate[index];
                    
                    // 查找EntryPrice和ExitPrice
                    const entryPrice = findPriceByDate(entryDate, this.trendScore);
                    const exitPrice = findPriceByDate(exitDate, this.trendScore);

                    return {
                        EntryDate: entryDate,
                        EntryAction: 'Buy',
                        EntryPrice: entryPrice,
                        ExitDate: exitDate,
                        ExitAction: 'Sell',
                        ExitPrice: exitPrice
                    };
                });
                this.queryInfo.total = this.processedTradesData.length
                this.totalTradesNumber = this.processedTradesData.length
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
select {
  font-weight: bold !important;
}
</style>