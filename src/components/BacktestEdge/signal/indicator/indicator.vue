// indicator search box
<template>
	<div class="indicator-box">
		<el-form :model="si" ref="siForm" :rules="rules">
			<div class="indicator-container sentiBox">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Sentiment Indicator"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="sentimentIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
              ref="sentiInput"
							prefix-icon="el-icon-search"
							class="inline-input"
							clearable
							v-model="si.sentimentIndicator"
							:disabled="!(indicatorRadio === 'Sentiment Indicator')"
							:fetch-suggestions="indicatorSentimentSearch"
							placeholder="Input the sentiment indicator"
							@select="handleSentimentSelect"
              @clear="clearSentimentSelect"
							highlight-first-item
						></el-autocomplete>
						<!-- <div class="dropdown">
							<div @click="myFunction" class="dropbtn" id="dropbtn">{{category}}</div>
							<div ref="myDropdown" id="myDropdown" class="dropdown-content">
								<div @click="selectCategory">all</div>
								<div @click="selectCategory">model</div>
								<div @click="selectCategory">model2</div>
								<div @click="selectCategory">model3</div>
							</div>
						</div> -->
					</div>
				</el-form-item>
			</div>
			<div class="indicator-container techBox">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Technical Indicator"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="technicalIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
              ref="techInput"
							:disabled="!(indicatorRadio === 'Technical Indicator')"
							class="inline-input"
							clearable
							prefix-icon="el-icon-search"
							v-model="si.technicalIndicator"
							:fetch-suggestions="indicatorTechnicalSearch"
							placeholder="Input the technical indicator"
							@select="handleTechnicalSelect"
              @clear="clearTechnicalSelect"
						></el-autocomplete>
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Hint: To change the indicator settings<br />Right click the
								indicator in the above chart and select "Edit Setting"
							</span>
							<i class="el-icon-info" style="margin-left: 5px"></i>
						</el-tooltip>
					</div>
				</el-form-item>
			</div>
			<div class="indicator-container symbolBox">
				<el-form-item>
					<el-radio
            ref="symbolInput"
						v-model="indicatorRadio"
						label="Symbol OHLCV"
						@change="changeIndicatorChecked"
            @clear="clearSymbolSelect"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="symbolIndicator">
					<el-select
						v-model="si.symbolIndicator"
						placeholder="Select Symbol Open/High/Low/Close/Volume"
						:disabled="!(indicatorRadio === 'Symbol OHLCV')"
						@change="handleSymbolSelect"
					>
						<el-option
							v-for="item in symbolConditions"
							:key="item.value"
							:label="item.obj.label"
							:value="item.obj"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</div>
			<div
				class="indicator-container sentiBox"
				v-show="indicatorRadio !== 'Users\' Own Indicator'"
			>
				<el-form-item>
					<el-radio v-model="indicatorRadio" label="Users' Own Indicator" @change="changeIndicatorChecked">
					</el-radio>
				</el-form-item>
				<el-form-item prop="userIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
							prefix-icon="el-icon-files"
							:disabled="!(indicatorRadio === 'Users\' Own Indicator')"
							class="inline-input"
							clearable
							v-model="si.userIndicator"
							placeholder="Select Users' Own Indicator File."
						></el-autocomplete>
						<!-- <el-tooltip effect="dark" placement="top">
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip> -->
					</div>
				</el-form-item>
			</div>
			<div class="indicator-container customBox" v-show="indicatorRadio === 'Users\' Own Indicator'">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Users' Own Indicator"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="userIndicator" class="indicator-form-item">
					<div class="indicatorSearchBox">
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
							:disabled="!(indicatorRadio === 'Users\' Own Indicator')"
						>
							<el-button
								size="small"
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
					</div>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>
<script>
import SparkMD5 from 'spark-md5'
import { CIQ } from '@/components/common/chart/st-development/js'
import {
  getIndicatorsList,
  csvFileDelete,
  csvFileRead,
  getPairData,
  csvFilePagingRead
} from '@/service/service'
import Papa from 'papaparse'
import axios from 'axios'
import { compareArrays } from '@/tools/compareArrays'
import moment from 'moment'
import { mapMutations } from 'vuex'
export default {
  props: {
    criteria: String,
    panelIndex: Number,
    editableTabsValue: String,
    editableTabs: Array,
    exitItemCheck: Boolean
  },
  data() {
    var validateSenti = (rule, value, callback) => {
      if (!value && this.indicatorRadio == 'Sentiment Indicator') {
        callback(new Error('Please choose sentiment indicator'))
      } else {
        callback()
      }
    }
    var validateTech = (rule, value, callback) => {
      if (!value && this.indicatorRadio == 'Technical Indicator') {
        callback(new Error('Please choose technical indicator'))
      } else {
        callback()
      }
    }
    var validateSym = (rule, value, callback) => {
      if (!value && this.indicatorRadio == 'Symbol OHLCV') {
        callback(new Error('Please choose symbol ohlcv'))
      } else {
        callback()
      }
    }
    var validateRisk = (rule, value, callback) => {
      if (!value && this.indicatorRadio == 'Risk Indicator') {
        callback(new Error('Please choose risk indicator'))
      } else {
        callback()
      }
    }
    var validateIndicatorName = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      let _value = value.replace(/\s*/g, "")
      if (!_value && this.indicatorRadio == "Users' Own Indicator") {
        callback(new Error('Name cannot be empty.'))
      } else if (!reg.test(_value)) {
        callback(new Error('It must start with a letter and can only contain letters, numbers, spaces, and underscores.'))
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
      sentimentIndicatorList: JSON.parse(JSON.stringify(this.$store.state.chart.indicatorsList).replace(/chart_name/g, 'value')),
      symbolConditions: [
        { value: 0, obj: { label: 'Symbol Open', field: 'Open' } },
        { value: 1, obj: { label: 'Symbol High', field: 'High' } },
        { value: 2, obj: { label: 'Symbol Low', field: 'Low' } },
        { value: 3, obj: { label: 'Symbol Close', field: 'Close' } },
        { value: 4, obj: { label: 'Symbol Volume', field: 'Volume' } }
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
      exampleDataVisible: false
    }
  },
  computed: {
    updateFreq() {
      return this.$store.state.form.pairDataFreq
    },
    updateSenti() {
      return this.$store.state.chart.currentSenti
    },
    frequency() {
      return this.$store.state.form.exitFrequency
    }
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
    updateSenti(val) {
      let tabs = this.editableTabs
      var absoluteIndex = ''
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
        let sentiIndicatorResult = CIQ.findSentiIndicator(val.name,null)
        if(sentiIndicatorResult){
            this.indicatorRadio = 'Sentiment Indicator'
            if (this.criteria == 'entry') {
              this.$store.commit('chart/getEntryIndicators', {
                index: this.panelIndex,
                value:sentiIndicatorResult.url
              })
            } else {
              this.$store.commit('chart/getExitIndicators', {
                index: this.panelIndex,
                value: sentiIndicatorResult.url
              })
            }
            // extract this statement from handleSentimentSelect
            let valObj = {}
            valObj.value = sentiIndicatorResult.chart_name
            valObj.index = this.panelIndex
            this.$emit('getIndicatorVal', valObj)

            this.currentSentiUpdated = sentiIndicatorResult.updated
            let freqObj = {}
            freqObj.value = sentiIndicatorResult.updated
            freqObj.index = this.panelIndex
            freqObj.criteria = this.criteria
            freqObj.key = `${this.criteria}_${this.panelIndex}`
            this.setFrequencyArray(freqObj)
            this.$emit('getFreqArray', freqObj)
            // Remove form verification
            this.clearFormValidate()
            let radioObj = {}
            radioObj.value = 'sentiment'
            radioObj.index = this.panelIndex
            this.$emit('getIndicatorRadio', radioObj)
            let obj = {}
            obj.index = this.panelIndex
            obj.url = sentiIndicatorResult.url
            this.$emit('getIndicatorUrl', obj)
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
    }
  },
  methods: {
    ...mapMutations(['setFrequencyArray', 'setFreqencyLP']),
    myFunction() {
      this.$refs.myDropdown.classList.toggle('show')
    },
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
      this.$refs.siForm.clearValidate()
      this.$refs.upload.clearFiles()
      this.fileList = []
      this.changeIndicatorChecked('Sentiment Indicator')
    },
    // sentiment search
    indicatorSentimentSearch(queryString, cb) {
      var list = this.sentimentIndicatorList
      list.sort(function (a, b) {
        return a.value.localeCompare(b.value)
      })
      var results = queryString
        ? list.filter(
          this.createStateSentimentFilter(queryString)
        )
        : list
      cb(results)
    },
    createStateSentimentFilter(queryString) {
      return (state) => {
        if (state.value.indexOf('Seasonality') !== -1) {
          return false
        }
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        )
      }
    },
    // technical search
    indicatorTechnicalSearch(queryString, cb) {
      var technicaltIndicatorList = this.$store.state.chart.formateTechnicalList
      if (this.criteria === 'entry') {
        let valueArr = ['ATR Trailing Stops', 'Parabolic SAR']
        technicaltIndicatorList = technicaltIndicatorList.filter(
          (item) => valueArr.indexOf(item.value) === -1
        )
      }
      var results = queryString
        ? technicaltIndicatorList.filter(
          this.createTechnicalFilter(queryString)
        )
        : technicaltIndicatorList

      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createTechnicalFilter(queryString) {
      return (technicaltIndicatorList) => {
        return (
          technicaltIndicatorList.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1
        )
      }
    },
    indicatorRiskSearch(queryString, cb) {
      var riskIndicatorList = this.loadRiskList()
      var results = queryString
        ? riskIndicatorList.filter(this.createRiskFilter(queryString))
        : riskIndicatorList
      // Call callback to return the data of the suggestion list
      cb(results)
    },
    createRiskFilter(queryString) {
      return (riskIndicatorList) => {
        return (
          riskIndicatorList.value
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) !== -1
        )
      }
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

      let indiValObj = {}
      indiValObj.value = ''
      indiValObj.index = this.panelIndex
      this.$emit('getIndicatorVal', indiValObj)

      // remove a MA tat already exists in current criteria before loading
      var activatedMAList = this.$store.state.chart.activatedMA
      if (this.criteria == 'entry') {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.entry[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getEntryIndicators', {
          index: this.panelIndex,
          value: ''
        })
         
        let indiUrlObj = {}
        indiUrlObj.index = this.panelIndex
        indiUrlObj.url = ''
        this.$emit('getIndicatorUrl', indiUrlObj)
      } else {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getExitIndicators', {
          index: this.panelIndex,
          value: ''
        })
        let indiUrlObj = {}
        indiUrlObj.index = this.panelIndex
        indiUrlObj.url = ''
        this.$emit('getIndicatorUrl', indiUrlObj)
      }

      // 移除chartiq对应的extraIndicators
      let extraIndicators = []
			extraIndicators.push(...this.$store.state.chart.indicators.extraIndicators)
      extraIndicators = extraIndicators.filter(x=>x!=item.url)
			this.$store.commit('chart/getExtraIndicators',extraIndicators)

      // lishn 判断需要小龙写
      CIQ.addIndicators()
    },
    handleSentimentSelect(item) {
      this.currentSentiUpdated = item.updated
      let freqObj = {}
      freqObj.value = item.updated
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      // old version only
      // 限制同屏显示个数
      var countExistIndicator = 0
      for (var studyInstanceName in CIQ.stxx.layout.studies) {
        if (
          CIQ.findBuiltinTechIndicator(null,CIQ.stxx.layout.studies[studyInstanceName].type)  
        ) {
          countExistIndicator--
        }
        
        if (CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA') {
          countExistIndicator--
        }
        countExistIndicator++
      }

      if (countExistIndicator >= 10) {
        CIQ.description('Maximum 10 signals can be displayed on chart')
        return
      }

      //this.si.sentimentIndicator = item.value
      let obj = {}
      obj.value = item.value
      obj.index = this.panelIndex
      this.$emit('getIndicatorVal', obj)
      // remove a MA tat already exists in current criteria before loading
      var activatedMAList = this.$store.state.chart.activatedMA
      if (this.criteria == 'entry') {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.entry[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getEntryIndicators', {
          index: this.panelIndex,
          value: item.url
        })
        let obj = {}
        obj.index = this.panelIndex
        obj.url = item.url
        this.$emit('getIndicatorUrl', obj)
      } else {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getExitIndicators', {
          index: this.panelIndex,
          value: item.url
        })
        let obj = {}
        obj.index = this.panelIndex
        obj.url = item.url
        this.$emit('getIndicatorUrl', obj)
      }
      // avoid add indicator redundantly
      for (var studyInstanceName in CIQ.stxx.layout.studies) {
        var sd = CIQ.stxx.layout.studies[studyInstanceName]
        if (sd.type == item.url) {
          return
        }
      }
      CIQ.addIndicators()
    },
    clearSymbolSelect() {
      let freqObj = {}
      freqObj.value = ''
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)

      let indiValObj = {}
      indiValObj.value = ''
      indiValObj.index = this.panelIndex
      this.$emit('getIndicatorVal', indiValObj)

      // remove a MA tat already exists in current criteria before loading
      var activatedMAList = this.$store.state.chart.activatedMA
      if (this.criteria == 'entry') {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.entry[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getEntryIndicators', {
          index: this.panelIndex,
          value: ''
        })
        let indiUrlObj = {}
        indiUrlObj.index = this.panelIndex
        indiUrlObj.url = ''
        this.$emit('getIndicatorUrl', indiUrlObj)
      } else {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getExitIndicators', {
          index: this.panelIndex,
          value: ''
        })
        let indiUrlObj = {}
        indiUrlObj.index = this.panelIndex
        indiUrlObj.url = ''
        this.$emit('getIndicatorUrl', indiUrlObj)
      }

      // lishn 判断需要小龙写
      CIQ.addIndicators()
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

      let obj = {}
      obj.value = item.label
      obj.index = this.panelIndex
      this.$emit('getIndicatorVal', obj)
      // remove a MA tat already exists in current criteria before loading
      var activatedMAList = this.$store.state.chart.activatedMA
      if (this.criteria == 'entry') {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.entry[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getEntryIndicators', {
          index: this.panelIndex,
          value: item.label
        })
        let obj = {}
        obj.index = this.panelIndex
        obj.url = item.label
        this.$emit('getIndicatorUrl', obj)
      } else {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getExitIndicators', {
          index: this.panelIndex,
          value: item.label
        })
        let obj = {}
        obj.index = this.panelIndex
        obj.url = item.label
        this.$emit('getIndicatorUrl', obj)
      }
      // avoid add indicator redundantly
      for (var studyInstanceName in CIQ.stxx.layout.studies) {
        var sd = CIQ.stxx.layout.studies[studyInstanceName]
        if (sd.type == item.label) {
          return
        }
      }
      CIQ.addIndicators()
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

      let valObj = {}
      valObj.index = this.panelIndex
      valObj.value = ''
      this.$emit('getIndicatorVal', valObj)
      const vm = this
      let url = item.url
      let obj = {}
      obj.index = this.panelIndex
      obj.class = ''
      this.$emit('getTechIndiObj', obj)

      // remove a MA tat already exists in current criteria before loading
      var activatedMAList = this.$store.state.chart.activatedMA
      if (this.criteria == 'entry') {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.entry[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getEntryIndicators', {
          index: this.panelIndex,
          value: ''
        })
      } else {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getExitIndicators', {
          index: this.panelIndex,
          value: ''
        })
      }
      
      // 如果是MA，则移除它的信息和位置
      CIQ.removeMALayout(url, this.criteria, this.panelIndex)
      // lishn 判断需要小龙写
     if (arguments[1] != true) {
        CIQ.addIndicators()
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

      let valObj = {}
      valObj.index = this.panelIndex
      valObj.value = item.value
      this.$emit('getIndicatorVal', valObj)
      const vm = this
      let url = item.url
      let obj = {}
      obj.index = this.panelIndex
      obj.class = item.class
      this.$emit('getTechIndiObj', obj)
      // remove a MA tat already exists in current criteria before loadin
      if (this.criteria == 'entry') {
        // remove MA from Vuex after loading Tech
        var activatedMAList = CIQ.store.state.chart.activatedMA

        var MAListIndex = activatedMAList.findIndex(
          (ma) =>
            ma.url == this.$store.state.chart.indicators.formIndicators.entry[this.panelIndex] &&
            ma.criteria == this.criteria &&
            ma.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }

        CIQ.store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getEntryIndicators', {
          index: this.panelIndex,
          value: url
        })
      } else {
        // remove MA from Vuex after loading Tech
        var activatedMAList = CIQ.store.state.chart.activatedMA

        var MAListIndex = activatedMAList.findIndex(
          (ma) =>
            ma.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
            ma.criteria == this.criteria &&
            ma.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }

        CIQ.store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getExitIndicators', {
          index: this.panelIndex,
          value: url
        })
      }
      // store tech indicators in Vuex and use it in addIndicator to test if a member in list is belong to tech
      let techIndicators = []
      techIndicators.push(...CIQ.store.state.chart.indicators.technicalIndicators)
      techIndicators.push(url)
      techIndicators = [...new Set(techIndicators)]
      this.$store.commit('chart/getTechnicalIndicators', techIndicators)

      // 如果是MA，则记录它的信息和位置，entryIndicator里面遇到ma时会访问store里的此记录并还原显示
      CIQ.setMALayout(url, null, null, null, this.criteria, this.panelIndex)

      // avoid add indicator redundantly
      for (var studyInstanceName in CIQ.stxx.layout.studies) {
        var sd = CIQ.stxx.layout.studies[studyInstanceName]
        // 暂定，去重除'ma'外
        if (sd.type == url && sd.type != 'ma') {
          return
        }
      }
      vm.si.technicalIndicator = item.value

      if (arguments[1] != true) {
        CIQ.addIndicators()
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

      let indiValObj = {}
      indiValObj.value = ''
      indiValObj.index = this.panelIndex
      this.$emit('getIndicatorVal', indiValObj)

      // remove a MA tat already exists in current criteria before loading
      var activatedMAList = this.$store.state.chart.activatedMA
      if (this.criteria == 'entry') {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.entry[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getEntryIndicators', {
          index: this.panelIndex,
          value: ''
        })
        let indiUrlObj = {}
        indiUrlObj.index = this.panelIndex
        indiUrlObj.url = ''
        this.$emit('getIndicatorUrl', indiUrlObj)
      } else {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getExitIndicators', {
          index: this.panelIndex,
          value: ''
        })
        let indiUrlObj = {}
        indiUrlObj.index = this.panelIndex
        indiUrlObj.url = ''
        this.$emit('getIndicatorUrl', indiUrlObj)
      }

      // lishn 判断需要小龙写
      CIQ.addIndicators()
    },
    handleUsersOwnIndicatorSelect(data) {
      const frequency = 'Daily'
      const indicatorName = data.file_name
      const indicatorUrl = data.file_id
      this.currentSentiUpdated = frequency

      // user也需要设置daily的FrequencyArray
      // 防止changeRelation到singleCondition后报错

      let freqObj = {}
      freqObj.value = 'Daily'
      freqObj.index = this.panelIndex
      freqObj.criteria = this.criteria
      freqObj.key = `${this.criteria}_${this.panelIndex}`
      this.setFrequencyArray(freqObj)
      this.$emit('getFreqArray', freqObj)
      
      // old version only
      var countExistIndicator = 0
      for (var studyInstanceName in CIQ.stxx.layout.studies) {
        if (CIQ.findBuiltinTechIndicator(null,CIQ.stxx.layout.studies[studyInstanceName].type)){
          countExistIndicator--
        }
        if (CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA') {
          countExistIndicator--
        }
        countExistIndicator++
      }

      if (countExistIndicator >= 10) {
        CIQ.description('Maximum 10 signals can be displayed on chart')
        return
      }
      this.si.userIndicator = indicatorName
      let valObj = {}
      valObj.index = this.panelIndex
      valObj.value = indicatorName
      this.$emit('getIndicatorVal', valObj)
      // remove a MA tat already exists in current criteria before loading
      var activatedMAList = this.$store.state.chart.activatedMA
      if (this.criteria == 'entry') {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.entry[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getEntryIndicators', {
          index: this.panelIndex,
          value: indicatorUrl
        })
        let obj = {}
        obj.index = this.panelIndex
        obj.url = indicatorUrl
        this.$emit('getIndicatorUrl', obj)
      } else {
        var MAListIndex = activatedMAList.findIndex(
          (item) =>
            item.url == this.$store.state.chart.indicators.formIndicators.exit[this.panelIndex] &&
            item.criteria == this.criteria &&
            item.index == this.panelIndex
        )
        if (MAListIndex != -1) {
          activatedMAList.splice(MAListIndex, 1)
        }
        this.$store.commit('chart/getMA', activatedMAList)
        this.$store.commit('chart/getExitIndicators', {
          index: this.panelIndex,
          value: indicatorUrl
        })
        let obj = {}
        obj.index = this.panelIndex
        obj.url = indicatorUrl
        this.$emit('getIndicatorUrl', obj)
      }
      // avoid add indicator redundantly
      for (var studyInstanceName in CIQ.stxx.layout.studies) {
        var sd = CIQ.stxx.layout.studies[studyInstanceName]
        if (sd.type == indicatorUrl) {
          return
        }
      }
      CIQ.addIndicators()
    },
    changeIndicatorChecked(val) {
      console.log('indicatorRadio', val)
      this.indicatorRadio = val
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
        if (this.criteria === 'entry') {
          this.$store.commit(`form/saveUsersOwnEntryFileHash`, {
            index: this.panelIndex,
            val: ''
          })
        }
        if (this.criteria === 'exit') {
          this.$store.commit(`form/saveUsersOwnExitFileHash`, {
            index: this.panelIndex,
            val: ''
          })
        }

        radioObj.value = 'sentiment'
        this.$emit('getIndicatorRadio', radioObj)
        this.$store.commit('form/getEntryIndicatorRadio', 'sentiment')

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
        if (this.criteria === 'entry') {
          this.$store.commit(`form/saveUsersOwnEntryFileHash`, {
            index: this.panelIndex,
            val: ''
          })
        }
        if (this.criteria === 'exit') {
          this.$store.commit(`form/saveUsersOwnExitFileHash`, {
            index: this.panelIndex,
            val: ''
          })
        }
        radioObj.value = 'technical'
        this.$emit('getIndicatorRadio', radioObj)
        this.$store.commit('form/getEntryIndicatorRadio', 'technical')

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
        if (this.criteria === 'entry') {
          this.$store.commit(`form/saveUsersOwnEntryFileHash`, {
            index: this.panelIndex,
            val: ''
          })
        }
        if (this.criteria === 'exit') {
          this.$store.commit(`form/saveUsersOwnExitFileHash`, {
            index: this.panelIndex,
            val: ''
          })
        }
        radioObj.value = 'risk'
        this.$emit('getIndicatorRadio', radioObj)
        this.$store.commit('form/getEntryIndicatorRadio', 'risk')
      } else if (this.indicatorRadio === arr[3]) {
        // 切换radio后移除usersOwnEntryFileHash
        if (this.criteria === 'entry') {
          this.$store.commit(`form/saveUsersOwnEntryFileHash`, {
            index: this.panelIndex,
            val: ''
          })
        }
        if (this.criteria === 'exit') {
          this.$store.commit(`form/saveUsersOwnExitFileHash`, {
            index: this.panelIndex,
            val: ''
          })
        }
        radioObj.value = 'symbol'
        this.$emit('getIndicatorRadio', radioObj)
        this.$store.commit('form/getEntryIndicatorRadio', 'symbol')

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
        if (this.criteria === 'entry') {
          this.$store.commit(`form/saveUsersOwnEntryFileHash`, {
            index: this.panelIndex,
            val: userUrl
          })
        }
        if (this.criteria === 'exit') {
          this.$store.commit(`form/saveUsersOwnExitFileHash`, {
            index: this.panelIndex,
            val: userUrl
          })
        }
        radioObj.value = 'user'
        this.$emit('getIndicatorRadio', radioObj)
        this.$store.commit('form/getEntryIndicatorRadio', 'user')

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
        !this.exitItemCheck
      ) {
        this.$refs.siForm.validate((valid) => {
          validForm = valid
        })
        let sentimentList = JSON.parse(JSON.stringify(this.$store.state.chart.indicatorsList).replace(/chart_name/g, 'value'))

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
            this.$message({
              message:
                'Please select #' +
                (index + 1) +
                ' ' +
                this.criteria +
                ' indicator from the drop-down box',
              type: 'error'
            })
          }
          checked = false
          return checked
        }
      }
      if (
        this.indicatorRadio === "Users' Own Indicator" &&
        !this.exitItemCheck
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
            this.$message({
              message:
                'Please select #' +
                (index + 1) +
                ' ' +
                this.criteria +
                ' indicator from the drop-down box',
              type: 'error'
            })
          }
          checked = false
          return checked
        }
      }
      if (
        this.indicatorRadio === 'Technical Indicator' &&
        !this.exitItemCheck
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
            this.$message({
              message:
                'Please select #' +
                (index + 1) +
                ' ' +
                this.criteria +
                ' indicator from the drop-down box',
              type: 'error'
            })
          }
          checked = false
          return checked
        }
      }
      if (this.indicatorRadio === 'Symbol OHLCV' && !this.exitItemCheck) {
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
            this.$message({
              message:
                'Please select #' +
                (index + 1) +
                ' ' +
                this.criteria +
                ' indicator from the drop-down box',
              type: 'error'
            })
          }
          checked = false
          return checked
        }
      }
      if (this.exitItemCheck) {
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
            let sentimentList = JSON.parse(JSON.stringify(this.$store.state.chart.indicatorsList).replace(/chart_name/g, 'value'))

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

            if (startIndex !== -1) {
              const beforeHash = str.substring(0, startIndex)
              const afterHash = str.substring(endIndex)
              const response = await csvFileRead(beforeHash, afterHash)
              console.log('文件响应', response)

              // 还原文件对象的 raw 属性
              const obj = {}
              obj.index = index
              obj.val = response.data.data.file_id
              vm.previewFileID = str
              vm.$emit('getIndicatorUrl', {
                index: index,
                url: response.data.data.file_id
              })
              console.log('还原文件对象的 raw 属性', obj)
              if (this.criteria === 'entry') {
                this.$store.commit(`form/saveUsersOwnEntryFileHash`, obj)
              }
              if (this.criteria === 'exit') {
                this.$store.commit(`form/saveUsersOwnExitFileHash`, obj)
              }
              const res = response.data.data.csv_content
              let data = []
              try {
                data = res.map((item) => ({
                  Date: new Date(item.DT).toLocaleDateString('en-US', {
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
            } else {
              console.log('HASH not found in the string.')
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
            if (self.criteria === 'entry') {
              self.$store.commit(`form/saveUsersOwnEntryFileHash`, obj)
            }
            if (self.criteria === 'exit') {
              self.$store.commit(`form/saveUsersOwnExitFileHash`, obj)
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
        const index = this.fileList.indexOf(file)
        if (index !== -1) {
          this.fileList.splice(index, 1)
        }
        this.$refs.upload.clearFiles();
        this.fileList = []

        this.clearUserOwnIndicatorSelect()
      } catch (error) {
        console.log('删除失败', error)
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
      //     this.$message.warning({ message: 'File parsing error, unable to preview.', duration: 5000 })
      //     CIQ.hideCover()
      //     CIQ.nprogress.done()
      //   }
      // })

      CIQ.addCover('Parsing the file....')
      CIQ.nprogress.start()
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
        try {
          await this.validateCSV(file)
          await this.handleParseResult(this.csvContent, file)
        } catch (error) {
          throw Error()
        }
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
      return await new Promise((resolve, reject) => {
        // 限制字段
        let isDateFormat = true
        let isNumFormat = true
        let isNotEmpty = true
        self.csvContent = []
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target.result
          const hash = SparkMD5.hashBinary(reader.result)
          file.hash = hash
          self.file_hash = hash
          const rows = content.trim().split('\n')
          const headers = rows[0].trim().split(',')

          // 判断表头和表内容是否都存在
          if (
            headers.length === 0 ||
            (headers.length !== 0 && rows.length === 1)
          ) {
            isNotEmpty = false
          }
          // 使用 PapaParse 解析 CSV 文件内容
          const result = Papa.parse(content, {
            header: true, // 指定是否将第一行作为字段名
            skipEmptyLines: true,
            trimHeaders: true, // 去除表头中每个字段的空格
            trimRows: true, // 去除数据行中每个字段的空格
            step: function (row) {
              const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/
              const dateColumnIndex = 'Date'
              for (const key in row.data) {
                if (Object.hasOwnProperty.call(row.data, key)) {
                  row.data[key] = row.data[key].trim()
                }
              }
              // const trimmedRow = row.data.map((value) => value.trim())
              const dateCell = row.data[dateColumnIndex]
              const numFormatRegex = /^\d+(\.\d{1,})?$/
              const numColumnIndex = 'Close' // Change this to the index of the column you want to check
              const numCell = row.data[numColumnIndex]
              if (!dateFormatRegex.test(dateCell)) {
                console.log('日期格式校验失败', dateCell)
                isDateFormat = false
                // parser.pause()
                return
              }
              if (!numFormatRegex.test(numCell)) {
                console.log('数字格式校验失败')
                isNumFormat = false
                // parser.pause()
                return
              }
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
          // 获取解析结果
          const data = result.data
          // 进行字段校验
          const isVerified = this.validateFields(data)
          const lines = content.split('\n')
          // 获取 CSV 文件的字段顺序
          const fieldOrder = lines[0].trim().split(',')
          const isOrdered = this.validateCSVFieldOrder(fieldOrder)
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
              message: 'The uploaded CSV file is empty. Please check if the table header and table content are present.',
              duration: 0
            });
            return reject(
              new Error('The uploaded CSV file is empty. Please check if the table header and table content are present.')
            )
          }
          if (!isVerified) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            return reject(new Error('CSV field validation failed.'))
          }
          if (!isOrdered) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            return reject(new Error('CSV field order is incorrect.'))
          }
          if (!isDateFormat) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
              title: 'Tips',
              message: 'The Date column data format in the file is incorrect. It should be in yyyy-MM-dd format, for example: 2023-04-20.',
              duration: 0
            });
            return reject(
              new Error(
                `The Date column data format in the file is incorrect. It should be in yyyy-MM-dd format, for example: 2023-04-20.`
              )
            )
          }
          if (!isNumFormat) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
              title: 'Tips',
              message: 'The Close column data format in the file is incorrect. It should be a number, for example: 45.55.',
              duration: 0
            });
            return reject(
              new Error(
                `The Close column data format in the file is incorrect. It should be a number, for example: 45.55.`
              )
            )
          }
        }
        reader.readAsText(file)
      })
    },
    validateFields(data) {
      // 在这里进行字段校验
      // 可以遍历解析后的数据对象数组，对每一行的字段进行校验
      // 如果有错误，将错误信息存储到一个数组中，并返回
      const errors = []
      data.forEach((row, index) => {
        if (!row.Date || !row.Close) {
          errors.push(`Field validation failed for row ${index + 1}.`)
        }
      })
      if (errors.length > 0) {
        // 如果有错误，显示错误信息
        this.$notify.warning({
          title: 'Tips',
          message: 'Field name validation failed.',
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
      const frequency = this.frequency.toLowerCase()
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
      const symbol = this.$store.state.form.backtestSymbol || 'SPX'
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
      this.$emit('getIndicatorUrl', {
        index: index,
        url: response.data.data.file_id
      })
      console.log('还原文件对象的 raw 属性', obj)
      if (this.criteria === 'entry') {
        this.$store.commit(`form/saveUsersOwnEntryFileHash`, obj)
      }
      if (this.criteria === 'exit') {
        this.$store.commit(`form/saveUsersOwnExitFileHash`, obj)
      }
      const res = response.data.data.csv_content
      let fileData = []
      try {
        fileData = res.map((item) => ({
          Date: new Date(item.DT).toLocaleDateString('en-US', {
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
          Date: new Date(item.DT).toLocaleDateString('en-US', {
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
/deep/ .el-input__icon {
	width: 60px;
}
/deep/ .el-form-item {
	margin-bottom: 10px;
}
.upload-demo {
	display: flex;

	flex-direction: row-reverse;
}
.upload-demo {
	flex-direction: column;
	max-width: 314px;
	border-radius: 5px;
	border: 1px solid #dcdfe6;
	padding: 10px;
	margin-left: 20px;
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
</style>