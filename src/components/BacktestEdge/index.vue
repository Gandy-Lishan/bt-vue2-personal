// Home
<template>
	<div class="home">
		<div class="home-container">
			<div class="navbar">
				<div class="header_logo">
					<div class='logo_container'>
						<span
							><img
								style="width: 190px; height: 50px"
								src="../../assets/logo.png"
								alt="logo"
						/></span>
						<div class="betaNote">BacktestEdge Beta</div>
					</div>
					<el-menu
						:default-active="activeIndex"
						class="el-menu-demo menu"
						mode="horizontal"
						@select="handleSelect"
					>
						<el-menu-item class="home-link" index="1">Backtester</el-menu-item>
						<el-menu-item class="strategy-link" index="2">Strategy</el-menu-item>
						<el-menu-item class="ai-link" index="3">AI Scanner</el-menu-item>
						<el-submenu class="help-title" index="4">
							<template slot="title">
								<span >Help</span>	
							</template>
							<el-menu-item index="4-1">Tutorial</el-menu-item>
							<el-menu-item index="4-2">Contant Us</el-menu-item>
						</el-submenu>
						<el-submenu index="5">
							<template slot="title"><i class="el-icon-s-tools tools"></i></template>
							<!-- <el-menu-item index="5-1">User: {{$store.state.role}}</el-menu-item> -->
							<!-- <el-menu-item index="5-1">Theme</el-menu-item> -->
							<!-- <el-menu-item index="5-2">Language</el-menu-item> -->
						</el-submenu>
					</el-menu>
				</div>
			</div>
			<router-view></router-view>
			<Footer></Footer>
		</div>
	</div>
</template>
<script>
import Footer from "./Footer.vue";
export default {
	name: 'homeLayout',
	data() {
		return {
			activeIndex: '1',
		}
	},
	components: {
		Footer
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
			margin: 0 28px;
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
		.help-title {
			margin-left: 28px;
			span {
				font-size: 10px;
				margin-top: 3px;
				&::after{
					content: "";
					position: absolute;
					right: 7px;
					top: 37px;
					display: block;
					width: 5px;
					height: 5px;
					border-right: solid thin #959595;
					border-bottom: solid thin #959595;
					transform: rotate(45deg) scale(1);
				}
			}

		}
		.tools {
			margin-top: 3px;
			font-size: 10px;
		}
	}
	.logo_container {
		display: flex;
    	align-items: center;
		
		& > span {
			padding: 12px 24px 6px 24px;
		}
		.betaNote {
			margin: 1.14rem 0 1.14rem 0px;
			font-style: italic;
			color: #6c6c6c;
			text-align: left;
			font-size: 1.6rem;
			margin: 0px;
			font-weight: lighter;
			color: #333333;
		}
	}
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
</style>
