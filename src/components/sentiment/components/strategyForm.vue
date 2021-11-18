<template>
  <el-row>
    <el-col :span="24">
      <div class="favoriteForm_container">
        <el-table :data="strategyList">
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
          align="center"
          width="300px"
          >
          <template slot-scope="scope">
          <el-row>
            <el-tooltip class="item" effect="light" content="run" placement="bottom-start">
              <el-button type="success" icon="el-icon-caret-right" circle size="mini" @click="runbacktest(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="edit" placement="bottom-start">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="editBacktest(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="copy" placement="bottom-start">
              <el-button type="info" icon="el-icon-copy-document" circle size="mini" @click="copyBacktest(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="delete" placement="bottom-start">
            <el-popconfirm
              confirm-button-text='yes'
              cancel-button-text='no'
              icon="el-icon-info"
              icon-color="red"
              title="Are you sure you want to delete it?"
              @confirm="deleteBacktest(scope.row.id)"
            >
              <el-button type="danger" icon="el-icon-delete" circle size="mini" slot="reference"></el-button>
            </el-popconfirm>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="view results" placement="bottom-start">
              <el-button type="warning" icon="el-icon-view" circle size="mini" @click="viewBacktestResults(scope.row)"></el-button>
            </el-tooltip>
          </el-row>
          </template>
          </el-table-column>
        </el-table>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      strategyList: [
        {
          name: 'Short Term Combined Model',
          symbol: 'SPY',
          entrySignal: '<= -10',
          exitSignal: '>= 13.5'
        },
        {
          name: 'Macro Index Model',
          symbol: 'SPY',
          entrySignal: '>= 0.7',
          exitSignal: '< 0.7'
        }
      ]
    }
  }
}
</script>