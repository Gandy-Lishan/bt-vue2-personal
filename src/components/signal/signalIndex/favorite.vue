<template>
  <div>
    <router-view></router-view>
    <!-- 面包屑导航区域 -->
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Signals</el-breadcrumb-item>
        <el-breadcrumb-item>Favorite Signals</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格区域 -->
      <el-table :data="favoriteList" border stripe size="mini">
        <el-table-column label="" type="index" align="center"></el-table-column>
        <el-table-column label="type" prop="type" align="center" width="80px">
        </el-table-column>
        <el-table-column label="source" prop="user" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.user === 'admin'">system</span>
            <span v-else>custom</span>
          </template>
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
        <el-table-column label="delete" align="center">
          <template slot-scope="scope">
          <span v-if="scope.row.favorites" @click="deleteFavoriteSignal(scope.row)">
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
import openFavorite from '../signalComponents/openFavorite.vue'
export default {
  name: 'favorite',
    components: {
    'open-favorite': openFavorite
  },
  data() {
    return {
      page: 1,
      total: 0,
      favoriteList: [],
      dialogFormVisible: false
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
      this.total = res.count
    },
    handleCurrentChange(newpage) {
      this.page = newpage
      this.getFavoriteList()
    },
    showDialog(id,params){
      this.$refs.child.openDialog(id,params)
      this.dialogFormVisible = true
    },
    async deleteFavoriteSignal(row){
      const { data: res } = await this.$http.delete('/demo/signal/'+row.id+"/")
      this.$message.success({
           message: 'Successfully deleted',
           duration: 1000
         })
       this.getFavoriteList()
    }
  },

}
</script>
<style lang="less" scoped></style>
