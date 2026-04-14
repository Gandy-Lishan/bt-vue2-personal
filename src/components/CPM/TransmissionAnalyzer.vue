<template>
  <div class="symbol-correlation">
    <el-form :model="data" size="small" status-icon :rules="rules" ref="Form" class="symbol-correlation-form" label-position="top">
      <el-row :gutter="24">
        <el-col :span="8"  :xs="24"  :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item label="1. Designated Ticker" prop="benchmark">
            <SearchAutocomplete
              ref="autocomplete"
              v-model="data.benchmark"
              @query="querySearch"
              @select="item => getBenchMark(item)"
              placeholder="Select Ticker"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" :xs="24"  :sm="12" :md="8" :lg="8" :xl="8">
            <!-- <el-form-item label="2. Date Range" prop="dateRange">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="to"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              :picker-options="pickerOptions"
              @change="handleDateChange">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item prop="cpm_period" label="2. Date Range" class="dateRange">
            <el-select
              @change="setPeriod(cpm_period)"
              v-model="cpm_period"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        <el-row :gutter="20">
          <div :class="{hidePicker: cpm_period !== 'custom', 'picker-container': true}" v-if="cpm_period === 'custom'">
            <el-col :span="12" :xs="24"  :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="start_date" label="" class="dateSelect">
            <el-date-picker
              v-model="data.start_date"
              type="date"
              placeholder="Select Start Date"
              value-format="yyyy-MM-dd"
              :picker-options="startPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
         </el-col>
         <el-col :span="12" :xs="24"  :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="end_date" label="" class="dateSelect">
              <el-date-picker
                v-model="data.end_date"
                type="date"
                placeholder="Select End Date"
                value-format="yyyy-MM-dd"
                :picker-options="endPickerOptions"
              >
              </el-date-picker>
          </el-form-item>
         </el-col>
          </div>
          <div v-else style="height: 50px;"></div>
        </el-row>
        </el-col>
        <el-col :span="8" :xs="24"  :sm="12" :md="8" :lg="8" :xl="8">
          <el-form-item prop="cpm_period" label="3. Time Frame" class="dateRange">
            <el-select
              v-model="data.roll_window"
            >
              <el-option
                v-for="item in rollWindowOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-row :gutter="20">
          <div v-if="data.roll_window === 'custom'">
            <el-col :span="24" :xs="24"  :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="" prop="barsNumber">
                <el-input v-model="data.barsNumber">
                  <template v-slot:append>
                    Bars (≥21 and ≤252)
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
        </div>
          <div v-else style="height: 50px;"></div>
        </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24" :xs="24"  :sm="24" :md="24" :lg="24" :xl="24">
          <el-form-item label="4. Comparison Ticker" prop="comparison_ticker">
            <div class="ticker-select">
              <SearchAutocomplete
                ref="autocomplete"
                v-model="symbol"
                @query="querySearch"
                @select="item => getSymbol(item)"
                placeholder="Select Ticker"
              />
          <div class="tickerTag">
            <el-tag
            :key="tag"
            size="small"
            v-for="(tag) in stock_comparison"
            :disable-transitions="false"
            closable
            @close="handleClose(tag)"
            effect="dark">
            {{tag}}
          </el-tag>
          </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="8"  :xs="24"  :sm="24" :md="8" :lg="8" :xl="8"></el-col>
        <el-col :span="8" :xs="24"  :sm="8" :md="8" :lg="182" :xl="8">
          <el-button type="warning" @click="resetForm('Form')" size="small">Clear Form</el-button>
        </el-col>
        <el-col :span="8" :xs="24"  :sm="8" :md="8" :lg="8" :xl="8">
          <el-button type="primary" @click="submitForm('Form')" size="small" :loading="btnLoading">View Beta</el-button>
        </el-col>
        <el-col :span="8" :xs="24"  :sm="8" :md="8" :lg="8" :xl="8">
        </el-col>
      </el-row>
      <el-form-item>
      </el-form-item>
    </el-form>
    <div class="correlation-table ScannerBTTable" v-show="showCorrMatrix">
      <div class="correlation-table-header">
      <h2 style="margin-bottom: 0px" v-text="corrMatrixText"></h2>
      <div class="downLoadCsvBtn">
        <el-button
          @click="handleDownloadCsv"
          style="display: inline-block"
          size="small"
          type="primary"
          icon="el-icon-download"
          title="Export Rolling Correlations Data">
        </el-button>
      </div>
      </div>
      <div class="dateRangeText"><span v-html="correlationDateRange"></span></div>
      <el-table
      header-align="center"
      :data="corr_matrix"
    >
			<template v-for="(l, index) in columns">
        <el-table-column
        	:label="l.label"
					:prop="l.value"
          :key="index"
          align="center"
        >
        <template slot-scope="scope">
          {{ scope.row[l.value] == '1' ?  '-' : (scope.row[l.value] || '')}}
        </template>
      </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="symbol-correlation-chart">
      <div id="chart-container" style="height: 900px;"></div>
    </div>
  </div>
</template>

<script>
import {createStateFilter} from '@/utils/globalFunc'
import { isJson, timestampToTime } from '@/utils'
import { saveTransmissionAnalyzer, getPairData } from "@/service/service";
import Highcharts from 'highcharts/highstock';
 import 'highcharts/indicators/indicators';
 import 'highcharts/indicators/bollinger-bands';
import moment from 'moment';
import { SearchAutocomplete } from "@/components/common"

export default {
  name: 'SymbolCorrelation',
  components: {
    SearchAutocomplete
  },
  data() {
    let validateBarsNum = (rule, value, callback) => {
      console.log('lishan', value)
        if (value < 21 || value > 252) {
          return callback(new Error('The number of bars should be between 21 and 252, please change your date range.'));
        } else {
          callback();
        }
    };
      return {
        data: {
          start_date: '',
          end_date: '',
          benchmark: 'AAPL',
          roll_window: 21,
          barsNumber: ''
        },
        stock_comparison: [],
        symbol: '',
        dropdownList: [],
        dateRange: [],
        btnLoading: false,
        cpm_period: 'all',
        correlationDateRange: '',
        corrMatrixText: '',
        corr_matrix: [],
        columns: [],
        barsNumber: '',
        beta_roll: null,
        options: [
        {
          value: 1,
          label: '1 Year'
        },
        {
          value:  2,
          label: '2 Year'
        },
        {
          value: 3,
          label: '3 Year'
        },
        {
          value: 5,
          label: '5 Year'
        },
        {
          value: 'all',
          label: 'All History...'
        },
        {
          value: 'custom',
          label: 'Custom...'
        }
      ],
      rollWindowOptions: [
        // {
        //   value: 21,
        //   label: 'Short'
        // },
        // {
        //   value: 63,
        //   label: 'Medium'
        // },
        // {
        //   value: 126,
        //   label: 'Long'
        // },
        {
          value: 21,
          label: '21 Bars'
        },
        {
          value: 42,
          label: '42 Bars'
        },
        {
          value: 63,
          label: '63 Bars'
        },
        {
          value: 126,
          label: '126 Bars'
        },
        {
          value: 252,
          label: '252 Bars'
        },
        {
          value: 'custom',
          label: 'Custom...'
        }
      ],
        pickerOptions: {
          shortcuts: [
            {
              text: '1 Year',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setFullYear(start.getFullYear() - 1); // 过去1年
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '2 Years',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setFullYear(start.getFullYear() - 2); // 过去2年
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '3 Years',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setFullYear(start.getFullYear() - 3); // 过去3年
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '5 Years',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setFullYear(start.getFullYear() - 5); // 过去5年
                picker.$emit('pick', [start, end]);
              }
            }
          ],
        },
        startPickerOptions: {
          disabledDate: this.handleDisabledStartDate
        },
        endPickerOptions: {
          disabledDate: this.handleDisabledEndDate
        },
        rules: {
          benchmark: [
            { required: true, message: 'Enter a designated ticker', trigger: 'blur' },
            { required: true, message: 'Enter a designated ticker', trigger: 'change' }
          ],
          start_date: [
            { required: true, message: 'Select start date', trigger: 'blur' },
            { required: true, message: 'Select start date', trigger: 'change' }
          ],
          end_date: [
            { required: true, message: 'Select end date', trigger: 'blur' },
            { required: true, message: 'Select end date', trigger: 'change' }
          ],
          barsNumber: [
            { validator: validateBarsNum, trigger: 'change' },
            { validator: validateBarsNum, trigger: 'blur' }
          ],
        }
      }
    },
    computed: {
      symbolList() {
        const data = localStorage.getItem('refactoredConcatList');
        return data ? JSON.parse(data) : [];
      },
      showCorrMatrix() {
        return Array.isArray(this.corr_matrix) && this.corr_matrix.length !== 0
      }
    },
    mounted() {
      this.dropdownList = this.symbolList
      this.attachScrollListener()
      this.setPeriod(this.cpm_period)
    },
    methods: {
      validateDateRange(value) {
      if ((value && value.length === 2)) {
        if(!Array.isArray(value)) callback(); // 校验成功
        const startDate = new Date(value[0]);
        const endDate = new Date(value[1]);

        // 计算日期差（单位：毫秒）
        const diffTime = endDate - startDate;

        // 转换为月差，假设一个月有30天
        const diffMonths = diffTime / (1000 * 3600 * 24 * 30);

        // 如果时间差小于3个月，则返回错误
        if (diffMonths < 3) {
          this.popUpMsgBox('The date range must be at least 3 months')
        } else {
          return true
        }
      } else {
        this.popUpMsgBox('Please select a date range')
      }
     },
      handleDisabledStartDate(time) {
        const today = timestampToTime(new Date())
        const endDay = timestampToTime(new Date(this.data.end_date))
        // 如果endDate取消选择，则startDate可以选择全部
        if(this.data.end_date){
          return timestampToTime(time) >= endDay
        }else{
          return (timestampToTime(time) > today)
        }
      },
      handleDisabledEndDate(time) {
        const today = timestampToTime(new Date())
        const startDay = timestampToTime(new Date(this.data.start_date))
        return (timestampToTime(time) > today) || (timestampToTime(time) <= startDay)
      },

    async validForm(formName) {
      const validateForm = async (formRef) => {
        return new Promise(resolve => {
          this.$refs[formRef].validate(valid => {
            resolve(valid);
          });
        });
      };

      return await validateForm(formName);
    },
    async saveFormData() {
      if(this.stock_comparison.length === 0) {this.popUpMsgBox('Please select at least one ticker');return}
      // const validate = this.validateDateRange(this.dateRange)
      // if(!validate) return
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly')
        return
      }                                     
      const saveData = {
        ...this.data,
        stock_comparison: JSON.stringify(this.stock_comparison)
      }
      if(this.cpm_period === 'all') {
        saveData.start_date = '1800-10-01'
        saveData.end_date = timestampToTime(new Date())
      }
      if(saveData.roll_window === 'custom') {
        saveData.roll_window = saveData.barsNumber
      }
      delete saveData.barsNumber
      return await saveTransmissionAnalyzer(saveData)
    },
    async submitForm() {
      debugger
      this.btnLoading = true
      let saveRes = null
      try {
        saveRes = await this.saveFormData()
        console.log('saveRes', saveRes)
        if (typeof saveRes.data == 'string') {
          // 将 NaN 替换为 null
          saveRes.data = saveRes.data.replace(/NaN/g, 'null');
        }
        try {
          saveRes.data = JSON.parse(saveRes.data)
        } catch (error) {
          console.log('error', error)
        }
        let {start_date, end_date, benchmark} = this.data
        if(this.cpm_period === 'all') {
          start_date = '1800-10-01'
          end_date = timestampToTime(new Date())
        }
        console.log('saveRes', saveRes.data)
      } catch (error) {
        this.btnLoading = false
      }
      
     if(!saveRes) { this.btnLoading = false; return}
     const code = saveRes.data.code
     const name = saveRes.data?.data?.name
     const _name = typeof name === 'string' && name ? name : ''
     if(code == 203 && this.processTips) this.popUpMsgBox(`View failed, Please try again`)
     if(code == 401) this.popUpMsgBox('Calculate error')
     if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('View failed, Please try again')}
     if(code == 406) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407 || code === 411) this.popUpMsgBox('No results found.')
      if(code !== 211) this.popUpMsgBox('No results found. Adjust the parameters and view again.')
      if(code == 211) {
        this.popUpMsgBox(`Completed successfully`)
        const chartData =  saveRes.data?.data
        // 这里要开始画图
        const {corr_matrix, beta_roll} = chartData
        this.beta_roll = beta_roll || null
        if(Array.isArray(corr_matrix)) {
          const formatDate = (dateStr) => {
            return moment.parseZone(dateStr).format('MMM D, YYYY');
          }
          let {start_date, end_date, benchmark} = this.data
          if(Array.isArray(beta_roll) && beta_roll.length !== 0) {
            start_date = moment.utc(beta_roll[0].Date).format('YYYY-MM-DD')
            end_date = moment.utc(beta_roll[beta_roll.length - 1].Date).format('YYYY-MM-DD')
          }
          const {cpm_period} = this
          if(cpm_period === 'all') this.correlationDateRange = `Until ${formatDate(end_date)}`
          else this.correlationDateRange = `${formatDate(start_date)} - ${formatDate(end_date)}`
          this.corrMatrixText = `Correlation Matrix | ${benchmark}`
          const columns = Array.from(Object.keys(corr_matrix[0])).map(column => {
            let columnLabel = column
            if(column === 'index') columnLabel = 'Ticker'
            return {
              label: columnLabel,
              value: column,
              labelHtml: column
            }
          })
          this.columns = columns
          this.corr_matrix = corr_matrix
        }
        this.renderChart(beta_roll)
      }
      // 只要是错误状态码都要清空 filterList 和 result 数据
      if([400, 401, 404, 403, 406, 407, 411].includes(code)) this.btnLoading = false
      this.btnLoading = false
    },
      resetForm(formName) {
        this.data = {
          start_date: '',
          end_date: '',
          benchmark: 'AAPL',
          roll_window: 21
        }
        this.cpm_period = 'all'
        this.stock_comparison = []
        this.$refs[formName].clearValidate()
      },
      getSymbol(ticker) {
        this.$nextTick(()=>{
          this.symbol = ''
          // 往标签数组里面推送
          if(this.stock_comparison.length >= 1) {this.popUpMsgBox(`You can only select up to 1 ticker`);return};
          const tickerUrl = ticker.url
          if(this.stock_comparison.includes(tickerUrl)) {this.popUpMsgBox(`Duplicate tickers detected`);return}
          this.stock_comparison.push(ticker.url);
        });
      },
      getBenchMark(ticker) {
        this.$nextTick(()=>{
          this.data.benchmark = ticker.url
        });
      },
      querySearch(queryString, cb) {
      var dropdownList = this.dropdownList
      if(!dropdownList || dropdownList.length == 0) {
        dropdownList = this.symbolList
      }
      var results = dropdownList.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)

      cb(results.sort((a, b) => b.priority - a.priority))
    },
    handleClose(tag) {
      this.stock_comparison.splice(this.stock_comparison.indexOf(tag), 1)
    },
    renderChart(correlationData) {
  const stock_comparison = this.stock_comparison[0]
  if(!stock_comparison) return
  const benchmark = this.data.benchmark; // 比如 'SPY'
  const comparisonPriceKey = `${stock_comparison}_price`;

  // 📈 主图数据（价格）
  const benchmarkData = correlationData.map(item => [
    moment.utc(item.Date).valueOf(),
    item.stock_price
  ]);

  const comparisonPriceData = correlationData.map(item => [
    moment.utc(item.Date).valueOf(),
    item[comparisonPriceKey]
  ]);

  // 📊 副图数据（Beta）
  const betaData = correlationData.map(item => [
    moment.utc(item.Date).valueOf(),
    Number(item[stock_comparison])
  ]);

  // 🎨 颜色
  const baseColor = '#3498db';
      console.log('comparisonPriceData', comparisonPriceData)
  const benchmarkPriceSeries = {
    name: benchmark,
    data: benchmarkData,
    yAxis: 0,
    type: 'line',
    color: '#000000',
    lineWidth: 2,
    marker: { enabled: false },
    tooltip: {
      valueDecimals: 2,
      valuePrefix: '$'
    },
    zIndex: 4
  };

  const stockPriceSeries = {
    name: `${stock_comparison}`,
    data: comparisonPriceData,
    yAxis: 1,
    type: 'line',
    color: '#e74c3c',
    lineWidth: 2,
    marker: { enabled: false },
    tooltip: {
      valueDecimals: 2,
      valuePrefix: '$'
    },
    zIndex: 3
  };

  const betaSeries = {
    name: `Beta`,
    type: 'line',
    yAxis: 2,
    data: betaData,
    lineWidth: 2,
    zIndex: 3,
    marker: { enabled: false },
    zones: [
      {
        value: 0,
        color: baseColor
      },
      {
        color: baseColor
      }
    ],
    tooltip: {
      valueDecimals: 2,
      valueSuffix: " β"
    }
  };

  Highcharts.stockChart("chart-container", {

    chart: {
      zoomType: 'x',
      backgroundColor: 'transparent',
      alignTicks: false // ❗关键：防止左右轴强制同步导致错位
    },

    title: {
      text: "Price & Beta"
    },

    xAxis: {
      type: 'datetime'
    },

    credits: {
      enabled: true,
      text: "Source: SentimenTrader",
      href: 'https://sentimentrader.com',
      position: {
        align: 'right',
        y: -120,
        x: -90
      }
    },

    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'top',
      layout: 'horizontal',
      y: 40,
      itemStyle: {
        fontSize: '12px'
      }
    },

    yAxis: [
  {
    title: { text: `${benchmark}` },
    height: '50%',
    opposite: true,
    offset: 20,
    // alignTicks: false,
    // startOnTick: true,
    // endOnTick: true,
    tickPixelInterval: 40
  },
  {
    title: { text: stock_comparison },
    height: '50%',
    opposite: false,
    offset: -15,

    // alignTicks: false,
    // startOnTick: true,
    // endOnTick: true,
    tickPixelInterval: 40
  },

  // 📊 Beta（下方）
  {
    title: { text: "Beta" },
    top: '50%',
    height: '50%',
    offset: 20,

    // alignTicks: false,
    // startOnTick: true,
    // endOnTick: true,
    tickPixelInterval: 40,

    plotLines: [{
      value: 0,
      color: '#666',
      width: 1.5,
      dashStyle: 'Dash',
      // zIndex: 3
    }]
  }
],

    tooltip: {
      shared: true,
      formatter: function () {
        let s = `<b>${Highcharts.dateFormat('%Y-%m-%d', this.x)}</b><br/>`;

        this.points.forEach(point => {
          const isPrice = point.series.name.includes('Price') || point.series.name === 'Stock Price';

          s += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${isPrice ? '$' : ''}${point.y.toFixed(2)}</b><br/>`;
        });

        return s;
      }
    },

    series: [
    benchmarkPriceSeries,
      stockPriceSeries,
      betaSeries
    ]
  });
},
    handleDateChange() {
      if (this.dateRange && this.dateRange.length === 2) {
        const startDate = new Date(this.dateRange[0]);
        const endDate = new Date(this.dateRange[1]);

        // 计算两个日期之间的时间差（毫秒）
        const diffTime = endDate - startDate;

        // 将毫秒差转换为月数，假设一个月有30天
        const diffMonths = diffTime / (1000 * 3600 * 24 * 30); 

        // 如果时间差小于3个月，给出提示并清空日期选择
        if (diffMonths < 3) {
          this.popUpMsgBox('The date range must be at least 3 months.');
          this.dateRange = []; // 清空日期选择
        }
      }
    },
    setPeriod(period) {
      const end_date = timestampToTime(new Date())
      this.data.end_date = end_date
      if(period !== 'custom') {
        debugger
        const str = end_date.split('-')
        str[0] = Number(str[0]) - this.cpm_period + ''
        const start_date = str.join('-')
        const isLeapYearFeb29 = (date) => {
          const year = date.getFullYear();
          return ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))
        }
        if (!isLeapYearFeb29(new Date(start_date)) && (new Date(start_date).getMonth() === 1 && new Date(start_date).getDate() === 29 )) {
          this.data.start_date = timestampToTime(new Date(start_date).setDate(new Date(start_date).getDate() + 1))
          return
        }
        if(period !==  'all') this.data.start_date = start_date
        else if(period ===  'all') this.data.start_date = ''
      }
    },
    handleDownloadCsv() {
      const beta_roll = this.beta_roll
      if(!beta_roll) {
        this.popUpMsgBox('No data available for download')
        return
      }
      console.log('beta_roll', beta_roll)
      const transformData = (data) => {
        return data.map(item => {
          const keys = Object.keys(item);
          // 删除 stock_price
          const { stock_price, Date, ...rest } = item;

          // 截取日期
          const shortDate = item.Date.substring(0, 10);

          if (keys.length === 3) {
            // 找到动态字段 (非 Date 和 stock_price)
            const dynamicKey = keys.find(k => k !== "Date" && k !== "stock_price");
            return {
              Date: shortDate,
              Close: item[dynamicKey]
            };
          } else {
            // 保持其他字段不变，只更新 Date
            return {
              Date: shortDate,
              ...rest
            };
          }
        });
      }
      const exportData = transformData(beta_roll)
      console.log('exportData', exportData)
      const csvName =  'symbol_correlation_data'
      const _keySort = Array.from(Object.keys(exportData[0]))
      let csvContent = exportData.map(row => _keySort.map(key => `"${row[key]}"`).join(',')).join('\n');
      csvContent = `${_keySort.join(',')}\n${csvContent}`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${csvName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    }
}
</script>

<style lang="less" scoped>
.symbol-correlation-form {
  margin-top: 30px;
  /deep/ .el-form-item__label {
    font-weight: 600;
    color: #000000;
    width: 100%;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
    color: #000000;
    font-weight: 600;
  }
  /deep/ .el-input__inner {
    margin: 0px;
    color: #000000;
    font-weight: 600;
  }
  /deep/ .el-button--warning {
    width: 100%;
    margin-top: 40px;
  }
  /deep/ .el-button--primary {
    width: 100%;
    margin-top: 40px;
  }
  /deep/ .el-form-item__label {
    font-weight: 600;
    color: #000000;
  }
   /deep/ .el-input__inner, /deep/ .el-input-group__append {
    font-weight: 600;
    color: #000000;
  }
  .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--year {
    width: 100%;
  }
  .el-autocomplete {
    width: 100%;
  }
}
.ticker-select {
  display: flex;
  justify-content: center;
  align-items: center;
}
.custom-option {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between;
}
.symbol-url{
  font-size: 12px;
  margin-right: 10px;
  text-align: center;
  color: #999999;
}
.symbol-label {
  font-weight: 500;
}
.tickerTag{
width: 100%;
height: 30px;
display: flex;
align-items: center;
border-radius: 4px;
border-top: unset;
border: 1px solid #DCDFE6;
background-color: #fff;
.el-tag--small{
  text-align: center;
  width: 100px;
  height: 25px;
  line-height: 25px;
  margin-right: 10px;
  background: #5b9bd1;
  border: 1px solid #5b9bd1;
  font-weight: bold;
}
}
/deep/ .el-select {
  width: 100%;
}
.el-form-item.dateRange.el-form-item--feedback.el-form-item--small {
  margin-bottom: 5px;
}
.el-form-item.dateSelect.el-form-item--feedback.is-success.is-required.el-form-item--small {
  margin-bottom: 0px;
}
.picker-container {
  // display: block;
  // visibility: visible;
}
.hidePicker {
  visibility: hidden;
  // display: none;
}
.correlation-table {
  margin-bottom: 30px
}
.symbol-correlation{
  color: #333341;
}
.dateRangeText {
  font-size: 14px;
  font-weight: 400;
  color: grey
}
.correlation-table-header {
  display: flex;
  align-items: flex-end;
  .downLoadCsvBtn {
    margin-left: 10px;
  }
}
.symbol-correlation-chart {
  margin-top: 50px;
}
</style>