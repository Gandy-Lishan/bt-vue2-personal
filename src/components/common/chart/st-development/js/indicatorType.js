import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";
let __st_js_indicatorType_ = (_exports) => {
 /* global _CIQ, _timezoneJS, _SplinePlotter */
 
 var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
 CIQ.isTechIndicator = function(indicator){
    let isTech = false
    for(var i in CIQ.technicalCategory){
        if(CIQ.technicalCategory[i]['studies'].find(item=>item.url == indicator)){
            isTech = true
        }
    }
    return isTech
}
CIQ.isSentiIndicator = function(indicator){
    let sentiList = []
    CIQ.store.state.chart.indicatorsList.forEach(e => {
        sentiList.push(e.url)
    })
    if(sentiList.indexOf(indicator) == -1){
        return false
    }
    return true
}
// CIQ.findSentiIndicator = function(name,url){
//     let signal
//     if(name){
//         signal = CIQ.store.state.chart.indicatorsList.find((i) => {
//             return i.chart_name == name
//         })
//     }
//     if(url){
//         signal = CIQ.store.state.chart.indicatorsList.find((i) => {
//             return i.url == url
//         })
//     }
//     return signal
// }

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