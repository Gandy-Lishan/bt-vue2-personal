<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<script>
function isMobile() {
	var ua = navigator.userAgent.toLowerCase()
	var StringPhoneReg =
		'\\b(ip(hone|od)|android|opera m(ob|in)i' +
		'|windows (phone|ce)|blackberry' +
		'|s(ymbian|eries60|amsung)|p(laybook|alm|rofile/midp' +
		'|laystation portable)|nokia|fennec|htc[-_]' +
		'|mobile|up.browser|[1-4][0-9]{2}x[1-4][0-9]{2})\\b'
	var StringTableReg =
		'\\b(ipad|tablet|(Nexus 7)|up.browser' + '|[1-4][0-9]{2}x[1-4][0-9]{2})\\b'

	console.log(ua)
	var isIphone = ua.match(StringPhoneReg),
		isTable = ua.match(StringTableReg),
		isMobile = isIphone || isTable

	if (isMobile) {
		alert('yes')
		return true
	} else {
		alert('no')
		return false
	}
}
export default {
	name: 'app',
	created() {
		// this.loadSentimentList()
		// this.loadIndexsList()
		// this.loadStocksList()
	},
	methods: {
		loadSentimentList() {
			const vm = this

			vm.$http
				.get(
					'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
					{
						auth: {
							username: 'sentimentrader_backtest_api',
							password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
						}
					}
				)
				.then((res) => {
					this.$store.commit('getIndicatorsList', res.data)
				})
				.catch((error) => {
					console.warn(error)
				})
		},
		loadIndexsList() {
			this.$http
				.get(
					'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getIndexes',
					{
						auth: {
							username: 'sentimentrader_backtest_api',
							password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
						}
					}
				)
				.then((res) => {
					this.$store.commit('getIndexsList', res.data)
				})
				.catch((error) => {
					console.warn(error)
				})
		},
		loadStocksList() {
			this.$http
				.get(
					'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getStocks',
					{
						auth: {
							username: 'sentimentrader_backtest_api',
							password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
						}
					}
				)
				.then((res) => {
					this.$store.commit('getStocksList', res.data)
				})
				.catch((error) => {
					console.warn(error)
				})
		}
	}
}
</script>
<style lang="scss">
@import '../node_modules/chartiq/css/normalize.css';
@import '../node_modules/chartiq/css/page-defaults.css';
@import '../node_modules/chartiq/css/stx-chart.css'; // Chart API
@import '../node_modules/chartiq/css/chartiq.css'; // Chart UI
@import '../node_modules/chartiq/st-development/css/ST-chartiq.css';
#app {
	height: 100vh;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>
