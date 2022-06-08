import Vue from 'vue'
import Router from 'vue-router'
import cookies from 'vue-cookies'
import axios from '../axios'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { getIndicatorsList, getStocksList } from "@/service/service"
import store from '../store/store'
import https from 'https'

import { getCookieData, setCookieData } from '@/tools/cookie'
import { stringMap } from 'aws-sdk/clients/backup'
Vue.use(Router)
// 路由懒加载
// 懒加载即组件的延迟加载，通常vue的页面在运行后进入都会有一个默认的页面，而其他页面只有在点击后才需要加载出来。
// 使用懒加载可以将页面中的资源划分为多份，从而减少第一次加载的时候耗时
const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', redirect: '/home' },
		{ path: '/home', component: resolve => require(['@/components/BacktestEdge/Home.vue'], resolve) },
		{ path: '/doc', component: resolve => require(['@/components/Menu/Doc.vue'], resolve) }
	]
})
// router.beforeEach(async (to, from, next) => {
// 	// 从根源替换allSymbolList
// 	const res = await getIndicatorsList()
// 	let allSymbolsList = res.data
// 	const resStocks = await getStocksList()
// 	let stocksList = resStocks.data
// 	let newAllSymbolsList = []
// 	for(var i=0;i<allSymbolsList.length;i++){
// 		let item = allSymbolsList[i]
// 		if(stocksList.find(j=>j.stock==item.url)){
// 			let newName = item.url + ' Optix'
// 			newAllSymbolsList.push({
// 				chart_name: newName,
// 				url: item.url,
// 				updated: item.updated
// 			})
// 		}else{
// 			newAllSymbolsList.push(allSymbolsList[i])
// 		}
// 	}
	
// 	CIQ.store = store
// 	// 虽然用缓存了，但是还是用CIQ.indicatorList管理
// 	CIQ.indicatorList = newAllSymbolsList
// 	return next()
// })


router.beforeEach(async (to, from, next) => {
	// 从根源替换allSymbolList
	const res = await getIndicatorsList()
	let allSymbolsList = res.data
	const resStocks = await getStocksList()
	let stocksList = resStocks.data
	let newAllSymbolsList = []
	for(var i=0;i<allSymbolsList.length;i++){
		let item = allSymbolsList[i]
		if(stocksList.find(j=>j.stock==item.url)){
			let newName = item.url + ' Optix'
			newAllSymbolsList.push({
				chart_name: newName,
				url: item.url,
				updated: item.updated
			})
		}else{
			newAllSymbolsList.push(allSymbolsList[i])
		}
	}
	
	CIQ.store = store
	// 虽然用缓存了，但是还是用CIQ.indicatorList管理
	CIQ.indicatorList = newAllSymbolsList

	let loginUrl = 'https://users.sentimentrader.com/login'
	let formateHost = location.origin
	//测试网站 https://users.sentdevsite.com/login
	// https://backtest.sentimentrader.com/user?userID=668696
	// 1. 从访问过来的 url 获取到 userid
	// 2. 访问后端 api '/dev/user/?userid=668696' get 参数
	let userId
		let url = location.search
		userId = subURLstrToUserid(url, loginUrl, formateHost)

		let tmpStatus = postAxiosRequest(loginUrl, next
			
			
			
			
			
			
			
			
			
			
			)
		if (!tmpStatus){
			// 请求失败会进入这个分支
			tmpStatus = getAxiosRequest(userId, loginUrl, next)
			if (!tmpStatus){
				alert("request failed")
				window.location.href = loginUrl
			}
		}
	})


async function postAxiosRequest(loginUrl: string, next: any) {
	// 状态码,用于判断工作是否完成,成功为true,失败为false
	let status = true

	try{
		const data = getCookieData()
		let userId = data.account_code
	}catch(err){
		status = false
	}
	//默认15秒超时，不过会针对一些可能耗时请求单独处理(对于容易堵塞的请求在等待3秒后就重发)
	let res = await axios.post('/dev/user/',null,{timeout:3000})
	
	if (res.status === 200) {
		next()
		status = true
	}
	else if (res.status === 401) {
		//无权限
		status = false
		alert('No permission, please log in again')
		window.location.href = loginUrl

	}
	else if (res.status === 403) {
		//认证时间超时
		status = false
		alert('Authentication expired, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 404) {
		// 用户不存在
		status = false
		alert('User does not exist, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 500) {
		// 服务器错误
		status = false
		alert('Internal Server Error, please log in again')
		window.location.href = loginUrl
	}
	else {
		status = false
		console.log(res);
	}
	return status
}

async function getAxiosRequest(userId: string, loginUrl: string, next: any) {
	// 状态码,用于判断工作是否完成,成功为true,失败为false
	let status = true
	let res = await axios.get('/dev/user/?userid=' + userId)
	if (res.status === 200) {
		status = true
		next()
	}
	else if (res.status === 401) {
		//无权限
		status = false
		alert('No permission, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 403) {
		//认证时间超时
		status = false
		alert('Authentication expired, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 404) {
		// 用户不存在
		status = false
		alert('User does not exist, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 500) {
		// 服务器错误
		status = false
		alert('Internal Server Error, please log in again')
		window.location.href = loginUrl
	}
	else {
		status = false
		console.log(res);

	}
	return status

}

function subURLstrToUserid(url: string, loginUrl: string, formateHost: string) {
	let userId;
	if (url.indexOf("?") !== -1) {
		let paramsStr = url.substr(1)
		let paramsArr = paramsStr.split('=')
		userId = paramsArr[1]
		// 正式版旧版
		// cookies.set('userid',userId)
		cookies.set('devbt2Userid', userId)
		window.location.href = formateHost
	} else {
		// 正式版旧版
		// userId = cookies.get('userid')
		userId = cookies.get('devbt2Userid')
		console.log('进入querySring判断')
		if (!userId) {
			alert('Login failed, please log in again')
			window.location.href = loginUrl
			return
		}
	}
	return userId
}
export default router
