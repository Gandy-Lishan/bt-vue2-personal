/**
 *	8.3.0
 *	Generation date: 2021-11-02T13:40:51.589Z
 *	Client name: sundial capital research
 *	Package Type: Technical Analysis
 *	License type: annual
 *	Expiration date: "2022/10/01"
 *	Domain lock: ["127.0.0.1","localhost","sentimentrader.com","18.117.142.18","bt20.sentimentrader.com"]
 *	iFrame lock: true
 */

/***********************************************************
 * Copyright by ChartIQ, Inc.
 * Licensed under the ChartIQ, Inc. Developer License Agreement https://www.chartiq.com/developer-license-agreement
*************************************************************/
/*************************************** DO NOT MAKE CHANGES TO THIS LIBRARY FILE!! **************************************/
/* If you wish to overwrite default functionality, create a separate file with a copy of the methods you are overwriting */
/* and load that file right after the library has been loaded, but before the chart engine is instantiated.              */
/* Directly modifying library files will prevent upgrades and the ability for ChartIQ to support your solution.          */
/*************************************************************************************************************************/
/* eslint-disable no-extra-parens */


import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";



let __st_js_chartengine_prototype_overwrite_ = (_exports) => {
/* global _CIQ, _timezoneJS, _SplinePlotter */

var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (CIQ.ChartEngine) {
	/**
	 * Calculates the Median Price for the dataSet.
	 * @private
	 * @param {CIQ.ChartEngine.Chart} chart The chart to update.
	 * @param {array} data The data to process, if omitted, uses chart.dataSet
	 * @memberof CIQ.ChartEngine
	 */
	CIQ.ChartEngine.prototype.calculateMedianPrice = function (chart, data) {
		//debugger
		if (!data) data = chart.dataSet;

		// var field	// 它是流动的
		// if(sd.parameters.isComparison){
		// 	field = CIQ.store.getters.getComparisonSymbol.url
		// }

		var d;
		for (var i = 0; i < data.length; ++i) {
			d = data[i];
			d["hl/2"] = (d.High + d.Low) / 2;
		}
	};
}

};
// __st_js_standard_studies_(typeof window !== "undefined" ? window : global);
export {__st_js_chartengine_prototype_overwrite_}

