import Cookies from 'vue-cookies'
import { CIQ } from '@/components/common/chart/st-development/js'
import {
	getIndicatorsList,
	getStocksList,
	getIndexsList
} from '@/service/service'
import { getCurDate } from '@/service/ai'
import { getQueryVariable, LocalStorageUtil } from '@/utils'
import store from '../store'
import { uniqueObjectArray } from '@/utils/formValidate'

export function setRouterPermission(router) {
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
			if (getQueryVariable('userid'))
				Cookies.set('devbt2Userid', getQueryVariable('userid'))
		}
		// 当跳转携带 backtestID 时，填充
		const backtestID = getQueryVariable('backtestID')
		if (backtestID) LocalStorageUtil.set('backtestID', backtestID)
		// 当跳转携带 indicator 和 symbol 时，填充
		const indicator = getQueryVariable('indicator')
		const symbol = getQueryVariable('index')
		if (indicator) LocalStorageUtil.set('indicator', indicator)
		if (symbol) LocalStorageUtil.set('symbol', symbol)
		// 当有 sentimen_session 或 devbt2Userid 时才能发请求
	/* hao@sentimentrader.com */

		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHgCIpzJIACssjQOW7bWH20fpw0OiGw0poJIV2Nzvk3FamVv8Nu+OjDeax6/BPemIRtLvxe/ttdcR7ljhLshELegopMNz+YDb73aumgbPJjL/N9dHtRcLmiQd4obvi/ZBgpyj6lX3zBFTA1oLIF7vZgAKOAsuoRHWZg/asNtL34ZUNswnMAUy6RQmkXiJ4OJLqXEs5kLemATonJ2JQf58AXOkQsWfVDfi9glN+sw1OPlHwandKE6qHzWxlibvTrUJsc2kxd2+VDYPK3pbGUDUbPdXJVZ2LMZqRWYtzXS2E74ywV98NoJOBfmgihgC4xxI5toN6zORyAhX1wt5EUPbBETOMPwECWJY7Rs6uLvOIWKKjDxd+d4wkQhC3QvQ/7J+JVIQKetRSgsp2G7YS6ugW3+ncSCcdQoCfcFYziACDCJ8Q=='
		// )

		/* erichuerichu003@gmail.com */

		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHgvUwa2PVjPkzAS3Cz0RiOfAcWgdbigTrlPMz+1DPMqZHSm7Bdl9U+9skjq8uFG+9ZuaUSU2cw9b5fl3zG2qYLillioMh+Ulz6t0A+dyomkyUNJ6XNYMoabcQfANgH0a7eMNydR9q+MBrwrKdUPsSBrsxa7yWy7GjkPaKamQ1iBoLEaLpff7cjysFfFwKrMGmLst41vP91uvmWrOTWzTe6aYvYesQSMLyyQT9FI9l2zIpI3htq1+Qa/6nEA173jkQ4='
		// )

		/* jinjing@elixiroftechnology.com */
		
		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqd8Wla1zo7ruX/cgQVVp3cgiqt/9WkKuHREX8aSJJ7mIC5GdVbirl1MowfCqGmZZYzzI4zhAL3Tey6TKBM3fD8sQuB+8YvL4zUehmqhzcAjDFrvjhktk3srF6kAB1eQGEiittMsmMhei4TX0qrt3ikE+infhHI0oBeMXf2J2i4MGuYR9oHqqQdXsW7cP8mHT9hoXd/mPe4WcTSnfnn1EMOqqZ1DGIB+mkPCA7BHS101X0+7EhpzWwAhim49KNkKwWgittqf0Ajf1gZ6jpzeuonFlN3h7cvcnOxxdMvZ7z6YAJUfJEau0yk/rnUkZpgcrc2jSFQXro+DG3EJJw97+tc28+HDqkJTAcz/VHKF3tktUd+ptxMi7jqya/wCy5wSX9L0ZS2/UufwzXfwfNzG5dgcm4DxIjY+YvgmoBU7j8DibA=='
		// )

		
		/* he+PB@sentimentrader.com */
		
		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqdVL9w+9RqKgMsDueS5f+2BFVxWebii4op4cCMiPBV73opZm7ogud2q1OLV96pFi+2+qzE4/ILSnmDhqElkFHI9mmf8DAM5cVRNJpHMI+SAgSeYCrC1/ZAc/DA8PCWXfAHswmJVM3XAYt3b4R11bmMI5n6Oe8itQZrdJGhpScSBLKpvtC/NqBAqmJS64vRBjw3PSsocTeKkji+OWnUG6KTFfId4fRWpIj47FlICxoE7RlTeGfRB2V/0DX9ClNsjrConH9rNV/DYDrkV7ox9paOLt1OmTEJi9IRD4+m1XyegNNo/HfYmvnds6RrfnmiSVA0XRfVDUJ3AL85XnqbwFI5UzAFehCmLWvpBYFPC90z+y3p59/icLFt8cqDx93jum4YkxuSKBKnT0INUzBhSIfy5bnE9qbfh2NuqiGPTVBlitw=='
		// )

		/* jinjing@elixiroftechnology.com */

		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHhhO%2B65ptY8oR7y7M%2FpJ8xU36m3EyLuOrJr%2FALLnBJf0lgbQWWdLdd0Wv%2BcAjeN13qO%2FIZ4ifRX7V5OiD7gG4OoI4gNYu0rPJnWOFilqpB9nC7n36CeMNI%2BHVEIOu1VTV1kEZvcku30lgyE%2FmtKYbiBqW1e86SlvDZp9IHRs%2B320k6MnLj0JLfe7rVabhbVqNRIG5r5izjjRoQdsgngG7zLu866QkETfhWkAzRSlxtEWQIApWrhzBACdfQuSIockg%2B4CEOpbmRX6uhnR7LMtHm5lR8kRq7TKT%2BudSRmmBytzV2xBVSEvxkDNj4x%2F1cC6Q4bcyuhLXP8MNm9xNCFdp1l%2BWALb1ryZkuhMjQHhZfeWu1d5e5LWBVXPHGUA1TJZ7o%3D'
		// )

		if (Cookies.isKey('sentimen_session') || Cookies.isKey('devbt2Userid')) {
			//set 10 sec as default,However, some time-consuming requests are processed separately
			if (
				getQueryVariable('userid') ||
				getQueryVariable('backtestID') ||
				(getQueryVariable('index') && getQueryVariable('indicator'))
			) {
				window.location.href = location.origin
			}
			if (to.path == '/404') {
				// todo 再加一层scannerAI或者backtester权限判断，用于在404页面跳转回网站，或者防止网站跳到404又无限循环
				//next('/home')
				next()
			} else {
				// 放在这确保任何路由跳转都要先处理user请求保证权限先认证
				if (to.name == 'scannerai' || to.name == 'scannerai_chart') {
					await initiateCurrentDate()
					await initiateIndicatorList()
					store.dispatch('states/set_scannerai_flag', true)
				} else {
					await initiateIndicatorList()
					store.dispatch('states/set_scannerai_flag', false)
				}
				next()
			}
		} else {
			//alert('No permission')
			//window.location.href = loginUrl
			// 这里是判断无cookie情况下进入登录界面，如果是从404

			if (to.path != '/404') {
				store.commit('states/setErrorMessage404',{status:401,message:null})
				next({
					path: '/404'
				})
			} else {
				next()
			}
		}
	})
}
async function initiateCurrentDate() {
	//现在外部实现一个获取当前日期并储存的功能，接触验证屏蔽后移到判断条件内部
	//if(store.state.chart.curDate==''){
	// getCurDate().then(async(res)=>{
	// 	let curDate =res['LastUpdatePickDate']
	// 	await store.dispatch('chart/set_cur_date',curDate).then(() => {console.log('set curdate',curDate)})
	// }).catch(error=>{
	// 	router.push({
	// 		path: '/404',
	// 		query: { mes: error?.response?.status , desc: ' the ScannerAI Page'}
	// 	})
	// })
	//}

	// todo 暂时用于权限验证，所以不判断缓存并跳过请求
	let _res = await getCurDate()
	let curDate = _res['LastUpdatePickDate']
	await store.dispatch('chart/set_cur_date', curDate).then(() => {
		console.log('set curdate', curDate)
	})
}

async function initiateIndicatorList() {
	// at the very first beginning, replace all stock name in AllSymbolList with stock name + 'optix'
	// 这个数据基本不会变，存起来
	if (
		store.state.chart.indicatorsList.length == 0 ||
		store.state.chart.stocksList.length == 0 ||
		store.state.chart.indexsList.length == 0
	) {
		const res = await getIndicatorsList()
		let allSymbolsList = uniqueObjectArray(res.data)
		const resStocks = await getStocksList()
		let stocksList = resStocks.data
		store.commit('chart/getStocksList', stocksList)
		const resIndexs = await getIndexsList()
		let indexsList = resIndexs.data
		store.commit('chart/getIndexsList', indexsList)

		let newAllSymbolsList = []
		for (var i = 0; i < allSymbolsList.length; i++) {
			let item = allSymbolsList[i]
			if (stocksList.find(j => j.stock == item.url)) {
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
		store.commit('chart/getIndicatorsList', newAllSymbolsList)
	}
}

