<template>
  <div v-if="isVisible">
    <div class="maintabBtnContainer" v-if="showComp.maintab">
				<div>
					<button
						class="sidebar"
						:class="{'activated': dynamicClass == 'SR'}"
						ref="setup"
						@click="switchMainTab('sr')"
					>
							<svg
								class="sidebar_button_icon"
								width="11"
								height="11"
								viewBox="0 0 11 11"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M9.54049 8.59834L11 10.1387L10.1839 11L8.72434 9.45968C8.21313 9.83138 7.59301 10.0495 6.92526 10.0495C5.17227 10.0495 3.75119 8.5497 3.75119 6.69964C3.75119 4.84062 5.16378 3.34982 6.92526 3.34982C8.68674 3.34982 10.0993 4.84062 10.0993 6.69964C10.0993 7.40436 9.8927 8.05882 9.54049 8.59834ZM6.96527e-07 -8.88999e-09L10.3879 -2.67563e-08L10.3879 1.21812L6.43281e-07 1.21812L6.96527e-07 -8.88999e-09ZM8.94513 6.69964C8.94513 5.51337 8.04929 4.56794 6.92526 4.56794C5.80123 4.56794 4.9054 5.51337 4.9054 6.69964C4.9054 7.87695 5.80972 8.83135 6.92526 8.83135C7.48319 8.83135 7.98737 8.59342 8.35352 8.20699C8.71968 7.82056 8.94513 7.28847 8.94513 6.69964ZM4.83544e-07 4.87247L2.88552 4.87247L2.88552 6.09058L4.30299e-07 6.09058L4.83544e-07 4.87247ZM2.70562e-07 9.74494L2.88552 9.74494L2.88552 10.9631L2.17316e-07 10.9631L2.70562e-07 9.74494Z"
								/>
							</svg>
							<span>Backtest setup and result</span>
					</button>
				</div>
				<div>
					<button
					class="sidebar" 
					:class="{'activated': dynamicClass == 'LIST'}"
					ref="list" @click="switchMainTab('list')">
						<div class="svgBox">
							<svg
								class="sidebar_button_icon"
								width="10"
								height="12"
								viewBox="0 0 10 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M0 1.2C0 0.537259 0.526723 0 1.17647 0H7.5966L10 2.45147V10.8C10 11.4627 9.47328 12 8.82353 12H1.17647C0.526724 12 0 11.4627 0 10.8V1.2ZM7.10929 1.2L1.17647 1.2V10.8H8.82353V2.94853L7.10929 1.2ZM7.35294 5.7H2.64706V4.5H7.35294V5.7ZM5.58824 8.1H2.64706V6.9H5.58824V8.1Z"
								/>
							</svg>
							<span>Backtest list</span>
						</div>
					</button>
			</div>
        <!-- todo: long xue 记得在这里解除注释 -->

				<!-- <div>
					<button class="sidebar" ref="chat" @click="switchMainTab('chat')">
						<div class="chat-sidebar">
              <svg class="sidebar_button_icon" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.58277 1.03846C6.86659 0.737403 8.21558 0.887891 9.40075 1.46454C10.586 2.04121 11.5346 3.0087 12.085 4.2032L11.3676 5.34418C10.9856 3.94334 10.0941 2.93488 8.95502 2.38065C7.98068 1.90658 6.87126 1.78274 5.81536 2.03034C4.7595 2.27794 3.82284 2.88154 3.16418 3.73802C2.50556 4.59443 2.1654 5.65098 2.20102 6.72819L1.18278 6.76185C1.13935 5.44812 1.55426 4.16023 2.35659 3.11694C3.15887 2.07371 4.29892 1.33951 5.58277 1.03846Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.68958 8.78271L0.366135 6.49043L3.01304 6.49043L1.68958 8.78271Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.302 12.2675C7.01818 12.5685 5.66918 12.418 4.48401 11.8414C3.2988 11.2647 2.35017 10.2972 1.79981 9.10271L2.51716 7.96173C2.8992 9.36257 3.79065 10.371 4.92975 10.9253C5.90409 11.3993 7.01351 11.5232 8.0694 11.2756C9.12526 11.028 10.0619 10.4244 10.7206 9.56789C11.3792 8.71147 11.7194 7.65493 11.6837 6.57772L12.702 6.54406C12.7454 7.85778 12.3305 9.14568 11.5282 10.189C10.7259 11.2322 9.58584 11.9664 8.302 12.2675Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1952 4.52344L13.5186 6.81572L10.8717 6.81572L12.1952 4.52344Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7051 8.78271L17.1762 11.3641C17.3806 11.4821 17.4506 11.7435 17.3326 11.9479L16.8342 12.8112C16.7161 13.0156 16.4548 13.0857 16.2503 12.9676L11.7793 10.3863V10.3863C12.1673 9.92861 12.4728 9.40694 12.6821 8.84457L12.7051 8.78271Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.96091 9.3088H6.84846L6.6231 8.34322H5.21877L4.99341 9.3088H3.88574V9.29583L5.33839 4.21484H6.51783L7.96091 9.3088ZM6.4652 7.69009L5.91878 5.39489L5.3671 7.69009H6.4652Z"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99828 9.3088H8.97949V4.21484H9.99828V9.3088Z"/>
              </svg>
							<span>Hey, Sentimentrader</span>
						</div>
					</button>
				</div> -->
				<!-- <div>
					<el-tooltip
					class="item"
					effect="dark"
					content="Clear current chart & Backtest Setup Form and create a new backtest."
					placement="bottom">
						<button class='sidebar refresh' @click="refreshPage">
						<div>
						<svg class='sidebar_button_icon' width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M2.65079 2.59434C3.35727 1.87621 4.22963 1.43305 5.14214 1.26312L4.91451 0C3.75791 0.215381 2.65102 0.77807 1.75752 1.68632C-0.585841 4.06838 -0.585841 7.93048 1.75752 10.3125L0.679249 11.4086H3.72907V8.30844L2.65079 9.40452C0.80077 7.52394 0.80077 4.47492 2.65079 2.59434ZM11.3208 0.591377H8.27093V3.69156L9.34921 2.59548C11.1992 4.47606 11.1992 7.52508 9.3492 9.40566C8.64273 10.1238 7.77037 10.567 6.85785 10.7369L7.08549 12C8.24209 11.7846 9.34898 11.2219 10.2425 10.3137C12.5858 7.93161 12.5858 4.06952 10.2425 1.68746L11.3208 0.591377Z"/>
						</svg>
						<span>Create new backtest</span>
						</div>
						</button>
					</el-tooltip>
					</div> -->
			</div>
			<el-tooltip
				class="item"
				effect="dark"
				content="Back To The Top"
				placement="bottom"
				v-if="showComp.totop"
			>
				<button class="toTop" @click="animationUp(0)">
					<svg
						width="12"
						height="15"
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
			</el-tooltip>
			<el-tooltip
				class="item"
				effect="dark"
				content="Watch BacktestEdge Tutorial"
				placement="bottom"
				v-if="showComp.tutorial"
			>
				<button class="tutorial" @click="jumpToTutoiral">
					<svg width="12" height="12" viewBox="0 0 186 186" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M164.301 0H21.4442C15.761 5.18001e-08 10.3105 2.25765 6.29191 6.27628C2.27327 10.2949 0.0156251 15.7454 0.015625 21.4286V164.286C0.0156251 169.969 2.27327 175.419 6.29191 179.438C10.3105 183.457 15.761 185.714 21.4442 185.714H164.301C169.985 185.714 175.435 183.457 179.454 179.438C183.472 175.419 185.73 169.969 185.73 164.286V21.4286C185.73 15.7454 183.472 10.2949 179.454 6.27628C175.435 2.25765 169.985 5.18001e-08 164.301 0ZM21.4442 14.2857H164.301C166.196 14.2857 168.013 15.0383 169.352 16.3778C170.692 17.7174 171.444 19.5342 171.444 21.4286V164.286C171.444 166.18 170.692 167.997 169.352 169.336C168.013 170.676 166.196 171.429 164.301 171.429H21.4442C19.5498 171.429 17.733 170.676 16.3934 169.336C15.0539 167.997 14.3013 166.18 14.3013 164.286V21.4286C14.3013 19.5342 15.0539 17.7174 16.3934 16.3778C17.733 15.0383 19.5498 14.2857 21.4442 14.2857Z" fill="white"/>
					<path d="M71.4417 87.6857V145.414C71.4417 149.086 75.4132 151.371 78.5846 149.543L128.585 120.671C129.309 120.254 129.91 119.654 130.328 118.93C130.746 118.206 130.966 117.386 130.966 116.55C130.966 115.714 130.746 114.894 130.328 114.17C129.91 113.447 129.309 112.846 128.585 112.429L78.5846 83.5572C77.8606 83.1375 77.0387 82.9162 76.2018 82.9157C75.365 82.9152 74.5428 83.1354 73.8183 83.5542C73.0938 83.9729 72.4925 84.5754 72.0753 85.3008C71.658 86.0262 71.4395 86.8489 71.4417 87.6857ZM178.585 47.5C180.37 47.4967 182.091 48.1619 183.41 49.3644C184.729 50.567 185.55 52.2198 185.711 53.9975C185.873 55.7751 185.363 57.5487 184.281 58.969C183.2 60.3893 181.627 61.3534 179.87 61.6714L178.585 61.7857H7.15602C5.37108 61.789 3.64959 61.1239 2.33055 59.9213C1.01151 58.7188 0.19051 57.0659 0.0292318 55.2883C-0.132046 53.5106 0.378081 51.737 1.45916 50.3167C2.54024 48.8964 4.11392 47.9323 5.87031 47.6143L7.15602 47.5H178.585Z" fill="white"/>
					<path d="M129.787 3.18624C130.778 1.70923 132.285 0.65516 134.012 0.23025C135.739 -0.194661 137.563 0.0401642 139.126 0.888783C140.689 1.7374 141.88 3.13875 142.464 4.81867C143.049 6.49858 142.986 8.33618 142.287 9.97196L141.673 11.1148L113.101 53.972C112.113 55.4587 110.604 56.5214 108.871 56.9509C107.139 57.3804 105.308 57.1454 103.74 56.2924C102.171 55.4393 100.979 54.0299 100.399 52.3418C99.8178 50.6537 99.8902 48.8093 100.601 47.172L101.216 46.0291L129.787 3.17196V3.18624ZM72.6443 3.18624C73.6354 1.70923 75.142 0.65516 76.8692 0.23025C78.5965 -0.194661 80.4201 0.0401642 81.9833 0.888783C83.5466 1.7374 84.737 3.13875 85.3216 4.81867C85.9062 6.49858 85.843 8.33618 85.1443 9.97196L84.53 11.1148L55.9586 53.972C54.9704 55.4587 53.4612 56.5214 51.7284 56.9509C49.9957 57.3804 48.1649 57.1454 46.5967 56.2924C45.0285 55.4393 43.8366 54.0299 43.2558 52.3418C42.675 50.6537 42.7473 48.8093 43.4586 47.172L44.0729 46.0291L72.6443 3.17196V3.18624Z" fill="white"/>
					</svg>

				</button>
			</el-tooltip>
			<el-tooltip
				class="item"
				effect="dark"
				content="Create New Backtest"
				placement="bottom"
				v-if="showComp.createnew"
			>
				<button class="createNew" @click="refreshPageTemp">
					<svg
						class="sidebar_button_icon"
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="white"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M2.65079 2.59434C3.35727 1.87621 4.22963 1.43305 5.14214 1.26312L4.91451 0C3.75791 0.215381 2.65102 0.77807 1.75752 1.68632C-0.585841 4.06838 -0.585841 7.93048 1.75752 10.3125L0.679249 11.4086H3.72907V8.30844L2.65079 9.40452C0.80077 7.52394 0.80077 4.47492 2.65079 2.59434ZM11.3208 0.591377H8.27093V3.69156L9.34921 2.59548C11.1992 4.47606 11.1992 7.52508 9.3492 9.40566C8.64273 10.1238 7.77037 10.567 6.85785 10.7369L7.08549 12C8.24209 11.7846 9.34898 11.2219 10.2425 10.3137C12.5858 7.93161 12.5858 4.06952 10.2425 1.68746L11.3208 0.591377Z"
						/>
					</svg>
				</button>
			</el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'FloatBtns',
	data() {
		return {
			isVisible: true,
			showComp: {maintab:true,totop:true,tutorial:true,createnew:true},
			scroll: '',
		}
	},
	computed: {
    dynamicClass() {
      // 根据当前路由或其他条件来计算动态类名
      return this.$route.meta.actived || 'SR';
    }
  },
	watch: {
   '$route'(to, _) {
      this.updateDynamicClass();
			if (to.path.includes('/backtester') || to.name == 'Backtests') {
				this.isVisible = true
			} 
			// else if(to.path.includes('/myindicator') || to.name ==  'MIList') {
			// 	this.isVisible = true
			// }
			 else {
				this.isVisible = false
			}

			if(to.path.includes('/myindicator') || to.name ==  'MIList') this.showComp = {maintab:false,totop:false,tutorial:true,createnew:false}
			else this.showComp = {maintab:true,totop:true,tutorial:true,createnew:true}
    },
    scroll: {
      handler(val) {
        try {
          if (typeof val == 'string') val = 360
          let toTop = document.getElementsByClassName('toTop')[0]
          let maintabBtn = document.getElementsByClassName('maintabBtnContainer')[0]
          if (val <= 600) {
            toTop.style.visibility = 'hidden'
          } else {
            toTop.style.visibility = 'visible'
          }
          if (val <= 350) {
            maintabBtn.style.visibility = 'hidden'
          } else {
            maintabBtn.style.visibility = 'visible'
          }
        } catch (err) { }
      },
      immediate: true,
      deep: true
    },
  },
  	mounted() {
		let toTop = document.getElementsByClassName('toTop')[0]
		toTop.style.visibility = 'hidden'
		let maintabBtn = document.getElementsByClassName('maintabBtnContainer')[0]
		maintabBtn.style.visibility = 'hidden'
		// When DOM renders data, set the height of the lower area to the height of the browser's visible area
		// Listen for the resize event of the window. Set the height of the lower area when the browser window changes
		const _this = this
		window.onscroll = function scroll() {
			_this.scroll =
				document.documentElement.scrollTop || document.body.scrollTop
		}
	},
	methods: {
		switchMainTab(subUrl) {
			// setup or list
			const url = `/backtester/${subUrl}`
			this.$router.push({
				path: url
			}),
			this.animationUp(650)
		},
		animationUp: function (ph) {
      window.scrollTo({
        top: ph,
        behavior: 'smooth'
      })
    },
	refreshPageTemp(){
      //this.$router.go(0)
	  this.$router.push('/backtester/').finally(()=>{location.reload()})
    },
	jumpToTutoiral(){
		let path
		if (this.$route.name == 'strategy') {

		} else if (this.$route.path.includes('/backtester')) {
			path = 'https://www.youtube.com/playlist?list=PL_pqMRWeHIxPgRS4tQryQ-efk2cNFf0hb'
		} else if (this.$route.name == 'scannerai' || this.$route.name == 'scannerai_chart') {

		} else if(this.$route.path.includes('myindicator') || this.$route.path.includes('MIList')){
			path = 'https://www.youtube.com/playlist?list=PL_pqMRWeHIxNvxaxmrJmLlzizXe38Is_d'
		} else if(this.$route.name == 'seasonality' || this.$route.name == 'seasonality'){

		}
        window.open(path, '_blank')
	},
		updateDynamicClass() {
      // 根据当前路由或其他条件来计算动态类名 // SR or LIST
      this.dynamicClass = this.$route.meta.actived || 'SR'
    },
	}
}
</script>

<style lang="less" scoped>
.maintabBtnContainer {
	position: fixed;
	left: 0px;
	bottom: 160px;
	z-index: 9999;
	> * {
		margin: 15px 0;
	}
	button.sidebar {
		width: 45px;
		height: 40px;
		border-radius: 0px 20px 20px 0px;
		border: 0;
		font-size: 0.6rem;
		font-weight: bold;
		background: #e1e1e1;
		color: #666666;
		font-family: Helvetica, sans-serif;
		cursor: pointer;
		transition: width 0.2s linear;
		&.activated {
			background: #5b9bd1;
			color: white;
		}
		&.refresh {
			border-radius: 21px;
			width: 40px;
			height: 40px;
			margin: 0 5px;
		}
		&:active {
			position: relative;
			top: 1px;
		}
		div {
			align-items: center;
		}
		span {
			white-space: nowrap;
			display: none;
		}
		&:hover {
			width: 229px;
			transition: width 0.2s linear;
		}
		&:hover span {
			white-space: nowrap;
			display: block;
		}
		&.refresh svg.sidebar_button_icon {
			float: none;
		}
		&.refresh:hover svg.sidebar_button_icon {
			float: left;
		}
		svg.sidebar_button_icon {
			float: left;
			margin: 0 5px 0 6px;
			width: 16px;
			height: 16px;
			fill: #666666;
		}
		&.activated svg.sidebar_button_icon {
			float: left;
			margin: 0 5px 0 6px;
			width: 16px;
			height: 16px;
			fill: white;
		}
	}
}
button.createNew,
.toTop,
.tutorial {
	// opacity: 0.4;
	/* larger than mask which is 9999 */
	z-index: 10000;
	border: unset;
	position: fixed;
	right: 60px;
	bottom: 63px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 42px;
	height: 42px;
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
	// background-color: #94989f;
	// background-color: #f59e0b;
	background-color: #fbc05c;
	// box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%),
	// 	0 10px 10px -5px rgb(0 0 0 / 4%);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
	svg.sidebar_button_icon {
		// float: left;
		// margin: 0 5px 0 6px;
		// width: 16px;
		// height: 16px;
		// fill:#666666;
	}
}
.toTop {
	background-color: #b8b9bb;
	bottom: 157px;
}
.tutorial {
	bottom: 110px;
    background: darksalmon;
}
.createNew:hover {
	background-color: #f59e0b;
	box-shadow: 0 6px 20px #f59e0b;
}
.toTop:hover {
	background-color: #94989f;
	box-shadow: 0 6px 20px #94989f;
}
.tutorial:hover {
	background-color: rgb(233, 111, 70);
	box-shadow: 0 6px 20px rgb(233, 111, 70);
}
.createNew_hint {
	position: fixed;
	right: 75px;
	bottom: 120px;
	border: 1px solid black;
	border-radius: 50%;
}
</style>