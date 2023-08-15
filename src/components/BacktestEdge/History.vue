// History List
<template>
	<el-row>
		<el-col :span="24">
			<div class="favoriteForm_container">
        <el-button v-if="isSystem == 'system'" @click="runAllBacktest" class="fls-btn"
					>run all backtest</el-button
				>
        <div class="searchBox">
          <el-input
					class="search"
					style="width: 30vw"
					size="mini"
					v-model="searchItem"
					placeholder="Search for the name of the backtest"
					@keyup.enter.native="handleQuery"
					clearable
					@clear="handleQuery"
				>
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
        </div>
				<el-table
					header-align="center"
					:data="backtestList"
					v-loading="loading"
					:element-loading-text="loadTest"
					element-loading-spinner="el-icon-loading"
					element-loading-background="rgba(0, 0, 0, 0.8)"
					@sort-change="onSortChange"
				>
					<el-table-column type="index" align="center">
						<template scope="scope">
							<span>{{ (queryInfo.page - 1) * 10 + scope.$index + 1 }}</span>
						</template>
					</el-table-column>
					<el-table-column
						label="Name"
						align="center"
						prop="name"
						show-overflow-tooltip
						width="250px"
					>
					</el-table-column>
					<el-table-column
						label="Symbol"
						align="center"
						prop="symbol"
						width="70px"
					>
					</el-table-column>
					<el-table-column type="expand">
						<template slot-scope="scope">
							<div class="descriptionBox">
								<div class="entryBox">
									<p>Entry Description</p>
									<template
										v-for="(item, index) in scope.row.entry_description"
									>
										<p :key="index">
											<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
											>{{ item.commentDes }}
										</p>
									</template>
								</div>
								<div class="exitBox">
									<p>Exit Description</p>
									<template v-for="(item, index) in scope.row.exit_description">
										<p :key="index">
											<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
											>{{ item.commentDes }}
										</p>
									</template>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="Entry & Exit" align="center">
						<template slot-scope="scope">
							{{ scope.row.entry_description[0].commentDes }}<br />
							<br />
							{{ scope.row.exit_description[0].commentDes }}<br />
						</template>
					</el-table-column>
					<el-table-column
						label="Period"
						show-overflow-tooltip
						align="center"
						width="90px"
					>
						<template slot-scope="scope">
							<div class="showDate">
								<el-button
									size="mini"
									type="info"
									v-if="scope.row.start_date === '1800-10-01'"
									plain
									>All History</el-button
								>
								<el-button
									size="mini"
									type="info"
									v-if="scope.row.start_date !== '1800-10-01'"
									plain
									>{{ scope.row.start_date }}</el-button
								>
								<el-button
									size="mini"
									type="info"
									v-if="scope.row.start_date !== '1800-10-01'"
									plain
									>{{ scope.row.end_date }}</el-button
								>
							</div>
						</template>
					</el-table-column>

					<el-table-column
						label="Timeframe"
						show-overflow-tooltip
						align="center"
						prop="frequency"
						width="115px"
					>
						<template slot-scope="scope">
							<p>{{ scope.row.frequency }}</p>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						show-overflow-tooltip
						label="Total Trades"
						prop="total_trader"
						sortable="custom"
						:sort-orders="['ascending','descending', 'total_trader']"
						width="125px"
					>
						<template slot-scope="scope">
							<!-- <span v-if="scope.row.result['Total Trades']">{{
								scope.row.result['Total Trades']
							}}</span> -->
							<span v-if="scope.row.total_trader">{{
								scope.row.total_trader
							}}</span>
							<span v-else>{{ 0 }}</span>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						show-overflow-tooltip
						label="Total Return"
						prop="total_return"
						sortable="custom"
						:sort-orders="['ascending', 'descending', 'total_return']"
					>
						width="133px" ><template slot-scope="scope">
							<!-- <span v-if="scope.row.result['Total Return (%)']">{{
								scope.row.result['Total Return (%)'] + '%'
							}}</span> -->
							<span v-if="scope.row.total_return">{{
								scope.row.total_return + '%'
							}}</span>
							<span v-else>{{ 0 + '%' }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="250px">
						<template slot-scope="scope">
							<el-row>
								<el-tooltip
									class="item"
									effect="dark"
									content="rerun backtest"
									placement="bottom-start"
								>
									<el-button
										type="success"
										icon="el-icon-video-play"
										circle
										size="mini"
										@click="rerunBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="add to favorites"
									v-if="scope.row.favorites == false"
									placement="bottom-start"
								>
									<el-button
										v-if="scope.row.favorites == false"
										plain
										icon="el-icon-star-off"
										circle
										@click="addToFavorites(scope.row)"
										size="mini"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="remove from favorites"
									v-if="scope.row.favorites == true"
									placement="bottom-start"
								>
									<el-button
										v-if="scope.row.favorites == true"
										type="warning"
										icon="el-icon-star-on"
										circle
										@click="moveToFavorites(scope.row)"
										size="mini"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="edit backtest"
									placement="bottom-start"
								>
									<el-button
										type="primary"
										icon="el-icon-edit"
										circle
										size="mini"
										@click="editBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="copy backtest"
									placement="bottom-start"
								>
									<el-button
										:disabled="scope.row.status == 0"
										type="info"
										icon="el-icon-copy-document"
										circle
										size="mini"
										@click="copyBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="delete backtest"
									placement="bottom-start"
								>
									<el-popconfirm
										v-if="scope.row.favorites == false"
										confirm-button-text="yes"
										cancel-button-text="no"
										icon="el-icon-info"
										icon-color="red"
										title="Are you sure you want to delete it?"
										@confirm="deleteBacktest(scope.row.id)"
									>
										<el-button
											type="danger"
											icon="el-icon-delete"
											circle
											size="mini"
											slot="reference"
										></el-button>
									</el-popconfirm>
									<el-popconfirm
										v-if="scope.row.favorites == true"
										confirm-button-text="yes"
										cancel-button-text="no"
										icon="el-icon-info"
										icon-color="red"
										title="Favorite will also remove the backtest, are you sure delete it?"
										@confirm="deleteBacktest(scope.row.id)"
									>
										<el-button
											type="danger"
											icon="el-icon-delete"
											circle
											size="mini"
											slot="reference"
										></el-button>
									</el-popconfirm>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="view backtest results"
									placement="bottom-start"
								>
									<el-button
										:disabled="scope.row.status == 0 || scope.row.status == 3"
										type="warning"
										icon="el-icon-view"
										circle
										size="mini"
										@click="viewBacktestResults(scope.row)"
									></el-button>
								</el-tooltip>
								<!-- <el-tooltip
									class="item"
									effect="dark"
									content="copy backtest link"
									placement="bottom-start"
								>
									<el-button
									:disabled="scope.row.status == 0 || scope.row.status == 3"
										plain
										icon="el-icon-link"
										circle
										size="mini"
										type="success"
										v-copy="scope.row.id"
									></el-button>
								</el-tooltip> -->
							</el-row>
						</template>
					</el-table-column>
					<div slot="empty" style="text-align: left">
						<el-empty image-size="80" description="No Data"></el-empty>
					</div>
				</el-table>
				<el-pagination
					@current-change="handleCurrentChange"
					:current-page="queryInfo.page"
					:page-size="10"
					layout="total, prev, pager, next"
					:total="queryInfo.total"
				>
				</el-pagination>
			</div>
		</el-col>
	</el-row>
</template>
<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import setPromiseInterval, { clearPromiseInterval } from 'set-promise-interval'
import { copy, permission } from "@/tools/copyBacktestID";
import Cookies from 'vue-cookies'
const throttle = require('lodash/throttle')
import {
  copyBacktest,
  favoriteBacktest,
  getHistoryList,
  getStatus,
  seeParams,
  deleteBacktest,
  getBacktestName,
  getAllHistoryList,
  searchHistoryList
} from '@/service/service.js'
export default {
  data() {
    return {
      backtestList: [],
      strategyName: '',
      checkList: [],
      checked: false,
      backtestId: [],
      dialogVisible: false,
      img_data: '',
      loading: false,
      currentBacktestList: [],
      backtestItemId: 0,
      backtestResultList: [],
      editData: {},
      queryInfo: {
        page: 1,
        total: 0
      },
      loadTest: 'Loading...',
      permission: Cookies.get('devbt2Userid'),
      searchItem: '',
      currentSort: {}, // 当前的排序信息

      // 以下是run all bt
      backtest_array: [],
      isSystem: false,
    }
  },
  directives: {
    copy,
    permission
  },
  created() {
    this.getHistoryList()

    this.isSystem = this.$store.state.app.role
  },
  methods: {
    async runAllBacktest(){

      this.showFLSMASK()
      this.$store.dispatch('app/set_isFindLastSignalRuning_flag',true)

        const allHistoryList = await this.getAllHistoryData()
        // const allFavoriteList = JSON.parse(JSON.stringify(this.backtestList))
        this.backtest_array = JSON.parse(JSON.stringify(allHistoryList))

        // 給列表每一项设定识别码，内容和回测状态，0为未跑完，1为成功，2为失败
        this.$store.commit('app/SET_LASTSIGNAL_ARRAY',this.backtest_array.map(item=>{return {name:item.name,content:item,state:0}}))

      var backtest_info = this.processingBacktest(this.backtest_array)
      if (backtest_info == false) {
        console.log('处理任务结束', this.$store.state.app.last_signal_array)
        return // 处理任务结束
      }

      var error_array = new Array();
      this.postRunbacktest(backtest_info)
    },
    async getAllHistoryData() {
      // lishan 用于获取所有的 favorite 列表
      const res = await getAllHistoryList(1)
      return res
    },
    showFLSMASK() {
      const myFLSbg = document.querySelector('#myFLSbg')
      myFLSbg.classList.add('activated')
    },
    processingBacktest(backtest_arr) {
      if (backtest_arr.length <= 0) return false;
      let backtest_info = backtest_arr.pop()
      return backtest_info
    },
    postRunbacktest(backtest) {
      this.rerunBacktest(backtest)

      // 轮询可用于等待上一个回测结束，也可定时刷新进度条进度
      let interval = setInterval(() => {
        if (this.$store.getters.getIsFindLastSignalRuningFlagState == false) {
          clearInterval(interval)
          this.$store.dispatch('app/set_isFindLastSignalRuning_flag',true)
          var backtest_info = this.processingBacktest(this.backtest_array)
          if (backtest_info == false) {
            this.$store.dispatch('app/set_isFindLastSignalRuning_flag',false)
            console.log('处理任务结束', this.$store.state.app.last_signal_array)
            //this.removeFLSMASK()
            return // 处理任务结束
          }
          this.postRunbacktest(backtest_info)

          // 是否添加一个成功列表
        }
      }, 1000) // 2秒查询一次
    },
    // ******************以上是run all bt********************
    async getHistoryList(orderby) {
      this.loadTest = 'Loading...'
      this.loading = true
      try {
        let res
        res = await getHistoryList(this.queryInfo.page, orderby, this.searchItem)
        console.log('History 列表请求结果',res)
        if (res.status === 200) {
          this.loading = false
          let historyNameList = []
          this.backtestList = res.data.results

          if (res.data.results.length != 0) {
            res.data.results.forEach((element) => {
              historyNameList.push(element.name)
              if (element.result !== '')
                element.result = JSON.parse(element.result)
              if (element.entry_description.indexOf('[') != -1) {
                element.entry_description = JSON.parse(
                  element.entry_description
                )
              } else {
                element.entry_description = [element.entry_description]
              }
              if (element.exit_description.indexOf('[') != -1) {
                element.exit_description = JSON.parse(element.exit_description)
              } else {
                element.exit_description = [element.exit_description]
              }
            })

            this.backtestList = res.data.results
            this.$store.commit('app/getBacktestName', historyNameList)
          }
          this.queryInfo.total = res.data.count
        }
      } catch (error) {
        console.log(error)
        if(error.response.status === 404) {
          let page = this.queryInfo.page
          const newPage = page != 1 ? page - 1 : 1
          this.handleCurrentChange(newPage)
        }
        this.loading = false
      }
    },
    async onSortChange({ column, prop, order }) {
			/**
		 * 表格排序事件处理函数
		 * @param {object} {column,prop,order} 列数据|排序字段|排序方式
		 */
      if (column.sortable !== 'custom') return
      this.currentSort = {
        prop: prop,
        order: order,
      };
      await this.applySort()
    },
    async applySort() {
      let { prop, order } = this.currentSort;
      console.log('order', order)
      console.log('prop', prop)
      //  order: 升 'ascending' | 降'descending' | 取消升降 null | order: total_return 
      if (order == null || order == prop) {
        // 不排序
        prop = null
      }
      if (order == 'ascending') {
        // 升序排列
        prop = `-${prop}`
      }
      this.loadTest = 'Loading...'
      this.loading = true
      const res = await getHistoryList(this.queryInfo.page, prop, this.searchItem)
      if (res.status === 200) {
        this.loading = false
        let historyNameList = []
        this.backtestList = res.data.results

        if (res.data.results.length != 0) {
          res.data.results.forEach((element) => {
            historyNameList.push(element.name)
            if (element.result !== '')
              element.result = JSON.parse(element.result)
            if (element.entry_description.indexOf('[') != -1) {
              element.entry_description = JSON.parse(
                element.entry_description
              )
            } else {
              element.entry_description = [element.entry_description]
            }
            if (element.exit_description.indexOf('[') != -1) {
              element.exit_description = JSON.parse(element.exit_description)
            } else {
              element.exit_description = [element.exit_description]
            }
          })

          this.backtestList = res.data.results
          this.$store.commit('app/getBacktestName', historyNameList)
        }
        this.queryInfo.total = res.data.count
      }
      this.loading = false
    },
    refreshHistory(id) {
      let vm = this
      vm.loadTest = 'Generating Backtest report, please wait'
      vm.clearInterval = clearPromiseInterval
      let timer = setPromiseInterval(async () => {
        try {
          const res = await getStatus(id)
          CIQ.nprogress.inc()
          if (res.data.status == 2) {
            clearPromiseInterval(timer).then(() => { })
            vm.queryInfo.page = 1
            vm.getHistoryList()
            this.$emit('refFavoritesForm')

            let row = res.data
            row.result = JSON.parse(row.result)

            //如果是从FindLastSignal来的，isFindLastSignalRuning为true
            if(!vm.$store.getters.getIsFindLastSignalRuningFlagState){
              vm.viewBacktestResults(row)
            }else{
              // FindLastSignal过程中代表一个项目的运行结束
              vm.$store.dispatch('app/set_isFindLastSignalRuning_flag',false)
              vm.$store.state.app.last_signal_array.map(item=>{
                if(item.name == row.name){
                  item.state = 1
                }
              })
              console.log('FindLastSignalRuning done',row,vm.$store.state.app.last_signal_array)
              
              CIQ.hideCover()
              CIQ.nprogress.done()
            }
          }
          if (res.data.status == 3) {
            clearPromiseInterval(timer).then(() => { })
            vm.queryInfo.page = 1
            vm.getHistoryList()
            this.$emit('refFavoritesForm')

            CIQ.hideCover()
            CIQ.nprogress.done()
            let row = res.data
            row.result = JSON.parse(row.result)

            if(!vm.$store.getters.getIsFindLastSignalRuningFlagState){
              vm.viewBacktestResults(row)
            }else{
              // 没交易不算回测失败，不列为fls的失败情况
              // FindLastSignal过程中代表一个项目的运行结束
              vm.$store.dispatch('app/set_isFindLastSignalRuning_flag',false)
              vm.$store.state.app.last_signal_array.map(item=>{
                if(item.name == row.name){
                  item.state = 1
                }
              })
              console.log('findLastSignalRuning done, no trade',row,vm.$store.state.app.last_signal_array)
            }
            // vm.$notify({
            // 	title: 'No trades',
            // 	message: 'No trades, please change parameter.',
            // 	offset: 100,
            // 	type: 'warning'
            // })
          }
        } catch (error) {
          // 会一直保持定时器重复尝试
        console.log(error)
          vm.$message({
            message: 'The internal server is busy, please try again later ',
            type: 'error'
          })
          CIQ.addCover()
          CIQ.nprogress.start()
        }
      }, 1000)
    },
    editBacktest: throttle(async function (row) {
      let vm = this
      try {
        CIQ.addCover('Fetching backtest information...')
        CIQ.nprogress.start()
        let res = null
        try {
          res = await seeParams(row.id)
        } catch (error) {
          throw Error('Request Error')
        }
        console.log('seeParams 结果', res)
        document.getElementsByClassName('ciq-period')[0].style.display = ''
        //  Restore indicator layout
        this.$store.commit('app/getBacktestSymbol', res.data.symbol)

        this.$store.dispatch('app/set_isMarkerShown_flag',false)
        if (res.data.indicator_layout) {
          let parsedData = JSON.parse(res.data.indicator_layout.replaceAll('$r001$', '\u200c'))
          this.restoreIndicatorLayoutEdit(
            parsedData,
            res.data.frequency,
            row, res.data
          )
        } else {
          this.$store.commit('app/getRunBacktestData', row)
          // emit Synchronous call
          this.$emit('goTobacktestSetupForm', row.id, res.data, 'edit', () => {
            this.$emit('goBacktestResultForm', row, () => {
              this.$emit('switchTab', 'first')
              CIQ.hideCover()
              CIQ.nprogress.done()
            })
          })
        }
      } catch (error) {
        console.log(error)
        vm.$message({
          message: 'The internal server is busy, please try again later ',
          type: 'error'
        })
        CIQ.hideCover()
				CIQ.nprogress.done()
      }
    }, 500),
	rerunBacktest: throttle(async function (row) {
		console.log('editBacktest', row)
		let vm = this
		try {
			CIQ.addCover('Fetching backtest information...')
			CIQ.nprogress.start()
      let res = null
			try {
        res = await seeParams(row.id)
      } catch (error) {
        throw Error('Request Error')
      }
			document.getElementsByClassName('ciq-period')[0].style.display = ''
			//  Restore indicator layout
			this.$store.commit('app/getBacktestSymbol', res.data.symbol)

			this.$store.dispatch('app/set_isMarkerShown_flag',false)
			if (res.data.indicator_layout) {
				let parsedData = JSON.parse(res.data.indicator_layout.replaceAll('$r001$','\u200c'))
				this.restoreIndicatorLayoutRerun(
					parsedData,
					res.data.frequency,
					row, res.data
				)
			} else {
				this.$store.commit('app/getRunBacktestData', row)
				// emit Synchronous call
				this.$emit('goTobacktestSetupForm', row.id, res.data,'edit',()=>{
					this.$emit('goBacktestResultForm', row, ()=>{
						this.$emit('switchTab','first')
						this.$emit('rerun')			
					})
				})	
			}
		} catch (error) {
      console.log(error)
			vm.$message({
				message: 'The internal server is busy, please try again later ',
				type: 'error'
			})
      CIQ.hideCover()
			CIQ.nprogress.done()
		}
	}, 500),
    async deleteBacktest(id) {
      try {
        const res = await deleteBacktest(id)
        if (res.status == 204) {
          this.getHistoryList()
          this.$emit('refFavoritesForm')
        } else {
          this.$message.error({
            message: 'The deletion failed',
            duration: 1000
          })
        }
      } catch (error) {
        console.log(error)
        this.$message({
          message: 'The internal server is busy, please try again later ',
          type: 'error'
        })
      }
    },
    copyBacktest: throttle(async function (row) {
      try {
        let params = {}
        const nameRes = await getBacktestName(row.name + '(copy)')

        if (nameRes.data.count != 0) {
          let nameChecked = true
          const nameResults = nameRes.data.results
          for (let i = 0; i < nameResults.length; i++) {
            if (nameResults[i].name == `${row.name}(copy)`) {
              // 重名
              nameChecked = false
              break
            }
          }
          if(!nameChecked){
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.error({
              title: 'Has been Copied',
              message: 'The backtest has been copied'
            })
            return
          }
        }
        let res = null
        try {
          res = await seeParams(row.id)
        } catch (error) {
          throw Error('Request Error')
        }
        this.$store.commit('app/getBacktestSymbol', res.data.symbol)
        this.$store.commit('app/getRunBacktestData', row)
        params = res.data
        params.name = params.name + '(copy)'
        params.favorites = false
        params.user_tag = 'client'
        params.report_url = ''
        delete params.uuid
        delete params.results
        delete params.user_id
        delete params.status
        delete params.backtest_id
        let paramsStr = this.$qs.stringify(params)
        try {
          const copyRes = await copyBacktest(paramsStr)
          if (copyRes.status === 201) {
            this.$notify({
              title: 'Copy successfully',
              message: 'After copying successfully, you can edit the backtest',
              type: 'success'
            })
            this.queryInfo.page = 1
            this.getHistoryList()
            this.$emit('refFavoritesForm')
          } else {
            this.$message.error('Copy failed')
            CIQ.hideCover()
					  CIQ.nprogress.done()
          }
        } catch (error) {
          console.log(error)
          if (error.response.status === 500) {
            this.$notify.error({
              title: 'Service is busy',
              message: 'The internal server is busy, please try again later '
            })
          }
          CIQ.hideCover()
					CIQ.nprogress.done()
        }
      } catch (error) {
        console.log(error)
        this.$notify.error({
          title: 'Service is busy',
          message: 'The internal server is busy, please try again later '
        })
        CIQ.hideCover()
				CIQ.nprogress.done()
      }
    }, 1000),
    viewBacktestResults: throttle(async function (row) {
      document.getElementsByClassName('ciq-period')[0].style.display = 'none'
      try {
        CIQ.addCover('Fetching backtest information...')
        CIQ.nprogress.start()
        let res = null
        try {
          res = await seeParams(row.id)
        } catch (error) {
          throw Error('Request Error')
        }
        this.$store.commit('app/getBacktestSymbol', res.data.symbol)

        this.$store.dispatch('app/set_isMarkerShown_flag',false)
        if (res.data.indicator_layout) {
          let parsedData = JSON.parse(res.data.indicator_layout.replaceAll('$r001$', '\u200c'))
          this.restoreIndicatorLayoutView(
            parsedData,
            res.data.frequency,
            row, res.data
          )
        } else {
          this.$store.commit('app/getRunBacktestData', row)
          this.$emit('goTobacktestSetupForm', row.id, res.data, 'canDelView', () => {
            this.$emit('goBacktestResultForm', row, () => {
              CIQ.hideCover()
              CIQ.nprogress.done()
            })
          })
        }
      } catch (error) {
        console.log(error)
        this.$message({
          message: 'The internal server is busy, please try again later ',
          type: 'error'
        })
        CIQ.hideCover()
        CIQ.nprogress.done()
      }
      if (!row.result['Total Trades']) {
        this.$notify({
          title: 'No trades',
          message: 'No trades, please change parameter.',
          type: 'warning',
        })
        CIQ.hideCover()
        CIQ.nprogress.done()
      }
    }, 500),
    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.applySort();
    },
    reloadData(data, freq) {
      let frequency = ''
      this.$store.commit('app/getEntryIndicatorsList', data.formIndicators.entry)
      this.$store.commit('app/getExitIndicatorsList', data.formIndicators.exit)
      this.$store.commit('app/getExtraIndicators', [])
      // filter garbage in TechnicalIndicators
      // const technicalIndicators = data.technicalIndicators.filter(item=>{
      // 	data.formIndicators.entry.indexOf(item) != -1 || data.formIndicators.exit.indexOf(item) != -1
      // })
      this.$store.commit('app/getTechnicalIndicators', data.technicalIndicators)
      this.$store.commit('app/getMA', data.activatedMA)
      // 暂定，编辑时读取回测携带的ma位置和信息
      this.$store.commit('app/getMALayout', data.activatedMALayout)
      this.$store.commit('app/setTechSD', data.savedTechSD)

      switch (freq) {
        case 'Daily': {
          frequency = 'daily'
          break
        }
        case 'Weekly': {
          frequency = 'weekly'
          break
        }
        case 'Monthly': {
          frequency = 'monthly'
          break
        }
        default: {
          break
        }
      }
      this.$store.commit('app/setRestoreFreq', frequency)
    },
    restoreIndicatorLayoutView(data, freq, row, resData) {
      // After the run back test and between the view result, a chart will be loaded to output signalouput
      var that = this
      if (that.$store.getters.getIsBacktestRunningFlagState == true) {
        that.$store.dispatch('app/set_isBacktestRunning_flag',false)
        //The outputsignalsresult is no longer used. The exportcsv is placed before the backtest and the callback is placed in place
        that.$store.commit('app/getRunBacktestData', row)
        that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
          that.$emit('goBacktestResultForm', row, () => {
            CIQ.hideCover()
            CIQ.nprogress.done()
          })
        })
      } else {
        this.reloadData(data, freq)
        CIQ.addIndicatorsFromBacktest(function () {
          that.$store.commit('app/getRunBacktestData', row)
          that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
            that.$emit('goBacktestResultForm', row, () => {
              CIQ.hideCover()
              CIQ.nprogress.done()
            })
          })
        })
      }
    },
    restoreIndicatorLayoutEdit(data, freq, row, resData) {
      this.reloadData(data, freq)
      var that = this
      CIQ.addIndicatorsFromBacktest(function () {
        that.$store.commit('app/getRunBacktestData', row)
        that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
          that.$emit('goBacktestResultForm', row, () => {
            that.$emit('switchTab', 'first')
            CIQ.hideCover()
            CIQ.nprogress.done()
          })
        })
      })
    },
	restoreIndicatorLayoutRerun(data, freq, row, resData) {
			this.reloadData(data, freq)
			var that = this
			CIQ.addIndicatorsFromBacktest(function () {
				that.$store.commit('app/getRunBacktestData', row)
				that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView',()=>{
					that.$emit('goBacktestResultForm', row, ()=>{
						that.$emit('switchTab','first')
						that.$emit('rerun')
					})
				})	
			})
	}, 
    addToFavorites: throttle(async function (row) {
      // if(row.status != 2){
      //   // 状态不为 2 不能添加收藏
      //   this.$notify({
      //       title: 'Warning',
      //       message:
      //         'Please run the Backtest before adding it to the Favorites.',
      //       type: 'warning'
      //     })
      //     return
      // }
      let vm = this
      row.favorites = true
      let params = {
        favorites: true
      }
      let paramsStr = vm.$qs.stringify(params)
      try {
        const res = await favoriteBacktest(row.id, paramsStr)
        if (res.status === 200) {
          this.getHistoryList()
          this.$notify({
            title: 'Added to favorites',
            message:
              'Favorites have been added and you can view them in My Favorites',
            type: 'success'
          })

          this.$emit('refFavoritesForm')
        } else {
          this.getHistoryList()
          this.$message.error({
            message: 'Collection failed',
            duration: 1000
          })
        }
      } catch (error) {
        console.log(error)
        vm.$message({
          message: 'The internal server is busy, please try again later ',
          type: 'error'
        })
      }
    }, 1000),
    moveToFavorites: throttle(async function (row) {
      let vm = this
      row.favorites = false
      let params = {
        favorites: false
      }
      let paramsStr = vm.$qs.stringify(params)
      try {
        const res = await favoriteBacktest(row.id, paramsStr)
        if (res.status === 200) {
          this.getHistoryList()
          this.$emit('refFavoritesForm')
        }
      } catch (error) {
        console.log(error)
        vm.$message({
          message: 'The internal server is busy, please try again later ',
          type: 'error'
        })
      }
    }, 1000),

    handleQuery: throttle(function () { this.getHistoryList() }, 500)
  }
}
</script>
<style lang="less" scoped>
.searchBox {
  float: left;
  .search {
	margin-right: 28px;
}
}
.showDate {
	display: flex;
	flex-direction: column;
	/deep/.el-button + .el-button {
		margin-left: 0px;
	}
	/deep/ .el-button--mini,
	.el-button--mini.is-round {
		margin-bottom: 5px;
	}
}
/deep/ .el-table .cell {
	padding: 0px 10px 0px 10px;
	word-wrap: break-word;
}
/deep/.el-button + .el-button {
	margin-left: 0px;
}
/deep/ .el-button--mini.is-circle {
	margin-right: 5px;
	margin-bottom: 5px;
}
/deep/ .showDate .el-button--mini,
.el-button--mini.is-round {
	padding: 7px 0px;
}
.el-button--mini.is-circle {
	padding: 7px;
}
.el-table__body-wrapper {
	overflow-x: scroll;
}
.descriptionBox {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	> * {
		flex: 1;
	}
	.entryBox {
		p:first-child {
			font-weight: 500;
			color: #99a9bf;
		}
	}
	.exitBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
}
</style>