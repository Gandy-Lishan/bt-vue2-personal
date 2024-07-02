import { CIQ as _CIQ, timezoneJS as _timezoneJS } from 'chartiq/js/chartiq.js'
let __st_js_drawing_ = _exports => {
    /* global _CIQ, _timezoneJS, _SplinePlotter */

    var CIQ = typeof _CIQ !== 'undefined' ? _CIQ : _exports.CIQ

    CIQ.createCorrelationPatternMatchDrawing = function(dataSet, type){
        // CIQ.Drawing.rectangle.prototype.intersected = function (tick, value, box) {
        //     if (!this.p0 || !this.p1) return null; // in case invalid drawing (such as from panel that no longer exists)
        //     var pointsToCheck = { 0: this.p0, 1: this.p1 };
        //     for (var pt in pointsToCheck) {
        //         if (
        //             this.pointIntersection(pointsToCheck[pt][0], pointsToCheck[pt][1], box)
        //         ) {
        //             this.highlighted = "p" + pt;
        //             return {
        //                 action: "drag",
        //                 point: "p" + pt
        //             };
        //         }
        //     }
        //     if (this.boxIntersection(tick, value, box)) {
        //         this.highlighted = true;
        //         var mSticky = CIQ.stxx.controls.mSticky;
        //         var mStickyInterior = mSticky && mSticky.querySelector(".mStickyInterior");
        //         if (mStickyInterior) {
        //             // var lines = [];
        //             // lines.push(stx.translateIf(CIQ.capitalize(this.name)));
        //             // if (this.getYValue)
        //             //     lines.push(
        //             //         stx.translateIf(this.field || stx.defaultPlotField || "Close")
        //             //     );
        //             // lines.push(mStickyInterior.innerHTML);
        //             mStickyInterior.innerHTML = `startDate: ${this.d0.slice(0,8)} </br>endDate: ${this.d1.slice(0,8)}`;
        //         }
        //         return {
        //             action: "move",
        //             p0: CIQ.clone(this.p0),
        //             p1: CIQ.clone(this.p1),
        //             tick: tick,
        //             value: value
        //         };
        //     }
        //     return null;
        // };


        // Set all drawings to permanent
        CIQ.Drawing.prototype.permanent = true;    
        let quotes
        if(type == 'scannerai'){
            quotes = pairDatesScanner(dataSet)
        }
        else if(type == 'cpm'){
            quotes = pairDatesCPM(dataSet)
        }
        //const yAxis = CIQ.stxx.chart.yAxis    
        //const offset = (yAxis.high-yAxis.low)/4            // 依据Y轴长度设定的偏移量，以保证模式匹配阴影覆盖整个高度
        
        // // from: https://documentation.chartiq.com/CIQ.ChartEngine.html#importDrawings
        // // Programmatically add a rectangle.
        // let drawingList = quotes.map(item => {
        //     return {
        //         name: "rectangle",
        //         pnl: "chart",
        //         col: "transparent",
        //         fc: "#7DA6F5",
        //         ptrn: "solid",
        //         lw: 1.1,
        //         d0: CIQ.yyyymmddhhmmssmmm(new Date(item[0])),
        //         d1: CIQ.yyyymmddhhmmssmmm(new Date(item[1])),
        //         tzo0: 300,
        //         tzo1: 300,
        //         v0: 4593.5508906882591,
        //         v1: 4436.3385829959514,
        //     }
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
    }
    
    CIQ.createCPMMarker = function(dataSet){
        let quotes = pairDates(dataSet)
        quotes.forEach(item => { 
            // 显示pattern标记
            var newNode;
            //hoverable marker
            var datatime = new Date(item[1])
            var offset = datatime.getTimezoneOffset() * 60 * 1000
            const standardDate = new Date(datatime.setTime(datatime.getTime() + offset))

            newNode = document.querySelector("#stxEventHover").cloneNode(true);
            newNode.id = null;
            newNode.querySelector(".tooltip").innerHTML = `
                <div>Start Date: ${item[0]}</div>
                <div>End Date: ${item[1]}</div>
                <div>Correlation: ${item[2]}%</div>
            `;
            newNode.classList.add("hoverMarker");
            new CIQ.Marker({
                stx: CIQ.stxx,
                xPositioner: "date",
                x: standardDate,
                label: "events",
                node: newNode
            });
        })
        CIQ.stxx.draw()
    }

    function pairDatesCPM(obj) {
        const startDateArr = obj['Start Date'];
        const endDateArr = obj['End Date'];
        const corrArr = obj['Correlation Percentage']

        // 确保 Start Date 和 End Date 数组长度相同
        if (startDateArr.length !== endDateArr.length) {
            throw new Error('Start Date and End Date arrays must have the same length');
        }

        // 创建新的配对数组
        const pairArray = startDateArr.map((startDate, index) => {
            return [startDate, endDateArr[index], corrArr[index]];
        });

        return pairArray;
    }
    function pairDatesScanner(obj) {
        const startDateArr = obj['Start Date'];
        const endDateArr = obj['End Date'];
        const corrArr = obj['Correlation Percentage']

        // 确保 Start Date 和 End Date 数组长度相同
        if (startDateArr.length !== endDateArr.length) {
            throw new Error('Start Date and End Date arrays must have the same length');
        }

        // 创建新的配对数组
        const pairArray = startDateArr.map((startDate, index) => {
            return [startDate, endDateArr[index], corrArr[index]];
        });

        return pairArray;
    }
}

export { __st_js_drawing_ }