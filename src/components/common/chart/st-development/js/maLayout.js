import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";

// 封装ma状态保存函数
let __st_js_maLayout_ = (_exports) => {
    /* global _CIQ, _timezoneJS, _SplinePlotter */
    var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
    
    /**
     * 和setMALayout独立开，用url和criteria管理Tech（ma类除外）和SymbolOhlcv的图表定位信息
     * 不含ma类的tech以及symbol不加critria和index， 因为他们同一symbol下只显示一个，用不上这两个属性
     * @param {*} url 
     * @param {*} criteria 用来判断symbol
     * @returns symbol
     */
    CIQ.setTechLayout = function (url, criteria) {
        /** 根据critial判断study所属Symbol */
        let symbol
        if(criteria && criteria.endsWith('2')){
            symbol = CIQ.store.getters.getComparisonSymbol.url
        }else symbol = CIQ.stxx.chart.symbol?CIQ.stxx.chart.symbol:process.env.VUE_APP_DEFAULT_SYMBOL

        var activatedTechLayoutList = CIQ.store.state.chart.activatedTechLayout?CIQ.store.state.chart.activatedTechLayout:[]

        // remove redundant Tech
        var TechLayoutListIndex = activatedTechLayoutList.findIndex(
            (item) => item.symbol == symbol && item.url == url
        )
        if (TechLayoutListIndex != -1) {
            activatedTechLayoutList.splice(TechLayoutListIndex, 1)
        }
        
        if (!['ma','Awesome'].includes(url) && (CIQ.findBuiltinTechIndicator(null,url) || CIQ.findSymbolIndicator(url,null))){
            var obj = {}
            // 如果存在dual symbol两个symbol共用同一个tech indicator,则分别保存其信息
            obj = {
                url: url,
                symbol: symbol, // 新加了一个symbol属性，专门用来判断归属symbol的名，而不是用criteria判断
                /**
                 * 不用考虑symbolOHLCV而加入field属性，因为我把symbolOhlcv分成了5个不同Study,每个都有其默认Field
                 */
            }
            if(!(activatedTechLayoutList.find(item=>item.url == obj.url && item.symbol == obj.symbol))) {
                activatedTechLayoutList.push(obj)
            }      
        }
        CIQ.store.commit('chart/getTechLayout', activatedTechLayoutList)
        return symbol
    }

    CIQ.removeTechLayout = function (url, criteria) {
        /** 根据critial判断study所属Symbol */
        let symbol
        if(criteria && criteria.endsWith('2')){
            symbol = CIQ.store.getters.getComparisonSymbol.url
        }else symbol = CIQ.stxx.chart.symbol?CIQ.stxx.chart.symbol:process.env.VUE_APP_DEFAULT_SYMBOL
        
        if (!['ma','Awesome'].includes(url) && (CIQ.findBuiltinTechIndicator(null,url) || CIQ.findSymbolIndicator(url,null))){
            // 對undefined的判斷處理只是爲了防止報錯，因爲btv1的遷移可能存在未知的錯誤
            var activatedTechLayoutList = CIQ.store.state.chart.activatedTechLayout?CIQ.store.state.chart.activatedTechLayout:[]

            // remove redundant Tech
            var TechLayoutListIndex = activatedTechLayoutList.findIndex(
                (item) => item.symbol == symbol && item.url == url
            )
            if (TechLayoutListIndex != -1) {
                activatedTechLayoutList.splice(TechLayoutListIndex, 1)
            }

            CIQ.store.commit('chart/getTechLayout', activatedTechLayoutList)
        }
    }



    CIQ.setMALayout = function (url, period, type, field, criteria, index) {
        var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout?CIQ.store.state.chart.activatedMALayout:[]

        // remove current MA attached to an indicator
        var MALayoutListIndex = activatedMALayoutList.findIndex(
            (item) => item.criteria == criteria && item.index == index
        )
        if (MALayoutListIndex != -1) {
            activatedMALayoutList.splice(MALayoutListIndex, 1)
        }
        if (['ma','Awesome'].includes(url)){
            // keep current MA
            var objMA = {
                period: period ? period : 21,
                type: type ? type : 'simple',
                field: field ? field : 'Close',
                criteria: criteria,
                index: index
            }
            activatedMALayoutList.push(objMA)
        }
        CIQ.store.commit('chart/getMALayout', activatedMALayoutList)
    }
    CIQ.removeMALayout = function (url, criteria, index) {
        if (['ma','Awesome'].includes(url)) {
            // 對undefined的判斷處理只是爲了防止報錯，因爲btv1的遷移可能存在未知的錯誤
            var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout?CIQ.store.state.chart.activatedMALayout:[]

            // remove current MA attached to an indicator
            var MALayoutListIndex = activatedMALayoutList.findIndex(
                (item) => item.criteria == criteria && item.index == index
            )
            if (MALayoutListIndex != -1) {
                activatedMALayoutList.splice(MALayoutListIndex, 1)
            }

            CIQ.store.commit('chart/getMALayout', activatedMALayoutList)
        }
    }
    // 用于changeRelation relation==1
    CIQ.keepTheFirstMALayout = function (criteria) {

        var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout?CIQ.store.state.chart.activatedMALayout:[]

        // 如tech是ma则保留第一个选项卡的ma信息
        var activatedMALayoutList = activatedMALayoutList.filter(
            (item) => item.criteria != criteria || (item.criteria == criteria && item.index == 0)
        )

        CIQ.store.commit('chart/getMALayout', activatedMALayoutList)

    }
    // 用于changeRelation relation==0
    CIQ.removeExitMALayout = function () {
        var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout?CIQ.store.state.chart.activatedMALayout:[]

        // 如tech是ma则保留第一个选项卡的ma信息
        var activatedMALayoutList = activatedMALayoutList.filter(
            (item) => item.criteria == 'entry'
        )

        CIQ.store.commit('chart/getMALayout', activatedMALayoutList)
    }
}
export { __st_js_maLayout_ }