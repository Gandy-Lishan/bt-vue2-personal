// Home
<template>
	<div class="home">
		<div class="home-container">
			<div class="navbar">
				<div class="header_logo">
					<span
						><img
							style="width: 190px; height: 50px"
							src="../../assets/logo.png"
							alt="logo"
					/></span>
					<div class="betaNote">BacktestEdge Beta</div>
					<el-menu
						:default-active="activeIndex"
						class="el-menu-demo menu"
						mode="horizontal"
						@select="handleSelect"
					>
						<el-menu-item class="home-link" index="1">Backtester</el-menu-item>
						<el-menu-item class="strategy-link" index="2">Strategy</el-menu-item>
						<el-menu-item class="ai-link" index="3">AI Scanner</el-menu-item>
						<el-submenu index="4">
							<template slot="title">Help</template>
							<el-menu-item index="4-1">Tutorial</el-menu-item>
							<el-menu-item index="4-2">Contant Us</el-menu-item>
						</el-submenu>
						<el-submenu index="5">
							<template slot="title"><i class="el-icon-s-tools"></i></template>
							<!-- <el-menu-item index="5-1">User: {{$store.state.role}}</el-menu-item> -->
							<!-- <el-menu-item index="5-1">Theme</el-menu-item> -->
							<!-- <el-menu-item index="5-2">Language</el-menu-item> -->
						</el-submenu>
					</el-menu>
				</div>
			</div>
			
			<router-view></router-view>

			<!-- <el-tooltip
				class="item"
				effect="dark"
				content="Back to the top"
				placement="bottom"
			>
				<button class="toTop" @click="animationUp(0)">
					<svg
						width="15"
						height="20"
						viewBox="0 0 22 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M-1.31134e-07 1.5C-5.87107e-08 0.671573 0.642374 5.61581e-08 1.43478 1.25433e-07L20.5652 1.79787e-06C21.3576 1.86714e-06 22 0.671574 22 1.5C22 2.32843 21.3576 3 20.5652 3L1.43478 3C0.642374 3 -2.03557e-07 2.32843 -1.31134e-07 1.5Z"
							fill="#F9FAFB"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M11.5 30C10.6716 30 10 29.2645 10 28.3571L10 8.64286C10 7.73553 10.6716 7 11.5 7C12.3284 7 13 7.73553 13 8.64286L13 28.3571C13 29.2645 12.3284 30 11.5 30Z"
							fill="#F9FAFB"
						></path>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M21.5079 18.5152C20.8519 19.1616 19.7881 19.1616 19.1321 18.5152L11.5 10.9959L3.86794 18.5152C3.21186 19.1616 2.14814 19.1616 1.49206 18.5152C0.835983 17.8688 0.835983 16.8208 1.49206 16.1744L10.3121 7.48479C10.9681 6.8384 12.0319 6.8384 12.6879 7.48479L21.5079 16.1744C22.164 16.8208 22.164 17.8688 21.5079 18.5152Z"
							fill="#F9FAFB"
						></path>
					</svg>
				</button>
			</el-tooltip> -->
			<div class="footer">
				<p>
					Copyright © 2001 - 2023 Sundial Capital Research, Inc. All rights
					reserved.
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
		</div>
	</div>
</template>
<script>
export default {
	name: 'homeLayout',
	data() {
		return {
			activeIndex: '1',
		}
	},
	mounted() {
		if(this.$route.name == 'strategy'){
			this.activeIndex = '2'
		}else if(this.$route.name == 'backtester'){
			this.activeIndex = '1'
		}else if(this.$route.name == 'scannerai' || this.$route.name == 'scannerai_chart'){
			this.activeIndex = '3'
		}
	},
	methods: {
		handleSelect(key, keyPath) {
			let path = ''
			if (key == '1') {
				path = this.$router.resolve({
					path: '/home'
				}).href
				this.$router.push(path)
			} else if (key == '2') {
				path = this.$router.resolve({
					path: '/home/strategy'
				}).href
				this.$router.push(path)
			} else if (key == '3') {
				path = this.$router.resolve({
					path: '/home/scannerai'
				}).href
				this.$router.push(path)
			} else if (key == '4-1') {
				path = this.$router.resolve({
					path: '/doc'
				}).href
				window.open(path, '_blank')
			} else if (key == '4-2') {
				path = 'https://users.sentimentrader.com/users/account/support/'
				window.open(path, '_blank')
			}
		},
		animationUp: function (ph) {
			window.scrollTo({
				top: ph,
				behavior: 'smooth'
			})
		},
	}
}
</script>
<style lang="less" scoped>

.home-container {
	margin: 0 auto;
}

@media (min-width: 375px) and (max-width: 767px) {
	.home-container {
		width: 100%;
		margin: 0 auto;
	}
    .betaNote {
		visibility: hidden;
	}
}

@media (max-width: 374px) {
	.betaNote {
		visibility: hidden;
	}
}
@media (min-width: 768px) and (max-width: 819px) {

	.betaNote {
		visibility: hidden;
	}
}

.navbar {
	height: 78px;
}

.header_logo {
	display: flex;
	box-shadow: 0 1px 3px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 6%);
	position: fixed;
	z-index: 999;
	top: 0;
	width: 100%;
	background: #fff;
	align-items: center;
	justify-content: space-between;
	.menu {
		justify-self: center;
		align-self: center;
		margin-right: 7px;
		.strategy-link,.home-link,.ai-link{
			height: 78px;
			display: flex;
			align-items: center;
			color: #6b7280;
			font-weight: 500;
		}
		.strategy-link:hover{
			color:#5b9bd1;
		}
		.home-link:hover{
			color:#5b9bd1;
		}
		.ai-link:hover{
			color:#5b9bd1;
		}
	}
	.betaNote {
		margin: 1.14rem 0 1.14rem 0px;
		font-style: italic;
		color: #6c6c6c;
		text-align: left;
		font-size: 2.5rem;
		margin: 0px;
		font-weight: lighter;
		color: #333333;
	}
}
.header_logo > span {
	padding: 12px 24px;
}

button.toTop {
	opacity: 0.4;
	z-index: 999;
	border: unset;
	position: fixed;
	left: 75px;
	bottom: 63px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50px;
	height: 50px;
	border-radius: 100%;
	background-image: initial;
	background-position-x: initial;
	background-position-y: initial;
	background-size: initial;
	background-repeat-x: initial;
	background-repeat-y: initial;
	background-attachment: initial;
	background-origin: initial;
	background-clip: initial;
	background-color: #94989f;
	box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%),
		0 10px 10px -5px rgb(0 0 0 / 4%);
}

.footer {
	background: #fff;
	display: flex;
	padding: 16px 16px 48px 16px;
	border-top: 1px solid #e5e7eb;
	margin-top: 50px;
	justify-content: space-between;
	align-items: center;
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
