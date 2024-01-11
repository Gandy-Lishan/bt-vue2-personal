import { CIQ as _CIQ, timezoneJS as _timezoneJS } from 'chartiq/js/chartiq.js'
let __st_js_drawing_ = _exports => {
	/* global _CIQ, _timezoneJS, _SplinePlotter */

	var CIQ = typeof _CIQ !== 'undefined' ? _CIQ : _exports.CIQ

	CIQ.createCorrelationPatternMatchDrawing = function(){
		// Set all drawings to permanent
		CIQ.Drawing.prototype.permanent = true;	
	
		const mockData = {'TOTAL RETURN': 21.28, 'MEDIAN RETURN': 2.31, 'AVERAGE RETURN': 2.13, 'WIN RATE': 80.0, 'AVERAGE WIN': 3.29, 'AVERAGE LOSS': -2.52, 'TOTAL TRADES': 10, 'TOTAL POSITIVE': 8, 'TOTAL NEGATIVE': 2, 'BUY & HOLD': 259.15, 'TIME IN MARKET': 8.35, 'Each Return': [5.34, 1.19, 1.43, 2.33, 2.29, 3.7, -0.02, 5.25, -5.02, 4.79], 'Start Date': ['2014-10-08', '2015-03-23', '2015-08-28', '2017-08-15', '2018-06-21', '2019-05-21', '2022-03-02', '2022-10-05', '2023-08-14', '2023-10-18'], 'End Date': ['2014-10-24', '2015-04-09', '2015-09-16', '2017-08-31', '2018-07-10', '2019-06-07', '2022-03-18', '2022-10-21', '2023-08-30', '2023-11-03'], 'Correlation Percentage': [90, 93, 91, 91, 90, 90, 90, 90, 90, 90], 'Symbol Close': [1964.58, 2091.18, 1995.31, 2471.65, 2793.84, 2873.34, 4463.12, 3752.75, 4514.87, 4358.34]}
		let quotes = pairDates(mockData)
		const yAxis = CIQ.stxx.chart.yAxis	
		const offset = (yAxis.high-yAxis.low)/4			// 依据Y轴长度设定的偏移量，以保证模式匹配阴影覆盖整个高度
		
		// // from: https://documentation.chartiq.com/CIQ.ChartEngine.html#importDrawings
		// // Programmatically add a rectangle.
		// let drawingList = quotes.map(item => {
		// 	return {
		// 		name: "rectangle",
		// 		pnl: "chart",
		// 		col: "transparent",
		// 		fc: "#7DA6F5",
		// 		ptrn: "solid",
		// 		lw: 1.1,
		// 		d0: CIQ.yyyymmddhhmmssmmm(new Date(item[0])),
		// 		d1: CIQ.yyyymmddhhmmssmmm(new Date(item[1])),
		// 		tzo0: 300,
		// 		tzo1: 300,
		// 		v0: 4593.5508906882591,
		// 		v1: 4436.3385829959514,
		// 	}
		// })
		// CIQ.stxx.importDrawings(drawingList);
		// // Now render the reconstructed drawings.
		// CIQ.stxx.draw();
	
	
	
		//from: https://documentation.chartiq.com/tutorial-Using%20and%20Customizing%20Drawing%20Tools.html, similar to (DrawingEdit.prototype.clone)
		// define or retrieve the parameters for the drawing
	
		//create factory for the drawing you want
		quotes.forEach(item => {
			var d0 = new Date(item[0])
			var d1 = new Date(item[1])
			var offset = d0.getTimezoneOffset() * 60 * 1000
			let drawing = {
				name: "rectangle",
				pnl: "chart",
				col: "transparent",
				fc: "#7DA6F5",
				ptrn: "solid",
				lw: 1.1,
				d0: CIQ.yyyymmddhhmmssmmm(new Date(d0.setTime(d0.getTime() + offset))),
				d1: CIQ.yyyymmddhhmmssmmm(new Date(d1.setTime(d1.getTime() + offset))),
				tzo0: 300,
				tzo1: 300,
				v0: 100000000,
				v1: -100000000,
			}
			var Factory = CIQ.Drawing[drawing.name];
	
			//create an empty template for that drawing
			var newDrawing = new Factory();
		
			// build the drawing from the parameters
			newDrawing.reconstruct(CIQ.stxx, drawing);
		
			// add it to the chart
			CIQ.stxx.addDrawing(newDrawing);
		})
		//signal the chart that a drawing has been added...so you can save the layout if you want.
		CIQ.stxx.changeOccurred("vector");
		// draw the chart to display it.
		CIQ.stxx.draw();
		
		function pairDates(obj) {
			const startDateArr = obj['Start Date'];
			const endDateArr = obj['End Date'];
		
			// 确保 Start Date 和 End Date 数组长度相同
			if (startDateArr.length !== endDateArr.length) {
				throw new Error('Start Date and End Date arrays must have the same length');
			}
		
			// 创建新的配对数组
			const pairArray = startDateArr.map((startDate, index) => {
				return [startDate, endDateArr[index]];
			});
		
			return pairArray;
		}
	}
}
export { __st_js_drawing_ }
