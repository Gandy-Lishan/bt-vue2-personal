/**
 *	2.2.0
 *	Vue router
 */
import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'vue-cookies'
import axios from '../axios'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import { getIndicatorsList, getStocksList, getIndexsList } from "@/service/service"
import { getCurDate } from '@/service/ai'
import getQueryVariable from '@/tools/getQueryVariable'
import store from '../store/store'

Vue.use(Router)
// Route lazy loading
// Lazy loading is lazy loading of components. Usually vue pages will have a default page when entered after running, while other pages need to be loaded only after clicking.
// Lazy loading can be used to divide the resources on the page into multiple portions, thus reducing the first load time

const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', redirect: '/home' },
		{
			path: '/home', component: resolve => require(['@/components/BacktestEdge/index.vue'], resolve),
			redirect: '/home/backtester',
			children: [
				{
					path: 'backtester', name: 'backtester', component: resolve => require(['@/components/BacktestEdge/Home.vue'], resolve),
					children: [
						{
							path: 'brainstorm', name: 'brainstorm', component: resolve => require(['@/components/BacktestEdge/Brainstorm/index.vue'], resolve), 
							redirect: '/home/backtester/brainstorm/exit_with_custom_TIM_frame', 
							children: [
								{ path: 'exit_with_custom_TIM_frame', name: 'ExitWithCustomTIMFrame', component: resolve => require(['@/components/BacktestEdge/Brainstorm/ExitWithCustomTIMFrame.vue'], resolve) },
							]
						},
						{ path: 'strategy', name: 'strategy', component: resolve => require(['@/components/BacktestEdge/Strategy.vue'], resolve) },
						{ path: 'backtests', name: 'Backtests', component: resolve => require(['@/components/BacktestEdge/Backtests.vue'], resolve), },
					]
				},
				{
					path: 'scannerai',
					component: resolve => require(['@/components/BacktestEdge/AIScanner/index.vue'], resolve),
					children: [
						{
							path: '',
							name: 'scannerai',
							component: resolve => require(['@/components/BacktestEdge/AIScanner/AIScanner.vue'], resolve),
						},
						{
							path: 'scannerai_chart', 
							name: 'scannerai_chart', 
							component: resolve => require(['@/components/BacktestEdge/AIScanner/ScannerChart/index.vue'], resolve)
						}
					]}
				,
			]
		},
		{ path: '/doc', component: resolve => require(['@/components/Menu/Doc.vue'], resolve), redirect: '/doc/home',
    	children: [
        {path: '/doc/home',  component: resolve => require(['@/components/Menu/components/Doc.vue'], resolve)},
        {path: '/doc/guide/:id',  component: resolve => require(['@/components/Menu/components/Guide.vue'], resolve)},
        {path: '/doc/scanner',  component: resolve => require(['@/components/Menu/components/AIScanner.vue'], resolve)},
        { path: '/doc/old', component: resolve => require(['@/components/Menu/old_doc.vue'], resolve) },
				{path: '/doc/disclaimer', component: resolve => require(['@/components/Menu/components/Disclaimer.vue'], resolve) }
      ]},
	]
})

router.beforeEach(async (to, from, next) => {
	await initiateIndicatorList()
	if(to.path == '/home/scannerai'){
		await initiateCurrentDate()
	}
	
	CIQ.store = store
	let loginUrl = 'https://sentimentrader.com/login'
	//  开发环境无法判断环境变量
	// if(process.env.ST_ENV === "dev" || process.env.ST_ENV === undefined) loginUrl = 'https://sentdevsite.com/login'
	// 先判断有无 sentimen_session
	if (Cookies.isKey('sentimen_session')) {
		// 删除 devbt2Userid
		Cookies.remove('devbt2Userid')
	} else {
		// 判断 url 有无 userid
		if (getQueryVariable('userid')) Cookies.set('devbt2Userid', getQueryVariable('userid'))
	}
	// 当有 sentimen_session 或 devbt2Userid 时才能发请求
	if (Cookies.isKey('sentimen_session') || Cookies.isKey('devbt2Userid')) {
		//set 10 sec as default,However, some time-consuming requests are processed separately
		axios.post('/dev/dev/user/', null, { timeout: 10000, withCredentials: true })
			.then((res) => {
				console.log('lishan res', res)
				if (res.status == 200) {
					store.commit('setUserRole', { 'is_admin': res.data.is_admin, 'role': res.data.userid })
					if (getQueryVariable('userid')) window.location.href = location.origin // 去掉？后面的部分
					next()
				} else { throw Error('Status code error') }
			})
			.catch((error) => {
				console.error(error)
				switch (error?.response?.status) {
					case 401:
						alert('No permission')
						break;
					case 403:
						alert('Authentication expired')
						break;
					case 404:
						alert('User does not exist')
						break;
					case 500:
						alert('Internal Server Error')
						break;
					case 410:
						alert('User permission does not exist')
					default:
						alert('Unknown error')
				}
				window.location.href = loginUrl
			})
	} else {
		alert('No permission')

		window.location.href = loginUrl
	}
})

async function initiateCurrentDate() {
	//现在外部实现一个获取当前日期并储存的功能，接触验证屏蔽后移到判断条件内部
	if(store.state.curDate==''){
		let _res = await getCurDate()
		let curDate =_res['LastUpdatePickDate']
		await store.dispatch('set_cur_date',curDate).then(() => {console.log('set curdate',curDate)})
	}
}

async function initiateIndicatorList() {
	// at the very first beginning, replace all stock name in AllSymbolList with stock name + 'optix'
	const res = await getIndicatorsList()
	let allSymbolsList = res.data
	const resStocks = await getStocksList()
	let stocksList = resStocks.data
	store.commit('getStocksList', stocksList)
	const resIndexs = await getIndexsList()
	let indexsList = resIndexs.data
	store.commit('getIndexsList', indexsList)

	let newAllSymbolsList = []
	for (var i = 0; i < allSymbolsList.length; i++) {
		let item = allSymbolsList[i]
		if (stocksList.find((j) => j.stock == item.url)) {
			let newName = item.url + ' Optix'
			newAllSymbolsList.push({
				chart_name: newName,
				url: item.url,
				updated: item.updated
			})
		} else {
			newAllSymbolsList.push(allSymbolsList[i])
		}
	}
	// still use CIQ.indicatorList to store filtered allSymbolsList even used local cache
	CIQ.indicatorList = newAllSymbolsList
}


export default router