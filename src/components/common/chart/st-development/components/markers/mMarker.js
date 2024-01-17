//
// Sample trade analytics with markers
// This file contains functions which create a sample implementation of post trade analysis using markers.  This file is meant to be used in conjuction with the markersSample.js file by extending the functionality of MarkersSample. There is a stylesheet which goes along with it as well.
// Usage: new MarkersSample(stxx);
//
import { CIQ, markers } from "chartiq/js/standard.js";
import marker from "./markersSample.js";
import "./highPerformanceMarkers.js"
var _css;
if (
	typeof define === "undefined" &&
	typeof module === "object" &&
	typeof require === "function"
)
	_css = require("./tradeAnalyticsSample.css");
else if (typeof define === "function" && define.amd)
	define(["./tradeAnalyticsSample.css"], function (m) {
		_css = m;
	});
else if (typeof window !== "undefined")
	CIQ.loadStylesheet("st-development/components/markers/tradeAnalyticsSample.css");
if (_css) CIQ.addInternalStylesheet(_css, "tradeAnalyticsSample.css");
CIQ.activateImports(markers);

CIQ.Marker.STSimple = function (params) {
	var node = (this.node = document.createElement("div"));
	node.className = "stx-marker";
	node.classList.add(params.type);
	if (params.category) node.classList.add(params.category);
	var stem = CIQ.newChild(node, "div", "stx-stem");
	stem.style.float = 'none'
	stem.style.marginLeft = '12px'
	
	var visual = CIQ.newChild(node, "div", "stx-visual");

	var expand;
	if (params.type == "callout") {
		var content = CIQ.newChild(visual, "div", "stx-marker-content");
		CIQ.newChild(content, "h4", null, params.headline);
		expand = CIQ.newChild(content, "div", "stx-marker-expand");
		CIQ.newChild(expand, "p", null, params.story);
	} else {
		expand = CIQ.newChild(node, "div", "stx-marker-expand");
		CIQ.newChild(expand, "h4", null, params.headline);
		CIQ.newChild(expand, "p", null, params.story);
		CIQ.safeClickTouch(expand, function (e) {
			node.classList.toggle("highlight");
		});
	}

	function cb() {
		CIQ.Marker.positionContentVerticalAndHorizontal(node);
	}
	CIQ.safeClickTouch(visual, function (e) {
		node.classList.toggle("highlight");
		setTimeout(cb, 10);
	});
	this.nodeType = "Simple";
	this.expand = expand;
};

CIQ.inheritsFrom(CIQ.Marker.STSimple, CIQ.Marker.NodeCreator, false);

const MarkersSample = marker.MarkersSample;
MarkersSample.registerType("mMarker", "showmMarker");

let mDataSet = []
let markerVisibilityType	//marker可见性按钮状态变量
MarkersSample.prototype.loadDataSet = function(dataSet){
	mDataSet =  dataSet
},
MarkersSample.prototype.setMarkerVisibilityType = function(type){
	markerVisibilityType =  type
},

MarkersSample.prototype.showmMarker = function () {
	if (!CIQ.Marker.stPerformance) {
		return console.error(
			"tradeAnalyticsSample feature requires first activating highPerformanceMarkers feature."
		);
	}

	// 先设置需要显示的marker类型，默认加载是全选，如果是marker可见性按钮点击操作的话则部分可见
	let activeLabels = []
	if(!markerVisibilityType){
		activeLabels.push(...["triangle_buy","triangle_sell","dot_buy","dot_sell"])
	}else{
		activeLabels.push(...[markerVisibilityType,markerVisibilityType == "triangle_buy"?'dot_buy':'dot_sell'])
	}

	//var markerTypes = ["analysis","dividend"];
	let { stx } = this;
	// const startTime = performance.now()
	for (var data in mDataSet) {
			//var color = mDataSet[data].Type === 'BUY' ? 0 : 1
			
			// 为了兼容dot的数据源
			var datatime = new Date(mDataSet[data].DT || mDataSet[data].Date)
			var offset = datatime.getTimezoneOffset() * 60 * 1000
			const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))
			var quote =null
			var pms, qms;
			var xPosition =null

			// 传统搜索dots
			// 如果交易日期在数据源中找不到则把marker吸附在相邻的日期上
			// for (let i = 0; i < CIQ.stxx.chart.dataSet.length; i++) {
			// 	qms = CIQ.stxx.chart.dataSet[i].DT;
			// 	pms = qms;
			// 	if (i > 0) pms = CIQ.stxx.chart.dataSet[i - 1].DT;
			// 	// If the event lands on that day, or if the event landed between bars
			// 	if (qms.getTime() == standardDate.getTime()) {
			// 		xPosition = standardDate;
			// 		quote = CIQ.stxx.chart.dataSet[i]
			// 		break;
			// 	} else if (qms.getTime() > standardDate.getTime() && pms.getTime() < standardDate.getTime()) {
			// 		xPosition = pms;
			// 		quote = CIQ.stxx.chart.dataSet[Math.max(i - 1, 0)]
			// 		console.log('marker吸附!!!!!!: ',xPosition)
			// 		break;
			// 	} else if (standardDate.getTime() < qms.getTime()) {
			// 		xPosition = null;
			// 		// marker date is in distant past, shortcircuit the logic for performance.
			// 		quote = null
			// 		break;
			// 	}
			// }

			// 二分法搜索dots
			let low = 0;
			let high = CIQ.stxx.chart.dataSet.length - 1;
			while (low <= high) {
				let mid = Math.floor((low + high) / 2);
				qms = CIQ.stxx.chart.dataSet[mid].DT;
	
				if (qms.getTime() === standardDate.getTime()) {
					xPosition = standardDate;
					quote = CIQ.stxx.chart.dataSet[mid];
					//console.log('marker匹配#######: ',xPosition)
					break;
				} else if (qms.getTime() < standardDate.getTime()) {
					low = mid + 1;
				} else {
					high = mid - 1;
				}
			}
			// 如果交易日期在数据源中找不到则把marker吸附在相邻的日期上
			// (吸附功能一般情况下是用在切换timeframe时，如果禁用了此功能，则不会进此判断)
			if (!xPosition) {			
				if (high >= 0 && high < CIQ.stxx.chart.dataSet.length) {
					pms = CIQ.stxx.chart.dataSet[high].DT;
					qms = pms
					if(high < CIQ.stxx.chart.dataSet.length-1) qms = CIQ.stxx.chart.dataSet[high + 1].DT;
					// If the event lands on that day, or if the event landed between bars
					if (qms.getTime() > standardDate.getTime() && pms.getTime() < standardDate.getTime()) {
						xPosition = pms;
						quote = CIQ.stxx.chart.dataSet[Math.max(high, 0)]
						//console.log('marker吸附!!!!!!!!!!: ',xPosition)
					} else if (standardDate.getTime() < qms.getTime()) {
						xPosition = null;
						// marker date is in distant past, shortcircuit the logic for performance.
						quote = null
						//console.log('marker不存在@@@@@@@@@: ',xPosition)
					}
				}
			}
			//if(!quote) console.log('error marker position', quote,xPosition,standardDate,high,CIQ.stxx.chart.dataSet.length - 1)
			
			// 绘制Marker
			if(activeLabels.includes("triangle_buy") && (mDataSet[data].Type || mDataSet[data].TradeStatus) == "BUY"){
				// let marker = new CIQ.Marker({
				// 	stx: stx,
				// 	label: "circle",
				// 	xPositioner: "date",
				// 	yPositioner: "below_candle",
				// 	x: standardDate,
				// 	node: new CIQ.Marker.STSimple({
				// 		type: "circle",
				// 		headline: mDataSet[data].Type,
				// 		category: markerTypes[color],
				// 		story:
				// 			 'trade entered on ' +  mDataSet[data].DT + '\nat ' + mDataSet[data].Price + '\ndue to ' + mDataSet[data]['Indicator'][0]
				// 	})
					
				// });
				new CIQ.Marker({
					stx: stx,
					label: "triangle_buy",
					xPositioner: "date",
					yPositioner: "below_candle",
					x: standardDate,
					node: new CIQ.Marker.stPerformance({
						type: "triangle",
						headline: mDataSet[data].Type || mDataSet[data].TradeStatus,
						category: 'buy',
						story:
							 'trade entered on ' +  (mDataSet[data].DT || mDataSet[data].Date) + '\nat ' + (mDataSet[data].Price || mDataSet[data].TradePrice) + '\ndue to ' + mDataSet[data]['Indicator'][0],
						displayCategory: false,
						displayStem: true,	
						invert: true,
					})
				});

				// 循环所有study
				if(!quote) continue
				for(var i in CIQ.stxx.layout.studies){
					const panel = CIQ.stxx.layout.studies[i]['panel'] 
					// 如果是一些technical indicator， 输出的线可能有多条，需要根据outputMap遍历绘制mDot
					for(var type in CIQ.stxx.layout.studies[i]['outputMap']){
						if(Object.keys(quote).indexOf(type)==-1) continue
						const yAxis = quote[type]
						// 添加study panel对应的小点
						new CIQ.Marker({
							stx: stx,
							xPositioner: "date",
							yPositioner: "value",
							y:yAxis,
							panelName: panel,
							x: xPosition,
							label: "dot_buy",
							node: new CIQ.Marker.stPerformance({
								type: "circle",
								category: 'trade-buy',
								displayCategory: false,
								displayStem: false,	
							})
						});
					}
				}	
			}else if(activeLabels.includes("triangle_sell") && (mDataSet[data].Type || mDataSet[data].TradeStatus) == "SELL"){
				// let marker = new CIQ.Marker({
				// 	stx: stx,
				// 	label: "circle",
				// 	xPositioner: "date",
				// 	x: standardDate,
				// 	node: new CIQ.Marker.STSimple({
				// 		type: "circle",
				// 		headline: mDataSet[data].Type,
				// 		category: markerTypes[color],
				// 		story:
				// 			'trade entered on ' +  mDataSet[data].DT + '\nat ' + mDataSet[data].Price + '\ndue to ' + mDataSet[data]['Indicator'][0]
				// 	})
				// });
				new CIQ.Marker({
					stx: stx,
					label: "triangle_sell",
					xPositioner: "date",
					x: standardDate,
					node: new CIQ.Marker.stPerformance({
						type: "triangle",
						headline: mDataSet[data].Type || mDataSet[data].TradeStatus,
						category: 'sell',
						story:
							'trade entered on ' +  (mDataSet[data].DT || mDataSet[data].Date) + '\nat ' + (mDataSet[data].Price || mDataSet[data].TradePrice) + '\ndue to ' + mDataSet[data]['Indicator'][0],
						displayCategory: false,
						displayStem: true,	
						
					})
				});

				// 循环所有study
				if(!quote) continue
				for(var i in CIQ.stxx.layout.studies){
					const panel = CIQ.stxx.layout.studies[i]['panel'] 
					// 如果是一些technical indicator， 输出的线可能有多条，需要根据outputMap遍历绘制mDot
					for(var type in CIQ.stxx.layout.studies[i]['outputMap']){
						if(Object.keys(quote).indexOf(type)==-1) continue
						const yAxis = quote[type]
						// 添加study panel对应的小点
						new CIQ.Marker({
							stx: stx,
							xPositioner: "date",
							yPositioner: "value",
							y:yAxis,
							panelName: panel,
							x: xPosition,
							label: "dot_sell",
							node: new CIQ.Marker.stPerformance({
								type: "circle",
								category: 'trade-sell',
								displayCategory: false,
								displayStem: false,	
							})
						});
					}
				}	
			}
			
	}
	// const endTime = performance.now();
	// console.log(endTime - startTime)
	// return ["circle"];
	return activeLabels;
};

export default marker;
