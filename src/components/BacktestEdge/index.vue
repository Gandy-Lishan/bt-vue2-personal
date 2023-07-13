// Home
<template>
	<div class="home">
		<div class="home-container">
			<div class="navbar">
				<div class="header_logo">
					<div class="logo_container">
						<span
							><img
								style="width: 190px; height: 50px"
								src="../../assets/logo.png"
								alt="logo"
						/></span>
						<div class="betaNote">SentimenTech</div>
					</div>
					<el-menu
						:default-active="activeIndex"
						class="el-menu-demo menu"
						mode="horizontal"
						@select="handleSelect"
					>
						<el-menu-item class="home-link" index="1"
							>BacktestEdge</el-menu-item
						>
						<el-menu-item class="strategy-link" index="2"
							>Strategy</el-menu-item
						>
						<el-menu-item class="ai-link" index="3"
							>AI Stock Scanner</el-menu-item
						>
						<el-submenu class="help-title" index="4">
							<template slot="title">
								<span>Help</span>
							</template>
							<el-menu-item index="4-1">Tutorial</el-menu-item>
							<!-- <el-menu-item index="4-2">Disclaimer</el-menu-item> -->
						</el-submenu>
						<!-- <el-menu-item class="news-icon" index="6">
							<div
								class="svgContainer"
								v-html="svgCode"
								@click="changeSvg"
							></div>
						</el-menu-item> -->
						<el-submenu index="5">
							<template slot="title"
								><i class="el-icon-s-tools tools"></i
							></template>
							<!-- <el-menu-item index="5-1">User: {{$store.state.role}}</el-menu-item> -->
							<!-- <el-menu-item index="5-1">Theme</el-menu-item> -->
							<!-- <el-menu-item index="5-2">Language</el-menu-item> -->
						</el-submenu>
					</el-menu>
				</div>
			</div>
			<RecentlyUpdated
				class="recentlyUpdated"
				:isClosed="isClosed"
				@click="changeSvg"
			></RecentlyUpdated>
			<router-view></router-view>
			<Footer></Footer>
			<!-- <el-dialog
				title="Edit exit with different TIM Table"
				:visible.sync="showTable"
				width="80%"
			>
				<div slot="footer" class="dialog-footer">
					<el-button >Cancel</el-button>
					<el-button type="primary" >Save</el-button>
				</div>
			</el-dialog> -->
		</div>
	</div>
</template>
<script>
import Footer from "./Footer.vue";
import RecentlyUpdated from "./RecentlyUpdated.vue";
export default {
  name: 'homeLayout',
  data() {
    return {
      activeIndex: '1',
      showTable: true,
      svgCode: '',
      isClosed: false
    }
  },
  components: {
    Footer,
    RecentlyUpdated
  },
  watch: {
    '$route'(to, from) {
      // 在$route对象变化时执行逻辑
      if (to.name == 'strategy') {
        this.activeIndex = '2'
      } else if (to.name == 'backtester' || to.name == 'Backtests') {
        this.activeIndex = '1'
      } else if (to.name == 'scannerai' || to.name == 'scannerai_chart') {
        this.activeIndex = '3'
      }
    }
  },
  mounted() {
    // el-menu-item strategy-link
    let strategy = document.querySelector('.strategy-link')
    strategy.style.display = 'none'
    if (this.$route.name == 'strategy') {
      this.activeIndex = '2'
    } else if (this.$route.name == 'backtester' || this.$route.name == 'Backtests') {
      this.activeIndex = '1'
    } else if (this.$route.name == 'scannerai' || this.$route.name == 'scannerai_chart') {
      this.activeIndex = '3'
    }
    // 判断用户是否是首次进入
    if (!localStorage.getItem("visited")) {
      // 如果"visited"键不存在
      this.svgCode = `<svg
									width="18"
									height="19"
									viewBox="0 0 18 19"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M10.8188 16.0004C10.8188 16.5308 10.6081 17.0395 10.2331 17.4146C9.85799 17.7896 9.34928 18.0004 8.81885 18.0004C8.28841 18.0004 7.77971 17.7896 7.40463 17.4146C7.02956 17.0395 6.81885 16.5308 6.81885 16.0004H10.8188ZM13.8188 15.0004H2.91885C2.75972 15.0004 2.60711 14.9371 2.49458 14.8246C2.38206 14.7121 2.31885 14.5595 2.31885 14.4004C2.31885 14.2412 2.38206 14.0886 2.49458 13.9761C2.60711 13.8636 2.75972 13.8004 2.91885 13.8004H3.81885V10.0004C3.81885 7.58036 5.53885 5.56036 7.82385 5.10036C7.80989 4.96132 7.82523 4.82089 7.86888 4.68814C7.91253 4.55538 7.98352 4.43325 8.07727 4.32962C8.17102 4.22599 8.28545 4.14316 8.41318 4.08647C8.54091 4.02978 8.6791 4.00049 8.81885 4.00049C8.95859 4.00049 9.09679 4.02978 9.22452 4.08647C9.35225 4.14316 9.46668 4.22599 9.56043 4.32962C9.65418 4.43325 9.72516 4.55538 9.76881 4.68814C9.81246 4.82089 9.8278 4.96132 9.81385 5.10036C10.944 5.33023 11.9599 5.94354 12.6898 6.83648C13.4196 7.72941 13.8185 8.84711 13.8188 10.0004V13.8004H14.7188C14.878 13.8004 15.0306 13.8636 15.1431 13.9761C15.2556 14.0886 15.3188 14.2412 15.3188 14.4004C15.3188 14.5595 15.2556 14.7121 15.1431 14.8246C15.0306 14.9371 14.878 15.0004 14.7188 15.0004H13.8188Z"
										fill="#96999F"
									/>
									<circle
										cx="15.6763"
										cy="3.00007"
										r="2.28571"
										fill="#EC4D4E"
									/>
								</svg>`
      localStorage.setItem("visited", true);
    }else{
			this.svgCode = `<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.2446 13.0004C10.2446 13.5308 10.0339 14.0395 9.65884 14.4146C9.28377 14.7896 8.77506 15.0004 8.24463 15.0004C7.7142 15.0004 7.20549 14.7896 6.83041 14.4146C6.45534 14.0395 6.24463 13.5308 6.24463 13.0004H10.2446ZM13.2446 12.0004H2.34463C2.1855 12.0004 2.03289 11.9371 1.92036 11.8246C1.80784 11.7121 1.74463 11.5595 1.74463 11.4004C1.74463 11.2412 1.80784 11.0886 1.92036 10.9761C2.03289 10.8636 2.1855 10.8004 2.34463 10.8004H3.24463V7.00036C3.24463 4.58036 4.96463 2.56036 7.24963 2.10036C7.23567 1.96132 7.25101 1.82089 7.29466 1.68814C7.33831 1.55538 7.4093 1.43325 7.50305 1.32962C7.5968 1.22599 7.71123 1.14316 7.83896 1.08647C7.96669 1.02978 8.10488 1.00049 8.24463 1.00049C8.38437 1.00049 8.52257 1.02978 8.6503 1.08647C8.77803 1.14316 8.89246 1.22599 8.98621 1.32962C9.07996 1.43325 9.15095 1.55538 9.19459 1.68814C9.23824 1.82089 9.25359 1.96132 9.23963 2.10036C10.3697 2.33023 11.3857 2.94354 12.1155 3.83648C12.8454 4.72941 13.2443 5.84711 13.2446 7.00036V10.8004H14.1446C14.3038 10.8004 14.4564 10.8636 14.5689 10.9761C14.6814 11.0886 14.7446 11.2412 14.7446 11.4004C14.7446 11.5595 14.6814 11.7121 14.5689 11.8246C14.4564 11.9371 14.3038 12.0004 14.1446 12.0004H13.2446Z" fill="#96999F"/>
</svg>`
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
        // path = 'https://users.sentimentrader.com/users/account/support/'
        path = '/doc/disclaimer'
        window.open(path, '_blank')
      }
    },
    animationUp: function (ph) {
      window.scrollTo({
        top: ph,
        behavior: 'smooth'
      })
    },
    changeSvg() {
      this.isClosed = !this.isClosed
      if (this.isClosed) {
        this.svgCode = `<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10.3931 13.0004C10.3931 13.5308 10.1824 14.0395 9.80728 14.4146C9.43221 14.7896 8.9235 15.0004 8.39307 15.0004C7.86263 15.0004 7.35393 14.7896 6.97885 14.4146C6.60378 14.0395 6.39307 13.5308 6.39307 13.0004H10.3931ZM13.3931 12.0004H2.49307C2.33394 12.0004 2.18132 11.9371 2.0688 11.8246C1.95628 11.7121 1.89307 11.5595 1.89307 11.4004C1.89307 11.2412 1.95628 11.0886 2.0688 10.9761C2.18132 10.8636 2.33394 10.8004 2.49307 10.8004H3.39307V7.00036C3.39307 4.58036 5.11307 2.56036 7.39807 2.10036C7.38411 1.96132 7.39945 1.82089 7.4431 1.68814C7.48675 1.55538 7.55774 1.43325 7.65149 1.32962C7.74524 1.22599 7.85967 1.14316 7.9874 1.08647C8.11513 1.02978 8.25332 1.00049 8.39307 1.00049C8.53281 1.00049 8.671 1.02978 8.79873 1.08647C8.92646 1.14316 9.04089 1.22599 9.13464 1.32962C9.22839 1.43325 9.29938 1.55538 9.34303 1.68814C9.38668 1.82089 9.40202 1.96132 9.38807 2.10036C10.5182 2.33023 11.5341 2.94354 12.264 3.83648C12.9938 4.72941 13.3927 5.84711 13.3931 7.00036V10.8004H14.2931C14.4522 10.8004 14.6048 10.8636 14.7173 10.9761C14.8299 11.0886 14.8931 11.2412 14.8931 11.4004C14.8931 11.5595 14.8299 11.7121 14.7173 11.8246C14.6048 11.9371 14.4522 12.0004 14.2931 12.0004H13.3931Z" fill="#5B9BD1"/>
			</svg>
			`} else {
        this.svgCode = `<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M10.2446 13.0004C10.2446 13.5308 10.0339 14.0395 9.65884 14.4146C9.28377 14.7896 8.77506 15.0004 8.24463 15.0004C7.7142 15.0004 7.20549 14.7896 6.83041 14.4146C6.45534 14.0395 6.24463 13.5308 6.24463 13.0004H10.2446ZM13.2446 12.0004H2.34463C2.1855 12.0004 2.03289 11.9371 1.92036 11.8246C1.80784 11.7121 1.74463 11.5595 1.74463 11.4004C1.74463 11.2412 1.80784 11.0886 1.92036 10.9761C2.03289 10.8636 2.1855 10.8004 2.34463 10.8004H3.24463V7.00036C3.24463 4.58036 4.96463 2.56036 7.24963 2.10036C7.23567 1.96132 7.25101 1.82089 7.29466 1.68814C7.33831 1.55538 7.4093 1.43325 7.50305 1.32962C7.5968 1.22599 7.71123 1.14316 7.83896 1.08647C7.96669 1.02978 8.10488 1.00049 8.24463 1.00049C8.38437 1.00049 8.52257 1.02978 8.6503 1.08647C8.77803 1.14316 8.89246 1.22599 8.98621 1.32962C9.07996 1.43325 9.15095 1.55538 9.19459 1.68814C9.23824 1.82089 9.25359 1.96132 9.23963 2.10036C10.3697 2.33023 11.3857 2.94354 12.1155 3.83648C12.8454 4.72941 13.2443 5.84711 13.2446 7.00036V10.8004H14.1446C14.3038 10.8004 14.4564 10.8636 14.5689 10.9761C14.6814 11.0886 14.7446 11.2412 14.7446 11.4004C14.7446 11.5595 14.6814 11.7121 14.5689 11.8246C14.4564 11.9371 14.3038 12.0004 14.1446 12.0004H13.2446Z" fill="#96999F"/>
			</svg>
			`}
    }
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
		.strategy-link,
		.home-link,
		.ai-link {
			margin: 0 28px;
			height: 78px;
			display: flex;
			align-items: center;
			color: #6b7280;
			font-weight: 500;
		}
		.strategy-link:hover {
			color: #5b9bd1;
		}
		.home-link:hover {
			color: #5b9bd1;
		}
		.ai-link:hover {
			color: #5b9bd1;
		}
		.help-title {
			margin-left: 28px;
			span {
				font-size: 13px;
				margin-top: 3px;
				&::after {
					content: '';
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
			font-size: 15px;
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
.el-menu--horizontal > .el-menu-item {
	line-height: 76px;
}
.recentlyUpdated {
	position: fixed;
	right: 0;
	top: 80;
	z-index: 9999;
}
</style>
