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
                  <template v-for="(item, index) in scope.row['included']">
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
            <p v-for="(item, index) in scope.row.included" :key="index">
              <span v-if="index == 0 || index == 1">{{ `${index + 1}. ${item}` }}</span>
            </p>
          </template>
				</el-table-column>
			</template>
      <el-table-column
      min-width="40"
      >
				<template slot-scope="scope">
          <el-button class="delete-btn" round size="mini" type="primary" icon="el-icon-delete" @click.stop="deleteIndicator(scope.row)"></el-button>
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
import { delMyIndicator, getMyIndicatorsList, searchIndicator } from '@/service/service'
import { capitalizeFirstLetter } from "@/utils"

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
          value: 'included'
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
    async getTableData(page) {
      this.loading = true
      let listRes
      try {
        listRes = await getMyIndicatorsList(page)
      } catch (error) {
        this.currentPage = 1; listRes = await getMyIndicatorsList(1)
      }
      this.total = listRes.data.count
      this.tableData = this.processRowData(listRes.data.results)
      this.loading = false
    },
    processRowData(resData) {
      const sentimentList = JSON.parse(localStorage.getItem('sentimentList'))
      const symbolList = JSON.parse(localStorage.getItem('symbolList'))

      let data = resData.map(item => {
      if (['ratio', 'spread'].includes(item.calculate)) {
        const {included, former, latter} = this.getIncludedData(item, sentimentList, symbolList);
        return {
          ...item,
          categories: `${included.some(i => i) ? 'Indicator' : 'Symbol'} ${capitalizeFirstLetter(item.calculate)}`,
          included,
          key: item.url,
          former,
          latter,
          time_frame: capitalizeFirstLetter(item.timeframe)
        };
      }
      if (item.calculate === 'weight_c' && (item.indicator_weight && item.mul_indicator)) {
        const included = this.getWeightedIndicatorData(item, sentimentList);
        return {
          ...item,
          categories: 'Indicator Weight Combination',
          included,
          key: item.url,
          time_frame: capitalizeFirstLetter(item.timeframe)
        };
      }
    });
    
      data = data.filter(
			item => item !== null && item !== undefined && item !== ''
		  )
      console.log('处理过后的数据', data)
      return data
    },
    getIncludedData(item, sentimentList, symbolList) {
      const indicator1 = sentimentList.find(ele => ele.url === item.indicator_1_url) || symbolList.find(ele => ele.url === item.indicator_1_url);
      const indicator2 = sentimentList.find(ele => ele.url === item.indicator_2_url) || symbolList.find(ele => ele.url === item.indicator_2_url);
      const maList = item.ma.split('_');
      const ma1 = maList[0] !== '1' ? ` Moving Average ${maList[0].includes('e') ? maList[0].toString().replace(/e$/, '') : maList[0]}` : '';
      const ma2 = maList[1] !== '1' ? ` Moving Average ${maList[1].includes('e') ? maList[1].toString().replace(/e$/, '') : maList[1]}` : '';
      const former = indicator1?.label;
      const latter = indicator2?.label;
      return {
        included: [`${former}${ma1}`, `${latter}${ma2}`],
        former,
        latter
      }
    },
    getWeightedIndicatorData(item, sentimentList) {
      const mulIndicatorObj = JSON.parse(item.mul_indicator);
      const indicatorWeightArr = item.indicator_weight.includes('_') ? item.indicator_weight.split('_') : [item.indicator_weight];
      return indicatorWeightArr.map((weight, index) => {
        const indicator = sentimentList.find(ele => ele.url === mulIndicatorObj[`indicator_${index + 1}`])?.label;
        return `${indicator} (weight ${(weight * 100).toFixed()}%)`;
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
      const data = {
        name: this.searchKey
      }
      let searchRes
      try {
        searchRes = await searchIndicator(data)
        console.log('searchRes', searchRes)
        if(searchRes.status == 200) {
          this.tableData = this.processRowData(searchRes.data)
          // this.tableData = searchRes.data
        }
        if(searchRes.data.code == 406 || searchRes.data.code == 404) {
          this.tableData = []
        }
      } catch (error) {
        this.tableData = []
      }
      this.loading = false
      console.log(searchRes)
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
    async deleteIndicator(row) {
      let res = await delMyIndicator(row.url)
      const code = res.data.code
				if(code == 200) {
            this.$message({
              message: 'The indicator has been removed from the list',
              center: true
            })
					}
					if(code == 404) {
              this.$message({
              message: 'The indicator is no longer in the list',
              center: true
            })
					}
					if(code == 403) {
            this.$message({
              message: 'Permission denied',
              center: true
            })
				}
      console.log('删除 res', res)
      await this.getTableData(this.currentPage)
    }
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
</style>