<template>
	<div class="backtest-result-container">
		<el-row>
			<div class="backtest_container">
				<el-form
					ref="backtestSetupForm"
					:model="backtestResult"
					label-position="left"
				>
					<el-col :xs="20" :sm="14" :md="12" :lg="8" :xl="8">
						<el-form-item label="Name:" prop="name">
							<el-input v-model="backtestResult.name" disabled></el-input>
						</el-form-item>
						<el-form-item label="Description:" prop="description">
							<el-input
								v-model="backtestResult.description"
								type="textarea"
								disabled
								:autosize="{ minRows: 6, maxRows: 6 }"
								resize="none"
							></el-input>
						</el-form-item>
						<el-form-item label="Symbol name:" prop="symbol">
							<div class="enterSymbolBox">
								<el-select
									disabled
									v-model="backtestResult.symbol"
									filterable
									remote
									reserve-keyword
									placeholder="enter keywords"
									:remote-method="remoteMethod"
									:loading="loading"
								>
									<el-option
										v-for="item in options"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="20" :sm="14" :md="12" :lg="8" :xl="8">
						<el-form-item label="Starting Capital:" prop="capital">
							<el-input v-model="backtestResult.capital" disabled></el-input>
						</el-form-item>
						<el-form-item label="Commission:" prop="commission">
							<el-input
								v-model="backtestResult.commission"
								disabled
								oninput="this.value=this.value.replace(/^0\.[0-9]{0,4}$/,'')"
							></el-input>
						</el-form-item>
						<el-form-item label="Slippage:" prop="slippage">
							<el-input v-model="backtestResult.slippage" disabled></el-input>
						</el-form-item>
						<el-form-item label="Money Management:" prop="moneyManagement">
							<div class="selectBox">
								<el-select v-model="value" disabled placeholder="Pleace select">
									<el-option
										v-for="item in options"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									>
									</el-option>
								</el-select>
							</div>
						</el-form-item>
					</el-col>
					<el-col :xs="20" :sm="14" :md="12" :lg="8" :xl="8">
						<el-form-item label="Benchmark:" prop="benchmark">
							<div class="enterSymbolBox">
								<el-input
									v-model="backtestResult.benchmark"
									disabled
								></el-input>
							</div>
						</el-form-item>
						<!-- <div class="dateNote"> -->
						<!-- <el-form-item label="Start date"> -->
						<!-- <el-date-picker
                v-if="backtestResult.historyValue === 22"
                v-model="backtestResult.start_date"
                type="date"
                placeholder="Please select a start date"
              >
              </el-date-picker> -->
						<!-- <el-input
              disabled
              v-model="backtestResult.start_date"
              placeholder="Please select a start date">
              </el-input>
            </el-form-item> -->
						<!-- </div> -->
						<el-form-item label="End date">
							<!-- <el-date-picker
                v-if="backtestResult.historyValue === 22"
                v-model="backtestResult.end_date"
                type="date"
                placeholder="Please select a end date"
              >
              </el-date-picker> -->
							<el-input
								disabled
								v-model="backtestResult.end_date"
								placeholder="Please select a end date"
							>
							</el-input>
						</el-form-item>
					</el-col>
				</el-form>
				<!-- <div class="refresh" @click="refreshPage" title="Reset backtest">
					<svg
						t="1642066388852"
						class="icon"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="2121"
						width="110"
						height="110"
					>
						<path
							d="M849.2 637.1c-12.7-5.8-27.7-0.1-33.5 12.6-54 118.9-173.2 195.7-303.7 195.7-160.5 0-294.8-114-326.4-265.3l56.1 56.1c4.9 4.9 11.4 7.4 17.9 7.4 6.5 0 13-2.5 17.9-7.4 9.9-9.9 9.9-25.9 0-35.8L171.2 494.1c-1.2-1.2-2.5-2.2-3.9-3.2-0.6-0.4-1.3-0.7-1.9-1.1-0.8-0.4-1.6-0.9-2.4-1.3-0.8-0.3-1.7-0.5-2.5-0.8-0.7-0.2-1.4-0.5-2.2-0.7-1.6-0.3-3.1-0.5-4.7-0.5h-0.2-0.2c-1.6 0-3.2 0.2-4.7 0.5-0.8 0.2-1.5 0.4-2.2 0.7-0.8 0.2-1.7 0.4-2.5 0.8-0.9 0.4-1.6 0.8-2.4 1.3-0.6 0.4-1.3 0.6-1.9 1.1-2.8 1.9-5.2 4.2-7 7-0.4 0.6-0.7 1.3-1 1.9-0.4 0.8-0.9 1.6-1.3 2.4-0.3 0.8-0.5 1.7-0.8 2.6-0.2 0.7-0.5 1.4-0.6 2.2-0.3 1.6-0.5 3.3-0.5 5 0 211.7 172.3 384 384 384 150.3 0 287.6-88.5 349.8-225.4 5.5-12.7-0.1-27.7-12.9-33.5zM880.4 535.4c0.8-0.4 1.6-0.8 2.4-1.3 0.6-0.4 1.3-0.6 1.9-1.1 2.8-1.9 5.2-4.2 7-7 0.4-0.6 0.7-1.3 1-1.9 0.4-0.8 0.9-1.6 1.3-2.4 0.3-0.8 0.5-1.7 0.8-2.6 0.2-0.7 0.5-1.4 0.6-2.2 0.3-1.6 0.5-3.3 0.5-5 0-211.7-172.3-384-384-384-152.1 0-290.1 89.9-351.5 229.1-5.6 12.8 0.1 27.7 12.9 33.4 12.8 5.7 27.7-0.2 33.4-12.9C260.1 256.7 379.9 178.6 512 178.6c160.5 0 294.8 114 326.4 265.3l-56.1-56.1c-9.9-9.9-25.9-9.9-35.8 0-9.9 9.9-9.9 25.9 0 35.8L852.9 530c1.2 1.2 2.5 2.2 3.9 3.2 0.6 0.4 1.3 0.7 1.9 1.1 0.8 0.4 1.6 0.9 2.4 1.3 0.8 0.3 1.7 0.5 2.5 0.8 0.7 0.2 1.4 0.5 2.2 0.6 1.6 0.3 3.3 0.5 5 0.5 1.7 0 3.3-0.2 5-0.5 0.8-0.1 1.5-0.4 2.2-0.6 0.7-0.5 1.5-0.7 2.4-1z"
							p-id="2122"
							fill="#2372a0"
						></path>
					</svg>
				</div> -->
			</div>
		</el-row>
	</div>
</template>
<script>
import { timestampToTime } from '../../../tools/formatDate.js'
export default {
	props: {
		backtestResult: Object
	},
	data() {
		return {
			strategyFormdata: {},
			symbolList: [],
			indexList: [],
			options: [
				{
					value: 0,
					label: 'All In / All Out (CASH)'
				}
			],
			loading: false,
			value: 0
		}
	},
	created() {
		this.backtestResult.endDate = timestampToTime(new Date())
		const str = this.backtestResult.endDate.split('-')
		str[0] = Number(str[0]) - Number(this.backtestResult.historyValue) + ''
		this.backtestResult.starDate = str.join('-')
	},
	computed: {
		listSet() {
			return this.symbolList.map((item) => {
				return { value: `${item.stock}`, label: `${item.stock}` }
			})
		},
		indexSet() {
			return this.indexList.map((item) => {
				return { value: `${item.symbol}`, label: `${item.symbol}` }
			})
		}
	},
	methods: {
		refreshPage() {
			location.reload()
		},
		getEndDate(date) {
			this.backtestResult.endDate = date
			const endDate = timestampToTime(date)
			const str = endDate.split('-')
			str[0] = Number(str[0]) - Number(this.backtestResult.historyValue) + ''
			this.backtestResult.starDate = str.join('-')
		},
		getBacktestHistory(val) {
			this.backtestResult.historyValue = val
			if (val <= 20) {
				const str = this.backtestResult.endDate.split('-')
				str[0] = Number(str[0]) - Number(this.backtestResult.historyValue) + ''
				this.backtestResult.starDate = str.join('-')
			}
			if (val === 21) {
				this.backtestResult.starDate = ''
			}
		},
    getEndDate(date){
      this.backtestResult.endDate = date
      const endDate = timestampToTime(date)
      const str = endDate.split('-')
      str[0] = (Number(str[0]) - Number(this.backtestResult.historyValue)) + ''
      this.backtestResult.starDate = str.join('-')
    },
    getBacktestHistory(val) {
      this.backtestResult.historyValue = val
      if(val <= 20){
      const str = this.backtestResult.endDate.split('-')
      str[0] = (Number(str[0]) - Number(this.backtestResult.historyValue)) + ''
      this.backtestResult.starDate = str.join('-')}
      if(val === 21){
        this.backtestResult.starDate = ''
      }
    },
    getBacktestHistory(val) {
      this.backtestResult.historyValue = val
    },
    saveBacktest() {
      const vm = this
      const strategyFormData = {}
      strategyFormData.stock = vm.backtestResult.symbolName
      strategyFormData.name = vm.backtestResult.name
      strategyFormData.description = vm.backtestResult.description
      strategyFormData.note = 'my note'
      strategyFormData.cash = vm.backtestResult.startingCapital
      strategyFormData.commission = vm.backtestResult.commission
      strategyFormData.slippage = vm.backtestResult.slippage
      strategyFormData.riskfreerate = vm.backtestResult.slippage
      strategyFormData.fromdate = timestampToTime(vm.backtestResult.starDate)
      strategyFormData.todate = timestampToTime(vm.backtestResult.endDate)
      strategyFormData.status = 0
      strategyFormData.strategy = vm.strategyFormdata.id
      const params =  strategyFormData
            this.$http.post('/demo/backtest/',this.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then( res => {
        if(res.status === 201){
          this.$message.success({
          message: 'The save was successful',
          duration: 1000
        })
        this.$emit('goToBacktestFavoriteForm')
        }
      }).catch( error => { console.warn(error); })
    },
    async remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          await this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getStocks?=ABMD',
          {auth:{
            username: 'sentimentrader_backtest_api',
            password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
          }}
          ).then(res => {
            console.log(' remoteMethod1')
            this.symbolList = res.data
          }).catch(error => {
            console.warn(error);
          })

          await this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getIndexes',
          {auth:{
            username: 'sentimentrader_backtest_api',
            password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
          }}
          ).then(res => {
            console.log(' remoteMethod2')
            this.indexList = res.data
          }).catch(error => {
            console.warn(error);
          })

				setTimeout(() => {
					this.loading = false
					var symbolListTemp = this.listSet.filter((item) => {
						return (
							item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
							item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
						)
					})
					var IndexListTemp = this.indexSet.filter((item) => {
						return (
							item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
							item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
						)
					})
					this.options = symbolListTemp.concat(IndexListTemp)
				}, 200)
			} else {
				this.options = []
			}
		},
		setStrategyData(data) {
			this.strategyFormdata = data
		},
		getData() {
			const data = this.$store.state.favoriteBacktestRowData
			this.backtestId = data.id
			if (data.length !== 0) {
				this.backtestResult.name = data.name
				this.backtestResult.description = data.description
				this.backtestResult.symbolName = data.stock
				this.strategyFormdata = data.strategy
				this.backtestResult.startingCapital = data.cash
				this.backtestResult.commission = data.commission
				this.backtestResult.slippage = data.slippage
				this.backtestResult.starDate = data.start_date
				this.backtestResult.endDate = data.end_date
			}
		},
		clearResultData() {
			this.backtestResult.name = ''
			this.backtestResult.description = ''
			this.backtestResult.startingCapital = ''
			this.backtestResult.commission = ''
			this.backtestResult.slippage = ''
			this.backtestResult.backtestHistory = ''
			this.backtestResult.value = 0
			this.backtestResult.historyValue = 0
			this.backtestResult.starDate = ''
			this.backtestResult.endDate = ''
			this.backtestResult.symbolName = ''
		}
	}
}
</script>
<style lang="less" scoped>
.backtest_container {
	margin-top: 40px;
}
.backtest-result-container {
	padding-bottom: 1.25rem;
	margin-bottom: 4.25rem;
	border-bottom: 1px solid #6c6c6c;
}
.refresh {
	position: absolute;
	width: 110px;
	top: 55%;
	right: 15%;
	height: 110px;
	cursor: pointer;
}
.refresh:hover {
	opacity: 0.6;
}
.refresh:active {
	top: 1px;
}
</style>