<template>
  <div class="symbol-correlation">
    <el-form :model="data" size="small" status-icon :rules="rules" ref="Form" class="symbol-correlation-form" label-position="top">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="1. Symbol(1)" prop="referenceSymbol">
            <SearchAutocomplete
              ref="autocomplete"
              v-model="data.referenceSymbol"
              @query="querySearch"
              @select="item => getReferenceSymbol(item)"
              placeholder="Select Reference Ticker"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="2. Date Range for Symbol(1)" class="dateSelect">
            <el-row :gutter="20">
            <el-col :span="12">
            <el-form-item prop="referenceStartDate" label="" class="dateSelect">
              <el-date-picker
                v-model="data.referenceStartDate"
                type="date"
                placeholder="Select Reference Date"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="referenceEndDate" label="" class="dateSelect">
                  <el-date-picker
                    v-model="data.referenceEndDate"
                    type="date"
                    placeholder="Select Reference End Date"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
              </el-form-item>
            </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="3. Symbol(2)" prop="comparisonSymbol">
            <SearchAutocomplete
              ref="autocomplete"
              v-model="data.comparisonSymbol"
              @query="querySearch"
              @select="item => getComparisonSymbol(item)"
              placeholder="Select Comparison Ticker"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="4. Date Range for Symbol(2)" class="dateSelect">
            <el-row :gutter="20">
            <el-col :span="12">
            <el-form-item prop="comparisonStartDate" label="" class="dateSelect">
              <el-date-picker
                v-model="data.comparisonStartDate"
                type="date"
                placeholder="Select Comparison Start Date"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comparisonEndDate" label="" class="dateSelect">
                  <el-date-picker
                    v-model="data.comparisonEndDate"
                    type="date"
                    placeholder="Select Comparison End Date"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
              </el-form-item>
            </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" type="flex" justify="center">
        <el-col :span="8"></el-col>
        <el-col :span="8">
          <el-button type="warning" @click="resetForm('Form')" size="small">Reset Form</el-button>
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
      <h3 v-if="patternCorrelation" style="text-align: center;">{{patternCorrelation}}
        <el-tooltip effect="dark" placement="top" style="display: inline">
          <span slot="content" v-html="patternCorrelationTooltip">
          </span>
          <i class="iconfont icon-wenhao"></i>
        </el-tooltip>
      </h3>
      <div id="google-chart-container" style="height: 400px;"></div>
      <div id="apple-chart-container" style="height: 400px;"></div>
    </div>
  </div>
</template>

<script>
import { timestampToTime } from '@/utils'
import { savePatternCorrelation, getPairData } from "@/service/service";
import Highcharts from 'highcharts/highstock';
 import 'highcharts/indicators/indicators';
 import 'highcharts/indicators/bollinger-bands';
import moment from 'moment';
import { SearchAutocomplete } from "@/components/common"
import {createStateFilter} from '@/utils/globalFunc'

export default {
  name: 'PatternCorrelation',
  components: {
    SearchAutocomplete
  },
  data() {
      return {
        data: {
          referenceSymbol: 'SPX',
          referenceStartDate: '2017-01-01',
          referenceEndDate: '2017-05-01',
          comparisonStartDate: '2020-01-01',
          comparisonEndDate: '2020-04-01',
          comparisonSymbol: 'SPX',
        },
        dropdownList: [],
        dateRange: [],
        btnLoading: false,
        correlationDateRange: '',
        corrMatrixText: '',
        corr_matrix: [],
        columns: [],
        patternCorrelationTooltip: `
        This score measures the similarity between the two price patterns on a scale of 0% to 100%. It considers both the shape and the directional correlation of the trends.
        <li><b>High Score (> 75%):</b> Indicates a strong positive similarity. The patterns have a very similar shape and tend to move in the same direction.</li>
        <li><b>Mid-Range Score (~50%):</b> Indicates no significant similarity or correlation. The patterns' movements are likely unrelated.</li>
        <li><b>Low Score (< 25%):</b> Indicates a strong inverse similarity. The patterns may have a similar shape but move in opposite directions (one trends up while the other trends down).</li>
        `,
        rules: {
          referenceSymbol: [
            { required: true, message: 'Enter a ticker', trigger: 'blur' },
            { required: true, message: 'Enter a ticker', trigger: 'change' }
          ],
          referenceStartDate: [
            { required: true, message: 'Select start date', trigger: 'blur' },
            { required: true, message: 'Select start date', trigger: 'change' }
          ],
          referenceEndDate: [
            { required: true, message: 'Select end date', trigger: 'blur' },
            { required: true, message: 'Select end date', trigger: 'change' }
          ],
          comparisonSymbol: [
            { required: true, message: 'Enter a ticker', trigger: 'blur' },
            { required: true, message: 'Enter a ticker', trigger: 'change' }
          ],
          comparisonStartDate: [
            { required: true, message: 'Select start date', trigger: 'blur' },
            { required: true, message: 'Select start date', trigger: 'change' }
          ],
          comparisonEndDate: [
            { required: true, message: 'Select end date', trigger: 'blur' },
            { required: true, message: 'Select end date', trigger: 'change' }
          ]
        },
        googleData: [], // Google 股票数据
        appleData: [],   // Apple 股票数据
        patternCorrelation: ''
      }
    },
    computed: {
      symbolList() {
        const data = localStorage.getItem('refactoredConcatList');
        return data ? JSON.parse(data) : [];
      },
      showCorrMatrix() {
        return Array.isArray(this.corr_matrix) && this.corr_matrix.length !== 0
      },
    },
    mounted() {
      this.dropdownList = this.symbolList
      this.setPeriod()
      // this.fetchData();
      // this.renderCharts();
    },
    methods: {
      validateDateRange() {
        const {referenceStartDate, referenceEndDate, comparisonStartDate, comparisonEndDate} = this.data
          if(referenceStartDate && referenceEndDate && comparisonStartDate && comparisonEndDate) {
            if (new Date(referenceStartDate) > new Date(referenceEndDate)) {
              [this.data.referenceStartDate, this.data.referenceEndDate] = [this.data.referenceEndDate, this.data.referenceStartDate];
            }
            if (new Date(comparisonStartDate) > new Date(comparisonEndDate)) {
              [this.data.comparisonStartDate, this.data.comparisonEndDate] = [this.data.comparisonEndDate, this.data.comparisonStartDate];
            }
            const today = new Date();
            if (new Date(this.data.referenceEndDate) > today) {
              this.popUpMsgBox('Please ensure that reference date range is not in the future.');
              this.data.referenceEndDate = null
              return false
              // this.data.referenceEndDate = moment(today).format('YYYY-MM-DD')
            }
            if (new Date(this.data.comparisonEndDate) > today) {
              this.popUpMsgBox('Please ensure that comparison date range is not in the future.');
              this.data.comparisonEndDate = null
              return false
              // this.data.comparisonEndDate = moment(today).format('YYYY-MM-DD')
            }
            debugger
          // Validate the date ranges for at least one year apart
          const _referenceStart = new Date(this.data.referenceStartDate);
          const _referenceEnd = new Date(this.data.referenceEndDate);
          const _comparisonStart = new Date(this.data.comparisonStartDate);
          const _comparisonEnd = new Date(this.data.comparisonEndDate);

          const referenceDiff = _referenceEnd - _referenceStart;
          const comparisonDiff = _comparisonEnd - _comparisonStart;

          // Check if the difference is less than one year (in milliseconds)
          const oneYearInMax = 366 * 24 * 60 * 60 * 1000; // Approximate one year in milliseconds
          const oneYearInMin = 6 * 24 * 60 * 60 * 1000; // Approximate one year in milliseconds

          if ((referenceDiff < oneYearInMin || comparisonDiff < oneYearInMin) || (referenceDiff > oneYearInMax || comparisonDiff > oneYearInMax)) {
            this.popUpMsgBox('The date range for both tickers should be at least 1 week and less than 1 year');
            return false;
          }
          return true;
          }
        else {
          this.popUpMsgBox('Please select date range for both tickers');
          return false
        }
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
      const validate = this.validateDateRange()
      if(!validate) return
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly')
        return
      }                                     
      const saveData = {
        ...this.data
      }
      return await savePatternCorrelation(saveData)
    },
    async submitForm() {
      debugger
      this.btnLoading = true
      let saveRes = null
      try {
        saveRes = await this.saveFormData()
        let {referenceStartDate, referenceEndDate, referenceSymbol} = this.data
        console.log('saveRes', saveRes)
      } catch (error) {
        this.btnLoading = false
      }
      
     if(!saveRes) { this.btnLoading = false; return}
     const code = saveRes.data.code
     if(code == 401) this.popUpMsgBox('Calculate error')
     if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('Failed, Please try again')}
     if(code == 406) {
      }
      if(code !== 211) this.popUpMsgBox('No results found. Adjust the parameters and try again.')
      if(code == 211) {
        this.popUpMsgBox(`Success. Rendering chart, please wait...`)
        const pattern_corr =  saveRes.data?.data?.pattern_corr
        if(pattern_corr && this.data.referenceSymbol === this.data.comparisonSymbol) this.patternCorrelation = `${this.data.referenceSymbol}: (${this.data.referenceStartDate} to ${this.data.referenceEndDate}) vs. (${this.data.comparisonStartDate} to ${this.data.comparisonEndDate}): ${pattern_corr}%`
        if(pattern_corr && this.data.referenceSymbol !== this.data.comparisonSymbol) this.patternCorrelation = `${this.data.referenceSymbol} (${this.data.referenceStartDate} to ${this.data.referenceEndDate}) vs. ${this.data.comparisonSymbol} (${this.data.comparisonStartDate} to ${this.data.comparisonEndDate}): ${pattern_corr}%`
        // // 这里要开始画图
        // const {corr_matrix, corr_roll} = CharacterData
        await this.fetchData();
        this.renderCharts();
        // this.renderChart(corr_roll)
      }
      // 只要是错误状态码都要清空 filterList 和 result 数据
      if([400, 401, 404, 403, 406, 407].includes(code)) this.btnLoading = false
      this.btnLoading = false
    },
      resetForm(formName) {
        this.data = {
          referenceSymbol: 'SPX',
          comparisonSymbol: 'SPX'
        }
        this.setPeriod()
        this.$refs[formName].clearValidate()
      },
      getReferenceSymbol(ticker) {
        this.$nextTick(()=>{
          this.data.referenceSymbol = ticker.url
        });
      },
      getComparisonSymbol(ticker) {
        this.$nextTick(()=>{
          this.data.comparisonSymbol = ticker.url
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
    setPeriod() {
      this.data.referenceEndDate = timestampToTime(new Date()) 
      this.data.referenceStartDate = moment(this.data.referenceEndDate).subtract(1, 'years').format('YYYY-MM-DD') // One year before referenceEndDate
      this.data.comparisonEndDate = moment(this.data.referenceEndDate).subtract(1, 'years').format('YYYY-MM-DD') // Two years after referenceEndDate
      this.data.comparisonStartDate = moment(this.data.comparisonEndDate).subtract(1, 'years').format('YYYY-MM-DD') // One year after referenceEndDate
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
    async fetchData() {
      // 这里添加请求 Google 和 Apple 股票数据的逻辑
      // 假设数据已经被赋值到 googleData 和 appleData
      // 你可以使用 axios 或其他 HTTP 库来发送请求
      // 例如：
      // const googleResponse = await axios.get(`YOUR_API_ENDPOINT/google/data?symbol=${this.data.referenceSymbol}&startDate=${this.data.referenceStartDate}&endDate=${this.data.referenceEndDate}`);
      // this.googleData = googleResponse.data;
      // const appleResponse = await axios.get(`YOUR_API_ENDPOINT/apple/data?symbol=${this.data.comparisonSymbol}&startDate=${this.data.comparisonStartDate}&endDate=${this.data.comparisonEndDate}`);
      // this.appleData = appleResponse.data;
      const today = timestampToTime(new Date())
      const referenceRes = await getPairData('1800-10-01', today, 'daily', this.data.referenceSymbol)
      this.googleData = referenceRes.data.map((item) => {
        return {
          Date: item.DT.slice(0, 10),
          Close: item.Close
        }
      }).filter(ele => ele)
      const comparisonRes = await getPairData('1800-10-01', today, 'daily', this.data.comparisonSymbol)
      this.appleData = comparisonRes.data.map((item) => {
        return {
          Date: item.DT.slice(0, 10),
          Close: item.Close
        }
      }).filter(ele => ele)
    },
    renderCharts() {
      // 渲染 Google 股票走势图
      const {
        referenceSymbol, 
        referenceStartDate,
        referenceEndDate,
        comparisonSymbol,
        comparisonStartDate,
        comparisonEndDate
      } = this.data
      const referenceStart = moment(referenceStartDate);
      const referenceEnd = moment(referenceEndDate);
      const referenceMin = referenceStart.clone().subtract(1, 'month').valueOf();
      const referenceMax = referenceEnd.clone().add(1, 'month').valueOf();

      const comparisonStart = moment(comparisonStartDate);
      const comparisonEnd = moment(comparisonEndDate);
      const comparisonMin = comparisonStart.clone().subtract(1, 'month').valueOf();
      const comparisonMax = comparisonEnd.clone().add(1, 'month').valueOf();
      Highcharts.stockChart('google-chart-container', {
        title: {
          text: `${referenceSymbol}`
        },
        series: [{
          name: referenceSymbol,
          data: this.googleData.map(item => [new Date(item.Date).getTime(), parseFloat(item.Close)]),
          tooltip: { valueDecimals: 2 }
        }],
        xAxis: {
          min: referenceMin,
          max: referenceMax,
          plotBands: [{ // 添加垂直阴影区域
            from: moment(referenceStartDate).valueOf(),
            to: moment(referenceEndDate).valueOf(),
            color: 'rgba(68, 170, 213, 0.2)',
            label: { style: { color: '#606060' } }
          }]
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
        tooltip: {
          xDateFormat: '%m-%d-%Y',
          followTouchMove: true,
          shared: true,
          useHTML: true,
          crosshairs: true,
          formatter: function () {
            let s = `<span style="font-weight: 400">${Highcharts.dateFormat('%m-%d-%Y', this.x)}</span><br>`;
            this.points.forEach(point => {
              const colorSpan = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${point.series.color}; border-radius: 50%; margin-right: 5px;"></span>`;
              s += `${colorSpan}<span style="font-weight: 400">${point.series.name}</span>: <b>${point.y.toFixed(2)}</b><br>`;
            });
            return s;
          }
        },
      });

      // 渲染 Apple 股票走势图
      Highcharts.stockChart('apple-chart-container', {
        title: {
          text: `${comparisonSymbol}`
        },
        series: [{
          name: comparisonSymbol,
          data: this.appleData.map(item => [new Date(item.Date).getTime(), parseFloat(item.Close)]),
          tooltip: { valueDecimals: 2 }
        }],
        xAxis: {
          min: comparisonMin,
          max: comparisonMax,
          plotBands: [{ // 添加垂直阴影区域
            from: moment(comparisonStartDate).valueOf(),
            to: moment(comparisonEndDate).valueOf(),
            color: 'rgba(68, 170, 213, 0.2)',
            label: { style: { color: '#606060' } }
          }]
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
        tooltip: {
          xDateFormat: '%m-%d-%Y',
          followTouchMove: true,
          shared: true,
          useHTML: true,
          crosshairs: true,
          formatter: function () {
            let s = `<span style="font-weight: 400">${Highcharts.dateFormat('%m-%d-%Y', this.x)}</span><br>`;
            this.points.forEach(point => {
              const colorSpan = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${point.series.color}; border-radius: 50%; margin-right: 5px;"></span>`;
              s += `${colorSpan}<span style="font-weight: 400">${point.series.name}</span>: <b>${point.y.toFixed(2)}</b><br>`;
            });
            return s;
          }
        },
      });
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
.symbol-correlation-chart {
  display: flex;
  flex-direction: column;
}
</style>