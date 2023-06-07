import axios from "../axios";

function get_env(name,value){
    if (process.env[name] === undefined){
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
	return new Promise((resolve,reject)=>{
		axios.get(url, {withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
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
	return new Promise((resolve,reject)=>{
		axios.get(url, {withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
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
	return new Promise((resolve,reject)=>{
		axios.get(url, {withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}

export function getSampleList(page) {
    const url = '/dev/strategy/?ordering=name,status,-create_date&page='

    return new Promise((resolve,reject)=>{
		axios.get(url+page)
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}

export function getAnalystList(page) {
    const url = '/dev/analyst/?ordering=-create_date,name,status&page='

    return new Promise((resolve,reject)=>{
		axios.get(url+page)
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function getHistoryList(page, sort) {
	let url = null
	url = '/dev/backtest/?ordering=-create_date&page='
	// sort -> ,total_return
	if(sort) {
		url = `/dev/backtest/?ordering=${sort}&page=`
	}
    return new Promise((resolve,reject)=>{
		axios.get(url+page, {withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function searchHistoryList(keyword, customUrl) {
	let url = null
  url = `/dev/backtest/?name=${keyword}`
	if(customUrl) url = customUrl

    return new Promise((resolve,reject)=>{
		axios.get(url, {withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function getBacktestName(name) {
    const url = '/dev/backtest/?name='

    return new Promise((resolve,reject)=>{
		axios.get(url+name)
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function getFavoriteList(page, sort) {
	let url = null
  url = '/dev/backtest/?ordering=-create_date&favorites=true&page='
	if(sort) {
		url = `/dev/backtest/?ordering=${sort}&favorites=true&page=`
	}

    return new Promise((resolve,reject)=>{
		axios.get(url+page)
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function seeParams(id) {
    const url = '/dev/seeparams/'
    
    return new Promise((resolve,reject)=>{
		axios.get(url + id + '/')
		.then(res=>{
			resolve(res)
		}).catch(err=>{
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
    const url = '/dev/runbt/'
    //return axios.post(url,backtestDataStr,{withCredentials: true})

    return new Promise((resolve,reject)=>{
		axios.post(url,backtestDataStr,{withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function getStatus(id) {
    const url = '/dev/status/'
    //return axios.get(url+id+'/')

    return new Promise((resolve,reject)=>{
		axios.get(url+id+'/')
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function deleteBacktest(id) {
    const url = '/dev/backtest/'
    return axios.delete(url + id + '/')
}
export function copyBacktest(paramsStr) {
    const url = '/dev/backtest/'
    //return axios.post(url,paramsStr, {withCredentials: true})

    return new Promise((resolve,reject)=>{
		axios.post(url,paramsStr, {withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function favoriteBacktest(id, paramsStr) {
    const url = '/dev/backtest/'
    //return axios.put(url + id + '/', paramsStr)

    return new Promise((resolve,reject)=>{
		axios.put(url + id + '/', paramsStr)
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}


export function seeReport(id) {
    const url = '/dev/report/?uuid='
    //return axios.get(url + id)

    return new Promise((resolve,reject)=>{
		axios.get(url + id)
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}

export function uploadS3(S3DataStr) {
    const url = '/dev/upload/'

    return new Promise((resolve,reject)=>{
		axios.post(url,S3DataStr,{withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}

export function csvFileRead(fileName, HASH) {
	const url = `/dev/csvfileread/?fileName=${fileName}&HASH=${HASH}`

	return new Promise((resolve, reject) => {
		axios.get(url, {withCredentials: true})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function csvFilePagingRead(fileName, HASH, page) {
	const url = `/dev/csvfilepagingread/?fileName=${fileName}&HASH=${HASH}&page=${page}`

	return new Promise((resolve, reject) => {
		axios.get(url, {withCredentials: true})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function csvFileDelete(fileID) {
	const url = `/dev/csvfiledelete/${fileID}/`

	return new Promise((resolve, reject) => {
		axios.delete(url, {withCredentials: true})
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
		axios.get(url, {auth: author})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export function getCustomTIM(backtest_id) {
	const url = `/dev/tim/?backtest_id=${backtest_id}`


	return new Promise((resolve, reject) => {
		axios.get(url, {withCredentials: true})
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
}


export function setCustomTIM(data) {
  const url = `/dev/tim/`;
  const headers = {
    'Content-Type': 'application/json'
  };
	const formData = new FormData();
  formData.append('backtest_id', data.backtest_id);
  formData.append('tim_data', JSON.stringify(data.tim_data))
  return new Promise((resolve, reject) => {
    axios.post(url, formData, { headers, withCredentials: true })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// instance.interceptors.request.use((config) => {
// 	config.headers.Authorization = window.sessionStorage.getItem('token')
// 	config.auth = {
// 		username: 'sentimentrader_backtest_api',
// 		password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
// 	}
// 	return config
// })