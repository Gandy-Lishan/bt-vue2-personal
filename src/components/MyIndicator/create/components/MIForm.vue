<template>
  <div class="MI-container">
    <h4>Create My Own Indicator</h4>
	<el-form
		ref="MICreateForm"
		class="MI-form-container"
    :class="{'WIC-form-container': data.categories == 'WIC'}"
		:model="data"
		label-position="left"
		size="mini"
    :rules="rules"
	>

		<div class="MI-form-top">
			<el-form-item
				label="1.Name"
				prop="name"
				placeholder="Please input the name of your custom indicator"
			>
        <template slot="label">
          <label>
            1.Name
            <el-tooltip effect="dark" placement="top">
              <span slot="content">
                Enter a custom indicator name
              </span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
				<el-input v-model="data.name"></el-input>
			</el-form-item>
      <!-- <div></div> -->
			<el-form-item label="2.Categorie" v-model="data.categories">
        <template slot="label">
          <label>
            2.Categories
            <el-tooltip effect="dark" placement="top">
              <span slot="content">
                Select the indicator calculation method
              </span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
				<el-select
					v-model="data.categories"
					placeholder="Please choose categories"
					@change="changeCategories"
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
      <el-form-item
				label="3.Timeframe"
        v-if="!(data.categories == 'Resample')"
			>
        <template slot="label">
          <label>
            3.Timeframe
            <el-tooltip effect="dark" placement="top">
              <span slot="content">
                Timeframe for the composite indicator is the maximum of all indicators
              </span>
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip>
          </label>
        </template>
				<!-- <el-input v-model="data.time_frame" disabled></el-input> -->
        <el-select
					v-model="data.time_frame"
					placeholder="Please choose the timeframe"
					@change="changeTimeFrame"
          ref="timeframe"
				>
					<el-option
						v-for="item in timeFrameOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
			</el-form-item>
		</div>
		<el-divider></el-divider>
		<div class="MI-form-middle" v-if="!['WIC','OHLCV','Resample'].includes(data.categories)">
			<div class="left">
				<el-form-item v-model="data.indicator_1">
          <SearchAutocomplete
            v-model="data.indicator_1"
            @query="querySearch"
            @select="item => handleSelect(item, 'indicator_1')"
            placeholder="Please select indicator or symbol from the dropdown menu"
          />
				</el-form-item>
				<CheckInput
          :categories="data.categories"
					:config="MA1CheckInputConfig"
          :isDisabled="data.indicator_1==''"
          :indicator_1_category="indicator_1_category"
					ref="ma1Form"
          @manageMICondStudies="manageMICondStudies"
					@saveData="saveSubData"
				></CheckInput>
			</div>
			<div class="center">
				<el-divider direction="vertical" class="is-vertical"></el-divider>
        <div class="category-box">
          <svg
					t="1694137466462"
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="1199"
					width="30"
					height="30"
					v-if="data.categories.includes('Ratio') || data.categories == ''"
				>
					<path
						d="M179.18 801.854l624.856-623.767 45.067 45.146L224.247 847z"
						fill="#606266"
						p-id="1200"
					></path>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="icon"
					width="30"
					height="30"
					viewBox="0 0 1024 1024"
					v-if="data.categories.includes('Spread')"
				>
					<line
						x1="128"
						y1="512"
						x2="896"
						y2="512"
						stroke="#606266"
						stroke-width="60"
					/>
				</svg>
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="30" height="30" viewBox="0 0 24 24" v-if="data.categories.includes('Addition')">
          <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z"/></svg>
        <span class="category-text" v-if="data.categories.includes('Addition') || data.categories == ''">(plus)</span>
        <span class="category-text" v-if="data.categories.includes('Spread') || data.categories == ''">(minus)</span>
        <span class="category-text" v-if="data.categories.includes('Ratio')">(divided by)</span>
        </div>
				<el-divider direction="vertical" class="is-vertical"></el-divider>
			</div>
			<div class="right">
				<el-form-item v-model="data.indicator_2">
          <SearchAutocomplete
            v-model="data.indicator_2"
            @query="querySearch"
            @select="item => handleSelect(item, 'indicator_2')"
            placeholder="Please select indicator or symbol from the dropdown menu"
          />
				</el-form-item>
				<CheckInput
          :categories="data.categories"
					:config="MA2CheckInputConfig"
          :isDisabled="data.indicator_2==''"
          :indicator_2_category="indicator_2_category"
					ref="ma2Form"
          @manageMICondStudies="manageMICondStudies"
					@saveData="saveSubData"
				></CheckInput>
        <CheckInput
          :categories="data.categories"
					:config="ShiftCheckInputConfig"
          :isDisabled="data.indicator_2==''"
          :showShiftInput="showShiftInput"
					ref="shiftForm"
          @handleShiftChange="handleShiftChange"
					@saveData="saveSubData"
				></CheckInput>
			</div>
		</div>
    <div class="RESAMPLE-container"  v-if="data.categories == 'Resample'">
			<div class="left">
				<el-form-item v-model="RESAMPLEData.indicator">
          <SearchAutocomplete
            v-model="RESAMPLEData.indicator"
            @query="querySearch"
            @select="item => changeResampleIndicator(item)"
            placeholder="Please select indicator from the dropdown menu"
          />
				</el-form-item>
			</div>
			<div class="center">
				<el-divider direction="vertical" class="is-vertical"></el-divider>
        <div class="category-box">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="30" height="30" viewBox="0 0 48 48" fill="none">
          <rect width="30" height="30" fill="currentColor" fill-opacity="0.01"/>
          <path d="M18 31H38V5" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M30 21H10V43" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M44 11L38 5L32 11" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 37L10 43L4 37" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="category-text">(resample)</span>
        </div>
				<el-divider direction="vertical" class="is-vertical"></el-divider>
			</div>
			<div class="right">
				<el-form-item prop="indicatorResampleTF">
          <div class="selectBox">
            <el-select
              v-model="RESAMPLEData.condition"
              placeholder="Select Resample Timeframe"
              @change="changeResampleCondition"
              :disabled="RESAMPLEData.indicator==''"
            >
              <el-option
                v-for="item in resampleConditions"
                :key="item.value"
                :label="item.obj.label"
                :value="item.obj.field"
                class="timeframeResample"
              >
              </el-option>
            </el-select>
          </div>
				</el-form-item>
			</div>
    </div>
		<el-divider v-if="!['WIC','OHLCV'].includes(data.categories)"></el-divider>
		<div class="MI-form-bottom" v-if="!['WIC','OHLCV'].includes(data.categories)">
			<CheckInput
				:config="EOCheckInputConfig"
				ref="EOForm"
        @handleExtremeLineChange="handleExtremeLineChange"
				@saveData="saveSubData"
			></CheckInput>
			<div></div>
			<CheckInput
				:config="EPCheckInputConfig"
				ref="EPForm"
        @handleExtremeLineChange="handleExtremeLineChange"
				@saveData="saveSubData"
			></CheckInput>
		</div>
    <div class="WIC-container"
      v-if="data.categories == 'WIC'">
      <el-table
      :data="weightData"
      :row-class-name="tableRowClassName"
      v-loading="loading" :element-loading-text="loadTest"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      stripe
      border
      size="mini"
      highlight-current-row                                       
      >
      <el-table-column label="Index" header-align="center" align="center" width="80px">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="Indicator" header-align="center" align="center" prop="indicator">
        <template slot-scope="scope" >
          <SearchAutocomplete
            v-model="scope.row.indicator"
            @query="querySearch"
            @select="item => handleRowSelect(item, scope.row)"
            placeholder="Please select indicator or symbol from the dropdown menu"
            size="mini"
          />
        </template>
      </el-table-column>
      <el-table-column label="Weight" header-align="center" align="center" prop="weight" width="150px">
        <template slot-scope="scope">
          <!-- 注释掉：无需校验 totalWeight <= 100 -->
          <!-- <el-input v-model="scope.row.weight" size="mini" @input="validateWeightRule(scope.row)" @blur="validateTotalPercentage(scope.row)"> -->
          <el-input v-model="scope.row.weight" size="mini" @input="validateWeightRule(scope.row)">
            <template v-slot:append>(%)</template>
          </el-input>
          <div class="error-message">
            {{ scope.row.weightValidErrMsg }}
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="250px">
        <template slot-scope="scope">
          <el-button v-if="scope.$index === 0" @click="addRow(scope.row)" icon="el-icon-circle-plus-outline" size="mini" type="primary">Add Indicator</el-button>
          <el-button v-else size="mini" type="primary" icon="el-icon-delete" @click.stop="deleteRow(scope.$index)" class="delete-btn">Delete Indicator</el-button> 
        </template>
      </el-table-column>
      </el-table>
    </div>
    <div class="SOHLCV-container"
      v-if="data.categories == 'OHLCV'">
      <div class="SLeft">
				<el-form-item v-model="OHLCVData.symbol">
          <SearchAutocomplete
            v-model="OHLCVData.symbol"
            @query="querySearch"
            @select="item => changeSymbol(item)"
            placeholder="Please select symbol from the dropdown menu"
          />
				</el-form-item>
      </div>
      <div class="SRight">
        <el-form-item prop="symbolIndicator">
            <div class="selectBox">
              <el-select
                v-model="OHLCVData.condition"
                placeholder="Select Symbol Open/High/Low/Close/Volume"
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
            </div>
        </el-form-item>
				<CheckInput
					:config="MAOHLCVCheckInputConfig"
          :isDisabled="OHLCVData.condition==''"
					ref="maohlcvForm"
          @manageMICondStudies="manageMICondStudies"
					@saveData="saveSubData"
				></CheckInput>
      </div>
    </div>
		<el-divider></el-divider>
		<div class="MI-form-btn">
      <el-form-item>
				<el-button type="primary" @click="previewIndicator()" class="delete-btn"
					>Preview the created indicator</el-button
				>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm()"
					>Save the created indicator</el-button
				>
			</el-form-item>
		</div>
	</el-form>
  <LoadingOverlay
			:isLoading="isCreateLoading"
			:showProgress="false"
			:percentage="0"
			:progressText="progressText"
		>
		</LoadingOverlay>
  </div>
</template>
 <script>
 import { CIQ } from '@/components/common/chart/st-development/js/components'
import CheckInput from './CheckInput.vue'
import { saveMyIndicators, getMyIndicatorData, delMyIndicator, editMyIndicators, searchIndicator, getSymbollistForecast } from '@/service/service'
import {  validatePercentageRule } from "@/utils/formValidate"
import {timeframeTransform} from '@/utils'
import {createStateFilter} from '@/utils/globalFunc'
import { LoadingOverlay,SearchAutocomplete } from "@/components/common"
import { mapGetters } from "vuex"
import {recoverSymbolOptixUrl} from '@/utils/globalFunc'

export default {
  name: 'MIForm',
  props: {
    formConfig: Array,
    formData: Object
  },
  components: {
    CheckInput,
    LoadingOverlay,
    SearchAutocomplete
  },
  data() {
    return {
      dropdownList: [],
      state1: '',
      inputVisibility: 'hidden', // 初始化时设置为隐藏
      options: [
        {
          label: 'Indicator Spread',
          value: 'Indicator Spread'
        },
        {
          label: 'Indicator Ratio',
          value: 'Indicator Ratio'
        },
        {
          label: 'Indicator Addition',
          value: 'Indicator Addition'
        },
        {
          label: 'Indicator Resample',
          value: 'Resample'
        },
        {
          label: 'Symbol Spread',
          value: 'Symbol Spread'
        },
        {
          label: 'Symbol Ratio',
          value: 'Symbol Ratio'
        },
        {
          label: 'Symbol Addition',
          value: 'Symbol Addition'
        },
        {
          label: 'Weighted Indicator Combination',
          value: 'WIC'
        },
        {
          label: 'Symbol OHLCV',
          value: 'OHLCV'
        }
      ],
      MA1CheckInputConfig: {
        label: 'Moving Average',
        placeholder: 'Please input the period',
        checked: false,
        field: 'ma1',
        value: '',
        type: 'SelectInput'
      },
      ShiftCheckInputConfig: {
        label: 'Shift',
        placeholder: 'Please input',
        checked: false,
        field: 'shift',
        value: '',
        type: 'CheckInput'
      },
      MA2CheckInputConfig: {
        label: 'Moving Average',
        placeholder: 'Please input the period',
        checked: false,
        field: 'ma2',
        value: '',
        type: 'SelectInput'
      },
      EOCheckInputConfig: {
        label: 'Extreme Optimism',
        placeholder: 'Please input the extreme optimism value',
        checked: false,
        field: 'extreme_optimism',
        value: '',
        type: 'CheckInput'
      },
      EPCheckInputConfig: {
        label: 'Extreme Pessimism',
        placeholder: 'Please input the extreme pessimism value',
        checked: false,
        field: 'extreme_pessimism',
        value: '',
        type: 'CheckInput'
      },
      data: {
        categories: 'Indicator Spread',
        name: '',
        indicator_1: '',
        indicator_2: '',
        indicator_1_url: '',
        indicator_2_url: '',
        time_frame: 'daily'
      },
      weightData: [
        {weight: '', indicator: '', indicator_url: '', weightValidErrMsg: '', type: ''}
      ],
      loadTest: 'Loading...',
      weightValidErrMsg: '',
      rules: {
        name: [
          { required: true, message: 'Please input a name', trigger: 'blur' }
        ]
      },
      rowUrl: null,
      progressText: 'Loading...',
      // 用户选择的整体timeframe,用来调整maxFreq
      userSelectedTimeFrame: 'daily', 
      timeFrameOptions: [
        {
          label: 'Daily',
          value: 'daily'
        },
        {
          label: 'Weekly',
          value: 'weekly'
        },
        {
          label: 'Monthly',
          value: 'monthly'
        }
      ],
      /** symbol ohlcv */
      OHLCVData: {symbol:'', condition:''},
      MAOHLCVCheckInputConfig: {
        label: 'Moving Average',
        placeholder: 'Please input the moving average value',
        checked: false,
        field: 'ma1',
        value: '',
        type: 'SelectInput'
      },
      symbolConditions: [
        { value: 0, obj: { label: 'Symbol Open', field: 'open' } },
        { value: 1, obj: { label: 'Symbol High', field: 'high' } },
        { value: 2, obj: { label: 'Symbol Low', field: 'low' } },
        { value: 3, obj: { label: 'Symbol Close', field: 'close' } },
        { value: 4, obj: { label: 'Symbol Volume', field: 'volume' } },
      ],

      indicator_1_category: '',
      indicator_2_category: '',

      // indicator resample
      RESAMPLEData: {indicator:'', condition:''},
      resampleConditions: [
        { value: 0, obj: { label: 'Daily', field: 'daily' } },
        { value: 1, obj: { label: 'Weekly', field: 'weekly' } },
        { value: 2, obj: { label: 'Monthly', field: 'monthly' } },
      ],
    }
  },
  computed: {
    data() {
      return this.formData
    },
    isCreateLoading() {
      // 从 Vuex store 中获取全局 loading 状态
      return this.$store.state.states.isCreateLoading
    },
    ...mapGetters(['getMiBenmarkState']), // 监听chartiq和表单的symbol改动以双向响应
    handleGetMiBenmark() {
      return this.getMiBenmarkState
    },
    sentimentList() {
      const data = localStorage.getItem('refactoredSentimentList');
      return data ? JSON.parse(data) : [];
    },
    symbolList() {
      const data = localStorage.getItem('refactoredConcatList');
      return data ? JSON.parse(data) : [];
    },
    symbollistForecast() {
      return this.$store.getters.getSymbollistForecast
    },
    showShiftInput() {
      // 两个 url 存在并且相等时
      const {indicator_1_url, indicator_2_url} = this.data
      const condition = (indicator_1_url !== '' && indicator_2_url !== '') && indicator_1_url === indicator_2_url
      return condition
     }
  },
  watch: {
    handleGetMiBenmark: {
      async handler(newVal) {
        debugger
        if(this.data.categories.includes('Indicator')){ 
          if(!this.data.indicator_1 && !this.data.indicator_2) return //如果是空图标切换，则跳过还原表单indicator条件
          // 清空miFormState状态
          // userownIndicator需要封一个刷新函数用来刷新timeframe（或者symbol）修改后的图表
          // todo

          await this.$store.dispatch('chart/set_miFormStateRefresh')

          this.refreshMAState()
        }
        if(this.data.categories.includes('Symbol')){    
          this.data.indicator_1 = newVal
          this.data.indicator_1_url = newVal

          this.refreshMAState()
          this.handleShiftChange(this.$refs['shiftForm'].value)
        }
        if(this.data.categories.includes('WIC')){  
         const _index = this.weightData.findIndex(item=>item.type=='Symbol')
         if(_index != -1){
          this.weightData[_index].indicator = newVal
          this.weightData[_index].indicator_url = newVal
         }
        await this.$store.dispatch('chart/set_miFormWeightedListRefresh',{data:this.weightData,url:null})
      }
        if(this.data.categories.includes('OHLCV')){
          this.OHLCVData.symbol = newVal
          
          const checkInputRef = 'maohlcvForm'
      this.manageMICondStudies(this.$refs[checkInputRef].value,this.$refs[checkInputRef].MAType,'ma1',this.$refs[checkInputRef].showInput)
        }
       
      },
      //immediate: true,
      deep: true
    },
    /**
     * 判断类型切换时前后状态是否不属于同一大类，不是则刷新周期
     */
    'data.categories': {
        handler (newV, oldV) {
          if(
            newV &&
            !(newV.includes('Indicator') && oldV.includes('Indicator')) &&
            !(newV.includes('Symbol') && oldV.includes('Symbol'))
          ){
            // 重置最大周期和用户选择周期
            // this.data['time_frame'] = 'daily'
            // this.userSelectedTimeFrame = 'daily'
            
            // 大类切换时也需要重置ma和EP/EO
            const formsToSave = ['ma1Form', 'ma2Form', 'EOForm', 'EPForm', 'shiftForm']
            for (const formRef of formsToSave) {
              // 从WIC到其他选项时组件不存在，需要判断
              this.$refs[formRef]?.clearForm()
            }
          }
        },
    },
    'RESAMPLEData.indicator': {
        handler (newV, oldV) {
          this.$nextTick(()=>{
            const {updated} = CIQ.findSentiIndicator(null,newV)
            var nodeSetup = document.getElementsByClassName('timeframeResample')
            if(!nodeSetup.length) return
            if(updated == "Monthly"){
                nodeSetup[0].setAttribute('tf','enabled')
                nodeSetup[1].setAttribute('tf','enabled')
                nodeSetup[2].setAttribute('tf','disabled')
            }else if(updated == "Weekly"){  
                nodeSetup[0].setAttribute('tf','enabled')
                nodeSetup[1].setAttribute('tf','disabled')
                nodeSetup[2].setAttribute('tf','disabled')
            }else{
                nodeSetup[0].setAttribute('tf','disabled')
                nodeSetup[1].setAttribute('tf','disabled')
                nodeSetup[2].setAttribute('tf','disabled')
            }

            // // 初始化为默认condition即daily
            // this.RESAMPLEData.condition = 'daily'
            // this.data.time_frame = 'daily'
          })

        },
    }
  },
  methods: {
    /**
     * 刷新MA状态
     */
    refreshMAState() {
      this.manageMICondStudies(this.$refs['ma1Form'].value,this.$refs['ma1Form'].MAType,'ma1',this.$refs['ma1Form'].showInput)
      this.manageMICondStudies(this.$refs['ma2Form'].value,this.$refs['ma2Form'].MAType,'ma2',this.$refs['ma2Form'].showInput)
    },
    async changeTimeFrame(item) {
      this.userSelectedTimeFrame = item
      this.data.time_frame = this.findMaxFreq() 

      // userownIndicator需要封一个刷新函数用来刷新timeframe（或者symbol）修改后的图表
      if(this.data.categories == 'WIC') {
        await this.$store.dispatch('chart/set_miFormWeightedListRefresh')
      }else if(this.data.categories == 'OHLCV'){
        this.changeSymbol(this.OHLCVData.symbol)
      }else {
        await this.$store.dispatch('chart/set_miFormStateRefresh')
        this.refreshMAState()
      }
    },
    handleExtremeLineChange(value,field) {
      CIQ.editOwnIndicatorExtremeLines(value,field)
    },
    manageMICondStudies(value,type,field,showInput) {
      let fieldName = 'field'
      let criteria
      if(this.data.categories == 'OHLCV'){
        fieldName = CIQ.findSymbolIndicator(this.OHLCVData.condition,null)?.field
        criteria = 'entry1'
      }
      else if(this.data.categories.includes('Symbol')){ // symbol
        criteria = field == 'ma1' ? 'entry1' : 'entry2'

      }else{    
        if(field == 'ma1'){
          fieldName = this.data.indicator_1_url
        }else if(field == 'ma2'){
          fieldName = this.data.indicator_2_url
        }
        // 不是symbol類型的話，不用關心雙股票條件，默認爲entry1
        criteria = 'entry1'
      }
      if(['EMA','MA'].includes(type)) {
        CIQ.addOwnIndicatorMAStudy(
          value,
          type,
          fieldName,
          criteria,
          field == 'ma1'?0:1,
          showInput,
          this.data.categories
        ) 
      }
      if(type == 'roc') {
        CIQ.addOwnIndicatorROCStudy(
          value,
          fieldName,
          criteria,
          field == 'ma1'?0:1,
          showInput,
        ) 
      }
      if(type == 'amplitude' || type == 'amplify') {
        CIQ.addOwnIndicatorAmplitudeStudy(
          criteria,
          field == 'ma1'?0:1,
          showInput,
        ) 
      }

      if(['o','h','l','c'].includes(type)) {
        CIQ.addSymbolOHLCVStudy(
          criteria,
          field == 'ma1'?0:1,
        )
      }
    },
    async handleShiftChange(val,showInput) {
      if(this.data.indicator_1_url == this.data.indicator_2_url) {
        CIQ.addCover()
        this.$store.commit('states/SET_MI_CREATE_LOADING', true)

        // shift变更时同步shift状态到vuex
        await this.$store.dispatch('chart/set_mi_shift',{'display': true, 'showInput': showInput, 'value':  Number(val)})

        // offset仅供显示
        const offset = showInput ? Number(val) : 0
        CIQ.addOwnIndicatorShift(offset) 
      }
    },
    async submitForm() {
     const saveRes = await this.saveIndicator()
     console.log('saveRes', saveRes)
     if(!saveRes) return
     const code = saveRes.data.code
      if(code == 404) {this.popUpMsgBox('Permission denied')}
      if(code == 406) {
        const url =  saveRes.data.data.url
        const name =  saveRes.data.data.name
        this.$notify({
          title: `Duplicate Indicator: ${name} Exists`,
          message: `The same combination indicator <strong>${name}</strong> already exists. Please adjust your input to avoid duplicates.`,
          type: 'warning',
          dangerouslyUseHTMLString: true,
          duration: 8000
        });
        // this.popUpMsgBox(`The same combination already exists. Please review and adjust your input. The existing combination is named: ${name}.`)
      }
      if(saveRes.status == 201) {this.$router.push('/myindicator')}
      // this.$store.commit('SET_CREACT_LOADING', false)
    },
    async saveIndicator() {
      debugger
       // 保存数据之前先校验字段是否为空，特定字段是否从下拉框中选择 todo lishan
      const validForm = this.validForm()
      const rowUrl = this.rowUrl
      if(!validForm) return
      if(!this.rowUrl) {
        const nameLookupRes = await searchIndicator(this.data.name)
        const count = nameLookupRes.data.count
        const nameList = nameLookupRes.data.results
        if(count != 0) {
          const duplicateItem = nameList.filter(item => item.name == this.data.name)
          console.log('duplicateItem', duplicateItem)
          if(duplicateItem) {this.popUpMsgBox(`Custom indicator name already in use. Please choose another`); return}
        }
      }
      let saveData = null;
      if(this.data.categories == 'WIC') {
      }else if(this.data.categories == 'OHLCV') {
        this.$refs['maohlcvForm'].saveData();
      }else if(this.data.categories == 'Resample') {
        const formsToSave = ['EOForm', 'EPForm'];
        for (const formRef of formsToSave) {
          this.$refs[formRef].saveData();
        }
      }else{
        const formsToSave = ['ma1Form', 'ma2Form', 'EOForm', 'EPForm', 'shiftForm'];
        for (const formRef of formsToSave) {
          this.$refs[formRef].saveData();
        }
      }
      let calculate
      if(this.data.categories === 'WIC'){
        calculate = 'weight_combination'
      }else if(this.data.categories === 'OHLCV'){
        calculate = this.OHLCVData.condition.split(' ')[1].toLowerCase()
      }else if(this.data.categories === 'Resample'){
        calculate = this.RESAMPLEData.condition
      }else{
        calculate = this.data.categories.split(' ')[1].toLowerCase()
      }

      const commonData = {
        name: this.data.name,
        indicator_1: recoverSymbolOptixUrl(this.data.indicator_1_url),
        indicator_2: recoverSymbolOptixUrl(this.data.indicator_2_url),
        time_frame: this.data.time_frame,
        ma: `${this.data.ma1}_${this.data.ma2}_1`,
        calculate: calculate,
        extreme_optimism: this.data.extreme_optimism,
        extreme_pessimism: this.data.extreme_pessimism,
        combine_type: this.data.categories.substring(0, this.data.categories.indexOf(" ")).toLowerCase(), // combine_type : indicator or symbol,
        benchmark: CIQ.stxx.chart.symbol
      };
      if(this.data.categories.includes('Symbol')) {
        let {symbol_ma1, symbol_ma2, shift} = this.data
        if(symbol_ma2 === 'roc' || symbol_ma2 === 'amplitude' || symbol_ma2 === 'amplify') symbol_ma2 = 'c'
        if(symbol_ma1 === 'roc' || symbol_ma1 === 'amplitude' || symbol_ma1 === 'amplify') symbol_ma1 = 'c'
        commonData.next_process = `sh0_${symbol_ma1 || 'c'}|sh${shift || 0}_${symbol_ma2 || 'c'}`
      }
      if(this.data.categories == 'WIC') {
        // if (this.weightValidErrMsg) return;
        const percentageStrings = this.weightData.map(item => {
          if(Number(item.weight) < 0) return (item.weight / 100).toFixed(2).replace(/^-/, 'n')
          return (item.weight / 100).toFixed(2)
        });
        const indicator_weight = percentageStrings.join('_');

        const mul_indicator = this.weightData.reduce((acc, item, index) => {
          acc[`indicator_${index + 1}`] = recoverSymbolOptixUrl(item.indicator_url);
          return acc;
        }, {});
        mul_indicator.combine_type = this.weightData.map(item => {
          if(item.type == 'Indicator') return 'si'
          if(item.type == 'Symbol') return 'sy'
        }).join('_');

        saveData = {
          ...commonData,
          calculate: 'weight_combination', // 存起来
          indicator_weight,
          mul_indicator: JSON.stringify(mul_indicator),
          indicator_1: 'model_smart_money',
          indicator_2: 'model_smart_money',
          ma: '1_1_1',
          extreme_optimism: 0,
          extreme_pessimism: 0,
          combine_type: 'indicator',
        };
      } else if(this.data.categories == 'OHLCV') {
        saveData = {
          ...commonData,
          calculate: this.symbolConditions.find(i=>i.obj.label == this.OHLCVData.condition)?.obj.field,
          indicator_1: this.OHLCVData.symbol,
          indicator_2: 'model_smart_money',
          ma: this.data.ma1,
          extreme_optimism: 0,
          extreme_pessimism: 0,
          combine_type: 'ohlcv'
        };
      }else if(this.data.categories == 'Resample') {
        saveData = {
          ...commonData,
          indicator_1: this.RESAMPLEData.indicator,
          indicator_2: 'model_smart_money',
          ma: '1_1_1',
          combine_type: 'resample'
        };
      } else {
        saveData = {
          ...commonData
        }
      }
      if(rowUrl) return await editMyIndicators(saveData, rowUrl)
      return await saveMyIndicators(saveData);
    },
    async savePreviewIndicator() {
       // preview 按钮直接走新建不走 update
      const validForm = this.validForm()
      if(!validForm) return
      let saveData = null;
      if(this.data.categories == 'WIC') {
      }else if(this.data.categories == 'OHLCV') {
        this.$refs['maohlcvForm'].saveData();
      }else if(this.data.categories == 'Resample') {
        const formsToSave = ['EOForm', 'EPForm'];
        for (const formRef of formsToSave) {
          this.$refs[formRef].saveData();
        }
      }else {
        const formsToSave = ['ma1Form', 'ma2Form', 'EOForm', 'EPForm', 'shiftForm'];
        for (const formRef of formsToSave) {
          this.$refs[formRef].saveData();
        }
      }
      // 在名字后加上四位随机小数
      const randomNumber = Math.round((Math.random()) * 10000) / 10000
      const randomName = `${this.data.name}_${randomNumber}`
      let calculate
      if(this.data.categories === 'WIC'){
        calculate = 'weight_combination'
      }else if(this.data.categories === 'OHLCV'){
        calculate = this.OHLCVData.condition.split(' ')[1].toLowerCase()
      }else if(this.data.categories === 'Resample'){
        calculate = this.RESAMPLEData.condition
      }else{
        calculate = this.data.categories.split(' ')[1].toLowerCase()
      }

      const commonData = {
        name: randomName,
        indicator_1: recoverSymbolOptixUrl(this.data.indicator_1_url),
        indicator_2: recoverSymbolOptixUrl(this.data.indicator_2_url),
        time_frame: this.data.time_frame,
        ma: `${this.data.ma1}_${this.data.ma2}_1`,
        calculate: calculate,
        extreme_optimism: this.data.extreme_optimism,
        extreme_pessimism: this.data.extreme_pessimism,
        combine_type: this.data.categories.substring(0, this.data.categories.indexOf(" ")).toLowerCase() // combine_type : indicator or symbol
      };
      if(this.data.categories.includes('Symbol')) {
        let {symbol_ma1, symbol_ma2, shift} = this.data
        if(symbol_ma2 === 'roc' || symbol_ma2 === 'amplitude' || symbol_ma2 === 'amplify') symbol_ma2 = 'c'
        if(symbol_ma1 === 'roc' || symbol_ma1 === 'amplitude' || symbol_ma1 === 'amplify') symbol_ma1 = 'c'
        commonData.next_process = `sh0_${symbol_ma1 || 'c'}|sh${shift || 0}_${symbol_ma2 || 'c'}`
      }
      if(this.data.categories == 'WIC') {
        // if (this.weightValidErrMsg) return;
        const percentageStrings = this.weightData.map(item => {
          if(Number(item.weight) < 0) return (item.weight / 100).toFixed(2).replace(/^-/, 'n')
          return (item.weight / 100).toFixed(2)
        });
        const indicator_weight = percentageStrings.join('_');

        const mul_indicator = this.weightData.reduce((acc, item, index) => {
          acc[`indicator_${index + 1}`] = recoverSymbolOptixUrl(item.indicator_url);
          return acc;
        }, {});
        mul_indicator.combine_type = this.weightData.map(item => {
          if(item.type == 'Indicator') return 'si'
          if(item.type == 'Symbol') return 'sy'
        }).join('_');

        saveData = {
          ...commonData,
          calculate: 'weight_combination', // 存起来
          indicator_weight,
          mul_indicator: JSON.stringify(mul_indicator),
          indicator_1: 'model_smart_money',
          indicator_2: 'model_smart_money',
          ma: '1_1_1',
          extreme_optimism: 0,
          extreme_pessimism: 0,
          combine_type: 'indicator'
        };
      }else if(this.data.categories == 'OHLCV') {
        saveData = {
          ...commonData,
          calculate: this.symbolConditions.find(i=>i.obj.label == this.OHLCVData.condition)?.obj.field,
          indicator_1: this.OHLCVData.symbol,
          indicator_2: 'model_smart_money',
          ma: this.data.ma1,
          extreme_optimism: 0,
          extreme_pessimism: 0,
          combine_type: 'ohlcv'
        };
      }else if(this.data.categories == 'Resample') {
        saveData = {
          ...commonData,
          indicator_1: this.RESAMPLEData.indicator,
          indicator_2: 'model_smart_money',
          ma: '1_1_1',
          combine_type: 'resample'
        };
      } else {
        saveData = {
          ...commonData
        }
      }
      return await saveMyIndicators(saveData);
    },
    async previewIndicator() {
      CIQ.addCover()
      this.$store.commit('states/SET_MI_CREATE_LOADING', true)
      // 先存名字
      const previewName = this.data.name
      const res = await this.savePreviewIndicator()
      console.log('preview 响应', res)
      const status = res?.data?.code || res?.status
      let url = null
      if(status == 406) {
        url = res?.data?.data?.url
        const _name = res?.data?.data?.name
        // 说明这条数据已经存在了,不让我新建,说明用户已经存在相同的组合, 直接请求数据
        const indicatorData = await getMyIndicatorData(url)
        // 暂存
        localStorage.setItem(`previewIndicatorData_${url}`, JSON.stringify(indicatorData.data.data))
        // 修改名字为预览名字
        this.data.name = previewName
        this.$store.commit('states/SET_MI_CREATE_LOADING', false);CIQ.hideCover();
        // this.popUpMsgBox(`Duplicate Indicator: ${_name} Exists`)
        //return
      }
      if(status == 405) {
        this.popUpMsgBox('No data available for this symbol')
        this.$store.commit('states/SET_MI_CREATE_LOADING', false);CIQ.hideCover();
      }
      if(status == 201) {
        url = res.data.url
        const indicatorData = await getMyIndicatorData(url)
        // 更新 rowUrl
        this.rowUrl = ''
        // 暂存
        localStorage.setItem(`previewIndicatorData_${url}`, JSON.stringify(indicatorData.data.data))
        const delRes = await delMyIndicator(url)
      }
      if(!res) {this.$store.commit('states/SET_MI_CREATE_LOADING', false);CIQ.hideCover();return}
      // const url = res.data.url
      // const indicatorData = await getMyIndicatorData(url)
      // // 暂存
      // localStorage.setItem('previewIndicatorData', JSON.stringify(indicatorData.data.data))
      // // 先
      // await delMyIndicator(url)
      // this.rowUrl = ''
      // console.log('indicatorData code', indicatorData.data.code)
      // console.log('indicatorData res', indicatorData.data.data)
      // // todo display the indicator on chartIQ

      if(this.data.categories.includes('Symbol')){
        CIQ.previewUserOwnIndicator(
          [this.data.indicator_1_url,this.data.indicator_2_url,this.data.name+'CREATE'+url],
          this.data.name+'CREATE'+url,
          this.data.indicator_1_url,
          {op:this.data.extreme_optimism,ep:this.data.extreme_pessimism},
          this.data.categories
        )
      }else if(this.data.categories.includes('Indicator')){
        CIQ.previewUserOwnIndicator(
          [this.data.indicator_1_url,this.data.indicator_2_url,this.data.name+'CREATE'+url],
          this.data.name+'CREATE'+url,
          null,
          {op:this.data.extreme_optimism,ep:this.data.extreme_pessimism}
        )
      }else if(this.data.categories == 'WIC'){
        CIQ.previewUserOwnIndicator(
          [...this.weightData.map(item=>item.indicator_url),this.data.name+'CREATE'+url],
          this.data.name+'CREATE'+url,
          CIQ.stxx.chart.symbol
        )
      }else if(this.data.categories == 'OHLCV'){
        CIQ.previewUserOwnIndicator(
          [this.data.name+'CREATE'+url],
          this.data.name+'CREATE'+url,
          this.OHLCVData.symbol
        )
      }else if(this.data.categories == 'Resample'){
        CIQ.previewUserOwnIndicator(
          [this.data.name+'CREATE'+url],
          this.data.name+'CREATE'+url,
          null,
          {op:this.data.extreme_optimism,ep:this.data.extreme_pessimism},
          this.data.categories
        )
      }
      this.$store.commit('states/SET_MI_CREATE_LOADING', false)

    },
    saveSubData(field, value) {
      this.data[field] = value // ma1, ma2, extreme_pessimism, extreme_optimism
    },
    async querySearch(queryString, callback) {
      if(!this.dropdownList || !this.dropdownList.length) {this.dropdownList = this.getList()}
      var dropdownList = this.dropdownList
      var results = dropdownList.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)
        
      callback(results.sort((a, b) => b.priority - a.priority))
    },
    getList() {
      const data = this.data
      const isIndicator = data.categories.includes('Indicator')
      const isSymbol = data.categories.includes('Symbol') || data.categories == 'OHLCV'
      const isResample = data.categories == 'Resample'
      const neitherOfThem = data.categories == '' || data.categories == 'WIC'
      if (neitherOfThem) {
        return this.sentimentList.concat(this.symbolList)
      }
      if (isIndicator || isResample) {
        return this.sentimentList
      }
      if (isSymbol) {
        return this.symbolList
      }
    },
    changeCategories(category) {
      this.resetTimeframeDisplayState()

      const isIndicator = category.includes('Indicator')
      const isSymbol = category.includes('Symbol')
      const isWIC = category.includes('WIC')
      const isOHLCV = category.includes('OHLCV')
      const isResample = category == 'Resample'

      const clearIndicatorIfMatch = (list, urlProp, indicatorProp, type) => {
        const exitItem = list.find((item) => item[type=='Indicator'?'label':'url'] === this.data[indicatorProp])
        if (exitItem && exitItem?.type == type) {
        }else{
          this.data[indicatorProp] = ''
          this.data[urlProp] = ''
        }
      }
      if (isIndicator) {
        clearIndicatorIfMatch(this.sentimentList, 'indicator_1_url', 'indicator_1', 'Indicator')
        clearIndicatorIfMatch(this.sentimentList, 'indicator_2_url', 'indicator_2', 'Indicator')

        // 还原weightData初始状态
        this.weightData =  [
          {weight: '', indicator: '', indicator_url: '', weightValidErrMsg: '', type: ''}
        ]
        this.OHLCVData = {symbol:'', condition:''}
        this.RESAMPLEData = {indicator:'', condition:''}
      }

      if (isSymbol) {
        clearIndicatorIfMatch(this.symbolList,'indicator_1_url','indicator_1', 'Symbol')
        clearIndicatorIfMatch(this.symbolList,'indicator_2_url','indicator_2', 'Symbol')

        // 还原weightData初始状态
        this.weightData =  [
          {weight: '', indicator: '', indicator_url: '', weightValidErrMsg: '', type: ''}
        ]
        this.OHLCVData = {symbol:'', condition:''}
        this.RESAMPLEData = {indicator:'', condition:''}
      }

      if(isWIC) {
        this.data['indicator_1'] = ''
        this.data['indicator_1_url'] = ''
        this.data['indicator_2'] = ''
        this.data['indicator_2_url'] = ''

        this.OHLCVData = {symbol:'', condition:''} 
        this.RESAMPLEData = {indicator:'', condition:''}
      }

      CIQ.isOHLCVSelectedMI = false
      this.$store.dispatch('chart/set_chart_type', 'line')
      if(isOHLCV) {
        CIQ.isOHLCVSelectedMI = true
        this.$store.dispatch('chart/set_chart_type', 'candle')
        
        this.data['indicator_1'] = ''
        this.data['indicator_1_url'] = ''
        this.data['indicator_2'] = ''
        this.data['indicator_2_url'] = ''

        // 还原weightData初始状态
        this.weightData =  [
          {weight: '', indicator: '', indicator_url: '', weightValidErrMsg: '', type: ''}
        ]
        this.RESAMPLEData = {indicator:'', condition:''}
      }

      if(isResample) {
        this.data['indicator_1'] = ''
        this.data['indicator_1_url'] = ''
        this.data['indicator_2'] = ''
        this.data['indicator_2_url'] = ''

        // 还原weightData初始状态
        this.weightData =  [
          {weight: '', indicator: '', indicator_url: '', weightValidErrMsg: '', type: ''}
        ]
        this.OHLCVData = {symbol:'', condition:''} 
      }
      
      CIQ.stxx.setChartType(this.$store.getters.getChartType); 

      this.dropdownList = this.getList()
      this.$store.dispatch('chart/set_miFormStateChange',this.data)

      this.$nextTick(() => {
        this.attachScrollListener(category)
      })

    },
    resetTimeframeDisplayState() {
      const list = this.$refs.timeframe?.popperElm;
      var nodeSetup = list.getElementsByTagName('li')
      for(var i = 0;i < nodeSetup.length;i++){            
        nodeSetup[i].setAttribute('tf','enabled')
      }
    },
    handleSelect(item, source) {
      this.$nextTick(async ()=>{      
        const type = item.type

        const selectIndicator = (item) => {
          this.data[source] = item.label
          this.data[`${source}_url`] = item.url
          // this.data.time_frame = item.updated;
        }

        const selectSymbol = (item) => {
          this.data[source] = item.url
          this.data[`${source}_url`] = item.url
          this[`${source}_category`] = item.category || null

          this.$store.dispatch('chart/set_mi_shift',{
            'display': this.data.indicator_1_url == this.data.indicator_2_url, 
            'showInput': this.$refs['shiftForm'].showInput, 
            'value':  Number(this.$refs['shiftForm'].value)
          })
        }


        if (type === 'Indicator') {
          if (this.data.categories.includes('Indicator')) {
            selectIndicator(item)
          } else if (this.data.categories.includes('Symbol')) {
            this.data.categories = 'Indicator Spread'
            this.changeCategories('Indicator Spread')
            selectIndicator(item)
          } else {
            this.data.categories = 'Indicator Spread'
            this.changeCategories('Indicator Spread')
            selectIndicator(item)
          }
        } else if (type === 'Symbol') {
          if (this.data.categories.includes('Symbol')) {
            selectSymbol(item)
          } else if (this.data.categories.includes('Indicator')) {
            this.data.categories = 'Symbol Spread'
            this.changeCategories('Symbol Spread')
            selectSymbol(item)
          } else {
            this.data.categories = 'Symbol Spread'
            this.changeCategories('Symbol Spread')
            selectSymbol(item)
          }
        }
        this.data.time_frame = this.findMaxFreq() 
        console.log('当前最大的 timeframe 是', this.data.time_frame)

        // 用promise包裹indicator加载流程确保其在stma加载之前执行
        await this.$store.dispatch('chart/set_miFormStateChange',this.data)

        // 直接通过子组件引用获取checkInput data,这种单项数据传输需要在vue中避免
        const checkInputRef = source=="indicator_1"?'ma1Form':'ma2Form'
        this.manageMICondStudies(this.$refs[checkInputRef].value,this.$refs[checkInputRef].MAType,source=="indicator_1"?'ma1':'ma2',this.$refs[checkInputRef].showInput)
      });
    },
    findMaxFreq() {
      let frequencyArray = []
      if(this.data.categories == 'Resample'){
        const updated = this.sentimentList.find(ele => ele.url.toLocaleLowerCase() === this.RESAMPLEData.indicator.toLocaleLowerCase())?.updated?.toLowerCase()
        frequencyArray = [updated]
      }else if(this.data.categories !== 'WIC') {
        const url_1 = this.data.indicator_1_url
        const url_2 = this.data.indicator_2_url
        if(this.data.categories.includes('Indicator')) {
          // 这个数据时 Daily
          const updated_1 = this.sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_1.toLocaleLowerCase())?.updated?.toLowerCase()
          const updated_2 = this.sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_2.toLocaleLowerCase())?.updated?.toLowerCase()
          frequencyArray = [updated_1, updated_2]
          console.log('updated_1 updated_2数组', [updated_1, updated_2])
        }
        // if(this.data.categories.includes('Symbol'))，默认为空
      }else {
        frequencyArray = this.weightData.map(item => {
          const url = item.indicator_url
          if(item.type == 'Indicator') {
            return this.sentimentList.find(ele => ele.url.toLocaleLowerCase() === url.toLocaleLowerCase())?.updated?.toLowerCase()
          }
          return null
        })
      }
      frequencyArray = frequencyArray.filter(item => item)
      // 结合indicator的周期数组和用户选择周期计算最大周期
      return this.getMaxTimeframe(frequencyArray)
    },
    
    /* 结合indicator的周期数组和用户选择周期计算最大周期 */
    getMaxTimeframe(timeframes) {
        let maxTimeframe
        let timeframeArr = [...timeframes,this.userSelectedTimeFrame]

        const validTimeframes = ['daily', 'weekly', 'monthly'];
        const filteredTimeframes = timeframeArr.filter(timeframe =>
          validTimeframes.includes(timeframe)
        );
        if (filteredTimeframes.length === 0) {
          maxTimeframe = 'daily';
        } else if (filteredTimeframes.length === 1) {
          maxTimeframe = filteredTimeframes[0];
        } else {
          maxTimeframe = filteredTimeframes.reduce((max, timeframe) => {
            return validTimeframes.indexOf(timeframe) > validTimeframes.indexOf(max) ? timeframe : max;
          });
        }

        this.$store.commit('form/getFrequency', timeframeTransform(maxTimeframe))
        return maxTimeframe;
      },
    async displayData(data) {
      this.data.categories = data.mul_indicator && data.indicator_weight ? 'WIC' : data.categories;
      this.data.indicator_1 = data.mul_indicator && data.indicator_weight ? '' : data.former_url;
      this.data.indicator_2 = data.mul_indicator && data.indicator_weight ? '' : data.latter_url;
      this.data.indicator_1_url = data.mul_indicator && data.indicator_weight ? '' : data.indicator_1_url;
      this.data.indicator_2_url = data.mul_indicator && data.indicator_weight ? '' : data.indicator_2_url;
      this.data.time_frame = data.timeframe
      this.userSelectedTimeFrame = data.timeframe
      this.data.name = data.name;
      this.rowUrl = data.url

      this.dropdownList = this.getList()
      debugger
      //如果类型是weight_combination
      if (data.mul_indicator && data.indicator_weight && data.calculate == 'weight_combination') {
        this.weightData = data.weightData
      }else if(data.categories == 'OHLCV'){
        this.OHLCVData.symbol = data.indicator_1_url
        this.OHLCVData.condition = this.symbolConditions.find(item=>item.obj.field == data.calculate)?.obj.label
        const configMap = [
          { key: 'ma', index: 0 },
        ];

        configMap.forEach(item => {
          const value = data[item.key];
          item.config = {
            value: value,
            checked: value != 0,
          };
        });

        //覆盖checkbox初始化配置
        this.MAOHLCVCheckInputConfig = { ...this.MAOHLCVCheckInputConfig, ...configMap[0].config };
      }else if(data.categories == 'Resample'){
        this.RESAMPLEData.indicator = data.indicator_1_url
        this.RESAMPLEData.condition = data.calculate
        const configMap = [
          { key: 'upper_extreme_value' },
          { key: 'lower_extreme_value' },
        ];

        configMap.forEach(item => {
          const value = data[item.key];
          item.config = {
            value: value,
            checked: value != 0,
          };
        });

        //覆盖checkbox初始化配置
        this.EOCheckInputConfig = { ...this.EOCheckInputConfig, ...configMap[0].config };
        this.EPCheckInputConfig = { ...this.EPCheckInputConfig, ...configMap[1].config };
      }else {
        const extractValues = (str) => {
          const parts = str.split('|');

          const left = parts[0];  // sh5_c
          const right = parts[1]; // sh10_o

          const regex = /(\d+)_([a-zA-Z])/; // 修正的正则

          const leftMatch = left.match(regex); // 匹配左边部分
          const rightMatch = right.match(regex); // 匹配右边部分

          if (leftMatch && rightMatch) {
            return {
              shift_ma1: leftMatch[1] || '',   // 提取左侧数字部分
              symbol_ma1: leftMatch[2] || 'c', // 提取左侧字母部分
              shift_ma2: rightMatch[1] || '',  // 提取右侧数字部分
              symbol_ma2: rightMatch[2] || 'o' // 提取右侧字母部分
            };
          } else {
            return null; // 如果没有匹配到
          }
        };
        //其他类型
        const configMap = [
          { key: 'ma', index: 0 },
          { key: 'ma', index: 1 },
          { key: 'upper_extreme_value' },
          { key: 'lower_extreme_value' },
          { key: 'shift' }
        ];
        configMap.forEach(item => {
          debugger
          const value = data[item.key];
          const index = item.index
          let _value = null
          let checked = false
          if(item.key === 'ma') {
            _value = (value.split('_')[item.index] != 0 ? value.split('_')[item.index] : '')
            const valueFromStr = value.split('_')[item.index].match(/\d+/)?.[0]
            checked = (valueFromStr != 0)
            if(data.categories.includes('Symbol') && (!_value.includes('roc') && !_value.includes('e') && !_value.includes('amplify') && !_value.includes('amplitude'))) {
              if(data.next_process) {
                debugger
                const result = extractValues(data.next_process)
                if(result !== null && (result[`symbol_ma${index+1}`] !== 'c')) {
                  const symbol = result[`symbol_ma${index + 1}`] || 'c'
                  _value = symbol
                  checked = symbol != 'c'
                }
              }
            }
          }else if(item.key === 'shift') {
            if(data.categories.includes('Symbol')) {
            if(data.next_process) {
                const result = extractValues(data.next_process)
                if(result !== null) {
                  const shift = result[`shift_ma2`] || 0
                  _value = shift
                  checked = shift != 0
                }
              }
            }
          }else {
            _value = (value ? value : '')
            checked = Boolean(value)
          }
          item.config = {
            value: _value,
            checked: checked,
          };
        });
        //覆盖checkbox初始化配置
        this.MA1CheckInputConfig = { ...this.MA1CheckInputConfig, ...configMap[0].config };
        this.MA2CheckInputConfig = { ...this.MA2CheckInputConfig, ...configMap[1].config };
        this.EOCheckInputConfig = { ...this.EOCheckInputConfig, ...configMap[2].config };
        this.EPCheckInputConfig = { ...this.EPCheckInputConfig, ...configMap[3].config };
        this.ShiftCheckInputConfig = { ...this.ShiftCheckInputConfig, ...configMap[4].config };
      }

      //获取合并后的新indicator数据
      // const indicatorData = await getMyIndicatorData(data.url)
      // console.log('indicatorData res', indicatorData.data.data)
      // 需要在 chartIQ 中显示出创建的 indicator
    },
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'dark-row'
			}
			return ''
		},
    validForm() {
      let formValid = null
      this.$refs['MICreateForm'].validate((valid) => {
        if(valid) {
          formValid = true
        }else {
          formValid = false
          this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.')
          return false
        }
      })
      const formsToValid = ['ma1Form', 'ma2Form', 'EOForm', 'EPForm', 'shiftForm'];
      const childFormValid = formsToValid.some((formRef) => {
        return this.$refs[formRef]?.validateForm() == false
      })
      console.log('表单校验 childFormValid', childFormValid)
      if(childFormValid) return false
      if(!formValid) return formValid
      // 按照选项校验 indicator 是否在允许范围
      const categories = this.data.categories

      if(categories == 'WIC') {
        // 需要验证百分比总和，和每一列的indicator是否都在允许范围
        const data = this.weightData
        let totalWeight = 0
        let rowWeightValid = true
        let inAllowedList = true
        for (const row of data) {
          totalWeight += parseFloat(row.weight) || 0
          row.weightValidErrMsg = validatePercentageRule(_, row.weight)
          if(row.weightValidErrMsg) rowWeightValid = false
          const isIn = ((this.sentimentList.find(ele => ele.url.toLocaleLowerCase() === row.indicator_url.toLocaleLowerCase()) || this.symbolList.find(ele => ele.url.toLocaleLowerCase() === row.indicator_url.toLocaleLowerCase()))?.label || false)
          if(!isIn) inAllowedList = false
        }
        if(totalWeight > 100) {this.popUpMsgBox('Total weight percentages cannot exceed 100%'); return false}
        if(totalWeight != 100) {this.popUpMsgBox('Total weight percentages need to be 100%'); return false}
        if(!rowWeightValid) {this.popUpMsgBox('Incorrect Weight column input format'); return false}
        if(!inAllowedList) {this.popUpMsgBox('Please choose indicators from the dropdown.'); return false}
        if(data.length<=1) {this.popUpMsgBox('Please select at least 2 indicators.'); return false}

      }else if(categories == 'OHLCV') {
        const symbol = this.OHLCVData.symbol
        const condition = this.OHLCVData.condition
        if(!symbol) {
          this.popUpMsgBox('Please choose an symbol name from the dropdown.')
          return false
        }
        if(!condition) {
          this.popUpMsgBox('Please choose an symbol condition from the dropdown.')
          return false
        }
      }else if(categories == 'Resample') {
        const indicator = this.RESAMPLEData.indicator
        const condition = this.RESAMPLEData.condition
        if(!indicator) {
          this.popUpMsgBox('Please choose an indicator name from the dropdown.')
          return false
        }
        if(!condition) {
          this.popUpMsgBox('Please choose an timeframe from the dropdown.')
          return false
        }
      }else {
        // 只需要校验 indicator_1 和 indicator_2
        const indicator_1_url = this.data.indicator_1_url
        const indicator_2_url = this.data.indicator_2_url

        const inAllowedList_1 = ((this.sentimentList.find(ele => ele.url.toLocaleLowerCase() === indicator_1_url.toLocaleLowerCase()) || this.symbolList.find(ele => ele.url.toLocaleLowerCase() === indicator_1_url.toLocaleLowerCase()))?.label || false)
        const inAllowedList_2 = ((this.sentimentList.find(ele => ele.url.toLocaleLowerCase() === indicator_2_url.toLocaleLowerCase()) || this.symbolList.find(ele => ele.url.toLocaleLowerCase() === indicator_2_url.toLocaleLowerCase()))?.label || false)

        if(!indicator_1_url || !indicator_2_url || !inAllowedList_1 || !inAllowedList_2 ) {
          this.popUpMsgBox('Please choose an indicator from the dropdown.')
          return false
        }
      }
      return true
    },
    validateTotalPercentage(row) {
      let weight = 0
      for (const row of this.weightData) {
        weight += parseFloat(row.weight) || 0
      }
      if(weight > 100) {row.weightValidErrMsg = 'Total weight percentages cannot exceed 100%'}
      return weight
    },
    validateWeightRule(row) {
      console.log(row.weight)
      row.weightValidErrMsg = validatePercentageRule(_, row.weight)
    },
    handleRowSelect(item, row) {
      
      console.log('item', item, row)
      row.indicator = item.label
      if(item.type == 'Symbol') row.indicator = item.url
      row.indicator_url = item.url
      row.type = item.type
      
      console.log(this.weightData)

      this.data.time_frame = this.findMaxFreq() 
      console.log('当前最大的 timeframe 是', this.data.time_frame)

      // 更新weightList并刷新chartiq状态
      this.$store.dispatch('chart/set_miFormWeightedListChange',{data:this.weightData,url:null})
    },
    addRow(row) {
      /*
      lishan 注释掉，因为不需要限制 totalWeight 为 100 了
      let weight = null
      const totalWeight = this.validateTotalPercentage(row)
      if(totalWeight > 0 && totalWeight < 100) {weight = 100 - totalWeight}
      else {weight = ''}
      this.weightData.push({ weight, indicator: '', indicator_url: '', weightValidErrMsg: '' });
      */
     if(this.weightData.length == 10) {this.popUpMsgBox(`Up to 10 rows can be added`); return}
      this.weightData.push({ weight: '', indicator: '', indicator_url: '', weightValidErrMsg: '', type: '' });
    },
    deleteRow(index) {
      this.weightData.splice(index, 1)
      // 更新weightList并刷新chartiq状态
      this.$store.dispatch('chart/set_miFormWeightedListChange',{data:this.weightData,url:null})
    },

    /**
     * symbol ohlcv
     */
    async changeSymbol(item) {
      if(typeof(item) == 'object') this.OHLCVData.symbol = item.url
      else this.OHLCVData.symbol = item // from changeTimeFrame
 
      // 用promise包裹indicator加载流程确保其在stma加载之前执行
      await this.$store.dispatch('chart/set_miFormSOHLCVChange',{
        data:{
          symbol:this.OHLCVData.symbol,
        }
      })
      // 直接通过子组件引用获取checkInput data,这种单项数据传输需要在vue中避免
      const checkInputRef = 'maohlcvForm'
      this.manageMICondStudies(this.$refs[checkInputRef].value,this.$refs[checkInputRef].MAType,'ma1',this.$refs[checkInputRef].showInput)
    },
    handleSymbolSelect(item) {
      this.OHLCVData.condition = item.label
      // 直接通过子组件引用获取checkInput data,这种单项数据传输需要在vue中避免
      const checkInputRef = 'maohlcvForm'
      this.manageMICondStudies(this.$refs[checkInputRef].value,this.$refs[checkInputRef].MAType,'ma1',this.$refs[checkInputRef].showInput)
    },

    /**
     * indicator resample
     */
    async changeResampleIndicator(item) {
      // if(typeof(item) == 'object') this.OHLCVData.symbol = item.url
      // else this.OHLCVData.symbol = item // from changeTimeFrame
      this.RESAMPLEData.indicator = item.url
      //this.data.time_frame = this.findMaxFreq() 

      // timeframe用不上，直接同步为condition的值，因为后续一些判断还是对timeframe而不是condition
      // 切换Indicator后把condition切换为默认当前indicator的tf
      this.RESAMPLEData.condition = 'daily'
      this.data.time_frame = this.RESAMPLEData.condition
      CIQ.changeUserOwnIndicatorResample(item)  
    },
    changeResampleCondition(item) {
      this.RESAMPLEData.condition = item
      this.data.time_frame = item

      // resample条件下tf是靠condition手动选择控制的
      this.$store.commit('form/getFrequency', timeframeTransform(this.RESAMPLEData.condition))
    }
  }
}
</script>
 <style lang="less" scoped>
 .MI-container{
  position: relative;
  margin-bottom: 80px;
 }
h4 {
	text-align: center;
	margin: 0;
	padding: 10px 0;
	background: #5b9bd1;
	color: white;
	border-radius: 5px 5px 0 0;
}
.MI-form-container {
	display: grid;
	grid-template-rows: 1fr 0fr 1fr 0fr 1fr 0fr 1fr;
	margin: 0 auto;
	align-items: center;
	border: 1px solid #5b9bd1;
	border-radius: 0 0 5px 5px;
	padding: 0 10px 10px 10px;
  margin-bottom: 50px;
  padding-top: 30px;
}
.WIC-form-container {
	display: grid;
	grid-template-rows: 0fr 0fr 0fr auto 0fr 0fr 0fr;
	margin: 0 auto;
	align-items: start;
	border: 1px solid #5b9bd1;
	border-radius: 5px;
	padding: 0 10px 10px 10px;
  min-height: 500px;
}
.center {
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
  svg.icon {
    align-self: center;
    background: #f9f9f9;
    border: 1px solid #b1b1b1;
    border-radius: 5px;
  }
}
.el-autocomplete {
  width: 100%;
}
/deep/.el-input__inner {
  margin-left: 0;
}
/deep/.el-divider--vertical {
  height: auto;
  margin: 0;
}

.MI-form-top {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 15px;
	.el-form-item {
		display: flex;
    align-items: flex-start;
    flex-direction: column;
		/deep/.el-form-item__content {
			width: 100%;
		}
	}
}
.MI-form-middle {
	display: inline-grid;
	grid-template-columns: 1fr 0.2fr 1fr;
}
.MI-form-bottom {
	display: inline-grid;
	align-items: center;
	grid-template-columns: 1fr 0.2fr 1fr;
}
.MI-form-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	.el-button {
		width: 300px;
	}
  .delete-btn {
    margin-right: 30px;
  }
}
/* 添加虚线样式 */
.el-divider.is-vertical {
	border-left: 1px dashed #b1b1b1;
	border-right-style: none; /* 右边无样式 */
	border-top-style: none;
	border-bottom-style: none;
}
/* 自定义样式 */
.custom-option {
	display: flex;
  align-items: center;
  margin: 0 10px;
  white-space: normal;
  span {
    flex: 1;
    line-height: 1.5em;
    margin: 0px;
    padding: 0.5em 0;
  }
  .item-label {
    color: #333333;
    font-weight: bold;
    padding-right: 10px;
    padding-left: 20px;
    white-space: nowrap;
  }
  .item-label {
    &.indicator {
      flex: 0 0 320px;
    }
    &.symbol {
      flex: 0 0 80px;
    }
  }
  .symbol-label {
    flex: 0 0 200px;
    padding: 0 3px;
    width: 100%;
  }
  .type-label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e1f9ec;
    color: #076932;
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.675rem;
    font-weight: 500;
    line-height: 1;
    margin-right: 20px;
  }
  .inception-label {
    flex: 1;
    color: #333333;
    font-size: 10px;
    min-width: 40px;
    text-align: right;
    padding: 0 3px;
    white-space: nowrap;
    padding-right: 20px;
  }
}


.updated-label{
  font-size: 12px;
  font-weight: 600;
  margin-right: 10px;
  text-align: center;
}

.item-label {
	font-weight: 500;
}
.el-select.el-select--mini {
  width: 100%;
}
.error-message {
  position: absolute;
  line-height: 1;
  font-size: 10px;
  color: #F56C6C;
  white-space: nowrap;
}
.el-button--primary {
  width: 150px;
}
.delete-btn {
	background-color: #f59e0b;
  border: unset;
}
.delete-btn:hover {
  background-color: rgb(251, 192, 92);
}
.category-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span{
    font-size: 12px;
    margin-top: 5px;
    color: #6f7174;
  }
}

/** symbol ohlcv */
.SOHLCV-container{
	display: inline-grid;
	grid-template-columns: 1fr 1fr;
  grid-gap:50px;
}

/** indicator resample */
.RESAMPLE-container{
	display: inline-grid;
	grid-template-columns: 1fr 0.2fr 1fr;
}
/deep/ .el-form-item__label {
  font-weight: 600;
  color: #333;
}
/deep/ .el-button, /deep/ .el-input__inner, /deep/ .el-input-group__append, /deep/ .el-tag, .category-text {
  font-weight: 600;
}
</style>