<template>
	<div class="reports-filter">
		<el-select v-model="valueMarket" multiple collapse-tags placeholder="market type" @change="filterReports">
			<el-option
			v-for="item in optionsMarket"
			:key="item.value"
			:label="item.label"
			:value="item.value">
			</el-option>
		</el-select>
		<el-select v-model="valueTimeframe" multiple collapse-tags placeholder="timeframe" @change="filterReports">
			<el-option
			v-for="item in optionsTimeframe"
			:key="item.value"
			:label="item.label"
			:value="item.value">
			</el-option>
		</el-select>
		<el-select v-model="valueAuthor" multiple collapse-tags placeholder="author" @change="filterReports">
			<el-option
			v-for="item in optionsAuthor"
			:key="item.value"
			:label="item.label"
			:value="item.value">
			</el-option>
		</el-select>
	</div>
</template>
    
<script>
import { mapGetters } from 'vuex'
import EventBus from "@/event-bus";

export default {
	name: 'ReportsFilter',
	data() {
		return {
			optionsMarket: [{
				value: 'bullish',
				label: 'Bullish'
				}, {
				value: 'bearish',
				label: 'Bearish'
			}],
			optionsTimeframe: [{
				value: 'Short-Term',
				label: 'Short-Term'
				}, {
				value: 'Medium-Term',
				label: 'Medium-Term'
				}, {
				value: 'Long-Term',
				label: 'Long-Term'
			}],
			optionsAuthor: [],
			valueMarket: ['bearish','bullish'],
			valueTimeframe: ['Short-Term','Medium-Term','Long-Term'],
			valueAuthor: [],
		}
	},
	computed: {
		...mapGetters({
			optionsAuthorList: 'getForecastAuthorList',
		})
	},
	watch: {
		optionsAuthorList: {
			handler(newValue, oldValue){
				this.optionsAuthor = newValue.map(item=>{return {value:item,label:item}})
				this.valueAuthor = newValue
			},
			deep: true
		},
	},
    beforeDestroy() {
    },
	methods: {
		filterReports(){
			console.log('filterReports')
			document.querySelectorAll('.forecast').forEach(report => {
				const reportAuthor = report.getAttribute('data-author');
				const reportTimeframe = report.getAttribute('data-timeframe');
				const reportMarket = report.getAttribute('data-market');
				if(report.id == 'stxForecast') return
				if (
				(this.valueAuthor.includes(reportAuthor)) &&	// if select no author or current report's author in list
				(this.valueTimeframe.includes(reportTimeframe)) &&
				(this.valueMarket.includes(reportMarket))
				) {
					report.classList.remove('hidden'); //show
				} else {
					report.classList.add('hidden'); //hide
				}
			});
		}
	}
}
</script>
<style lang="less" scoped>
.reports-filter{
	padding-left: 20px;
	height: 45px;
    display: flex;
    align-items: center;
}
/deep/ .el-input__inner {
	margin-left: 0;
}

/deep/ .el-select__tags {
	flex-wrap: nowrap;
}
</style>
    