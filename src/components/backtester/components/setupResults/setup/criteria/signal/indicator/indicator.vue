// indicator search box
<template>
	<div class="indicator-box">
		<el-form :model="si" ref="siForm" :rules="rules" label-position="left" size="mini">
      
      <div class="labelWithSelectBox indicatorTypeBox">
        <el-form-item prop="indicatorRadio">
            <template slot="label">
              <label>
                Type
                <el-tooltip effect="dark" placement="top">
                  <span slot="content">
                    Indicator type or symbol fundamental data, currently encompassing four indicator categories
                  </span>
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </label>
            </template>
            <div class="selectBox">
              <el-select
                v-model="indicatorRadio"
                placeholder="— Select Indicator Type —"
                @change="changeIndicatorType"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
        </el-form-item>
      </div>
      <div class="hint" v-show="indicatorRadio === 'Technical Indicator'">Hint: To change the indicator settings, right click the indicator in the above chart and select "Edit Setting"</div>
      <el-divider></el-divider>
      <div class="labelWithSelectBox indicatorTypeBox" v-show="indicatorRadio === 'Sentiment Indicator'">
        <el-form-item prop="sentimentIndicator">
            <template slot="label">
              <label>
                Indicator
                <el-tooltip effect="dark" placement="top">
                  <span slot="content">
                    Here, you have access to multiple indicators, which you can select from a dropdown menu based on your preferences.
                  </span>
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </label>
            </template>
            <div class="selectBox">
              <el-autocomplete
              ref="sentiInput"
							prefix-icon="el-icon-search"
							class="inline-input"
							clearable
							v-model="si.sentimentIndicator"
							:fetch-suggestions="indicatorSentimentSearch"
							placeholder="Search for the sentiment indicator"
							@select="handleSentimentSelect"
              @clear="clearSentimentSelect"
							highlight-first-item
              :disabled="!isBTChartReady"
						></el-autocomplete>
            <!-- <searchBar
              :id_name="'autocomplete-' + criteria + '-' + panelIndex"
              placeholder="Input the sentiment indicator"
              :index="['indicatorList']"
              @select="handleSentimentSelect"
              display="chart_name"
            /> -->
            </div>
        </el-form-item>
      </div>
      <div class="labelWithSelectBox indicatorTypeBox"  v-show="indicatorRadio === 'Technical Indicator'">
        <el-form-item prop="technicalIndicator">
            <template slot="label">
              <label>
                Indicator
                <el-tooltip effect="dark" placement="top">
                  <span slot="content">
                    Here, you have access to multiple indicators, which you can select from a dropdown menu based on your preferences.
                  </span>
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </label>
            </template>
            <div class="selectBox">
              <el-autocomplete
              ref="techInput"
							class="inline-input"
							clearable
							prefix-icon="el-icon-search"
							v-model="si.technicalIndicator"
							:fetch-suggestions="indicatorTechnicalSearch"
							placeholder="Search for the technical indicator"
							@select="handleTechnicalSelect"
              @clear="clearTechnicalSelect"
              :disabled="!isBTChartReady"
						></el-autocomplete>
            </div>
        </el-form-item>
      </div>
      <div class="labelWithSelectBox indicatorTypeBox" v-show="indicatorRadio === 'Symbol OHLCV'">
        <el-form-item prop="symbolIndicator">
            <template slot="label">
              <label>
                Indicator
                <el-tooltip effect="dark" placement="top">
                  <span slot="content">
                    Here, you have access to multiple indicators, which you can select from a dropdown menu based on your preferences.
                  </span>
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </label>
            </template>
            <div class="selectBox">
              <el-select
                v-model="si.symbolIndicator"
                placeholder="Select Symbol Open/High/Low/Close/Volume"
                @change="handleSymbolSelect"
              >
                <el-option
                  v-for="item in filteredSymbolConditions"
                  :key="item.value"
                  :label="item.obj.label"
                  :value="item.obj"
                >
                </el-option>
              </el-select>
            </div>
        </el-form-item>
      </div>
      <div class="labelWithSelectBox indicatorTypeBox" v-show="indicatorRadio === 'Users\' Own Indicator'">
        <el-form-item prop="userIndicator">
            <template slot="label">
              <label>
                Indicator
                <el-tooltip effect="dark" placement="top">
                  <span slot="content">
                    Here, you have access to multiple indicators, which you can select from a dropdown menu based on your preferences.
                  </span>
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </label>
            </template>
            <div class="selectBox userIndicatorBox">
                <el-autocomplete
                prefix-icon="el-icon-search"
                class="inline-input"
                clearable
                v-model="si.userIndicator"
                placeholder="Search for my indicator"
                :fetch-suggestions="indicatorUsersSearch"
                @select="handleUsersOwnIndicatorSelect"
              :disabled="!isBTChartReady"
              >
              </el-autocomplete>
            </div>

            <el-upload
							class="upload-demo"
							:action="uploadUrl"
							:on-preview="_handlePreview"
							:on-progress="handleUploadProgress"
							:on-remove="handleRemove"
							:on-success="handleUploadSuccess"
							:on-error="handleUploadError"
							:http-request="uploadFile"
							:before-upload="beforeUpload"
							:multiple="false"
							:limit="1"
							:on-exceed="handleExceed"
							:file-list="fileList"
							ref="upload"
              :disabled="si.userIndicator != ''"
						>
							<el-button
								size="mini"
								type="primary"
								class="upload-indicator-btn"
								>Click to upload custom indicator file</el-button
							>
							<div slot="tip" class="el-upload__tip">
								You can only upload 1 csv file which doesn't exceed 1MB. File
								names are only allowed to contain English letters, numbers,
								spaces, and underscores.
								<el-button type="text" @click="exampleDataVisible = true"
									>View Example Data</el-button
								>
							</div>
						</el-upload>
        </el-form-item>
      </div>
      <!-- <Uploader/> -->
      <el-dialog :title="previewFileName" :visible.sync="previewVisible">
							<el-table
								:data="previewData"
								style="margin-top: 20px; max-height: 400px; overflow-y: auto"
							>
								<el-table-column label="Date" prop="Date"></el-table-column>
								<el-table-column label="Close" prop="Close"></el-table-column>
							</el-table>
							<el-pagination
								small
								@current-change="handleCurrentChange"
								:current-page="previewPage.page"
								:page-size="100"
								layout="total, prev, pager, next"
								:total="previewPage.total"
							>
							</el-pagination>
      </el-dialog>
      <el-dialog
        :title="previewFileName"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
      >
        <el-form
          :model="form"
          class="custom-indicator-form"
          :rules="userIndicatorRules"
          ref="userForm"
        >
          <el-form-item
            label="Indicator Name"
            :label-width="formLabelWidth"
            prop="indicatorName"
          >
            <el-input
              v-model="form.indicatorName"
              autocomplete="off"
              @keydown.native.prevent.enter="onEnter"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose"
            >Use the file name directly</el-button
          >
          <el-button
            type="primary"
            @click="handleDialogConfirm('userForm')"
            >Confirm</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        :title="nonBusinessTitle"
        :visible.sync="nonBusinessDialogVisible"
        :show-close="false"
      >
        <el-card
          class="box-card"
          style="margin-top: 20px; max-height: 400px; overflow-y: auto"
        >
          <div
            v-for="item in nonBusinessDay"
            :key="item"
            class="text item"
          >
            {{ item }}
          </div>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelBusinessDialogClose">Cancel</el-button>
          <el-button type="primary" @click="confirmBusinessDialogClose"
            >Ignore</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :title="exampleDataTitle"
        :visible.sync="exampleDataVisible"
      >
        <el-table
          :data="exampleData"
          style="margin-top: 20px; max-height: 400px; overflow-y: auto"
        >
          <el-table-column label="Date" prop="Date"></el-table-column>
          <el-table-column label="Close" prop="Close"></el-table-column>
        </el-table>
      </el-dialog>
		</el-form>
	</div>
</template>
<script>
import SparkMD5 from 'spark-md5'
import { CIQ } from '@/components/common/chart/st-development/js'
import {
  csvFileDelete,
  csvFileRead,
  getPairData,
  csvFilePagingRead,
  getAllMyIndicatorsList
} from '@/service/service'
import Papa from 'papaparse'
import axios from 'axios'
import {compareArrays, LocalStorageUtil, formatStandardTime, capitalizeFirstLetter} from '@/utils'
import {createStateFilter,maxNumOfStudy,getSymbolInfo} from '@/utils/globalFunc'
import moment from 'moment'
import { mapMutations,mapGetters } from 'vuex'

import searchBar from "@/components/common/searchBar"
import Uploader from "@/components/common/chart/st-development/js/webcomponents/Uploader.vue"
const throttle = require('lodash/throttle')

export default {
  props: {
    criteria: String,
    panelIndex: Number,
    editableTabsValue: String,
    editableTabs: Array,
    isRiskControl: Boolean
  },
  components: {
    searchBar,
    Uploader
  },
  data() {
    let validateSenti = (rule, value, callback) => {
      if (!value && this.indicatorRadio == 'Sentiment Indicator') {
        callback(new Error('Please choose sentiment indicator'))
      } else {
        callback()
      }
    }
    let validateTech = (rule, value, callback) => {
      if (!value && this.indicatorRadio == 'Technical Indicator') {
        callback(new Error('Please choose technical indicator'))
      } else {
        callback()
      }
    }
    let validateSym = (rule, value, callback) => {
      if (!value && this.indicatorRadio == 'Symbol OHLCV') {
        callback(new Error('Please choose symbol ohlcv'))
      } else {
        callback()
      }
    }
    let validateRisk = (rule, value, callback) => {
      if (!value && this.indicatorRadio == 'Risk Indicator') {
        callback(new Error('Please choose risk indicator'))
      } else {
        callback()
      }
    }
    let validateIndicatorName = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      let _value = value.replace(/\s*/g, "")
      if (!_value && this.indicatorRadio == "Users' Own Indicator") {
        callback(new Error('Name cannot be empty.'))
      } else if (!reg.test(_value)) {
        //callback(new Error('It must start with a letter and can only contain letters, numbers, spaces, and underscores.'))
        callback()
      } else {
        callback()
      }
    }
    return {
      indicatorRadio: 'Sentiment Indicator',
      si: {
        sentimentIndicator: '',
        technicalIndicator: '',
        symbolIndicator: '',
        riskIndicator: '',
        userIndicator: ''
      },
     // sentimentIndicatorList: JSON.parse(JSON.stringify(this.$store.getters.getIndicatorsList).replace(/chart_name/g, 'value')),
      symbolConditions: [
        { value: 0, obj: { label: 'Symbol Open', field: 'Open' } },
        { value: 1, obj: { label: 'Symbol High', field: 'High' } },
        { value: 2, obj: { label: 'Symbol Low', field: 'Low' } },
        { value: 3, obj: { label: 'Symbol Close', field: 'Close' } },
        { value: 4, obj: { label: 'Symbol Volume', field: 'Volume' } },
        { value: 5, obj: { label: 'Symbol Ratio', field: 'Ratio' } }
      ],
      rules: {
        sentimentIndicator: [{ validator: validateSenti, trigger: 'change' }],
        technicalIndicator: [{ validator: validateTech, trigger: 'change' }],
        symbolIndicator: [{ validator: validateSym, trigger: 'change' }],
        riskIndicator: [{ validater: validateRisk, trigger: 'change' }]
      },
      category: 'all',
      fileList: [],
      actionUrl: '', // 文件上传的接口地址
      headers: {
        'Content-Type': 'multipart/form-data'
      }, // 请求头部
      previewVisible: false, // 是否显示预览表格
      previewData: [], // 预览表格的数据
      previewFileName: '',
      previewFileID: '',
      previewPage: {
        page: 1,
        total: 0
      },
      cancelToken: null, // 用于保存取消上传请求的取消令牌
      uploadUrl: '/dev/dev/uploadcsvfile/',
      uploadHeaders: {},
      // progress: 0, // 上传进度
      dialogFormVisible: false,
      form: {
        indicatorName: ''
      },
      formLabelWidth: '120px',
      userIndicatorRules: {
        indicatorName: [{ validator: validateIndicatorName, trigger: 'blur' }],
        dialogValid: false
      },
      rawMap: {}, // 文件对象的 raw 属性备份
      file_hash: '',
      nonBusinessTitle: 'Non-trading day schedule in CSV',
      nonBusinessDay: [],
      nonBusinessDialogVisible: false,
      nonBusinessFile: '',
      exampleDataTitle: 'Example Data',
      exampleData: [
        { 'Date': '2018-01-02', 'Close': '54.24' },
        { 'Date': '2018-01-03', 'Close': '46.15' },
        { 'Date': '2018-01-04', 'Close': '53.87' },
        { 'Date': '2018-01-05', 'Close': '62.65' },
        { 'Date': '2018-01-08', 'Close': '51.61' },
        { 'Date': '2018-01-09', 'Close': '49.73' },
        { 'Date': '2018-01-10', 'Close': '52.37' },
        { 'Date': '2018-01-11', 'Close': '58.09' },
        { 'Date': '2018-01-12', 'Close': '62.6' },
        { 'Date': '2018-01-16', 'Close': '50.63' }
      ],
      exampleDataVisible: false,
      typeOptions: [
        {value: 'Sentiment Indicator', label: 'Sentiment Indicator'},
        {value: 'Technical Indicator', label: 'Technical Indicator'},
        {value: 'Symbol OHLCV', label: 'Symbol OHLCV'},
        {value: "Users' Own Indicator", label: "Users' Own Indicator"},
      ],
      createdIndicatorOptions: [],

      // 自定义动态渲染下拉栏
      searchResults: [],
      currentPage: 1,
      pageSize: 20,
      hasMore: true, // 是否还有更多数据
    }
  },
  computed: {
      sentimentIndicatorList() {
        return this.$store.getters.getIndicatorsList.map(item => ({
          value: item.chart_name,
          ...item
        }));
      },
    updateFreq() {
      return this.$store.state.form.pairDataFreq
    },
    updateSenti() {
      return this.$store.state.chart.currentSenti
    },
    frequency() {
      return this.$store.state.form.exitFrequency
    },
    isBTChartReady() {
      return this.$store.state.chart.isBTChartReady
    },

    ...mapGetters(['getComparisonSymbol']),
		isComparisonSymbol() {
      return this.getComparisonSymbol.url?true:false
    },
    filteredSymbolConditions() {
      if (this.isComparisonSymbol) {
        return this.symbolConditions;
      } else {
        return this.symbolConditions.filter(item => item.value !== 5);
      }
    },
  },
  watch: {
    // Listen to freq on the indicator Vue is to make the indicators loaded by the form within the timeframe range
    updateFreq() {
      this.indicatorSentimentSearch(this.si.sentimentIndicator, (res) => {
        if (res.length == 0) {
          this.si.sentimentIndicator = ''
        }
      })
    },
    /** 监听indicators-search,预加载 */
    updateSenti(val) {
      let tabs = this.editableTabs
      let absoluteIndex = ''
      tabs.forEach((tab, index) => {
        if (tab.name == this.editableTabsValue) {
          absoluteIndex = index
        }
      })
      if (
        this.si.sentimentIndicator == '' &&
        this.si.technicalIndicator == '' &&
        this.si.symbolIndicator == '' &&
        this.si.userIndicator == '' &&
        this.si.riskIndicator == '' &&
        absoluteIndex == this.panelIndex
      ) {
        this.si.sentimentIndicator = val.name

        // long: todo: handle***Select 考虑封装复用逻辑并用到这
        //预加载sentiment indicator
        let sentiIndicatorResult = CIQ.findSentiIndicator(val.name,null)
        if (sentiIndicatorResult) {
          this.indicatorRadio = 'Sentiment Indicator'

          // extract the code from handleSentimentSelect
          this.currentSentiUpdated = sentiIndicatorResult.updated
          let freqObj = {}
          freqObj.value = sentiIndicatorResult.updated
          freqObj.index = this.panelIndex
          freqObj.criteria = this.criteria
          freqObj.key = `${this.criteria}_${this.panelIndex}`
          this.setFrequencyArray(freqObj)
          this.$emit('getFreqArray', freqObj)

          this.$emit('getIndicatorVal', {
            value: sentiIndicatorResult.chart_name, index: this.panelIndex
          })
          this.$emit('getIndicatorUrl', {
            url: sentiIndicatorResult.url, index: this.panelIndex
          })

          let activatedMAList = this.$store.state.chart.activatedMA
          if (this.criteria.startsWith('entry')) {
            let MAListIndex = activatedMAList.findIndex(
              (item) =>
                item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
                item.criteria == this.criteria &&
                item.index == this.panelIndex
            )
            if (MAListIndex != -1) {
              activatedMAList.splice(MAListIndex, 1)
            }
            this.$store.commit('chart/getMA', activatedMAList)
            this.$store.commit('chart/getIndicators', {
              index: this.panelIndex,
              value: sentiIndicatorResult.url,
              criteria: this.criteria
            })
          } else {
            let MAListIndex = activatedMAList.findIndex(
              (item) =>
                item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
                item.criteria == this.criteria &&
                item.index == this.panelIndex
            )
            if (MAListIndex != -1) {
              activatedMAList.splice(MAListIndex, 1)
            }
            this.$store.commit('chart/getMA', activatedMAList)
            this.$store.commit('chart/getIndicators', {
              index: this.panelIndex,
              value: sentiIndicatorResult.url,
              criteria: this.criteria
            })
          }

          // Remove form verification
          this.clearFormValidate()
          let radioObj = {}
          radioObj.value = 'sentiment'
          radioObj.index = this.panelIndex
          this.$emit('getIndicatorRadio', radioObj)
        }
        if (CIQ.isOwnIndicator(val.url)){
          this.indicatorRadio = "Users' Own Indicator"

          // extract the code from handleSentimentSelect
          const indicatorName = val.name
          const indicatorUrl = val.url
          this.si.userIndicator = indicatorName

          let frequency = 'Daily'
          switch (val.updated) {
            case 'monthly': {
              frequency = 'Monthly'
              break
            }
            case 'weekly': {
              frequency = 'Weekly'
              break
            }
            case 'daily': {
              frequency = 'Daily'
              break
            }
            default:
          }
          this.currentSentiUpdated = frequency

          let freqObj = {}
          freqObj.value = frequency
          freqObj.index = this.panelIndex
          freqObj.criteria = this.criteria
          freqObj.key = `${this.criteria}_${this.panelIndex}`
          this.setFrequencyArray(freqObj)
          this.$emit('getFreqArray', freqObj)

          if(indicatorUrl.includes('CREATE')) {
            const obj = {}
            obj.index = this.panelIndex
            obj.val = indicatorUrl
            obj.criteriaCF = capitalizeFirstLetter(this.criteria)
            if (this.criteria.startsWith('entry')) {
                this.$store.commit(`form/saveUsersOwnFileHash`, obj)
              }
              if (this.criteria.startsWith('exit')) {
                this.$store.commit(`form/saveUsersOwnFileHash`, obj)
              }
          }

          this.$emit('getIndicatorVal', {
            value: indicatorName, index: this.panelIndex
          })
          this.$emit('getIndicatorUrl', {
            url: indicatorUrl, index: this.panelIndex
          })

          let activatedMAList = this.$store.state.chart.activatedMA
          if (this.criteria.startsWith('entry')) {
            let MAListIndex = activatedMAList.findIndex(
              (item) =>
                item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
                item.criteria == this.criteria &&
                item.index == this.panelIndex
            )
            if (MAListIndex != -1) {
              activatedMAList.splice(MAListIndex, 1)
            }
            this.$store.commit('chart/getMA', activatedMAList)
            this.$store.commit('chart/getIndicators', {
              index: this.panelIndex,
              value: indicatorUrl,
              criteria: this.criteria
            })
          } else {
            let MAListIndex = activatedMAList.findIndex(
              (item) =>
                item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
                item.criteria == this.criteria &&
                item.index == this.panelIndex
            )
            if (MAListIndex != -1) {
              activatedMAList.splice(MAListIndex, 1)
            }
            this.$store.commit('chart/getMA', activatedMAList)
            this.$store.commit('chart/getIndicators', {
              index: this.panelIndex,
              value: indicatorUrl,
              criteria: this.criteria
            })
          }

          // Remove form verification
          this.clearFormValidate()
          let radioObj = {}
          radioObj.value = 'user'
          radioObj.index = this.panelIndex
          this.$emit('getIndicatorRadio', radioObj)
        }
      }
    },
    frequency: {
      handler(newVal) {
        if (newVal != this.currentSentiUpdated) {
          // The changed timeframe is not equal to the current timeframe of the sentiment indicator
          switch (newVal) {
            case 'Daily':
              if (this.si.sentimentIndicator) {
                this.si.sentimentIndicator = ''
              }
              break
            case 'Weekly':
              if (
                this.currentSentiUpdated == 'Monthly' &&
                this.si.sentimentIndicator
              ) {
                this.si.sentimentIndicator = ''
              }
              break
            default:
              break
          }
        }
      }
    },
    isBTChartReady(val) {
      if(!val) return
          // 预填充 btv2 按钮跳转过来携带的 symbol
          let symbol = sessionStorage.getItem('symbol')
          if(!symbol) return
          symbol = symbol.replace(/"/g, '')
          this.$store.commit('form/getBacktestSymbol', symbol)
      // 预填充 btv2 按钮跳转过来携带的 indicator
			let indicator = sessionStorage.getItem('indicator')
      if(!indicator) return
      indicator = indicator.replace(/"/g, '')
      let ele = CIQ.findSentiIndicator(null, indicator)
      if(!ele) ele = CIQ.findSentiIndicator(null, `${indicator}@indicator`)
      ele = {...ele, value: ele.chart_name}
      if(this.criteria.startsWith('entry')) {
        this.si.sentimentIndicator = ele.value;
        this.handleSentimentSelect(ele)
      }
      sessionStorage.removeItem('indicator')
    }
  },
  mounted() {
    this.attachScrollListener()
  },
  beforeDestroy() {
    this.detachScrollListener(); // 在组件销毁前解绑滚动事件
  },
  methods: {
    /** START 加载更多数据且保持滚动条位置 */
    // 绑定滚动事件
    attachScrollListener() {
      const refs = ['sentiInput', 'techInput']; // 要监听的下拉框的 ref 名称

      refs.forEach(refName => {
        const inputDropdown = this.$refs[refName]?.$refs.suggestions?.$el?.childNodes[0]?.childNodes[0]; // 获取下拉框的 DOM
        if (inputDropdown) {
          inputDropdown.addEventListener("scroll", (event) => this.handleDropdownScroll(event, refName));
        }
      });
    },
    // 解绑滚动事件
    detachScrollListener() {
      const refs = ['sentiInput', 'techInput']; // 要监听的下拉框的 ref 名称

      refs.forEach(refName => {
        const inputDropdown = this.$refs[refName]?.$refs.suggestions?.$el?.childNodes[0]?.childNodes[0]; // 获取下拉框的 DOM
        if (inputDropdown) {
          inputDropdown.removeEventListener("scroll", (event) => this.handleDropdownScroll(event, refName));
        }
      });
    },
    // 监听滚动事件，触发加载更多
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
    /** END 加载更多数据且保持滚动条位置 */

    /** disable enter while naming a custom symbol */
		onEnter(event) {
      event.preventDefault();
    },
    ...mapMutations('form',['setFrequencyArray', 'setFreqencyLP']),
    /* 当用户选择indicator类别，进行搜索筛选*/
    selectCategory(e) {
      this.category = e.target.innerHTML
    },
    // Clear form authentication
    clearFormValidate() {
      this.$refs.siForm.clearValidate()
    },
    //  load sentiment list
    clearForm() {
      let data = {
        indicatorRadio: 'Sentiment Indicator',
        si: {
          sentimentIndicator: '',
          technicalIndicator: '',
          symbolIndicator: '',
          riskIndicator: '',
          userIndicator: ''
        },

      }

      Object.assign(this.$data, data)
      this.$refs?.siForm.clearValidate()
      this.$refs?.upload.clearFiles()
      this.fileList = []
      this.changeIndicatorChecked('Sentiment Indicator')
    },
    // sentiment search
    indicatorSentimentSearch(queryString, cb) {
      let list = this.sentimentIndicatorList
      list = list.filter(i => !i.value.includes('Seasonality'))

      let results = list.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)

      this.searchResults = results.sort((a, b) => b.priority - a.priority)
      this.currentPage = 1;
      this.hasMore = true;
      this.loadMore(cb)
    },
    async indicatorUsersSearch(queryString, cb) {
      if(this.createdIndicatorOptions.length === 0) {
        this.createdIndicatorOptions = await getAllMyIndicatorsList()
        const list = this.createdIndicatorOptions.map(item => ({...item, url: item.url, value: item.name, file_name: item.name, file_id: `${item.name}CREATE${item.url}`, updated: item.timeframe}))
        let results = list.map(item => ({
            ...item,
            priority: createStateFilter(queryString)(item),
          }))
          .filter(item => item.priority > 0)
        cb(results.sort((a, b) => b.priority - a.priority).slice(0, 50))
      }else{
        const list = this.createdIndicatorOptions.map(item => ({...item, url: item.url, value: item.name, file_name: item.name, file_id: `${item.name}CREATE${item.url}`, updated: item.timeframe}))
        let results = list.map(item => ({
            ...item,
            priority: createStateFilter(queryString)(item),
          }))
          .filter(item => item.priority > 0)
        cb(results.sort((a, b) => b.priority - a.priority).slice(0, 50))
      }
    },
    changeIndicatorType(type) {
      this.changeIndicatorChecked(type)
    },
    // technical search
    indicatorTechnicalSearch(queryString, cb) {
      let results = this.$store.getters.getFormateTechnicalList.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)

        this.searchResults = results.sort((a, b) => b.priority - a.priority)
        this.currentPage = 1;
        this.hasMore = true;
        this.loadMore(cb)
    },
    indicatorRiskSearch(queryString, cb) {
      let riskIndicatorList = this.loadRiskList()

      let results = riskIndicatorList.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)
      cb(results.sort((a, b) => b.priority - a.priority).slice(0, 50))
    },
    resetIndicator() {
      this.si.sentimentIndicator = ''
      this.si.technicalIndicator = ''
      this.si.symbolIndicator = ''
      this.si.userIndicator = ''
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    clearSentimentSelect() {
      const item = this.sentimentIndicatorList.find(i=>i.value ==  this.$refs.sentiInput.value)

      this.currentSentiUpdated = item.updated
      let freqObj = {}
      freqObj.value = ''
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      this.$emit('getIndicatorVal', {
        value: '', index: this.panelIndex
      })
      this.$emit('getIndicatorUrl', {
        url: '', index: this.panelIndex
      })

      // remove a MA tat already exists in current criteria before loading
      let activatedMAList = this.$store.state.chart.activatedMA
      let MAListIndex = activatedMAList.findIndex(
        (item) =>
          item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
          item.criteria == this.criteria &&
          item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      this.$store.commit('chart/getMA', activatedMAList)
      this.$store.commit('chart/getIndicators', {
        index: this.panelIndex,
        value: '',
        criteria: this.criteria
      })


      // 移除chartiq对应的extraIndicators
      let extraIndicators = []
			extraIndicators.push(...this.$store.state.chart.indicators.extraIndicators)
      extraIndicators = extraIndicators.filter(x=>x!=item.url)
			this.$store.commit('chart/getExtraIndicators',extraIndicators)

      // 如果是MA，则移除它的信息和位置
      CIQ.removeMALayout(item.url, this.criteria, this.panelIndex)

      // lishn 判断需要小龙写
      CIQ.addIndicators({})
    },
    handleSentimentSelect(item) {
      // 限制同屏显示个数
      if(maxNumOfStudy()) return

      this.currentSentiUpdated = item.updated
      let freqObj = {}
      freqObj.value = item.updated
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)

      this.$emit('getFreqArray', freqObj)

      //this.si.sentimentIndicator = item.value
      this.$emit('getIndicatorVal', {
        value: item.value, index: this.panelIndex
      })
      this.$emit('getIndicatorUrl', {
        url: item.url, index: this.panelIndex
      })

      // remove a MA tat already exists in current criteria before loading
      let activatedMAList = this.$store.state.chart.activatedMA
      let MAListIndex = activatedMAList.findIndex(
        (item) =>
          item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
          item.criteria == this.criteria &&
          item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      this.$store.commit('chart/getMA', activatedMAList)
      this.$store.commit('chart/getIndicators', {
        index: this.panelIndex,
        value: item.url,
        criteria: this.criteria
      })

       // 如果是MA，则记录它的信息和位置，entryIndicator里面遇到ma时会访问store里的此记录并还原显示
       CIQ.setMALayout(item.url, null, null, null, this.criteria, this.panelIndex)
       CIQ.setTechLayout(item.url, this.criteria, this.panelIndex)
      CIQ.addIndicators({})
    },
    clearSymbolSelect() {
      let freqObj = {}
      freqObj.value = ''
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      this.$emit('getIndicatorVal', {
        value: '', index: this.panelIndex
      })
      this.$emit('getIndicatorUrl', {
        url: '', index: this.panelIndex
      })

      // remove a MA tat already exists in current criteria before loading
      let activatedMAList = this.$store.state.chart.activatedMA
      let MAListIndex = activatedMAList.findIndex(
        (item) =>
          item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
          item.criteria == this.criteria &&
          item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      this.$store.commit('chart/getMA', activatedMAList)
      this.$store.commit('chart/getIndicators', {
        index: this.panelIndex,
        value: '',
        criteria: this.criteria
      })


      // 如果是MA，则移除它的信息和位置
      CIQ.removeMALayout(item.label, this.criteria, this.panelIndex)
      CIQ.removeTechLayout(item.label, this.criteria, this.panelIndex)

      // lishn 判断需要小龙写
      CIQ.addIndicators({})
    },
    handleSymbolSelect(item) {
      this.si.symbolIndicator = item.label

      // symbol也需要设置daily的FrequencyArray
      // 防止changeRelation到singleCondition后报错
      let freqObj = {}
      freqObj.value = 'Daily'
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      this.$emit('getIndicatorVal', {
        value: item.label, index: this.panelIndex
      })
      this.$emit('getIndicatorUrl', {
        url: item.label, index: this.panelIndex
      })

      // remove a MA tat already exists in current criteria before loading
      let activatedMAList = this.$store.state.chart.activatedMA
      let MAListIndex = activatedMAList.findIndex(
        (item) =>
          item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
          item.criteria == this.criteria &&
          item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      this.$store.commit('chart/getMA', activatedMAList)
      this.$store.commit('chart/getIndicators', {
        index: this.panelIndex,
        value: item.label,
        criteria: this.criteria
      })



       // 如果是MA，则记录它的信息和位置，entryIndicator里面遇到ma时会访问store里的此记录并还原显示
       CIQ.setMALayout(item.label, null, null, null, this.criteria, this.panelIndex)
       CIQ.setTechLayout(item.label, this.criteria, this.panelIndex)

      // avoid add indicator redundantly
      // for (let studyInstanceName in CIQ.stxx.layout.studies) {
      //   let sd = CIQ.stxx.layout.studies[studyInstanceName]
      //   // 当url相同,且都为同一symbol下时，跳过加载       
      //   if (sd.type == item.label && 
      //     (sd.parameters.isComparison == this.criteria.endsWith('2'))
      //   ) {
      //     return
      //   }
      // }
      CIQ.addIndicators({})
    },
    clearTechnicalSelect() {
      const item = CIQ.findBuiltinTechIndicator(this.$refs.techInput.value,null)

      let freqObj = {}
      freqObj.value = ''
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      this.$emit('getIndicatorVal', {
        value: '', index: this.panelIndex
      })
      this.$emit('getTechIndiObj', {
        class: '', index: this.panelIndex
      })

      // remove a MA tat already exists in current criteria before loading
      let activatedMAList = this.$store.state.chart.activatedMA
      let MAListIndex = activatedMAList.findIndex(
        (item) =>
          item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
          item.criteria == this.criteria &&
          item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      this.$store.commit('chart/getMA', activatedMAList)
      this.$store.commit('chart/getIndicators', {
        index: this.panelIndex,
        value: '',
        criteria: this.criteria
      })

      // 如果是MA，则移除它的信息和位置
      CIQ.removeMALayout(item.url, this.criteria, this.panelIndex)
      CIQ.removeTechLayout(item.url, this.criteria, this.panelIndex)
      // lishn 判断需要小龙写
     if (arguments[1] != true) {
        CIQ.addIndicators({})
      }
    },
    handleTechnicalSelect(item) {
      console.log('handleTechnicalSelect',item)
      this.si.technicalIndicator = item.value

      // tech也需要设置daily的FrequencyArray
      // 防止changeRelation到singleCondition后报错
      let freqObj = {}
      freqObj.value = 'Daily'
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      this.$emit('getIndicatorVal', {
        value: item.value, index: this.panelIndex
      })
      this.$emit('getTechIndiObj', {
        class: item.class, index: this.panelIndex
      })

      // remove current MA attached to an indicator before loadin
      let activatedMAList = CIQ.store.state.chart.activatedMA
      let MAListIndex = activatedMAList.findIndex(
        (ma) =>
          ma.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
          ma.criteria == this.criteria &&
          ma.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      CIQ.store.commit('chart/getMA', activatedMAList)
      this.$store.commit('chart/getIndicators', {
        index: this.panelIndex,
        value: item.url,
        criteria: this.criteria
      })


      // 如果是MA，则记录它的信息和位置，entryIndicator里面遇到ma时会访问store里的此记录并还原显示
      CIQ.setMALayout(item.url, null, null, null, this.criteria, this.panelIndex)
      CIQ.setTechLayout(item.url, this.criteria, this.panelIndex)

      /**
       * symbol1 entry&exit: (Acc -> MACD)  
       * symbol2 entry&exit: (Acc -> MACD)  
       */
      // // avoid add indicator redundantly
      // for (let studyInstanceName in CIQ.stxx.layout.studies) {
      //   let sd = CIQ.stxx.layout.studies[studyInstanceName]
      //   // 当url相同，不为ma,且都为同一symbol下时，跳过加载       
      //   if (sd.type == item.url && 
      //     (sd.parameters.isComparison == this.criteria.endsWith('2'))
      //   ) {
      //     return
      //   }
      //   // if (sd.type == item.url && sd.type != 'ma') {
      //   //   return
      //   // }
      // }

      if (arguments[1] != true) {
        CIQ.addIndicators({})
      }
    },
    clearUserOwnIndicatorSelect() {
      let freqObj = {}
      freqObj.value = ''
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      this.$emit('getIndicatorVal', {
        value: '', index: this.panelIndex
      })
      this.$emit('getIndicatorUrl', {
        url: '', index: this.panelIndex
      })

      // remove a MA tat already exists in current criteria before loading
      let activatedMAList = this.$store.state.chart.activatedMA
      let MAListIndex = activatedMAList.findIndex(
        (item) =>
          item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
          item.criteria == this.criteria &&
          item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      this.$store.commit('chart/getMA', activatedMAList)
      this.$store.commit('chart/getIndicators', {
        index: this.panelIndex,
        value: '',
        criteria: this.criteria
      })

      // 如果是MA，则移除它的信息和位置
      CIQ.removeMALayout('', this.criteria, this.panelIndex)
      // lishn 判断需要小龙写
      CIQ.addIndicators({})
    },
    handleUsersOwnIndicatorSelect(data) {
      // 限制同屏显示个数
      if(maxNumOfStudy()) return

      const indicatorName = data.file_name
      const indicatorUrl = data.file_id
      this.si.userIndicator = indicatorName

      let frequency = 'Daily'
      switch (data.updated) {
        case 'monthly': {
          frequency = 'Monthly'
          break
        }
        case 'weekly': {
          frequency = 'Weekly'
          break
        }
        case 'daily': {
          frequency = 'Daily'
          break
        }
        default:
      }
      this.currentSentiUpdated = frequency

      // user也需要设置daily的FrequencyArray
      // 防止changeRelation到singleCondition后报错

      let freqObj = {}
      freqObj.value = frequency
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      if(indicatorUrl.includes('CREATE')) {
        const obj = {}
        obj.index = this.panelIndex
        obj.val = indicatorUrl
        obj.criteriaCF = capitalizeFirstLetter(this.criteria)
        if (this.criteria.startsWith('entry')) {
            this.$store.commit(`form/saveUsersOwnFileHash`, obj)
          }
          if (this.criteria.startsWith('exit')) {
            this.$store.commit(`form/saveUsersOwnFileHash`, obj)
          }
      }

      this.$emit('getIndicatorVal', {
        value: indicatorName, index: this.panelIndex
      })
      this.$emit('getIndicatorUrl', {
        url: indicatorUrl, index: this.panelIndex
      })

      // remove a MA tat already exists in current criteria before loading
      let activatedMAList = this.$store.state.chart.activatedMA
      let MAListIndex = activatedMAList.findIndex(
        (item) =>
          item.url == this.$store.state.chart.indicators.formIndicators[this.criteria][this.panelIndex] &&
          item.criteria == this.criteria &&
          item.index == this.panelIndex
      )
      if (MAListIndex != -1) {
        activatedMAList.splice(MAListIndex, 1)
      }
      this.$store.commit('chart/getMA', activatedMAList)
      this.$store.commit('chart/getIndicators', {
        index: this.panelIndex,
        value: indicatorUrl,
        criteria: this.criteria
      })

       // 如果是MA，则记录它的信息和位置，entryIndicator里面遇到ma时会访问store里的此记录并还原显示
       CIQ.setMALayout('', null, null, null, this.criteria, this.panelIndex)
       CIQ.setTechLayout('', this.criteria, this.panelIndex)
       
      // avoid add indicator redundantly
      for (let studyInstanceName in CIQ.stxx.layout.studies) {
        let sd = CIQ.stxx.layout.studies[studyInstanceName]
        if (sd.type == indicatorUrl) {
          return
        }
      }
      CIQ.addIndicators({})
    },
    changeIndicatorChecked(val) {
      this.clearFormValidate()
      const arr = [
        'Sentiment Indicator',
        'Technical Indicator',
        'Risk Control',
        'Symbol OHLCV',
        "Users' Own Indicator"
      ]
      const obj = {}
      obj.criteria = this.criteria
      obj.index = this.panelIndex
      this.$store.commit('form/deleteIndicator', obj)
      let radioObj = {}
      radioObj.index = this.panelIndex
      if (this.indicatorRadio === arr[0]) {
        // 切换radio后移除usersOwnEntryFileHash
        if (this.criteria.startsWith('entry')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: '',
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        if (this.criteria.startsWith('exit')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: '',
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }

        radioObj.value = 'sentiment'
        this.$emit('getIndicatorRadio', radioObj)

        // console.log('store',this.$store.indicators.formIndicators[this.criteria])
        let valObj = {}
        valObj.value = this.si.sentimentIndicator
        valObj.index = this.panelIndex
        this.$emit('getIndicatorVal', valObj)
        let urlObj = {}
        let res = CIQ.findSentiIndicator(this.si.sentimentIndicator,null)
        urlObj.url = res ? res.url : ''
        urlObj.index = this.panelIndex
        this.$emit('getIndicatorUrl', urlObj)
      } else if (this.indicatorRadio === arr[1]) {
        // 切换radio后移除usersOwnEntryFileHash
        if (this.criteria.startsWith('entry')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: '',
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        if (this.criteria.startsWith('exit')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: '',
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        radioObj.value = 'technical'
        this.$emit('getIndicatorRadio', radioObj)

        let valObj = {}
        valObj.value = this.si.technicalIndicator
        valObj.index = this.panelIndex
        this.$emit('getIndicatorVal', valObj)
        let urlObj = {}
        urlObj.url = ''
        urlObj.index = this.panelIndex
        this.$emit('getIndicatorUrl', urlObj)
      } else if (this.indicatorRadio === arr[2]) {
        // 切换radio后移除usersOwnEntryFileHash
        if (this.criteria.startsWith('entry')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: '',
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        if (this.criteria.startsWith('exit')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: '',
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        radioObj.value = 'risk'
        this.$emit('getIndicatorRadio', radioObj)
      } else if (this.indicatorRadio === arr[3]) {
        // 切换radio后移除usersOwnEntryFileHash
        if (this.criteria.startsWith('entry')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: '',
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        if (this.criteria.startsWith('exit')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: '',
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        radioObj.value = 'symbol'
        this.$emit('getIndicatorRadio', radioObj)

        let valObj = {}
        valObj.value = this.si.symbolIndicator
        valObj.index = this.panelIndex
        this.$emit('getIndicatorVal', valObj)
        let valUrl = {}
        valUrl.url = this.si.symbolIndicator
        valUrl.index = this.panelIndex
        this.$emit('getIndicatorUrl', valUrl)
      } else if (this.indicatorRadio === arr[4]) {
        // 切换radio后还原usersOwnEntryFileHash
        const userUrl = this.si.userIndicator + 'HASH' + this.file_hash
        if (this.criteria.startsWith('entry')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: userUrl,
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        if (this.criteria.startsWith('exit')) {
          this.$store.commit(`form/saveUsersOwnFileHash`, {
            index: this.panelIndex,
            val: userUrl,
            criteriaCF: capitalizeFirstLetter(this.criteria)
          })
        }
        radioObj.value = 'user'
        this.$emit('getIndicatorRadio', radioObj)

        let valObj = {}
        valObj.value = this.si.userIndicator
        valObj.index = this.panelIndex
        this.$emit('getIndicatorVal', valObj)
        let urlObj = {}
        urlObj.url = userUrl == 'HASH' ? '' : userUrl
        urlObj.index = this.panelIndex
        this.$emit('getIndicatorUrl', urlObj)
      }
    },
    loadRiskList() {
      return [{ value: 'Time In Market' }, { value: 'Profit/Loss' }]
    },
    async saveIndicator(index) {
      let checked = true
      let validForm
      let validName = false
      if (
        this.indicatorRadio === 'Sentiment Indicator' &&
        !this.isRiskControl
      ) {
        this.$refs.siForm.validate((valid) => {
          validForm = valid
        })
        let sentimentList = JSON.parse(JSON.stringify(this.$store.getters.getIndicatorsList).replace(/chart_name/g, 'value'))

        for (let i = 0; i < sentimentList.length; i++) {
          if (this.si.sentimentIndicator === sentimentList[i].value) {
            validName = true
            break
          }
        }
        if (validForm && validName) {
          let obj = {}
          obj.criteria = this.criteria
          obj.index = index
          obj.value = this.si.sentimentIndicator
          this.$store.commit('form/getSentiValue', obj)
          return checked
        } else {
          if (!validName) {
            this.popUpMsgBox('Please select #' +
                (index + 1) +
                ' ' +
                this.criteria +
                ' indicator from the drop-down box')
          }
          checked = false
          return checked
        }
      }
      if (
        this.indicatorRadio === "Users' Own Indicator" &&
        !this.isRiskControl
      ) {
        // this.$refs.siForm.validate((valid) => {
        // 	validForm = valid
        // })
        validForm = true
        if (validForm) {
          let obj = {}
          obj.criteria = this.criteria
          obj.index = index
          obj.value = this.si.userIndicator
          this.$store.commit('form/getUserValue', obj)
          return checked
        } else {
          if (!validName) {
            this.popUpMsgBox('Please select #' +
                (index + 1) +
                ' ' +
                this.criteria +
                ' indicator from the drop-down box')
          }
          checked = false
          return checked
        }
      }
      if (
        this.indicatorRadio === 'Technical Indicator' &&
        !this.isRiskControl
      ) {
        this.$refs.siForm.validate((valid) => {
          validForm = valid
        })
        if(CIQ.findBuiltinTechIndicator(this.si.technicalIndicator,null)) validName = true

        if (validForm && validName) {
          let obj = {}
          obj.criteria = this.criteria
          obj.index = index
          obj.value = this.si.technicalIndicator
          this.$store.commit('form/getTechValue', obj)
          return checked
        } else {
          if (!validName) {
            this.popUpMsgBox('Please select #' +
                (index + 1) +
                ' ' +
                this.criteria +
                ' indicator from the drop-down box')
          }
          checked = false
          return checked
        }
      }
      if (this.indicatorRadio === 'Symbol OHLCV' && !this.isRiskControl) {
        this.$refs.siForm.validate((valid) => {
          validForm = valid
        })
        validName = true
        if (validForm && validName) {
          let obj = {}
          obj.criteria = this.criteria
          obj.index = index
          obj.value = this.si.symbolIndicator
          this.$store.commit('form/getSymValue', obj)
          return checked
        } else {
          if (!validName) {
            this.popUpMsgBox('Please select #' +
                (index + 1) +
                ' ' +
                this.criteria +
                ' indicator from the drop-down box')
          }
          checked = false
          return checked
        }
      }
      if (this.isRiskControl) {
        checked = true
        return checked
      }
    },
    async setEditData(newVal) {
      console.log('indicator 编辑', newVal)
      try {
        if (JSON.stringify(newVal) != '{}') {
          this.clearFormValidate()
          let index = this.panelIndex
          let vm = this
          if (newVal[this.criteria].signals[index].analysis === 'Sentiment') {
            this.indicatorRadio = 'Sentiment Indicator'
            this.si.sentimentIndicator =
              newVal[this.criteria].signals[index].indicator
            let sentimentList = JSON.parse(JSON.stringify(this.$store.getters.getIndicatorsList).replace(/chart_name/g, 'value'))

            let indi = this.si.sentimentIndicator
            sentimentList.forEach((item) => {
              if (indi.toUpperCase() == item.value.toUpperCase()) {
                let obj = {}
                obj.index = vm.panelIndex
                obj.url = item.url
                // Set the tiemframe that currently fills the indicator. If the indicator does not match after switching the timeframe, it will be removed
                this.currentSentiUpdated = item.updated
                vm.$emit('getIndicatorUrl', obj)

                let freqObj = {}
                freqObj.value = item.updated
                freqObj.index = vm.panelIndex
                freqObj.criteria = vm.criteria
                freqObj.key = `${vm.criteria}_${vm.panelIndex}`
                vm.setFrequencyArray(freqObj)
                // vm.setFreqencyLP(freqObj)
                vm.$emit('getFreqArray', freqObj)
              }
            })
          }
          // todo 加入symbol analysis
          if (newVal[this.criteria].signals[index].analysis === 'Symbol') {
            debugger
            this.indicatorRadio = 'Symbol OHLCV'
            this.si.symbolIndicator =
              newVal[this.criteria].signals[index].indicator
            let obj = {}
            obj.index = vm.panelIndex
            obj.url = this.si.symbolIndicator
            vm.$emit('getIndicatorUrl', obj)
          }
          if (newVal[this.criteria].signals[index].analysis === 'Technical') {
            vm.indicatorRadio = 'Technical Indicator'
            vm.si.technicalIndicator = newVal[this.criteria].signals[index].indicator

            let techIndicatorResult = CIQ.findBuiltinTechIndicator(vm.si.technicalIndicator,null)
            if(techIndicatorResult){
              let isFromEdit = true
              vm.handleTechnicalSelect(techIndicatorResult, isFromEdit)
            }
          }
          if (newVal[this.criteria].signals[index].analysis === 'User') {
            vm.indicatorRadio = "Users' Own Indicator"
            let userIndicator = newVal[this.criteria].signals[index].indicator
            vm.si.userIndicator = userIndicator
            const str =
              this.$store.state.chart.indicators.formIndicators[this.criteria][
              this.panelIndex
              ]
            const startIndex = str.indexOf('HASH')
            const endIndex = startIndex + 4 // 假设 "HASH" 的长度为 4

            const createdStartIndex = str.indexOf('CREATE')
            const createdEndIndex = createdStartIndex + 7
            if (startIndex !== -1) {
              const beforeHash = str.substring(0, startIndex)
              const afterHash = str.substring(endIndex)
              const response = await csvFileRead(beforeHash, afterHash)
              console.log('文件响应', response)

              // 还原文件对象的 raw 属性
              const obj = {}
              obj.index = index
              obj.val = response.data.data.file_id
              obj.criteriaCF = capitalizeFirstLetter(this.criteria)
              vm.previewFileID = str
              vm.$emit('getIndicatorUrl', {
                index: index,
                url: response.data.data.file_id
              })
              console.log('还原文件对象的 raw 属性', obj)
              if (this.criteria.startsWith('entry')) {
                this.$store.commit(`form/saveUsersOwnFileHash`, obj)
              }
              if (this.criteria.startsWith('exit')) {
                this.$store.commit(`form/saveUsersOwnFileHash`, obj)
              }
              const res = response.data.data.csv_content
              let data = []
              try {
                data = res.map((item) => ({
                  Date: formatStandardTime(item.DT).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }),
                  Close: item.indicator_Close
                }))
                // 创建 CSV 文件
                // const csvData = 'Date,Close\n' + data.map(item => `${item.Date},${item.Close}`).join('\n');
                // const file = new File([csvData], `${userIndicator}.csv`, { type: 'text/csv' });
                // this.fileList.splice(-1, 1, file)

                const csvData =
                  'Date,Close\n' +
                  data.map((item) => `${item.Date},${item.Close}`).join('\n')
                const base64Data = btoa(csvData) // 编码为 Base64
                const rawValue = `data:text/csv;base64,${base64Data}`
                const file = new File([csvData], `${userIndicator}.csv`, {
                  type: 'text/csv'
                })
                file.raw = rawValue
                this.fileList.splice(-1, 1, file)
              } catch (error) {
                console.log('error', error)
              }
            } else if(createdStartIndex !== -1){
              const beforeHash = str.substring(0, createdStartIndex)
              const afterHash = str.substring(createdEndIndex)

              // 还原文件对象的 raw 属性
              const obj = {}
              obj.index = index
              obj.val = str
              obj.criteriaCF = capitalizeFirstLetter(this.criteria)
              vm.si.userIndicator = beforeHash
              vm.$emit('getIndicatorUrl', {
                index: index,
                url: str
              })
              console.log('还原文件对象的 raw 属性', obj)
              if (this.criteria.startsWith('entry')) {
                this.$store.commit(`form/saveUsersOwnFileHash`, obj)
              }
              if (this.criteria.startsWith('exit')) {
                this.$store.commit(`form/saveUsersOwnFileHash`, obj)
              }
            }
          }
        }
      } catch (error) {
        console.error(error)
        this.$notify({
          title: 'Failed',
          message: 'The internal server is busy, please try again later',
          type: 'error'
        })
      }
    },
    uploadFile(file) {
      debugger
      console.log('文件上传', file)
      const self = this
      let suffix = ''
      // 创建 FormData 对象，将文件添加到 FormData 中

      const formData = new FormData()
      try {
        suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1]
      } catch (error) {
        return
      }
      const name = file.name.replace(`.${suffix}`, '')
      const fileName = name.replace(/\s*/g, "")
      this.si.userIndicator = fileName
      formData.append('name', fileName)
      formData.append('hash', file.hash)
      formData.append('suffix', suffix)
      formData.append('file', file)

      // 创建 CancelToken 实例
      const cancelToken = axios.CancelToken.source()

      // 保存取消令牌，以便在需要终止上传时使用
      // 保存取消令牌，以便在需要终止上传时使用
      self.cancelToken = cancelToken
      // 发送上传请求
      axios
        .post(self.uploadUrl, formData, {
          headers: {
            ...self.uploadHeaders,
            ...{
              cancelToken: cancelToken.token
            }
          },
          onUploadProgress: (event) => {
            // 文件上传进度的处理逻辑
            // self.handleUploadProgress(event, file.uid, self.fileList);
            // const progress = Math.round((event.loaded * 100) / event.total)
            // const curLi =
            // 	self.$refs.upload.$el.querySelector('.el-progress-bar__inner') ||
            // 	null
            // console.log(
            // 	curLi,
            // 	self.$refs.upload.$el.querySelector('.el-progress__text')
            // )
            // self.$refs.upload.$el.querySelector(
            // 	'.el-progress-bar__inner'
            // ).style.width = progress + '%'
            // this.$refs.upload.$el.querySelector('.el-progress__text').innerHTML = this.progress + '%';
            // ...
          }
        })
        .then((response) => {
          CIQ.hideCover()
          CIQ.nprogress.done()

          // 文件上传完成后的处理逻辑
          console.log('文件上传成功', response)
          const { status, error } = response.data
          // self.$store.commit('form/saveUserCustomIndicator', response.data.fileID)
          // 还原文件对象的 raw 属性
          if (status == 200 || status == 201) {
            self.$notify.success({
              title: 'Tips',
              message: 'File uploaded successfully. You can click on the file to preview it.',
              duration: 0
            });
            self.previewFileID = response.data.file_id
            const obj = {}
            obj.index = this.panelIndex
            obj.val = response.data.file_id
            obj.criteriaCF = capitalizeFirstLetter(this.criteria)
            obj.previewFileID = self.previewFileID
            if (self.criteria.startsWith('entry')) {
              self.$store.commit(`form/saveUsersOwnFileHash`, obj)
            }
            if (self.criteria.startsWith('exit')) {
              self.$store.commit(`form/saveUsersOwnFileHash`, obj)
            }
            let fileObj = {}
            fileObj.index = self.panelIndex
            fileObj.val = {
              data: response.data,
              criteria: self.criteria,
              index: self.panelIndex
            }
            self.$emit('userUploadFileContent', fileObj)
            // self.handleUsersOwnIndicatorSelect(response.data)
            // let valObj = {}
            // valObj.value = this.si.userIndicator
            // valObj.index = this.panelIndex
            // self.$emit('getIndicatorVal', valObj)
          } else {
            return Promise.reject(error)
          }
          // ...
        })
        .catch((error) => {
          CIQ.hideCover()
          CIQ.nprogress.done()
          // 文件上传出错的处理逻辑
          console.log('文件上传失败', error)
          // 清空文件列表
          self.$refs.upload.clearFiles()
          self.fileList = []
          self.$notify.warning({
            title: 'Tips',
            message: 'File upload failed.',
            duration: 0
          });

          // ...
        })
    },
    handleUploadSuccess(response, file, fileList) {
      // 上传成功回调
      console.log('上传成功回调：', response)
      // 更新文件列表中对应文件的状态为成功
      // this.fileList.forEach((item) => {
      // 	if (item.uid === file.uid) {
      // 		item.progress = 100 // 进度设置为 100
      // 		item.status = 'success' // 状态设置为成功
      // 	}
      // })
    },
    handleUploadError(error, file, fileList) {
      // 上传失败回调
      console.log('上传失败：', error)
      this.dialogFormVisible = false
      this.$refs.upload.clearFiles()
      this.fileList = []
      // 更新文件列表中对应文件的状态为
    },
    async handleRemove(file, fileList) {
      console.log('处理删除', file)
      // 备份文件对象的 raw 属性
      this.rawMap[file.uid] = this.rawMap[file.uid] || file.raw
      // 发送请求删除服务器上的文件
      const hash = this.file_hash || file.hash
      const fileID = file.name.replace('.csv', '') + 'HASH' + hash
      if (!hash) { this.$refs.upload.clearFiles(); this.fileList = []; return }
      try {
        await csvFileDelete(fileID)
        console.log('删除成功')
        this.clearUserOwnIndicatorSelect()
      } catch (error) {
        console.log('删除失败', error)
      } finally {
        this.$refs.upload.clearFiles();
        this.fileList = []
      }
    },
    handlePreview(file) {
      CIQ.addCover('Parsing the file....')
      CIQ.nprogress.start()
      const fileContent = atob(file.raw.split(',')[1]) // 解码 Base64 数据
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          // 获取解析后的数据
          const data = result.data
          // 更新预览表格的数据
          this.previewData = data
          this.previewFileName = file.name
          // 显示预览表格
          CIQ.hideCover()
          CIQ.nprogress.done()
          this.previewVisible = true
        },
        error: (error) => {
          // 解析错误时的处理逻辑
          console.error('解析错误:', error)
          this.$notify.warning({
            title: 'Tips',
            message: 'File parsing error, unable to preview.',
            duration: 0
          });
          CIQ.hideCover()
          CIQ.nprogress.done()
        }
      })
    },
    async _handlePreview(file) {
      // CIQ.addCover('Parsing the file....')
      // CIQ.nprogress.start()
      // const fileContent = atob(file.raw.split(',')[1]) // 解码 Base64 数据
      // Papa.parse(fileContent, {
      //   header: true,
      //   skipEmptyLines: true,
      //   complete: (result) => {
      //     // 获取解析后的数据
      //     const data = result.data
      //     // 更新预览表格的数据
      //     this.previewData = data
      //     this.previewFileName = file.name
      //     // 显示预览表格
      //     CIQ.hideCover()
      //     CIQ.nprogress.done()
      //     this.previewVisible = true
      //   },
      //   error: (error) => {
      //     // 解析错误时的处理逻辑
      //     console.error('解析错误:', error)
      //     this.popUpMsgBox('File parsing error, unable to preview.')
      //     CIQ.hideCover()
      //     CIQ.nprogress.done()
      //   }
      // })

      CIQ.addCover('Parsing the file....')
      CIQ.nprogress.start()
      debugger
      const str = this.previewFileID
      const page = this.previewPage.page
      const startIndex = str.indexOf('HASH')
      const endIndex = startIndex + 4 // 假设 "HASH" 的长度为 4
      if (startIndex !== -1) {
        const beforeHash = str.substring(0, startIndex)
        const afterHash = str.substring(endIndex)
        await this.getPreviewList(beforeHash, afterHash, page)
        CIQ.hideCover()
        CIQ.nprogress.done()
        this.previewVisible = true
      }
    },
    handleExceed(files, fileList) {
      this.$notify.warning({
        title: 'Tips',
        message: 'Only single indicator files can be uploaded.',
        duration: 0
      });
      return false
    },

    /** START 
     * util functions for indicator uploader */
    readFileContent(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = (event) => {
          const hash = SparkMD5.hashBinary(reader.result)
          file.hash = hash
          this.file_hash = hash
          debugger
					resolve(event.target.result);
				};
				reader.onerror = (error) => {
					reject(error);
				};
				reader.readAsText(file);
			});
    	},
		skipEmptyLine(content){
			return new Promise((resolve, reject) => {
				let csvContent = []
				Papa.parse(content, {
							header: true, // 指定是否将第一行作为字段名
							skipEmptyLines: true,
							trimHeaders: true, // 去除表头中每个字段的空格
							trimRows: true, // 去除数据行中每个字段的空格
							step: function (row) {
								csvContent.push(row.data)
							},
							complete: function () {
								// 将处理后的 csvContent 转换回 CSV 字符串
								const csvString = Papa.unparse(csvContent);
                resolve(csvString);
							},
							error: (error) => {
								reject(error)
							}
				})
			});
		},
    /******** END ***************/

    async beforeUpload(file) {
      CIQ.addCover('File verification in progress...')
      CIQ.nprogress.start()
      if (!file.raw) {
        const reader = new FileReader()
        reader.onload = (event) => {
          file.raw = event.target.result
        }
        reader.readAsDataURL(file)
      }
      console.log('上传前', file)
      // 备份文件对象的 raw 属性
      this.rawMap[file.uid] = this.rawMap[file.uid] || file.raw
      if (!/(CSV)/i.test(file.type)) {
        CIQ.hideCover()
        CIQ.nprogress.done()
        this.$notify.warning({
          title: 'Tips',
          message: 'The uploaded file must be in CSV format.',
          duration: 0
        });
        return Promise.reject('The uploaded file must be in CSV format.')
      }
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      let fileName = file.name.replace(/\s*/g, "")
      if (!reg.test(fileName.replace('.csv', ''))) {
        CIQ.hideCover()
        CIQ.nprogress.done()
        this.$notify.warning({
          title: 'Tips',
          message: 'The file name must start with a letter and can only contain letters, numbers, spaces, and underscores.',
          duration: 0
        });
        return Promise.reject('The file name must start with a letter and can only contain letters, numbers, spaces,and underscores.')
      }
      if (file.size === 0) {
        CIQ.hideCover()
        CIQ.nprogress.done()
        this.$notify.warning({
          title: 'Tips',
          message: 'Empty files cannot be uploaded.',
          duration: 0
        });
        return Promise.reject('Empty files cannot be uploaded.')
      }
      // 限制文件上传大小 1M
      if (file.size > 1 * 1024 * 1024) {
        CIQ.hideCover()
        CIQ.nprogress.done()
        this.$notify.warning({
          title: 'Tips',
          message: 'The uploaded file cannot exceed 1MB.',
          duration: 0
        });
        return Promise.reject('The uploaded file cannot exceed 1MB.')
      }
      try {
          /** START
					 * 	remove empty line
					 */
					// const fileContent = await this.readFileContent(file);
					// const filteredContent = await this.skipEmptyLine(fileContent)
					// const newFile = new File([filteredContent], file.name, { type: file.type });
					/********END********* */

          await this.validateCSV(file)
          await this.handleParseResult(this.csvContent, file)
  
        this.form.indicatorName = file.name.replace('.csv', '')
        this.fileList.push(file)
        CIQ.hideCover()
        CIQ.nprogress.done()
        this.dialogFormVisible = true
      } catch (error) {
        console.log('error', error)
        this.dialogFormVisible = false
        CIQ.hideCover()
        CIQ.nprogress.done()
        return Promise.reject(error)
      }
      return false
    },
    handleUploadProgress(event, uid, fileList) {
      // 上传进度回调
      let { loaded, total } = event
      const progress = (loaded / total) * 100
      this.fileList = fileList.map((item) => {
        console.log(item.uid)
        if (item.uid === uid) {
          item.progress = progress
        }
      })
      // const progress = Math.round(event.percent);
      // 自定义方式展示进度条
      // this.$refs.upload.$el.querySelector('.el-progress-bar__inner').style.width = progress + '%';
    },
    handleDialogClose() {

      CIQ.addCover('File upload in progress...')
      CIQ.nprogress.start()
      console.log('弹窗关闭')
      this.$refs['userForm'].resetFields()
      this.dialogFormVisible = false
      const file = this.fileList[this.fileList.length - 1]
      this.uploadFile(file)
    },
    handleDialogConfirm(formName) {

      CIQ.addCover('Uploading file...')
      CIQ.nprogress.start()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('this.fileList', this.fileList)
          this.fileList.map((item) => {
            const oldFileName = item.name
            const _indicatorName = this.form.indicatorName.replace(/\s*/g, "")
            const newFileName = oldFileName.replace(
              oldFileName.replace('.csv', ''),
              _indicatorName
            )
            const file = this.fileList[this.fileList.length - 1]
            console.log('弹窗确认')
            const blob = file.slice(0, file.size, file.type)
            const newFile = new File([blob], newFileName, { type: file.type })
            newFile.uid = file.uid
            newFile.hash = this.file_hash
            this.fileList.splice(-1, 1, newFile)
            this.dialogValid = true
            this.dialogFormVisible = false
            this.uploadFile(newFile)
          })
          // this.$refs.upload.submit()
          return
        } else {
          CIQ.hideCover()
          CIQ.nprogress.done()
        }
      })
    },
    cancelIndicatorName(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    async validateCSV(file) {
      const self = this
      return await new Promise(async (resolve, reject) => {
        // 限制字段
        let isDateFormat = true
        let isNumFormat = true
        let isNotEmpty = true
        self.csvContent = []
        
        try {
          const content = await self.readFileContent(file);
          const rows = content.trim().split('\n')
          const headers = rows[0].trim().split(',')
          const lines = content.split('\n')
          // 获取 CSV 文件的字段顺序
          const fieldOrder = lines[0].trim().split(',')
          const isOrdered = this.validateCSVFieldOrder(fieldOrder)
          if (!isOrdered) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            return reject(new Error('CSV field order is incorrect.'))
          }

          // 判断表头和表内容是否都存在
          if (
            headers.length === 0 ||
            (headers.length !== 0 && rows.length === 1)
          ) {
            isNotEmpty = false
          }
          // 使用 PapaParse 解析 CSV 文件内容
          const errorRow = []
          const result = Papa.parse(content, {
            header: true, // 指定是否将第一行作为字段名
            skipEmptyLines: true,
            trimHeaders: true, // 去除表头中每个字段的空格
            trimRows: true, // 去除数据行中每个字段的空格
            step: function (row) {
              const error = {}
              const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/
              const dateColumnIndex = 'Date'
              for (const key in row.data) {
                if (Object.hasOwnProperty.call(row.data, key)) {
                  row.data[key] = row.data[key].trim()
                }
              }
              // const trimmedRow = row.data.map((value) => value.trim())
              const dateCell = row.data[dateColumnIndex]
              const numFormatRegex = /^-?\d+(\.\d{1,})?$/
              const numColumnIndex = 'Close' // Change this to the index of the column you want to check
              const numCell = row.data[numColumnIndex]
              if (!dateFormatRegex.test(dateCell)) {
                console.log('日期格式校验失败', dateCell)
                error.Date = dateCell
                error.Close = numCell
                isDateFormat = false
                errorRow.push(error)
                // parser.pause()
                return
              }
              if (!numFormatRegex.test(numCell)) {
                console.log('数字格式校验失败')
                error.Date = dateCell
                error.Close = numCell
                errorRow.push(error)
                isNumFormat = false
                // parser.pause()
                return
              }
              errorRow.push(error)
              self.csvContent.push(row)
              // parser.resume()
            },
            complete: function () {
              // resolve(csvContent)
            },
            error: (error) => {
              reject(error)
            }
          })
          // 进行字段校验
          const isVerified = this.validateFields(errorRow)
          if (
            isVerified &&
            isOrdered &&
            isDateFormat &&
            isNumFormat &&
            isNotEmpty
          ) {
            // this.progress = 0 // 每次上传前重置进度为0
            // this.fileList.push({
            // 	uid: file.uid,
            // 	name: file.name,
            // 	progress: 0, // 进度初始化为 0
            // 	status: 'uploading' // 状态设置为上传中
            // })
            // this.form.indicatorName = file.name.replace('.csv', '')
            // this.fileList.push(file)
            // this.dialogFormVisible = true
            resolve(file)
          } // 校验通过，允许上传
          if (!isNotEmpty) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
              title: 'Tips',
              message: 'Uploaded CSV file is empty. Ensure table header and content are present.',
              duration: 0
            });
            return reject(
              new Error('Uploaded CSV file is empty. Ensure table header and content are present.')
            )
          }
          if (!isVerified) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            return reject(new Error('CSV field validation failed.'))
          }
          if (!isDateFormat) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
              title: 'Tips',
              message: 'Date column in the file has an incorrect format. It should be in yyyy-MM-dd format, like 2023-04-20.',
              duration: 0
            });
            return reject(
              new Error(
                `Date column in the file has an incorrect format. It should be in yyyy-MM-dd format, like 2023-04-20.`
              )
            )
          }
          if (!isNumFormat) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
              title: 'Tips',
              message: 'Close column in the file has an incorrect format. It must be a numerical value, such as 45.55.',
              duration: 0
            });
            return reject(
              new Error(
                `Close column in the file has an incorrect format. It must be a numerical value, such as 45.55.`
              )
            )
          }
        } catch (error) {
					CIQ.hideCover();
					CIQ.nprogress.done();
					reject(error);
				}
      })
    },
    validateFields(_data) {
      const data = _data.filter(item => Object.keys(item).length)
      if (data.length > 0) {
        // 如果有错误，显示错误信息 生成表格行的 HTML
        const tableRows = data.map(item => `
          <tr>
            <td>${item.Date}</td>
            <td>${item.Close}</td>
          </tr>
        `).join('');

        // 生成完整的 HTML 片段，包括表头和动态生成的行
        const tableHTML = `
          <div>
            <p>Data format is wrong in these rows. Correct before re-uploading.</p>
            <table border="1" style="width: 100%; text-align: center">
              <tr>
                <th>Date</th>
                <th>Close</th>
              </tr>
              ${tableRows}
            </table>
          </div>
        `;

        // 使用 $message 显示 HTML
        this.$notify.warning({
          title: 'Incorrect Data Format in Rows',
          dangerouslyUseHTMLString: true,
          message: tableHTML,
          duration: 0
        });
        return false
      }
      return true
    },
    validateCSVFieldOrder(fieldOrder) {
      // 在这里进行 CSV 字段顺序校验的逻辑
      const orderedValues = ['Date', 'Close'] // 规定顺序
      for (let i = 0; i < fieldOrder.length - 1; i++) {
        const currentIndex = orderedValues.indexOf(fieldOrder[i])
        const nextIndex = orderedValues.indexOf(fieldOrder[i + 1])
        // 首先名称存在，再判断顺序
        if (
          currentIndex !== -1 &&
          nextIndex !== -1 &&
          currentIndex > nextIndex
        ) {
          this.$notify.warning({
            title: 'Tips',
            message: 'Field order validation failed.',
            duration: 0
          });
          return false
        }
        if(currentIndex == -1 || nextIndex == -1) {
          this.$notify.warning({
            title: 'Tips',
            message: 'File header is missing or incorrect. It should be: [Date, Close].',
            duration: 0
          });
          return false
        }
      }
      return true
    },
    async handleParseResult(data, file) {
      console.log('处理过的结果', data)
      // 按照时间排序
      const sortedRows = data.sort(
        (a, b) => moment(a.data.Date) - moment(b.data.Date)
      )
      // 获取 Date 列的数据
      const dateData = sortedRows.map((row) => row.data.Date)
      // 计算时间间隔
      const startDate = dateData[0]
      const endDate = dateData[dateData.length - 1]
      const frequency = this.$store.state.form.backtestInfo.frequency.toLowerCase()
      if (frequency !== 'daily') {
        this.$notify.warning({
          title: 'Tips',
          message: 'Only daily CSV files can be uploaded. Please set the timeframe to Daily and try uploading again.',
          duration: 0
        });
        return Promise.reject(
          `Only daily CSV files can be uploaded. Please set the timeframe to Daily and try uploading again.`
        )
      }
      let symbol = this.$store.state.form.backtestSymbol || process.env.VUE_APP_DEFAULT_SYMBOL
      /** 防止当前为custom symbol时发送对比pairdata和my data出错 */
      const {type} = getSymbolInfo(symbol)
			if(!['stock','index'].includes(type)){
				symbol = process.env.VUE_APP_DEFAULT_SYMBOL
			}
      const res = await getPairData(startDate, endDate, frequency, symbol)
      const pairDataDate = res.data.map((item) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
        if (dateRegex.test(item.DT)) {
          const dateObj = new Date(item.DT)
          const formattedDate = dateObj.toISOString().slice(0, 10)
          return formattedDate
        } else {
          console.log('Invalid date format')
          CIQ.hideCover()
          CIQ.nprogress.done()
          this.$notify.warning({
            title: 'Tips',
            message: 'Invalid date format.',
            duration: 0
          });
          return Promise.reject(`Invalid date format.`)
        }
      })
      // const pairStartDate = pairDataDate[0]
      // const pairEndDate = pairDataDate[pairDataDate.length - 1]
      // const filteredArr = dateData.filter(date => date >= pairStartDate && date <= pairEndDate);
      //  const filteredArr = dateData
      const isDiffDateArr = compareArrays(dateData, pairDataDate)
      if (isDiffDateArr === true) {
        // 用户上传的 Date 和 pairData 的 Date 一致
        return Promise.resolve(true)
      } else {
        const diffDateArr = Array.from(new Set(isDiffDateArr))
        CIQ.hideCover()
        CIQ.nprogress.done()
        this.$notify.warning({
          title: 'Tips',
          message: 'Only daily CSV files can be uploaded. Please ensure that the CSV file does not contain non-trading days such as weekends and public holidays.',
          duration: 0
        });
        console.log('上传的 CSV 中, 以下时间是非交易日', diffDateArr)
        this.nonBusinessDay = diffDateArr
        this.nonBusinessFile = file
        this.nonBusinessDialogVisible = true
        return Promise.reject(
          `Only daily CSV files can be uploaded. Please ensure that the CSV file does not contain non-trading days such as weekends and public holidays.`
        )
      }
    },
    cancelBusinessDialogClose() {
      this.nonBusinessDialogVisible = false
    },
    confirmBusinessDialogClose() {
      this.nonBusinessDialogVisible = false
      const file = this.nonBusinessFile
      const csvData = file.raw
      const csvContent = csvData.split(';base64,').pop();
      const decodedData = atob(csvContent);
      const parsedData = this.parseCSV(decodedData);
      console.log('解析的数据', parsedData)
      const filteredData = parsedData.filter((row) => !this.nonBusinessDay.includes(row.Date));
      console.log('filteredData', filteredData)

      function convertToCSV(dataArray) {
        const headers = Object.keys(dataArray[0]);
        const rows = dataArray.map((row) => headers.map((header) => row[header]));
        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
        // return `data:text/csv;base64,${btoa(csvContent)}`;
        return csvContent
      }

      const filteredCsvData = convertToCSV(filteredData);
      const base64Data = btoa(filteredCsvData); // 编码为 Base64
      const rawValue = `data:text/csv;base64,${base64Data}`;
      const filteredFile = new File([filteredCsvData], `${file.name}`, { type: 'text/csv' });
      filteredFile.raw = rawValue;
      filteredFile.uid = file.uid;
      filteredFile.hash = file.hash;
      console.log('file', file)
      console.log('filteredFile', filteredFile)
      this.form.indicatorName = filteredFile.name.replace('.csv', '')
      this.fileList.push(filteredFile)
      console.log(this.fileList)
      CIQ.hideCover()
      CIQ.nprogress.done()
      this.dialogFormVisible = true
    },
    parseCSV(csvData) {
      const rows = csvData.split('\n');
      const headers = rows[0].split(',');
      const data = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split(',');
        if (row.length === headers.length) {
          const rowData = {};
          for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = row[j];
          }
          data.push(rowData);
        }
      }

      return data;
    },
    async autoFillUserIndicator(data) {
      this.indicatorRadio = "Users' Own Indicator"
      let userIndicator = data.file_name
      this.si.userIndicator = userIndicator

      const response = await csvFileRead(userIndicator, data.hash)

      // 还原文件对象的 raw 属性
      const index = this.panelIndex
      const obj = {}
      obj.index = index
      obj.val = response.data.data.file_id
      this.previewFileID = response.data.data.file_id
      obj.criteriaCF = capitalizeFirstLetter(this.criteria)
      this.$emit('getIndicatorUrl', {
        index: index,
        url: response.data.data.file_id
      })
      console.log('还原文件对象的 raw 属性', obj)
      if (this.criteria.startsWith('entry')) {
        this.$store.commit(`form/saveUsersOwnFileHash`, obj)
      }
      if (this.criteria.startsWith('exit')) {
        this.$store.commit(`form/saveUsersOwnFileHash`, obj)
      }
      const res = response.data.data.csv_content
      let fileData = []
      try {
        fileData = res.map((item) => ({
          Date: formatStandardTime(item.DT).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          Close: item.indicator_Close
        }))

        const csvData =
          'Date,Close\n' +
          fileData.map((item) => `${item.Date},${item.Close}`).join('\n')
        const base64Data = btoa(csvData) // 编码为 Base64
        const rawValue = `data:text/csv;base64,${base64Data}`
        const file = new File([csvData], `${userIndicator}.csv`, {
          type: 'text/csv'
        })
        file.raw = rawValue
        this.fileList.splice(-1, 1, file)
      } catch (error) {
        console.log('error', error)
      }

    },
    async handleCurrentChange(newpage) {
      this.previewPage.page = newpage
      const str = this.previewFileID
      const startIndex = str.indexOf('HASH')
      const endIndex = startIndex + 4 // 假设 "HASH" 的长度为 4
      if (startIndex !== -1) {
        const beforeHash = str.substring(0, startIndex)
        const afterHash = str.substring(endIndex)
        await this.getPreviewList(beforeHash, afterHash, newpage)
      }
    },
    async getPreviewList(name, hash, page) {
      const response = await csvFilePagingRead(name, hash, page)
      const res = response.data
      if (res.status == 200) {
        const csv_content = res.data.csv_content
        this.previewData = csv_content.map((item) => ({
          Date: formatStandardTime(item.DT).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          Close: item.indicator_Close
        }))
        this.previewPage.total = res.data.total_rows
      }
    }
  }
}
</script>
<style lang="less" scoped>
.dropdown {
	display: block;
	left: unset;
	right: 0;
}
.dropbtn:after {
	right: 14px;
	top: 15px;
}

.indicator-container {
	display: flex;
}
/deep/ .sentiBox .el-input__inner {
	width: 334px;
	padding-left: 30px;
}
/deep/ .techBox .el-input--prefix .el-input__inner:first-child {
	width: 334px;
	padding-left: 30px;
}
/deep/ .symbolBox .el-input--suffix .el-input__inner:first-child {
	width: 334px;
	padding-left: 30px;
}
/deep/ .el-radio__label {
	display: inline-block;
	width: 136px;
}
.userIndicatorBox {
  position: relative;
  margin-bottom: 113px;
}
.upload-demo {
	display: flex;
	flex-direction: row-reverse;
  position: absolute;
  top: 28px;
  min-height: 85px;
}
.upload-demo {
	flex-direction: column;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
	border-left: 1px solid #dcdfe6;
	border-right: 1px solid #dcdfe6;
	border-bottom: 1px solid #dcdfe6;
	padding: 5px;
}
.indicator-form-item /deep/ .el-form-item__content {
	line-height: 15px;
}
.upload-indicator-btn {
	width: 100%;
}
.text {
	font-size: 14px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}
.clearfix:after {
	clear: both;
}

.box-card {
	width: 100%;
}
.labelWithSelectBox{
  .el-form-item--mini /deep/ .el-form-item__content{
      display: flex;
      flex: 1;
  }
  /deep/ .el-form-item__label {
    width: 136px;
  }
  .selectBox {
    display: flex;
    flex: 1;
  }
  .el-form-item {
    display: flex;
    width: 100%;
    .el-form-item__content {
      flex: 1;
      display: flex;
    }
    .el-select, .el-autocomplete{
      display: flex;
      flex: 1;
    }
  }
}
.el-upload__tip {
  line-height: 15px;
}

.hint {
  margin-left: 146px;
  font-size: 12px;
  color: #333333;
}
</style>
