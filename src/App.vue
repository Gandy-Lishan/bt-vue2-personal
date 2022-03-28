<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<script>
// function testBrowser() {
// 	//取得浏览器的userAgent字符串
// 	var userAgent = navigator.userAgent
// 	var isOpera = userAgent.indexOf('Opera') > -1

// 	//谷歌
// 	if (userAgent.indexOf('Chrome') > -1) {
// 		return 'Chrome'
// 	}

// 	//火狐
// 	if (userAgent.indexOf('Firefox') > -1) {
// 		return 'Firefox'
// 	}

// 	//ie
// 	if (
// 		userAgent.indexOf('compatible') > -1 &&
// 		userAgent.indexOf('MSIE') > -1 &&
// 		!isOpera
// 	) {
// 		return 'IE'
// 	}
// 	//Opera
// 	if (isOpera) {
// 		return 'Opera'
// 	}
// 	//Safari
// 	if (userAgent.indexOf('Safari') > -1) {
// 		return 'Safari'
// 	}
// }
// //调用函数实现
// var broweser = testBrowser()
// if ('Chrome' !== broweser) {
// 	alert('Google Chrome renders the screen better')
// }
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
	//height: 100vh;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>
