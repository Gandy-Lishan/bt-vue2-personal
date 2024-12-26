//
// Sample markers file
// This file contains functions which create sample markers.  There is a stylesheet which goes along with it as well.
// Usage: new MarkersSample(stxx);
//
import { CIQ, markers } from "chartiq/js/standard.js";
import EventBus from "@/event-bus";
import { formatStandardTime } from '@/utils'
var _css;
if (
	typeof define === "undefined" &&
	typeof module === "object" &&
	typeof require === "function"
)
	_css = require("./markersSample.scss");
else if (typeof define === "function" && define.amd)
	define(["./markersSample.scss"], function (m) {
		_css = m;
	});
else if (typeof window !== "undefined")
	CIQ.loadStylesheet("st-development/components/markers/markersSample.scss");
if (_css) CIQ.addInternalStylesheet(_css, "markersSample.scss");
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

	if(window.location.pathname.includes('/backtester')){
		CIQ.Marker.removeByLabel(CIQ.stxx, 'events');
	}

	this.activeLabels = [
		// 'circle',
		//'events',
		'triangle_buy','triangle_sell','dot_buy','dot_sell',
		// dual symbol
		'triangle_buy_2','triangle_sell_2','dot_buy_2','dot_sell_2'
	]
	this.activeLabels.forEach(function (label) {
		CIQ.Marker.removeByLabel(stx, label);
	});
	this.activeLabels = [];
};
// 仅用于setMarkerVisibility，和hideMarkers区分开
MarkersSample.prototype.setMarkerInvisibe = function (markerVisibilityType) {
	var stx = this.stx;
	//const dotVisibilityType = markerVisibilityType=='triangle_buy'?'dot_buy':'dot_sell'
	const visibilityTypeMap = {
		'triangle_buy': 'dot_buy',
		'triangle_sell': 'dot_sell',
		'triangle_buy_2': 'dot_buy_2',
		'triangle_sell_2': 'dot_sell_2',
	};
	const dotVisibilityType = visibilityTypeMap[markerVisibilityType] || null;

	CIQ.Marker.removeByLabel(stx, markerVisibilityType);
	CIQ.Marker.removeByLabel(stx, dotVisibilityType);
	this.activeLabels = this.activeLabels.filter(item=>(item!=markerVisibilityType) && (item!=dotVisibilityType))

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
	CIQ.MarkersSample.hideMarkers()
	// // 初始化markerVisibilityType为全部显示
	CIQ.MarkersSample.setMarkerVisibilityType()
	callback()
}
CIQ.addMarker = function(){
	CIQ.MarkersSample.showMarkers('mMarker')
}

// create and remove buy/sell icon on chart
CIQ.addPrompt = function(){
	var nodeGreen = document.getElementsByClassName('buy')[0]
	var nodeRed = document.getElementsByClassName('sell')[0]
	nodeGreen.style.display = "block"
	nodeRed.style.display = "block"

	// dual symbol
	var comparisonSymbol = CIQ.store.getters.getComparisonSymbol
	if(comparisonSymbol.url){
		var nodeGreen2 = document.getElementsByClassName('buy_2')[0]
		var nodeRed2 = document.getElementsByClassName('sell_2')[0]
		nodeGreen2.style.display = "block"
		nodeRed2.style.display = "block"
	}

}
CIQ.removePrompt = function(){
	for(var node of document.getElementsByClassName('buy')){
		node.style.display = "none"
	}
	for(var node of document.getElementsByClassName('sell')){
		node.style.display = "none"
	}

	// dual symbol
	var comparisonSymbol = CIQ.store.getters.getComparisonSymbol
	if(comparisonSymbol.url){
		for(var node of document.getElementsByClassName('buy_2')){
			node.style.display = "none"
		}
		for(var node of document.getElementsByClassName('sell_2')){
			node.style.display = "none"
		}
	}
}

// remove all existing trade markers
CIQ.hideMarker = function(){
	try{
		CIQ.removePrompt()
		CIQ.MarkersSample.showMarkers()
	}catch(err){}	
}

// 定义global一次性marker,不注册了
/** CPM page */
CIQ.createOneTimeScannerMarkerHighLowLine = function(date,name,pionts){
	CIQ.createOneTimePatternMarker(date,name)

	var quotes = CIQ.stxx.chart.dataSet;

	//console.time("🚗 🚗Total execution time");
    // 将 entryTradeDateArr 转换为一个字典（哈希表）
	let piontsDict = {};
	for (let i = 0; i < pionts.length; i++) {
		const standardDate = formatStandardTime(pionts[i].Date)
		piontsDict[standardDate] = true;
	}
	for (var i = 0; i < quotes.length; i++) {
		var quote = quotes[i];
		if (quote.DT) {
            var quoteTime = quote.DT.getTime();
			// 使用字典来查找
            if (piontsDict[quoteTime]) {
				// 添加study panel对应的小点
				let yAxis = piontsDict[quoteTime].PointType == 'High' ? quote['High'] : quote['Low']
				new CIQ.Marker({
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
	}
	// console.timeEnd("🚗 🚗Total execution time");
	CIQ.stxx.draw();
}
CIQ.createOneTimeScannerMarkerHammer = function(trades,date,signal){	
	CIQ.createOneTimePatternMarker(date,signal)

	// 显示trade study标记
	var newNode;
	var quotes = CIQ.stxx.chart.dataSet;

	//console.time("🚗 🚗Total execution time");
    // 将 entryTradeDateArr 转换为一个字典（哈希表）
    let entryTradeDateArr = eval('(' + trades + ')')
	let entryTradeDateDict = {};
	if(entryTradeDateArr){
		for (let i = 0; i < entryTradeDateArr.length; i++) {
			const standardDate = formatStandardTime(entryTradeDateArr[i])
			entryTradeDateDict[standardDate] = true;
		}
	}

    for (var i = 0; i < quotes.length; i++) {
        var quote = quotes[i];
        if (quote.DT) {
            var quoteTime = quote.DT.getTime();

            // 使用字典来查找
            if (entryTradeDateDict[quoteTime]) {
                newNode = document.querySelector("#stxMessage").cloneNode(true);
                newNode.id = null;
                newNode.innerHTML = signal;

                // hammer显示在进场前一天
                new CIQ.Marker({
                    stx: CIQ.stxx,
                    xPositioner: "date",
                    x: quotes[i - 1].DT,
                    label: "events",
                    node: newNode
                });
            }
        }
    }
	//console.timeEnd("🚗 🚗Total execution time");
	CIQ.stxx.draw();
}
CIQ.createOneTimeLastSignalMarker = function(date,content,comparisonSymbolUrl){
	//hoverable marker
	const standardDate = formatStandardTime(date)


	let params
	if(comparisonSymbolUrl){
		params = {
			stx: CIQ.stxx,
			xPositioner: "date",
			plotField: comparisonSymbolUrl,		// <<<<== custom field
			x: standardDate,
			label: "events",
			node: new CIQ.Marker.stPerformance({
				type: "last-signal",
				headline: `The Last Signal From Symbol ${comparisonSymbolUrl}`,
				category: 'last-signal',
				displayCategory: true,
				displayStem: false,	
			})
		}
	}else{
		params = {
			stx: CIQ.stxx,
			xPositioner: "date",
			x: standardDate,
			label: "events",
			node: new CIQ.Marker.stPerformance({
				type: "last-signal",
				headline: `The Last Signal From Symbol ${CIQ.stxx.chart.symbol}`,
				category: 'last-signal',
				displayCategory: true,
				displayStem: false,	
			})
		}
	}
	new CIQ.Marker(params);
}
CIQ.createOneTimePatternMarker = function(date,content){
	//CIQ.hideMarker()
	CIQ.store.dispatch('states/set_isMarkerShown_flag',false)
	// 显示pattern标记
	var newNode;
	
	//hoverable marker
	const standardDate = formatStandardTime(date)

	newNode = document.querySelector("#stxEventHover").cloneNode(true);
	newNode.id = null;
	newNode.querySelector(".tooltip").innerHTML = `
		<div>${content}</div>
	`
	newNode.classList.add("hoverMarker");
	new CIQ.Marker({
		stx: CIQ.stxx,
		xPositioner: "date",
		x: standardDate,
		label: "events",
		node: newNode
	});
	CIQ.stxx.draw()
}
CIQ.setMarkerVisibility = function(type){
	//let markerVisibilityType = type=='buy'? "triangle_buy": "triangle_sell"
	const visibilityTypeMap = {
		'buy': 'triangle_buy',
		'sell': 'triangle_sell',
		'buy_2': 'triangle_buy_2',
		'sell_2': 'triangle_sell_2',
	};
	let markerVisibilityType = visibilityTypeMap[type] || null;

	if(CIQ.MarkersSample) CIQ.MarkersSample.setMarkerVisibilityType(markerVisibilityType)
	if(!CIQ.MarkersSample.activeLabels.includes(markerVisibilityType)){
		CIQ.MarkersSample.showMarkers('mMarker')
	}else{
		CIQ.MarkersSample.setMarkerInvisibe(markerVisibilityType)
	}
}

/** Report page */
CIQ.createForecastMarker = async function(){
	const list = await CIQ.store.dispatch('chart/get_forecast',CIQ.stxx.chart.symbol)
	await CIQ.store.dispatch('chart/get_forecast_author_list',[...new Set(list.map(item=>item.author))])
	const bullishList = list.filter(i=>i.forecast == 'Up')
	const bearishList = list.filter(i=>i.forecast == 'Down')

		for (var i = 0; i < bullishList.length; i++) {
			const {post_date,title,url,author,timeframe} = bullishList[i]
			var newNode;
			var post_date_str = post_date.slice(0,10)
			const standardDate = formatStandardTime(post_date_str)
				newNode = document.querySelector("#stxForecast").cloneNode(true);
				newNode.id = null;
				newNode.classList.add('bullish')
				newNode.setAttribute('data-market', "bullish");
				newNode.setAttribute('data-author', author);
				newNode.setAttribute('data-timeframe', timeframe);
				newNode.innerHTML = `
				<div>
					<div class="forecast__marker-background"></div>
					<div class="forecast__marker-stem"></div>
					<div class="forecast__marker-tooltip">
						<h3>${title}</h3>
						<div style="overflow: hidden">
							<p>${post_date_str} | ${author}</p><p>${timeframe}</p>
							<a href=${url} target="_blank">Click to read report</a>
						</div>
					</div>
				</div>`;
									
				new CIQ.Marker({
					stx: CIQ.stxx,
					xPositioner: "date",
					yPositioner: "below_candle",
					x: standardDate,
					label: "bullish",
					node: newNode
				});
		}


		for (var i = 0; i < bearishList.length; i++) {
			const {post_date,title,url,author,timeframe} = bearishList[i]
			let newNode;
			var post_date_str = post_date.slice(0,10)
			const standardDate = formatStandardTime(post_date_str)
				newNode = document.querySelector("#stxForecast").cloneNode(true);
				newNode.id = null;
				newNode.classList.add('bearish')
				newNode.setAttribute('data-market', "bearish");
				newNode.setAttribute('data-author', author);
				newNode.setAttribute('data-timeframe', timeframe);
				newNode.innerHTML = `
				<div>
					<div class="forecast__marker-background"></div>
					<div class="forecast__marker-stem"></div>
					<div class="forecast__marker-tooltip">
						<h3>${title}</h3>
						<div style="overflow: hidden">
							<p>${post_date_str} | ${author}</p><p>${timeframe}</p>
							<a href=${url} target="_blank">Click to read report</a>
						</div>
					</div>
				</div>`;
		
				new CIQ.Marker({
					stx: CIQ.stxx,
					xPositioner: "date",
					x: standardDate,
					label: "bearish",
					node: newNode
				});
		}

	CIQ.stxx.draw()
}
CIQ.removeForecastMarker = async function(){
	console.log('removeForecastMarker')
	CIQ.Marker.removeByLabel(CIQ.stxx, 'bullish');
	CIQ.Marker.removeByLabel(CIQ.stxx, 'bearish');
}
export {CIQ};
export default marker;
