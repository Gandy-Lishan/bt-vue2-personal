//
// Sample markers file
// This file contains functions which create sample markers.  There is a stylesheet which goes along with it as well.
// Usage: new MarkersSample(stxx);
//
import { CIQ, markers } from "chartiq/js/standard.js";
var _css;
if (
	typeof define === "undefined" &&
	typeof module === "object" &&
	typeof require === "function"
)
	_css = require("./markersSample.css");
else if (typeof define === "function" && define.amd)
	define(["./markersSample.css"], function (m) {
		_css = m;
	});
else if (typeof window !== "undefined")
	CIQ.loadStylesheet("st-development/components/markers/markersSample.css");
if (_css) CIQ.addInternalStylesheet(_css, "markersSample.css");
CIQ.activateImports(markers);
var MarkersSample = function (stx) {
	this.stx = stx;
	this.activeLabels = [];
};
/**
 * The specialTypes property provides a lookup of type -> method dictionary
 * that allows to extend MarketSample#showMarkers functionality with
 * additional event types not available in this file.
 * Use #registerType to populate it as it will provide additional extensibility in future
 */
MarkersSample.specialTypes = {};
/**
 * Registers new prototype method to as type handler be available in #showMarkers
 * When invoked the registered method will receive type and renderType parameters
 *
 * Example: register video event handler
 *
 *		MarkersSample.registerType('video', 'showVideoMarkers');
 *		MarkersSample.prototype.showVideoMarkers = function (type) {
 *		}
 *
 */
MarkersSample.registerType = function (type, methodName, overwrite) {
	if (this.specialTypes[type] && !overwrite) {
		console.error(
			"ERROR: failed to register event type " +
				type +
				". Event already registered"
		);
		return;
	}
	this.specialTypes[type] = methodName;
};
MarkersSample.prototype.processLabelsAndDraw = function (labels) {
	this.activeLabels = this.activeLabels.concat(labels);
	this.stx.draw();
	return labels;
};
MarkersSample.prototype.createMarkers = function (label, markerType) {
	var stx = this.stx,
		ds = stx.chart.dataSet,
		t = stx.tickFromDate(stx.chart.endPoints.end);
	// An example of a data array to drive the marker creation
	
	var data = [];
	if (!markerType) markerType = "Simple";
	if (!ds) return;
	while (t && !ds[t]) t--;
	if (t >= 5)
		data.push({
			x: ds[t - 5].DT,
			type: label,
			category: "news",
			headline: "This is a Marker for a News Item"
		});
	if (t >= 15)
		data.push({
			x: ds[t - 15].DT,
			type: label,
			category: "earningsUp",
			headline: "This is a Marker for Earnings (+)"
		});
	if (t >= 25)
		data.push({
			x: ds[t - 25].DT,
			type: label,
			category: "earningsDown",
			headline: "This is a Marker for Earnings (-)"
		});
	if (t >= 35)
		data.push({
			x: ds[t - 35].DT,
			type: label,
			category: "dividend",
			headline: "This is a Marker for Dividends"
		});
	if (t >= 45)
		data.push({
			x: ds[t - 45].DT,
			type: label,
			category: "filing",
			headline: "This is a Marker for a Filing"
		});
	if (t >= 55)
		data.push({
			x: ds[t - 55].DT,
			type: label,
			category: "split",
			headline: "This is a Marker for a Split"
		});
	var story =
		"Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.";
	// Loop through the data and create markers
	for (var i = 0; i < data.length; i++) {
		var datum = data[i];
		datum.story = story;
		// Add some additional copy to the first marker to demonstrate the scrollbar
		if (i == 0)
			datum.story +=
				" <br><br> The marker can also accommodate a large amount of text and will allow scrolling if the content does not fit in the available space. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In risus quam, suscipit eu imperdiet sed, finibus vitae neque. Aenean gravida erat vel arcu bibendum pharetra. Nullam arcu nibh, ullamcorper a quam quis, aliquam mollis ex. Nulla lacus ligula, sollicitudin ac lacinia a, tempus nec sem. Aliquam erat volutpat. Phasellus magna mauris, maximus eget imperdiet eu, tincidunt ut neque. Maecenas rutrum nisl sed laoreet placerat. Nunc semper eu diam eget pretium. Fusce est lectus, feugiat nec metus sed, auctor laoreet ligula. Fusce et felis ut quam finibus porttitor. Fusce mollis felis quis velit rutrum laoreet. Maecenas dignissim mattis facilisis. Aenean tempor fermentum dictum.";
		new CIQ.Marker({
			stx: stx,
			label: label,
			xPositioner: "date",
			x: datum.x,
			node: new CIQ.Marker[markerType](datum)
		});
	}
	return label;
};
MarkersSample.prototype.createAbstractMarker = function (abstractType) {
	var stx = this.stx;
	var abstract = document
		.querySelector(".stx-marker-templates")
		.querySelector(".stx-marker.abstract")
		.cloneNode(true);
	Object.assign(abstract.style, {
		"z-index": 30,
		left: (0.4 * stx.chart.width).toString() + "px"
	});
	new CIQ.Marker({
		stx: stx,
		xPositioner: "none",
		yPositioner: "above_candle",
		label: abstractType,
		permanent: true,
		chartContainer: true,
		node: abstract
	});
	return abstractType;
};
MarkersSample.prototype.hideMarkers = function () {
	var stx = this.stx;
	//直接写死算了,event是hammer tag
	this.activeLabels = ['dot','circle','events']
	this.activeLabels.forEach(function (label) {
		CIQ.Marker.removeByLabel(stx, label);
	});
	this.activeLabels = [];
};
MarkersSample.prototype.hideDots = function () {
	var stx = this.stx;
	this.activeLabels = ['dot']
	this.activeLabels.forEach(function (label) {
		CIQ.Marker.removeByLabel(stx, label);
	});
	this.activeLabels = [];
};
MarkersSample.prototype.showMarkers = function (type, renderType) {
	// Remove any existing markers
	if (!type) {
		return this.hideMarkers();
	}
	
	var specialType = MarkersSample.specialTypes[type];
	
	if (specialType) {
		return this.processLabelsAndDraw(this[specialType](type, renderType));
	}
	if (type === "abstract") {
		return this.processLabelsAndDraw(this.createAbstractMarker("helicopter"));
	}
	return this.processLabelsAndDraw(this.createMarkers(type, renderType));
};
let marker = { MarkersSample };

// load trade data then render them on chart
CIQ.loadChart = function(dataSet,callback){
	CIQ.MarkersSample = new marker.MarkersSample(CIQ.stxx)
	CIQ.MarkersSample.loadDataSet(dataSet)
	callback()
}
CIQ.addMarker = function(){
	//CIQ.MarkersSample.showMarkers()
	CIQ.MarkersSample.showMarkers('mMarker')
	CIQ.addPrompt()
}

CIQ.addDot = function(){
	//CIQ.MarkersSample.showMarkers()
	CIQ.MarkersSample.showMarkers('mDot')
}
// 批量加载dot前清除所有已有dot,虽然下方study panel会自动移除，但是main panel的dot需要手动清空，
// 但是不用CIQ.hideMarker，因为它同时清除dot和marker,一般用于清空整个图表
CIQ.removeDot = function(){
	CIQ.MarkersSample.hideDots()
}

// create and remove buy/sell icon on chart
CIQ.addPrompt = function(){
	var nodeGreen = document.getElementsByClassName('buy')[0]
	var nodeRed = document.getElementsByClassName('sell')[0]
	nodeGreen.style.visibility = "visible"
	nodeRed.style.visibility = "visible"
}
CIQ.removePrompt = function(){
	for(var node of document.getElementsByClassName('buy')){
		node.style.visibility = "hidden"
	}
	for(var node of document.getElementsByClassName('sell')){
		node.style.visibility = "hidden"
	}
}

// remove all existing trade markers
CIQ.hideMarker = function(){
	try{
		CIQ.removePrompt()
		CIQ.MarkersSample.showMarkers()
	}catch(err){}	
}

// 为了方便，用一次性marker,不注册了
CIQ.createOneTimeScannerMarkerHighLowLine = function(date,name,pionts){
	CIQ.createOneTimePatternMarker(date,name)

	var quotes = CIQ.stxx.chart.dataSet;
	for (var i = 0; i < quotes.length; i++) {
		var quote = quotes[i];

		let item = pionts.find(x=>{
			var datatime = new Date(x.Date)
			var offset = datatime.getTimezoneOffset() * 60 * 1000
			const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))
			return standardDate.getTime()==quote.DT.getTime()
		})
		if(item){
			// 添加study panel对应的小点
			let yAxis = item.PointType == 'High' ? quote['High'] : quote['Low']
			let temp = new CIQ.Marker({
				stx: CIQ.stxx,
				xPositioner: "date",
				yPositioner: "value",
				y:yAxis,
				x: quote.DT,
				label: "dot",
				node: new CIQ.Marker.stPerformance({
					type: "circle",
					category: 'highlowline',
					displayCategory: false,
					displayStem: false,	
				})
			});
		}
	}

	CIQ.stxx.draw();
}

CIQ.createOneTimeScannerMarkerHammer = function(trades,date,signal){	
	CIQ.createOneTimePatternMarker(date,signal)

	// 显示trade study标记
	var newNode;
	var quotes = CIQ.stxx.chart.dataSet;
	for (var i = 0; i < quotes.length; i++) {
		var quote = quotes[i];
		let entryTradeDateArr = eval('(' + trades + ')')
		if(entryTradeDateArr){
			let item = entryTradeDateArr.find(x=>{
				var datatime = new Date(x)
				var offset = datatime.getTimezoneOffset() * 60 * 1000
				const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))
				return standardDate.getTime()==quote.DT.getTime()
			})
			if(item){
				newNode = document.querySelector("#stxMessage").cloneNode(true);
				newNode.id = null;
				newNode.innerHTML = signal;
				
				// hammer显示在进场前一天
				new CIQ.Marker({
					stx: CIQ.stxx,
					xPositioner: "date",
					x: quotes[i-1].DT,
					label: "events",
					node: newNode
				});
			}
		}
	}

	CIQ.stxx.draw();
}

CIQ.createOneTimePatternMarker = function(date,content){
	//CIQ.hideMarker()
	CIQ.store.dispatch('states/set_isMarkerShown_flag',false)
	// 显示pattern标记
	var newNode;
	//hoverable marker
	var datatime = new Date(date)
	var offset = datatime.getTimezoneOffset() * 60 * 1000
	const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))

	newNode = document.querySelector("#stxEventHover").cloneNode(true);
	newNode.id = null;
	newNode.querySelector(".tooltip").title = content;
	newNode.classList.add("hoverMarker");
	new CIQ.Marker({
		stx: CIQ.stxx,
		xPositioner: "date",
		x: standardDate,
		label: "events",
		node: newNode
	});
}
export {CIQ};
export default marker;
