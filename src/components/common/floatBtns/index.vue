<template>
  <div>
    
    <div class="maintabBtnContainer">
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
				content="Back to the top"
				placement="bottom"
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
				content="Create New Backtest"
				placement="bottom"
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
	computed: {
    dynamicClass() {
      // 根据当前路由或其他条件来计算动态类名
      return this.$route.meta.actived || 'SR';
    }
  },
	watch: {
    '$route'(to, from) {
      this.updateDynamicClass();
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
      this.$router.go(0)
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
	z-index: 999;
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
.toTop {
	// opacity: 0.4;
	z-index: 999;
	border: unset;
	position: fixed;
	right: 60px;
	bottom: 63px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
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
	bottom: 110px;
}
.createNew:hover {
	background-color: #f59e0b;
	box-shadow: 0 6px 20px #f59e0b;
}
.toTop:hover {
	background-color: #94989f;
	box-shadow: 0 6px 20px #94989f;
}
.createNew_hint {
	position: fixed;
	right: 75px;
	bottom: 120px;
	border: 1px solid black;
	border-radius: 50%;
}
</style>