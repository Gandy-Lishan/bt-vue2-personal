<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Stategies</el-breadcrumb-item>
        <el-breadcrumb-item>My Stategies</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格区域 -->
      <el-table :data="strategyList" border stripe size="mini">
        <el-table-column
          label="name"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="description"
          prop="description"
          align="center"
        ></el-table-column>
        <el-table-column
          label="entry signal"
          prop="signal_entry.name"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="exit signal"
          prop="signal_exit.name"
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column label="source" prop="user" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.user === 'admin'">system</span>
            <span v-else>custom</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          label="winrate percentage"
          prop="winrate_percentage"
          align="center"
        ></el-table-column>
        <el-table-column
          label="risk-reward ratio"
          prop="risk_reward_ratio"
          align="center"
        ></el-table-column> -->
        <!-- <el-table-column align="center" label="action">
        <template slot-scope="scope"> -->
          <!-- <el-button @click="showDialog(scope.row.id, scope.row)"
            >open</el-button
          > -->
            <!-- <el-select v-model="value" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </template>
      </el-table-column> -->
      <el-table-column align="center">
          <template slot-scope="scope">
          <!-- <span @click="deleteStrategySignal(scope.row)">
            <i class="el-icon-delete"></i>
          </span> -->
          <el-button type="primary" icon="el-icon-edit" circle size="mini" style="{margin-right:10px}" @click="showStrategyDialog"></el-button>
            <el-popconfirm
            confirm-button-text='continue'
            cancel-button-text='cancel'
            icon="el-icon-info"
            icon-color="red"
            title="Are you sure you want to delete it?"
            @confirm="deleteStrategySignal(scope.row)"
            >
                <el-button type="danger" icon="el-icon-delete" circle slot="reference" size="mini"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 若表格数据过多可以增加分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <open-favorite :dialogFormVisible="dialogFormVisible" ref="child"></open-favorite>
    <strategy-dialog :dialogTableVisible="dialogTableVisible"></strategy-dialog>
  </div>
</template>
<script>
import openFavorite from '../../signal/signalComponents/openFavorite.vue';
import strategyDialog from '../strategyComponents/strategyDialog.vue'
export default {
  name: 'favoriteStrategies',
  data() {
    return {
      dialogTableVisible: false,
      page: 1,
      total: 0,
      strategyList: [],
      dialogFormVisible: false,
      options: [{
          value: 'open',
          label: 'Open'
        }, {
          value: 'chart',
          label: 'Apply in main chart'
        }, {
          value: 'remove',
          label: 'Remove from favorites'
        }, {
          value: 'backtest',
          label: 'Backtest Strategy'
        }],
        value: '',
        signal_entry: [],
        signal_exit: []
    }
  },
  created() {
    this.getStrategyList()
  },
  methods: {
    async getStrategyList() {
      const { data: res } = await this.$http.get('/demo/strategies/')
      this.strategyList = res.results
      console.log('strategyList', this.strategyList)
      this.total = res.count
      for (let i = 0; i < this.strategyList.length; i++) {
        this.strategyList[i].signal_entry = JSON.parse(this.strategyList[i].signal_entry)
        this.strategyList[i].signal_exit = JSON.parse(this.strategyList[i].signal_exit)
        
      }
    },
    handleCurrentChange(newpage) {
      this.page = newpage
      this.getstrategyList()
    },
    showDialog(id,params){
      this.$refs.child.openDialog(id,params)
      this.dialogFormVisible = true
    },
    async deleteStrategySignal(row){
      const { data: res } = await this.$http.delete('/demo/strategies/'+row.id+"/")
      this.$message.success({
           message: 'Successfully deleted',
           duration: 1000
         })
       this.getStrategyList()
    },
    showStrategyDialog() {
      this.dialogTableVisible = !this.dialogTableVisible
    }
  },
  components:{
    'open-favorite': openFavorite,
    'strategy-dialog': strategyDialog
  }
}
</script>
<style lang="less" scoped></style>
