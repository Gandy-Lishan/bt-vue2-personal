<template>
	<div class="tim-container">
		<p style="margin: 10px auto; position: relative;">
			The results below provide a multiple timeframe view of the backtest of the
			indicator and index that you have chosen. The 'Exit Criteria' selected for
			the backtest is not used for the results below. Instead, we provide a look
			at various time-frames from 1-Week to 1-Year of returns.
		</p>
			<el-button class="editWithCustomBtn" icon="el-icon-document-add" type="primary" plain size="mini" @click="showTableDialog" v-if="!showTable && activeTIM == 'second'">
				Edit exit with different TIM
			</el-button>
		<el-tabs v-model="activeTIM" type="card" v-loading="loading">
			<el-tab-pane label="Exit With Default Time-In-Market (Long-Term)" name="first">
				<div class="history-container">
						<template>
							<el-table
								:data="backtestHistoryList"
								:row-class-name="tableRowClassName"
								stripe
								border
								style="height: 100%; margin: 0 auto;"
							>
								<template v-for="(l, index) in defaultTableLabels">
									<el-table-column :label="l.replace('[%]', 'Later [%]')"  :prop="l" :key="index" align="center" :width="l == 'Entry Date' ? '125px' : '104px'">
										<template slot-scope="scope">
											<p class="tableText" :class="getCellStyle(scope.row[l])">
												{{ displayData(scope.row[l]) }}
											</p>
										</template>
									</el-table-column>
								</template>
								<div slot="empty" style="text-align: left">
									<el-empty image-size="80" description="No Data"></el-empty>
								</div>
							</el-table>
						</template>
					<hr style="height:2px;border:none;color:#333;background-color:#333;" class="hr">
					<div class="zscore-container">
							<template>
								<el-table
									:data="result_quotes"
									:show-header="false"
									stripe
									border
									style="height: 100%; margin: 0 auto"
								>
									<el-table-column prop="property" label="Property"  align="center" width="125px">
									</el-table-column>

									<template v-for="column in periods">
										<el-table-column
											:key="column.period"
											:label="column.period"
											:prop="column.period"
											align="center"
											width="104px"
										>
											<template slot-scope="scope">
												<p class="tableText" :class="getCellStyle(scope.row[column.period])">
													{{
														!Number.isNaN(scope.row[column.period])
															? typeof scope.row[column.period] == 'string'
																? scope.row[column.period]
																: parseFloat(scope.row[column.period]).toFixed(1)
															: null
													}}
												</p>
											</template>
										</el-table-column>
									</template>
								</el-table>
							</template>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="Exit With Default Time-In-Market (Short-Term)" name="third" v-if="rowFrequency === 'Daily'">
				<div class="history-container">
						<template>
							<el-table
								:data="backtestShortTermHistoryList"
								:row-class-name="tableRowClassName"
								stripe
								border
								style="height: 100%; margin: 0 auto;"
							>
								<template v-for="(l, index) in defaultShortTermTableLabels">
									<el-table-column :label="l.replace('[%]', 'Later [%]')"  :prop="l" :key="index" align="center" :width="l == 'Entry Date' ? '125px' : '104px'">
										<template slot-scope="scope">
											<p class="tableText" :class="getCellStyle(scope.row[l])">
												{{ displayData(scope.row[l]) }}
											</p>
										</template>
									</el-table-column>
								</template>
								<div slot="empty" style="text-align: left">
									<el-empty image-size="80" description="No Data"></el-empty>
								</div>
							</el-table>
						</template>
					<hr style="height:2px;border:none;color:#333;background-color:#333;" class="hr">
					<div class="zscore-container">
							<template>
								<el-table
									:data="result_shortTerm_quotes"
									:show-header="false"
									stripe
									border
									style="height: 100%; margin: 0 auto"
								>
									<el-table-column prop="property" label="Property"  align="center" width="125px">
									</el-table-column>

									<template v-for="column in periodsShortTerm">
										<el-table-column
											:key="column.period"
											:label="column.period"
											:prop="column.period"
											align="center"
											width="104px"
										>
											<template slot-scope="scope">
												<p class="tableText" :class="getCellStyle(scope.row[column.period])">
													{{
														!Number.isNaN(scope.row[column.period])
															? typeof scope.row[column.period] == 'string'
																? scope.row[column.period]
																: parseFloat(scope.row[column.period]).toFixed(1)
															: null
													}}
												</p>
											</template>
										</el-table-column>
									</template>
								</el-table>
							</template>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="Exit with Customized Time-In-Market" name="second">
				<div class="history-container">
						<template>
							<el-table
								:data="TIMHistoryList"
								stripe
								border
								style="height: 100%; margin: 0 auto"
							>
								<template v-for="(l, index) in defaultTIMTableLabels">
									<el-table-column :label="l.replace('[%]', 'Later [%]')" :prop="l" :key="index" align="center"  width="120px">
										<template slot-scope="scope">
											<p class="tableText" :class="getCellStyle(scope.row[l])">
												{{ displayData(scope.row[l]) }}
											</p>
										</template>
									</el-table-column>
								</template>
								<div slot="empty" style="text-align: left">
									<el-empty image-size="80" description="No Data"></el-empty>
								</div>
							</el-table>
						</template>
				<div class="zscore-container">
						<template>
							<el-table
								:data="TIMResult_quotes"
								:show-header="false"
								stripe
								border
								style="height: 100%; margin: 0 auto"
							>
								<el-table-column prop="property" label="Property" align="center" width="120px">
								</el-table-column>

								<template v-for="column in periodsTIM">
									<el-table-column
										:key="column.period"
										:label="column.period"
										:prop="column.period"
										align="center"
										width="120px"
									>
										<template slot-scope="scope">
											<p class="tableText" :class="getCellStyle(scope.row[column.period])">
												{{
													!Number.isNaN(scope.row[column.period])
														? typeof scope.row[column.period] == 'string'
															? scope.row[column.period]
															: parseFloat(scope.row[column.period]).toFixed(1)
														: null
												}}
											</p>
										</template>
									</el-table-column>
								</template>
							</el-table>
						</template>
				</div>
				</div>
				<el-dialog
					title="Edit exit with different TIM Table"
					:visible.sync="showTable"
					width="80%"
				>
					<div>
						<el-table
							:data="editTIMData"
							style="width: 100%"
							border
							ref="table"
						>
							<el-table-column
								type="index"
								label="Index"
								width="80"
								:header-align="'center'"
								:align="'center'"
							></el-table-column>
							<el-table-column
								label="Period"
								:header-align="'center'"
								:align="'center'"
							>
								<template slot-scope="scope">
									<el-input
										style="width: 100%"
										placeholder="input period"
										v-model="scope.row.period"
									></el-input>
								</template>
							</el-table-column>
							<el-table-column
								label="Timeframe"
								:header-align="'center'"
								:align="'center'"
							>
								<template slot-scope="scope">
									<el-select style="width: 100%" v-model="scope.row.timeframe">
										<!-- <el-option label="Day(s)" value="Day"></el-option>
                                        <el-option label="Week(s)" value="Week"></el-option>
                                        <el-option label="Month(s)" value="Month"></el-option> -->

										<el-option
											v-if="rowFrequency == 'Daily'"
											label="Day(s)"
											value="Day"
										></el-option>
										<el-option
											v-if="rowFrequency == 'Weekly' || rowFrequency == 'Daily'"
											label="Week(s)"
											value="Week"
										></el-option>
										<el-option
											v-if="
												rowFrequency == 'Monthly' ||
												rowFrequency == 'Daily' ||
												rowFrequency == 'Weekly'
											"
											label="Month(s)"
											value="Month"
										></el-option>
										<el-option
											v-if="
												rowFrequency == 'Monthly' || rowFrequency == 'Weekly'
											"
											label="Year(s)"
											value="Year"
										></el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column
								label="Delete"
								width="65"
								:header-align="'center'"
								:align="'center'"
							>
								<template slot-scope="scope">
									<el-button
										type="danger"
										icon="el-icon-delete"
										size="mini"
										@click="deleteRow(scope.$index)"
									></el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-button
							type="primary"
							icon="el-icon-plus"
							@click="addRow"
							style="margin-top: 10px"
							>Add Row</el-button
						>
					</div>
					<div slot="footer" class="dialog-footer">
						<el-button @click="cancelTable">Cancel</el-button>
						<el-button type="primary" @click="saveTable">Save</el-button>
					</div>
				</el-dialog>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import { setCustomTIM, getCustomTIM } from '@/service/service'
import { CIQ } from '@/components/common/chart/st-development/js'
import { formatStandardTime } from '@/utils'

export default {
	name: 'TIM',
	data() {
		return {
			// common states
			activeTIM: 'first',
			loading: false,
			start_date: null,

			//Exit With Default Time-In-Market/HistoryList
			backtestHistoryList: [],
			defaultTableLabels: [
				'Entry Date',
				'1 Month [%]',
				'2 Months [%]',
				'3 Months [%]',
				'4 Months [%]',
				'5 Months [%]',
				'6 Months [%]',
				'1 Year [%]'
			],
			//Exit With Default Time-In-Market/zscore-container
			result_quotes: [],
			periods: [],

			//Exit with Customized Time-In-Market/HistoryList
			TIMHistoryList: [],
			defaultTIMTableLabels: [],
			//Exit with Customized Time-In-Market/zscore-container
			TIMResult_quotes: [],
			periodsTIM: [],

			backtestShortTermHistoryList: [],
			defaultShortTermTableLabels: [
				'Entry Date',
				'1 Day [%]',
				'2 Days [%]',
				'3 Days [%]',
				'4 Days [%]',
				'1 Week [%]',
				'2 Weeks [%]',
				'3 Weeks [%]'
			],
			result_shortTerm_quotes: [],
			periodsShortTerm: [],

			//Dialog: edit table
			showTable: false,
			editTIMData: []
		}
	},
	props: {
				tradesData: Array,
				tradePrice: String,
				editBacktestID: String,
				rowFrequency: String
    },
	created() {},
	computed: {},
	watch: {},
	methods: {
		// Utility function to format an output
		displayData(data) {
			const numberRegex = /^-?\d+(\.\d+)?$/
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/

			if (numberRegex.test(data)) {
				return parseFloat(data).toFixed(1)
			} else if (dateRegex.test(data)) {
				return data
			} else {
				// 如果既不是数字也不是日期，则返回空字符串，即不显示"NAN"的数据
				return ''
			}
		},
        // 父组件getResultData时用清空本组件内常用数据
        clearData() {
            this.backtestHistoryList = []
						this.backtestShortTermHistoryList = []
						this.result_shortTerm_quotes = []
						this.periodsShortTerm = []
            this.TIMHistoryList = []
            this.TIMResult_quotes = []
            this.result_quotes = []
            this.periodsTIM = []
            this.periods = []
            this.activeTIM = 'first'
        },
		// Dialog: edit table
		showTableDialog() {
			this.showTable = true
		},
		deleteRow(index) {
			this.editTIMData.splice(index, 1)
			if (this.editTIMData.length === 0) {
				// this.editTIMData = []
				// // this.getAllDefaultTableLabels()
				// this.defaultTIMTableLabels = []
				// this.TIMHistoryList = []
				// this.TIMResult_quotes = []
				return
			}
		},
		addRow() {
			if (this.editTIMData.length >= 10) {
				this.popUpMsgBox('Cannot add more than 10 rows.')
				return
			}
			const frequency = this.rowFrequency
			console.log('frequency--------', frequency)
			let newRow = null
			switch (frequency) {
				case 'Daily':
					newRow = {
						period: '1',
						timeframe: 'Day'
					}
					break
				case 'Weekly':
					newRow = {
						period: '1',
						timeframe: 'Week'
					}
					break
				case 'Monthly':
					newRow = {
						period: '1',
						timeframe: 'Month'
					}
					break

				default:
					break
			}
			this.editTIMData.push(newRow)
		},
		cancelTable() {
			this.showTable = false
			// this.resetTable();
		},
		async saveTable() {
			this.showTable = false
			if (this.tradesData.length === 0) {
				this.popUpMsgBox('No computable trades.')
				return
			}
			// 如果row删除为空，其他数据也要清空
			if (this.editTIMData.length === 0) {
				this.editTIMData = []
				// this.getAllDefaultTableLabels()
				this.defaultTIMTableLabels = []
				this.TIMHistoryList = []
				this.TIMResult_quotes = []
			}
			const f1 = Array.isArray(this.editTIMData) && !this.editTIMData.length
			if (f1) {
				return
			}
			CIQ.addCover('Calculating...')
			CIQ.nprogress.start()
			try {
				const periodArray = this.getValues()
				const isValid = this.validateData(periodArray)
				if (!isValid) {
					CIQ.hideCover()
					CIQ.nprogress.done()
					return
				}
				const uniqueData = []
				periodArray.forEach((item) => {
					const isDuplicate = uniqueData.some(
						(uniqueItem) =>
							uniqueItem.period === item.period &&
							uniqueItem.timeframe === item.timeframe
					)

					if (!isDuplicate) {
						uniqueData.push(item)
					}
				})
				// 去重
				this.editTIMData = uniqueData
				const transformData = this.transformData(uniqueData)
				transformData.sort((a, b) => a.value - b.value)
				const table = ['Entry Date']
				transformData.map((item) => {
					table.push(item.timeframe)
				})
				this.defaultTIMTableLabels = table
				const data = this.calculateBacktestHistory(this.tradesData, uniqueData)
				this.$nextTick(() => {
					this.TIMHistoryList = data
				})
				this.calculateZScore(this.tradesData, uniqueData)
				//this.resetTable()
				const reqData = {
					backtest_id: this.editBacktestID,
					tim_data: uniqueData
				}
				const res = await setCustomTIM(reqData)
			} catch (error) {
				console.log(error)
			}
			CIQ.hideCover()
			CIQ.nprogress.done()
		},
        resetTable() {
            this.editTIMData = [
                { period: '1', timeframe: 'Week' },
                { period: '1', timeframe: 'Month' }
            ]
        },
        getValues() {
            return this.editTIMData.map(row => {
                return { period: row.period, timeframe: row.timeframe };
            });
        },
        // 校验table
        validateData(data) {
            for (const item of data) {
                if (item.timeframe === 'Day' || item.timeframe === 'Days') {
                const period = parseInt(item.period);
                if (isNaN(period) || period < 1 || period > 252 || !Number.isInteger(Number(item.period))) {
                    this.popUpMsgBox('When the Timeframe is selected as Day(s), only positive integers between 1 and 252 are allowed to be entered.');
                    return false;
                }
                }
                if (item.timeframe === 'Week' || item.timeframe === 'Weeks') {
                const period = parseInt(item.period);
                if (isNaN(period) || period < 1 || period > 52 || !Number.isInteger(Number(item.period))) {
                    this.popUpMsgBox('When the Timeframe is selected as Week(s), only positive integers between 1 and 52 are allowed to be entered.');
                    return false;
                }
                }
                if (item.timeframe === 'Month' || item.timeframe === 'Months') {
                const period = parseInt(item.period);
                if (isNaN(period) || period < 1 || period > 120 || !Number.isInteger(Number(item.period))) {
                    this.popUpMsgBox('When the Timeframe is selected as Month(s), only positive integers between 1 and 120 are allowed to be entered.');
                    return false;
                }
                }
            }
            return true;
        },
		// calculation functions
        async prepareData(rowID,datatime) {
            // 父组件getResultData时用tradeData计算其他常用数据
            // 这里可以父组件主动调用，或者在子组件监听this.tradesData
            const periodArray = this.getAllDefaultTableLabels()
            this.backtestHistoryList = this.calculateBacktestHistory(
                this.tradesData,
                periodArray
            )
						const shortTermPeriodArray = [
								{ period: 1, timeframe: 'Day' },
								{ period: 2, timeframe: 'Day' },
								{ period: 3, timeframe: 'Day' },
								{ period: 4, timeframe: 'Day' },
								{ period: 5, timeframe: 'Day' },
								{ period: 10, timeframe: 'Day' },
								{ period: 15, timeframe: 'Day' }
							]
						if(this.rowFrequency === 'Daily') {
							this.backtestShortTermHistoryList = this.calculateBacktestHistory(this.tradesData, shortTermPeriodArray)
						}
						console.log('backtestHistoryList', this.backtestHistoryList)
            const res = await getCustomTIM(rowID)
            let timPeriodArray = null
            try {
                timPeriodArray = JSON.parse(res.data[0].tim_data)
                let timeframe = this.rowFrequency
                if (timeframe === 'Weekly') {
                timPeriodArray = timPeriodArray.filter(item => item.timeframe !== 'Day');
                } else if (timeframe === 'Monthly') {
                timPeriodArray =  timPeriodArray.filter(item => item.timeframe !== 'Day' && item.timeframe !== 'Week');
                }
                this.editTIMData = timPeriodArray
            } catch (error) {
                console.error(error)
                timPeriodArray = this.editTIMData
            }
            const transformData = this.transformData(timPeriodArray)
            transformData.sort((a, b) => a.value - b.value);
            const table = ['Entry Date']
            transformData.map((item) => {
                table.push(item.timeframe)
            })
            this.defaultTIMTableLabels = table
            
            this.TIMHistoryList = this.calculateBacktestHistory(this.tradesData, timPeriodArray)
            // 2.1涓紩鍏ュ垎鏋愬笀鐨刏Score妯″潡
            
            this.start_date = formatStandardTime(datatime)
            this.activeTIM = 'second'
            this.calculateZScore(this.tradesData, timPeriodArray)
						if(this.rowFrequency === 'Daily') {
							this.activeTIM = 'third'
							this.calculateZScore(this.tradesData, shortTermPeriodArray)
						}
            this.activeTIM = 'first'
            this.calculateZScore(this.tradesData, periodArray)
        },

		getAllDefaultTableLabels() {
			let periodArray = [
				{ period: 1, timeframe: 'Month' },
				{ period: 2, timeframe: 'Month' },
				{ period: 3, timeframe: 'Month' },
				{ period: 4, timeframe: 'Month' },
				{ period: 5, timeframe: 'Month' },
				{ period: 6, timeframe: 'Month' },
				{ period: 1, timeframe: 'Year' }
			]
			const frequency = this.rowFrequency
			switch (frequency) {
				case 'Daily':
					this.defaultTableLabels = [
						'Entry Date',
						'1 Month [%]',
						'2 Months [%]',
						'3 Months [%]',
						'4 Months [%]',
						'5 Months [%]',
						'6 Months [%]',
						'1 Year [%]'
					]
					this.defaultTIMTableLabels = [
						'Entry Date',
						'1 Week [%]',
						'1 Month [%]'
					]
					this.editTIMData = [
						{
							period: '1',
							timeframe: 'Week'
						},
						{
							period: '1',
							timeframe: 'Month'
						}
					]
					break
				case 'Weekly':
					this.defaultTableLabels = [
						'Entry Date',
						'1 Week [%]',
						'2 Weeks [%]',
						'1 Month [%]',
						'2 Months [%]',
						'3 Months [%]',
						'6 Months [%]',
						'1 Year [%]'
					]
					periodArray = [
						{ period: 1, timeframe: 'Week' },
						{ period: 2, timeframe: 'Week' },
						{ period: 1, timeframe: 'Month' },
						{ period: 2, timeframe: 'Month' },
						{ period: 3, timeframe: 'Month' },
						{ period: 6, timeframe: 'Month' },
						{ period: 1, timeframe: 'Year' }
					]
					this.defaultTIMTableLabels = [
						'Entry Date',
						'1 Month [%]',
						'3 Months [%]'
					]
					this.editTIMData = [
						{
							period: '1',
							timeframe: 'Month'
						},
						{
							period: '3',
							timeframe: 'Month'
						}
					]
					break
				case 'Monthly':
					this.defaultTableLabels = [
						'Entry Date',
						'1 Month [%]',
						'3 Months [%]',
						'6 Months [%]',
						'9 Months [%]',
						'1 Year [%]',
						'2 Years [%]',
						'3 Years [%]'
					]
					periodArray = [
						{ period: 1, timeframe: 'Month' },
						{ period: 3, timeframe: 'Month' },
						{ period: 6, timeframe: 'Month' },
						{ period: 9, timeframe: 'Month' },
						{ period: 1, timeframe: 'Year' },
						{ period: 2, timeframe: 'Year' },
						{ period: 3, timeframe: 'Year' }
					]
					this.defaultTIMTableLabels = [
						'Entry Date',
						'6 Months [%]',
						'1 Year [%]'
					]
					this.editTIMData = [
						{
							period: '6',
							timeframe: 'Month'
						},
						{
							period: '1',
							timeframe: 'Year'
						}
					]
					break
				default:
					break
			}
			return periodArray
		},
		generate_table_data() {
			this.generatePeriods()
			if (this.activeTIM == 'first') {
				// 鎻愬彇灞炴€т俊鎭
				let keys = Object.keys(this.result_quotes[0])
				keys.splice(keys.indexOf('Period'), 1)
				let result = []
				for (let i = 0; i < keys.length; i++) {
					result.push({
						property: keys[i]
					})
				}
				// 灏Periods 淇℃伅鎻掑叆鍒data 涓紝灏data 缁戝畾鍒table 涓
				for (let i = 0; i < this.periods.length; i++) {
					for (let j = 0; j < result.length; j++) {
						this.result_quotes.forEach((obj) => {
							if (obj.Period === this.periods[i].period) {
								result[j][this.periods[i].period] = obj[result[j].property]
							}
						})
					}
				}
				this.result_quotes = result
			} else if(this.activeTIM == 'second') {
				// 鎻愬彇灞炴€т俊鎭
				let keys = Object.keys(this.TIMResult_quotes[0])
				keys.splice(keys.indexOf('Period'), 1)
				let result = []
				for (let i = 0; i < keys.length; i++) {
					result.push({
						property: keys[i]
					})
				}
				// 灏Periods 淇℃伅鎻掑叆鍒data 涓紝灏data 缁戝畾鍒table 涓
				console.log('this.periodsTIM', this.periodsTIM, this.TIMResult_quotes)
				for (let i = 0; i < this.periodsTIM.length; i++) {
					for (let j = 0; j < result.length; j++) {
						this.TIMResult_quotes.forEach((obj) => {
							if (obj.Period === this.periodsTIM[i].period) {
								result[j][this.periodsTIM[i].period] = obj[result[j].property]
							}
						})
					}
				}
				this.TIMResult_quotes = result
			} else if(this.activeTIM == 'third') {
				// 鎻愬彇灞炴€т俊鎭
				let keys = Object.keys(this.result_shortTerm_quotes[0])
						keys.splice(keys.indexOf('Period'), 1)
						let result = []
						for (let i = 0; i < keys.length; i++) {
							result.push({
								property: keys[i]
							})
						}
						// 灏Periods 淇℃伅鎻掑叆鍒data 涓紝灏data 缁戝畾鍒table 涓
						console.log('this.periodsShortTerm', this.periodsShortTerm, this.result_shortTerm_quotes)
						for (let i = 0; i < this.periodsShortTerm.length; i++) {
							for (let j = 0; j < result.length; j++) {
								this.result_shortTerm_quotes.forEach((obj) => {
									if (obj.Period === this.periodsShortTerm[i].period) {
										result[j][this.periodsShortTerm[i].period] = obj[result[j].property]
									}
								})
							}
						}
						this.result_shortTerm_quotes = result
			}
		},
		generatePeriods() {
			let quotes = []
			if (this.activeTIM == 'first') {
				quotes = this.result_quotes
				let set = new Set()
				for (let i = 0; i < quotes.length; i++) {
					set.add(quotes[i].Period)
				}
				let values = Array.from(set)
				let columns = []
				for (let i = 0; i < values.length; i++) {
					columns.push({
						period: values[i]
					})
				}
				this.periods = columns
			} else if(this.activeTIM == 'second') {
				quotes = this.TIMResult_quotes
				// 去重
				let set = new Set()
				for (let i = 0; i < quotes.length; i++) {
					set.add(quotes[i].Period)
				}
				let values = Array.from(set)
				// 为label排序
				values = this.transformDate(values)
				values.sort((a, b) => a.value - b.value)
				values = values.map((x) => x.label)
				let columns = []
				for (let i = 0; i < values.length; i++) {
					columns.push({
						period: values[i]
					})
				}
				this.periodsTIM = columns
			} else if(this.activeTIM == 'third') {
				quotes = this.result_shortTerm_quotes
				// 去重
				let set = new Set()
				for (let i = 0; i < quotes.length; i++) {
					set.add(quotes[i].Period)
				}
				let values = Array.from(set)
				// 为label排序
				values = this.transformDate(values)
				values.sort((a, b) => a.value - b.value)
				values = values.map((x) => x.label)
				let columns = []
				for (let i = 0; i < values.length; i++) {
					columns.push({
						period: values[i]
					})
				}
				this.periodsShortTerm = columns
			}
		},
		transformDate(arr) {
			// 创建一个空对象，用于存储处理后的结果
			let processeArray = []

			// 遍历原始数组
			for (let i = 0; i < arr.length; i++) {
				let currentItem = arr[i]

				// 将当前项拆分成数字和单位
				let parts = currentItem.split(' ')
				let value = parseInt(parts[0])
				let unit = parts[1]

				// 将不同天数的项进行合并，根据比率转换
				if (unit === 'Days') {
					if (value % 252 === 0) {
						value = value / 252
						unit = value == 1 ? 'Year' : 'Years'
					}
					if (value % 21 === 0) {
						value = value / 21
						unit = value == 1 ? 'Month' : 'Months'
					}
					// if (value % 5 === 0) {
					//   value = value / 5;
					//   unit = value==1?"Week":"Weeks";
					// }
				}
				if (unit === 'Weeks') {
					if (value % 52 === 0) {
						value = value / 52
						unit = value == 1 ? 'Year' : 'Years'
					}
					// if (value % 4 === 0) {
					//   value = value / 4;
					//   unit = value==1?"Month":"Months";
					// }
				}
				if (unit === 'Months') {
					if (value % 12 === 0) {
						value = value / 12
						unit = value == 1 ? 'Year' : 'Years'
					}
				}
				if (this.rowFrequency === 'Daily') {
					if (unit === 'Days') {
						if (value % 5 === 0) {
							value = value / 5
							unit = value == 1 ? 'Week' : 'Weeks'
						}
						if (value % 13 === 0 && unit.includes('Week')) {
							value = (value / 13) * 3
							unit = value == 1 ? 'Month' : 'Months'
						}
						if (value % 12 === 0 && unit.includes('Month')) {
							value = value / 12
							unit = value == 1 ? 'Year' : 'Years'
						}
					} else if (unit === 'Weeks') {
						if (value % 13 === 0) {
							value = (value / 13) * 3
							unit = value == 1 ? 'Month' : 'Months'
						}
						if (value % 12 === 0 && unit.includes('Month')) {
							value = value / 12
							unit = value == 1 ? 'Year' : 'Years'
						}
					} else if (unit === 'Months') {
						if (value % 12 === 0) {
							value = value / 12
							unit = value == 1 ? 'Year' : 'Years'
						}
					}
				} else if (this.rowFrequency === 'Weekly') {
					if (unit === 'Week') {
						// if(value % 4 === 0 && value <= 8) {
						//   value = value / 4;
						//   unit = value==1?"Month":"Months"
						// }else if(value % 13 === 0 && value > 8) {
						//   value = (value / 13) * 3;
						//   unit = value==1?"Month":"Months"
						// }
						if ((value % 13) % 4 === 0) {
							if (value % 13 === 12) {
								// 不转
								unit = value == 1 ? 'Week' : 'Weeks'
							} else {
								let num = Math.trunc(value / 13)
								let end = (value % 13) / 4
								value = num * 3 + end
								unit = value == 1 ? 'Month' : 'Months'
							}
						}
						if (value % 12 === 0 && unit.includes('Month')) {
							value = value / 12
							unit = value == 1 ? 'Year' : 'Years'
						}
					} else if (unit === 'Month') {
						if (value % 12 === 0) {
							value = value / 12
							unit = value == 1 ? 'Year' : 'Years'
						}
					}
				} else if (this.rowFrequency === 'Monthly') {
					if (unit === 'Month') {
						if (value % 12 === 0) {
							value = value / 12
						}
					}
				}

				// 生成新的项
				let newItem = value + ' ' + unit

				// 将新的项添加到 processedObj，使用项作为键名
				let res
				switch (unit) {
					case 'Days':
						res = 1 * value
						break
					case 'Day':
						res = 1 * value
						break
					case 'Weeks':
						res = 5 * value
						break
					case 'Week':
						res = 5 * value
						break
					case 'Months':
						res = 21 * value
						break
					case 'Month':
						res = 21 * value
						break
					case 'Years':
						res = 252 * value
						break
					case 'Year':
						res = 252 * value
						break
					default:
						break
				}
				if (processeArray.map((x) => x.label).indexOf(newItem) == -1)
					processeArray.push({ label: newItem, value: res })
				//processedObj[newItem] = res;
			}
			return processeArray
		},
		transformData(data) {
			//console.log('trnasformData', data)
			data = data.map((item) => {
				if (item.period % 252 === 0 && item.timeframe === 'Day') {
					return { period: item.period / 252, timeframe: 'Year' }
				}
				if (item.period % 21 === 0 && item.timeframe === 'Day') {
					return { period: item.period / 21, timeframe: 'Month' }
				}
				// if (item.period % 5 === 0 && item.timeframe === 'Day') {
				//   return { period: item.period / 5, timeframe: 'Week' }
				// }
				if (item.period % 52 === 0 && item.timeframe === 'Week') {
					return { period: item.period / 52, timeframe: 'Year' }
				}
				// if (item.period % 4 === 0 && item.timeframe === 'Week') {
				//   return { period: item.period / 4, timeframe: 'Month' }
				// }
				if (item.period % 12 === 0 && item.timeframe === 'Month') {
					return { period: item.period / 12, timeframe: 'Year' }
				}
				return item
			})

			// 更正一直判断到 Year
			data = data.map((item) => {
				let period = item.period
				let timeframe = item.timeframe
				if (this.rowFrequency === 'Daily') {
					if (timeframe === 'Day') {
						if (period % 5 === 0) {
							period = period / 5
							timeframe = 'Week'
						}
						if (period % 13 === 0 && timeframe.includes('Week')) {
							period = (period / 13) * 3
							timeframe = 'Month'
						}
						if (period % 12 === 0 && timeframe.includes('Month')) {
							period = period / 12
							timeframe = 'Year'
						}
					} else if (timeframe === 'Week') {
						if (period % 13 === 0) {
							period = (period / 13) * 3
							timeframe = 'Month'
						}
						if (period % 12 === 0 && timeframe.includes('Month')) {
							period = period / 12
							timeframe = 'Year'
						}
					} else if (timeframe === 'Month') {
						if (period % 12 === 0) {
							period = period / 12
							timeframe = 'Year'
						}
					}
					return { period, timeframe }
				} else if (this.rowFrequency === 'Weekly') {
					if (timeframe === 'Week') {
						// if(period % 4 === 0 && period <= 8) {
						//   period = period / 4;
						//   timeframe = 'Month';
						// }else if(period % 13 === 0 && period > 8) {
						//   period = (period / 13) * 3;
						//   timeframe = 'Month';
						// }
						if ((period % 13) % 4 === 0) {
							if (period % 13 === 12) {
								// 不转
								timeframe = 'Week'
							} else {
								let num = Math.trunc(period / 13)
								let end = (period % 13) / 4
								period = num * 3 + end
								timeframe = 'Month'
							}
						}
						if (period % 12 === 0 && timeframe.includes('Month')) {
							period = period / 12
							timeframe = 'Year'
						}
					} else if (timeframe === 'Month') {
						if (period % 12 === 0) {
							period = period / 12
							timeframe = 'Year'
						}
					}
					return { period, timeframe }
				} else if (this.rowFrequency === 'Monthly') {
					if (timeframe === 'Month') {
						if (period % 12 === 0) {
							period = period / 12
						}
					}
					return { period, timeframe }
				}
			})
			const uniqueData = []
			data.forEach((item) => {
				const isDuplicate = uniqueData.some(
					(uniqueItem) =>
						uniqueItem.period == item.period &&
						uniqueItem.timeframe == item.timeframe
				)

				if (!isDuplicate) {
					uniqueData.push(item)
				}
			})
			/* 
      1month = 1Bar, 3Month = 3 Bars, 6Months=6Bars, 9Months = 9 Bars, 1year = 12Bars, 2 years = 24 Bars, 3years = 36Bars.
      */
			const frequency = this.rowFrequency
			return uniqueData.map((item) => {
				let timeframe =
					item.period > 1
						? `${item.period} ${item.timeframe}s [%]`
						: `${item.period} ${item.timeframe} [%]`
				let value
				if (frequency == 'Daily') {
					switch (item.timeframe) {
						case 'Day':
							value = Number(item.period)
							break
						case 'Week':
							value = Number(item.period) * 5
							break
						case 'Month':
							value = Number(item.period) * 21
							break
						case 'Year':
							value = Number(item.period) * 252
							break
						default:
							break
					}
				} else if (frequency == 'Weekly') {
					switch (item.timeframe) {
						case 'Week':
							value = Number(item.period)
							break
						case 'Month':
							const period = Number(item.period)
							let num_3 = null
							num_3 = Math.trunc(period / 3) // 去除小数点取整数
							let end_3 = period % 3 // 余数
							// value = num_3 === null ? period * 4 : period * 4 + num_3
							value = num_3 * 13 + end_3 * 4
							break
						case 'Year':
							value = Number(item.period) * 52
							break
						default:
							break
					}
				} else if (frequency == 'Monthly') {
					switch (item.timeframe) {
						case 'Month':
							value = Number(item.period)
							break
						case 'Year':
							value = Number(item.period) * 12
							break
						default:
							break
					}
				}
				return { timeframe, period: item.period, value }
			})
		},
		calculateBacktestHistory(dataSet, periodArray) {
			/*
      periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
      */
			let chartDataset = CIQ.stxx.chart.dataSet
			const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
			const field = this.tradePrice
			// dataSet = dataSet.filter((item) => item.TradeStatus == 'BUY')
			dataSet = dataSet.filter((_, index) => index % 2 === 0)
			let backtestResult = []
			let noFound = []

			for (let data in dataSet) {
				let entryDate = formatStandardTime(dataSet[data].Date)

				let res = chartDataset.findIndex((x) => {
					return entryDate.getTime() == x.DT.getTime()
				})
				if(res == -1) {noFound.push(dataSet[data].Date)}
				if (res != -1) {
					//鎷胯繘鍦轰环鏍煎拰鍓嶄竴澶╀綔姣旇緝
					let entryPrice = chartDataset[res][field]
					const transformData = this.transformData(periodArray)
					transformData.sort((a, b) => a.value - b.value)
					let obj = {}
					transformData.map((item) => {
						let exitBar = chartDataset[res + item.value]
							? (
									((direction == 'Short'
										? entryPrice - chartDataset[res + item.value][field]
										: chartDataset[res + item.value][field] - entryPrice) /
										entryPrice) *
									100
							  ).toFixed(2)
							: ''
						obj[item.timeframe] = exitBar
					})
					backtestResult.push({ 'Entry Date': dataSet[data].Date, ...obj })
				}
			}
			console.log('找不到的日期', noFound)
			return backtestResult
		},
		transformZScoreData(data) {
			data = data.map((item) => {
				if (item.period % 252 === 0 && item.timeframe === 'Day') {
					return { period: item.period / 252, timeframe: 'Year' }
				}
				if (item.period % 21 === 0 && item.timeframe === 'Day') {
					return { period: item.period / 21, timeframe: 'Month' }
				}
				// if (item.period % 5 === 0 && item.timeframe === 'Day') {
				//   return { period: item.period / 5, timeframe: 'Week' }
				// }
				if (item.period % 52 === 0 && item.timeframe === 'Week') {
					return { period: item.period / 52, timeframe: 'Year' }
				}
				// if (item.period % 4 === 0 && item.timeframe === 'Week') {
				//   return { period: item.period / 4, timeframe: 'Month' }
				// }
				if (item.period % 12 === 0 && item.timeframe === 'Month') {
					return { period: item.period / 12, timeframe: 'Year' }
				}
				return item
			})
			data = data.map((item) => {
				let period = item.period
				let timeframe = item.timeframe
				if (this.rowFrequency === 'Daily') {
					if (timeframe === 'Day') {
						if (period % 5 === 0) {
							period = period / 5
							timeframe = 'Week'
						}
						if (period % 13 === 0 && timeframe.includes('Week')) {
							period = (period / 13) * 3
							timeframe = 'Month'
						}
						if (period % 12 === 0 && timeframe.includes('Month')) {
							period = period / 12
							timeframe = 'Year'
						}
					} else if (timeframe === 'Week') {
						if (period % 13 === 0) {
							period = (period / 13) * 3
							timeframe = 'Month'
						}
						if (period % 12 === 0 && timeframe.includes('Month')) {
							period = period / 12
							timeframe = 'Year'
						}
					} else if (timeframe === 'Month') {
						if (period % 12 === 0) {
							period = period / 12
							timeframe = 'Year'
						}
					}
					return { period, timeframe }
				} else if (this.rowFrequency === 'Weekly') {
					if (timeframe === 'Week') {
						// if(period % 4 === 0 && period <= 8) {
						//   period = period / 4;
						//   timeframe = 'Month';
						// }else if(period % 13 === 0 && period > 8) {
						//   period = (period / 13) * 3;
						//   timeframe = 'Month';
						// }
						if ((period % 13) % 4 === 0) {
							if (period % 13 === 12) {
								// 不转
								period = period
								timeframe = 'Week'
							} else {
								let num = Math.trunc(period / 13)
								let end = (period % 13) / 4
								period = num * 3 + end
								timeframe = 'Month'
							}
						}
						if (period % 12 === 0 && timeframe.includes('Month')) {
							period = period / 12
							timeframe = 'Year'
						}
					} else if (timeframe === 'Month') {
						if (period % 12 === 0) {
							period = period / 12
							timeframe = 'Year'
						}
					}
					return { period, timeframe }
				} else if (this.rowFrequency === 'Monthly') {
					if (timeframe === 'Month') {
						if (period % 12 === 0) {
							period = period / 12
						}
					}
					return { period, timeframe }
				}
			})
			return data.map((item) => {
				let timeframe =
					item.period > 1
						? `${item.period} ${item.timeframe}s`
						: `${item.period} ${item.timeframe}`
				let value
				const frequency = this.rowFrequency
				if (frequency == 'Daily') {
					switch (item.timeframe) {
						case 'Day':
							value = Number(item.period)
							break
						case 'Week':
							value = Number(item.period) * 5
							break
						case 'Month':
							value = Number(item.period) * 21
							break
						case 'Year':
							value = Number(item.period) * 252
							break
						default:
							break
					}
				} else if (frequency == 'Weekly') {
					switch (item.timeframe) {
						case 'Week':
							value = Number(item.period)
							break
						case 'Month':
							const period = Number(item.period)
							// if(period % 3 == 0) {
							//   num_3 = Math.trunc(period / 3) // 去除小数点取整数
							// }
							// value = num_3 === null ? period * 4 : period * 4 + num_3
							let num_3 = null
							num_3 = Math.trunc(period / 3) // 去除小数点取整数
							let end_3 = period % 3 // 余数
							// value = num_3 === null ? period * 4 : period * 4 + num_3
							value = num_3 * 13 + end_3 * 4
							break
						case 'Year':
							value = Number(item.period) * 52
							break
						default:
							break
					}
				} else if (frequency == 'Monthly') {
					switch (item.timeframe) {
						case 'Month':
							value = Number(item.period)
							break
						case 'Year':
							value = Number(item.period) * 12
							break
						default:
							break
					}
				}

				return { timeframe, period: item.period, value }
			})
		},
		calculateZScore(dataSet, periodArray) {
			/*
      periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
      */
			// masterData涓嶅寘鍚玦ndicator value,闃叉鏃爋hlcv鐨勬儏鍐
			let period_dict = this.transformZScoreData(periodArray)
			let quotes = CIQ.stxx.chart.masterData
			const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
			for (let i in period_dict) {
				quotes = this.generate_period_data(
					period_dict[i].timeframe,
					quotes,
					period_dict[i].value,
					direction
				)
			}
			// 鏁版嵁鍒囩墖
			quotes = quotes.filter((x) => {
				return this.start_date.getTime() <= x.DT.getTime()
			})
			//鎶婁氦鏄撳垪琛ㄨ浆鎹㈡垚鏃堕棿鎴
			let dataTimeList = []
			for (let data in dataSet) {
				if(direction === 'Long') {
					if (dataSet[data].TradeStatus != 'BUY') continue
				}else if(direction === 'Short') {
					if (dataSet[data].TradeStatus != 'SELL') continue
				}
				let entryDate = formatStandardTime(dataSet[data].Date).getTime()
				dataTimeList.push(entryDate)
			}
			let used_quotes = quotes.filter(
				(x) => dataTimeList.indexOf(x.DT.getTime()) != -1
			)
			//鏇挎崲NaN
			quotes = quotes.map((quote) => {
				const updatedQuote = {}
				for (const [key, value] of Object.entries(quote)) {
					updatedQuote[key] = isNaN(value) ? -100 : value
				}
				return updatedQuote
			})

			let median_list = [],
				positive_list = [],
				max_loss_list = [],
				max_gain_list = [],
				z_score_list = [],
				temp_mean_list = []
			for (let i in period_dict) {
				let temp_median = this.calculate_median(
					used_quotes.map((obj) => obj[period_dict[i].timeframe])
				)
				median_list.push(temp_median.toFixed(1))
				positive_list.push(
					this.calculate_win_rate(
						used_quotes.map((obj) => obj[period_dict[i].timeframe])
					)
				)
				if (direction == 'Short') {
					max_loss_list.push(
						this.calculate_mean(
							used_quotes.map((obj) => obj['MaxGain' + period_dict[i].value])
						)
					)
					max_gain_list.push(
						this.calculate_mean(
							used_quotes.map((obj) => obj['MaxLoss' + period_dict[i].value])
						)
					)
				} else {
					max_loss_list.push(
						this.calculate_mean(
							used_quotes.map((obj) => obj['MaxLoss' + period_dict[i].value])
						)
					)
					max_gain_list.push(
						this.calculate_mean(
							used_quotes.map((obj) => obj['MaxGain' + period_dict[i].value])
						)
					)
				}

				let temp_std = this.calculate_std(
					used_quotes.map((obj) => obj[period_dict[i].timeframe])
				)
				let temp_mean = this.calculate_mean(
					used_quotes.map((obj) => obj[period_dict[i].timeframe])
				)
				const _temp_mean = parseFloat(temp_mean.toFixed(1))
				temp_mean_list.push(_temp_mean)
				const sqrt_length = used_quotes.map((obj) => obj[period_dict[i].timeframe]).filter(e => !isNaN(e)).length
				z_score_list.push(
					parseFloat(
						(
							(temp_median - temp_mean) /
							(temp_std / Math.sqrt(sqrt_length))
						).toFixed(1)
					)
				)
			}
			const res = period_dict.map((val, i) => 
				{
					const Positive = isNaN(positive_list[i]) ? '' : Math.round(positive_list[i] * 100) + '%'
					let AvgMaxLoss = !median_list[i] && median_list[i] != 0 ? '' : max_loss_list[i].toFixed(1)
					let AvgMaxGain = !median_list[i] && median_list[i] != 0 ? '' : max_gain_list[i].toFixed(1)
					// 如果为字符串类型，先转换为数字；注意要排除 NaN 的情况
					if (direction === 'Short' && !isNaN(AvgMaxLoss)) {
						AvgMaxLoss = -parseFloat(AvgMaxLoss);
					}
					if (direction === 'Short' && !isNaN(AvgMaxGain)) {
						AvgMaxGain = -parseFloat(AvgMaxGain);
					}
					return {
						Period: val['timeframe'],
					'Mean': temp_mean_list[i],
					Median: isNaN(median_list[i]) ? '' : median_list[i],
					'% Positive': Positive,
					'Avg Max Loss': AvgMaxLoss,
					'Avg Max Gain': AvgMaxGain,
					'Z-Score': z_score_list[i]
					}
			})
			if (this.activeTIM == 'first') {
				this.result_quotes = res
			} else if(this.activeTIM == 'second') {
				// 重命名periods属性，和上方表格label一致
				this.TIMResult_quotes = res
				// 去重
				// 使用一个 Map 来辅助去重
				const map = new Map()

				// 遍历 data 数组
				this.TIMResult_quotes.forEach((item) => {
					// 将 name 作为键，如果之前没有存储过该 name，则将整个对象存储到 Map 中
					if (!map.has(item.Period)) {
						map.set(item.Period, item)
					}
				})

				// 使用 Array.from 将 Map 转换回数组
				this.TIMResult_quotes = Array.from(map.values())

				let TIMResult_quotes_periods = this.TIMResult_quotes.map(
					(x) => x.Period
				)
				TIMResult_quotes_periods = this.transformDate(TIMResult_quotes_periods)
				TIMResult_quotes_periods = TIMResult_quotes_periods.map((x) => x.label)

				this.TIMResult_quotes = this.TIMResult_quotes.map((obj, index) => {
					if (TIMResult_quotes_periods.includes(obj.Period)) {
						return obj
					} else {
						return null
					}
				})
				this.TIMResult_quotes = this.TIMResult_quotes.filter(
					(item) => item != null
				)
			} else if(this.activeTIM == 'third') {
				this.result_shortTerm_quotes = res
			}
			this.generate_table_data()
		},
		calculate_std(arr) {
			arr = arr.filter(function (x) {
				return !isNaN(x) // 鍓旈櫎NaN鍊約
			})
			if (arr.length == 0) return NaN

			const mean =
				arr.reduce(function (a, b) {
					return a + b
				}) / arr.length // 璁＄畻骞冲潎鏁
			const deviationArr = arr.map(function (x) {
				return Math.pow(x - mean, 2)
			})

			const variance =
				deviationArr.reduce(function (a, b) {
					return a + b
				}) /
				(deviationArr.length - 1) // 璁＄畻鏂瑰樊锛屼娇鐢ㄨ嚜鐢卞害=1

			const std = Math.sqrt(variance) // 璁＄畻鏍囧噯宸
			return std
		},
		calculate_win_rate(arr) {
			arr = arr.filter(function (x) {
				return !isNaN(x) // 鍓旈櫎NaN鍊約
			})
			if (arr.length == 0) return NaN

			let return_series = arr.map((x) => (parseFloat(x) > 0 ? 1 : 0))
			return parseFloat(this.calculate_mean(return_series).toFixed(2))
		},
		calculate_mean(arr) {
			arr = arr.filter(function (x) {
					return !isNaN(x) // 鍓旈櫎NaN鍊約
			})
			if (arr.length == 0) return NaN
			return arr.reduce((a, b) => a + b) / arr.length
		},
		calculate_median(arr) {
			arr = arr.filter((n) => !isNaN(n))
			if (arr.length == 0) return NaN
			const mid = Math.floor(arr.length / 2)
			const nums = [...arr].sort((a, b) => a - b)
			return parseFloat(
				(arr.length % 2 !== 0
					? nums[mid]
					: (nums[mid - 1] + nums[mid]) / 2
				)
			)
		},
		generate_period_data(name, quotes, period, direction) {
			const field = this.tradePrice
			quotes = quotes.map((row, i) => {
				if (i < quotes.length - period) {
					//const change = parseFloat((100 * (quotes[i + period][field] / row[field] - 1)).toFixed(1))
					const change = parseFloat(
						(
							((direction == 'Short'
								? row[field] - quotes[i + period][field]
								: quotes[i + period][field] - row[field]) /
								row[field]) *
							100
						)
					)
					return {
						...row,
						[field + period]: quotes[i + period][field],
						[name]: change == Infinity || change == -Infinity ? 0 : change
					}
				} else {
					return {
						...row,
						[field + period]: NaN,
						[name]: NaN
					}
				}
			})
			const minCloseArr = this.get_period_parm(
				quotes.map((row) => row[field + period]),
				'min',
				period
			)
			const maxCloseArr = this.get_period_parm(
				quotes.map((row) => row[field + period]),
				'max',
				period
			)
			quotes = quotes.map((row, i) => {
				if (i >= period) {
					const change = parseFloat(
						(100 * (minCloseArr[i] / row[field] - 1))
					)
					return {
						...row,
						['MaxLoss' + period]:
							change == Infinity || change == -Infinity ? 0 : change
					}
				} else {
					return {
						...row,
						['MaxLoss' + period]: NaN
					}
				}
			})
			quotes = quotes.map((row, i) => {
				if (i >= period) {
					const change = parseFloat(
						(100 * (maxCloseArr[i] / row[field] - 1))
					)
					return {
						...row,
						['MaxGain' + period]:
							change == Infinity || change == -Infinity ? 0 : change
					}
				} else {
					return {
						...row,
						['MaxGain' + period]: NaN
					}
				}
			})

			return quotes
		},
		get_period_parm(dataSeries, paramType, period) {
			const typeDict = {
				max: Math.max,
				min: Math.min,
				mean: (arr) => arr.reduce((a, b) => a + b) / arr.length,
				sum: (arr) => arr.reduce((a, b) => a + b)
			}

			const dataArr = []

			for (let i = 0; i < dataSeries.length; i++) {
				if (i >= period) {
					const tmpData = typeDict[paramType](
						...dataSeries.slice(i - period, i).filter((n) => !isNaN(n))
					)
					dataArr.push(Number(tmpData.toFixed(3)))
				} else {
					dataArr.push(NaN)
				}
			}
			return dataArr
		},
		 getCellStyle(value) {
      // Check if the value is negative and return a class name accordingly
      return {
        'negative-value': value < 0,
      };
			},
			tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'darken-row';
			}
			return '';
		},
		exportData() {
			return {
				backtestHistoryList: this.backtestHistoryList, 
				backtestShortTermHistoryList: this.backtestShortTermHistoryList, 
				TIMHistoryList: this.TIMHistoryList, 
				result_quotes: this.result_quotes, 
				TIMResult_quotes: this.TIMResult_quotes, 
				result_shortTerm_quotes: this.result_shortTerm_quotes,
				periodsTIM: this.periodsTIM, 
				periodsShortTerm: this.periodsShortTerm, 
				periods: this.periods, 
				defaultTIMTableLabels: this.defaultTIMTableLabels, 
				defaultTableLabels: this.defaultTableLabels, 
				defaultShortTermTableLabels: this.defaultShortTermTableLabels
			};
		}
	}
}
</script>

<style lang="less" scoped>
.darken-row {
	background-color: #f9f9f9;
}
.editWithCustomBtn{
    z-index: 999;
    position: absolute;
    top: 100px;
		right: 5px;
}
.history-container, .zscore-container, .hr {
	margin: 0 auto;
	width: 855px;
}
@media (max-width: 1200px) {
	.history-container, .zscore-container, .hr {
		width: unset;
	}
	.editWithCustomBtn{
		position: static;
		margin-bottom: 10px;
	}
}
</style>