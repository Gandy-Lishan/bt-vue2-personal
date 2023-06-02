<template>
	<div class="exit-with-custom-tim-frame-container">
		<div class="title symbol-title">
			<p>Custom entry date and different time-in-market:</p>
			<div class="options-container">
				<div class="select-container">
					<span>Symbol</span>
					<el-select
						v-model="symbol"
						id="symbolName"
						filterable
						remote
						reserve-keyword
						automatic-dropdown
						@change="getSymbol(symbol)"
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
				<div class="direction-box">
					<span>Direction &nbsp; &nbsp;</span>
					<el-radio-group v-model="direction" @change="getDirection">
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</div>
			</div>
		</div>
		<div class="content-container">
			<div class="entry-data-container">
				<div class="title">
					<p>Define Entry Date</p>
				</div>
				<el-table :data="entryDates" border ref="table">
					<el-table-column
						type="index"
						label="Index"
						width="80"
						:header-align="'center'"
						:align="'center'"
					></el-table-column>
					<el-table-column
						label="Date"
						:header-align="'center'"
						:align="'center'"
					>
						<template slot-scope="scope">
							<el-date-picker
								style="width: 100%"
								:readonly="scope.row.readonly"
								:placeholder="scope.row.placeholder"
								v-model="scope.row.value"
								@change="handleDateChange(scope.$index, $event)"
								:picker-options="pickerOptions"
							></el-date-picker>
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
								@click="deleteDateRow(scope.$index)"
							></el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="table-footer">
					<el-button
						type="primary"
						icon="el-icon-plus"
						@click="addDateRow"
						size="mini"
						plain
						>Add Row</el-button
					>
					<!-- <el-button type="primary" @click="saveDateTable" size="mini"
						>Save</el-button
					> -->
				</div>
			</div>
			<div class="TIM-container">
				<div class="title">
					<p>Define Different Time In Market</p>
				</div>
				<el-table :data="editTIMData" border ref="table">
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
								:readonly="scope.row.readonly"
								:placeholder="scope.row.placeholder"
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
							<el-select
								style="width: 100%"
								v-model="scope.row.timeframe"
								:disabled="scope.row.readonly"
							>
								<el-option label="Day(s)" value="Day"></el-option>
								<el-option label="Week(s)" value="Week"></el-option>
								<el-option label="Month(s)" value="Month"></el-option>
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
				<div class="table-footer">
					<el-button
						type="primary"
						icon="el-icon-plus"
						@click="addRow"
						size="mini"
						plain
						>Add Row</el-button
					>
					<!-- <el-button type="primary" @click="saveTable" size="mini"
						>Save</el-button
					> -->
				</div>
			</div>
		</div>
		<el-button type="primary" class="run-button" @click="runTIM">Run</el-button>
		<div class="history-container">
			<el-skeleton :rows="6" :loading="loading" animated>
				<template>
					<el-table
						:data="TIMHistoryList"
						stripe
						style="width: 100%; height: 100%"
					>
						<template v-for="(l, index) in defaultTIMTableLabels">
							<el-table-column :label="l" :prop="l" :key="index">
								<template slot-scope="scope">
									<p class="tableText">
										{{ scope.row[l] }}
									</p>
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
		<div class="zscore-container">
			<el-skeleton :rows="2" :loading="loading" animated>
				<template>
					<el-table
						:data="TIMResult_quotes"
						:show-header="false"
						stripe
						style="width: 100%; height: 100%"
					>
						<el-table-column prop="property" label="Property">
						</el-table-column>

						<template v-for="column in periodsTIM">
							<el-table-column
								:key="column.period"
								:label="column.period"
								:prop="column.period"
							>
								<template slot-scope="scope">
									<p class="tableText">
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
			</el-skeleton>
		</div>
	</div>
</template>

<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import moment from "moment";
import {
  getIndexsList,
  getStocksList,
  getPairData
} from '@/service/service.js'
import { timestampToTime } from '@/tools/formatDate.js'
const uniqWith = require('lodash/uniqWith')
const isEqual = require('lodash/isEqual')
export default {
  name: 'ExitWithCustomTIMFrame',
  data() {
    return {
      dialogDateVisible: false, // 弹框可见性
      entryDates: [], // 存储选择的日期数组
      showTable: false,
      editTIMData: [
        {
          period: '1',
          placeholder: 'input period',
          timeframe: 'Day',
          readonly: false
        },
        {
          period: '1',
          placeholder: 'input period',
          timeframe: 'Week',
          readonly: false
        }
      ],
      defaultTIMTableLabels: [],
      TIMHistoryList: [],
      TIMResult_quotes: [],
      periodsTIM: [],
      symbol: 'SPY',
      options: [],
      symbolList: [],
      indexList: [],
      loading: false,
      direction: 'Long',
      dateList: [],
      // pickerOptions: {
      //   disabledDate(time) {
      //     // 获取当前日期
      //     const currentDate = new Date();
      //     currentDate.setHours(0, 0, 0, 0);
      //      const year = time.getFullYear();
      //     return time.getTime() >= currentDate.getTime() || (time.getDay()===0||time.getDay()===6) || year < 1993
      //   }
      // }
    }
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: this.disabledDate // 设置禁用日期的函数
      };
    }
  },
  async created() {
    await this.getDateList()
    this.initialEntryDate()
  },
  methods: {
    initialEntryDate() {
      let yesterday = this.dateList[this.dateList.length - 1]
      let beforeYes = this.dateList[this.dateList.length - 2]
      if (this.dateList.length == 0) {
        yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // 昨天
        beforeYes = new Date();
        beforeYes.setDate(beforeYes.getDate() - 2); // 大前天
      }
      this.entryDates = [{
        value: beforeYes,
        placeholder: 'select entry date',
        readonly: false
      },
      {
        value: yesterday,
        placeholder: 'select entry date',
        readonly: false
      }]
    },
    disabledDate(date) {
      // 禁用小于1993年的日期和大于今天的日期
      const currentDate = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();

      const isBefore1993 = year < 1993;
      const isAfterToday = currentDate < new Date(year, month, day);

      // 检查日期是否在日期列表中
      const isInDateList = this.dateList.includes(this.formatDate(date));

      return isBefore1993 || isAfterToday || !isInDateList;
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async getDateList() {
      const startDate = '1993-01-01',
        endDate = timestampToTime(new Date()),
        frequency = 'daily',
        symbol = 'SPX'

      const res = await getPairData(startDate, endDate, frequency, symbol)
      const pairDataList = res.data.map(item => {
        const dateObj = new Date(item.DT)
        const formattedDate = dateObj.toISOString().slice(0, 10)
        return formattedDate
      })
      this.dateList = pairDataList
      console.log(pairDataList)
    },
    generate_table_data() {
      this.generatePeriods()

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
    },
    generatePeriods() {
      let quotes = []
      quotes = this.TIMResult_quotes
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
      this.periodsTIM = columns
    },
    openDateDialog() {
      this.dialogDateVisible = true;
    },
    addEntryDate() {
      this.entryDates.push(new Date());
    },
    saveEntryDates() {
      console.log('选择的日期：', this.entryDates);
      this.dialogDateVisible = false;
    },
    addRow() {
      if (this.editTIMData.length >= 10) {
        this.$notify({
          title: 'Warning',
          message: 'Cannot add more than 10 rows.',
          type: 'warning'
        });
        return
      }
      const newRow = {
        period: '1',
        timeframe: 'Day',
        placeholder: `input period`,
        readonly: false
      };
      this.editTIMData.push(newRow);
    },
    addDateRow() {
      if (this.entryDates.length >= 10) {
        this.$notify({
          title: 'Warning',
          message: 'Cannot add more than 10 rows.',
          type: 'warning'
        });
        return
      }
      const newRow = {
        value: '',
        placeholder: `select entry date`,
        readonly: false
      };
      this.entryDates.push(newRow)
      console.log(this.entryDates)
    },
    getValues() {
      this.editTIMData = this.editTIMData.map(item => {
        if (item.period % 5 === 0 && item.timeframe === 'Day') {
          return { period: item.period / 5, timeframe: 'Week' }
        }
        if (item.period % 21 === 0 && item.timeframe === 'Day') {
          return { period: item.period / 21, timeframe: 'Month' }
        }
        return item
      })
      return this.editTIMData.map(row => {
        return { period: row.period, timeframe: row.timeframe };
      });
    },
    showTableDialog() {
      this.showTable = true;
    },
    saveTable() {
      this.showTable = false;
      CIQ.addCover('Calculating...')
      CIQ.nprogress.start()
      try {
        const periodArray = this.getValues()
        // 去重
        console.log('去重', this.entryDates)
        const dateUniqueData = [];
        this.entryDates.forEach(item => {
          const isDateDuplicate = dateUniqueData.some(
            uniqueItem =>
              uniqueItem.value == item.value
          );

          if (!isDateDuplicate) {
            dateUniqueData.push(item);
          }
        });
        this.entryDates = dateUniqueData
        // this.entryDates = Array.from(new Set(this.entryDates))
        if (this.entryDates.length === 0 || periodArray.length === 0) {
          this.$notify({
            title: 'Warning',
            message: 'Entry Date or Time In Market is empty. Please click Add Row to add data.',
            type: 'warning'
          });
          CIQ.hideCover()
          CIQ.nprogress.done()
          return
        }
        const isValid = this.validateData(periodArray)
        const isValidDate = this.validateEntryDate(this.entryDates)
        if (!isValid || !isValidDate) {
          CIQ.hideCover()
          CIQ.nprogress.done()
          return
        }
        // 日期排序
        this.entryDates = this.entryDates.sort((a, b) => {
          const dateA = new Date(a.value);
          const dateB = new Date(b.value);
          return dateA - dateB;
        });
        const uniqueData = [];
        periodArray.forEach(item => {
          const isDuplicate = uniqueData.some(
            uniqueItem =>
              uniqueItem.period == item.period && uniqueItem.timeframe == item.timeframe
          );

          if (!isDuplicate) {
            uniqueData.push(item);
          }
        });
        // 去重
        this.editTIMData = uniqueData
        const transformData = this.transformData(uniqueData)
        transformData.sort((a, b) => a.value - b.value);
        const table = ['Entry Date']
        transformData.map((item) => {
          table.push(item.timeframe)
        })
        this.defaultTIMTableLabels = table
        this.saveDateTable()
        const data = this.calculateBacktestHistory(this.entryDates, uniqueData)
        this.TIMHistoryList = data
        console.log('data', data)
        this.calculateZScore(this.entryDates, uniqueData)
        //this.resetTable()
      } catch (error) {
        console.log(error)
      }
      CIQ.hideCover()
      CIQ.nprogress.done()
    },
    saveDateTable() {
      this.showTable = false;
      console.log(this.entryDates)
    },
    cancelTable() {
      this.showTable = false;
      // this.resetTable();
    },
    cancelDateTable() {
      this.dialogDateVisible = false;
    },
    resetTable() {
      this.editTIMData = [
        { period: '1', placeholder: 'input period', timeframe: 'Day', readonly: false },
        { period: '1', placeholder: 'input period', timeframe: 'Week', readonly: false }
      ]
    },
    validateData(data) {
      for (const item of data) {
        if (item.timeframe === 'Day' || item.timeframe === 'Days') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 252 || !Number.isInteger(Number(item.period))) {
            this.$notify({
              title: 'Warning',
              message: 'When the Timeframe is selected as Day(s), only positive integers between 1 and 252 are allowed to be entered.',
              type: 'warning'
            });
            return false;
          }
        }
        if (item.timeframe === 'Week' || item.timeframe === 'Weeks') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 52 || !Number.isInteger(Number(item.period))) {
            this.$notify({
              title: 'Warning',
              message: 'When the Timeframe is selected as Week(s), only positive integers between 1 and 52 are allowed to be entered.',
              type: 'warning'
            });
            return false;
          }
        }
        if (item.timeframe === 'Month' || item.timeframe === 'Months') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 120 || !Number.isInteger(Number(item.period))) {
            this.$notify({
              title: 'Warning',
              message: 'When the Timeframe is selected as Month(s), only positive integers between 1 and 120 are allowed to be entered.',
              type: 'warning'
            });
            return false;
          }
        }
      }
      return true;
    },
    validateEntryDate(data) {
      for (const item of data) {
        if (!item.value || item.value === 'Invalid date') {
          this.$notify({
            title: 'Warning',
            message: 'There are rows in Entry Date with an unselected date.',
            type: 'warning'
          });
          return false
        }
      }
      return true

    },
    deleteRow(index) {
      this.editTIMData.splice(index, 1)
    },
    deleteDateRow(index) {
      this.entryDates.splice(index, 1)
    },
    transformData(data) {
      return data.map((item) => {
        let timeframe =
          item.period > 1
            ? `${item.period} ${item.timeframe}s [%]`
            : `${item.period} ${item.timeframe} [%]`
        let value
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
          default:
            break
        }
        return { timeframe, period: item.period, value }
      })
    },
    handleDateChange(index, value) {
      // 将日期格式化为 yyyy-MM-dd
      const formattedDate = moment(value).format('YYYY-MM-DD');
      const newRow = {
        value: formattedDate,
        placeholder: `select entry date`,
        readonly: false
      }
      this.entryDates.splice(index, 1, newRow); // 替换原日期为格式化后的日期
      console.log(this.entryDates)
    },
    getSymbol(val) {
      this.$store.commit('getBacktestSymbol', val)
      CIQ.addSymbol(val)
    },
    getDirection(val) {
      // Set direction to vuex
      this.$store.commit('getDirection', val)
      // Direction passed to entry and exit
      this.direction = val
    },
    async remoteMethod(query) {
      let vm = this
      if (query !== '') {
        vm.loading = true
        if (vm.symbolList.length == 0 || vm.indexList.length == 0) {
          await vm.getStocksList()
          await vm.getIndexsList()
        }

        var symbolListTemp = vm.symbolList.filter((item) => {
          return (
            item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        })
        var IndexListTemp = vm.indexList.filter((item) => {
          return (
            item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        })

        let options = symbolListTemp.concat(IndexListTemp)
        // keyword全匹配
        for (var item of options) {
          if (
            item.value.toLowerCase() === query.toLowerCase() ||
            item.label.toLowerCase() === query.toLowerCase()
          ) {
            options.unshift(item)
            break
          }
        }
        // 去重
        this.options = uniqWith(options, isEqual)
        // 解除遮罩
        vm.loading = false
      } else {
        this.options = []
      }
    },
    async getIndexsList() {
      try {
        let vm = this
        if (vm.$store.state.indexsList.length != 0) {
          vm.indexList = vm.$store.state.indexsList.map((item) => {
            return { value: `${item.symbol}`, label: `${item.symbol}` }
          })
        } else {
          let res = await getIndexsList()
          vm.indexList = res.data.map((item) => {
            return { value: `${item.symbol}`, label: `${item.symbol}` }
          })
          vm.loading = false
        }
      } catch (error) {
        this.indexList = []
        vm.loading = false
      }
    },
    async getStocksList() {
      let vm = this

      if (vm.$store.state.stocksList.length != 0) {
        vm.symbolList = vm.$store.state.stocksList.map((item) => {
          return { value: `${item.stock}`, label: `${item.stock}` }
        })
      } else {
        try {
          let res = await getStocksList()
          vm.symbolList = res.data.map((item) => {
            return { value: `${item.stock}`, label: `${item.stock}` }
          })
        } catch (error) {
          console.warn(error)
          vm.loading = false
        }
      }
    },
    calculateBacktestHistory(dataSet, periodArray) {
      /*
        periodArray: [{period: 1, timeframe: 'Week'}}] => [{timefame: '1 Week [%]', period: '1', value: 5}]
    */
      let chartDataset = CIQ.stxx.chart.dataSet
      const direction = this.direction
      let backtestResult = []

      for (var data in dataSet) {
        var datatime = new Date(dataSet[data].value)

        var offset = datatime.getTimezoneOffset() * 60 * 1000
        var entryDate = new Date(datatime.setTime(datatime.getTime() + offset))

        let res = chartDataset.findIndex((x) => {
          return entryDate.getTime() == x.DT.getTime()
        })

        if (res != -1) {
          //鎷胯繘鍦轰环鏍煎拰鍓嶄竴澶╀綔姣旇緝
          let entryPrice = chartDataset[res].Open
          const transformData = this.transformData(periodArray)
          let obj = {}
          transformData.map((item) => {
            let exitBar = chartDataset[res + item.value]
              ? (
                ((direction == 'Short'
                  ? entryPrice - chartDataset[res + item.value].Open
                  : chartDataset[res + item.value].Open - entryPrice) /
                  entryPrice) *
                100
              ).toFixed(2)
              : ''
            obj[item.timeframe] = exitBar
          })
          backtestResult.push({ 'Entry Date': dataSet[data].value, ...obj })
        }
      }
      return backtestResult
    },
    transformZScoreData(data) {
      return data.map((item) => {
        let timeframe =
          item.period > 1
            ? `${item.period} ${item.timeframe}s`
            : `${item.period} ${item.timeframe}`
        let value
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
          default:
            break
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
      const direction = this.direction
      for (var i in period_dict) {
        quotes = this.generate_period_data(
          period_dict[i].timeframe,
          quotes,
          period_dict[i].value,
          direction
        )
      }
      console.log('trades', dataSet)
      console.log('鍘熻绠楀悗鐨勬暟鎹', quotes)
      // 鏁版嵁鍒囩墖
      // quotes = quotes.filter((x) => {
      //   return this.start_date.getTime() <= x.DT.getTime()
      // })
      //鎶婁氦鏄撳垪琛ㄨ浆鎹㈡垚鏃堕棿鎴
      let dataTimeList = []
      for (var data in dataSet) {
        var datatime = new Date(dataSet[data].value)
        var offset = datatime.getTimezoneOffset() * 60 * 1000
        var entryDate = new Date(
          datatime.setTime(datatime.getTime() + offset)
        ).getTime()
        dataTimeList.push(entryDate)
      }
      let used_quotes = quotes.filter(
        (x) => dataTimeList.indexOf(x.DT.getTime()) != -1
      )
      console.log('鍒囩墖骞惰繃婊ら潪浜ゆ槗鏃ユ湡鐨勬暟鎹', used_quotes)
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
        z_score_list = []
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
          quotes.map((obj) => obj[period_dict[i].timeframe])
        )
        z_score_list.push(
          parseFloat(
            (
              (temp_median - temp_mean) /
              (temp_std / Math.sqrt(used_quotes.length))
            ).toFixed(1)
          )
        )

        //  console.log(period_dict[period_list[i]] + ': ',used_quotes.map(obj=>obj[period_dict[period_list[i]]]))

        //  console.log('positive_list',positive_list)
        //  console.log("MaxLoss" + period_list[i] + ': ',used_quotes.map(obj=>obj["MaxLoss" + period_list[i]]))
        //  console.log("MaxGain" + period_list[i] + ': ',used_quotes.map(obj=>obj["MaxGain" + period_list[i]]))
        //  console.log('max_loss_list',max_loss_list)
        //  console.log('max_gain_list',max_gain_list)
        //  console.log('z_score_list',z_score_list)
      }
      const res = period_dict.map((val, i) => ({
        Period: val['timeframe'],
        Median: median_list[i],
        '% Positive': isNaN(positive_list[i]) ? '' : (positive_list[i] * 100).toFixed(2) + ' %',
        'Avg Max Loss': median_list[i] ? max_loss_list[i] : NaN,
        'Avg Max Gain': median_list[i] ? max_gain_list[i] : NaN,
        'Z-Score': z_score_list[i]
      }))

      this.TIMResult_quotes = res
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

      let return_series = arr.map((x) => (x > 0 ? 1 : 0))
      return parseFloat(this.calculate_mean(return_series).toFixed(2))
    },
    calculate_mean(arr) {
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
        ).toFixed(1)
      )
    },
    generate_period_data(name, quotes, period, direction) {
      const field = 'Open'
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
            ).toFixed(1)
          )
          return {
            ...row,
            [field + period]: quotes[i + period][field],
            [name]: change == Infinity ? 0 : change
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
            (100 * (minCloseArr[i] / row[field] - 1)).toFixed(1)
          )
          return {
            ...row,
            ['MaxLoss' + period]: change == Infinity ? 0 : change
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
            (100 * (maxCloseArr[i] / row[field] - 1)).toFixed(1)
          )
          return {
            ...row,
            ['MaxGain' + period]: change == Infinity ? 0 : change
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
    runTIM() {
      this.saveTable()
    }
  }
};
</script>

<style scoped>
.zscore-container {
	border-top: solid 3px #00000042 !important;
}
.add-date-button {
	margin-top: 10px;
}
.el-table /deep/.cell {
	padding-left: 0;
	padding-right: 0;
}
.el-table /deep/.el-input__inner {
	margin-left: 0;
}
.el-dialog__wrapper /deep/.el-dialog {
	width: 45% !important;
}
.exit-with-custom-tim-frame-container {
	width: 80%;
	margin: 20px;
}
.title {
	border: 1px solid #dcdfe6;
	text-align: center;
	border-radius: 4px;
	width: 100%;
	margin: 0 auto;
	box-sizing: border-box;
	color: #909399;
	font-weight: bold;
}
.symbol-title {
	/* display: flex;
	justify-content: space-around;
	align-items: center; */
	margin: 1rem 0;
}
.button-container {
	height: 400px;
	border: 1px solid #dcdfe6;
	margin-top: 20px;
	width: 100%;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	padding: 20px;
}
.run-button {
	display: block;
	margin: 0 0 0 auto;
}
.content-container {
	margin: 20px 0px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}
.table-footer {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 10px 10px 10px 0;
	border-bottom: 1px solid #dcdfe6;
	border-left: 1px solid #dcdfe6;
	border-right: 1px solid #dcdfe6;
	border-radius: 4px;
}
.entry-data-container,
.TIM-container {
	width: 45%;
}
.options-container {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	margin-bottom: 1rem;
}
.history-container {
	margin-top: 10px;
	border: 1px solid #dcdfe6;
}
.el-table /deep/ th,
.el-table /deep/ td {
	text-align: center;
}
</style>
