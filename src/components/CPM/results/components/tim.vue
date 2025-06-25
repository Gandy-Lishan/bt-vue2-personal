<template>
  <div class="CPM-TIM-Contianer">
    <div class="CPM-header">
      <p>
        The results below provide a multiple timeframe view of the backtest of the indicator 
        and index that you have chosen. The 'observation period' selected for the backtest 
        is not used for the results below. Instead, we provide a look at various time-frames 
        from 1-Week to 1-Year of returns. 
      </p>
    </div>
      <div class="CPM-TIM">
      <el-skeleton :rows="2" :loading="loading" animated>
        <template>
          <el-table
            :data="result_quotes"
            :show-header="false"
            stripe
            border
            style="height: 100%; margin: 0 auto"
						class="CPM-ZScore"
          >
            <el-table-column prop="property" label="Property"  align="center" width="120px">
            </el-table-column>

            <template v-for="column in periods">
              <el-table-column
                :key="column.period"
                :label="column.period"
                :prop="column.period"
                align="center"
								width="110px"
              >
                <template slot-scope="scope">
                  <span class="tableText" :class="getCellStyle(scope.row[column.period])">
                    {{
                      !Number.isNaN(scope.row[column.period])
                        ? typeof scope.row[column.period] == 'string'
                          ? scope.row[column.period]
                          : parseFloat(scope.row[column.period]).toFixed(1)
                        : null
                    }}
                  </span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </template>
      </el-skeleton>
    	</div>
    <hr style="height:2px;border:none;color:#333;background-color:#333;width: 880px;">
    <div class="CPM-TIM">
      <el-skeleton :rows="6" :loading="loading" animated>
        <template>
          <el-table
            :data="backtestHistoryList"
            :row-class-name="tableRowClassName"
            stripe
            border
						class="CPM-TIM-Table"
            style="height: 100%; margin: 0 auto"
          >
            <template v-for="(l, index) in defaultTableLabels">
              <el-table-column :label="l.replace('[%]', 'Later [%]')" :prop="l" :key="index" align="center" :width="l === 'Entry Date' ? '120px' : '110px'">
                <template slot-scope="scope">
                  <span class="tableText" :class="getCellStyle(scope.row[l])">
                    {{ displayData(scope.row[l]) }}
                  </span>
                </template>
              </el-table-column>
            </template>
            <div slot="empty" style="text-align: left">
              <el-empty image-size="80" description="No Data"></el-empty>
            </div>
          </el-table>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<script>
import { CIQ } from '@/components/common/chart/st-development/js/components'
import { formatStandardTime } from '@/utils'

export default {
  name: 'TIM',
  props: {
    tradesData: Array,
    tradePrice: String,
    rowFrequency: String,
		direction: String
  },
  data() {
    return {
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
			start_date: null,
			loading: false
    }
  },
  methods: {
		clearData(timeframe) {
			this.rowFrequency = timeframe
			this.backtestHistoryList = []
			this.result_quotes = []
			this.periods = []
			this.getAllDefaultTableLabels()
		},
		getCellStyle(value) {
      // Check if the value is negative and return a class name accordingly
      return {
        'negative-value': value < 0,
      };
		},
		tableRowClassName(obj) {
      const {row, rowIndex} = obj
        if (rowIndex%2 === 1) {
        return 'darken-row';
        }
        return '';
	  },
    // Utility function to format an output
		displayData(data) {
			const numberRegex = /^-?\d+(\.\d+)?$/
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/

			if (numberRegex.test(data)) {
				return parseFloat(data)
			} else if (dateRegex.test(data)) {
				return data
			} else {
				// 如果既不是数字也不是日期，则返回空字符串，即不显示"NAN"的数据
				return ''
			}
		},
    async prepareData(tradesData,datatime) {
			this.tradesData = tradesData
      const periodArray = this.getAllDefaultTableLabels()
			console.log('periodArray', periodArray)
			console.log('defaultTableLabels', this.defaultTableLabels)
      this.backtestHistoryList = this.calculateBacktestHistory(
          this.tradesData,
          periodArray
      )

      this.start_date = formatStandardTime(datatime)
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
              { period: 1, timeframe: 'Year' },
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
					break
				default:
					break
			}
			return periodArray
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
		calculate_win_rate(arr) {
			arr = arr.filter(function (x) {
				return !isNaN(x) // 鍓旈櫎NaN鍊約
			})
			if (arr.length == 0) return NaN

			let return_series = arr.map((x) => (x > 0 ? 1 : 0))
			return parseFloat(this.calculate_mean(return_series).toFixed(2))
		},
		calculate_mean(arr) {
			arr = arr.filter(function (x) {
					return !isNaN(x) // 鍓旈櫎NaN鍊約
			})
			if (arr.length == 0) return NaN
			return arr.reduce((a, b) => a + b) / arr.length
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
		calculate_median(arr) {
			arr = arr.filter((n) => !isNaN(n))
			if (arr.length == 0) return NaN
			const mid = Math.floor(arr.length / 2)
			const nums = [...arr].sort((a, b) => a - b)
			return parseFloat(
				(arr.length % 2 !== 0
					? nums[mid]
					: (nums[mid - 1] + nums[mid]) / 2
				).toFixed(1)
			)
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
    calculateZScore(dataSet, periodArray) {
			/*
      periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
      */
			let period_dict = this.transformZScoreData(periodArray)
			let quotes = CIQ.stxx.chart.masterData
			// const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
			const direction = this.direction
			for (var i in period_dict) {
				quotes = this.generate_period_data(
					period_dict[i].timeframe,
					quotes,
					period_dict[i].value,
					direction
				)
			}
			// 鏁版嵁鍒囩墖
			// quotes = quotes.filter((x) => {
			// 	return this.start_date.getTime() <= x.DT.getTime()
			// })
			//鎶婁氦鏄撳垪琛ㄨ浆鎹㈡垚鏃堕棿鎴
			let dataTimeList = []
			for (var data in dataSet) {
				var entryDate = formatStandardTime(dataSet[data].Date).getTime()
				dataTimeList.push(entryDate)
			}
			let used_quotes = quotes.filter(
				(x) => dataTimeList.indexOf(x.DT.getTime()) != -1
			)
			// let used_quotes = quotes
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
			for (var i in period_dict) {
				let temp_median = this.calculate_median(
					used_quotes.map((obj) => obj[period_dict[i].timeframe])
				)
				median_list.push(temp_median)
				positive_list.push(
					this.calculate_win_rate(
						used_quotes.map((obj) => obj[period_dict[i].timeframe])
					)
				)
				if (direction == 'Short') {
					max_loss_list.push(
						this.calculate_median(
							used_quotes.map((obj) => obj['MaxGain' + period_dict[i].value])
						)
					)
					max_gain_list.push(
						this.calculate_median(
							used_quotes.map((obj) => obj['MaxLoss' + period_dict[i].value])
						)
					)
				} else {
					max_loss_list.push(
						this.calculate_median(
							used_quotes.map((obj) => obj['MaxLoss' + period_dict[i].value])
						)
					)
					max_gain_list.push(
						this.calculate_median(
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
			const res = period_dict.map((val, i) => {
				let AvgMaxLoss = !median_list[i] && median_list[i] != 0 ? NaN : max_loss_list[i]
				let AvgMaxGain = !median_list[i] && median_list[i] != 0 ? NaN : max_gain_list[i]
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
					Median: median_list[i],
					'% Positive': isNaN(positive_list[i])
						? ''
						: Math.round(positive_list[i] * 100) + '%',
					'Avg Max Loss': AvgMaxLoss,
					'Avg Max Gain': AvgMaxGain,
					'Z-Score': z_score_list[i]
				}
			})
			this.result_quotes = res
			this.generate_table_data()
		},
    calculateBacktestHistory(dataSet, periodArray) {
			/*
      periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
      */
			let chartDataset = CIQ.stxx.chart.dataSet
			const direction = this.direction
			const field = this.tradePrice
			let backtestResult = []

			// const testdate = new Date('1947-04-16')
			// var testoffset = testdate.getTimezoneOffset() * 60 * 1000
			// var testentryDate = new Date(testdate.getTime() + testoffset)
			// let testres = chartDataset.findIndex((x) => {
			// 	return testdate.getTime() == x.DT.getTime()	
			// })
			// debugger
			for (var data in dataSet) {
				var entryDate = formatStandardTime(dataSet[data].Date)
				let res = chartDataset.findIndex((x) => {
					return entryDate.getTime() == x.DT.getTime()
				})

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
			return backtestResult
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
    generate_table_data() {
			this.generatePeriods()
      let keys = Object.keys(this.result_quotes[0])
      keys.splice(keys.indexOf('Period'), 1)
      let result = []
      for (let i = 0; i < keys.length; i++) {
        result.push({
          property: keys[i]
        })
      }
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
		},
    generatePeriods() {
			let quotes = []
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
		},
	exportData() {
		return {backtestHistoryList: this.backtestHistoryList, result_quotes: this.result_quotes, periods: this.periods, defaultTableLabels: this.defaultTableLabels};
	}
  }
}
</script>

<style lang="less" scoped>
p {
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.5em;
  color: #333;
}
.negative-value{
  color: #dd3a13;
}
.CPM-TIM-Contianer {
	margin: 0 auto;
}
.CPM-header, .CPM-ZScore, .CPM-TIM-Table {
	width: 893px;
	margin: 0 auto;
}
</style>