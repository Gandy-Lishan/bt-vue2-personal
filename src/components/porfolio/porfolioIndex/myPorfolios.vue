<template>
  <div class="newPorfolio">
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Porfolios</el-breadcrumb-item>
        <el-breadcrumb-item>My Porfolio</el-breadcrumb-item>
      </el-breadcrumb>
      <el-table :data="myPorfolioList" border stripe size="mini">
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
        <span v-for="(val,key) in scope.row.backtests">{{val.stock}},</span>
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
        <el-button type="danger" plain size="mini" @click="runBacktests(scope.row)">Backtest</el-button>
      </el-row>
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
      myPorfolioList: []
    }
  },
  created(){
    this.getPorfolioList()
  },
  methods: {
    // selectSymbol(val,row){
    //   // this.value = val
    //   console.log(val);
    //   if(val === 0){
    //     this.$router.push('/openedPorfolio')
    //     this.$store.commit('getNewPorfolioInputsValues',row)
    //   }
    // },
    async getPorfolioList() {
      const res = await this.$http.get('/demo/porfolio/')
      if(res.status === 200){
        this.myPorfolioList = res.data.results
      }
    },
    openPorfolio(row) {
      this.$router.push('/openedPorfolio')
      console.log('row',row);
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
      this.$http.post('/rundev/runbacktest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {console.log(res);}).catch(error => {
        console.log(error);
      })
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
</style>