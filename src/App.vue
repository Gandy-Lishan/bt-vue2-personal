<template>
	<div id="app">
		<div class="home">
			<div class="home-container">
				<Header :svgCode="svgCode"></Header>
				<RecentUpdate
					class="recentlyUpdated"
					:isClosed="isClosed"
					@click="changeSvg"
			></RecentUpdate>
			<FloatBtns></FloatBtns>
			<div class="content-wrapper">
				<!-- <router-view v-slot="{ Component }"> -->
					<!-- <keep-alive> -->
						<!-- <component :is="Component" /> -->
					<!-- </keep-alive> -->
    <!-- </router-view> -->
		 <!-- <keep-alive> -->
			<router-view></router-view>
		 <!-- </keep-alive> -->
			</div>
				<Footer></Footer>
			</div>
		</div>
	</div>
</template>
<script>
import { Header, NewHeader, Footer, RecentUpdate, FloatBtns, CnNotify } from "@/components/common"
import { fetchCurrentNNotifications } from "@/service/service";

import { getCookieData } from "@/utils/cryptoUtils/cookie";
import Cookies from 'vue-cookies'
import axios from "./axios";
export default {
	name: 'app',
	data() {
		return {
			svgCode: '', // 显示 update 图标变化
   isClosed: false, // 点击显示 update 组件
			updateInterval: null
		}
	},
	components: {
		Header: NewHeader,
		Footer,
		RecentUpdate,
		FloatBtns,
		CnNotify
	},
	async mounted() {
		console.time("ai timer")
		console.time("bt timer")
		this.watchUpdate()

		this.getNotificationCount()

		/** pre-fetching and updating the data */
		if(window.location.pathname.includes('/backtester')) {
			// fetch all custom list
			this.preFetchData()
		}
		else if(
			window.location.pathname.includes('/myindicator') ||
			window.location.pathname.includes('/seasonality') ||
			window.location.pathname.includes('/cpm')
		) {
			// fetch symbol list only
			this.preFetchData(true)
		}
		
// debugger
		console.log('用户权限', getCookieData())
		const _this = this
		if(Cookies.get('sentimen_session')){
			try {
				
				const res = await axios.post('/dev/dev/user/', null, { timeout: 50000, withCredentials: true })
				// // 测试是否不堵塞首屏加载
				// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
				// await delay(10000);
				console.log('权限响应', res)
			} catch (error) {
				switch (error?.response?.status) {
				case 401:
				const errorMsg401 = 'No permission, please log in again'
				_this.$store.commit('states/setErrorMessage404', {
						status: 401,
						message: `${errorMsg401}`
					})
					break;
				case 403:
				const errorMsg403 = 'Authentication expired, please log in again'
				_this.$store.commit('states/setErrorMessage404', {
						status: 403,
						message: `${errorMsg403}`
					})
					break;
				case 404:
				const errorMsg404 = 'User does not exist, please log in again'
				_this.$store.commit('states/setErrorMessage404', {
						status: 404,
						message: `${errorMsg404}`
					})
					break;
				case 500:
				case 503:
				const errorMsg500 = 'The internal server is busy, please try again later'
				_this.$store.commit('states/setErrorMessage404', {
						status: 500,
						message: `${errorMsg500}`
					})
					break;
				default:
					break;
				}
				//_this.$router.push('/404')
			}
		}
		const email = getCookieData()?.username;
		const allowedUserList = ['jay@sentimentrader.com', 'dean@sentimentrader.com', 'jason@sentimentrader.com', 'hao@sentimentrader.com', 'jaclyn.wu@monicfinancial.com', 'eve@sentimentrader.com', 'jinjing@elixiroftechnology.com', 'shhenryw@gmail.com'];
		const userID = Cookies.get('devbt2Userid');
		let role = 'client';
		let isAdmin = false;

		if (allowedUserList.includes(email) || userID === 'analyst') {
				role = email === 'jaclyn.wu@monicfinancial.com' || email === 'eve@sentimentrader.com' || email === 'jinjing@elixiroftechnology.com' || email === 'shhenryw@gmail.com' ? 'client' : 'analyst';
				isAdmin = true;
		} else if (userID === 'system') {
				role = 'system';
				isAdmin = true;
		}
		this.$store.commit('user/SETUSERROLE', { 'is_admin': isAdmin, 'role': role, 'userID': email || userID });
		this.$store.commit('form/setBd', { 'user_tag': role});
		localStorage.setItem('role', role);
		localStorage.setItem('is_admin', isAdmin);

		// // 判断用户是否是首次进入
		// if (!localStorage.getItem("visited")) {
		// // 如果"visited"键不存在
		// this.svgCode = `<svg
		// 						width="18"
		// 						height="19"
		// 						viewBox="0 0 18 19"
		// 						fill="none"
		// 						xmlns="http://www.w3.org/2000/svg"
		// 					>
		// 						<path
		// 							d="M10.8188 16.0004C10.8188 16.5308 10.6081 17.0395 10.2331 17.4146C9.85799 17.7896 9.34928 18.0004 8.81885 18.0004C8.28841 18.0004 7.77971 17.7896 7.40463 17.4146C7.02956 17.0395 6.81885 16.5308 6.81885 16.0004H10.8188ZM13.8188 15.0004H2.91885C2.75972 15.0004 2.60711 14.9371 2.49458 14.8246C2.38206 14.7121 2.31885 14.5595 2.31885 14.4004C2.31885 14.2412 2.38206 14.0886 2.49458 13.9761C2.60711 13.8636 2.75972 13.8004 2.91885 13.8004H3.81885V10.0004C3.81885 7.58036 5.53885 5.56036 7.82385 5.10036C7.80989 4.96132 7.82523 4.82089 7.86888 4.68814C7.91253 4.55538 7.98352 4.43325 8.07727 4.32962C8.17102 4.22599 8.28545 4.14316 8.41318 4.08647C8.54091 4.02978 8.6791 4.00049 8.81885 4.00049C8.95859 4.00049 9.09679 4.02978 9.22452 4.08647C9.35225 4.14316 9.46668 4.22599 9.56043 4.32962C9.65418 4.43325 9.72516 4.55538 9.76881 4.68814C9.81246 4.82089 9.8278 4.96132 9.81385 5.10036C10.944 5.33023 11.9599 5.94354 12.6898 6.83648C13.4196 7.72941 13.8185 8.84711 13.8188 10.0004V13.8004H14.7188C14.878 13.8004 15.0306 13.8636 15.1431 13.9761C15.2556 14.0886 15.3188 14.2412 15.3188 14.4004C15.3188 14.5595 15.2556 14.7121 15.1431 14.8246C15.0306 14.9371 14.878 15.0004 14.7188 15.0004H13.8188Z"
		// 							fill="#96999F"
		// 						/>
		// 						<circle
		// 							cx="15.6763"
		// 							cy="3.00007"
		// 							r="2.28571"
		// 							fill="#EC4D4E"
		// 						/>
		// 					</svg>`
		// localStorage.setItem("visited", true);
    // }else{
		// 	this.svgCode = `<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		// 	<path d="M10.2446 13.0004C10.2446 13.5308 10.0339 14.0395 9.65884 14.4146C9.28377 14.7896 8.77506 15.0004 8.24463 15.0004C7.7142 15.0004 7.20549 14.7896 6.83041 14.4146C6.45534 14.0395 6.24463 13.5308 6.24463 13.0004H10.2446ZM13.2446 12.0004H2.34463C2.1855 12.0004 2.03289 11.9371 1.92036 11.8246C1.80784 11.7121 1.74463 11.5595 1.74463 11.4004C1.74463 11.2412 1.80784 11.0886 1.92036 10.9761C2.03289 10.8636 2.1855 10.8004 2.34463 10.8004H3.24463V7.00036C3.24463 4.58036 4.96463 2.56036 7.24963 2.10036C7.23567 1.96132 7.25101 1.82089 7.29466 1.68814C7.33831 1.55538 7.4093 1.43325 7.50305 1.32962C7.5968 1.22599 7.71123 1.14316 7.83896 1.08647C7.96669 1.02978 8.10488 1.00049 8.24463 1.00049C8.38437 1.00049 8.52257 1.02978 8.6503 1.08647C8.77803 1.14316 8.89246 1.22599 8.98621 1.32962C9.07996 1.43325 9.15095 1.55538 9.19459 1.68814C9.23824 1.82089 9.25359 1.96132 9.23963 2.10036C10.3697 2.33023 11.3857 2.94354 12.1155 3.83648C12.8454 4.72941 13.2443 5.84711 13.2446 7.00036V10.8004H14.1446C14.3038 10.8004 14.4564 10.8636 14.5689 10.9761C14.6814 11.0886 14.7446 11.2412 14.7446 11.4004C14.7446 11.5595 14.6814 11.7121 14.5689 11.8246C14.4564 11.9371 14.3038 12.0004 14.1446 12.0004H13.2446Z" fill="#96999F"/>
		// 	</svg>`
		// }
	},
	methods: {
		preFetchData(onlySymbol = false) {
			this.fetchCustomList(onlySymbol)
			this.updateInterval = setInterval(() => {
				this.fetchCustomList(onlySymbol);
			}, 300000); // Update every 5 minutes
		},
		async getNotificationCount() {
			const {notification_count} = await fetchCurrentNNotifications()
			var badge = document.getElementById('notifications-badge');
			if(!badge) return
			if (notification_count > 0) {
				badge.style.display = 'inline'; // 或 'block'，取决于你的布局需求
				badge.textContent = notification_count;
			} else {
				badge.style.display = 'none';
			}

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
		},
		watchUpdate() {
			window.addEventListener("onmessageUpdate", (res) => {
				console.log("🚀 ~ file: App.vue:20 ~ window.addEventListener ~ res:", res)
				let msg = res.detail.msg,
				version = res.detail.version

				sessionStorage.setItem('version', version) // 存入版本version
        		location.reload() // 刷新
				// this.$notify({
				// 	title: "New Update of Website Detected",
				// 	duration: 0,
				// 	position: "bottom-right",
				// 	dangerouslyUseHTMLString: true,
				// 	message: this.$createElement("CnNotify", {
				// 	// 使用自定义组件
				// 	ref: "CnNotify",
				// 	props: {
				// 		msg: msg,
				// 		version: version
				// 	},
				// 	}),
				// 	customClass:'versionNotifyStyle', //自定义类名
				// })
			})
  },
		fetchCustomList(onlySymbol) {
			console.log('🚗  update custom symbol list and indicator list')

			if(onlySymbol) {
				return Promise.all([
					this.$store.dispatch('chart/get_mysymbolist'),
				]);
			}
			else {
				return Promise.all([
				this.$store.dispatch('chart/get_mysymbolist'),
				this.$store.dispatch('chart/get_myindicator')
			]);
			}
		},
	beforeDestroy() {
		clearInterval(this.updateInterval);
	}
 }
}
</script>
<style lang="scss">
@import 'components/common/chart/st-development/css/normalize.css';
@import 'components/common/chart/st-development/css/page-defaults.css';
@import 'components/common/chart/st-development/css/stx-chart.css'; // Chart API
// @import 'components/common/chart/st-development/css/chartiq.css'; // Chart UI
@import 'components/common/chart/st-development/css/ST-chartiq.css';

a {
    color: #5b9bd1;
    text-decoration: none;
    transition: color .3s;
}
a:hover{
    color: #038cff;
}

#app {
		overflow-x: hidden;
		overflow-y: auto;
  font-family: "Open Sans",sans-serif;
}

#nprogress .bar {
	background: #2299ddcf !important;
	z-index: 99999 !important; 
	height: 10px !important; 
}
#nprogress .peg {
	background: rgb(34 153 221 / 34%) !important;
	width: 23px !important;
	box-shadow: 0 0 15px #29d, 0 0 10px #29d !important;
	transform: rotate(0deg) translate(0px, 0px) !important;
}
#nprogress .spinner {
  display: none !important;

}
.home {
//   display: flex;
//   flex-direction: column;
  min-height: 100vh; /* 设置容器最小高度为视窗高度，确保 footer 能够推到底部 */
}
.home-container {
	margin: 0 auto;
	background-color: #fff;
	//flex-grow: 1; /* 让内容占据剩余的空间，推动 footer 到底部 */
}
@media (min-width: 375px) and (max-width: 767px) {
	.home-container {
		width: 100%;
		margin: 0 auto;
	}
}
.navbar {
	height: 78px;
}
.recentlyUpdated {
	position: fixed;
	right: 0;
	top: 80;
	z-index: 9999;
}
.content-wrapper {
	min-height: 589px;
}
</style>
