<template>
	<el-form
		ref="MICreateForm"
		class="MI-form-container"
    :class="{'WIC-form-container': data.categories == 'WIC'}"
		:model="data"
		label-position="left"
		size="mini"
	>
		<h4>Create My Own Indicator</h4>
		<div class="MI-form-top">
			<el-form-item
				label="1.Name"
				:props="name"
				placeholder="Please input the name of your custom indicator"
			>
				<el-input v-model="data.name"></el-input>
			</el-form-item>
      <!-- <div></div> -->
			<el-form-item label="2.Categories" v-model="data.categories">
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
				:props="time_frame"
			>
				<el-input v-model="data.time_frame" disabled></el-input>
			</el-form-item>
		</div>
		<el-divider></el-divider>
		<div class="MI-form-middle" v-if="data.categories != 'WIC'">
			<div class="left">
				<el-form-item v-model="data.indicator_1">
					<el-autocomplete
						class="inline-input"
						v-model="data.indicator_1"
						:fetch-suggestions="querySearch"
						placeholder="Please select indicator or symbol from the dropdown menu"
						@select="
							(item) => {
								handleSelect(item, 'indicator_1')
							}
						"
					>
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
						<!-- 使用 scoped slot 自定义选项 -->
						<template slot-scope="{ item }">
							<div class="custom-option">
								<span class="item-label" v-if="item.type === 'Indicator'">{{
									item.label
								}}</span>
								<span class="item-label" v-else-if="item.type === 'Symbol'">{{
									item.url
								}}</span>
								<!-- 在选项后面添加标识 -->
								<span v-if="item.type === 'Symbol'" class="symbol-label">{{
									item.label
								}}</span>
								<span v-if="item.type === 'Symbol'" class="type-label"
									>Symbol</span
								>
								<span v-if="item.type === 'Indicator'" class="type-label"
									><span class="updated-label">{{item.updated}}</span>
                  Indicator</span
								>
							</div>
						</template>
					</el-autocomplete>
				</el-form-item>
				<CheckInput
					:config="MA1CheckInputConfig"
          :isDisabled="data.indicator_1==''"
					ref="ma1Form"
          @manageMAStudies="manageMAStudies"
					@saveData="saveSubData"
				></CheckInput>
			</div>
			<div class="center">
				<el-divider direction="vertical" class="is-vertical"></el-divider>
				<svg
					t="1694137466462"
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="1199"
					width="30"
					height="30"
					v-show="data.categories.includes('Ratio') || data.categories == ''"
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
					v-show="data.categories.includes('Spread')"
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

				<el-divider direction="vertical" class="is-vertical"></el-divider>
			</div>
			<div class="right">
				<el-form-item v-model="data.indicator_2">
					<el-autocomplete
						class="inline-input"
						v-model="data.indicator_2"
						:fetch-suggestions="querySearch"
						placeholder="Please select indicator or symbol from the dropdown menu"
						@select="
							(item) => {
								handleSelect(item, 'indicator_2')
							}
						"
					>
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
						<!-- 使用 scoped slot 自定义选项 -->
						<template slot-scope="{ item }">
							<div class="custom-option">
								<span class="item-label">{{ item.label }}</span>
								<!-- 在选项后面添加标识 -->
								<span v-if="item.type === 'Symbol'" class="type-label"
									>Symbol</span
								>
                <span v-if="item.type === 'Indicator'" class="type-label"
									><span class="updated-label">{{item.updated}}</span>
                  Indicator</span
								>
							</div>
						</template>
					</el-autocomplete>
				</el-form-item>
				<CheckInput
					:config="MA2CheckInputConfig"
          :isDisabled="data.indicator_2==''"
					ref="ma2Form"
          @manageMAStudies="manageMAStudies"
					@saveData="saveSubData"
				></CheckInput>
			</div>
		</div>

		<el-divider v-if="data.categories != 'WIC'"></el-divider>
		<div class="MI-form-bottom" v-if="data.categories != 'WIC'">
			<CheckInput
				:config="EOCheckInputConfig"
				ref="EOForm"
				@saveData="saveSubData"
			></CheckInput>
			<div></div>
			<CheckInput
				:config="EPCheckInputConfig"
				ref="EPForm"
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
      <el-table-column label="Weight" header-align="center" align="center" prop="weight" width="280px">
        <template slot-scope="scope">
          <el-input v-model="scope.row.weight" size="mini" @input="validateWeightRule(scope.row)" @blur="validateTotalPercentage(scope.row)">
            <template v-slot:append>(%)</template>
          </el-input>
          <div class="error-message">
            {{ scope.row.weightValidErrMsg }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Indicator" header-align="center" align="center" prop="indicator">
        <template slot-scope="scope" >
          <el-autocomplete
            v-model="scope.row.indicator"
            size="mini"
            :fetch-suggestions="querySearch"
            @select="
							(item) => {
								handleRowSelect(item, scope.row)
							}
						"
            >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <!-- 使用 scoped slot 自定义选项 -->
						<template slot-scope="{ item }">
							<div class="custom-option">
								<span class="item-label" v-if="item.type === 'Indicator'">{{
									item.label
								}}</span>
								<span class="item-label" v-else-if="item.type === 'Symbol'">{{
									item.url
								}}</span>
								<!-- 在选项后面添加标识 -->
								<span v-if="item.type === 'Symbol'" class="symbol-label">{{
									item.label
								}}</span>
								<span v-if="item.type === 'Symbol'" class="type-label"
									>Symbol</span
								>
								<span v-if="item.type === 'Indicator'" class="type-label"
									><span class="updated-label">{{item.updated}}</span>
                  Indicator</span
								>
							</div>
						</template>
          </el-autocomplete>
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
		<el-divider></el-divider>
		<div class="MI-form-btn">
			<el-form-item>
				<el-button type="primary" @click="submitForm()"
					>Save My Indicator</el-button
				>
			</el-form-item>
		</div>
	</el-form>
</template>
 <script>
 import { CIQ } from '@/components/common/chart/st-development/js/components'
import CheckInput from './CheckInput.vue'
import { saveMyIndicators, getMyIndicatorData } from '@/service/service'
import {  validatePercentageRule } from "@/utils/formValidate"
export default {
  name: 'MIForm',
  props: {
    formConfig: Array,
    formData: Object
  },
  components: {
    CheckInput
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
          label: 'Symbol Spread',
          value: 'Symbol Spread'
        },
        {
          label: 'Symbol Ratio',
          value: 'Symbol Ratio'
        },
        {
          label: 'Weighted Indicator Combination',
          value: 'WIC'
        }
      ],
      MA1CheckInputConfig: {
        label: 'Moving Average',
        placeholder: 'Please input the moving average value',
        checked: false,
        field: 'ma1',
        value: '',
        type: 'SelectInput'
      },
      MA2CheckInputConfig: {
        label: 'Moving Average',
        placeholder: 'Please input the moving average value',
        checked: false,
        field: 'ma2',
        value: '',
        type: 'SelectInput'
      },
      EOCheckInputConfig: {
        label: 'Extreme Optimism',
        placeholder: 'Please input the extreme optimism value',
        checked: true,
        field: 'extreme_optimism',
        value: '',
        type: 'CheckInput'
      },
      EPCheckInputConfig: {
        label: 'Extreme Pessimism',
        placeholder: 'Please input the extreme pessimism value',
        checked: true,
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
      sentimentList: [],
      loading: false,
      symbolList: [],
      weightData: [
        {weight: '', indicator: '', indicator_url: '', weightValidErrMsg: ''}
      ],
      loadTest: 'Loading...',
      loading: false,
      weightValidErrMsg: ''
    }
  },
  computed: {
    data() {
      return this.formData
    }
  },
  async mounted() {
    // 从localStorage获取数据
    this.sentimentList = JSON.parse(localStorage.getItem('sentimentList'))
    this.symbolList = JSON.parse(localStorage.getItem('symbolList'))
    this.dropdownList = this.getList()
    console.log('this.dropdownList', this.dropdownList)
  },
  methods: {
    manageMAStudies(value,type,field,showInput) {
      CIQ.userOwnIndicatorMAStudies(
        value,
        type,
        field=='ma1'?this.data.indicator_1_url:this.data.indicator_2_url,
        showInput,
        this.data.categories
        ) 
    },
    async submitForm() {
      // 保存数据之前先校验字段是否为空，特定字段是否从下拉框中选择 todo lishan
      // this.validForm()
      let saveData = null
      if(this.data.categories != 'WIC') {
        // this.$store.commit('SET_CREACT_LOADING', true)
        const formsToSave = ['ma1Form', 'ma2Form', 'EOForm', 'EPForm']

        for (const formRef of formsToSave) {
          this.$refs[formRef].saveData()
        }
        saveData = {
          name: this.data.name,
          indicator_1: this.data.indicator_1_url,
          indicator_2: this.data.indicator_2_url,
          time_frame: this.data.time_frame,
          ma: `${this.data.ma1}_${this.data.ma2}_1`,
          calculate: this.data.categories.split(' ')[1].toLowerCase(),
          extreme_optimism: this.data.extreme_optimism,
          extreme_pessimism: this.data.extreme_pessimism
        }
      }else if(this.data.categories == 'WIC'){
        if(this.weightValidErrMsg) return
        const percentageStrings = this.weightData.map(item => (item.weight / 100).toFixed(1))
        const indicator_weight = percentageStrings.join('_')

        const mul_indicator = this.weightData.reduce((acc, item, index) => {
          acc[`indicator_${index + 1}`] = item.indicator_url
          return acc
        }, {})

        saveData = {
          name: this.data.name,
          indicator_1: 'model_smart_money',
          indicator_2: 'model_smart_money',
          time_frame: this.data.time_frame,
          ma: '1_1_1',
          calculate: 'weight_combination', // 存起来
          // calculate: 'ratio', // 存起来
          extreme_optimism: 0,
          extreme_pessimism: 0,
          indicator_weight,
          mul_indicator: JSON.stringify(mul_indicator)
        }
      }

      console.log('保存的数据', saveData)
      const saveRes = await saveMyIndicators(saveData)
      const code = saveRes.data.code
				if(saveRes.status == 201) {
            this.$message({
              message: 'Indicator created successfully',
              center: true
            })
					}
					if(code == 404) {
            this.$message({
                message: 'Permission denied',
                center: true
            })
					}
					if(code == 406) {
            this.$message({
              message: 'This combination of indicators is already in the list',
              center: true
            })
				}
      console.log('保存数据 res', saveRes.data.url)

      // this.$store.commit('SET_CREACT_LOADING', false)
    },
    saveSubData(field, value) {
      console.log(field, value)
      this.data[field] = value // ma1, ma2, extreme_pessimism, extreme_optimism
    },
    querySearch(queryString, cb) {
      if(!this.dropdownList || !this.dropdownList.length) {this.dropdownList = this.getList()}
      var dropdownList = this.dropdownList
      var results = queryString
        ? dropdownList.filter(this.createFilter(queryString))
        : dropdownList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (dropdownList) => {
        const labelMatch =
          dropdownList.label
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) === 0
        const urlMatch =
          dropdownList.url.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        return labelMatch || urlMatch
      }
    },
    getList() {
      const data = this.data
      const isIndicator = data.categories.includes('Indicator')
      const isSymbol = data.categories.includes('Symbol')
      const neitherOfThem = data.categories == '' || data.categories == 'WIC'
      if (neitherOfThem) {
        return this.sentimentList.concat(this.symbolList)
      }
      if (isIndicator) {
        return this.sentimentList
      }
      if (isSymbol) {
        return this.symbolList
      }
    },
    changeCategories(data) {
      const isIndicator = data.includes('Indicator')
      const isSymbol = data.includes('Symbol')

      const clearIndicatorIfMatch = (list, urlProp, indicatorProp) => {
        if (list.some((item) => item.url === this.data[urlProp])) {
          this.data[indicatorProp] = ''
          this.data[urlProp] = ''
        }
      }

      if (isIndicator) {
        clearIndicatorIfMatch(this.symbolList, 'indicator_1_url', 'indicator_1')
        clearIndicatorIfMatch(this.symbolList, 'indicator_2_url', 'indicator_2')
      }

      if (isSymbol) {
        clearIndicatorIfMatch(
          this.sentimentList,
          'indicator_1_url',
          'indicator_1'
        )
        clearIndicatorIfMatch(
          this.sentimentList,
          'indicator_2_url',
          'indicator_2'
        )

        // 隐藏主图表面板的默认符号
        CIQ.stxx.mainSeriesRenderer.scrubbed = true;
      }
  
      const formsToSave = ['ma1Form', 'ma2Form', 'EOForm', 'EPForm']
      for (const formRef of formsToSave) {
        this.$refs[formRef].clearForm()
      }

      this.dropdownList = this.getList()

      this.$store.dispatch('chart/set_miFormStateChange',this.data)
    },
    handleSelect(item, source) {
      console.log('item', item,source)
      const type = item.type
      if(type === 'Indicator') {
        this.data.time_frame = this.findMaxFreq(this.data.time_frame, item.updated.toLowerCase()) 
      }else {
        this.data.time_frame = 'daily'
      }
      console.log('当前最大的 timeframe 是', this.data.time_frame)

      const selectIndicator = (item) => {
        this.data[source] = item.label
        this.data[`${source}_url`] = item.url
        // this.data.time_frame = item.updated;
        this.changeIndicator(this.data)
      }

      const selectSymbol = (item) => {
        this.data[source] = item.label
        this.data[`${source}_url`] = item.url
        this.changeSymbol(this.data)
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
      console.log('data',this.data)
      this.manageMAStudies(this.value,this.MAType,source=="indicator_1"?'ma1':'ma2',this.showInput)
    },
    findMaxFreq(currentFreq, previousFreq) {
      let selectedTimeframe = currentFreq
			let previousTimeframe = previousFreq
			if (
				selectedTimeframe !== '' &&
				selectedTimeframe !== undefined &&
				selectedTimeframe !== null
			) {
				if (selectedTimeframe !== previousTimeframe) {
					// 根据时间范围的大小进行比较，取周期较大的那个
					const timeframes = ['daily', 'weekly', 'monthly']
					const previousIndex = timeframes.indexOf(previousTimeframe)
					const currentIndex = timeframes.indexOf(selectedTimeframe)
					const largerIndex = Math.max(previousIndex, currentIndex)
					selectedTimeframe = timeframes[largerIndex]

					// 更新之前的时间范围为当前选择
					previousTimeframe = selectedTimeframe
				}
			}
			return previousTimeframe
    },
    changeSymbol(data) {
      // 改变 chartiqIQ 中的 symbol
      this.$store.dispatch('chart/set_miFormStateChange',this.data)
    },
    changeIndicator(data) {
      // 改变 chartiqIQ 中的 indicator
      this.$store.dispatch('chart/set_miFormStateChange',this.data)
    },
    async displayData(data) {
      // 从localStorage获取数据
      const sentimentList = JSON.parse(localStorage.getItem('sentimentList'))
      const symbolList = JSON.parse(localStorage.getItem('symbolList'))

      this.data.categories = data.mul_indicator && data.indicator_weight ? 'WIC' : data.categories;
      this.data.indicator_1 = data.mul_indicator && data.indicator_weight ? '' : data.former;
      this.data.indicator_2 = data.mul_indicator && data.indicator_weight ? '' : data.latter;
      this.data.indicator_1_url = data.mul_indicator && data.indicator_weight ? '' : data.indicator_1_url;
      this.data.indicator_2_url = data.mul_indicator && data.indicator_weight ? '' : data.indicator_2_url;
      this.data.name = data.name;

      //如果类型时weight_C
      if (data.mul_indicator && data.indicator_weight && data.calculate == 'weight_c') {
        const mul_indicator_obj = JSON.parse(data.mul_indicator);
        const indicator_weight_arr = data.indicator_weight.includes('_') ? data.indicator_weight.split('_') : [data.indicator_weight];
        this.weightData = indicator_weight_arr.map((weight, index) => ({
          weight: (weight * 100).toFixed(2),
          indicator: (sentimentList.find(ele => ele.url === mul_indicator_obj[`indicator_${index + 1}`]) || symbolList.find(ele => ele.url === mul_indicator_obj[`indicator_${index + 1}`]))?.label,
          indicator_url: mul_indicator_obj[`indicator_${index + 1}`],
          weightValidErrMsg: ''
        }));
        console.log('处理后的结果', this.weightData);
      } else {  //其他类型
        const configMap = [
          { key: 'ma', index: 0 },
          { key: 'ma', index: 1 },
          { key: 'upper_extreme_value' },
          { key: 'lower_extreme_value' },
        ];

        configMap.forEach(item => {
          const value = data[item.key];
          item.config = {
            value: (item.key === 'ma' ? (value.split('_')[item.index] != '1' ? value.split('_')[item.index] : '') : (value != '0' ? value : '')),
            checked: (item.key === 'ma' ? (value.split('_')[item.index] != '1') : (value != '0')),
          };
        });

        //覆盖checkbox初始化配置
        this.MA1CheckInputConfig = { ...this.MA1CheckInputConfig, ...configMap[0].config };
        this.MA2CheckInputConfig = { ...this.MA2CheckInputConfig, ...configMap[1].config };
        this.EOCheckInputConfig = { ...this.EOCheckInputConfig, ...configMap[2].config };
        this.EPCheckInputConfig = { ...this.EPCheckInputConfig, ...configMap[3].config };
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
      row.indicator_url = item.url
      console.log(this.weightData)

      const type = item.type
      if(type === 'Indicator') {
        this.data.time_frame = this.findMaxFreq(this.data.time_frame, item.updated.toLowerCase()) 
      }else {
        this.data.time_frame = 'daily'
      }
      console.log('当前最大的 timeframe 是', this.data.time_frame)
    },
    addRow(row) {
      let weight = null
      const totalWeight = this.validateTotalPercentage(row)
      if(totalWeight > 0 && totalWeight < 100) {weight = 100 - totalWeight}
      else {weight = ''}
      this.weightData.push({ weight, indicator: '', indicator_url: '', weightValidErrMsg: '' });
    },
    deleteRow(index) {this.weightData.splice(index, 1)}
  }
}
</script>
 <style lang="less" scoped>
h4 {
	text-align: center;
	margin: 0 0 30px 0;
	padding: 10px 0;
	background: #5b9bd1;
	color: white;
	border-radius: 5px;
}
.MI-form-container {
	display: grid;
	grid-template-rows: 1fr 0fr 1fr 0fr 1fr 0fr 1fr;
	margin: 0 auto;
	align-items: center;
	border: 1px solid #5b9bd1;
	border-radius: 5px;
	padding: 0 10px 10px 10px;
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
    background: #dfdddd;
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
	align-items: center; /* 垂直居中对齐 */
	justify-content: space-between;
}

.type-label {
	font-size: 12px;
	color: #999999;
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
  background-color: rgb(251, 192, 92);
  border: unset;
}
.delete-btn:hover {
	background-color: #f59e0b;
}
</style>