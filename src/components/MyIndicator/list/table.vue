<template>
  <div class="my-indicator-list">
    <div class="tutorial-box">
      <el-button class="tutorial" @click="jumpToTutoiral" icon="el-icon-video-camera" type="text">
        <span>Watch My Indicator Tutorial</span>
      </el-button>
    </div>
    <div class="search-box">
      <el-button type="primary" round @click="handleCreate">Create New Indicator</el-button>
      <el-input size="small" placeholder="Search" v-model="searchKey" @keyup.enter.native="handleQuery" 					clearable
					@clear="handleQuery">
        <el-button size="small" slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
      </el-input>
    </div>
    <el-table
			ref="MITable"
			class="my-indicator-table"
			:data="tableData"
			:row-class-name="tableRowClassName"
      empty-text="No data"
      v-loading="loading"
      :element-loading-text="loadTest"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      @sort-change="changeTableSort"
			style="width: 100%; height: 100%; margin: 0 auto;"
		>
    
      <el-table-column
        type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <!-- <el-row :gutter="20">
              <el-col :span="8">
              <el-form-item label="Name">
                  <span>{{ scope.row['name']}}</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
              <el-form-item label="Categories">
                <span>{{ scope.row['categories']}}</span>
              </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Indicators included">
                  <template v-for="(item, index) in scope.row['included']">
                    <span :key="index">{{`${index + 1}. ${item}`}}<br/></span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row :gutter="20">
              <el-row :span="4">
              <el-form-item label="Name">
                  <span>{{ scope.row['name']}}</span>
              </el-form-item>
              </el-row>
              <el-row :span="4">
              <el-form-item label="Categories">
                <span>{{ scope.row['categories']}}</span>
              </el-form-item>
              </el-row>
              <el-row :span="4">
              <el-form-item label="Timeframe">
                <span>{{ scope.row['time_frame']}}</span>
              </el-form-item>
              </el-row>
              <el-row :span="16">
                <el-form-item label="Indicators included" class="included-box">
                  <template v-for="(item, index) in scope.row['included_url']">
                    <span :key="index" style="margin-right: 10px">{{`${index + 1}. ${item}`}};</span>
                  </template>
                </el-form-item>
              </el-row>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
			<template v-for="(l) in tableCol">
				<el-table-column
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="l.label == 'Name'"
				>
					<template slot-scope="scope">
						<p class="tableText">
            <el-button type="text" @click="handleRowClick(scope.row)">{{ scope.row[l.value] }}</el-button>
						</p>
					</template>
				</el-table-column>
        <el-table-column
					:prop="l.value"
					:key="l.key"
          v-if="['Categories', 'Timeframe'].includes(l.label)"
				>
            <template #header>
            <!-- 将表头内容替换成 el-select 组件 -->
            <el-select v-model="categoriesFilter" @change="changeCategories" v-show="l.label == 'Categories'">
              <el-option
                v-for="item in categoriesOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select v-model="timeframeFilter" @change="changeTimeframe" v-show="l.label == 'Timeframe'">
              <el-option
                v-for="item in timeframeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
					<template slot-scope="scope">
						<p class="tableText">
							{{ (l.label == 'Categories' && scope.row[l.value] == 'Resample') ? 'Indicator Resample' : scope.row[l.value] }}
						</p>
					</template>
				</el-table-column>
        <el-table-column
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          min-width="100"
          v-if="l.label == 'Indicators included'"
				>
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.included_url" :key="index">
              <span v-if="index == 0">{{ `${index + 1}. ${item}` }}</span>
              <span v-if="index == 1">{{ `${index + 1}. ${item}${scope.row.included_url.length > 2 ? '...': ''}` }}</span>
            </p>
          </template>
				</el-table-column>
			</template>
      <el-table-column
      >
			<template slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            v-model="scope.row.visible"
            :class="{ 'isLastRow': isLastRow(scope.$index) }"
            >
            <p>{{scope.row.popTitle}}</p>
            <el-table :data="scope.row.BTList" v-if="scope.row.BTList.length != 0" style="margin-bottom: 10px;overflow-y: scroll; max-height: 300px;" size="mini">
              <el-table-column property="date" label="Creation Time"></el-table-column>
              <el-table-column property="name" label="Backtest Name"></el-table-column>
            </el-table>
            <el-row style="float: right;">
              <el-button size="mini" round type="info" plain @click="scope.row.visible = !scope.row.visible">No</el-button>
              <el-button size="mini" round type="warning" plain @click="deleteIndicator(scope.row)">Yes</el-button>
            </el-row>
          </el-popover>
          <el-button class="delete-btn" slot="reference" round size="mini" type="primary" icon="el-icon-delete" @click="showPopover(scope.row)" :loading="scope.row.btnLoading"></el-button>
        </template>
      </el-table-column>
		</el-table>
		<el-pagination
		@current-change="handleCurrentChange"
    :current-page="currentPage"
		:page-size="pageSize"
		:total="total"
		layout="total, prev, pager, next, jumper"
		></el-pagination>
  </div>
</template>

<script>
import { delMyIndicator, getMyIndicatorsList, searchIndicator, getRelatedBacktest, deleteBacktest } from '@/service/service'
import { capitalizeFirstLetter, isJson , trimTrailingZeros} from "@/utils"
import { mapGetters } from "vuex"

export default {
  name: 'MITable',
  data() {
    return {
      loading: false,
      pageSize: 10, // Default page size
      currentPage: 1, // Default current page
      loadTest: 'Loading...',
      searchKey: '',
      tableCol: [
        {
          label: 'Name',
          value: 'name'
        },
        {
          label: 'Categories',
          value: 'categories'
        },
        {
          label: 'Timeframe',
          value: 'time_frame'
        },
        {
          label: 'Indicators included',
          value: 'included_url'
        }
      ],
      tableData: [],
      total: 0,
      categoriesOptions: [
        {
          label: 'Categories',
          value: 'categories'
        },
        {
          label: 'Indicator Ratio',
          value: 'indicator ratio'
        },
        {
          label: 'Indicator Spread',
          value: 'indicator spread'
        },
        {
          label: 'Indicator Addition',
          value: 'indicator addition'
        },
        {
          label: 'Indicator Resample',
          value: 'resample'
        },
        {
          label: 'Symbol Ratio',
          value: 'symbol ratio'
        },
        {
          label: 'Symbol Spread',
          value: 'symbol spread'
        },
        {
          label: 'Symbol Addition',
          value: 'symbol addition'
        },
        {
          label: 'Weighed Indicators Combination',
          value: 'weight_combination'
        },
        {
          label: 'Symbol OHLCV',
          value: 'ohlcv'
        }
      ],
      categoriesFilter: 'categories',
      timeframeOptions: [
        {
          label: 'Timeframe',
          value: 'time_frame'
        },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
      ],
      timeframeFilter: 'time_frame'
    }
  },
  async created() {
    // 这里应该是请求下来的数据
    await this.getTableData(this.currentPage)
  },
  computed: {
    sentimentList() {
      const data = localStorage.getItem('refactoredSentimentList');
      return data ? JSON.parse(data) : [];
    },
    symbolList() {
      const data = localStorage.getItem('refactoredConcatList');
      return data ? JSON.parse(data) : [];
    }
  },
  methods: {
    isLastRow(index) {
      // 判断是否为最后一行
      return index === this.tableData.length - 1;
    },
    async showPopover(row) {
        row.btnLoading = true
        const url = row.url
        const {popTitle,BTList} = await this.getRelated(row)
        row.visible = !row.visible;
        this.tableData = this.tableData.map((item) => {
          return item.url != url ? {...item, visible: false, popTitle, BTList, btnLoading: false} : {...item, visible: row.visible, popTitle, BTList, btnLoading: false};
        });
    },
    async getTableData(page) {
      this.loading = true
      let listRes
      try {
        const { categoriesFilter, timeframeFilter } = this
        let [combineType, calculate] = categoriesFilter === 'categories' ? [null, null] : categoriesFilter.split(' ');
        if(categoriesFilter == 'weight_combination') {combineType = null; calculate = categoriesFilter}
        const timeframe = timeframeFilter === 'time_frame' ? null : timeframeFilter
        listRes = await searchIndicator(this.searchKey, calculate, combineType, timeframe, page)
      } catch (error) {
        this.currentPage = 1; listRes = await getMyIndicatorsList(1)
      }

      /** private function */
      function processIndicators(obj, indicatorList) {
          const combineTypes = obj.combine_type.split('_');
          for (let i = 1; i <= combineTypes.length; i++) {
              const key = `indicator_${i}`;
              if (combineTypes[i - 1] === 'si') {
                  const newIndicator = `${obj[key]}@indicator`;
                  if (indicatorList.includes(newIndicator)) {
                      obj[key] = newIndicator;
                  }
              }
          }
      }
      /** create 携带aapl optix(url: aapl@indicator)的会上传indicator为aapl,所以在获取列表时把其还原成(aapl@indicator) */
      listRes.data.results.forEach(obj => {
        if(obj.combine_type == 'indicator'){
          if(this.sentimentList.find((i)=>i.url == obj.indicator_1_url+'@indicator')) obj.indicator_1_url = obj.indicator_1_url+'@indicator'
          if(obj.mul_indicator){
            let parsedObj = JSON.parse(obj.mul_indicator)
            processIndicators(parsedObj, this.sentimentList.map(i=>i.url));
            obj.mul_indicator = JSON.stringify(parsedObj)
          }
        }
      });
   
      this.total = listRes.data.count
      this.tableData = await this.processRowData(listRes.data.results)
      this.loading = false
    },
    async processRowData(resData) {
      let promise = resData.map(async item => {
      if (['ratio', 'spread', 'addition'].includes(item.calculate)) {
        const {included, included_url, former, latter, former_url, latter_url, type} = this.getIncludedData(item, this.sentimentList, this.symbolList);
        return {
          ...item,
          categories: `${capitalizeFirstLetter(type)} ${capitalizeFirstLetter(item.calculate)}`,
          included,
          included_url,
          key: item.url,
          former,
          latter,
          former_url,
          latter_url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          type,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
      if (item.calculate === 'weight_combination' && (item.indicator_weight && item.mul_indicator)) {
        const includedWeightDataArr = this.getWeightedIndicatorData(item, this.sentimentList, this.symbolList);
        const included = includedWeightDataArr.map(item=>(item.included))
        const included_url = includedWeightDataArr.map(item=>(item.included_url))
        const weightData = includedWeightDataArr.map(item=>(item.weightData))
        return {
          ...item,
          categories: 'Weighted Indicator Combination',
          included,
          included_url,
          key: item.url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          weightData,
          type: null,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
      if (item.combine_type === 'ohlcv') {
        const {included, included_url, former, latter, former_url, latter_url, type} = this.getSOHLCVIncludedData(item, this.symbolList);
        return {
          ...item,
          indicator_2_url:'', // indicator2爲空
          categories: 'Symbol OHLCV',
          included,
          included_url,
          key: item.url,
          former,
          latter,
          former_url,
          latter_url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          type,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
      if (item.combine_type === 'resample') {
        const {included, included_url, former, latter, former_url, latter_url, type} = this.getResampleIncludedData(item, this.sentimentList);
        console.log(included, included_url, former, latter, former_url, latter_url, type)
        return {
          ...item,
          indicator_2_url:'', // indicator2爲空
          categories: 'Resample',
          included,
          included_url,
          key: item.url,
          former,
          latter,
          former_url,
          latter_url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          type,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
    });
      let data = await Promise.all(promise);
      data = data.filter(
			item => item !== null && item !== undefined && item !== ''
		  )
      console.log('处理过后的数据', data)
      return data
    },
    getIncludedData(item, sentimentList, symbolList) {
      debugger
      const url_1 = item.indicator_1_url
      const url_2 = item.indicator_2_url
      const typeAttribute = item.combine_type || 'indicator'
      const indicator_1 = (typeAttribute == 'indicator' && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_1.toLocaleLowerCase())?.label) || ''
      const symbol_1 = (typeAttribute == 'symbol' && symbolList.find(ele => ele.url === url_1)?.label) || ''
      const indicator_2 = (typeAttribute == 'indicator' && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_2.toLocaleLowerCase())?.label) || ''
      const symbol_2 = (typeAttribute == 'symbol' && symbolList.find(ele => ele.url === url_2)?.label) || ''
      const symbol_1_url = (typeAttribute == 'symbol' && symbolList.find(ele => ele.url === url_1)?.url) || ''
      const symbol_2_url = (typeAttribute == 'symbol' && symbolList.find(ele => ele.url === url_2)?.url) || ''
      const former = indicator_1 || symbol_1;
      const latter = indicator_2 || symbol_2;
      const former_url = indicator_1 || symbol_1_url;
      const latter_url = indicator_2 || symbol_2_url;
      const extractValues = (str) => {
        if(!str) return null
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
      const next_process = item.next_process || ''
      const next_process_result = extractValues(next_process)
      const options = [
        {
          value: 'o',
          label: 'Symbol Open',
          isSymbol: true
        },
        {
          value: 'h',
          label: 'Symbol High',
          isSymbol: true
        },
        {
          value: 'l',
          label: 'Symbol Low',
          isSymbol: true
        },
        {
          value: 'c',
          label: 'Symbol Close',
          isSymbol: true
        },
        {
          value: 'roc',
          label: 'Rate Of Change',
          isSymbol: true
        },
        {
          value: 'amplitude',
          label: 'Amplitude',
          isSymbol: true
        },
        {
          value: 'amplify',
          label: 'Amplitude',
          isSymbol: true
        },
        {
          value: 'e',
          label: 'Exponential Moving Average',
          isSymbol: true
        },
        {
          value: 'i',
          label: 'Indicator Value'
        }
      ]
      const {shift_ma1, symbol_ma1, shift_ma2, symbol_ma2} = next_process_result || {}
      const maList = item.ma.split('_');
      const specialMAValues = ['amplify', 'amplitude', 'roc', 'e', 'i']
      let _maValues = []
      // specialMAValues.forEach(ele => {
        maList.forEach((value, index) => {
          if(index < 2) {
            debugger
            if(specialMAValues.some(keyword => value.includes(keyword))) {
              const deleteNum = value.replace(/^\d+/, '');
              const label = options.find(item => item.value === value)?.label || options.find(item => item.value === deleteNum)?.label || ''
              const replaceStr = value.replace(/\D+/g, '')
              let _label = label
              if(value === 'e') _label = 'Exponential Moving Average '
              if(value === 'i') _label = 'Indicator Value'
              if(value != 0 && (value.includes('e') || value.includes('roc'))) _maValues[index] = `${_label} ${replaceStr}`
              else _maValues[index] = _label || ''
              if(shift_ma2 != 0 && index === 1 && typeAttribute === 'symbol' && shift_ma2) _maValues[index] = `${_maValues[index]} Shift ${shift_ma2}`
            }else if(symbol_ma1 && symbol_ma2 && Number(value) == 0) {
              const label1 = options.find(item => item.value === symbol_ma1)?.label || ''
              const label2 = options.find(item => item.value === symbol_ma2)?.label || ''
              if(symbol_ma1)  _maValues[0] = label1 || ''
              if(symbol_ma2 && index === 1)  _maValues[1] = `${label2}${(shift_ma2 != 0 && shift_ma2) ? `${(typeAttribute === 'symbol') ? ` Shift ${shift_ma2}` : ''}`: ''}`
            }else {
              _maValues[index] = (value && value != 0) ? `Simple Moving Average ${value}` : ''
              if(index === 1) _maValues[index] = `${_maValues[index]}${(shift_ma2 && shift_ma2 != 0 && !isNaN(shift_ma2)) ? `${typeAttribute === 'symbol' ? ` Shift ${shift_ma2}` : ''}` : ''}`
            }
          }
        })
      // })
      console.log('_maValues', _maValues)
      debugger
      const ma1 = _maValues[0] || ''
      const ma2 = _maValues[1] || ''

      return {
        included: [`${former}${ma1}`, `${latter}${ma2}`],
        included_url: [`${former_url} ${ma1}`, `${latter_url} ${ma2}`],
        former,
        latter,
        former_url,
        latter_url,
        type: typeAttribute
      }
    },
    getSOHLCVIncludedData(item, symbolList) {
      const url_1 = item.indicator_1_url
      const typeAttribute = item.combine_type || 'ohlcv'
      const symbol_1 = (typeAttribute == 'ohlcv' && symbolList.find(ele => ele.url === url_1)?.label) || ''
      const symbol_1_url = (typeAttribute == 'ohlcv' && symbolList.find(ele => ele.url === url_1)?.url) || ''
      const former = symbol_1;
      const latter = '';
      const former_url = symbol_1_url;
      const latter_url = '';
      const maList = item.ma.split('_');
      let calculate = item.calculate
      switch (calculate) {
        case 'close':
          calculate = ' Symbol Close'
          break;
        case 'open':
          calculate = ' Symbol Open'
          break;
        case 'high':
         calculate = ' Symbol High'
         break;
        case 'low':
          calculate = ' Symbol Low'
          break;
        case 'volume':
          calculate = ' Symbol Volume'
          break;
        default:
          calculate = ' Symbol Close'
          break;
      }
      const maValue = maList[0].includes('e') ? maList[0].toString().replace(/e$/, '') : maList[0]
      let maLabel = ''
      if(maList[0].includes('e')) maLabel = ' Exponential Moving Average'
      else if(maList[0] !== '1' && maList[0] !== '0') maLabel = ' Simple Moving Average'
      const ma1 = `${maLabel} ${(maList[0] !== '1' && maList[0] !== '0') ? maValue : ''}`
      const ma2 = '';

      return {
        included: [`${former}${calculate}${ma1}`],
        included_url: [`${former_url}${calculate}${ma1}`],
        former,
        latter,
        former_url,
        latter_url,
        type: typeAttribute
      }
    },
    getResampleIncludedData(item, sentimentList) {
      const url_1 = item.indicator_1_url
      const typeAttribute = item.combine_type || 'resample'
      const indicator_1 = (typeAttribute == 'resample' && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_1.toLocaleLowerCase())?.label) || ''
      const former = indicator_1;
      const latter = '';
      const former_url = indicator_1;
      const latter_url = '';

      return {
        included: [`${former}`],
        included_url: [`${former_url}`],
        former,
        latter,
        former_url,
        latter_url,
        type: typeAttribute
      }
    },
    getWeightedIndicatorData(item, sentimentList, symbolList) {
      const mul_indicator_obj = isJson(item.mul_indicator) ? JSON.parse(item.mul_indicator) : item.mul_indicator;
      const indicator_weight_arr = item.indicator_weight.includes('_') ? item.indicator_weight.split('_') : [item.indicator_weight];
      let combine_type_arr = mul_indicator_obj.combine_type ? (mul_indicator_obj.combine_type.includes('_') ? mul_indicator_obj.combine_type.split('_') : [mul_indicator_obj.combine_type]) : new Array(indicator_weight_arr.length).fill('si')
      combine_type_arr = combine_type_arr.map(item => {
        if(item == 'si') return 'Indicator'
        if(item == 'sy') return 'Symbol'
      })
      return indicator_weight_arr.map((weight, index) => {
        const url = mul_indicator_obj[`indicator_${index + 1}`]
        const typeAttribute = combine_type_arr[index]
        const indicator = (typeAttribute == 'Indicator' && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url.toLocaleLowerCase())?.label) || ''
        const symbol = (typeAttribute == 'Symbol' && symbolList.find(ele => ele.url === url)?.label) || ''
        const symbol_url = (typeAttribute == 'Symbol' && symbolList.find(ele => ele.url === url)?.url) || ''
        const result = indicator || symbol
        const result_url = indicator || symbol_url
        const type = typeAttribute
        const weightData = {
              // weight: (weight * 100).toFixed(2),
              weight: trimTrailingZeros(((Number(weight.replace(/^n/, '-'))) * 100).toFixed(2)),
              indicator: result_url,
              indicator_url: url,
              weightValidErrMsg: '',
              type
              }
        const included = `${result} (weight ${(weight * 100).toFixed()}%)`;
        const included_url = `${result_url} (weight ${(Number(weight.replace(/^n/, '-')) * 100).toFixed()}%)`;
        return {
          included,
          included_url,
          weightData
        }
      });
    },
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'darken-row'
			}
			return ''
		},
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
      await this.getTableData(currentPage)
		},
    changeTableSort(column, prop, order) {
      console.log(column, prop, order)
    },
    async handleQuery() {
      const _this = this
      _this.loading = true
      _this.currentPage = 1
      const { categoriesFilter, timeframeFilter } = _this
      let [combineType, calculate] = categoriesFilter === 'categories' ? [null, null] : categoriesFilter.split(' ');
      if(categoriesFilter == 'weight_combination') {combineType = null; calculate = categoriesFilter}
      const timeframe = timeframeFilter === 'time_frame' ? null : timeframeFilter
      try {
        const searchRes = await searchIndicator(this.searchKey, calculate, combineType, timeframe)
        console.log('searchRes', searchRes)
        if(searchRes.data.results) {_this.tableData = await _this.processRowData(searchRes.data.results); _this.total = searchRes.data.count;}
        if(searchRes.data.code == 406 || searchRes.data.code == 404) {_this.tableData = [];_this.total = 0;}
      } catch (error) {
        if(error?.response?.status == 404) _this.popUpMsgBox('No results found')
        _this.tableData = []
        _this.total = 0
        console.log(error)
      }
      _this.loading = false
    },
    handleCreate() {
      this.$router.push('/myindicator/create')
    },
    handleRowClick(row) {
      // 考慮到ohlcb不能改為symbol ohlcv在miform内，不然會和 symbol這個字段判斷衝突
      if(row.categories == 'Symbol OHLCV') row.categories = 'OHLCV'
      const data = JSON.stringify(row)
      this.$router.push({
        name: 'MIcreate',
        params: {
          data,
          usedFor: 'showMyIndicators'
        }
      })
    },
    async getRelated(item) {
      const url = item.url
      const res = await getRelatedBacktest(url)
      console.log('res', res)
      const count = res.data.count
      if(count == 0) return {popTitle: `Confirm deletion of this custom indicator?`, BTList: []}
      const results = res?.data?.results
      const BTList = results.map(ele => {
        const dateString = ele.create_date
        const dateTime = new Date(dateString)
        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, '0')
        const day = String(dateTime.getDate()).padStart(2, '0');
        const extractedDate = `${year}-${month}-${day}`;
        if(typeof ele.name === 'string') {
          ele.name = ele.name.replace('<br/>', '')
        }
        return{id:ele.id, name: ele.name, date: extractedDate}
      })
      return {popTitle: `Confirm deletion of this indicator and its related backtests?`, BTList}
    },
    async deleteIndicator(row) {
      this.loading = true
      let res = await delMyIndicator(row.url)
      const code = res.data.code
      if(code == 200) this.popUpMsgBox('The indicator has been removed from the list')
      if(code == 404) this.popUpMsgBox('The indicator is no longer in the list')
      if(code == 403) this.popUpMsgBox('Permission denied')
      const list = row.BTList
      for (const item of list) {
        await deleteBacktest(item.id);
      }
      await this.getTableData(this.currentPage)
      row.visible = false
      this.loading = false
    },
    async changeCategories(val) {
        this.categoriesFilter = val;
        const { timeframeFilter, searchKey } = this;
        let [combineType, calculate] = val === 'categories' ? [null, null] : val.split(' ');
        if(val == 'weight_combination') {combineType = null; calculate = val}
        const searchRes = await searchIndicator(searchKey, calculate, combineType, timeframeFilter === 'time_frame' ? null : timeframeFilter);

        this.handleSearchResult(searchRes);
      },
      async changeTimeframe(val) {
        this.timeframeFilter = val;
        const { categoriesFilter, searchKey } = this;
        let [combineType, calculate] = categoriesFilter === 'categories' ? [null, null] : categoriesFilter.split(' ');
        if(categoriesFilter == 'weight_combination') {combineType = null; calculate = categoriesFilter}
        const searchRes = await searchIndicator(searchKey, calculate, combineType, val === 'time_frame' ? null : val);
        this.handleSearchResult(searchRes);
      },
      async handleSearchResult(searchRes) {
        if (searchRes.data.results) {
          this.tableData = await this.processRowData(searchRes.data.results);
          this.total = searchRes.data.count;
          this.currentPage = 1;
        } else {
          this.tableData = [];
          this.total = 0;
          this.currentPage = 1;
        }
      },
      jumpToTutoiral(){
        // const path = 'https://www.youtube.com/playlist?list=PL_pqMRWeHIxNvxaxmrJmLlzizXe38Is_d'
        const path = 'https://youtube.com/playlist?list=PL_pqMRWeHIxMw2WNydMdvsjk14WvOb_lU&si=DEPZk4A4C9GI42Rb'
        window.open(path, '_blank')
	    },
  }
}
</script>

<style lang="less" scoped>
.search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px 16px 0px;
}
.el-input-group{
  width: 40%;
}
.my-indicator-table.el-table /deep/tr{
  cursor: pointer;
}
.my-indicator-table{
  background-color: inherit;
}
.el-form-item{
  margin-bottom: 0;
  span {
    color: #5b9bd1;
  }
}
.delete-btn {
	background-color: #f59e0b;
  border: unset;
}
.delete-btn:hover {
  background-color: rgb(251, 192, 92);
}
/deep/ .el-popover {
  right: 100%;
}
.isLastRow /deep/ .el-popover {
  bottom: 0;
}
/deep/ .el-select .el-input__inner, .el-select {
  width: 100%;
  margin: 0;
  font-weight: 600;
  font-size: 18px;
  color: #333;
  text-align: center;
}
/deep/ .el-select .el-input__inner {
  padding-right: 10px;
}
.my-indicator-list{
  padding: 20px;
  margin: 0 auto;
}
/deep/ .el-form--inline .el-form-item__label {
	font-weight: 600;
	color: #606266;
}
/deep/ .el-form-item__content {
	font-weight: 500;
}
/deep/ .el-button {
	font-weight: 600;
}
.tutorial-box {
  display: flex;
  justify-content: flex-end;
}
</style>