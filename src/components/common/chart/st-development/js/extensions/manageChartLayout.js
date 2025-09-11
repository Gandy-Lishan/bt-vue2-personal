import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";

// 一些共用工具函数，可以分离出来
let __st_js_manage_chart_layout_ = (_exports) => {
    /* global _CIQ, _timezoneJS, _SplinePlotter */
    var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

    CIQ.saveLayout = function(name) {
        var layout = JSON.stringify(CIQ.stxx.exportLayout(true));
        let layoutFreq = CIQ.store.state.form.exitFrequency
        let uid = crypto.randomUUID()
        let obj = {id:uid,name,layout,layoutFreq}
        return obj
    }
    
    CIQ.savePreferences = function() {
        var preferences = JSON.stringify(CIQ.stxx.exportPreferences());
        localStorage.setItem("myChartPreferences", preferences);
    }
    
    CIQ.saveDrawings = function() {
        var drawings = JSON.stringify(CIQ.stxx.exportDrawings());
    
        //saves drawings with symbol as the key
        localStorage.setItem(CIQ.stxx.chart.symbol, drawings);
    }

    CIQ.restoreLayout = function(layout) {
        var importOptions = {
            managePeriodicity: true,
            preserveTicksAndCandleWidth: true
        };
        if (layout) {
            CIQ.store.commit('form/getFrequency', layout.layoutFreq)
            CIQ.stxx.importLayout(JSON.parse(layout.layout), importOptions); 
        }
    }
    
    CIQ.restorePreferences = function() {
        var pref = CIQ.localStorage.getItem("myChartPreferences");
        if (pref) CIQ.stxx.importPreferences(JSON.parse(pref));
    }
    
    CIQ.restoreDrawings = function() {
        var drawings = localStorage.getItem(CIQ.stxx.chart.symbol);
        if (drawings) CIQ.stxx.importDrawings(JSON.parse(drawings));
    }
}
export { __st_js_manage_chart_layout_ }