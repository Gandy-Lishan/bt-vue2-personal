<template>
	<div class="exit-container">
		<p class="criteria-title">Exit Criteria</p>
		<el-form :model="fd" :rules="exitFormRules" ref="exitForm">
			<div class="radioBox">
				<el-form-item label="Direction:" prop="direction">
					<el-radio-group v-model="this.$store.state.exitDirection" disabled>
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
		</el-form>
		<indicator :criteria="'exit'"></indicator>
		<senti :criteria="'exit'"></senti>
	</div>
</template>
<script>
import { Store } from 'vuex'
import indicator from '@/components/BacktestEdge/signal/indicator/indicator.vue'
import senti from '@/components/BacktestEdge/signal/sentiment/senti/senti.vue'
export default {
	name: 'exit',
	data() {
		return {
			fd: {
				direction: this.$store.state.exitDirection
			},
			exitFormRules: {
				direction: [
					{
						required: true,
						message: 'Please select direction',
						trigger: 'change'
					}
				]
			}
		}
	},
	components: {
		indicator,
		senti
	},
	methods: {}
}
</script>
<style lang="less" scoped>
.criteria-title {
	font-size: 18px;
	font-weight: bold;
}
.radioBox {
	border-bottom: 1px solid #797979;
}
.radioBox .el-form-item {
	display: flex;
}
/deep/.radioBox .el-form-item .el-form-item__label {
	margin-right: 40px;
	width: 70px;
	font-size: 16px;
}
/deep/
	.el-form-item.is-required:not(.is-no-asterisk)
	> .el-form-item__label:before {
	content: ' ';
	width: 0px;
	margin-right: 0px;
}
/deep/ .el-form-item {
	margin-bottom: 10px;
}
.exit-container {
	margin-bottom: 10px;
}
</style>