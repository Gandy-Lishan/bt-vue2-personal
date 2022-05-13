import Vue from 'vue'
import Router from 'vue-router'
import cookies from 'vue-cookies'
import axios from 'axios'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { getIndicatorsList } from "@/service/service"
import store from '../store/store'
import https from 'https'

import { getCookieData, setCookieData } from '@/tools/cookie'
Vue.use(Router)
const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', redirect: '/home' },
		{ path: '/home', component: resolve => require(['@/components/BacktestEdge/Home.vue'], resolve) },
		{path: '/doc', component: resolve => require(['@/components/Menu/Doc.vue'], resolve)}
	]
})
router.beforeEach(async (to, from, next) => {
	const res = await getIndicatorsList()
			CIQ.store = store
			CIQ.indicatorList = res.data
			return next()
})
router.beforeEach((to, from, next) => {
	let loginUrl = 'https://users.sentimentrader.com/login'
	//测试网站 https://users.sentdevsite.com/login
		// https://backtest.sentimentrader.com/user?userID=668696
		// 1. 从访问过来的 url 获取到 userid
		// 2. 访问后端 api '/dev/user/?userid=668696' get 参数
		let userId
		try {
			userId = document.baseURI.split('?')[1]
			userId = userId.split('=')[1]
			axios
			.get('/dev/user/?userid=' + userId)
			.then((res) => {
				if (res.status === 200) {
						next()
				}
			})
			.catch((error) => {
				console.log(error)
				let status = error.response.status
				if (status === 401) {
					//无权限
					alert('No permission, please log in again')
					window.location.href = loginUrl
				}
				if (status === 403) {
					//认证时间超时
					alert('Authentication expired, please log in again')
					window.location.href = loginUrl
				}
				if (status === 404) {
					// 用户不存在
					alert('User does not exist, please log in again')
					window.location.href = loginUrl
				}
				if(status === 500) {
				// 服务器错误
				alert('Internal Server Error, please log in again')
				window.location.href = loginUrl
				}
				// next('https://users.sentdevsite.com/login')
			})
		} catch (error) {
			const data = getCookieData()
			userId = data.account_code
			axios
			.post('/dev/user/')
			.then((res) => {
				if (res.status === 200) {
						next()
				}
			})
			.catch((error) => {
				console.log(error)
				let status = error.response.status
				if (status === 401) {
					//无权限
					alert('No permission, please log in again')
					window.location.href = loginUrl
				}
				if (status === 403) {
					//认证时间超时
					alert('Authentication expired, please log in again')
					window.location.href = loginUrl
				}
				if (status === 404) {
					// 用户不存在
					alert('User does not exist, please log in again')
					window.location.href = loginUrl
				}
				if(status === 500) {
				// 服务器错误
				alert('Internal Server Error, please log in again')
				window.location.href = loginUrl
				}
				// next('https://users.sentdevsite.com/login')
			})
		}
		// 3. 根据返回状态码判断后续操作
		// 3.1 200 成功设置 cookie userid=XXX endDate=XXX     cookie.set()
		// 3.2 403 代表认证时间超时，返回到登录页面
		// 3.3 404 表示用户不存在，返回到登录页面

})
export default router
