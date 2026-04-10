<template>
	<div class="footer" :class="{'isFixedAtBottom': isFixedAtBottom }" v-if="isVisible">
		<p>
			Copyright © 2001 - {{currentYear}} Sundial Capital Research, Inc. All rights
			reserved.
		<span class="footer-link">
			<el-link href="/doc/disclaimer" type="warning" target="_blank">General Disclaimer</el-link> | 
			<el-link href="/doc/guide/0" type="warning" target="_blank">BacktestEdge Tutorial</el-link>
				<!-- | 
			<el-link href="/doc/scanner" type="warning" target="_blank">Smart Stock Scanner Tutorial</el-link> -->
		</span>
		</p>
		<ul class="Footer_social___a7sK">
			<li>
				<a
					href="https://facebook.com/sentimentrader"
					target="_blank"
					rel="noopener noreferrer"
					><i class="fa fa-facebook"></i
				></a>
			</li>
			<li>
				<a
					href="https://www.linkedin.com/company/sentimentrader"
					target="_blank"
					rel="noopener noreferrer"
					><i class="fa fa-linkedin"></i
				></a>
			</li>
			<li>
				<a
					href="https://youtube.com/sentimentrader"
					target="_blank"
					rel="noopener noreferrer"
					><i class="fa fa-youtube"></i
				></a>
			</li>
			<li>
				<a
					href="https://twitter.com/sentimentrader"
					target="_blank"
					rel="noopener noreferrer"
					><i class="fa fa-twitter"></i
				></a>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
  name: 'Footer',
	data() {
		return {
			isFixedAtBottom: false,
			isVisible: true
		}
	},
	watch: {
    '$route'(to, _) {
			if(to.path.includes('/doc/guide') || to.path.includes('/doc/scannerdoc')  || to.path.includes('/indicators') || to.path.includes('/trend_score') || to.path.includes('/MR') || to.path.includes('/dashboard') || to.path.includes('/sector_trend_score') || to.path.includes('/watchlist') || to.path.includes('/market') || to.path.includes('/contact')) {this.isVisible = false; return}
			if (to.path.includes('/backtester') || to.path.includes('/myindicator') || to.path.includes('/scannerai') || to.path.includes('/doc/home') || to.path.includes('/cpm') || to.path.includes('/strategy') || to.path.includes('/portfolio') || to.path.includes('/my_signals') || to.path.includes('/my_screen') || to.path.includes('/seasonality')) {
        this.isFixedAtBottom = false
      }else {
				this.isFixedAtBottom = true
			}
			this.isVisible = true
    }
  },
		computed: {
			currentYear() {
			return new Date().getFullYear()
			}
		}
}
</script>

<style lang="less" scoped>
@import "./index.css";

</style>