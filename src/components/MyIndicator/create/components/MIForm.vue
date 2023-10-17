<template>
	<el-form
		ref="MICreateForm"
		class="MI-form-container"
		:model="data"
		label-position="left"
		size="mini"
	>
		<h4>Create My Own Indicator</h4>
		<div class="MI-form-top">
			<el-form-item
				label="Name"
				:props="name"
				placeholder="Please input the name of your custom indicator"
			>
				<el-input v-model="data.name"></el-input>
			</el-form-item>
			<el-form-item label="Categories" v-model="data.categories">
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
		</div>
		<el-divider></el-divider>
		<div class="MI-form-middle">
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
								<span v-else-if="item.type === 'Indicator'" class="type-label"
									>Indicator</span
								>
							</div>
						</template>
					</el-autocomplete>
				</el-form-item>
				<CheckInput
					:config="MA1CheckInputConfig"
					ref="ma1Form"
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
					v-show="data.categories.includes('ratio') || data.categories == ''"
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
					v-show="data.categories.includes('spread')"
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
									>Indicator</span
								>
							</div>
						</template>
					</el-autocomplete>
				</el-form-item>
				<CheckInput
					:config="MA2CheckInputConfig"
					ref="ma2Form"
					@saveData="saveSubData"
				></CheckInput>
			</div>
		</div>

		<el-divider></el-divider>
		<div class="MI-form-bottom">
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

		<el-divider></el-divider>
		<div class="MI-form-btn">
			<el-form-item>
				<el-button type="primary" @click="submitForm()"
					>Save My Indicator</el-button
				>
			</el-form-item>
		</div>
    {{data}}
	</el-form>
</template>
 <script>
 import { CIQ } from '@/components/common/chart/st-development/js/components'
import CheckInput from './CheckInput.vue'
import { saveMyIndicators, getMyIndicatorData } from '@/service/service'
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
          label: 'Indicator spread',
          value: 'Indicator spread'
        },
        {
          label: 'Indicator ratio',
          value: 'Indicator ratio'
        },
        {
          label: 'Symbol spread',
          value: 'Symbol spread'
        },
        {
          label: 'Symbol ratio',
          value: 'Symbol ratio'
        }
      ],
      MA1CheckInputConfig: {
        label: 'Moving Average',
        placeholder: 'Please input the moving average value',
        checked: false,
        field: 'ma1',
        value: ''
      },
      MA2CheckInputConfig: {
        label: 'Moving Average',
        placeholder: 'Please input the moving average value',
        checked: false,
        field: 'ma2',
        value: ''
      },
      EOCheckInputConfig: {
        label: 'Extreme Optimism',
        placeholder: 'Please input the extreme optimism value',
        checked: true,
        field: 'extreme_optimism',
        value: ''
      },
      EPCheckInputConfig: {
        label: 'Extreme Pessimism',
        placeholder: 'Please input the extreme pessimism value',
        checked: true,
        field: 'extreme_pessimism',
        value: ''
      },
      data: {
        categories: '',
        name: '',
        indicator_1: '',
        indicator_2: '',
        indicator_1_url: '',
        indicator_2_url: '',
        time_frame: 'daily'
      },
      sentimentList: [],
      loading: false,
      symbolList: []
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
    async submitForm() {
      this.$store.commit('SET_CREACT_LOADING', true)
      const formsToSave = ['ma1Form', 'ma2Form', 'EOForm', 'EPForm']

      for (const formRef of formsToSave) {
        this.$refs[formRef].saveData()
      }
      const saveData = {
        name: this.data.name,
        indicator_1: this.data.indicator_1_url,
        indicator_2: this.data.indicator_2_url,
        time_frame: this.data.time_frame,
        ma: `${this.data.ma1}_${this.data.ma2}_1`,
        calculate: this.data.categories.split(' ')[1],
        extreme_optimism: this.data.extreme_optimism,
        extreme_pessimism: this.data.extreme_pessimism
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
      const indicatorData = await getMyIndicatorData(saveRes.data.url)
      console.log('indicatorData res', indicatorData.data.data)
      // 需要在 chartIQ 中显示出创建的 indicator
      this.$store.commit('SET_CREACT_LOADING', false)
    },
    saveSubData(field, value) {
      console.log(field, value)
      this.data[field] = value // ma1, ma2, extreme_pessimism, extreme_optimism
    },
    querySearch(queryString, cb) {
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
      const neitherOfThem = data.categories == ''
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
      }

      this.dropdownList = this.getList()
    },
    handleSelect(item, source) {
      console.log(item)
      const type = item.type

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
          this.data.categories = 'Indicator spread'
          this.changeCategories('Indicator spread')
          selectIndicator(item)
        } else {
          this.data.categories = 'Indicator spread'
          this.changeCategories('Indicator spread')
          selectIndicator(item)
        }
      } else if (type === 'Symbol') {
        if (this.data.categories.includes('Symbol')) {
          selectSymbol(item)
        } else if (this.data.categories.includes('Indicator')) {
          this.data.categories = 'Symbol spread'
          this.changeCategories('Symbol spread')
          selectSymbol(item)
        } else {
          this.data.categories = 'Symbol spread'
          this.changeCategories('Symbol spread')
          selectSymbol(item)
        }
      }
    },

    changeSymbol(data) {
      // 改变 chartiqIQ 中的 symbol
      CIQ.updateUserOwnIndicator(data)
    },
    changeIndicator(data) {
      // 改变 chartiqIQ 中的 indicator
      
    },
    displayData(data) {
      this.data.categories = data.categories;
      this.data.indicator_1 = data.former;
      this.data.indicator_2 = data.latter;
      this.data.indicator_1_url = data.indicator_1_url;
      this.data.indicator_2_url = data.indicator_2_url;
      this.data.name = data.name;

      const configMap = [
        { key: 'ma', index: 0 },
        { key: 'ma', index: 1 },
        { key: 'upper_extreme_value' },
        { key: 'lower_extreme_value' }
      ];

      configMap.forEach(item => {
        const value = data[item.key];

        if (item.key === 'ma') {
          const maList = value.split('_');
          item.config = {
            value: maList[item.index] != '1' ? maList[item.index] : '',
            checked: maList[item.index] != '1'
          };
        } else {
          item.config = {
            value: value != '0' ? value : '',
            checked: value != '0'
          };
        }
      });

      // 现在，将配置应用于属性
      this.MA1CheckInputConfig = { ...this.MA1CheckInputConfig, ...configMap[0].config };
      this.MA2CheckInputConfig = { ...this.MA2CheckInputConfig, ...configMap[1].config };
      this.EOCheckInputConfig = { ...this.EOCheckInputConfig, ...configMap[2].config };
      this.EPCheckInputConfig = { ...this.EPCheckInputConfig, ...configMap[3].config };
    }


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
}
.MI-form-top {
	display: grid;
	grid-template-rows: repeat(2, 1fr);
	align-items: center;
	.el-form-item {
		display: flex;
		align-items: center;
		/deep/.el-form-item__content {
			width: 100%;
		}
	}
}
.MI-form-middle {
	display: inline-grid;
	grid-template-columns: 1fr 0.5fr 1fr;
}
.MI-form-bottom {
	display: inline-grid;
	align-items: center;
	grid-template-columns: 1fr 0.5fr 1fr;
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

.item-label {
	font-weight: 500;
}
</style>