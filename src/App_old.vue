<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>
<script>
export default {
	name: 'app'
}
</script>
<style lang="scss">
@import 'components/common/chart/st-development/css/normalize.css';
@import 'components/common/chart/st-development/css/page-defaults.css';
@import 'components/common/chart/st-development/css/stx-chart.css'; // Chart API
@import 'components/common/chart/st-development/css/chartiq.css'; // Chart UI
@import 'components/common/chart/st-development/css/ST-chartiq.css';

a {
    color: #5b9bd1;
    text-decoration: none;
    transition: color .3s;
}
a:hover{
    color: #038cff;
}

#app {
	overflow-y: auto;
	overflow-x: hidden;
}

#nprogress .bar {
	background: #2299ddcf !important;
	z-index: 99999 !important; 
	height: 10px !important; 
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
