<template>
  <div class="newPorfolio">
    <el-card>
      <div class="newPorfolioBtns">
        <el-row>
          <el-button size="mini">Back</el-button>
          <el-button size="mini" type="primary">Save</el-button>
          <el-button size="mini">Backtest Porfolio</el-button>
          <el-button size="mini">Optimize Porfolio</el-button>
        </el-row>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Porfolios</el-breadcrumb-item>
        <el-breadcrumb-item>Opened Porfolio</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="newPorfolioInputs">
        <el-form :inline="true" style="margin-left: 20px">
          <el-row>
            <el-form-item label="name:">
              <el-input v-model="newPorfolioInputsValues.inputNameValue" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="description:">
              <el-input v-model="newPorfolioInputsValues.inputDescriptionValue" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="original asset:">
              <el-input v-model="newPorfolioInputsValues.inputOriginalAssetValue" size="mini"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <el-table :data="porfolioList" border stripe size="mini">
        <el-table-column label="index" type="index" align="center" width="100px">
        </el-table-column>
        <el-table-column
        label="symbol"
        prop="stock"
        align="center"
        width="110px"
      ></el-table-column>
      <el-table-column
        label="cash"
        prop="cash"
        align="center"
      ></el-table-column>
      <el-table-column
        label="strategy"
        prop="strategy"
        align="center"
      ></el-table-column>
      <el-table-column
        label="backtest details"
        prop="backtestDetails"
        align="center"
      ></el-table-column>
      <el-table-column
        label="Annual Performance(click to see details)"
        prop="annualPerformance"
        align="center"
      ></el-table-column>
      <el-table-column
        label="status"
        prop="status"
        align="center"
      ></el-table-column>
      <el-table-column
        label="action"
        align="center"
      >
        <!-- <el-select v-model="value" @change="selectSymbol(value)" placeholder="Pleace select">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <template slot-scope="scope">
        <el-row>
          <el-button type="primary" plain size="mini" @click="showBacktestDialogVisible(scope.row)">Open</el-button>
          <el-button type="danger" plain size="mini" @click="runBacktest(scope.row.id)">Backtest</el-button>
         
        </el-row>
        </template>
     </el-table-column>
      </el-table>
    </el-card>
      <el-dialog
    title="Backtest Result"
    :visible.sync="dialogVisible"
    width="30%">
      <img :src="'data:image/jpg;base64,'+ img_data"></img>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">cancle</el-button>
      <el-button type="primary" @click="dialogVisible = false">confirm</el-button>
    </span>
  </el-dialog>
  <backtest-dialog :backtestDialogVisible="backtestDialogVisible" :openBacktestFormdata="openBacktestFormdata" @showBacktestDialog="closeBacktestDialog()"></backtest-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import backtestDialog from '../porfolioComponents/backtestDialog.vue'
export default {
  components: { backtestDialog },
  name: 'newPofolio',
  data() {
    return{
      porfolioList: [],
      img_data:"",
      dialogVisible: false,
      openBacktestFormdata: {},
      backtestDialogVisible: false
    }
  },
  computed: {
    ...mapState(['newPorfolioInputsValues', 'openedPorfolioBacktests'])
  },
  created(){
    this.porfolioList=this.openedPorfolioBacktests
  },
  methods: {
    selectSymbol(val){
      // this.value = val
      if(val === 0){
        this.$router.push('/newBacktest')
      }
    },
    runBacktest(id){
      let params = {
        backtests: id
      }
      this.$http.post('/rundev/runporfolio/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {
        // console.log(res.data);
          // this.img_data = "data:image/png;base64," + res.data
          let blob = new Blob([res.data],{type:"image/jpg"});
          const imageUrl = URL.createObjectURL(blob);
          // this.img_data=imageUrl;
          this.img_data = res.data
          if(this.img_data !== ''){
            this.dialogVisible = !this.dialogVisible
          }

      }).catch(error => {
        console.warn(error);
      })
    },
    showBacktestDialogVisible(row){
      this.openBacktestFormdata = row
      this.backtestDialogVisible = !this.backtestDialogVisible
    },
    closeBacktestDialog(){
      this.backtestDialogVisible = !this.backtestDialogVisible 
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