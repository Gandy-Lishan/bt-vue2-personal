import axios from '../axios'
import { uniqueObjectArray } from '@/utils/formValidate'
import { transformChangedKey } from '@/utils/globalFunc'
import * as mqs from 'qs'
import moment from 'moment';


function get_env(name, value) {
	if (process.env[name] === undefined) {
		return value
	}
	return process.env[name]
}
const author = {
	username: 'sentimentrader_backtest_api',
	password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
}
export function getIndicatorsList() {
	const url = '/api/indicatorsList'
	return new Promise((resolve, reject) => {
		axios
			.get(url, { cache: true, withCredentials: true })
			.then(res => {
				res.data = uniqueObjectArray(res.data)
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getIndexsList() {
	const url = '/api/indexsList'
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				res.data = uniqueObjectArray(res.data)
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getStocksList() {
	const url = '/api/stocksList'
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				res.data = uniqueObjectArray(res.data)
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getStrategiesJSON() {
	const url = '/api/strategiesJSON'
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				res.data = res.data
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getSampleList(page, sort, name, type) {
	let url = `/dev/dev/strategy/?ordering=name,status,-create_date`
	// sort -> ,total_return
	let strategy = type && type !== 'Strategy' ? type : null;
	if (sort) {
		url = `/dev/dev/strategy/?ordering=${sort}`
	}
	if (name) {
		url += `&name=${name}`
	}
	if(strategy) {
		url += `&strategy=${strategy}`
	}
	url += `&page=${page}`

	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function searchSampleList(keyword) {
	let url = `/dev/dev/strategy/?name=${keyword}`

	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getAnalystList(page, sort, name, type) {
	let url = `/dev/dev/analyst/?ordering=-create_date,name,status`
	// sort -> ,total_return
	let strategy = type && type !== 'Strategy' ? type : null;
	if (sort) {
		url = `/dev/dev/analyst/?ordering=${sort}`
	}
	if (name) {
		url += `&name=${name}`
	}
	if(strategy) {
		url += `&strategy=${strategy}`
	}
	url += `&page=${page}`

	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function searchAnalystList(keyword) {
	let url = `/dev/dev/analyst/?name=${keyword}`

	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getHistoryList(page, sort, name, type) {
	let url = `/dev/dev/backtest/?ordering=-create_date`
	// sort -> ,total_return
	let strategy = type && type !== 'Strategy' ? type : null;
	if (sort) {
		url = `/dev/dev/backtest/?ordering=${sort}`
	}
	if (name) {
		url += `&name=${name}`
	}
	if(strategy) {
		url += `&strategy=${strategy}`
	}
	url += `&page=${page}`
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true, retry: null })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function searchHistoryList(keyword, customUrl) {
	let url = null
	url = `/dev/dev/backtest/?name=${keyword}`
	if (customUrl) url = customUrl

	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getBacktestName(name) {
	const url = '/dev/dev/backtest/?name='

	return new Promise((resolve, reject) => {
		axios
			.get(url + name)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getFavoriteList(page, sort, name, type) {
	let url = `/dev/dev/backtest/?ordering=-create_date&favorites=true`
	// sort -> ,total_return
	let strategy = type && type !== 'Strategy' ? type : null
	if (sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&favorites=true`
	}
	if (name) {
		url += `&name=${name}`
	}
	if(strategy) {
		url += `&strategy=${strategy}`
	}
	url += `&page=${page}`
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function seeParams(id) {
	const url = '/dev/dev/seeparams/'

	return new Promise((resolve, reject) => {
		axios
			.get(url + id + '/')
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

// axios({
//     //用axios发送get请求
//   method: "get",
//   url: url + id + '/',
//   responseType: "blob", // 表明返回服务器返回的数据类型
//   //关键点，在axios发送网络请求，并且接收到后端返回的文件流时，换算成百分比，并赋值给data中声明的变量
//   onDownloadProgress (progress) {
//     //progress可以改成其他的参数，不需要提前声明
//     console.log(Math.round(progress.loaded / progress.total * 100))
//   }
// })

export function runBacktest(backtestDataStr) {
	const url = '/dev/dev/runbt/'
	//return axios.post(url,backtestDataStr,{withCredentials: true})

	return new Promise((resolve, reject) => {
		axios
			.post(url, backtestDataStr, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getStatus(id) {
	const url = '/dev/dev/status/'
	//return axios.get(url+id+'/')

	return new Promise((resolve, reject) => {
		axios
			.get(url + id + '/')
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function deleteBacktest(id) {
	const url = '/dev/dev/backtest/'
	return axios.delete(url + id + '/')
}
export function copyBacktest(paramsStr) {
	const url = '/dev/dev/backtest/'
	//return axios.post(url,paramsStr, {withCredentials: true})

	return new Promise((resolve, reject) => {
		axios
			.post(url, paramsStr, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function favoriteBacktest(id, paramsStr) {
	const url = '/dev/dev/backtest/'
	//return axios.put(url + id + '/', paramsStr)

	return new Promise((resolve, reject) => {
		axios
			.put(url + id + '/', paramsStr)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function seeReport(id) {
	const url = '/dev/dev/report/?uuid='
	//return axios.get(url + id)

	return new Promise((resolve, reject) => {
		axios
			.get(url + id)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function uploadS3(S3DataStr) {
	const url = '/dev/dev/upload/'
	return new Promise((resolve, reject) => {
		axios
			.post(url, S3DataStr, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function csvFileRead(fileName, HASH) {
	const url = `/dev/dev/csvfileread/?fileName=${fileName}&HASH=${HASH}`

	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function csvFilePagingRead(fileName, HASH, page) {
	const url = `/dev/dev/csvfilepagingread/?fileName=${fileName}&HASH=${HASH}&page=${page}`

	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function csvFileDelete(fileID) {
	const url = `/dev/dev/csvfiledelete/${fileID}/`

	return new Promise((resolve, reject) => {
		axios
			.delete(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getPairData(startDate, endDate, frequency, symbol) {
	// const url = `https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/pair_data?symbol=${symbol}&start=${startDate}&end=${endDate}&freq=${frequency}`
	// const url = `/dev/st_data/pair_data?symbol=${symbol}&start=${startDate}&end=${endDate}&freq=${frequency}`
	const url = `https://bt2api.sentimentrader.com/st_data/pair_data?symbol=${symbol}&start=${startDate}&end=${endDate}&freq=${frequency}`

	return new Promise((resolve, reject) => {
		axios
			.get(url, { timeout: 10000, auth: author })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getCustomTIM(backtest_id) {
	const url = `/dev/dev/tim/?backtest_id=${backtest_id}`

	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function setCustomTIM(data) {
	const url = `/dev/dev/tim/`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	formData.append('backtest_id', data.backtest_id)
	formData.append('tim_data', JSON.stringify(data.tim_data))
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getAllFavoriteList(page) {
	let url = '/dev/dev/backtest/?ordering=-create_date&favorites=true&page='

	return new Promise((resolve, reject) => {
		const allData = []

		function fetchPageData(page) {
			axios
				.get(url + page)
				.then(res => {
					const data = res.data.results

					// 将当前页的数据添加到总数据数组中
					allData.push(...data)

					if (res.data.next) {
						// 继续递归请求下一页数据
						fetchPageData(page + 1)
					} else {
						// 所有数据已获取完毕，返回结果
						resolve(allData)
					}
				})
				.catch(err => {
					reject(err)
				})
		}

		// 开始递归请求第一页数据
		fetchPageData(page)
	})
}
export function getAllHistoryList(page) {
	let url = '/dev/dev/backtest/?ordering=-create_date&page='

	return new Promise((resolve, reject) => {
		const allData = []

		function fetchPageData(page) {
			axios
				.get(url + page)
				.then(res => {
					const data = res.data.results

					// 将当前页的数据添加到总数据数组中
					allData.push(...data)

					if (res.data.next) {
						// 继续递归请求下一页数据
						fetchPageData(page + 1)
					} else {
						// 所有数据已获取完毕，返回结果
						resolve(allData)
					}
				})
				.catch(err => {
					reject(err)
				})
		}

		// 开始递归请求第一页数据
		fetchPageData(page)
	})
}

export function findLastSignalApi(data) {
	const url = `/dev/dev/findlastsingal/`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getMyIndicatorsList(page) {
	const url = `/dev/my_indicator/get_records/?ordering=-create_date&page=${page}`

	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getCPMList(page, sort, name) {
	let url = null
	url = '/dev/cpm/get_cpm_bts/?ordering=-create_date'
	// sort -> ,total_return
	if (sort) {
		url = `/dev/cpm/get_cpm_bts/?ordering=${sort}`
	}
	if (name) {
		url = `/dev/cpm/get_cpm_bts/?name=${name}`
	}
	if (name && sort) {
		url = `/dev/cpm/get_cpm_bts/?ordering=${sort}&name=${name}`
	}
	if(page) {url = `${url}&page=${page}`}
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true, retry: null })
			.then(res => {
				transformChangedKey(res,'get_cpm_bts')
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getScannerBTList(page, sort, name) {
	let url = null
	url = '/dev/scanner_trader/get_scanner_bt_records/?ordering=-create_date'
	// sort -> ,total_return
	if (sort) {
		url = `/dev/scanner_trader/get_scanner_bt_records/?ordering=${sort}`
	}
	if (name) {
		url = `/dev/scanner_trader/get_scanner_bt_records/?name=${name}`
	}
	if (name && sort) {
		url = `/dev/scanner_trader/get_scanner_bt_records/?ordering=${sort}&name=${name}`
	}
	if(page) {url = `${url}&page=${page}`}
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true, retry: null })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getAllMyIndicatorsList() {
	const url = `/dev/my_indicator/get_records/?ordering=-create_date&all=true`

	return new Promise((resolve, reject) => {
		axios
			.get(url,{
				headers: {
				  'Cache-Control': 'no-cache',  // 禁用缓存
				  'Pragma': 'no-cache',
				},
				withCredentials: true
			  })
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err)
			})
	})
}
// export function getAllMyIndicatorsList(page, callback) {
// 	const url = `/dev/my_indicator/get_records/?ordering=-create_date&page=`

// 	return new Promise((resolve, reject) => {
// 		const allData = []

// 		function fetchPageData(page) {
// 			axios
// 				.get(url + page, {
// 					// cache: true
// 				})
// 				.then(res => {
// 					const data = res.data.results
// 					console.log('响应数据', res)
// 					// 将当前页的数据添加到总数据数组中
// 					allData.push(...data)

// 					// 执行回调函数，将当前获取的数据传递给回调函数处理
// 					callback(allData)

// 					if (res.data.next) {
// 						// 继续递归请求下一页数据
// 						fetchPageData(page + 1)
// 					} else {
// 						// 所有数据已获取完毕，返回结果
// 						resolve(allData)
// 					}
// 				})
// 				.catch(err => {
// 					reject(err)
// 				})
// 		}
// 		// 开始递归请求第一页数据
// 		fetchPageData(page)
// 	})
// }

export function getMyIndicatorData(url) {
	const path = `/dev/my_indicator/get_data/?url='${url}'`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function delMyIndicator(url) {
	const path = `/dev/my_indicator/del_record/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.delete(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function delCPM(url) {
	const path = `/dev/cpm/remove_cpm_bt/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.delete(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function delScannerBT(url) {
	const path = `/dev/scanner_trader/delete_scanner_bt/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.delete(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getCPMResults(url) {
	const path = `/dev/cpm/run_cpm_bt/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				transformChangedKey(res,'run_cpm_bt')
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getScannerBTResults(url) {
	const path = `/dev/scanner_trader/run_scanner_bt/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getScannerBTResultsList(url) {
	const path = `/dev/scanner_trader/run_scanner_bt/?url=${url}&return_trade_list=1`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getCPMPreview(url) {
	const path = `/dev/cpm/preview_pattern/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function searchIndicator(
	name,
	calculate,
	combine_type,
	timeframe,
	page
) {
	let url = '/dev/my_indicator/get_records/?ordering=-create_date'
	if (name) url += `&name=${name}`
	if (calculate) {
		url += `&calculate=${calculate}`
	}
	if (combine_type) {
		url += `&combine_type=${combine_type}`
	}
	if (timeframe) {
		url += `&timeframe=${timeframe}`
	}
	if (page) {
		url += `&page=${page}`
	}
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function saveMyIndicators(data) {
	const url = '/dev/my_indicator/add_record'
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function saveCPM(data) {
	const url = '/dev/cpm/run_cpm_bt'
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function saveScannerForm(data) {
	const url = '/dev/scanner_trader/run_scanner_bt'
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function previewCPM(data) {
	const url = '/dev/cpm/preview_pattern'
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function perviewScannerForm(data) {
	const url = '/dev/scanner_trader/view_filter_list'
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function editMyIndicators(data, rowUrl) {
	const url = `/dev/my_indicator/update_record?url=${rowUrl}`
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function editCPM(data, rowUrl) {
	const url = `/dev/cpm/update_cpm_bt?url=${rowUrl}`
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function editScannerForm(data, rowUrl) {
	const url = `/dev/scanner_trader/update_scanner_bt?url=${rowUrl}`
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getRelatedBacktest(url) {
	let path = `/dev/my_indicator/relate_backtests/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getAnalystMyIndicatorData(data) {
	const url = `/dev/my_indicator/analyst_get_data/`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function runOPT(pk) {
	let path = `/dev/bt_opt/run_bt_opt?pk=${pk}`

	return new Promise((resolve, reject) => {
		axios
			.get(path, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getOPTStatus(pk) {
	let path = `/dev/bt_opt/get_bt_opt_results?pk=${pk}`

	return new Promise((resolve, reject) => {
		axios
			.get(path, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getSeasonalityData(url) {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				console.log('getSeasonalityData res', res)
				const status = res.data.Status
				if (status === 404) resolve({ data: { data: [] } })
				resolve(res)
			})
			.catch(err => {
				console.log('getSeasonalityData err', err)
				reject(err)
			})
	})
}

//临时设一个没有authorization的axios实例
// let instance = axios_new.create({
// 	baseURL: ''
// })
export function getBTV1Backtest() {
	return new Promise((resolve, reject) => {
		axios
			.get('/bt/my_indicator/get_btv1_favorite_backtests/', {
				withCredentials: true
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

// 这里加了缓存防止响应时间过长
export function getBTV1FavIndicator() {
	return new Promise((resolve, reject) => {
		axios
			.get('/bt/my_indicator/get_btv1_favorite_indicators/', {
				headers: {
				  'Cache-Control': 'no-cache',  // 禁用缓存
				  'Pragma': 'no-cache',
				},
				withCredentials: true
			  })
			.then(res => {
				console.log('fetch btv1 fav indicator: ', res)
				resolve(res)
			})
			.catch(err => {
				console.log('Error fetching btv1 fav indicator: ', err)
				reject(err)
			})
	})
}
/* Strategy Page 接口 START*/
export function getStrategyList() {
	return new Promise((resolve, reject) => {
		axios
			.get('/dev/portfolio/get_strategies/', {
				withCredentials: true
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getStrategySummaryList() {
	return new Promise((resolve, reject) => {
		axios
			.get('/dev/portfolio/strategy_statistic/', {
				withCredentials: true
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getStrategyDescription(url) {
	return new Promise((resolve, reject) => {
		axios
			.get(`/dev/portfolio/strategy_performance?model_url=${url}`, {
				withCredentials: true
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function addStrategyFavorites(data) {
	const url = `/dev/portfolio/favorite_strategy`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	formData.append('model_url', data.url)
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function moveStrategyFavorites(url) {
	return axios.delete(`/dev/portfolio/favorite_strategy?model_url=${url}`)
}
/* Strategy Page 接口 END */
/* Portfolio Page 接口 STRAT */
export function getPortfolioList(page, sort, name) {
	let url = null
	url = '/dev/portfolio/get_portfolio_records/?ordering=-create_date'
	// sort -> ,total_return
	if (sort) {
		url = `/dev/portfolio/get_portfolio_records/?ordering=${sort}`
	}
	if (name) {
		url = `/dev/portfolio/get_portfolio_records/?name=${name}`
	}
	if (name && sort) {
		url = `/dev/portfolio/get_portfolio_records/?ordering=${sort}&name=${name}`
	}
	if(page) {url = `${url}&page=${page}`}
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true, retry: null })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function RunPortfolio(data) {
	const url = `/dev/portfolio/run_portfolio`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function AutoPortfolio(data) {
	const url = `/dev/portfolio/auto_portfolio`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function UpdatePortfolio(id, data) {
	const url = `/dev/portfolio/update_portfolio?url=${id}`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
	}

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getRunPortfolioResults(url) {
	const path = `/dev/portfolio/run_portfolio?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function delPortfolio(url) {
	const path = `/dev/portfolio/delete_portfolio/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.delete(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/* Portfolio Page 接口 END */


/** MySymbol 接口START */
export function getAllMySymbolsList() {
	const url = `/dev/user_upload/get_upload_files_list/?ordering=-create_date&all=true`

	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				headers: {
				  'Cache-Control': 'no-cache',  // 禁用缓存
				  'Pragma': 'no-cache',
				},
				withCredentials: true
			  })
			.then(res => {
				resolve(res.data)
			})
			.catch(err => {
				reject(err)
			})
	})
}
// export function getAllMySymbolsList(page, callback) {
// 	const url = `/dev/user_upload/get_upload_files_list/?ordering=-create_date&page=`

// 	return new Promise((resolve, reject) => {
// 		const allData = []

// 		function fetchPageData(page) {
// 			axios
// 				.get(url + page, {
// 					// cache: true
// 					withCredentials: true
// 				})
// 				.then(res => {
// 					const data = res.data.results
// 					console.log('响应数据', res)
// 					// 将当前页的数据添加到总数据数组中
// 					allData.push(...data)

// 					// 执行回调函数，将当前获取的数据传递给回调函数处理
// 					callback(allData)

// 					if (res.data.next) {
// 						// 继续递归请求下一页数据
// 						fetchPageData(page + 1)
// 					} else {
// 						// 所有数据已获取完毕，返回结果
// 						resolve(allData)
// 					}
// 				})
// 				.catch(err => {
// 					reject(err)
// 				})
// 		}
// 		// 开始递归请求第一页数据
// 		fetchPageData(page)
// 	})
// }
export function symbolCsvFileDelete(fileID) {
	const url = `/dev/user_upload/symbolcsvfiledelete/?url=${fileID}`

	return new Promise((resolve, reject) => {
		axios
			.delete(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getSymbolCsv(fileID,timeframe) {
	const url = `/dev/user_upload/symbolcsvread/?url=${fileID}&timeframe=${timeframe}`

	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/** MySymbol 接口END */

export function getForecastList(symbol) {
	const url = `/dev/dev/forecastreport/?symbol=${symbol}`
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				res = res.data
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getSymbollistForecast() {
	const url = `/dev/dev/forecastsymbollist/`
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				res = res.data.data
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

/* Indicators Page 接口 START */
export function getAllIndicatorsList(page) {
	let url = '/dev/st_data/commodity_complete_list/?page='

	return new Promise((resolve, reject) => {
		const allData = []

		function fetchPageData(page) {
			axios
				.get(url + page)
				.then(res => {
					const data = res.data.results

					// 将当前页的数据添加到总数据数组中
					allData.push(...data)

					if (res.data.next) {
						// 继续递归请求下一页数据
						fetchPageData(page + 1)
					} else {
						// 所有数据已获取完毕，返回结果
						resolve(allData)
					}
				})
				.catch(err => {
					reject(err)
				})
		}

		// 开始递归请求第一页数据
		fetchPageData(page)
	})
}
export function obtainIndicatorsList(type, page) {
	const path =`/dev/st_data/${type}`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getIndicatorsRowData(url) {
	const path =`/dev/st_data/search_url_info?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getIndicatorsDownloadData(url) {
	const path =`/dev/st_data/download_csv?index=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function obtainBTV1IndicatorsList() {

	const path =`/dev/st_data/btv1_user_favorite_indicator`

	return new Promise((resolve, reject) => {
		axios
			.get(path, { cache: false, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getSectorTrendScore(url) {
	const path =`/dev/st_data/sector_trend_score`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/* Indicators Page 接口 END */

/** Begin fetch BTV2 fav indicator & symbol list*/
export function getFavorite() {
	const path =`/dev/dev/favorites/`

	return new Promise((resolve, reject) => {
		axios
			.get(path, { cache: false, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function updateFavorite(indicator,symbol) {
	const path =`/dev/dev/favorites/`
	var mFavorite = {}
	mFavorite.favorite_indicator = indicator
	mFavorite.favorite_symbol = symbol

	return new Promise((resolve, reject) => {
		axios
			.put(path, mqs.stringify(mFavorite), {
				cache: false,
				withCredentials: true
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/** End fetch BTV2 fav indicator & symbol list*/
/* Blog Report START*/
export const getBlogReportList = (filtersObj) => {
	let path = '/dev/st_data/blog_list'
// 过滤掉 undefined, null, '' 的属性
const filteredFiltersObj = Object.fromEntries(
	Object.entries(filtersObj).filter(([key, value]) => value !== undefined && value !== null && value !== '')
);
// 转换为查询参数
const queryParams = new URLSearchParams(filteredFiltersObj).toString();
// 如果有查询参数，将它们附加到路径上
if (queryParams) {
	path += `?${queryParams}`;
}

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export const getBlogReportInfo = (url) => {
	const path = `/dev/st_data/blog_info/?url=${url}`
	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export const getArchivedReports = (filtersObj) => {
	let path = `/dev/st_data/archived_reports`
	// 过滤掉 undefined, null, '' 的属性
	const filteredFiltersObj = Object.fromEntries(
		Object.entries(filtersObj).filter(([key, value]) => value !== undefined && value !== null && value !== '')
	);
	// 转换为查询参数
	const queryParams = new URLSearchParams(filteredFiltersObj).toString();
	// 如果有查询参数，将它们附加到路径上
	if (queryParams) {
		path += `?${queryParams}`;
	}

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export const getOldArchivedReports = (filtersObj) => {
	let path = `/dev/st_data/old_archived_reports`
	// 过滤掉 undefined, null, '' 的属性
	const filteredFiltersObj = Object.fromEntries(
		Object.entries(filtersObj).filter(([key, value]) => value !== undefined && value !== null && value !== '')
	);
	// 转换为查询参数
	const queryParams = new URLSearchParams(filteredFiltersObj).toString();
	// 如果有查询参数，将它们附加到路径上
	if (queryParams) {
		path += `?${queryParams}`;
	}

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export const getActiveStudies = () => {
	const path = `/dev/st_data/active_studies`
	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export const getArchivedStudies = () => {
	const path = `/dev/st_data/archived_studies`
	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export const addMRFavorites = (blog_url) => {
	const url = `/dev/st_data/blog_favortie_add`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	formData.append('blog', blog_url)
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export const removeMRFavorites = (blog_url) => {
	const url = `/dev/st_data/blog_favortie_delete?blog=${blog_url}`
	const headers = {
			'Content-Type': 'application/json'
	}
	const formData = new FormData()
	formData.append('blog', blog_url)

	return new Promise((resolve, reject) => {
			axios
					.post(url, formData, {
							headers,
							withCredentials: true
					})
					.then(res => {
							resolve(res)
					})
					.catch(err => {
							reject(err)
					})
	})
}
export const getMRFavoritesList = (filtersObj) => {
	let path = '/dev/st_data/blog_favortie_list'
// 过滤掉 undefined, null, '' 的属性
const filteredFiltersObj = Object.fromEntries(
	Object.entries(filtersObj).filter(([key, value]) => value !== undefined && value !== null && value !== '')
);
// 转换为查询参数
const queryParams = new URLSearchParams(filteredFiltersObj).toString();
// 如果有查询参数，将它们附加到路径上
if (queryParams) {
	path += `?${queryParams}`;
}

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/* Blog Report END*/
/**
 * 
 * @returns 
 */
export function getSymbolStrategySigal(symbol) {
	let url = `/dev/dev/symbolstrategysigal/?symbol_url=${symbol}&trend=1`
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/* My Signals Start */
export function getMySignalsList(url) {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true, retry: null })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function saveMySignalForm(data) {
	const url = '/dev/mysignal_app/mysignal'
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function editMySignalForm(data, rowUrl) {
	const url = `/dev/mysignal_app/mysignal?url=${rowUrl}`
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getMySignalResults(url) {
	const path = `/dev/mysignal_app/mysignal/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function deleteMySignal(url) {
	const path = `/dev/mysignal_app/mysignal?url=${url}`
	return axios.delete(path)
}
export function runAllMySignals() {
	const path = `/dev/mysignal_app/run_all_mysignal`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getLastSignalDate() {
	const path = `/dev/mysignal_app/get_newest_date`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getMySignalsSubscribe () {
	const path = `/dev/mysignal_app/subscribe`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function changeMySignalsSubscribe(data) {
	const url = `/dev/mysignal_app/subscribe`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/* My Signals End */
/* My Screens Start */
export function getMyScreensList(url) {
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true, retry: null })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function saveMyScreenForm(data) {
	const url = '/dev/myscreen_app/myscreen'
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function editMyScreenForm(data, rowUrl) {
	const url = `/dev/myscreen_app/myscreen?url=${rowUrl}`
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function deleteMyScreen(url) {
	const path = `/dev/myscreen_app/myscreen?url=${url}`
	return axios.delete(path)
}
export function getNewestScreenDate() {
	const path = `/dev/myscreen_app/get_newest_date`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getScreenResults(url) {
	const path = `/dev/myscreen_app/myscreen?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/* My Screens End */

/** Dashboard Start */
export async function getSmartDumbSentiment() {
	// 在配置env之前暂时用NODE_ENV判断url
	let url = `dev/st_data/smart_dump_sentiment`
  
	try {
	  const response = await axios.get(url);
	  return response.data;  // Assuming the API response contains a data field
	} catch (error) {
	  console.error('Error fetching SmartDumbSentiment info:', error);
	  throw new Error('Failed to fetch SmartDumbSentiment info');
	}
  }

  export async function getPairDataDashboard(
	symbol, 
	timeframe,
	startDate,          // 可选参数
	endDate,             // 可选参数
	indicators,   // 可选参数
  ) {
	  let url = `dev/st_data/pair_data?symbol=${symbol}&freq=${timeframe}`
	
	// if (startDate) {
	//   url += `&start=${startDate}`;
	// }
	// if (endDate) {
	//   url += `&end=${endDate}`;
	// }
  
	if(indicators) {
	  for(let i=0; i<indicators.length; i++){
		url += `&${i==0?'indicator':'indicator_'+(i+1)}=${indicators[i]}`
	  }
	}
  
	try {
	  const response = await axios.get(url, { auth: author });
	//   return response.data
	  if (startDate || endDate) {
		return response.data.filter(
		  it => 
			moment(it.DT).isAfter(moment(startDate)) && moment(it.DT).isBefore(moment(endDate)) 
		);  
	  }else return response.data
	  // Assuming the API response contains a data field
	} catch (error) {
	  console.error('Error fetching pair data:', error);
	  throw new Error('Failed to fetch pair data');
	}
  }

	export async function getDashboardData() {
		// 在配置env之前暂时用NODE_ENV判断url
		let path = `/dev/st_data/dashboard`
		
			return new Promise((resolve, reject) => {
				axios
					.get(path, { withCredentials: true, retry: null })
					.then(res => {
						resolve(res)
					})
					.catch(err => {
						reject(err)
					})
			})
	}

	export function saveSymbolCorrelation(data) {
		const url = `/dev/symbol_corr_app/symbol_corr/`
		const headers = {
			'Content-Type': 'application/json'
		}
		const formData = new FormData()
		for (const [key, value] of Object.entries(data)) {
			formData.append(key, value);
		}
		return new Promise((resolve, reject) => {
			axios
				.post(url, formData, { headers, withCredentials: true })
				.then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
		})
	}
	export function savePatternCorrelation(data) {
		const url = `/dev/symbol_corr_app/pattern_corr/`
		const headers = {
			'Content-Type': 'application/json'
		}
		const formData = new FormData()
		for (const [key, value] of Object.entries(data)) {
			formData.append(key, value);
		}
		return new Promise((resolve, reject) => {
			axios
				.post(url, formData, { headers, withCredentials: true })
				.then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
		})
	}
	export function getAssetCorrelation(data) {
		const url = `/dev/st_data/widgets?chart_name=AssetCorr`
		return new Promise((resolve, reject) => {
			axios
				.get(url, { cache: true, withCredentials: true })
				.then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
		})
	}

	export function postAssetCorrelation(data) {
		const url = `/dev/symbol_corr_app/asset_corr`
		const headers = {
			'Content-Type': 'application/json'
		}
		const formData = new FormData()
		for (const [key, value] of Object.entries(data)) {
			formData.append(key, value);
		}
		return new Promise((resolve, reject) => {
			axios
				.post(url, formData, { headers, withCredentials: true })
				.then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
		})
	}

	export function getSPXMostRelevantIndicators () {
		const url = `/dev/st_data/widgets?chart_name=MostRelevantIndicators`
		return new Promise((resolve, reject) => {
			axios
				.get(url, { cache: true, withCredentials: true })
				.then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
		})
	}
	export function getSectorTrendRelTrend(url, index) {
		let path = `/dev/st_data/${url}?index=${index}`
	
		return new Promise((resolve, reject) => {
			axios
				.get(path, { withCredentials: true })
				.then(res => {
					resolve(res)
				})
				.catch(err => {
					reject(err)
				})
		})
	}

// fetchNotifications.js
export function fetchCurrentNNotifications() {
	return new Promise((resolve, reject) => {
		axios
		.get('/dev/st_data/notifications/count/', { auth: author })
		.then(res => {
			resolve(res.data)
		})
		.catch(err => {
			reject(err)
		})
	})
  }
export function NotificationsMarkAllRead() {
	return new Promise((resolve, reject) => {
		axios
		.put('/dev/st_data/notifications/mark-all-read/')
		.then(res => {
			resolve(res)
		})
		.catch(err => {
			reject(err)
		})
	})
  }
	/* watch list start*/
export function postWatchList(data) {
	const url = `/dev/watchlist_app/watchlist`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
		formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function updateWatchList(rowUrl, data) {
	const url = `/dev/watchlist_app/watchlist?url=${rowUrl}`
	const formData = new FormData()

	// 将data对象的属性添加到FormData
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			formData.append(key, data[key])
		}
	}

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
				headers: {
					'Content-Type': 'multipart/form-data' // 设置请求头为form-data格式
				}
			})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function deleteWatchlist(url) {
	const path = `/dev/watchlist_app/watchlist?url=${url}`
	return axios.delete(path)
}
export function getWatchlist(url) {
	let path = `/dev/watchlist_app/watchlist/?url=${url}`

	return new Promise((resolve, reject) => {
		axios
			.get(path, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function previewWatchlist(data) {
	const url = `/dev/watchlist_app/get_tickers_data`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
		formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getAllWatchlist(page, sort, name) {
	let url = null
	url = '/dev/watchlist_app/get_watchlist_records/?ordering=-create_date'
	// sort -> ,total_return
	if (sort) {
		url = `/dev/watchlist_app/get_watchlist_records/?ordering=${sort}`
	}
	if (name) {
		url = `/dev/watchlist_app/get_watchlist_records/?name=${name}`
	}
	if (name && sort) {
		url = `/dev/watchlist_app/get_watchlist_records/?ordering=${sort}&name=${name}`
	}
	if(page) {url = `${url}&page=${page}`}
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true, retry: null })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
/* watch list end*/
export function getUserWatchlistTrend() {
	const url = `/dev/st_data/user_watchlist_trend/`
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function getCurrentUserWatchlistTrend() {
	const url = `/dev/st_data/user_watchlist/`
	return new Promise((resolve, reject) => {
		axios
			.get(url, { withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function postUserWatchlist(data) {
	const url = `/dev/st_data/user_watchlist/`
	const headers = {
		'Content-Type': 'application/json',
		'Cache-Control': 'no-cache',  // 禁用缓存
		'Pragma': 'no-cache',
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}
export function deleteUserWatchlist(data) {
	const path = `/dev/st_data/user_watchlist/`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	for (const [key, value] of Object.entries(data)) {
		formData.append(key, value);
	}
	return new Promise((resolve, reject) => {
		axios.delete(path, { data: formData, headers, withCredentials: true }).then(res => {
			resolve(res)
		}).catch(err => {
			reject(err)
		})
	})
}
export function getIntradayMinutes() {
	const path = `/dev/st_data/intraday_minutes`

	return new Promise((resolve, reject) => {
		axios
			.get(path)
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

// 全局轮询开关
let stopAll = false;

export async function fetchAISuplineData(ticker, latest_date, frequency) {
	let url = `/dev/ai_engine_app/get_chart_analysis?ticker=${ticker}`;
	if (latest_date) url += `&latest_date=${latest_date}`;
	if (frequency) url += `&frequency=${frequency}`;
  
	try {
		stopAll = false; //reset state
	  const getChartAnalysisRes = await axios.get(url);
  
	  if (getChartAnalysisRes.status === 200) {
		return getChartAnalysisRes.data.data;
	  }
  
	  if (getChartAnalysisRes.status === 202) {
		let retries = 0;
		const maxRetries = 120;
		let pollingUrl = `/dev/ai_engine_app/analysis_status?chart_key=${getChartAnalysisRes?.data.chart_key}`;
  
		do {
		  // ✅ 全局中止检查
		  if (stopAll) {
			console.log("轮询已被全局中止");
			stopAll = false; // 重置开关，避免影响下次调用
			throw new Error("Polling is interrupted by another operation");
		  }
  
		  const analysisStatusRes = await axios.get(pollingUrl);
  
		  if (analysisStatusRes.status === 200) {
			return analysisStatusRes.data.data;
		  }
  
		  if ([404].includes(analysisStatusRes.status)) {
			return;
		  }
  
		  await new Promise(resolve => setTimeout(resolve, 1500));
		  retries++;
		} while (retries < maxRetries);
  
		throw new Error("Polling timeout");
	  }
	} catch (err) {
	  console.error("fetchAISuplineData 出错:", err);
	  throw err;
	}
  }

// ✅ 在任意地方调用即可终止所有轮询
export function stopAllPolling() {
	stopAll = true;
  }