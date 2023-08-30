import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";
let __st_js_indicatorType_ = (_exports) => {
 /* global _CIQ, _timezoneJS, _SplinePlotter */
 
 var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
 
// the whole tech list that found in Chartiq searchbox
CIQ.findBuiltinTechIndicator = function(value,url){
    let signal
    if(value){
        signal = CIQ.store.state.chart.builtinList.find((i) => {
            return i.value == value
        })
    }
    if(url){
        signal = CIQ.store.state.chart.builtinList.find((i) => {
            return i.url == url
        })
    }
    return signal
}
CIQ.findSentiIndicator = function(name,url){
    let signal
    if(name){
        signal = CIQ.store.state.chart.indicatorsList.find((i) => {
            return i.chart_name == name
        })
    }
    if(url){
        signal = CIQ.store.state.chart.indicatorsList.find((i) => {
            return i.url == url
        })
    }
    return signal
}

CIQ.isUserIndicator = function(indicator){
    if(!indicator || indicator.indexOf('HASH') == -1){
        return false
    }
    return true
}
CIQ.isSymbolIndicator = function(indicator){
    let symbolOhlcvList = ['Symbol Open','Symbol High','Symbol Close','Symbol Low','Symbol Volume']
    if(symbolOhlcvList.indexOf(indicator) == -1){
        return false
    }
    return true
}
}
export {__st_js_indicatorType_}