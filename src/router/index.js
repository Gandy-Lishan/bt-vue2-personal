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
						// { path: 'chat', name: 'Chat', component: resolve => require(['@/components/BacktestEdge/Chat.vue'], resolve), },
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
	  { path: '/404', component: resolve => require(['@/components/404.vue'], resolve)},
	]
})

router.beforeEach(async (to, from, next) => {
	// 如果跳入404，则直接进入跳转外链的待定阶段，没有其他cookie或者验证判断(准备弃用，因为登录后或者购买后404应该重新验证并跳转)
	//if(to.path == "/404") next()
	
	CIQ.store = store
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

	//Cookies.set('sentimen_session', 'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHgCIpzJIACssjQOW7bWH20fpw0OiGw0poJIV2Nzvk3Fagvvi8jor+gaZaFZdBZwr8dzDEnzXTHSvpE+r12+VM25ToycuPQkt97utVpuFtWo1MCeEyON1QPkFA6suPxEVy8Whaj01x4oo9U/3dfNy9RY+PPLBh0IReWlHKWiDziortiuJXZZ1xi0lq9R6vfCbfzwdn0M5UK2SWWDAoPkFHOsNCY7h8ZakkGtYk91wYY5nDaTF3b5UNg8relsZQNRs91clVnYsxmpFZi3NdLYTvjLBX3w2gk4F+aCKGALjHEjm9lkuSwK+nG44FW6fl7zWw84w/AQJYljtGzq4u84hYoqMPF353jCRCELdC9D/sn4lUhAp61FKCynYbthLq6Bbf4NCQAh9+xvvctTMFcqAnpJga+GfTHJCqyPdnmYvbKiTQ==')
	if (Cookies.isKey('sentimen_session') || Cookies.isKey('devbt2Userid')) {
			//set 10 sec as default,However, some time-consuming requests are processed separately
			axios.post('/dev/dev/user/', null, { timeout: 50000, withCredentials: true })
				.then(async(res) => {
					console.log('lishan res', res)
					if (res.status == 200) {
						store.commit('setUserRole', { 'is_admin': res.data.is_admin, 'role': res.data.userid })
						if (getQueryVariable('userid')) window.location.href = location.origin // 去掉？后面的部分

						if(to.path == '/404'){
							// todo 再加一层scannerAI或者backtester权限判断，用于在404页面跳转回网站，或者防止网站跳到404又无限循环
							//next('/home')
							
							next()
						}else{
							// 放在这确保任何路由跳转都要先处理user请求保证权限先认证
							if(to.name == 'scannerai' || to.name == 'scannerai_chart'){
								await initiateCurrentDate()
								await initiateIndicatorList()
								store.dispatch('set_scannerai_flag',true)
							}else{
								await initiateIndicatorList()
								store.dispatch('set_scannerai_flag',false)
							}
							next()
						}		
					} else { throw Error('Status code error') }
				})
				.catch((error) => {
					console.error(error)
					router.push({
						path: '/404',
						query: { mes: error?.response?.status } // 携带的参数
					});
				})

			// if(to.path == '/404'){
			// 	//next('/home')
			// 	next()
			// }else{
			// 	// 放在这确保任何路由跳转都要先处理user请求保证权限先认证
			// 	if(to.name == 'scannerai' || to.name == 'scannerai_chart'){
			// 		await initiateCurrentDate()
			// 		await initiateIndicatorList()
			// 		store.dispatch('set_scannerai_flag',true)
			// 	}else{
			// 		await initiateIndicatorList()
			// 		store.dispatch('set_scannerai_flag',false)
			// 	}
				
			// 	next()
			// }

	} else {
		//alert('No permission')
		//window.location.href = loginUrl
		// 这里是判断无cookie情况下进入登录界面，如果是从404
		
		if(to.path != '/404'){
			console.log('to',to)
			next({
				path: '/404',
				query: { mes: 401 } // 携带的参数
			});
		}else{
			next()
		}
		
	}
})

async function initiateCurrentDate() {
	//现在外部实现一个获取当前日期并储存的功能，接触验证屏蔽后移到判断条件内部
	//if(store.state.curDate==''){
		// getCurDate().then(async(res)=>{
		// 	let curDate =res['LastUpdatePickDate']
		// 	await store.dispatch('set_cur_date',curDate).then(() => {console.log('set curdate',curDate)})
		// }).catch(error=>{
		// 	router.push({
		// 		path: '/404',
		// 		query: { mes: error?.response?.status , desc: ' the ScannerAI Page'}
		// 	})
		// })
	//}  
	
	// todo 暂时用于权限验证，所以不判断缓存并跳过请求
		let _res = await getCurDate()
		let curDate =_res['LastUpdatePickDate']
		await store.dispatch('set_cur_date',curDate).then(() => {console.log('set curdate',curDate)})
}

async function initiateIndicatorList() {
	console.log('initiateIndicatorList')
	// at the very first beginning, replace all stock name in AllSymbolList with stock name + 'optix'
	if(store.state.stocksList.length==0 || store.state.indexsList.length==0){
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
}


export default router