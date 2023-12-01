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
MarkersSample.registerType("mDot", "showmDot");
let mDataSet = []
MarkersSample.prototype.loadDataSet = function(dataSet){
	mDataSet =  dataSet
},
MarkersSample.prototype.showmMarker = function () {
	if (!CIQ.Marker.stPerformance) {
		return console.error(
			"tradeAnalyticsSample feature requires first activating highPerformanceMarkers feature."
		);
	}
	// 批量加载dot前清除所有已有dot,虽然下方study panel会自动移除，但是main panel的dot需要手动清空，
	// 但是不用CIQ.hideMarker，因为它同时清除dot和marker,一般用于清空整个图表
	
	//CIQ.removeDot()
	var markerTypes = ["analysis","dividend"];
	let { stx } = this;
	for (var data in mDataSet) {
			var color = mDataSet[data].Type === 'BUY' ? 0 : 1
			
			var datatime = new Date(mDataSet[data].DT)
			var offset = datatime.getTimezoneOffset() * 60 * 1000
			const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))
			var quote
			var pms, qms;
			var xPosition
			for (let i = 0; i < CIQ.stxx.chart.dataSet.length; i++) {
				qms = CIQ.stxx.chart.dataSet[i].DT;
				pms = qms;
				if (i > 0) pms = CIQ.stxx.chart.dataSet[i - 1].DT;
				// If the event lands on that day, or if the event landed between bars
				if (qms.getTime() == standardDate.getTime()) {
					xPosition = standardDate;
					quote = CIQ.stxx.chart.dataSet[i]
					break;
				} else if (qms.getTime() > standardDate.getTime() && pms.getTime() < standardDate.getTime()) {
					xPosition = pms;
					quote = CIQ.stxx.chart.dataSet[Math.max(i - 1, 0)]
					break;
				} else if (standardDate.getTime() < qms.getTime()) {
					xPosition = null;
					// marker date is in distant past, shortcircuit the logic for performance.
					quote = null
					break;
				}
			}
			
			if(mDataSet[data].Type == "BUY"){
				var a = new CIQ.Marker({
					stx: stx,
					label: "circle",
					xPositioner: "date",
					yPositioner: "below_candle",
					x: standardDate,
					node: new CIQ.Marker.STSimple({
						type: "circle",
						headline: mDataSet[data].Type,
						category: markerTypes[color],
						story:
							 'trade entered on ' +  mDataSet[data].DT + '\nat ' + mDataSet[data].Price + '\ndue to ' + mDataSet[data]['Indicator'][0]
					})
					
				});

				// 循环所有study
				for(var i in CIQ.stxx.layout.studies){
					const panel = CIQ.stxx.layout.studies[i]['panel'] 
					// 如果是一些technical indicator， 输出的线可能有多条，需要根据outputMap遍历绘制mDot
					for(var type in CIQ.stxx.layout.studies[i]['outputMap']){
						if(Object.keys(quote).indexOf(type)==-1) continue
						const yAxis = quote[type]
						// 添加study panel对应的小点
						let temp = new CIQ.Marker({
							stx: stx,
							xPositioner: "date",
							yPositioner: "value",
							y:yAxis,
							panelName: panel,
							x: xPosition,
							label: "dot",
							node: new CIQ.Marker.STSimple({
								type: "circle",
								category: 'trade-buy',
								displayCategory: false,
								displayStem: false,	
							})
						});
					}
				}	
			}else{
				var a = new CIQ.Marker({
					stx: stx,
					label: "circle",
					xPositioner: "date",
					x: standardDate,
					node: new CIQ.Marker.STSimple({
						type: "circle",
						headline: mDataSet[data].Type,
						category: markerTypes[color],
						story:
							'trade entered on ' +  mDataSet[data].DT + '\nat ' + mDataSet[data].Price + '\ndue to ' + mDataSet[data]['Indicator'][0]
					})

				});

				// 循环所有study
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
							label: "dot",
							node: new CIQ.Marker.STSimple({
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
	return ["circle"];
};
// 加载单个indicator时更新红点
MarkersSample.prototype.showmDot = function () {
	if (!CIQ.Marker.stPerformance) {
		return console.error(
			"tradeAnalyticsSample feature requires first activating highPerformanceMarkers feature."
		);
	}
	// 批量加载dot前清除所有已有dot,虽然下方study panel会自动移除，但是main panel的dot需要手动清空，
	// 但是不用CIQ.hideMarker，因为它同时清除dot和marker,一般用于清空整个图表
	//CIQ.removeDot()

	let { stx } = this;
	console.log('mDataSet',mDataSet)
	for (var data in mDataSet) {		
			var datatime = new Date(mDataSet[data].Date)
			var offset = datatime.getTimezoneOffset() * 60 * 1000
			const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))
			//const quote = CIQ.stxx.chart.dataSet.find(item=>item.DT.getTime()==standardDate.getTime())
			// 可能是timeframe不一致，需要进一步判断是否为timframe差异，并吸附最近的bar
			// 这里引用了markers 255行的判断逻辑
			var quote
			var pms, qms;
			var xPosition
			for (let i = 0; i < CIQ.stxx.chart.dataSet.length; i++) {
				qms = CIQ.stxx.chart.dataSet[i].DT;
				pms = qms;
				if (i > 0) pms = CIQ.stxx.chart.dataSet[i - 1].DT;
				// If the event lands on that day, or if the event landed between bars
				if (qms.getTime() == standardDate.getTime()) {
					xPosition = standardDate;
					quote = CIQ.stxx.chart.dataSet[i]
					break;
				} else if (qms.getTime() > standardDate.getTime() && pms.getTime() < standardDate.getTime()) {
					xPosition = pms;
					quote = CIQ.stxx.chart.dataSet[Math.max(i - 1, 0)]
					break;
				} else if (standardDate.getTime() < qms.getTime()) {
					xPosition = null;
					// marker date is in distant past, shortcircuit the logic for performance.
					quote = null
					break;
				}
			}
			// marker date is in distant past, jump out the outter loop
			if(!quote) break
			// 循环所有study
			for(var i in CIQ.stxx.layout.studies){	
				const panel = CIQ.stxx.layout.studies[i]['panel'] 
				// 如果是一些technical indicator， 输出的线可能有多条，需要根据outputMap遍历绘制mDot
				for(var type in CIQ.stxx.layout.studies[i]['outputMap']){
					if(Object.keys(quote).indexOf(type)==-1) continue
					const yAxis = quote[type]
					if(mDataSet[data].TradeStatus == "BUY"){
						// 添加study panel对应的小点
						new CIQ.Marker({
							stx: stx,
							xPositioner: "date",
							yPositioner: "value",
							y:yAxis,
							panelName: panel,
							x: xPosition,
							label: "dot",
							node: new CIQ.Marker.STSimple({
								type: "circle",
								category: 'trade-buy',
								displayCategory: false,
								displayStem: false,	
							})
						});
					}else{
						// 添加study panel对应的小点
						new CIQ.Marker({
							stx: stx,
							xPositioner: "date",
							yPositioner: "value",
							y:yAxis,
							panelName: panel,
							x: xPosition,
							label: "dot",
							node: new CIQ.Marker.STSimple({
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
	return ["circle"];
};

export default marker;
