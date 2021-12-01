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
      <el-table :data="customList" border stripe size="mini" v-loading="loading">
        <el-table-column label="" align="center" type="index" :index="orderIndex" width="40px"></el-table-column>
        <el-table-column label="type" prop="type" align="center" width="80px">
        </el-table-column>
        <el-table-column
        label="favorite"
        align="center"
        width="70px"
        prop="favorites"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.favorites" @click="addFavorites(scope.row)">
            <i class="el-icon-star-on"></i>
          </span>
          <span v-else @click="addFavorites(scope.row)">
            <i class="el-icon-star-off"></i>
          </span>
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
        <el-table-column align="center" width="100px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              style="margin-right: 10px;"
              @click="showDialog(scope.row.id, scope.row)"
            ></el-button>
            <el-popconfirm
            confirm-button-text='yes'
            cancel-button-text='no'
            icon="el-icon-info"
            icon-color="red"
            title="Are you sure you want to delete it?"
            @confirm="deleteCustomSignal(scope.row)"
            >
               <el-button type="danger" icon="el-icon-delete" circle size="mini" slot="reference"></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
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
    <open-custom @call-father="getCustomList" :dialogFormVisible.sync="dialogFormVisible" ref="child"></open-custom>
  </div>
</template>
<script>
import openCustom from '../signalComponents/openCustom.vue'
export default {
  name: 'custom',
  data() {
    return {
      total: 0,
      customList: [],
      queryInfo: {
        page: 1
      },
      dialogFormVisible: false,
      loading: false
    }
  },
  created() {
    this.getCustomList("custom_signal")
  
  },
  methods: {
    async getCustomList(user) {
      this.loading = true
      this.queryInfo.user = user
      const { data: res } = await this.$http.get('/demo/signal/', {
        params: this.queryInfo
      })
      this.customList = res.results
      if(res.results.length <= 0){
        this.loading = false
      }
      this.total = res.count
      this.loading = false
    },
    addFavorites(row) {
      row.favorites = !row.favorites
      const addFavoritesData = row
      let vm = this
      //qs.stringify()将对象 序列化成URL的形式，以&进行拼接
      this.$http
          .put(
            '/demo/signal/' + row.id + '/',
            vm.$qs.stringify(addFavoritesData)
          )
          .then((res) => {
            if (res.status == 200){
              this.signalList[row.id].favorites != this.signalList[row.id].favorites
              if(res.data.favorites){
                this.$message.success({
                message: 'Added to my favorite',
                duration: 1000
              })
              }else {
                this.$message.success({
                message: 'Removed to favorites',
                duration: 1000
              })
              }}
          })
          .catch((error) => {
            console.warn(error);
          })
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
    },
    orderIndex(index) {
      if (this.queryInfo.page !== 0){
      return ((this.queryInfo.page-1) * 10) + (index +1)

      }else{
        return (0 * 10) + (index +1)
      }
    }
  },
  components: {
    'open-custom': openCustom
  }
}
</script>
<style lang="less" scoped></style>
