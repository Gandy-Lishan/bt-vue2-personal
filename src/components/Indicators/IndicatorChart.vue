<template>
 <div class="indicators-container">
    <div class="back">
      <router-link to="/indicators"><i class="el-icon-arrow-left"></i><span>Return to form interface</span></router-link>
    </div>
    <Chart :row="displayRow" class="indicators-chart" :style="{ height: '800px'}"></Chart>

    <el-collapse v-model="activeNames" :accordion="false" class="CPMResults-content">
      <el-collapse-item name="1" class="form">
        <template v-slot:title>
          <div class="title">
            <p @click.stop>Chart Details</p>
          </div>
        </template>
        <div class="content">
          <el-form ref="form" :model="displayRow" label-width="80px" label-position="top" style="width: 80%;">
            <el-form-item label="Last Value">
              <el-input v-model="displayRow.last_value"></el-input>
            </el-form-item>
            <el-form-item label="Last Change">
              <el-input v-model="displayRow.last_change"></el-input>
            </el-form-item>
            <el-form-item label="Last Update">
              <el-input v-model="displayRow.last_upadte"></el-input>
            </el-form-item>
            <el-form-item label="Time Frame">
              <el-input v-model="displayRow.timeframe"></el-input>
            </el-form-item>
            <el-form-item label="Updated">
              <el-input v-model="displayRow.updated"></el-input>
            </el-form-item>
            </el-form>
        </div>
      </el-collapse-item>
    </el-collapse>
 </div>
</template>

<script>
import Chart from "./Table/Chart"
import { getIndicatorsRowData } from "@/service/service";

export default {
 name: 'IndicatorChart',
 data () {
   return {
     displayRow: {},
     activeNames: ['1'],
   }
 },
 components: {
   Chart
 },
 beforeRouteEnter(to, from, next) {
  if (to.path.includes('/indicators/chart')) {
    next(async _this => {
      if(to.query.url && to.query.name) {
        const rowData = await getIndicatorsRowData(to.query.url)
        console.log('rowData', rowData)
        _this.updateChart(rowData.data)
      }
    })} else {
      next()
    }
  },
  methods: {
    updateChart(row) {
      this.displayRow = row
    }
  }
}
</script>

<style lang="less" scoped>
.indicators-container {
  background: #ffffff;
  width: 1200px;
  margin: 50px auto auto auto;
  .back {
    font-size: 1.1rem;
    i {
      font-weight: bold;
    }
    a {
      color: #525456;
      font-weight: bold;
      &:hover {
        color: #5b9bd1;
      }
    }
    padding: 20px 0px;
  }
}
</style>