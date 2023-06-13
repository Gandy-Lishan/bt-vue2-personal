// Sample Backtests List
<template>
	<div>
		hello world
	</div>
</template>
<script>
import { getAIPick } from '@/service/ai'

export default {
	name: 'aiscanner',
	data() {
		return {
			curDate: ''
		}
	},
	async created() {
		this.curDate = this.$store.state.curDate
		console.log(this.curDate)
		// let AIPickContent = await getAIPick(this.curDate)
		// console.log(AIPickContent)
	},
	mounted() {},
	methods: {
	}
}
</script>
<style lang="less" scoped>

</style>