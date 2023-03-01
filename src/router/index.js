/**
 *	2.2.0
 *	Vue router
 */
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
// Route lazy loading
// Lazy loading is lazy loading of components. Usually vue pages will have a default page when entered after running, while other pages need to be loaded only after clicking.
// Lazy loading can be used to divide the resources on the page into multiple portions, thus reducing the first load time

const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', redirect: '/home' },
		{ path: '/home', component: resolve => require(['@/components/BacktestEdge/Home.vue'], resolve) },
		{ path: '/doc', component: resolve => require(['@/components/Menu/Doc.vue'], resolve) }
		// { path: '/home', component: () => import(/* webpackChunkName: "Home" */ "@/components/BacktestEdge/Home.vue") },
		// { path: '/doc', component: () => import(/* webpackChunkName: "Doc" */ "@/components/Menu/Doc.vue") }
	]
})

router.beforeEach(async (to, from, next) => {
	// at the very first beginning, replace all stock name in AllSymbolList with stock name + 'optix'
	const res = await getIndicatorsList()
	let allSymbolsList = res.data
	const resStocks = await getStocksList()
	let stocksList = resStocks.data
	let newAllSymbolsList = []
	for(var i=0;i<allSymbolsList.length;i++){
		let item = allSymbolsList[i]
		if(stocksList.find((j)=>j.stock==item.url)){
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
	// still use CIQ.indicatorList to store filtered allSymbolsList even used local cache
	CIQ.indicatorList = newAllSymbolsList

	let loginUrl = 'https://users.sentimentrader.com/login'
	let formateHost = location.origin
	//website for testing https://users.sentdevsite.com/login
	// https://backtest.sentimentrader.com/user?userID=668696
	// 1. get the userid from url
	// 2. call axios get method to '/dev/user/?userid=668696'
	// let userId
	// let url = location.search
	// userId = subURLstrToUserid(url, loginUrl, formateHost)

	
	// let tmpStatus = postAxiosRequest(loginUrl, next)
	// if (!tmpStatus){
	// 	// handle error response
	// 	tmpStatus = getAxiosRequest(userId, loginUrl, next)
	// 	if (!tmpStatus){
	// 		alert("request failed")
	// 		window.location.href = loginUrl
	// 	}
	// }
	cookies.set('userid','test')
	next()
})


async function postAxiosRequest(loginUrl, next) {
	// Status code, used to determine whether the work is complete. The value is true for success and false for failure
	let status = true

	try{
		const data = getCookieData()
		let userId = data.account_code
	}catch(err){
		status = false
	}
	//set 10 sec as default,However, some time-consuming requests are processed separately
	let res = await axios.post('/dev/user/',null,{timeout:10000, withCredentials: true})
	
	if (res.status === 200) {
		next()
		status = true
	}
	else if (res.status === 401) {
		//not authorized 
		status = false
		alert('No permission, please log in again')
		window.location.href = loginUrl

	}
	else if (res.status === 403) {
		//timeout
		status = false
		alert('Authentication expired, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 404) {
		// user does not exist
		status = false
		alert('User does not exist, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 500) {
		// server error
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

async function getAxiosRequest(userId, loginUrl, next) {
	try {
			// Status code, used to determine whether the work is complete. The value is true for success and false for failure
	let status = true
	let res = await axios.get('/dev/user/?userid=' + userId, {withCredentials: true})
	if (res.status === 200) {
		status = true
		next()
	}
	else if (res.status === 401) {
		//not authorized 
		status = false
		alert('No permission, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 403) {
		//timeout
		status = false
		alert('Authentication expired, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 404) {
		// user does not exist
		status = false
		alert('User does not exist, please log in again')
		window.location.href = loginUrl
	}
	else if (res.status === 500) {
		// server error
		status = false
		alert('Internal Server Error, please log in again')
		window.location.href = loginUrl
	}
	else {
		status = false
		console.log(res);

	}
	return status
		
	} catch (error) {
		// server error
		status = false
		alert('Internal Server Error, please log in again')
		window.location.href = loginUrl
	}

}

function subURLstrToUserid(url, loginUrl ,formateHost) {
	let userId;
	if (url.indexOf("?") !== -1) {
		let paramsStr = url.substr(1)
		let paramsArr = paramsStr.split('=')
		userId = paramsArr[1]
		// cookies.set('userid',userId)
		cookies.set('devbt2Userid', userId)
		window.location.href = formateHost
	} else {
		// userId = cookies.get('userid')
		userId = cookies.get('devbt2Userid')
		if (!userId) {
			alert('Login failed, please log in again')
			window.location.href = loginUrl
			return
		}
	}
	return userId
}

export default router
