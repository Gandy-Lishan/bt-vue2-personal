/**
 *	2.2.0
 *	customized axios.js for local cache setup
 */
import axios from 'axios'
import Cache from './cache'
import store from '@/store'
import _this from "@/main";

// Custom instances of Axios
let instance = axios.create({
	baseURL: ''
})

//set 10 sec as default,However, some time-consuming requests are processed separately
// instance.defaults.timeout = 15000;
// //define the global retry count in main.js

// 默认重试次数
instance.defaults.retry = 2;
// instance.defaults.retryDelay = 1000;

// request interceptor
instance.interceptors.request.use(
	config => {
		config.headers.Authorization = window.sessionStorage.getItem('token')
		
		config.auth = {
			username: 'sentimentrader_backtest_api',
			password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
		}
		console.log('请求开始，打开遮罩层......', config)
		// 限制哪些请求需要打开遮罩层
		// /dev/backtest /dev/analyst /dev/strategy
		const allowedListUrl = ['backtest', 'analyst', 'strategy']
		const isAllowedUrl = allowedListUrl.some(item => config.url.includes(item))
		if (isAllowedUrl) store.commit('form/SET_LIST_LOADING', true)
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// retry the request(for handling request error or timeout)
// instance.interceptors.response.use(
// 	response => {
// 		console.log('请求完成拦截器.....response', response)
// 		// 这里不需要判断 直接关遮罩层
// 		store.commit('form/SET_LIST_LOADING', false)
// 		return response
// 	},
// 	function interceptor(err) {
// 		console.log('报错了。。。。', err)
// 		store.commit('form/SET_LIST_LOADING', false)
// 		if (err?.response?.status == 410) {
// 			const desc =
// 				err.response.config.url.indexOf('ai_scanner') == -1
// 					? ' Backtester page'
// 					: ' ScannerAi page'
// 			window.location.href = '/404?mes=' + err.response.status + '&desc=' + desc
// 			// router.push({
// 			//   path: '/404',
// 			//   query: { mes: err.response.status } // 携带的参数
// 			// });
// 			return Promise.reject(err)
// 		}
// 		if (err?.response?.status == 404) {
// 			console.log('url 找不到')
// 			return Promise.reject(err)
// 		}

// 		var config = err.config
// 		// If config does not exist or the retry option is not set, reject
// 		if (!config || !config.retry) return Promise.reject(err)

// 		// Set the variable for keeping track of the retry count
// 		config.__retryCount = config.__retryCount || 0

// 		// Check if we've maxed out the total number of retries
// 		if (config.__retryCount >= config.retry) {
// 			// Reject with the error
// 			console.error('timeout! ', config.url)
// 			alert('request timeout, please refresh the page')
// 			location.reload()
// 			return Promise.reject(err)
// 		}

// 		// Increase the retry count
// 		config.__retryCount += 1

// 		// Create new promise to handle exponential backoff
// 		var backoff = new Promise(function(resolve) {
// 			setTimeout(function() {
// 				resolve()
// 			}, config.retryDelay || 1)
// 		})

// 		// Return the promise in which recalls axios to retry the request
// 		return backoff.then(function() {
// 			console.log('retry the request...')
// 			return axios(config)
// 		})
// 	}
// )

instance.interceptors.response.use(
	response => {
		console.log('请求完成拦截器.....response', response)
		// 这里不需要判断，直接关闭遮罩层
		store.commit('form/SET_LIST_LOADING', false)
		return response
	},
	function interceptor(err) {
		// 请求失败，进行重试
		const config = err.config;
		if (!config || !config.retry) return Promise.reject(err);

		config.retryCount = config.retryCount || 0;
		if (config.retryCount >= config.retry) {
			// 达到最大重试次数，直接返回错误
			console.log('报错了。。。。', err)
			const url = err?.config?.url
			console.log('错误的URL：', url)
			const allowedListUrl = ['backtest', 'analyst', 'strategy', 'upload', 'runbt']
			const isAllowedUrl = allowedListUrl.some(item => url?.includes(item))
			if (isAllowedUrl) {
				store.commit('form/SET_LIST_LOADING', false);
				store.commit('form/SET_SETUP_LOADING', {
					isSetupLoading: false,
					showProgress: false,
					percentage: 0,
					progressText: ''
				})
			}
	
			// 取消权限控制
			// if (err?.response?.status == 410) {
			// 	try{
			// 		const desc = err.response.config.url.indexOf('ai_scanner')==-1?' Backtester services':' ScannerAi services'
			// 		store.commit('states/setErrorMessage404',{status:err.response.status,message:desc})
			// 		router.push("/404")
			// 	}catch(error){
			// 		// 如果返回的属性不全，比如测试请求返回里只存在response.status
			// 		store.commit('states/setErrorMessage404',{status:err.response.status,message:''})
			// 		router.push("/404")
			// 	}
			// 	return Promise.reject(err)
			// }
			// 如果用户接口报错, 直接返回错误
			if(url.includes('/user')) return Promise.reject(err)
			switch (err?.response?.status) {
				case 401:
					_this.popUpMsgBox('No permission')
					break;
				case 403:
					_this.popUpMsgBox('Save failed: Duplicate name or insufficient permissions')
					break;
				case 404:
					console.log('url 找不到,独自处理')
					break;
				case 410:
					_this.popUpMsgBox('Backtest is not purchased')
					break;
				case 503:
					_this.popUpMsgBox('The internal server is busy, please try again later')
					break;
				default:
					break;
			}
	
			// 不执行重试逻辑，直接将错误传递给.catch()处理程序
			return Promise.reject(err)
		}

		config.retryCount++;

		// 创建新的 Promise 来进行重试
		return new Promise((resolve) => {
			console.log('请求失败，正在进行重试...')
			setTimeout(() => resolve(instance(config)), config.retryDelay || 0);
		});
	}
)

let cache = new Cache(axios) // pass current axios to Cache
cache.use({
	expire: 3600000 * 1 * 1, // default timeout period, 7 days
	storage: true,
	instance,
	requestConfigFn: config => {
		// customized request interceptor
		// if (config.header) {
		//   config.header.token = 'i am token'
		// } else {
		//   config.header = { token: 'i am token' }
		// }
		// need to return the Config object through the Promise cache. You can also use the new Promise notation
		return Promise.resolve(config)
	},
	responseConfigFn: res => {
		// customized response interceptor
		if (!res.data || !res.data.code) {
			// need to return the Config object through the Promise cache. You can also use the new Promise notation
			return Promise.resolve(res)
		}
	}
})

export default instance
