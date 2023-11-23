<template>
  <div>
    <div class="search-box">
      <el-button type="primary" round @click="handleCreate">Create New Indicator</el-button>
      <el-input placeholder="Search" v-model="searchKey" @keyup.enter.native="handleQuery" 					clearable
					@clear="handleQuery">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
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
			style="width: 100%; height: 100%"
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
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          v-if="['Categories', 'Timeframe'].includes(l.label)"
				>
					<template slot-scope="scope">
						<p class="tableText">
							{{ scope.row[l.value] }}
						</p>
            <!-- <el-link type="primary">主要链接</el-link> -->
					</template>
				</el-table-column>
        <el-table-column
					:label="l.label"
					:prop="l.value"
					:key="l.key"
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
            >
            <p>{{scope.row.popTitle}}</p>
            <el-table :data="scope.row.BTList" v-if="scope.row.BTList.length != 0" style="margin-bottom: 10px;" size="mini">
              <el-table-column property="date" label="Creation Time"></el-table-column>
              <el-table-column property="name" label="Backtest Name"></el-table-column>
            </el-table>
            <el-row style="float: right;">
              <el-button size="mini" round type="info" plain @click="showPopover(scope.row)">No</el-button>
              <el-button size="mini" round type="warning" plain @click="deleteIndicator(scope.row)">Yes</el-button>
            </el-row>
          </el-popover>
          <el-button class="delete-btn" slot="reference" round size="mini" type="primary" icon="el-icon-delete" @click="showPopover(scope.row)"></el-button>
        </template>
      </el-table-column>
		</el-table>
		<el-pagination
		@current-change="handleCurrentChange"
		:page-size="pageSize"
		:total="total"
		layout="total, prev, pager, next, jumper"
		></el-pagination>
  </div>
</template>

<script>
import { delMyIndicator, getMyIndicatorsList, searchIndicator, getRelatedBacktest, deleteBacktest } from '@/service/service'
import { capitalizeFirstLetter, isJson } from "@/utils"

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
    }
  },
  async created() {
    // 这里应该是请求下来的数据
    await this.getTableData(this.currentPage)
  },
  methods: {
    showPopover(row) {
        row.visible = !row.visible;
        const url = row.url
        this.tableData = this.tableData.map((item) => {
          return item.url != url ? {...item, visible: false} : {...item, visible: row.visible};
        });
    },
    async getTableData(page) {
      this.loading = true
      let listRes
      try {
        listRes = await getMyIndicatorsList(page)
      } catch (error) {
        this.currentPage = 1; listRes = await getMyIndicatorsList(1)
      }
      console.log('listRes', listRes)
      this.total = listRes.data.count
      this.tableData = await this.processRowData(listRes.data.results)
      this.loading = false
    },
    async processRowData(resData) {
      const sentimentList = JSON.parse(localStorage.getItem('sentimentList'))
      const symbolList = JSON.parse(localStorage.getItem('symbolList'))

      let promise = resData.map(async item => {
      const {popTitle, BTList} = await this.getRelated(item)
      if (['ratio', 'spread'].includes(item.calculate)) {
        const {included, included_url, former, latter, former_url, latter_url, type} = this.getIncludedData(item, sentimentList, symbolList);
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
          popTitle,
          BTList,
          visible: false
        };
      }
      if (item.calculate === 'weight_combination' && (item.indicator_weight && item.mul_indicator)) {
        const includedWeightDataArr = this.getWeightedIndicatorData(item, sentimentList, symbolList);
        const included = includedWeightDataArr.map(item=>(item.included))
        const included_url = includedWeightDataArr.map(item=>(item.included_url))
        const weightData = includedWeightDataArr.map(item=>(item.weightData))
        return {
          ...item,
          categories: 'Indicator Weight Combination',
          included,
          included_url,
          key: item.url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          weightData,
          type: null,
          popTitle,
          BTList,
          visible: false
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
      const url_1 = item.indicator_1_url
      const url_2 = item.indicator_2_url
      const typeAttribute = item.combine_type || 'indicator'
      const indicator_1 = (typeAttribute == 'indicator') && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_1.toLocaleLowerCase())?.label
      const symbol_1 = (typeAttribute == 'symbol') && symbolList.find(ele => ele.url.toLocaleLowerCase() === url_1.toLocaleLowerCase())?.label
      const indicator_2 = (typeAttribute == 'indicator') && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_2.toLocaleLowerCase())?.label
      const symbol_2 = (typeAttribute == 'symbol') && symbolList.find(ele => ele.url.toLocaleLowerCase() === url_2.toLocaleLowerCase())?.label
      const symbol_1_url = (typeAttribute == 'symbol') && symbolList.find(ele => ele.url.toLocaleLowerCase() === url_1.toLocaleLowerCase())?.url
      const symbol_2_url = (typeAttribute == 'symbol') && symbolList.find(ele => ele.url.toLocaleLowerCase() === url_2.toLocaleLowerCase())?.url
      const former = indicator_1 || symbol_1;
      const latter = indicator_2 || symbol_2;
      const former_url = indicator_1 || symbol_1_url;
      const latter_url = indicator_2 || symbol_2_url;
      const maList = item.ma.split('_');
      const ma1 = maList[0] !== '1' ? ` Moving Average ${maList[0].includes('e') ? maList[0].toString().replace(/e$/, '') : maList[0]}` : '';
      const ma2 = maList[1] !== '1' ? ` Moving Average ${maList[1].includes('e') ? maList[1].toString().replace(/e$/, '') : maList[1]}` : '';

      return {
        included: [`${former}${ma1}`, `${latter}${ma2}`],
        included_url: [`${former_url}${ma1}`, `${latter_url}${ma2}`],
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
        const indicator = (typeAttribute == 'Indicator') && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url.toLocaleLowerCase())?.label
        const symbol = (typeAttribute == 'Symbol') && symbolList.find(ele => ele.url.toLocaleLowerCase() === url.toLocaleLowerCase())?.label
        const symbol_url = (typeAttribute == 'Symbol') && symbolList.find(ele => ele.url.toLocaleLowerCase() === url.toLocaleLowerCase())?.url
        const result = indicator || symbol
        const result_url = indicator || symbol_url
        const type = typeAttribute
        const weightData = {
              weight: (weight * 100).toFixed(2),
              indicator: result_url,
              indicator_url: url,
              weightValidErrMsg: '',
              type
              }
        const included = `${result} (weight ${(weight * 100).toFixed()}%)`;
        const included_url = `${result_url} (weight ${(weight * 100).toFixed()}%)`;
        return {
          included,
          included_url,
          weightData
        }
      });
    },
    tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 1) {
			return 'dark-row'
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
      if(!this.searchKey) {this.getTableData(this.currentPage);return}
      this.loading = true
      console.log(this.searchKey)

      const inputString = this.searchKey.toLowerCase();
      const keywords = {
        timeframe: ['daily', 'weekly', 'monthly'],
        calculate: ['ratio', 'spread'],
        combine_type: ['indicator', 'symbol']
      };

      let matchedStrings = [];

      const regex = /(daily|weekly|monthly|ratio|spread|indicator|symbol)/gi;
      let match;

      while ((match = regex.exec(inputString)) !== null) {
        matchedStrings.push(match[0]);
      }

      const extractedValues = {
        timeframe: null,
        calculate: null,
        combine_type: null
      };

      matchedStrings.forEach(item => {
        for (const key in keywords) {
          if (keywords[key].includes(item)) {
            extractedValues[key] = item;
          }
        }
      });

      const substringsToRemove = matchedStrings.join('|');
      let name = inputString.replace(new RegExp(substringsToRemove, 'g'), '');
      name = name.trim()

      console.log('matchedStrings', matchedStrings);
      console.log('Extracted Values:', extractedValues);
      console.log('Name:', name);

      const calculate = extractedValues.calculate
      const combine_type = extractedValues.combine_type
      const timeframe = extractedValues.timeframe
      try {
        const searchRes = await searchIndicator(name, calculate, combine_type, timeframe)
        if(searchRes.status == 200) {this.tableData = this.processRowData(searchRes.data.results); this.total = searchRes.data.count; this.currentPage = 1}
        if(searchRes.data.code == 406 || searchRes.data.code == 404) {this.tableData = [];this.total = 0; this.currentPage = 1}
      } catch (error) {
        if(error?.response?.status == 404) this.popUpMsgBox('No results found')
        this.tableData = []
        this.total = 0
        this.currentPage = 1
        console.log(error)
      }
      this.loading = false
    },
    handleCreate() {
      this.$router.push('/myindicator/create')
    },
    handleRowClick(row) {
      console.log(row)
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
  }
}
</script>

<style lang="less" scoped>
.search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0px;
}
.el-input-group{
  width: 40%;
}
.my-indicator-table.el-table /deep/tr{
  cursor: pointer;
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
  bottom: 0;
}
</style>