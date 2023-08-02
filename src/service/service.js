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

export function getSampleList(page, sort, name) {
	let url = null
	url = '/dev/dev/strategy/?ordering=name,status,-create_date&page='
	if(sort) {
		url = `/dev/dev/strategy/?ordering=${sort}&page=`
	}
	if(name) {
		url = `/dev/dev/strategy/?name=${name}&page=`
	}
	if(name && sort) {
		url = `/dev/dev/strategy/?ordering=${sort}&name=${name}&page=`
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

export function searchSampleList(keyword) {
  let url = `/dev/dev/strategy/?name=${keyword}`

    return new Promise((resolve,reject)=>{
		axios.get(url, {withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}

export function getAnalystList(page, sort, name) {
	let url =  null
  url = '/dev/dev/analyst/?ordering=-create_date,name,status&page='
	if(sort) {
		url = `/dev/dev/analyst/?ordering=${sort}&page=`
	}
	if(name) {
		url = `/dev/dev/analyst/?name=${name}&page=`
	}
	if(name && sort) {
		url = `/dev/dev/analyst/?ordering=${sort}&name=${name}&page=`
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
export function searchAnalystList(keyword) {
  let url = `/dev/dev/analyst/?name=${keyword}`

    return new Promise((resolve,reject)=>{
		axios.get(url, {withCredentials: true})
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function getHistoryList(page, sort, name) {
	let url = null
	url = '/dev/dev/backtest/?ordering=-create_date&page='
	// sort -> ,total_return
	if(sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&page=`
	}
	if(name) {
		url = `/dev/dev/backtest/?name=${name}&page=`
	}
	if(name && sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&name=${name}&page=`
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
  url = `/dev/dev/backtest/?name=${keyword}`
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
    const url = '/dev/dev/backtest/?name='

    return new Promise((resolve,reject)=>{
		axios.get(url+name)
		.then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}
export function getFavoriteList(page, sort, name) {
	let url = null
  url = '/dev/dev/backtest/?ordering=-create_date&favorites=true&page='
	if(sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&favorites=true&page=`
	}
	if(name) {
		url = `/dev/dev/backtest/?name=${name}&favorites=true&page=`
	}
	if(name && sort) {
		url = `/dev/dev/backtest/?ordering=${sort}&name=${name}&favorites=true&page=`
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
    const url = '/dev/dev/seeparams/'
    
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
    const url = '/dev/dev/runbt/'
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
    const url = '/dev/dev/status/'
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
    const url = '/dev/dev/backtest/'
    return axios.delete(url + id + '/')
}
export function copyBacktest(paramsStr) {
    const url = '/dev/dev/backtest/'
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
    const url = '/dev/dev/backtest/'
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
    const url = '/dev/dev/report/?uuid='
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
    const url = '/dev/dev/upload/'

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
	const url = `/dev/dev/csvfileread/?fileName=${fileName}&HASH=${HASH}`

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
	const url = `/dev/dev/csvfilepagingread/?fileName=${fileName}&HASH=${HASH}&page=${page}`

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
	const url = `/dev/dev/csvfiledelete/${fileID}/`

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
	const url = `/dev/dev/tim/?backtest_id=${backtest_id}`


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
  const url = `/dev/dev/tim/`;
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
export function getAllFavoriteList(page) {
  let url = '/dev/dev/backtest/?ordering=-create_date&favorites=true&page=';

  return new Promise((resolve, reject) => {
    const allData = [];

    function fetchPageData(page) {
      axios.get(url + page)
        .then(res => {
          const data = res.data.results;

          // 将当前页的数据添加到总数据数组中
          allData.push(...data);

          if (res.data.next) {
            // 继续递归请求下一页数据
            fetchPageData(page + 1);
          } else {
            // 所有数据已获取完毕，返回结果
            resolve(allData);
          }
        })
        .catch(err => {
          reject(err);
        });
    }

    // 开始递归请求第一页数据
    fetchPageData(page);
  });
}
export function getAllHistoryList(page) {
	let url = '/dev/dev/backtest/?ordering=-create_date&page=';
  
	return new Promise((resolve, reject) => {
	  const allData = [];
  
	  function fetchPageData(page) {
		axios.get(url + page)
		  .then(res => {
			const data = res.data.results;
  
			// 将当前页的数据添加到总数据数组中
			allData.push(...data);
  
			if (res.data.next) {
			  // 继续递归请求下一页数据
			  fetchPageData(page + 1);
			} else {
			  // 所有数据已获取完毕，返回结果
			  resolve(allData);
			}
		  })
		  .catch(err => {
			reject(err);
		  });
	  }
  
	  // 开始递归请求第一页数据
	  fetchPageData(page);
	});
  }

export function findLastSignalApi(data) {
  const url = `/dev/dev/findlastsingal/`;
  const headers = {
    'Content-Type': 'application/json'
  };
	let csv = data.csv
	// csv = csv.replace(/\n/g, ",");
	const formData = new FormData();
  formData.append('uuid', data.uuid);
  formData.append('csv', csv)
  formData.append('entry', data.entry)
  formData.append('exit', data.exit)
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
