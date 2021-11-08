<template>
  <el-row>
    <el-col :span="24">
      <div class="favoriteForm_container">
        <el-table :data="favoriteList">
          <el-table-column
          label="Backtest Name"
          align="center"
          prop="name"
          >
          </el-table-column>
          <el-table-column
          label="Symbol"
          align="center"
          prop="symbol"
          >
          </el-table-column>
          <el-table-column
          label="Entry Signal"
          align="center"
          prop="entrySignal"
          >
          </el-table-column>
          <el-table-column
          label="Exit Signal"
          align="center"
          prop="exitSignal"
          >
          </el-table-column>
          <el-table-column
          label="Backtest Period"
          align="center"
          prop="backtestPeriod"
          >
          </el-table-column>
          <el-table-column
          label="Status"
          align="center"
          prop="status"
          >
          </el-table-column>
          <el-table-column
          label="GAGR"
          align="center"
          prop="GAGR"
          >
          </el-table-column>
          <el-table-column
          label="Max DD"
          align="center"
          prop="maxDD"
          >
          </el-table-column>
          <el-table-column
          align="center"
          width="300px"
          >
          <el-row>
            <el-tooltip class="item" effect="light" content="run" placement="bottom-start">
              <el-button type="success" icon="el-icon-caret-right" circle size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="edit" placement="bottom-start">
              <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="copy" placement="bottom-start">
              <el-button type="info" icon="el-icon-copy-document" circle size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="delete" placement="bottom-start">
              <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="view results" placement="bottom-start">
              <el-button type="warning" icon="el-icon-view" circle size="mini"></el-button>
            </el-tooltip>
          </el-row>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return{
      favoriteList: [{
        name: 'AAPL Optix Under 30',
        symbol: 'AAPL',
        entrySignal: 'Optix < 30',
        exitSignal: 'Optix > 70',
        backtestPeriod: '2010-01-03 to 2020-12-31',
        status: 'Complete',
        GAGR: '4%',
        maxDD: '34.1%'
      }]
    }
  }
}
</script>