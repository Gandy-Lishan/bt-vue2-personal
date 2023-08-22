import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";

// 封装ma状态保存函数
let __st_js_maLayout_ = (_exports) => {
    /* global _CIQ, _timezoneJS, _SplinePlotter */
    var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
    
    CIQ.setMALayout = function (url, period, type, field, criteria, index) {
        if (url == 'ma') {
            // keep current MA
            var objMA = {
                period: period ? period : 20,
                type: type ? type : 'simple',
                field: field ? field : 'Close',
                criteria: criteria,
                index: index
            }
            var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout

            // remove current MA attached to an indicator
            var MALayoutListIndex = activatedMALayoutList.findIndex(
                (item) => item.criteria == criteria && item.index == index
            )
            if (MALayoutListIndex != -1) {
                activatedMALayoutList.splice(MALayoutListIndex, 1)
            }
            activatedMALayoutList.push(objMA)
            CIQ.store.commit('chart/getMALayout', activatedMALayoutList)
        }
    }
    CIQ.removeMALayout = function (url, criteria, index) {
        if (url == 'ma') {
            var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout

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

        var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout

        // 如tech是ma则保留第一个选项卡的ma信息
        var activatedMALayoutList = activatedMALayoutList.filter(
            (item) => item.criteria != criteria || (item.criteria == criteria && item.index == 0)
        )

        CIQ.store.commit('chart/getMALayout', activatedMALayoutList)

    }
    // 用于changeRelation relation==0
    CIQ.removeExitMALayout = function () {
        var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout

        // 如tech是ma则保留第一个选项卡的ma信息
        var activatedMALayoutList = activatedMALayoutList.filter(
            (item) => item.criteria == 'entry'
        )

        CIQ.store.commit('chart/getMALayout', activatedMALayoutList)
    }
}
export { __st_js_maLayout_ }