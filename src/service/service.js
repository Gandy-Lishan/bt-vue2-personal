import axios  from "axios";

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
    const url = get_env("SERVICE_URL",'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev') + "/getAllSymbols"
    return axios.get(url, {auth: author})
}
export function getIndexsList() {
    const url = get_env("SERVICE_URL",'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev') + '/getIndexes'
    return axios.get(url, {auth: author})
}
export function getStocksList() {
    const url = get_env("SERVICE_URL",'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev') + '/getStocks'
    return axios.get(url, {auth: author})
}

export function getSampleList(page) {
    const url = '/dev/strategy/?ordering=name,status,-create_date&page='
    return axios.get(url+page)
}
export function getHistoryList(page) {
    const url = '/dev/backtest/?ordering=-create_date&page='
    return axios.get(url+page)
}
export function getFavoriteList(page) {
    const url = '/dev/backtest/?ordering=-create_date&favorites=true&page='
    return axios.get(url+page)
}
export function seeParams(id) {
    const url = '/dev/seeparams/'
    return axios.get(url + id + '/')
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
    return axios.post(url,backtestDataStr,{withCredentials: true})
}
export function getStatus(id) {
    const url = '/dev/status/'
    return axios.get(url+id+'/')
}
export function deleteBacktest(id) {
    const url = '/dev/backtest/'
    return axios.delete(url + id + '/')
}
export function copyBacktest(paramsStr) {
    const url = '/dev/backtest/'
    return axios.post(url,paramsStr, {withCredentials: true})
}
export function favoriteBacktest(id, paramsStr) {
    const url = '/dev/backtest/'
    return axios.put(url + id + '/', paramsStr)
}


export function seeReport(id) {
    const url = '/dev/report/?uuid='
    return axios.get(url + id)
}