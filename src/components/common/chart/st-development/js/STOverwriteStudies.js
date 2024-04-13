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


import { CIQ as _CIQ } from "chartiq/js/chartiq.js";
import "./standardStudies";
import { getPropertyByString } from "@/utils"

let __js_st_studies_overwrite_ = (_exports) => {
/* global _CIQ, _timezoneJS, _SplinePlotter */


var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;

if (!CIQ.Studies) {
	console.error(
		"movingAverages feature requires first activating studies feature."
	);
} else {
	CIQ.Studies.prettify = CIQ.extend(
		{
			"2-exponential": "dema",
			"3-exponential": "tema",
			hull: "hma"
		},
		CIQ.Studies.prettify
	);

	CIQ.extend(CIQ.Studies.movingAverage, {
		conversions: {
			hma: "hull",
			dema: "2-exponential",
			tema: "3-exponential"
		},
		translations: {
			hull: "Hull",
			"2-exponential": "Double Exponential",
			"3-exponential": "Triple Exponential"
		},
		typeMap: {
			hma: "Hull",
			hull: "Hull",
			dema: "DoubleExponential",
			"2-exponential": "DoubleExponential",
			tema: "TripleExponential",
			"3-exponential": "TripleExponential"
		}
	});

	CIQ.Studies.calculateMovingAverageHull = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

		CIQ.Studies.MA("wma", sd.days, field, 0, "_WMA1", stx, sd);
		CIQ.Studies.MA("wma", Math.ceil(sd.days / 2), field, 0, "_WMA2", stx, sd);

		var i, val;
		for (i = sd.startFrom - 1; i >= 0; i--) {
			val = quotes[i][field];
			if (val && typeof val == "object") val = val[sd.subField];
			if (val || val === 0) break;
		}
		for (i++; i < quotes.length; i++) {
			var quote = quotes[i];
			quote["_MMA " + sd.name] =
				2 * quote["_WMA2 " + sd.name] - quote["_WMA1 " + sd.name];
		}

		var offset = parseInt(sd.inputs.Offset, 10);
		if (isNaN(offset)) offset = 0;

		var hmaDays = Math.floor(Math.sqrt(sd.days));
		CIQ.Studies.MA("wma", hmaDays, "_MMA " + sd.name, offset, "_HMA", stx, sd);

		var name = sd.name;
		for (var p in sd.outputs) {
			name = p + " " + name;
		}
		for (
			i = Math.max(sd.days + hmaDays - 1, sd.startFrom);
			i < quotes.length;
			i++
		) {
			quotes[i][name] = quotes[i]["_HMA " + sd.name];
		}
	};

	CIQ.Studies.calculateSTMovingAverageDoubleExponential = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

		CIQ.Studies.MA("ema", sd.days, field, 0, "_EMA1", stx, sd);
		CIQ.Studies.MA("ema", sd.days, "_EMA1 " + sd.name, 0, "_EMA2", stx, sd);

		if(sd?.parameters?.criteria?.endsWith('2')){
			var comparisonSymbol = CIQ.store.getters.getComparisonSymbol
			// 只处理计算数据源和symbol2相关的逻辑(symbol2 ma)
			if(CIQ.findBuiltinTechIndicator(null,sd.type)){
				/**根据criteria动态设定study的Y轴属*******/
				var actualXaxis = stx.getYAxisByField(stx.panels['chart'], comparisonSymbol.url);
				sd.yAxis = actualXaxis
				/****************** */
			}
		}else sd.yAxis = null

		var offset = parseInt(sd.inputs.Offset, 10);
		if (isNaN(offset)) offset = 0;
		var i, val;
		var offsetBack = offset;
		for (i = sd.startFrom - 1; i >= 0; i--) {
			val = quotes[i][field];
			if (val && typeof val == "object") val = val[sd.subField];
			if (!val && val !== 0) continue;
			if (offsetBack > 0) {
				offsetBack--;
				continue;
			}
			break;
		}
		var name = sd.name;
		for (var p in sd.outputs) {
			name = p + " " + name;
		}
		var futureTicks = [];
		for (i++; i < quotes.length; i++) {
			if (i < 2 * (sd.days - 1)) continue;
			var quote = quotes[i];
			var result = 2 * quote["_EMA1 " + sd.name] - quote["_EMA2 " + sd.name];
			if (i + offset >= 0) {
				if (i + offset < quotes.length) quotes[i + offset][name] = result;
				else {
					var ft = {};
					ft[name] = result;
					futureTicks.push(ft);
				}
			}
		}
		sd.appendFutureTicks(stx, futureTicks);
	};

	CIQ.Studies.calculateMovingAverageTripleExponential = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

		CIQ.Studies.MA("ema", sd.days, field, 0, "_EMA1", stx, sd);
		CIQ.Studies.MA("ema", sd.days, "_EMA1 " + sd.name, 0, "_EMA2", stx, sd);
		CIQ.Studies.MA("ema", sd.days, "_EMA2 " + sd.name, 0, "_EMA3", stx, sd);

		var offset = parseInt(sd.inputs.Offset, 10);
		if (isNaN(offset)) offset = 0;
		var i, val;
		var offsetBack = offset;
		for (i = sd.startFrom - 1; i >= 0; i--) {
			val = quotes[i][field];
			if (val && typeof val == "object") val = val[sd.subField];
			if (!val && val !== 0) continue;
			if (offsetBack > 0) {
				offsetBack--;
				continue;
			}
			break;
		}
		var name = sd.name;
		for (var p in sd.outputs) {
			name = p + " " + name;
		}
		var futureTicks = [];
		for (i++; i < quotes.length; i++) {
			if (i < 3 * (sd.days - 1)) continue;
			var quote = quotes[i];
			var result =
				3 * quote["_EMA1 " + sd.name] -
				3 * quote["_EMA2 " + sd.name] +
				quote["_EMA3 " + sd.name];
			if (i + offset >= 0) {
				if (i + offset < quotes.length) quotes[i + offset][name] = result;
				else {
					var ft = {};
					ft[name] = result;
					futureTicks.push(ft);
				}
			}
		}
		sd.appendFutureTicks(stx, futureTicks);
	};

	CIQ.Studies.calculateMAEnvelope = function (stx, sd) {
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		CIQ.Studies.MA(
			sd.inputs["Moving Average Type"],
			sd.days,
			field,
			0,
			"MA",
			stx,
			sd
		);
		var shiftType = sd.inputs["Shift Type"];
		var shift = sd.inputs.Shift;
		if (!shiftType) {
			//legacy
			shiftType = "percent";
			shift = sd.inputs["Shift Percentage"];
		}
		if (shiftType == "percent") {
			CIQ.Studies.calculateGenericEnvelope(
				stx,
				sd,
				shift / 100,
				"MA " + sd.name
			);
		} else if (shiftType == "points") {
			CIQ.Studies.calculateGenericEnvelope(
				stx,
				sd,
				null,
				"MA " + sd.name,
				null,
				Number(shift)
			);
		}
	};

	CIQ.Studies.calculateSTMADev = function (stx, sd) {
		debugger
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		var pts = sd.inputs["Points Or Percent"];
		if (!pts) pts = "Percent";
		var maType = sd.inputs["Moving Average Type"];
		if (!maType) maType = "exponential";
		CIQ.Studies.MA(maType, sd.days, field, 0, "_MA", stx, sd);
		var histogram = sd.name + "_hist";
		for (var i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			var quote = quotes[i];
			var val = quote[field];
			if (val && typeof val == "object") val = val[sd.subField];
			var qMA = quote["_MA " + sd.name];
			if (qMA || qMA === 0) {
				if (pts == "Points") quote[histogram] = val - qMA;
				else quote[histogram] = 100 * (val / qMA - 1);
			}
		}
		sd.outputMap = {};
		sd.outputMap[sd.name + "_hist"] = "";
	};

	// overwrite existed Studies
	CIQ.Studies.calculateSTMACDGap = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var inputs = sd.inputs,
			name = sd.name;
		if (!sd.macd1Days) sd.macd1Days = parseFloat(inputs["Fast MA Period"]);
		if (!sd.macd2Days) sd.macd2Days = parseFloat(inputs["Slow MA Period"]);
		if (!sd.signalDays) sd.signalDays = parseFloat(inputs["Signal Period"]);
		if (!sd.days) sd.days = Math.max(sd.macd1Days, sd.macd2Days, sd.signalDays);
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";

		var maType = inputs["Moving Average Type"];
		if (!maType) maType = "exponential";

		CIQ.Studies.MA(maType, sd.macd1Days, field, 0, "_MACD1", stx, sd);
		CIQ.Studies.MA(maType, sd.macd2Days, field, 0, "_MACD2", stx, sd);

		var i,
			quote,
			start = Math.max(sd.startFrom, sd.days - 1);
		for (i = start; i < quotes.length; i++) {
			quote = quotes[i];
			if (
				(quote["_MACD1 " + name] || quote["_MACD1 " + name] === 0) &&
				(quote["_MACD2 " + name] || quote["_MACD2 " + name] === 0)
			)
				quote["MACD " + name] =
					quote["_MACD1 " + name] - quote["_MACD2 " + name];
		}
		var sigMaType = inputs["Signal MA Type"];
		if (!sigMaType) sigMaType = "exponential";
		CIQ.Studies.MA(
			sigMaType,
			sd.signalDays,
			"MACD " + name,
			0,
			"SignalLine",
			stx,
			sd
		);

		var histogram = sd.name;
		for (var p in sd.outputs) {
			histogram = p + " " + histogram;
		}
		for (i = start; i < quotes.length; i++) {
			quote = quotes[i];
			var signal = quote["SignalLine " + name];
			if (!signal && signal !== 0) continue; // don't create histogram before the signal line is valid
			quote[histogram] = quote["MACD " + name] - quote["SignalLine " + name];

			if (i > start) {
				var prevQuote = quotes[i - 1];
				quote["Gap"] = quote[histogram] - prevQuote[histogram];
			}
		}
		for (i = start; i < quotes.length; i++) {
			var quote = quotes[i];
			quote[histogram] = quote["Gap"]
		}
		//sd.outputMap[histogram] = "";
		
	};
	CIQ.Studies.calculateSTAwesomeOscillator = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < 33) {
			sd.error = true;
			return;
		}

		CIQ.Studies.MA("simple", 5, "hl/2", 0, "_MA5", stx, sd);
		CIQ.Studies.MA("simple", 34, "hl/2", 0, "_MA34", stx, sd);

		for (var i = Math.max(sd.startFrom, 33); i < quotes.length; i++) {
			if (!quotes[i]) continue;
			quotes[i][sd.name + "_hist"] =
				quotes[i]["_MA5 " + sd.name] - quotes[i]["_MA34 " + sd.name];
		}
		sd.outputMap = {};
		sd.outputMap[sd.name + "_hist"] = "";
	};
	CIQ.Studies.calculateSTCenterOfGravity = function (stx, sd) {
		debugger
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days) {
			sd.error = true;
			return;
		}
		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close";
		for (var i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			var num = 0,
				den = 0;
			for (var j = 0; j < sd.days; j++) {
				var val = quotes[i - j][field];
				num -= (j + 1) * val;
				den += val;
			}
			if (den) quotes[i]["Result " + sd.name] = num / den;
		}
	};
	/** 注册overwrite Study */
	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {

	});
}

};
//__js_st_studies_overwrite_(typeof window !== "undefined" ? window : global);
export {__js_st_studies_overwrite_}