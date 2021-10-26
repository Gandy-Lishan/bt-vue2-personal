<template>
  <div>
    <router-view></router-view>
    <!-- 面包屑导航区域 -->
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Signals</el-breadcrumb-item>
        <el-breadcrumb-item>Custom Signals</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格区域 -->
      <el-table :data="customList" border stripe size="mini">
        <el-table-column label="" type="index" align="center"></el-table-column>
        <el-table-column label="type" prop="type" align="center" width="80px">
        </el-table-column>
        <el-table-column
          label="analysis basis"
          prop="analysis_basis"
          align="center"
        ></el-table-column>
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
        <el-table-column label="delete" align="center">
          <template slot-scope="scope">
          <span v-if="scope.row.favorites" @click="deleteCustomSignal(scope.row)">
            <i class="el-icon-delete"></i>
          </span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <el-button @click="showDialog(scope.row.id, scope.row)"
              >open</el-button
            >
          </template>
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
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="this.queryInfo.page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- edited -->
    <open-favorite :dialogFormVisible.sync="dialogFormVisible" ref="child"></open-favorite>
  </div>
</template>
<script>
import openFavorite from '../signalComponents/openFavorite.vue'
export default {
  data() {
    return {
      total: 0,
      customList: [],
      queryInfo: {
        page: 1
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getCustomList("custom_signal")
  },
  methods: {
    async getCustomList(user) {
      this.queryInfo.user = user
      const { data: res } = await this.$http.get('/demo/signal/', {
        params: this.queryInfo
      })
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取信号列表失败')
      // }
      this.customList = res.results
      console.log(this.customList[0].type)
      this.total = res.count
    },
    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.getCustomList("custom_signal")
    },
    async deleteCustomSignal(row){
      const { data: res } = await this.$http.delete('/demo/signal/'+row.id+"/")
      this.$message.success({
           message: 'Successfully deleted',
           duration: 1000
         })
       this.getCustomList("custom_signal")
    },
    showDialog(id,params){
      this.$refs.child.openDialog(id,params)
      this.dialogFormVisible = true
    }
  },
  components: {
    'open-favorite': openFavorite
  }
}
</script>
<style lang="less" scoped></style>
