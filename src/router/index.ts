import Vue from 'vue'
import Router from 'vue-router'
import cookies from 'vue-cookies'
import axios from 'axios'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { getIndicatorsList } from "@/service/service"
import store from '../store/store'
import https from 'https'

// import { getCookieData, setCookieData } from '@/tools/cookie'

// import Home from '@/components/BacktestEdge/Home.vue'
// import Doc from '@/components/Menu/Doc.vue'

Vue.use(Router)
const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', redirect: '/home' },
		{ path: '/home', component: resolve => require(['@/components/BacktestEdge/Home.vue'], resolve) },
		{path: '/doc', component: resolve => require(['@/components/Menu/Doc.vue'], resolve)}
	]
})

// todo XUE https
// router.beforeEach(async (to, from, next) => {
// 	let test = axios.create({httpsAgent: new https.Agent({ rejectUnauthorized: false})})
// 	const res = await test.get("https://10.131.8.20")
// 			console.log('test api',res)
// 			return next()
// })
router.beforeEach(async (to, from, next) => {
	const res = await getIndicatorsList()
			CIQ.store = store
			CIQ.indicatorList = res.data
			return next()
})
// 挂载路由导航守卫
// 路由导航守卫控制访问权限
// router.beforeEach((to, from, next) => {
// to代表将要访问的路径
// from表示从哪个路径跳转过来
// next是一个函数，表示放行 next()放行 next('/login')强制跳转的路径
// 获取token
//   if (to.path === '/login') return next()
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })
router.beforeEach((to, from, next) => {
	// let host = "/[a-z]*\.sentimentrader\.com/"/
	let host = /.*/
	// const data = getCookieData()
	// console.log("测试cookie",data);
	// const detail = {
	// 	security_response: 200,
	// 	username: 'eric+test12345678@ericbrown.com',
	// 	access_level: ['backtestedge', 'indicatoredge', 'sentimentedge'],
	// 	authorized: true,
	// 	session_expiration: '2022-04-01 02:51:48',
	// 	account_code: '22b610a4-de02-4d41-be1c-080b64dcb900'
	// }
	// const setData = setCookieData(detail, false)
	// console.log('设置cookie', setData)
	// console.log('to from next',to, from, next);
	let formateHost = location.origin
	let loginUrl = 'https://users.sentimentrader.com/login'
	//正式网站 https://users.sentimentrader.com/login
	//测试网站 https://users.sentdevsite.com/login
	if (document.baseURI.search(host) != -1) {
		//  alert("asdasd")
		// https://backtest.sentimentrader.com/user?userID=668696
		// 1. 从访问过来的 url 获取到 userid
		// 2. 访问后端 api '/dev/user/?userid=668696' get 参数
		let userId
		try {
			userId = document.baseURI.split('?')[1]
			userId = userId.split('=')[1]
			cookies.set('userid', userId)
			window.location.href = formateHost
		} catch (error) {
			userId = cookies.get('userid')
			if (!userId) {
				alert('Login failed, please log in again')
				window.location.href = loginUrl
				return
			}
		}
		// 3. 根据返回状态码判断后续操作
		axios
			.get('/dev/user/?userid=' + userId)
			.then((res) => {
				if (res.status === 200) {
					let oldUserid = cookies.get('userid')
					if (oldUserid == res.data.userid) {
						next()
					} else {
						cookies.set('userid', userId)
						next()
					}
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
		// 3.1 200 成功设置 cookie userid=XXX endDate=XXX     cookie.set()
		// 3.2 403 代表认证时间超时，返回到登录页面
		// 3.3 404 表示用户不存在，返回到登录页面
		// next('')
	} else {
		//  alert("asdasd");
		next()
		// window.location.href = loginUrl
	}
	// next()
})
export default router
