<template>
    <div class="trades-container history-container">
        <el-table
            :data="paginatedData"
            style="width: 80%; margin: 0 auto"
            border
            :span-method="objectSpanMethod"
        >
            <el-table-column
                prop="trade_number"
                show-overflow-tooltip
                label="#"
                width="50px"
                align="center"
            >
                <template slot-scope="scope">
                    {{ Number(scope.row.trade_number) + 1 }}
                </template>
            </el-table-column>
            <el-table-column
                prop="Date"
                label="Trade Date"
                align="center"
                width="150px"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="TradeStatus"
                label="Action"
                align="center"
                width="150px"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                prop="Indicator"
                label="Indicator"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <div v-for="(item, index) in scope.row.Indicator" :key="index">
                        <p>{{ item }}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="TradePrice"
                label="Trade Price"
                width="150px"
                align="center"
            >
            </el-table-column>
<el-table-column
                prop="ExitReason"
                label="Exit Reason"
                width="150px"
                align="center"
            >
            </el-table-column>

            <el-table-column
                prop="TradeReturn"
                label="Trade Return %"
                width="150px"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.TradeReturn == 'none'">{{ '' }}</span>
                    <span v-else-if="scope.row.TradeReturn >= 0"
                        >{{ scope.row.TradeReturn }}%</span
                    >
                    <span v-else style="color: red"
                        >{{ scope.row.TradeReturn }}%</span
                    >
                </template>
            </el-table-column>
            <el-table-column
                prop="Return"
                label="Total Return %"
                width="150px"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.Return == 'none'">{{ '' }}</span>
                    <span v-else-if="scope.row.Return >= 0"
                        >{{ (scope.row.Return * 100).toFixed(2) }}%</span
                    >
                    <span v-else style="color: red"
                        >{{ (scope.row.Return * 100).toFixed(2) }}%</span
                    >
                </template>
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
                :page-size="20"
                layout="prev, pager, next,slot"
                :total="queryInfo.total"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>

export default {
	name: 'Summary',
	data() {
		return {
            queryInfo: {
                total: 0,
                page: 1
            },
            totalTradesNumber: 0,
		}
	},
	props: {
        tradesData: Array,
	},
    created(){
    },
    computed: {
		// Filtered and paginated data to be displayed in the table
		paginatedData() {
			return this.tradesData.slice(
                20 * (this.queryInfo.page - 1),
                this.queryInfo.page * 20
            )
		},
	},
    watch: {
		tradesData: {
			handler(newValue, oldValue){
                this.queryInfo.total = newValue.length
                this.totalTradesNumber = newValue.length / 2
			},
			deep: true
		},
	},
	methods: {
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
            if (rowIndex % 2 === 0) {
            return {
                rowspan: 2,
                colspan: 1
            }
            } else {
            return {
                rowspan: 0,
                colspan: 0
            }
            }
        }
        if (columnIndex === 5) {
            if (rowIndex % 2 === 0) {
            return {
                rowspan: 2,
                colspan: 1
            }
            } else {
            return {
                rowspan: 0,
                colspan: 0
            }
            }
        }
        if (columnIndex === 6) {
            if (rowIndex % 2 === 0) {
            return {
                rowspan: 2,
                colspan: 1
            }
            } else {
            return {
                rowspan: 0,
                colspan: 0
            }
            }
        }
        if (columnIndex === 7) {
            if (rowIndex % 2 === 0) {
            return {
                rowspan: 2,
                colspan: 1
            }
            } else {
            return {
                rowspan: 0,
                colspan: 0
            }
            }
        }
        },
        handleCurrentChange(page){
            this.queryInfo.page = page
        }
    }
}
</script>

<style lang="less" scoped>
.pagination-container {
    width: 80%;
    margin: 0 auto;
}
</style>