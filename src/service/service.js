import axios  from "axios";
const author = {
    username: 'sentimentrader_backtest_api',
    password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
}
export function getIndicatorsList() {
    const url = 'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols'
    return axios.get(url, {auth: author})
}
export function getIndexsList() {
    const url = 'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getIndexes'
    return axios.get(url, {auth: author})
}
export function getStocksList() {
    const url = 'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getStocks'
    return axios.get(url, {auth: author})
}
export function getSampleList(page) {
    const url = '/dev/strategy/?ordering=name,status,-create_date&page='
    return axios.get(url, page)
}
export function getHistoryList(page) {
    const url = '/dev/backtest/?ordering=-create_date&page='
    return axios.get(url, page)
}
export function getFavoriteList(page) {
    const url = '/dev/backtest/?ordering=-create_date&favorites=true&page='
    return axios.get(url, page)
}