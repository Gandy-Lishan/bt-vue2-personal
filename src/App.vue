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
	name: 'app'
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

#nprogress .bar {
	background: #2299ddcf !important;
	z-index: 99999 !important; 
	height: 8px !important; 
}
#nprogress .peg {
	background: rgb(34 153 221 / 34%) !important;
	width: 23px !important;
	box-shadow: 0 0 15px #29d, 0 0 10px #29d !important;
	transform: rotate(0deg) translate(0px, 0px) !important;
}
#nprogress .spinner {
  display: none !important;

}
</style>
