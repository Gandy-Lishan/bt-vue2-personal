<template>
	<div class="footer">
		<p>
			Copyright © 2001 - 2023 Sundial Capital Research, Inc. All rights
			reserved.
		<span class="footer-link">
			<el-link href="/doc/disclaimer" type="warning" target="_blank">General Disclaimer</el-link> | 
			<el-link href="/doc/guide/0" type="warning" target="_blank">BacktestEdeg Tutorial</el-link> | 
			<el-link href="/doc/scanner" type="warning" target="_blank">AI Scanner Tutorial</el-link>
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

}
</script>

<style lang="less" scoped>
.footer {
	background: #fff;
	display: flex;
	padding: 16px 16px 48px 16px;
	border-top: 1px solid #e5e7eb;
	margin-top: 50px;
	justify-content: space-between;
	align-items: center;
}
.footer .el-link{
	font-size: 12px;
}
.footer p {
	text-align: center;
	color: #9ca3af;
	line-height: 21px;
}

.Footer_social___a7sK {
	display: flex;
}
.Footer_social___a7sK li {
	margin-right: 24px;
}
.Footer_social___a7sK a {
	font-size: 20px;
	color: #9ca3af;
}
.Footer_social___a7sK a:hover {
	font-size: 20px;
	color: #0284c7;
}
a {
	transition: color 0.3s ease-in-out;
	text-decoration: none;
}

ol,
ul {
	margin: 0;
	padding: 0;
	list-style: none;
}
</style>