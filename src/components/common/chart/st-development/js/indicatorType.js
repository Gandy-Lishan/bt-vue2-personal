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

CIQ.findSymbolIndicator = function(label,field){
    let symbolOhlcvList = [//form
		{label:'Symbol Open',field:'Open'},
		{label:'Symbol High',field:'High'},
		{label:'Symbol Low',field:'Low'},
		{label:'Symbol Close',field:'Close'},
		{label:'Symbol Volume',field:'Volume'},
	]
    let signal
    if(label){
        signal = symbolOhlcvList.find((i) => {
            return i.label == label
        })
    }
    if(field){
        signal = symbolOhlcvList.find((i) => {
            return i.field == field
        })
    }
    return signal
}
}
export {__st_js_indicatorType_}