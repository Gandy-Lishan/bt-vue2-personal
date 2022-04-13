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
    const url = get_env("SERVICE_URL",'/CHART_DATA_API') + "/getAllSymbols"
    return axios.get(url, {auth: author})
}
export function getIndexsList() {
    const url = get_env("SERVICE_URL",'/CHART_DATA_API') + '/getIndexes'
    return axios.get(url, {auth: author})
}
export function getStocksList() {
    const url = get_env("SERVICE_URL",'/CHART_DATA_API') + '/getStocks'
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