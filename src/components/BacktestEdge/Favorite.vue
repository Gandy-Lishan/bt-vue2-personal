// Favorite List
<template>
	<el-row>
		<el-col :span="24">


			<div class="favoriteForm_container">

        <el-button @click="runAllBacktest" class='fls-btn'>run all backtest</el-button>
        <el-button @click="_findLastSignal" class='fls-btn'>find last signal</el-button>

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
				> <i slot="suffix" class="el-input__icon el-icon-search"></i></el-input>
        </div>
				<el-table
					:data="backtestList"
					v-loading="loading"
					element-loading-text="Loading"
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
						label="Last Signal Date"
						show-overflow-tooltip
						align="center"
						width="150px"
					>
						<template slot-scope="scope">
							<div class="showDate">
								<el-button
									size="mini"
									type="info"
									plain
									>enter: {{ scope.row.last_entry_signal_date }}</el-button
								>
								<el-button
									size="mini"
									type="info"
									plain
									>exit: {{ scope.row.last_exit_signal_date }}</el-button
								>
							</div>
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
						><template slot-scope="scope">
							<!-- <span v-if="scope.row.result['Total Return (%)']">{{
								scope.row.result['Total Return (%)'] + '%'
							}}</span> -->
              <span v-if="scope.row.total_return">{{
								scope.row.total_return + '%'
							}}</span>
							<span v-else>{{ 0 + '%' }}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="200px">
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
										type="warning"
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
const throttle = require('lodash/throttle')
import { copy, permission } from '@/tools/copyBacktestID'
import {
  getFavoriteList,
  seeParams,
  deleteBacktest,
  copyBacktest,
  favoriteBacktest,
  getBacktestName,
  getAllFavoriteList,
  findLastSignalApi
} from '@/service/service'
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
      searchItem: '',
      currentSort: {}, // 当前的排序信息

      backtest_array: [],

      allFavoriteList: [],
      favorite_array: []
    }
  },
  directives: {
    copy,
    permission
  },
  mounted(){
    //CIQ.addFLSCover()
  },
  methods: {
    async getFavoriteList(orderby) {
      this.loading = true
      try {
        let res
        res = await getFavoriteList(this.queryInfo.page, orderby, this.searchItem)
        console.log('响应', res)
        if (res.status === 200) {
        this.loading = false
          this.backtestList = res.data.results
          if (this.backtestList.length != 0) {
            this.backtestList.forEach((element) => {
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
          }
          this.queryInfo.total = res.data.count
        }
      } catch (error) {
        this.loading = false
        console.log(error)
      }
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
          console.log('error', error)
          throw Error('Request Failed')
        }
        document.getElementsByClassName('ciq-period')[0].style.display = ''
        // Restore indicator layout
        this.$store.commit('getBacktestSymbol', res.data.symbol)
        CIQ.hideMarker()
        CIQ.isMarkerShown = false
        if (res.data.indicator_layout) {
          let parsedData = JSON.parse(res.data.indicator_layout.replaceAll('$r001$', '\u200c'))
          this.restoreIndicatorLayoutEdit(
            parsedData,
            res.data.frequency,
            row,
            res.data
          )
        } else {
          this.$store.commit('getRunBacktestData', row)
          // Emit synchronous call
          this.$emit('goTobacktestSetupForm', row.id, res.data, 'edit', () => {
            this.$emit('goBacktestResultForm', row, () => {

              // 如果是调用了find lst signal,则在edit时获取chartiq csv数据
              if(CIQ.isEditFinish) this.uploadCSVWhileFLS(row.id)

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
		let vm = this
		try {
			CIQ.addCover('Fetching backtest information...')
			CIQ.nprogress.start()
      let res = null
			try {
        res = await seeParams(row.id)
      } catch (error) {
        throw Error('Request Failed')
      }
			document.getElementsByClassName('ciq-period')[0].style.display = ''
			// Restore indicator layout
			this.$store.commit('getBacktestSymbol', res.data.symbol)
			CIQ.hideMarker()
			CIQ.isMarkerShown = false
			if (res.data.indicator_layout) {
				let parsedData = JSON.parse(res.data.indicator_layout.replaceAll('$r001$','\u200c'))
				this.restoreIndicatorLayoutRerun(
					parsedData,
					res.data.frequency,
					row,
					res.data
				)
			} else {
				this.$store.commit('getRunBacktestData', row)
				// Emit synchronous call
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
          this.getFavoriteList()
          this.$emit('refHistoryForm')
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
			CIQ.addCover('Copying backtest...')
			CIQ.nprogress.start()
      try {
        let params = {}
        const nameRes = await getBacktestName(row.name + '(copy)')

        if (nameRes.data.count != 0) {
					CIQ.hideCover()
          CIQ.nprogress.done()
          this.$notify.error({
            title: 'Has been Copied',
            message: 'The backtest has been copied'
          })
          return
        }
        let res = null
        try {
          res = await seeParams(row.id)
        } catch (error) {
          throw Error('Request failed')
        }
        this.$store.commit('getBacktestSymbol', res.data.symbol)
        this.$store.commit('getRunBacktestData', row)
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
            this.getFavoriteList()
            this.$emit('refFavoritesForm')
            this.$emit('goToHistoryForm')
            this.$emit('refHistoryForm')
          } else {
            this.$message.error('Copy failed')
          }
					CIQ.hideCover()
          CIQ.nprogress.done()
        } catch (error) {
          console.error(error)
					CIQ.hideCover()
          CIQ.nprogress.done()
          if (error.response.status === 500) {
            console.log(error)
            this.$notify.error({
              title: 'Service is busy',
              message: 'The internal server is busy, please try again later '
            })
            CIQ.hideCover()
					  CIQ.nprogress.done()
          }
        }
      } catch (error) {
        console.error(error)
				CIQ.hideCover()
        CIQ.nprogress.done()
        this.$notify.error({
          title: 'Service is busy',
          message: 'The internal server is busy, please try again later '
        })
      }
    }, 1000),
    viewBacktestResults: throttle(async function (row) {
      if (row.result['Total Trades']) {
        document.getElementsByClassName('ciq-period')[0].style.display = 'none'
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
          this.$store.commit('getBacktestSymbol', res.data.symbol)
          CIQ.hideMarker()
          CIQ.isMarkerShown = false
          if (res.data.indicator_layout) {
            let parsedData = JSON.parse(res.data.indicator_layout.replaceAll('$r001$', '\u200c'))
            this.restoreIndicatorLayoutView(
              parsedData,
              res.data.frequency,
              row,
              res.data
            )
          } else {
            this.$store.commit('getRunBacktestData', row)
            this.$emit('goTobacktestSetupForm', row.id, res.data, 'canDelView', () => {
              this.$emit('goBacktestResultForm', row, () => {
                CIQ.hideCover()
                CIQ.nprogress.done()
              })
            })
          }
        } catch (error) {
          console.error(error)
          vm.$message({
            message: 'The internal server is busy, please try again later ',
            type: 'error'
          })
          CIQ.hideCover()
					CIQ.nprogress.done()
        }
      } else {
        this.$notify({
          title: 'No trades',
          message: 'No trades, please change parameter.',
          type: 'warning'
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
      this.$store.commit('getEntryIndicatorsList', data.formIndicators.entry)
      this.$store.commit('getExitIndicatorsList', data.formIndicators.exit)
      this.$store.commit('getExtraIndicators', [])
      // filter garbage in TechnicalIndicators
      // const technicalIndicators = data.technicalIndicators.filter(item=>{
      // 	data.formIndicators.entry.indexOf(item) != -1 || data.formIndicators.exit.indexOf(item) != -1
      // })
      this.$store.commit('getTechnicalIndicators', data.technicalIndicators)
      this.$store.commit('getMA', data.activatedMA)
      // 暂定，编辑时读取回测携带的ma位置和信息
      this.$store.commit('getMALayout', data.activatedMALayout)
      this.$store.commit('setTechSD', data.savedTechSD)

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
      this.$store.commit('setRestoreFreq', frequency)
    },
    restoreIndicatorLayoutView(data, freq, row, resData) {
      this.reloadData(data, freq)
      var that = this
      CIQ.addIndicatorsFromBacktest(function () {
        that.$store.commit('getRunBacktestData', row)
        // emit同步调用
        that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
          that.$emit('goBacktestResultForm', row, () => {
            CIQ.hideCover()
            CIQ.nprogress.done()
          })
        })
      })
    },
    restoreIndicatorLayoutEdit(data, freq, row, resData) {
      this.reloadData(data, freq)
      var that = this
      CIQ.addIndicatorsFromBacktest(function () {
        that.$store.commit('getRunBacktestData', row)
        that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView', () => {
          that.$emit('goBacktestResultForm', row, () => {
            
            // 如果是调用了find lst signal,则在edit时获取chartiq csv数据
            if(CIQ.isEditFinish) that.uploadCSVWhileFLS(row)

            that.$emit('switchTab', 'first')
            CIQ.hideCover()
            CIQ.nprogress.done()
          })
        })
      })
    },
  async uploadCSVWhileFLS(row) {
      // lishan 在这里保存数据到 vuex favorite 中要用
      CIQ.spanPeriod = {
        start_date:
          row.start_date.replace(/-/g, '') * 1000000000,
        end_date: row.end_date.replace(/-/g, '') * 1000000000
      }

      const content = CIQ.exportEx()
      console.log('uploadCSVWhileFLS content--------------------------', content)
      let parameterRes = null
      try {
        parameterRes = await seeParams(row.id)
        const csvObj = {
            id: row.id,
            csv: content,
            entry: parameterRes.data.entry,
            exit: parameterRes.data.exit
          }
          this.$store.commit('setHashTable', csvObj)
          this.$store.state._last_signal_array.map(item=>{
              if(item.name == parameterRes.data.name){
                item.state = 1
              }
            })
      } catch (error) {
        console.error('error', error)
        this.$store.state._last_signal_array.map(item=>{
              if(item.name == resData.data.name){
                item.state = 2
              }
            })
      } finally{
        // lishan 到这里代表调用完成
        CIQ.isEditFinish = false
      }
  },
	restoreIndicatorLayoutRerun(data, freq, row, resData) {
		this.reloadData(data, freq)
		var that = this
		CIQ.addIndicatorsFromBacktest(function () {
			that.$store.commit('getRunBacktestData', row)
			that.$emit('goTobacktestSetupForm', row.id, resData, 'canDelView',()=>{
				that.$emit('goBacktestResultForm', row, ()=>{
					that.$emit('switchTab','first')
					that.$emit('rerun')
				})
			})
		})
	},
    addToFavorites: throttle(async function (row) {
      let vm = this
      row.favorites = true
      let params = {
        favorites: true
      }
      let paramsStr = vm.$qs.stringify(params)
      try {
        const res = await favoriteBacktest(row.id, paramsStr)
        if (res.status === 200) {
          this.getFavoriteList()
          this.$emit('refHistoryForm')
        } else {
          this.getFavoriteList()
          this.$message.error({
            message: 'Collection failed',
            duration: 1000
          })
        }
      } catch (error) {
        console.error(error)
        vm.$message({
          message: 'The internal server is busy, please try again later ',
          type: 'error'
        })
      }
    }, 500),
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
          this.getFavoriteList()
          this.$emit('refHistoryForm')
        } else {
          this.getFavoriteList()
          this.$message.error({
            message: 'removed failed',
            duration: 1000
          })
        }
      } catch (error) {
        console.error(error)
        vm.$message({
          message: 'The internal server is busy, please try again later ',
          type: 'error'
        })
      }
    }, 500),
    handleQuery: throttle(function () { this.getFavoriteList() }, 500),
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
      const res = await getFavoriteList(this.queryInfo.page, prop, this.searchItem)
      if (res.status === 200) {
        this.loading = false
        this.backtestList = res.data.results

        if (this.backtestList.length != 0) {
          this.backtestList.forEach((element) => {
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
        }
        this.queryInfo.total = res.data.count
      }
      this.loading = false
    },

    processingBacktest(backtest_arr) { 
            if (backtest_arr.length <= 0) return false; 

            // 跳过用户自定义时间的情况
            let backtest_info
            while(1){
              backtest_info = backtest_arr.pop()
              if(backtest_info.backtest_period != 22) break
            }
            
            // 修改开始时间以及结束时间为最新时间,结合backtest_period,以最新一天开始向前倒推 应该有现成代码可以使用
            // period = backtest_info['backtest_period']
            // if (period === undefined || period ==''){
            //     // 你看看怎么设置个默认值
                // backtest_info["end_date"] = "2023-07-05"
                // backtest_info["start_date"] = "2022-07-05"
            // }else if (period === "21"){
            //     // 记得根据实际时间调整
            //     backtest_info["end_data"] = "2023-07-05"
            // }else{
            // // 值在二十以内的处理方案
            // backtest_info["end_data"] = "2023-07-05"
            // backtest_info["end_data"] = "2023-07-05"
            // }
            // 发送请求要携带old_uuid记得看一下rerun处理吧
            
        
        return backtest_info

    },

    async runAllBacktest(){

        this.showFLSMASK()
        CIQ.isFindLastSignalRuning = true

        const allFavoriteList = await this.getAllFavoriteData()
        // const allFavoriteList = JSON.parse(JSON.stringify(this.backtestList))
        this.backtest_array = JSON.parse(JSON.stringify(allFavoriteList))

        // 給列表每一项设定识别码，内容和回测状态，0为未跑完，1为成功，2为失败
        this.$store.commit('SET_LASTSIGNAL_ARRAY',this.backtest_array.map(item=>{return {name:item.name,content:item,state:0}}))

        var backtest_info = this.processingBacktest(this.backtest_array)
        if (backtest_info == false){
          console.log('处理任务结束',this.$store.state.last_signal_array)
          return // 处理任务结束
        }

        var error_array = new Array();
        this.postRunbacktest(backtest_info)
    },
    postRunbacktest(backtest){
        //console.log('backtest_info* ******',backtest,CIQ.isFindLastSignalRuning)
        this.rerunBacktest(backtest)

        // 轮询可用于等待上一个回测结束，也可定时刷新进度条进度
        let interval = setInterval(() =>{
                if (CIQ.isFindLastSignalRuning == false){
                  clearInterval(interval)
                  CIQ.isFindLastSignalRuning = true
                  //console.log('轮询等待上一个回测结束.........',CIQ.isFindLastSignalRuning,backtest)
                  var backtest_info = this.processingBacktest(this.backtest_array)
                  if (backtest_info == false){
                    CIQ.isFindLastSignalRuning = false
                    console.log('处理任务结束',this.$store.state.last_signal_array)
                    //this.removeFLSMASK()
                    return // 处理任务结束
                  }
                  this.postRunbacktest(backtest_info)
                  
                  // 是否添加一个成功列表
                }
        },1000) // 2秒查询一次
    },
    showFLSMASK(){
      const myFLSbg = document.querySelector('#myFLSbg')
      myFLSbg.classList.add('activated')
    },
    async _findLastSignal() {
      // lishan 批量给列表调用 editBacktest 你的方法名称我并没修改，而是使用 '_' 开头
      this.$store.commit('clearHashTable')
      this.showFLSMASK()
      CIQ.isEditFinish = true
      const allFavoriteList = await this.getAllFavoriteData()
      // const allFavoriteList = JSON.parse(JSON.stringify(this.backtestList))
      this.favorite_array = JSON.parse(JSON.stringify(allFavoriteList))
      console.log('favorite_array* ******',this.favorite_array)
      this.$store.commit('_SET_LASTSIGNAL_ARRAY',this.favorite_array.map(item=>{return {name:item.name,content:item,state:0,id:item.id}}))
      let favorite_info = this.processingBacktest(this.favorite_array)
      if (favorite_info == false){
          console.log('处理任务结束',this.$store.state._last_signal_array)
          return // 处理任务结束
        }
        var error_array = new Array();
        this._postRunbacktest(favorite_info)
    },
   _postRunbacktest(favorite) {
    // lishan 做迭代 
      this.editBacktest(favorite)
      // 轮询可用于等待上一个回测结束，也可定时刷新进度条进度
      let interval = setInterval(async () =>{
          if (CIQ.isEditFinish == false){
            clearInterval(interval)
            CIQ.isEditFinish = true
            //console.log('轮询等待上一个回测结束.........',CIQ.isEditFinish,backtest)
            var favorite_info = this.processingBacktest(this.favorite_array)
            if (favorite_info == false){
              CIQ.isEditFinish = false
              console.log('处理任务结束',this.$store.state._last_signal_array)
              const array = this.$store.state._last_signal_array
              const removedItems = [];
              for (let i = array.length - 1; i >= 0; i--) {
                if (array[i].state == 2 || array[i].state == 0) {
                  removedItems.push(array.splice(i, 1)[0]);
                }
              }
              console.log('未处理成功的任务', removedItems)
              // 找出状态不为 2 的 并删除掉 list 中状态不为 2 的
              const list = this.$store.state.hashTable
              const filteredArray = list.filter(item => !removedItems.includes(item.id))
              console.log('过滤出来的任务', filteredArray)
              const requestList = []
              for (let i = 0; i < filteredArray.length; i++) {
                requestList.push(findLastSignalApi(filteredArray[i]))
              }
              // const res = await Promise.all(requestList)
              let res = await Promise.allSettled(requestList)
              // lishan 这个时候已经处理完，批量发请求给后台， 拿到 lastSignal
              console.log('处理任务结束------处理任务结束', res)
              res = res.filter(item => item.status === 'fulfilled')
              let lastSignalList = res.map((item) => {
                return {
                  lastEntrySignalDate: item.value.data.lastEntrySignalDate,
                  lastExitSignalDate: item.value.data.lastExitSignalDate
                }
              })
              console.log('lastSignalList', lastSignalList)
              //this.removeFLSMASK()
              return // 处理任务结束
            }
            this._postRunbacktest(favorite_info)
            
            // 是否添加一个成功列表
          }
        },1000) // 2秒查询一次
    },
    async getAllFavoriteData() {
    // lishan 用于获取所有的 favorite 列表
      const res = await getAllFavoriteList(this.queryInfo.page)
      console.log('拿到所有的favorite列表', res)
      return res.slice(0,3)
    }
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
	.entryBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
	.exitBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
}

.fls-btn{
  float: right;
  margin-left: 20px;
}


</style>
