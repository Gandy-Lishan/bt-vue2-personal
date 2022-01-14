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
          label="Signal Description"
          align="center"
          prop="description"
          >
          </el-table-column>
          <el-table-column
          label="Backtest Period"
          align="center"
          width="219px"
          >
            <template slot-scope="scope">
              <div class="dataBox">
                <el-button size="mini" type="info" plain>{{
                  scope.row.start_date
                }}</el-button>
                <el-button size="mini" type="info" plain>{{
                  scope.row.end_date
                }}</el-button>
              </div>
            </template>
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
            <el-tooltip class="item" effect="light" content="copy" placement="bottom-start">
              <el-button type="info" icon="el-icon-copy-document" circle size="mini" @click="copyBacktest(scope.row)"></el-button>
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
import { timestampToTime } from '../../../tools/formatDate.js'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
export default {
  data() {
    return {
      strategyList: [],
      loading: false
    }
  },
  created() {
    // this.getToDate()
    this.getStrategyList()
  },
  methods: {
    async getStrategyList() {
      this.loading = true
      const res = await this.$http.get('/dev/strategy/?ordering=status,-create_date')
      if(res.status === 200){
        console.log(res);
      this.strategyList = res.data.results
        this.loading = false
      // this.total = res.count
      }else {
        this.$message.error("List request failed")
        this.loading = false
      }
    },
    runbacktest(row) {
			let vm = this
			vm.clearInterval = clearInterval()
			if (row.status == 0) {
				row.status = 1
				vm.$http.post('/dev/runbacktest/?uuid=' + row.id).then((res) => {
					if (res.status == 200) {
						vm.timer = setInterval(() => {
							vm.$http.get('/dev/status/' + row.id + '/').then((res) => {
								//(res.data.status)
								//console.log("内层",res);
								if (res.data.status === 2) {
									clearInterval(vm.timer)
									vm.getStrategyList()
									vm.$message.success(
										'Run backtest is successful, click the view results button to see the results.'
									)
									vm.$notify({
										title: 'The run was successful',
										message:
											'Run backtest is successful, click the view results button to see the results.',
										offset: 100,
										type: 'success',
										 duration: 0
									})
								} else if (res.data.status === 0 || res.data.status === 3) {
									clearInterval(vm.timer)
									vm.getStrategyList()					
									vm.$notify({
									title: 'No trades',
									message: 'No trades, please change parameter.',
									offset: 100,
									type: 'warning'
								})
								}
							})
						}, 3000)
					} else {
						vm.$notify.error({
							title: 'Error',
							message: 'An error occurred on the server',
							offset: 100
						})
					}
				})
			} else if (row.status == 2) {
				vm.loading = false
				vm.$notify({
					title: 'Complete',
					message: 'The policy is complete',
					offset: 100,
					type: 'success'
				})
			} else if (row.status == 1) {
				vm.loading = false
				vm.$notify.info({
					title: 'Running',
					offset: 100,
					message: 'Please wait while running'
				})
			}
		},
		copyBacktest(row) {
			let params = {}
			this.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
        if(res.status === 200){
				params = res.data
				params.name = params.name + '(copy)'
				delete params.uuid
				delete params.results
				delete params.user_id
				delete params.status
				delete params.backtest_id
				this.$http
					.post('/dev/backtest/', this.$qs.stringify(params), {
						withCredentials: true
					})
					.then((res) => {
						if (res.status === 201) {
							this.$message.success('Copy successfully')
              this.$emit('goToFavoriteForm')
						} else {
							this.$message.error('Copy failed')
						}
					}).catch(error => {
            	this.$message.error('The strategy has been copied')
          })
			}})
		},
    viewBacktestResults(row) {
			let vm = this
			vm.$http.get('/dev/seeparams/' + row.id + '/').then((res) => {
				// 恢复indicator layout
				this.restoreIndicatorLayout(JSON.parse(res.data.indicator_layout))
			})
			this.$store.commit('getRunBacktestData', row)
			this.$emit('goTobacktestSetupForm', row.id)
			this.$emit('goBacktestResultForm', row)
		},
    getToDate() {
      const date = new Date()
      date.setDate(date.getDate() - 1)
      const yesterday = timestampToTime(date)
      this.strategyList.forEach(item => item.end_date = yesterday)
    }
  }
}
</script>