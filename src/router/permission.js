import Cookies from 'vue-cookies'
import axios from '../axios'
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
const uniqWith = require('lodash/uniqWith')
const isEqual = require('lodash/isEqual')

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

		Cookies.set(
			'sentimen_session',
			'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHgCIpzJIACssjQOW7bWH20fpw0OiGw0poJIV2Nzvk3FamVv8Nu+OjDeax6/BPemIRtLvxe/ttdcR7ljhLshELegopMNz+YDb73aumgbPJjL/N9dHtRcLmiQd4obvi/ZBgpyj6lX3zBFTA1oLIF7vZgAKOAsuoRHWZg/asNtL34ZUNswnMAUy6RQmkXiJ4OJLqXEs5kLemATonJ2JQf58AXOkQsWfVDfi9glN+sw1OPlHwandKE6qHzWxlibvTrUJsc2kxd2+VDYPK3pbGUDUbPdXJVZ2LMZqRWYtzXS2E74ywV98NoJOBfmgihgC4xxI5toN6zORyAhX1wt5EUPbBETOMPwECWJY7Rs6uLvOIWKKjDxd+d4wkQhC3QvQ/7J+JVIQKetRSgsp2G7YS6ugW3+ncSCcdQoCfcFYziACDCJ8Q=='
		)
		if (Cookies.isKey('sentimen_session') || Cookies.isKey('devbt2Userid')) {
			//set 10 sec as default,However, some time-consuming requests are processed separately
			if (
				getQueryVariable('userid') ||
				getQueryVariable('backtestID') ||
				(getQueryVariable('index') && getQueryVariable('indicator'))
			)
				window.location.href = location.origin // 去掉？后面的部分
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
		const sentimentList = res.data.map(element => {
			return {
				value: element.chart_name,
				url: element.url,
				updated: element.updated
			}
		})
		store.commit('chart/getSentimentList', sentimentList)
		let allSymbolsList = uniqueObjectArray(res.data)
		const resStocks = await getStocksList()
		let stocksList = resStocks.data
		store.commit('chart/getStocksList', stocksList)
		const resIndexs = await getIndexsList()
		let indexsList = resIndexs.data
		store.commit('chart/getIndexsList', indexsList)

		let symbolsList = stocksList.concat(indexsList)
		symbolsList = uniqWith(symbolsList, isEqual)

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
		LocalStorageUtil.set('indicatorList', newAllSymbolsList)
		LocalStorageUtil.set('symbolsList', symbolsList)
	}
}
