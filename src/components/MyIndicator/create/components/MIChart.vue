<template>
		<div class="chart_box" id="chart_box">
			<div class="back">
				<router-link to="/myindicator"><i class="el-icon-arrow-left"></i><span>Back to my indicators list</span></router-link>
			</div>
			<chart width="100%" height="100%"></chart>
		</div>
</template>

<script>
import chart from '@/components/common/chart/index.vue'
export default {
	name: 'MIChart',
	data() {
		return {
			indicator : '',
			trades : [],
			symbolUrl: '',
		}
	},
	components: {
    	chart: chart,
	},
}
</script>

<style lang="less" scoped>
.back {
    position: absolute;
    top: 109px;
    left: 48px;
	font-size: 1.1rem;
	i {
		font-weight: bold;
	}
	a {
		color: #525456;
		font-weight: bold;
		&:hover {
			color: #5b9bd1;
		}
	}
}
#chart_box {
	margin-top: 80px
}
</style>