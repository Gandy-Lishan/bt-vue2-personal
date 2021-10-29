<template>
  <div class="newPorfolio">
    <el-card>
      <div class="newPorfolioBtns">
        <el-row>
          <el-button size="mini">Back</el-button>
          <el-button size="mini" @click="createPorfolioItems">Save</el-button>
          <el-button size="mini">Backtest Porfolio</el-button>
          <el-button size="mini">Optimize Porfolio</el-button>
        </el-row>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Porfolios</el-breadcrumb-item>
        <el-breadcrumb-item>New Porfolio</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="newPorfolioInputs">
        <el-form :inline="true" style="margin-left: 20px">
          <el-row>
            <el-form-item label="name:">
              <el-input
                v-model="newPorfolioInputsValues.inputNameValue"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="description:">
              <el-input
                v-model="newPorfolioInputsValues.inputDescriptionValue"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="original asset:">
              <el-input
                v-model="newPorfolioInputsValues.inputOriginalAssetValue"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="showDialog()"
              class="addPorfolioItem"
              >Add</el-button
            >
          </el-row>
        </el-form>
      </div>
      <el-table :data="backtestList" border stripe size="mini">
        <el-table-column
          label="index"
          type="index"
          align="center"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          label="symbol"
          prop="stock"
          align="center"
        ></el-table-column>
        <el-table-column
          label="percentage"
          prop="percentage"
          align="center"
        ></el-table-column>
        <el-table-column
          label="strategy"
          prop="strategy"
          align="center"
        ></el-table-column>
        <el-table-column
          label="backtest details"
          prop="description"
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
        <el-table-column align="center" label="action">
          <!-- <el-button type="danger" icon="el-icon-delete" circle @click="deleteNewPorfolio" size="mini"></el-button> -->
          <el-row>
            <el-button type="primary" plain size="mini" @click="showDialog()"
              >Add</el-button
            >
            <el-button type="danger" plain size="mini">Delete</el-button>
          </el-row>
        </el-table-column>
      </el-table>
      <div class="mDialog">
      <porfolio-dialog
        :dialogFormVisible="dialogFormVisible"
        @showDialog="showDialog"
        @submitBacktestData="submitBacktestData"
      ></porfolio-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import porfolioDialog from '../porfolioComponents/porfolioDialog.vue'
export default {
  name: 'newPofolio',
  data() {
    return {
      dialogFormVisible: false,
      newPorfolioInputsValues: {
        inputNameValue: '',
        inputDescriptionValue: '',
        inputOriginalAssetValue: '',
        backtests: [],
      },
      backtestList: [],
      options: [
        {
          value: 0,
          label: 'Add symbol',
        },
        {
          value: 1,
          label: 'Remove symbol',
        },
      ],
      value: '',
    }
  },
  created() {
    // this.getPorfolioList()
  },
  methods: {
    deleteNewPorfolio() {
      console.log('delete')
    },
    async getPorfolioList() {
      const res = await this.$http.get(
        '/demo/porfolio/' + this.porfolioId + '/'
      )
      this.porfolioList = res.data.results
    },
    showDialog() {
      this.dialogFormVisible = !this.dialogFormVisible
    },
    createPorfolioItems() {
      let params = {}
      params.name = this.newPorfolioInputsValues.inputNameValue
      params.description = this.newPorfolioInputsValues.inputDescriptionValue
      params.original_asset =
        this.newPorfolioInputsValues.inputOriginalAssetValue
      var porfolioId

      this.$http
        .post('/demo/porfolio/', this.$qs.stringify(params), {
          auth: {
            username: 'sentimentrader_backtest_api',
            password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx',
          },
        })
        .then((res) => {
          console.log('backtestList',this.backtestList);
          if(this.backtestList.length !== 0){
            console.log("aaa");
            porfolioId = res.data.id
            params.backtests = JSON.stringify(this.backtestList)
            params.id = porfolioId
            
            this.$http
              .put(
                '/demo/porfolio/' + porfolioId + '/',
                this.$qs.stringify(params),
                {
                  auth: {
                    username: 'sentimentrader_backtest_api',
                    password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx',
                  },
                }
              )
              .then((res) => console.log(res))
          }
        })
        .catch((error) => {
          console.error()
        })
      // this.getPorfolioList()
      // const backtestList = this.backtestList
    },
    submitBacktestData(backtestArr) {
      this.backtestList = backtestArr
      console.log('backtestArr', backtestArr)
    },
  },
  components: {
    'porfolio-dialog': porfolioDialog,
  },
}
</script>
<style scoped>
.newPorfolioBtns {
  position: absolute;
  left: 800px;
  top: 90px;
}
.addPorfolioItem {
  position: relative;
  left: 93px;
  top: 5px;
}
</style>