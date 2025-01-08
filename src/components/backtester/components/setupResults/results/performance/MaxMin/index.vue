<template>
	<div class="tim-container">
				<div class="history-container">
					<el-skeleton :rows="6" :loading="loading" animated>
						<template>
							<el-table
								:data="backtestHistoryList"
								:row-class-name="tableRowClassName"
								stripe
								border
								class="MaxMinTable"
								style="height: 100%; margin: 20px auto"
							>
								<template v-for="(l, index) in defaultTableLabels">
									<el-table-column :key="index" align="center" v-if="l == 'Dates of 1 Signals'" width="160px">				
										<template slot="header">
											{{`Dates of ${signalsNumber} Signals`}}
										</template>						
										<template slot-scope="scope">
												{{ displayData(scope.row[l]) }}
										</template>
									</el-table-column>
									<el-table-column :label="l !== '1 Year Later'? l.replace('[%]', 'Later [%]') : l.replace('[%]', '   Later [%]')"  :key="index" align="center" v-if="![
										'Dates of 1 Signals',
										'Max Gain',
										'Max Loss'].includes(l)">
										<el-table-column label="Max Loss" align="center" class-name="redHeader" width="60px">
											<template slot-scope="scope">
												<p class="negative-value">
													{{ scope.row[l]['Max Loss'] }}
												</p>
												</template>
										</el-table-column>
										<el-table-column label="Max Gain" align="center" width="60px">
											<template slot-scope="scope">
												<p class="tableText">
													{{ scope.row[l]['Max Gain'] }}
												</p>
											</template>
										</el-table-column>
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
import { CIQ } from '@/components/common/chart/st-development/js'
import { formatStandardTime } from '@/utils'

export default {
	name: 'MaxMin',
	data() {
		return {
			// common states
			loading: false,
			start_date: null,

			//Exit With Default Time-In-Market/HistoryList
			backtestHistoryList: [],
			defaultTableLabels: [
				'Dates of 1 Signals',
				'1 Week [%]',
				'2 Weeks [%]',
				'1 Month [%]',
				'2 Months [%]',
				'3 Months [%]',
				'6 Months [%]',
				'12 Months [%]',
				'Max Gain',
				'Max Loss'
			],
			signalsNumber: 1
		}
	},
	props: {
			tradesData: Array,
			tradePrice: String,
			rowFrequency: String
  },
	methods: {
		// Utility function to format an output
		displayData(data) {
			const numberRegex = /^-?\d+(\.\d+)?$/
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/

			if (numberRegex.test(data)) {
				return parseFloat(data)
			} else if (dateRegex.test(data)) {
				return data
			} else if(typeof data == 'string'){
				return data
			}else {
				return ''
			}
		},
		clearData() {
				this.backtestHistoryList = []
		},
		async prepareData(_,datatime) {
				const periodArray = this.getAllDefaultTableLabels()
				const backtestHistoryList = this.calculateBacktestHistory(
						this.tradesData,
						periodArray
				)
				const defaultTableLabels = this.defaultTableLabels.filter(item => item != 'Dates of 1 Signals' && item != 'Max Gain' && item != 'Max Loss')
				
				const medianMaxGainArray = [{'Dates of 1 Signals': 'Mean'}, {'Dates of 1 Signals': 'Median'}, {'Dates of 1 Signals': '# of Times > -5%'}, {'Dates of 1 Signals': '# of Times > -10%' }]
				defaultTableLabels.forEach(label => {
					medianMaxGainArray.forEach(ele => {
						if(ele['Dates of 1 Signals'] === 'Median') {
							// 计算中位数
							const monthData = backtestHistoryList.map(entry => entry[label])

							const maxGainValues = monthData.map(entry => entry["Max Gain"])
							const maxLossValues = monthData.map(entry => entry["Max Loss"])

							maxGainValues.sort((a, b) => a - b)
							maxLossValues.sort((a, b) => a - b)
							// 计算中位数
							const medianMaxGain = maxGainValues.length % 2 === 0
								? ((maxGainValues[maxGainValues.length / 2 - 1] + maxGainValues[maxGainValues.length / 2]) / 2).toFixed(2)
								: maxGainValues[Math.floor(maxGainValues.length / 2)]

							const medianMaxLoss = maxLossValues.length % 2 === 0
								? ((maxLossValues[maxLossValues.length / 2 - 1] + maxLossValues[maxLossValues.length / 2]) / 2).toFixed(2)
								: maxLossValues[Math.floor(maxLossValues.length / 2)]
								
							ele[label] = {"Max Gain": medianMaxGain, "Max Loss": medianMaxLoss}
						}
						else if(ele['Dates of 1 Signals'] === 'Mean') {
								// 计算平均值
								const monthData = backtestHistoryList.map(entry => entry[label])
								const maxGainValues = monthData.map(entry => entry["Max Gain"])
								const maxLossValues = monthData.map(entry => entry["Max Loss"])
								const avgMaxGain = maxGainValues.reduce((sum, current) => sum + current, 0) / maxGainValues.length
								const avgMaxLoss = maxLossValues.reduce((sum, current) => sum + current, 0) / maxLossValues.length
								ele[label] = {"Max Gain": avgMaxGain.toFixed(2), "Max Loss": avgMaxLoss.toFixed(2)}
						}
						else if(ele['Dates of 1 Signals'] === '# of Times > -5%') {
							// 计算大于-5%的个数
							const monthData = backtestHistoryList.map(entry => entry[label])
							// const maxGainValues = monthData.map(entry => entry["Max Gain"])
							const maxLossValues = monthData.map(entry => entry["Max Loss"])
							// const lenMaxGain = maxGainValues.filter(num => num > 5).length
							const lenMaxGain = ''
							const lenMaxLoss = maxLossValues.filter(num => num < -5).length
							ele[label] = {"Max Gain": lenMaxGain, "Max Loss": lenMaxLoss}
					}
					else if(ele['Dates of 1 Signals'] === '# of Times > -10%') {
							// 计算大于-5%的个数
							const monthData = backtestHistoryList.map(entry => entry[label])
							// const maxGainValues = monthData.map(entry => entry["Max Gain"])
							const maxLossValues = monthData.map(entry => entry["Max Loss"])
							// const lenMaxGain = maxGainValues.filter(num => parseFloat(num) > 10).length
							const lenMaxGain = ''
							const lenMaxLoss = maxLossValues.filter(num => parseFloat(num) < -10).length
							ele[label] = {"Max Gain": lenMaxGain, "Max Loss": lenMaxLoss}
					}
				})
			})
				console.log('计算结果', medianMaxGainArray)
				console.log('lishan backtestHistoryList', backtestHistoryList)
				this.signalsNumber = backtestHistoryList.length
				this.backtestHistoryList = [...backtestHistoryList, ...medianMaxGainArray]
				this.start_date = formatStandardTime(datatime)
		},
		getAllDefaultTableLabels() {
			let periodArray = [
				{ period: 1, timeframe: 'Week' },
				{ period: 2, timeframe: 'Week' },
				{ period: 1, timeframe: 'Month' },
				{ period: 2, timeframe: 'Month' },
				{ period: 3, timeframe: 'Month' },
				{ period: 6, timeframe: 'Month' },
				{ period: 1, timeframe: 'Year' }
			]
			const frequency = this.rowFrequency
			switch (frequency) {
				case 'Daily':
					this.defaultTableLabels = [
						'Dates of 1 Signals',
						'1 Week [%]',
						'2 Weeks [%]',
						'1 Month [%]',
						'2 Months [%]',
						'3 Months [%]',
						'6 Months [%]',
						'1 Year [%]',
						'Max Gain',
						'Max Loss'
					]
					break
				case 'Weekly':
					this.defaultTableLabels = [
						'Dates of 1 Signals',
						'1 Week [%]',
						'2 Weeks [%]',
						'1 Month [%]',
						'2 Months [%]',
						'3 Months [%]',
						'6 Months [%]',
						'1 Year [%]',
						'Max Gain',
						'Max Loss'
					]
					break
				case 'Monthly':
					this.defaultTableLabels = [
						'Dates of 1 Signals',
						'1 Month [%]',
						'3 Months [%]',
						'6 Months [%]',
						'9 Months [%]',
						'1 Year [%]',
						'2 Years [%]',
						'3 Years [%]',
						'Max Gain',
						'Max Loss'
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
			debugger
			/*
      periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
      */
			let chartDataset = CIQ.stxx.chart.dataSet
			const direction = dataSet[0].TradeStatus == 'BUY' ? 'Long' : 'Short'
			const field = this.tradePrice
			// dataSet = dataSet.filter((item) => item.TradeStatus == 'BUY')
			dataSet = dataSet.filter((_, index) => index % 2 === 0)
			let returnResults = []

			for (let data in dataSet) {
				let entryDate = formatStandardTime(dataSet[data].Date)

				let res = chartDataset.findIndex((x) => {
					return entryDate.getTime() == x.DT.getTime()
				})

				if (res != -1) {
					//鎷胯繘鍦轰环鏍煎拰鍓嶄竴澶╀綔姣旇緝
					let entryPrice = chartDataset[res][field]
					const transformData = this.transformData(periodArray)
					transformData.sort((a, b) => a.value - b.value)
					transformData.map((item) => {
            let _timArray = []
            for (let i = 1; i <= item.value; i++) {
              const element = chartDataset[res + i] || null
              _timArray.push(element)
            }
            const timArray = _timArray.filter(item => {
              return item !== null && item !== undefined && item !== '';
            });
						const preTimArray = timArray.map(item => item[field])
            //console.log('timArray', timArray)
            
            const calculateReturn = (item, entryPrice) => {
              const value = item;
              if (value !== undefined && value !== null) {
                const percentageReturn = ((value / entryPrice - 1) * 100).toFixed(2);
                return parseFloat(percentageReturn) // Ensure non-negative value
              }
              return '';
            };

            const findExtremeItem = (arr, comparator) => {
              return arr.reduce(comparator, arr[0]);
            };

            const maxItem = findExtremeItem(preTimArray, (max, current) =>
              current > max ? current : max
            );

            const minItem = findExtremeItem(preTimArray, (min, current) =>
              current < min ? current : min
            );

						//console.log('最大值 最小值', maxItem, minItem)

            const maxReturn = maxItem < entryPrice ? 0 : calculateReturn(maxItem, entryPrice);
            const minReturn = minItem > entryPrice ? 0 : calculateReturn(minItem, entryPrice);

            let [finalMaxReturn, finalMinReturn] = direction === 'Short' ? [-minReturn, -maxReturn] : [maxReturn, minReturn]

						returnResults.push({
							[`${item.timeframe}`]:item.timeframe,
							'Max Loss':finalMinReturn,
							'Max Gain':finalMaxReturn,
							'Dates of 1 Signals': dataSet[data].Date
						})
					})
				}
			}
			const mergedData = {};

			returnResults.forEach(entry => {
				const key = entry["Dates of 1 Signals"];

				if (!mergedData[key]) {
					mergedData[key] = { "Dates of 1 Signals": key };
				}

				Object.keys(entry).forEach(prop => {
					if (prop !== "Dates of 1 Signals") {
						if (!mergedData[key][prop]) {
							mergedData[key][prop] = {};
						}
						mergedData[key][prop] = {
							"Max Loss": entry["Max Loss"],
							"Max Gain": entry["Max Gain"],
						};
					}
				});
			});

			const finalData = Object.values(mergedData);

			console.log('finalData', finalData);
			return finalData
		},
		exportData() {
			return {maxMinData: this.backtestHistoryList};
		},
		tableRowClassName({row, rowIndex}) {
		if (row['Dates of 1 Signals'] === 'Mean') {
				return 'border-top-row'
		}
			return ''
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
.negative-value{
  color: #dd3a13;
}
.history-container {
	width: 1001px;
	margin: 0 auto;
}
</style>