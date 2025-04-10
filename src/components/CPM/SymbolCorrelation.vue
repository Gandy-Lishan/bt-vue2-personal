<template>
  <div class="symbol-correlation">
    <el-form :model="data" size="small" status-icon :rules="rules" ref="Form" class="symbol-correlation-form" label-position="top">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="1. Designated Ticker" prop="benchmark">
            <el-autocomplete
                ref="autocomplete"
                class="inline-input"
                v-model="data.benchmark"
                :fetch-suggestions="querySearch"
                placeholder="Select Ticker"
                clearable
                @select="
                  (item) => {
                    getBenchMark(item)
                  }
                "
              >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <!-- 使用 scoped slot 自定义选项 -->
                <template slot-scope="{ item }">
                  <div class="custom-option">
                    <span class="symbol-label">{{
                      item.url
                    }}</span>
                    <span class="symbol-url">{{
                      item.label
                    }}</span>
                  </div>
                </template>
              </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
            <el-col :span="12">
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
         <el-col :span="12">
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
        <el-col :span="8">
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
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="4. Comparison Ticker" prop="comparison_ticker">
            <div class="ticker-select">
              <el-autocomplete
                ref="autocomplete"
                class="inline-input"
                v-model="symbol"
                :fetch-suggestions="querySearch"
                placeholder="Select Ticker"
                clearable
                @select="
                  (item) => {
                    getSymbol(item)
                  }
                "
              >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <!-- 使用 scoped slot 自定义选项 -->
                <template slot-scope="{ item }">
                  <div class="custom-option">
                    <span class="symbol-label">{{
                      item.url
                    }}</span>
                    <span class="symbol-url">{{
                      item.label
                    }}</span>
                  </div>
                </template>
              </el-autocomplete>
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
        <el-col :span="8"></el-col>
        <el-col :span="8">
          <el-button type="warning" @click="resetForm('Form')" size="small">Clear Form</el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="submitForm('Form')" size="small" :loading="btnLoading">View Correlation</el-button>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
      <el-form-item>
      </el-form-item>
    </el-form>
    <div class="correlation-table ScannerBTTable" v-show="showCorrMatrix">
      <h2 style="margin-bottom: 0px" v-text="corrMatrixText"></h2>
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
      <div id="chart-container" style="height: 600px;"></div>
    </div>
  </div>
</template>

<script>
import {createStateFilter} from '@/utils/globalFunc'
import { timestampToTime } from '@/utils'
import { saveSymbolCorrelation } from "@/service/service";
import Highcharts from 'highcharts/highstock';
 import 'highcharts/indicators/indicators';
 import 'highcharts/indicators/bollinger-bands';
import moment from 'moment';

export default {
  name: 'SymbolCorrelation',
  data() {
      return {
        data: {
          start_date: '',
          end_date: '',
          benchmark: 'AAPL',
          roll_window: 21
        },
        // 自定义动态渲染下拉栏
        searchResults: [],
        currentPage: 1,
        pageSize: 20,
        hasMore: true, // 是否还有更多数据
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
    attachScrollListener() {
      const refs = ['autocomplete']; // 要监听的下拉框的 ref 名称

      refs.forEach(refName => {
        const inputDropdown = this.$refs[refName]?.$refs.suggestions?.$el?.childNodes[0]?.childNodes[0]; // 获取下拉框的 DOM
        if (inputDropdown) {
          inputDropdown.addEventListener("scroll", (event) => this.handleDropdownScroll(event, refName));
        }
      });
    },
    handleDropdownScroll(event, inputType) {
      var self = this;
      const dropdown = event.target;
      // 根据传入的 inputType 访问不同的 ref
      const inputRef = self.$refs[inputType];

      if (
        dropdown.scrollHeight - dropdown.scrollTop - 10 <
        dropdown.clientHeight
      ) {
        // 判断是否有更多数据
        if (!this.hasMore) return;

        // 记录滚动位置
        const currentScrollTop = dropdown.scrollTop;

        self.currentPage++;
        self.loadMore((results) => {
            inputRef.$data.suggestions = results;

            // 恢复滚动位置
            requestAnimationFrame(() => {
                dropdown.scrollTop = currentScrollTop;
            });
        });
      }
    },
    loadMore(cb) {
      // 根据页码从过滤后的结果中分页
      console.log('paginated results',this.currentPage, this.searchResults.length)
      const paginatedResults = this.searchResults.slice(0, this.currentPage * this.pageSize);
      if(this.currentPage * this.pageSize > this.searchResults.length) this.hasMore = false
      // 将分页后的数据传递给 closure
      cb(paginatedResults);
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
      return await saveSymbolCorrelation(saveData)
    },
    async submitForm() {
      debugger
      this.btnLoading = true
      let saveRes = null
      try {
        saveRes = await this.saveFormData()
        console.log('saveRes', saveRes)
      } catch (error) {
        this.btnLoading = false
      }
      
     if(!saveRes) { this.btnLoading = false; return}
     const code = saveRes.data.code
     const name = saveRes.data?.data?.name
     const _name = typeof name === 'string' && name ? name : ''
     if(code == 203 && this.processTips) this.popUpMsgBox(`The "${_name}" backtest is running. You can wait or click the "+" button to create a new backtest`)
     if(code == 401) this.popUpMsgBox('Calculate error')
     if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('View failed, Please try again')}
     if(code == 406) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407) this.popUpMsgBox('Empty backtest list. Please adjust "Filter Criteria" and run again')
      if(code !== 211) this.popUpMsgBox('No results found. Adjust the parameters and view again.')
      if(code == 211) {
        this.popUpMsgBox(`Completed successfully`)
        const chartData =  saveRes.data?.data
        // 这里要开始画图
        const {corr_matrix, corr_roll} = chartData
        if(Array.isArray(corr_matrix)) {
          const formatDate = (dateStr) => {
            return moment.parseZone(dateStr).format('MMM D, YYYY');
          }
          let {start_date, end_date, benchmark} = this.data
          if(Array.isArray(corr_roll) && corr_roll.length !== 0) {
             start_date = moment.utc(corr_roll[0].Date).format('YYYY-MM-DD')
             end_date = moment.utc(corr_roll[corr_roll.length - 1].Date).format('YYYY-MM-DD')
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
        this.renderChart(corr_roll)
      }
      // 只要是错误状态码都要清空 filterList 和 result 数据
      if([400, 401, 404, 403, 406, 407].includes(code)) this.btnLoading = false
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
        console.log('ticker', ticker)
        this.symbol = ''
        // 往标签数组里面推送
        if(this.stock_comparison.length >= 5) {this.popUpMsgBox(`You can only select up to 5 tickers`);return};
        const tickerUrl = ticker.url
        if(this.stock_comparison.includes(tickerUrl)) {this.popUpMsgBox(`Duplicate tickers detected`);return}
        this.stock_comparison.push(ticker.url);
      },
      getBenchMark(ticker) {
        this.data.benchmark = ticker.url
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

      this.searchResults = results.sort((a, b) => b.priority - a.priority)
      this.currentPage = 1;
      this.hasMore = true;
      this.loadMore(cb)
    },
    loadMore(cb) {
      // 根据页码从过滤后的结果中分页
      console.log('paginated results',this.currentPage, this.searchResults.length)
      const paginatedResults = this.searchResults.slice(0, this.currentPage * this.pageSize);
      if(this.currentPage * this.pageSize > this.searchResults.length) this.hasMore = false
      // 将分页后的数据传递给 closure
      cb(paginatedResults);
    },
    handleClose(tag) {
      this.stock_comparison.splice(this.stock_comparison.indexOf(tag), 1)
    },
    renderChart(data) {
      // 提取所有的字段名，排除 "Date" 字段
      const fieldNames = Object.keys(data[0]).filter(field => field !== "Date");

      // 动态构建所需格式的数组
      const seriesData = fieldNames.map(field => ({
        name: field,
        data: data.map(item => {
          const datatime = new Date(item['Date'])
          // 使用 UTC 时间来确保一致性
          const utcTimestamp = Date.UTC(
            datatime.getUTCFullYear(),
            datatime.getUTCMonth(),
            datatime.getUTCDate(),
            datatime.getUTCHours(),
            datatime.getUTCMinutes(),
            datatime.getUTCSeconds()
          );
          return [utcTimestamp, item[field]]
        }),
        marker: {
          enabled: false
        }
      }));
      // 随机生成每条线的颜色
      // const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

      // 配置 Highcharts 图表
      const basicChartOptions = {
        zoomType: 'x',
        pinchType: '',
        style: {
          "fontFamily": "Open Sans , sans-serif"
        },
        animation: false,
        alignTicks: false,
        backgroundColor: 'transparent',
        renderTo: 'charts',
        spacingRight: 50,
      }
      Highcharts.stockChart("chart-container", { // 使用 stockChart 类型
          chart: basicChartOptions,
          plotOptions: {
            series: {
              states: {
                hover: {
                  enabled: false
                },
                inactive: {
                  enabled: false
                }
              },
              showInNavigator: true,
              connectNulls: false, // 禁用连接 null 数据点
              pointStart: undefined,  // 确保不会有自动起点
              pointInterval: undefined,  // 确保不会有自动间隔
            }
          },
          tooltip: {
            xDateFormat: '%m-%d-%Y',
            followTouchMove: true,
            shared: true,
            useHTML: true,
            crosshairs: true,
            formatter: function () {
              let s = `${Highcharts.dateFormat('%m-%d-%Y', this.x)}<br>`;
              this.points.forEach(point => {
                // Add a colored circle before the series name
                const colorSpan = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${point.series.color}; border-radius: 50%; margin-right: 5px;"></span>`;
                s += `${colorSpan}<span>${point.series.name}</span>: <b>${point.y.toFixed(2)}</b><br>`;
              });
              return s;
            }
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
            x: 0,
            y: 40,
            itemStyle: {
              fontSize: '10px' // 字体大小
            },
          },
          title: {
            text: "Rolling Correlations",
            style: {
                fontSize: '18px',    // 字体大小
                fontWeight: 'bold',  // 字体加粗
                fontFamily: 'Arial, sans-serif' // 字体类型
            }
          },
          xAxis: {
           type: 'datetime',
           ordinal: false,
           crosshair: { label: { enabled: false } },
          tickPositions: null,
          uniqueNames: false, // 确保只使用你传入的时间点
           labels: {
             formatter: function() {
               const range = this.axis.max - this.axis.min;

               // 设置不同时间范围下的格式
               if (range > 3 * 365 * 24 * 3600 * 1000) {
                 // 大于 3 年，显示年份
                 return Highcharts.dateFormat('%Y', this.value);
               } else if (range > 365 * 24 * 3600 * 1000) {
                 // 1 - 3 年，显示季度
                 return Highcharts.dateFormat('%Y %b', this.value);
               } else if (range > 30 * 24 * 3600 * 1000) {
                 // 1 - 12 个月，显示月份和天
                 return Highcharts.dateFormat('%b %d', this.value);
               } else if (range > 7 * 24 * 3600 * 1000) {
                 // 7 - 30 天，显示具体日期
                 return Highcharts.dateFormat('%b %e', this.value);
               } else {
                 // 小于 7 天，显示小时和日期
                 return Highcharts.dateFormat('%b %e, %H:%M', this.value);
               }
             }
           },
          // plotBands: plotBands,
         },
          yAxis: {
            title: {
              text: "Correlation"
            },
            min: -1,
            max: 1
          },
          rangeSelector: {
            inputEnabled: true,
            inputDateFormat: '%Y/%m/%d',
            inputEditDateFormat: '%Y/%m%d',
            buttons: [
              { type: 'month', count: 3, text: '3m' },
              { type: 'month', count: 6, text: '6m' },
              { type: 'ytd', text: 'YTD' },
              { type: 'year', count: 1, text: '1y' },
              { type: 'year', count: 3, text: '3y' },
              { type: 'year', count: 5, text: '5y' },
              { type: 'year', count: 10, text: '10y' },
              { type: 'year', count: 15, text: '15y' },
              { type: 'year', count: 20, text: '20y' },
              { type: 'all', text: 'All' }
            ],
            selected: 5 // Sets the default selected button (4 corresponds to '1y')
          },
          exporting: {
            enabled: true,
            buttons: {
              contextButton: {
                menuItems: [
                  'printChart',
                  'downloadPNG',
                  'downloadJPEG',
                  'downloadPDF'
                ] 
              }
            }
          },
          navigator: {
            enabled: true,
            series: {
              color: '#2f7ed8'  // Set the color to match the bottom series
            },
            xAxis: {
              type: 'datetime', // 设置为 datetime 类型
              crosshair: { label: { enabled: false } },
              ordinal: false,
              labels: { format: '{value:%Y}' },
              tickPositions: null,
              uniqueNames: false, // 确保只使用你传入的时间点
            }
          },
          series: seriesData.map(series => ({
            ...series,
            type: 'line',
            tooltip: {
              valueSuffix: " correlation"
            }
          }))
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
    }
    }
}
</script>

<style lang="less" scoped>
.symbol-correlation-form {
  margin-top: 30px;
  /deep/ .el-form-item__label {
    font-weight: 600;
    color: #333;
    width: 100%;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  /deep/ .el-input__inner {
    margin: 0px;
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
    color: #333;
  }
  /deep/ .el-button--primary, /deep/ .el-input__inner, /deep/ .el-input-group__append {
    font-weight: 600;
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
</style>