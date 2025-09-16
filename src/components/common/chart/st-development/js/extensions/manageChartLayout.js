import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";

// 一些共用工具函数，可以分离出来
let __st_js_manage_chart_layout_ = (_exports) => {
    /* global _CIQ, _timezoneJS, _SplinePlotter */
    var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

    CIQ.saveLayout = function(name) {
        let stx = CIQ.stxx
        var layout = JSON.stringify(CIQ.stxx.exportLayout(true));
        let layoutFreq = CIQ.store.state.form.exitFrequency
        let chartType = stx.layout.chartType
        let uid = crypto.randomUUID()
        let pref = savePreferences()
        let themes = document.querySelector("cq-context").classList.value.indexOf("ciq-night") != -1 ? 'night' : 'day'
        
        let customizedLayouts = {}
        customizedLayouts.headsUp = stx.layout.headsUp
        customizedLayouts.lastPriceLabel = stx.layout.lastPriceLabel
        customizedLayouts.xAixsGridLine = stx.layout.xAixsGridLine
        customizedLayouts.crosshair = stx.layout.crosshair

        let obj = {id:uid,name,layout,layoutFreq,chartType,pref,themes,customizedLayouts}
        return obj
    }
    
    const savePreferences = function() {
        var preferences = JSON.stringify(CIQ.stxx.exportPreferences());
        return preferences
        // localStorage.setItem("myChartPreferences", preferences);
    }
    
    const saveDrawings = function() {
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
            CIQ.store.dispatch('chart/set_chart_type', layout.chartType)
            CIQ.isRestoreLayout = true
            CIQ.stxx.importLayout(JSON.parse(layout.layout), importOptions); 
            restorePreferences(layout.pref)
            restoreThemes(CIQ.stxx, layout.themes)
            restoreCustomizedLayouts(CIQ.stxx, layout.customizedLayouts)
        }
    }
    
    const restorePreferences = function(pref) {
        CIQ.stxx.importPreferences(JSON.parse(pref));
    }
    
    const restoreCustomizedLayouts = function(stx, customizedLayouts) {
        stx.layout.headsUp = customizedLayouts.headsUp;
		
        // lastPriceLabel, 同componentUI Line3866
		stx.layout.lastPriceLabel = customizedLayouts.lastPriceLabel;
        var mNode = document.getElementsByClassName('lastP')[0]
        if (stx.layout.lastPriceLabel) {
			mNode.classList.add('active')
			stx.chart.yAxis.drawCurrentPriceLabel = true
		} else {
			mNode.classList.remove('active')
			stx.chart.yAxis.drawCurrentPriceLabel = false
		}

		stx.layout.xAixsGridLine = customizedLayouts.xAixsGridLine
        var mNode = document.getElementsByClassName('grid')[0]
		if (stx.layout.xAixsGridLine) {
			mNode.classList.add('active')
			stx.chart.yAxis.displayGridLines = true
			stx.chart.xAxis.displayGridLines = true
		} else {
			mNode.classList.remove('active')
			stx.chart.yAxis.displayGridLines = false
			stx.chart.xAxis.displayGridLines = false
		}

		stx.layout.crosshair = customizedLayouts.crosshair;

		stx.changeOccurred("layout");
		stx.draw();
    }

    const restoreThemes = function(stxx, themes) {
        // clear out the old styles to allow new ones to be cached in; and redraw.
        if(themes == 'day') {
            document.querySelector("cq-context").classList.remove('ciq-night');
            stxx.styles={};stxx.draw();
        }else if(themes == 'night') {
            document.querySelector("cq-context").classList.add('ciq-night');
            stxx.styles={};stxx.draw();
        }
    }

    const restoreDrawings = function() {
        var drawings = localStorage.getItem(CIQ.stxx.chart.symbol);
        if (drawings) CIQ.stxx.importDrawings(JSON.parse(drawings));
    }
}
export { __st_js_manage_chart_layout_ }