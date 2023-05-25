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
	</div>
</template>

<script>
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import moment from "moment";
import {
  getIndexsList,
  getStocksList
} from '@/service/service.js'
const uniqWith = require('lodash/uniqWith')
const isEqual = require('lodash/isEqual')
export default {
  data() {
    return {
      dialogDateVisible: false, // 弹框可见性
      entryDates: [{
        value: '2023-5-9',
        placeholder: 'select entry date1',
        readonly: false
      },
      {
        value: '2023-5-10',
        placeholder: 'select entry date2',
        readonly: false
      }], // 存储选择的日期数组
      tradesData: [],
      showTable: false,
      editTIMData: [
        {
          period: '1',
          placeholder: 'input period1',
          timeframe: 'Day',
          readonly: false
        },
        {
          period: '1',
          placeholder: 'input period2',
          timeframe: 'Week',
          readonly: false
        }
      ],
      activeTIM: 'first',
      defaultTIMTableLabels: [],
      TIMHistoryList: [],
      symbol: 'SPY',
      options: [],
      symbolList: [],
      indexList: [],
      loading: false,
      direction: 'Long',
      pickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          // 获取限制日期
          // const restrictionDate = new Date('2023-05-01');
          // restrictionDate.setHours(0, 0, 0, 0);
          // 比较时间戳
          // return time.getTime() > currentDate.getTime() || time.getTime() < restrictionDate.getTime();
          return time.getTime() > currentDate.getTime()
        }
      }
    }
  },
  methods: {
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
        this.$message.warning('Cannot add more than 10 rows.')
        return
      }
      const newRow = {
        period: '1',
        timeframe: 'Day',
        placeholder: `input period${this.editTIMData.length + 1}`,
        readonly: false
      };
      this.editTIMData.push(newRow);
    },
    addDateRow() {
      if (this.entryDates.length >= 10) {
        this.$message.warning('Cannot add more than 10 rows.')
        return
      }
      const newRow = {
        value: '',
        placeholder: `select entry date${this.entryDates.length + 1}`,
        readonly: false
      };
      this.entryDates.push(newRow)
      console.log(this.entryDates)
    },
    getValues() {
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
        const isValid = this.validateData(periodArray)
        if (!isValid) {

          CIQ.hideCover()
          CIQ.nprogress.done()
          return
        }
        const uniqueData = [];
        periodArray.forEach(item => {
          const isDuplicate = uniqueData.some(
            uniqueItem =>
              uniqueItem.period === item.period && uniqueItem.timeframe === item.timeframe
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
        // this.calculateZScore(this.tradesData, periodArray)
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
        { period: '1', placeholder: 'input period1', timeframe: 'Day', readonly: false },
        { period: '1', placeholder: 'input period2', timeframe: 'Week', readonly: false }
      ]
    },
    validateData(data) {
      for (const item of data) {
        if (item.timeframe === 'Day' || item.timeframe === 'Days') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 252 || !Number.isInteger(Number(item.period))) {
            this.$message.warning('When the Timeframe is selected as Day(s), only positive integers between 1 and 252 are allowed to be entered.');
            return false;
          }
        }
        if (item.timeframe === 'Week' || item.timeframe === 'Weeks') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 52 || !Number.isInteger(Number(item.period))) {
            this.$message.warning('When the Timeframe is selected as Week(s), only positive integers between 1 and 52 are allowed to be entered.');
            return false;
          }
        }
        if (item.timeframe === 'Month' || item.timeframe === 'Months') {
          const period = parseInt(item.period);
          if (isNaN(period) || period < 1 || period > 120 || !Number.isInteger(Number(item.period))) {
            this.$message.warning('When the Timeframe is selected as Month(s), only positive integers between 1 and 120 are allowed to be entered.');
            return false;
          }
        }
      }
      return true;
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
        placeholder: `select entry date${this.entryDates.length + 1}`,
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
          console.log('transformData', transformData)
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
    runTIM() {
      this.saveTable()
    }
  }
};
</script>

<style scoped>
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
	align-items: center;
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
