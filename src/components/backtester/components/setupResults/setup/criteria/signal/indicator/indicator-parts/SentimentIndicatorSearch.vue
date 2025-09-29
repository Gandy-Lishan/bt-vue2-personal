<template>
	<el-form-item label="Indicator">
	  <SearchAutocomplete
		v-model="selectedValue"
		placeholder="Search for the sentiment indicator"
		:disabled="!isBtChartReady"
		@query="indicatorSentimentSearch"
		@select="handleSelect"
		@clear="handleClear"
		clearable
	  />
	</el-form-item>
  </template>
  
  <script>
  export default {
	props: {
	  isBtChartReady: Boolean,
	},
	data() {
	  return {
		selectedValue: '',
	  };
	},
	methods: {
	  indicatorSentimentSearch(queryString, cb) {
		// ... 搜索逻辑 (从原组件迁移)
	  },
	  handleSelect(item) {
		// 只发出事件，不处理复杂逻辑
		this.$emit('indicator-selected', {
		  type: 'sentiment', // 标记指标类型
		  value: item.value,
		  url: item.url,
		  updated: item.updated, // 频率
		  // ... 其他需要的数据
		});
	  },
	  handleClear() {
		  this.$emit('indicator-cleared');
	  }
	},
  };
  </script>