<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Stategies</el-breadcrumb-item>
        <el-breadcrumb-item>My Stategies</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格区域 -->
      <el-table :data="strategyList" border stripe size="mini" v-loading="loading">
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
        <el-table-column align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              style="margin-right: 10px;"
              @click="showStrategyDialog(scope.row)"
            ></el-button>
            <el-popconfirm
              confirm-button-text="continue"
              cancel-button-text="cancel"
              icon="el-icon-info"
              icon-color="red"
              title="Are you sure you want to delete it?"
              @confirm="deleteStrategySignal(scope.row)"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                slot="reference"
                size="mini"
              ></el-button>
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
    <open-favorite
      :dialogFormVisible="dialogFormVisible"
      ref="child"
    ></open-favorite>
    <strategy-dialog
      :dialogTableVisible="dialogTableVisible"
      @closeDialog="closeDialog"
      :editData="editData"
    ></strategy-dialog>
  </div>
</template>
<script>
import openFavorite from '../../signal/signalComponents/openFavorite.vue'
import strategyDialog from '../strategyComponents/strategyDialog.vue'
import eventBus from './eventBus/event.js'
export default {
  name: 'favoriteStrategies',
  data() {
    return {
      dialogTableVisible: false,
      page: 1,
      total: 0,
      strategyList: [],
      dialogFormVisible: false,
      options: [
        {
          value: 'open',
          label: 'Open',
        },
        {
          value: 'chart',
          label: 'Apply in main chart',
        },
        {
          value: 'remove',
          label: 'Remove from favorites',
        },
        {
          value: 'backtest',
          label: 'Backtest Strategy',
        },
      ],
      value: '',
      signal_entry: [],
      signal_exit: [],
      loading: false,
      editData: {}
    }
  },
  created() {
    this.getStrategyList()

    this.UpdataList()
  },
  methods: {
    closeDialog() {
      this.dialogTableVisible = !this.dialogTableVisible
    },
    UpdataList() {
      eventBus.eventVue.$on('UpdateMyStrategyList', (data) => {
        this.getStrategyList
      })
    },
    async getStrategyList() {
      this.loading = true
      const { data: res } = await this.$http.get('/demo/strategies/')
      this.strategyList = res.results
      if(res.results.length <= 0){
        this.loading = false
      }
      this.total = res.count
      this.loading = false
      for (let i = 0; i < this.strategyList.length; i++) {
        this.strategyList[i].signal_entry = JSON.parse(
          this.strategyList[i].signal_entry
        )
        this.strategyList[i].signal_exit = JSON.parse(
          this.strategyList[i].signal_exit
        )
      }
    },
    handleCurrentChange(newpage) {
      this.page = newpage
      this.getstrategyList()
    },
    showDialog(id, params) {
      this.$refs.child.openDialog(id, params)
      this.dialogFormVisible = true
    },
    async deleteStrategySignal(row) {
      const { data: res } = await this.$http.delete(
        '/demo/strategies/' + row.id + '/'
      )
      this.$message.success({
        message: 'Successfully deleted',
        duration: 1000,
      })
      this.getStrategyList()
    },
    showStrategyDialog(row) {
      this.dialogTableVisible = !this.dialogTableVisible
      this.editData = row
    },
  },
  components: {
    'open-favorite': openFavorite,
    'strategy-dialog': strategyDialog,
  },
}
</script>
<style lang="less" scoped>
.cell .el-button {
  margin-right: 10px;
}
.strategyDialog .el-dialog__wrapper .el-dialog {
  width: 1120px !important;
}
</style>
