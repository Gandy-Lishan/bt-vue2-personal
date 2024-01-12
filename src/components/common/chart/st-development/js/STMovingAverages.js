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
import "chartiq/js/standard/studies.js";

let __js_st_studies_movingAverages_ = (_exports) => {

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

    CIQ.Studies.calculateSTMovingAverage = function (stx, sd) {
        if (!sd.chart.scrubbed) return;
        var type = sd.inputs.Type;
        if (type == "ma" || type == "sma" || !type) type = "simple"; // handle when the default inputs are passed in
        var typeMap = CIQ.Studies.movingAverage.typeMap;
        if (type in typeMap) {
            return CIQ.Studies["calculateMovingAverage" + typeMap[type]](stx, sd);
        } else if (type !== "simple") {
            return;
        }
		
        var quotes = sd.chart.scrubbed;
		
        var acc = 0;
        var vals = [];
        var name = sd.name;

        for (var p in sd.outputs) {
            name = p + " " + name;
        }

		// 拼接显示名
		// const desc = ' '+sd.name.match(/\(([^)]+)\)/)[0];
		// var name = 'MA ' + desc;

        var field = sd.inputs.Field;
        if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in
        var offset = parseInt(sd.inputs.Offset, 10);
        if (isNaN(offset)) offset = 0;
        var i,
            val,
            ft,
            start = sd.startFrom;
        // backload the past data into the array
        var offsetBack = offset;

        for (i = sd.startFrom - 1; i >= 0; i--) {
            val = quotes[i][field];
           
            if (val && typeof val == "object") val = val[sd.subField];
            if (!val && val !== 0) continue;
            if (offsetBack > 0) {
                offsetBack--;
                start = i;
                continue;
            }
            if (vals.length == sd.days - 1) break;
            acc += val;
            vals.unshift(val);
        }
        if (vals.length < sd.days - 1) {
            vals = [];
            start = 0; // not enough records to continue where left off
        }
        var futureTicks = [];
        for (i = start; i < quotes.length; i++) {
            var quote = quotes[i];
            val = quote[field];
            if (val && typeof val == "object") val = val[sd.subField];
            var notOverflowing = i + offset >= 0 && i + offset < quotes.length;
            var offsetQuote = notOverflowing ? quotes[i + offset] : null;
            if (!val && val !== 0) {
                if (offsetQuote) offsetQuote[name] = null;
                else if (i + offset >= quotes.length) {
                    ft = {};
                    ft[name] = null;
                    futureTicks.push(ft);
                }
                continue;
            }
            acc += val;
            vals.push(val);
            if (vals.length > sd.days) acc -= vals.shift();
            var myVal = vals.length == sd.days ? acc / sd.days : null;
            if (offsetQuote) offsetQuote[name] = myVal;
            else if (i + offset >= quotes.length) {
                ft = {};
                ft[name] = myVal;
                futureTicks.push(ft);
            }
        }
        sd.appendFutureTicks(stx, futureTicks);
		//sd.outputMap[name] = "MA";
    };

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

	CIQ.Studies.calculateMovingAverageDoubleExponential = function (stx, sd) {
		var quotes = sd.chart.scrubbed;

		var field = sd.inputs.Field;
		if (!field || field == "field") field = "Close"; // Handle when the default inputs are passed in

		CIQ.Studies.MA("ema", sd.days, field, 0, "_EMA1", stx, sd);
		CIQ.Studies.MA("ema", sd.days, "_EMA1 " + sd.name, 0, "_EMA2", stx, sd);

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
        console.log("STMADEV")
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

	CIQ.Studies.calculateSTCenterOfGravity = function (stx, sd) {
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

	CIQ.Studies.calculateSTROCLike = function (stx, sd) {
		var quotes = sd.chart.dataSet;
		var field = sd.inputs.Field;
		var condition = sd.inputs.condition;
		var period = sd.inputs.period;

		const desc = sd.name.substring(sd.name.indexOf('(')); // 提取从第一个左括号开始的子字符串

		//const desc = ' '+sd.name.match(/\(([^)]+)\)/)[0];
		// var showSupLine = (!sd.parameters.showSupLine && sd.parameters.showSupLine!=0)?null:sd.parameters.showSupLine
		if (!field || field == "field") field = "Close";

		// 下面为计算 ROC, ROR, MAR 的具体公式。
		// 使用中公式
		let resArr = []

		switch(condition){
			case 'ROC':
				// ROC
				// 从当前indicator数据出现那天开始计算
				let indexROC = quotes.findIndex(row=> field in row &&  row[field]!=null)
				quotes = quotes.slice(indexROC) 
				resArr = quotes.map((row, i) => {
					if(field in quotes[i] &&  quotes[i][field]!=null){
						if(i>=period){
							// 如果分母为0，直接返回0
							if(quotes[i - period][field] == 0) return 0
							
							const change = parseFloat((100 * (row[field] / quotes[i - period][field]- 1)).toFixed(4))
							//console.log(row[field] , quotes[i - period][field],row,i)
							return (change==Infinity || change==-Infinity) ? 0 : change
						}
						return NaN
					}else{
						return NaN
					}
				});
				if(resArr.length>1 && resArr.every(element => !element)){
					//CIQ.alert('There is no enough data for calculating the ROC value, please change a value')
				}
				break;
			case 'OPR':
				// OPR
				// 从当前indicator数据出现那天开始计算
				let indexOPR = quotes.findIndex(row=> field in row &&  row[field]!=null)
				quotes = quotes.slice(indexOPR) 
				const minCloseArrOPR = getPeriodParam(quotes.map(row => row[field]), "min", period, 0);
				const maxCloseArrOPR = getPeriodParam(quotes.map(row => row[field]), "max", period, 0);
				resArr = quotes.map((row, i) => {
					if(field in quotes[i] &&  quotes[i][field]!=null){
						//if(i>=period){
							// 如果分母为0，直接返回0
							if(maxCloseArrOPR[i] - minCloseArrOPR[i] == 0) return 0

							const change = parseFloat((100 * (row[field] - minCloseArrOPR[i]) / (maxCloseArrOPR[i] - minCloseArrOPR[i])).toFixed(4))
							
							return (change==Infinity || change==-Infinity) ? 0 : change
						//}
						//return NaN
					}else{
						return NaN
					}
				});
				if(resArr.length>1 && resArr.every(element => !element)){
					//CIQ.alert('There is no enough data for calculating the ROR value, please change a value')
				} 
				break;
			case 'RR':
				// Range Rank
				// 计算含当天值的排名，即数值保证在 0 - 100 之间
				let indexRR = quotes.findIndex(row=> field in row &&  row[field]!=null)
				quotes = quotes.slice(indexRR) 
				const minCloseArrRR = getPeriodParam(quotes.map(row => row[field]), "min", period, 1);
				const maxCloseArrRR = getPeriodParam(quotes.map(row => row[field]), "max", period, 1);
				resArr = quotes.map((row, i) => {
					if(field in quotes[i] &&  quotes[i][field]!=null){
						//if(i>=period){
							// 如果分母为0，直接返回0
							if(maxCloseArrRR[i] - minCloseArrRR[i] == 0) return 0

							const change = parseFloat((100 * (row[field] - minCloseArrRR[i]) / (maxCloseArrRR[i] - minCloseArrRR[i])).toFixed(4))
							
							return (change==Infinity || change==-Infinity) ? 0 : change
						//}
						//return NaN
					}else{
						return NaN
					}
				});
				if(resArr.length>1 && resArr.every(element => !element)){
					//CIQ.alert('There is no enough data for calculating the ROR value, please change a value')
				} 
				break;
			case 'MA':
				// MA
				// 从当前indicator数据出现那天开始计算
				let indexMA = quotes.findIndex(row=> field in row &&  row[field]!=null)
				quotes = quotes.slice(indexMA) 
				const maArr = quotes.map((row, i, arr) => {
					if(field in quotes[i] &&  quotes[i][field]!=null){
						if(i>=period - 1){
							return arr.slice(i - period + 1, i + 1).reduce((a, b) => a + b[field], 0) / period
						}
						return NaN
					}else{
						return NaN
					}
				});
				resArr = quotes.map((row, i) => {
					if(field in quotes[i] &&  quotes[i][field]!=null){
						if(i>=period - 1){
							return parseFloat((row[field] / maArr[i]).toFixed(4))
						}
						return NaN
					}else{
						return NaN
					}
				});
				if(resArr.length>1 && resArr.every(element => !element)){
					//CIQ.alert('There is no enough data for calculating the MA Ratio value, please change a value')
				} 
				break;
			case 'DD':
				// 公式：(Current close - Highest Close) / Highest Close
				let indexDD = quotes.findIndex(row=> field in row &&  row[field]!=null)
				quotes = quotes.slice(indexDD) 
				const maxCloseArrDD = getPeriodParam(quotes.map(row => row[field]), "max", period, 1);
				resArr = quotes.map((row, i) => {
					if(field in quotes[i] &&  quotes[i][field]!=null){
						//if(i>=period){
							// 如果分母为0，直接返回0
							if(maxCloseArrDD[i] == 0) return 0

							const change = parseFloat((100 * (row[field] - maxCloseArrDD[i]) / maxCloseArrDD[i]).toFixed(4))
							
							return (change==Infinity || change==-Infinity) ? 0 : change
						//}
						//return NaN
					}else{
						return NaN
					}
				});
				if(resArr.length>1 && resArr.every(element => !element)){
					//CIQ.alert('There is no enough data for calculating the ROR value, please change a value')
				} 
				break;
			case 'DU':
				// 公式：(Current close - Highest Close) / Highest Close
				let indexDU = quotes.findIndex(row=> field in row &&  row[field]!=null)
				quotes = quotes.slice(indexDU) 
				const minCloseArrDU = getPeriodParam(quotes.map(row => row[field]), "min", period, 1);
				resArr = quotes.map((row, i) => {
					if(field in quotes[i] &&  quotes[i][field]!=null){
						// if(i>=period){
							// 如果分母为0，直接返回0
							if(minCloseArrDU[i] == 0) return 0

							const change = parseFloat((100 * (row[field] - minCloseArrDU[i]) / minCloseArrDU[i]).toFixed(4))
							
							return (change==Infinity || change==-Infinity) ? 0 : change
						// }
						// return NaN
					}else{
						return NaN
					}
				});
				if(resArr.length>1 && resArr.every(element => !element)){
					//CIQ.alert('There is no enough data for calculating the ROR value, please change a value')
				} 
				break;
			default:
				console.error('no such condition')
		}
		
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if(resArr[i]==-Infinity){
				//console.log('-Infinity',quote)
			}
			
			quote[sd.inputs.display] = resArr[i];
			// quote['supLine'] = showSupLine;
		}

		sd.outputMap[sd.inputs.display] = "Line";
		// sd.outputMap['supLine'] = "supLine";
		

	};
	CIQ.Studies.calculateSymbolOhlcv = function (stx, sd) {
		var quotes = sd.chart.dataSet;
		var field = sd.inputs.Field;

		if (!field || field == "field") field = "Close";
		// 默认study模板
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			var RSIValue = quote[field];
			if (RSIValue) {
				var customStudyValue = RSIValue; // add code here to operate on the RSI to compute your final value based on it.
				quote["Result " + sd.name] = customStudyValue; // assign to the final field to be used by your display function.
			}
		}
		//sd.outputMap["Result " + sd.name] = "Symbol High";
	};
	CIQ.Studies.calculateHighLowLine = function (stx, sd) {
		
		var quotes = sd.chart.dataSet;
		var points = sd.parameters.points

		// 默认study模板
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			
			let item = points.find(x=>{
				var datatime = new Date(x.Date)
				var offset = datatime.getTimezoneOffset() * 60 * 1000
				const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))
				return standardDate.getTime()==quote.DT.getTime()
			})
			
			if(item){
				quote["Result " + sd.name] = item.PointType=='High'?quote.High:quote.Low; // assign to the final field to be used by your display function.
			}
		}
		//sd.outputMap["Result " + sd.name] = "Symbol High";

	};
	CIQ.Studies.calculateSTRSI = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		var field = sd.inputs.Field;
		//var showSupLine = sd.parameters.showSupLine?sd.parameters.showSupLine:null
		if (!field || field == "field") field = "Close";

		function computeRSI(avgGain, avgLoss) {
			if (avgLoss === 0) return 100;
			var rs = avgGain / avgLoss;
			return 100 - 100 / (1 + rs);
		}
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}
		for (var i = sd.startFrom; i < quotes.length; i++) {
			if (!i) continue;
			var quote = quotes[i];
			var quote1 = quotes[i - 1];
			if (!quote[field] && quote[field] !== 0) continue;
			if (!quote1[field] && quote1[field] !== 0) continue;
			var change = quote[field] - quote1[field];
			var num = Math.min(i, sd.days);

			var avgGain = quote1["_avgG " + sd.name];
			if (!avgGain) avgGain = 0;
			avgGain -= avgGain / num;

			var avgLoss = quote1["_avgL " + sd.name];
			if (!avgLoss) avgLoss = 0;
			avgLoss -= avgLoss / num;

			if (change > 0) {
				avgGain += change / num;
			} else if (change <= 0) {
				avgLoss -= change / num;
			} else continue;
			if (i >= sd.days) {
				if ((avgGain || avgGain !== 0) && (avgLoss || avgLoss !== 0))
					quote["RSI " + sd.name] = computeRSI(avgGain, avgLoss);
			}
			//intermediates
			quote["_avgG " + sd.name] = avgGain;
			quote["_avgL " + sd.name] = avgLoss;
			//quote['supLine'] = showSupLine
		}
		//sd.zoneOutput = "RSI";
		sd.outputMap["RSI " + sd.name] = "RSI";
		//sd.outputMap['supLine'] = "supLine";
	};
	CIQ.Studies.calculateSTCCI = function (stx, sd) {
		var quotes = sd.chart.scrubbed;
		if (quotes.length < sd.days + 1) {
			sd.error = true;
			return;
		}

		CIQ.Studies.MA("simple", sd.days, "hlc/3", 0, "MA", stx, sd);

		for (var i = Math.max(sd.startFrom, sd.days - 1); i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			var md = 0;
			for (var j = 0; j < sd.days; j++) {
				md += Math.abs(quotes[i - j]["hlc/3"] - quote["MA " + sd.name]);
			}
			md /= sd.days;
			if (Math.abs(md) < 0.00000001) quote["Result " + sd.name] = 0;
			else
				quote["Result " + sd.name] =
					(quote["hlc/3"] - quote["MA " + sd.name]) / (0.015 * md);
		}
	};
	CIQ.Studies.calculateOpeningGap = function (stx, sd) {
		var quotes = sd.chart.dataSet;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			var lastBar = quote
			if(i >= 1) lastBar = quotes[i-1]

			if(lastBar["Close"] == 0) return 0
			
			quote["Result " + sd.name] = parseFloat((100 * (quote["Open"] - lastBar["Close"]) / lastBar["Close"]).toFixed(4));
		}
	};
	CIQ.Studies.calculateDayofWeek = function (stx, sd) {
		var quotes = sd.chart.dataSet;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			quote["Result " + sd.name] = quote['DT'].getDay();
		}
	};
	CIQ.Studies.calculateMonthofYear = function (stx, sd) {
		var quotes = sd.chart.dataSet;
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			quote["Result " + sd.name] = quote['DT'].getMonth() + 1;
		}
	};
	CIQ.Studies.calculateConsecutiveDaysHigh = function (stx, sd) {
		var quotes = sd.chart.dataSet;
		var field = sd.inputs.Field;
		var period = sd.inputs.period;

		if (!field || field == "field") field = "Close";
		const maxCloseIndexArr = getPeriodParam(quotes.map(row => row[field]), 'maxCount', period, 1);
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			quote["Result " + sd.name] = maxCloseIndexArr[i];
		}
	};
	CIQ.Studies.calculateConsecutiveDaysLow = function (stx, sd) {
		var quotes = sd.chart.dataSet;
		var field = sd.inputs.Field;
		var period = sd.inputs.period;

		if (!field || field == "field") field = "Close";
		const minCloseIndexArr = getPeriodParam(quotes.map(row => row[field]), 'minCount', period, 1);
		for (var i = sd.startFrom; i < quotes.length; i++) {
			var quote = quotes[i];
			if (!quote) continue;
			quote["Result " + sd.name] = minCloseIndexArr[i];
		}
	};
	CIQ.Studies.calculateTypicalSentimentCycle = function (stx, sd) {
		// todo
		// var quotes = sd.chart.dataSet;
		// for (var i = sd.startFrom; i < quotes.length; i++) {
		// 	var quote = quotes[i];
		// 	if (!quote) continue;
		// 	quote["Result " + sd.name] = quote['DT'].getDay();
		// }
	};
	
	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		// 为了覆盖cci optix,用了小写的cci
		cci: {
			name: "Commodity Channel Index",
			calculateFN: CIQ.Studies.calculateSTCCI,
			inputs: { Period: 21 },
			parameters: {
				init: {
					studyOverZonesEnabled: true,
					studyOverBoughtValue: 100,
					studyOverBoughtColor: "auto",
					studyOverSoldValue: -100,
					studyOverSoldColor: "auto"
				}
			},
			attributes: {
				Period: { min: 2 }
			}
		},
		"ST ROCLike": {
            name: "ROCLike Line",
			seriesFN: function (stx, sd, quotes) {
				CIQ.Studies.displaySeriesAsLine(stx, sd, quotes);

				var showSupLine = (!sd.parameters.showSupLine && sd.parameters.showSupLine!=0)?null:sd.parameters.showSupLine
				var yAxis = CIQ.stxx.panels[sd.name].yAxis
				CIQ.Studies.drawHorizontal(stx, sd, null, showSupLine, yAxis);
			},
            calculateFN: CIQ.Studies.calculateSTROCLike,
            inputs: { Field: "field",condition: "ROC",period: 21,overlay: false},
			// outputs: { Line: "auto",supLine:'#9a9a9a' },
			outputs: { Line: "auto" },
        },
		"Symbol Open": {
            name: "Symbol Open Line",
            calculateFN: CIQ.Studies.calculateSymbolOhlcv,
            inputs: { Field: "Open",overlay: false},
			//outputs: { "Symbol High": "auto" },
        },
		"Symbol High": {
            name: "Symbol High Line",
            calculateFN: CIQ.Studies.calculateSymbolOhlcv,
            inputs: { Field: "High",overlay: false},
			//outputs: { "Symbol High": "auto" },
        },
		"Symbol Low": {
            name: "Symbol Low Line",
            calculateFN: CIQ.Studies.calculateSymbolOhlcv,
            inputs: { Field: "Low",overlay: false},
			//outputs: { "Symbol High": "#398BFF" },
        },
		"Symbol Close": {
            name: "Symbol Close Line",
            calculateFN: CIQ.Studies.calculateSymbolOhlcv,
            inputs: { Field: "Close",overlay: false},
			//outputs: { "Symbol High": "auto" },
        },
		"Symbol Volume": {
			name: "Symbol Volume Chart",
			range: "0 to max",
			yAxis: { ground: true, initialMarginTop: 0, zoom: 0 },
			seriesFN: CIQ.Studies.createVolumeChart,
			calculateFN: CIQ.Studies.calculateVolume,
			inputs: { Field: "Volume",overlay: false},
			outputs: { "Up Volume": "#8cc176", "Down Volume": "#b82c0c" }
		},
		"Center of Gravity": {
			name: "Center of Gravity",
			calculateFN: CIQ.Studies.calculateSTCenterOfGravity,
			inputs: { Period: 10, Field: "field" }
		},
		"MACDHistGap": {
			name: "MACDHistGap",
			calculateFN: CIQ.Studies.calculateSTMACDGap,
			inputs: {
				"Fast MA Period": 12,
				"Slow MA Period": 26,
				"Signal Period": 9
			},
			outputs: {
				Gap: "auto",
			}
		},
		"UpTrend Pattern": {
			name: "UpTrend Pattern",
			overlay: true,
			calculateFN: CIQ.Studies.calculateHighLowLine,
			inputs: {},
			outputs: {
				Result: "#5B9BD1",
			}
		},
		"DownTrend Pattern": {
			name: "DownTrend Pattern",
			overlay: true,
			calculateFN: CIQ.Studies.calculateHighLowLine,
			inputs: {},
			outputs: {
				Result: "#5B9BD1",
			}
		},
        "ST MA": {
            name: "Moving Average ",
            overlay: true,
            calculateFN: CIQ.Studies.calculateSTMovingAverage,
            inputs: { Period: 21, Field: "field", Type: "ma", Offset: 0 },
			outputs: { MA: "#FF000" },
        },
		"High Low": {
			name: "High Low Bands",
			overlay: true,
			seriesFN: CIQ.Studies.displayChannel,
			calculateFN: function (stx, sd) {
				sd.inputs["Moving Average Type"] = "triangular";
				CIQ.Studies.calculateMAEnvelope(stx, sd);
			},
			inputs: {
				Period: 10,
				Field: "field",
				"Shift Percentage": 5,
				"Channel Fill": true
			},
			outputs: {
				"High Low Top": "auto",
				"High Low Median": "auto",
				"High Low Bottom": "auto"
			},
			attributes: {
				"Shift Percentage": { min: 0.1, step: 0.1 }
			}
		},
		// new technical indicators in 2024
		"% of Opening Gap": {
            name: "% of Opening Gap",
			inputs: {},
            calculateFN: CIQ.Studies.calculateOpeningGap,
        },
		"Day of Week": {
            name: "Day of Week",
			inputs: {},
            calculateFN: CIQ.Studies.calculateDayofWeek,
        },
		"Month of Year": {
            name: "Month of Year",
			inputs: {},
            calculateFN: CIQ.Studies.calculateMonthofYear,
        },
		"# of Consecutive Days since High": {
            name: "# of Consecutive Days since High",
			inputs: { period: 252,Field: "field" },
            calculateFN: CIQ.Studies.calculateConsecutiveDaysHigh,
        },
		"# of Consecutive Days since Low": {
            name: "# of Consecutive Days since Low",
			inputs: { period: 252,Field: "field" },
            calculateFN: CIQ.Studies.calculateConsecutiveDaysLow,
        },
	});

			// 给上面函数用的工具函数
			function getPeriodParam(dataSeries, paramType, period, add_bar) {
				const typeDict = {
				  max: arr => Math.max(...arr),
				  min: arr => Math.min(...arr),
				  mean: arr => arr.reduce((a, b) => a + b) / arr.length,
				  sum: arr => arr.reduce((a, b) => a + b),
				  maxCount: arr => {
					let p1 = 0
					let p2 = 0
					let maxNum = arr[0]
					for(var i in arr){
						if(arr[i]<maxNum){
							p2++
						}else{
							maxNum = arr[i]
							p1 = p2
						}
					}
					return p2-p1
				  },
				  minCount: arr => {
					let p1 = 0
					let p2 = 0
					let minNum = arr[0]
					for(var i in arr){
						if(arr[i]>minNum){
							p2++
						}else{
							minNum = arr[i]
							p1 = p2
						}
					}
					return p2-p1
				  }
				};
			  
				const dataArr = [];
			  
				// for (let i = 0; i < dataSeries.length; i++) {
				//   if (i >= period) {
				// 	const tmpData = typeDict[paramType](dataSeries.slice(i - period + add_bar, i + add_bar));
				// 	console.log(dataSeries.slice(i - period + add_bar, i + add_bar),tmpData)
				// 	dataArr.push(Number(tmpData.toFixed(3)));
				//   } else {
				// 	dataArr.push(NaN);
				//   }
				// }

				// 处理range rank, drawndown以及新加的ConsecutiveDays的计算时，
				// 如果当前bar之前的交易日个数小于周期，按剩余天数算
				for (let i = 0; i < dataSeries.length; i++) {
					const sliceStart = i - period + add_bar
					const sliceEnd = i + add_bar
					const tmpData = typeDict[paramType](dataSeries.slice(sliceStart<0?0:sliceStart, sliceEnd));
					//console.log(dataSeries.slice(sliceStart<0?0:sliceStart, sliceEnd),tmpData)
					dataArr.push(Number(tmpData.toFixed(3)));
				}
			  
				return dataArr;
			  }
}

};
export {__js_st_studies_movingAverages_}
//__js_st_studies_movingAverages_(typeof window !== "undefined" ? window : global);
