<template>
	<div class="entry-container">
		<p class="criteria-title">Entry Criteria</p>
		<el-form :model="fd" :rules="entryFormRules" ref="entryForm">
			<div class="radioBox">
				<el-form-item label="Direction:" prop="direction">
					<el-radio-group v-model="fd.direction" @change="getExitDirection">
						<el-radio label="Long">Long</el-radio>
						<el-radio label="Short">Short</el-radio>
					</el-radio-group>
				</el-form-item>
			</div>
		</el-form>
		<indicator></indicator>
		<senti></senti>
	</div>
</template>
<script>
import indicator from '@/components/BacktestEdge/signal/indicator/indicator.vue'
import senti from '@/components/BacktestEdge/signal/sentiment/senti/senti.vue'
export default {
	data() {
		return {
			fd: {
				direction: 'Long'
			},
			entryFormRules: {
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
	methods: {
		getExitDirection(val) {
			this.$store.commit('getExitDirection', val)
		}
	}
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
.entry-container {
	padding-right: 20px;
	border-right: 1px solid #797979;
	margin-bottom: 10px;
}
</style>