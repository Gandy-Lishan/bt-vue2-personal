/**
 *	2.2.0
 *	customized axios.js for local cache setup
 */
import axios from 'axios'
import Cache from './cache'
import store from '@/store'

// Custom instances of Axios
let instance = axios.create({
	baseURL: ''
})

//set 10 sec as default,However, some time-consuming requests are processed separately
//instance.defaults.timeout = 30000;
// //define the global retry count in main.js
// instance.defaults.retry = 4;
// instance.defaults.retryDelay = 1000;

// request interceptor
instance.interceptors.request.use(
	config => {
		config.headers.Authorization = window.sessionStorage.getItem('token')
		config.auth = {
			username: 'sentimentrader_backtest_api',
			password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
		}
		console.log('请求开始，打开遮罩层......', config.url)
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
		console.log('报错了。。。。', err)
		store.commit('form/SET_LIST_LOADING', false)
		store.commit('form/SET_SETUP_LOADING', {
			isSetupLoading: false,
			percentage: 0,
			progressText: ''
		})
		// 取消权限控制
		// if (err?.response?.status == 410) {
		// 	if(store.state.states.backtesterAuthorized){
		// 		store.commit('states/setShowScannerAILink',false)
		// 		return Promise.reject(err);
		// 	}
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

		if (err?.response?.status == 404) {
			console.log('url 找不到')
			// 明确返回一个 rejected 的 Promise，以避免重试
			return Promise.reject(err)
		}

		// 不执行重试逻辑，直接将错误传递给.catch()处理程序
		return Promise.reject(err)
	}
)

let cache = new Cache(axios) // pass current axios to Cache
cache.use({
	expire: 3600000 * 24 * 7, // default timeout period, 7 days
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
