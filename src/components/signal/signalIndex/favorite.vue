<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Signals</el-breadcrumb-item>
        <el-breadcrumb-item>Favorite Signals</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 表格区域 -->
      <el-table :data="favoriteList" border stripe size="mini" v-loading="loading">
        <el-table-column label="" align="center" type="index" :index="orderIndex" width="40px"></el-table-column>
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
        <el-table-column align="center" width="100px">
          <template slot-scope="scope">
          <!-- <span v-if="scope.row.favorites" @click="deleteFavoriteSignal(scope.row)"> -->
            <!-- <i class="el-icon-delete"></i> -->
            <el-popconfirm
            confirm-button-text='continue'
            cancel-button-text='cancel'
            icon="el-icon-info"
            icon-color="red"
            title="Are you sure you want to delete it?"
            @confirm="deleteFavoriteSignal(scope.row)"
            >
              <!-- <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button> -->
              <el-button type="danger" icon="el-icon-delete" circle v-if="scope.row.favorites" size="mini" slot="reference"></el-button>
            </el-popconfirm>
          <!-- </span> -->
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
        :current-page="queryInfo.page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <open-favorite 
        @call-father="getFavoriteList"
        :dialogFormVisible.sync="dialogFormVisible" 
        ref="child"
    >
    </open-favorite>
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
      total: 0,
      favoriteList: [],
      dialogFormVisible: false,
      queryInfo: {
        // 当前的页数
        page: 1,
      },
      loading: false
    }
  },
  created() {
    this.getFavoriteList()
  },
  methods: {
    async getFavoriteList() {
      this.loading = true
      const { data: res } = await this.$http.get('/demo/signal/?favorites=true',
        {
          params: this.queryInfo
        }
      )
      this.favoriteList = res.results 
      if(res.results.length <= 0){
        this.loading = false
         this.$message.success({
           message: 'The list of signals is empty',
           duration: 1000
         })
      }
      this.total = res.count
      this.loading = false
    },
    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.getFavoriteList()
    },
    showDialog(id,params){
      this.$refs.child.openDialog(id,params)
      //this.dialogFormVisible = true
    },
    async deleteFavoriteSignal(row){
      const { data: res } = await this.$http.delete('/demo/signal/'+row.id+"/")
      console.log('deleteFav',res);
      this.$message.success({
           message: 'Successfully deleted',
           duration: 1000
         })
       this.getFavoriteList()
    },
    orderIndex(index) {
      if (this.queryInfo.page !== 0){
      return ((this.queryInfo.page-1) * 10) + (index +1)

      }else{
        return (0 * 10) + (index +1)
      }
    }
  },

}
</script>
<style lang="less" scoped></style>
