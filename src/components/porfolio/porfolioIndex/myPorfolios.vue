<template>
  <div class="newPorfolio">
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Porfolios</el-breadcrumb-item>
        <el-breadcrumb-item>My Porfolio</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table :data="myPorfolioList" border stripe size="mini" v-loading="loading">
        <el-table-column label="index" type="index" align="center" width="100px">
        </el-table-column>
        <el-table-column
        label="name"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column
        label="symbols in porfolio"
        align="center"
      >
      <template slot-scope="scope">
        <span v-for="(val,key) in scope.row.backtests" :key="key">{{val.stock}},</span>
      </template>
      </el-table-column>
      <el-table-column
        label="description"
        prop="description"
        align="center"
      ></el-table-column>
      <el-table-column
        label="original asset"
        prop="original_asset"
        align="center"
      ></el-table-column>
      <el-table-column
        label="net asset"
        prop="netAsset"
        align="center"
      ></el-table-column>
      <el-table-column
        label="profit/loss"
        prop="profitLoss"
        align="center"
      ></el-table-column>
      <el-table-column
        label="action"
        align="center"
      >
      <template slot-scope="scope">
        <!-- <el-select v-model="value" @change="selectSymbol(value,scope.row)" placeholder="Pleace select">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
      <el-row>
        <el-button type="primary" plain size="mini" @click="openPorfolio(scope.row)">Open</el-button>
        <el-popconfirm
          confirm-button-text='continue'
          cancel-button-text='cancel'
          icon="el-icon-info"
          icon-color="red"
          title="Bulk sending is temporarily not supported"
        >
        <el-button type="danger" plain size="mini" @click="runBacktests(scope.row)" slot="reference">Backtest</el-button>
        </el-popconfirm>
      </el-row>
      </template>
     </el-table-column>
     
        <el-table-column
        align="center"
        width="100px"
      >
      <template slot-scope="scope">
        <el-popconfirm
        confirm-button-text='continue'
        cancel-button-text='cancel'
        icon="el-icon-info"
        icon-color="red"
        title="Are you sure you want to delete it?"
        @confirm="deleteMyPorfolio(scope.row)"
        >
            <el-button type="danger" icon="el-icon-delete" circle size="mini" slot="reference"></el-button>
        </el-popconfirm>
      </template>
      </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'newPofolio',
  data() {
    return{
      myPorfolioList: [],
      loading: false
  }},
  created() {
    this.getPorfolioList()
  },
  methods: {
    async getPorfolioList() {
      this.loading = true
      const res = await this.$http.get('/demo/porfolio/')
      if(res.status === 200){
        this.myPorfolioList = res.data.results
        this.loading = false
      }
    },
    openPorfolio(row) {
      this.$router.push('/openedPorfolio')
        this.$store.commit('getNewPorfolioInputsValues',row)
    },
    runBacktests(row){
      let backtestIdArr = []
      for(let i = 0; i < row.backtests.length; i++){
        backtestIdArr.push(row.backtests[i].id)
      }
      const params = {
        backtests: backtestIdArr
      }
      this.$http.post('/rundev/runporfolio/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {console.log(res);}).catch(error => {
        console.log(error);
      })
    },
    async deleteMyPorfolio(row){
      const res = await this.$http.delete('/demo/porfolio/'+ row.id + '/')
      if(res.status === 204){
         this.$message.success({
           message: 'Successfully deleted',
           duration: 1000
         })
         this.getPorfolioList()
      }
    }
  }
}
</script>
<style scoped>
.newPorfolioBtns{
  position: absolute;
  left: 800px;
  top: 90px;
}
.el-popover__reference-wrapper .el-button{
  margin-left: 10px;
}
</style>