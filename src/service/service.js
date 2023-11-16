import axios from '../axios'

// import axios_new from 'axios'

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
	// const url = get_env("SERVICE_URL",'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev') + "/getAllSymbols"
	// //return axios.get(url, {auth: author})

	// return new Promise((resolve,reject)=>{
	// 	axios.get(url, {cache:true, auth: author})
	// 	.then(res=>{
	//         //console.log(res)
	// 		resolve(res)
	// 	}).catch(err=>{
	// 		reject(err)
	// 	})
	// })

	const url = '/api/indicatorsList'
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
export function getIndexsList() {
	// const url = get_env("SERVICE_URL",'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev') + '/getIndexes'

	// return new Promise((resolve,reject)=>{
	// 	axios.get(url, {cache:true, auth: author})
	// 	.then(res=>{
	// 		resolve(res)
	// 	}).catch(err=>{
	// 		reject(err)
	// 	})
	// })

	const url = '/api/indexsList'
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
export function getStocksList() {
	// const url = get_env("SERVICE_URL",'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev') + '/getStocks'

	// return new Promise((resolve,reject)=>{
	// 	axios.get(url, {cache:true, auth: author})
	// 	.then(res=>{
	// 		resolve(res)
	// 	}).catch(err=>{
	// 		reject(err)
	// 	})
	// })

	const url = '/api/stocksList'
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

export function getSampleList(page, sort, name) {
	let url = null
	url = '/dev/dev/strategy/?ordering=name,status,-create_date&page='
	if (sort) {
		url = `/dev/dev/strategy/?ordering=${sort}&page=`
	}
	if (name) {
		url = `/dev/dev/strategy/?name=${name}&page=`
	}
	if (name && sort) {
		url = `/dev/dev/strategy/?ordering=${sort}&name=${name}&page=`
	}

	return new Promise((resolve, reject) => {
		axios
			.get(url + page)
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

export function getAnalystList(page, sort, name) {
	let url = null
	url = '/dev/dev/analyst/?ordering=-create_date,name,status&page='
	if (sort) {
		url = `/dev/dev/analyst/?ordering=${sort}&page=`
	}
	if (name) {
		url = `/dev/dev/analyst/?name=${name}&page=`
	}
	if (name && sort) {
		url = `/dev/dev/analyst/?ordering=${sort}&name=${name}&page=`
	}

	return new Promise((resolve, reject) => {
		axios
			.get(url + page)
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
export function getHistoryList(page, sort, name) {
	let url = null
	url = '/dev/dev/backtest/?ordering=-create_date&page='
	// sort -> ,total_return
	if (sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&page=`
	}
	if (name) {
		url = `/dev/dev/backtest/?name=${name}&page=`
	}
	if (name && sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&name=${name}&page=`
	}
	return new Promise((resolve, reject) => {
		axios
			.get(url + page, { withCredentials: true })
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
export function getFavoriteList(page, sort, name) {
	let url = null
	url = '/dev/dev/backtest/?ordering=-create_date&favorites=true&page='
	if (sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&favorites=true&page=`
	}
	if (name) {
		url = `/dev/dev/backtest/?name=${name}&favorites=true&page=`
	}
	if (name && sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&name=${name}&favorites=true&page=`
	}
	return new Promise((resolve, reject) => {
		axios
			.get(url + page)
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
	const url = `https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/pair_data?symbol=${symbol}&start=${startDate}&end=${endDate}&freq=${frequency}`

	return new Promise((resolve, reject) => {
		axios
			.get(url, { auth: author })
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
	let csv = data.csv
	// csv = csv.replace(/\n/g, ",");
	const formData = new FormData()
	formData.append('uuid', data.uuid)
	formData.append('csv', csv)
	formData.append('entry', data.entry)
	formData.append('exit', data.exit)
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
export function getAllMyIndicatorsList(page, callback) {
	const url = `/dev/my_indicator/get_records/?page=`

	return new Promise((resolve, reject) => {
		const allData = []

		function fetchPageData(page) {
			axios
				.get(url + page)
				.then(res => {
					const data = res.data.results
					console.log('响应数据', res)
					// 将当前页的数据添加到总数据数组中
					allData.push(...data)

					// 执行回调函数，将当前获取的数据传递给回调函数处理
					callback(allData)

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
export function searchIndicator(name, calculate, combine_type, timeframe) {
	let url = '/dev/my_indicator/get_records/?'
	if (name) url += `name=${name}`
	if (calculate) {
		if (name) url += `&`
		url += `calculate=${calculate}`
	}
	if (combine_type) {
		if (name || calculate) url += `&`
		url += `combine_type=${combine_type}`
	}
	if (timeframe) {
		if (name || calculate || combine_type) url += `&`
		url += `timeframe=${timeframe}`
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
				cache: true,
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
