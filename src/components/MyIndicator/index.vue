<template>
	<div class="my-inicator-container">
		<router-view></router-view>
	</div>
</template>

<script>
import { getIndicatorsList, getStocksList, getIndexsList } from '@/service/service'
import { uniqWith, isEqual } from "lodash"
export default {
	name: 'MyIndicator',
  async mounted() {
    await this.loadData()
  },
	methods: {
		async fetchDataList(source) {
			const dataList = this.$store.state.chart[source]
			const sourceMap = {
				indexsList: { labelField: 'name', urlField: 'symbol', type: 'Symbol' },
				stocksList: { labelField: 'name', urlField: 'stock', type: 'Symbol' },
				indicatorsList: {
					labelField: 'chart_name',
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
					} else if (source === 'indicatorsList') {
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
							// // 限制只展示 Daily 的列表项
							// if (updateField == "Daily") {
							// 	mappedItem.updated = item[updateField];
							// 	return mappedItem;
							// }
							if(item[updateField]) {
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
      // 初次渲染 两个列表都要请求
      let sentimentList = await this.fetchDataList('indicatorsList')
			sentimentList = sentimentList.filter(item => item !== null && item !== undefined && item !== '');
		  const stocksList = await this.fetchDataList('stocksList')
			const indexsList = await this.fetchDataList('indexsList')
			console.log('过滤后的 sentimentList', sentimentList)
			// 合并 stocksList 和 indexsList
			const concatList = stocksList.concat(indexsList)
      const symbolList = uniqWith(concatList, isEqual)
      // 存储数据到 localStorage
      localStorage.setItem('sentimentList', JSON.stringify(sentimentList))
      localStorage.setItem('symbolList', JSON.stringify(symbolList))
    }
	}
}
</script>

<style lang="less" scoped>
</style>