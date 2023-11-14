<template>
  <div class="seasonality-container">
    <div class="seasonality-top"></div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="Performance by Day of Month" name="first">
      <DayOfMonth></DayOfMonth>
    </el-tab-pane>
    <el-tab-pane label="Performance Around Specific Days" name="second">
			<SpecificDay></SpecificDay>
		</el-tab-pane>
    <el-tab-pane label="Other Charts & Data" name="third">
			<Others></Others>
		</el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import DayOfMonth from "./components/DayOfMonth/index.vue"
import SpecificDay from "./components/SpecificDay/index.vue"
import Others from "./components/Others/index.vue"
import { getStocksList, getIndexsList } from '@/service/service'
import { uniqWith, isEqual } from "lodash"
export default {
  name: 'Seasonality',
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    DayOfMonth,
		SpecificDay,
		Others
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
		async fetchDataList(source) {
			const dataList = this.$store.state.chart[source]
			const sourceMap = {
				indexsList: { labelField: 'name', urlField: 'symbol', type: 'Symbol' },
				stocksList: { labelField: 'name', urlField: 'stock', type: 'Symbol' },
				sentimentIndicatorList: {
					labelField: 'value',
					urlField: 'url',
					updateField: 'updated',
					type: 'Indicator'
				}
			}

			if (dataList.length !== 0 || !dataList) {
				const { labelField, urlField, type } = sourceMap[source]
				// return dataList.map((item) => ({
				// 	label: item[labelField],
				// 	url: item[urlField],
				// 	type
				// }))
				return dataList.map((item) => {
					const obj = {
						label: item[labelField],
						url: item[urlField],
						type
					}
					// if(item.updated === 'Daily') {
					// 	obj.updated = item.updated
					// 	return obj
					// }
					// 不需要限制 timeframe 为 Daily
					if(item.updated) {
						obj.updated = item.updated
						return obj
					}
					if(!item.updated && (source === 'indexsList' || source === 'stocksList')) {
						return obj
					}
				})
			} else {
				try {
					let res

					if (source === 'stocksList') {
						res = await getStocksList()
					} else if (source === 'indexsList') {
						res = await getIndexsList()
					} else if (source === 'sentimentIndicatorList') {
						res = await getIndicatorsList()
					}

					if (res) {
						const { labelField, urlField, type, updateField } = sourceMap[source]
						return res.data.map((item) => {
							const mappedItem = {
								url: item[urlField],
								type
							};
							if(item[labelField]) {
								mappedItem.label = item[labelField]
							}else {
								mappedItem.label = item['chart_name']
							}
							// 限制只展示 Daily 的列表项
							if (updateField == "Daily") {
								mappedItem.updated = item[updateField];
								return mappedItem;
							}
							if(!item.updated && (source === 'indexsList' || source === 'stocksList')) {
								return mappedItem
							}
						});
					}
				} catch (error) {
					console.error(error)
					return []
				}
			}
		},
    async loadData() {
		  const stocksList = await this.fetchDataList('stocksList')
			const indexsList = await this.fetchDataList('indexsList')
			const concatList = stocksList.concat(indexsList)
      const symbolList = uniqWith(concatList, isEqual)
      // 存储数据到 localStorage
      localStorage.setItem('symbolList', JSON.stringify(symbolList))
    }
  }
}
</script>

<style lang="less" scoped>
.seasonality-container{
  margin-top: 80px;
	margin-bottom: 50px;
/deep/ .el-tabs__nav.is-top{
  width: 100%;
}
/deep/ .el-tabs__item.is-top{
  width: 33.33%;
  text-align: center;
}
}
</style>