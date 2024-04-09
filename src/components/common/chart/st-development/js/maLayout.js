import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";

// 封装ma状态保存函数
let __st_js_maLayout_ = (_exports) => {
    /* global _CIQ, _timezoneJS, _SplinePlotter */
    var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
    
    CIQ.setMALayout = function (url, period, type, field, criteria, index) {
        var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout?CIQ.store.state.chart.activatedMALayout:[]

        // remove current MA attached to an indicator
        var MALayoutListIndex = activatedMALayoutList.findIndex(
            (item) => item.criteria == criteria && item.index == index
        )
        if (MALayoutListIndex != -1) {
            activatedMALayoutList.splice(MALayoutListIndex, 1)
        }
        if (CIQ.findBuiltinTechIndicator(null,url) || CIQ.findSymbolIndicator(url,null)){

            var obj = {}
            if(url == 'ma'){
                // keep current MA
                obj = {
                    url: url,   // 新加了一个来区分tech类别，考虑兼容问题上，没有url的对象都是ma
                    period: period ? period : 21,
                    type: type ? type : 'simple',
                    field: field?field:'Close',
                    criteria: criteria,
                    index: index
                }
                activatedMALayoutList.push(obj)
            }else{
                // 如果存在dual symbol两个symbol共用同一个tech indicator,则分别保存其信息
                obj = {
                    url: url,
                    /**
                     * 不用考虑symbolOHLCV而加入field属性，因为我把symbolOhlcv分成了5个不同Study,每个都有其默认Field
                     */
                    criteria: criteria,
                    index: index
                }
                if(!(activatedMALayoutList.find(item=>item.url == obj.url && (
                    (item.criteria.endsWith('2') && obj.criteria.endsWith('2')) ||
                    (!item.criteria.endsWith('2') && !obj.criteria.endsWith('2'))
                  )))) {
                    activatedMALayoutList.push(obj)
                  }     
            }
           
        }
        CIQ.store.commit('chart/getMALayout', activatedMALayoutList)
    }
    CIQ.removeMALayout = function (url, criteria, index) {
        // if (url == 'ma') {}
        if (CIQ.findBuiltinTechIndicator(null,url) || CIQ.findSymbolIndicator(url,null)){
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