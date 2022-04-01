import Vue from 'vue'
import Router from 'vue-router'
import cookies from 'vue-cookies'
import axios from 'axios'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { getIndicatorsList } from "@/service/service"
import store from '../store/store'

import {getCookieData} from "@/tools/cookie"
import Home from '@/components/BacktestEdge/Home.vue'
Vue.use(Router)
const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', redirect: '/home' },
		{ path: '/home', component: Home }
	]
})

router.beforeEach(async (to, from, next) => {
	const res = await getIndicatorsList()
	console.log("进入路由的getAllSymbol请求", res);
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
	const data = getCookieData()
	console.log("测试cookie",data);
	// console.log('to from next',to, from, next);
	let loginUrl = 'https://users.sentdevsite.com/login'
		//  alert("asdasd")
		// https://backtest.sentimentrader.com/user?userID=668696
		// 1. 从访问过来的 url 获取到 userid
		// 2. 访问后端 api '/dev/user/?userid=668696' get 参数
		// 3. 根据返回状态码判断后续操作
        let userId = data.account_code
        if(!userId) {
            alert('Login failed, please log in again')
            window.location.href = loginUrl
            return
        }
		axios
			.get('/dev/user/?userid=' + userId)
			.then((res) => {
				if (res.status === 200) {
                    if(userId == res.data.userid) {
                        next()
                    }
				}
			})
			.catch((error) => {
				// next('https://users.sentdevsite.com/login')
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
			})
		// 3.1 200 成功设置 cookie userid=XXX endDate=XXX     cookie.set()
		// 3.2 403 代表认证时间超时，返回到登录页面
		// 3.3 404 表示用户不存在，返回到登录页面
		// next('')
	// cookies.set('userid','test')
	// next()
})
export default router
