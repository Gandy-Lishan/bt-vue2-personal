<template>
  <div>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Stategies</el-breadcrumb-item>
        <el-breadcrumb-item>System Stategies</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格区域 -->
      <el-table :data="favoriteList" border stripe size="mini">
        <el-table-column label="index" type="index" align="center"></el-table-column>
        <el-table-column
          label="name"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="used indicators"
          prop="used_indicators"
          align="center"
        ></el-table-column>
        <el-table-column
          label="description"
          prop="description"
          align="center"
        ></el-table-column>
        <el-table-column label="frequency" prop="frequency" align="center">
        </el-table-column>
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
        <el-table-column align="center" label="action">
        <template slot-scope="scope">
          <!-- <el-button @click="showDialog(scope.row.id, scope.row)"
            >open</el-button
          > -->
            <el-select v-model="value" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      page: 1,
      total: 0,
      favoriteList: [],
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
        value: ''
    }
  },
  created() {
    this.getFavoriteList()
  },
  methods: {
    async getFavoriteList() {
      const { data: res } = await this.$http.get('/demo/signal/?favorites=true')
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取信号列表失败')
      // }
      this.favoriteList = res.results
      console.log('favoriteList', this.favoriteList)
      this.total = res.count
    },
    handleCurrentChange(newpage) {
      this.page = newpage
      this.getFavoriteList()
    },
    showDialog(id,params){
      this.$refs.child.openDialog(id,params)
      this.dialogFormVisible = true
    }
  }
}
</script>
<style lang="less" scoped></style>
