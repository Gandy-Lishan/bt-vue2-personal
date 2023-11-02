/**
 *	2.2.0
 *	contains customized functions related to indicator loading and CSV output file generation
 */
 import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";
 import {config} from "../feeds/STDataFeedAccessUrl.js"

 let __st_js_userownIndicator_ = (_exports) => {
 /* global _CIQ, _timezoneJS, _SplinePlotter */
 
 var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
    // user's own indicator的 weight indicator加载函数单独设定
    var symbol

    CIQ.displayWeightOwnIndicator = async function(previousState,updatedState,combinedStudy){
        CIQ.addCover()
        // 提取indicator移除列表和新增列表,
        const { addedItems, removedItems } = findAddedAndRemovedItems(previousState, updatedState);

        console.log('addedItems',addedItems,removedItems)
        
        
        // symbol加载，识别第一个为默认图标symbol,其它symbol作为serie加载,必须遍历加载，不然很难管理
        manageSymbolSerie(updatedState.filter(item=> item.type=='Symbol'))

        // indicator移除
        for (var studyInstanceName in CIQ.stxx.layout.studies) {
            var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
            if (removedItems.find(item=>item.indicator_url==sd.type)){
                CIQ.Studies.removeStudy(CIQ.stxx, sd); 
            }
        }
        // indicator加载
        await addIndicatorStudy(addedItems.map(item=>item.indicator_url))
        CIQ.stxx.loadChart(    { symbol: symbol?symbol:'SPX', indicator:[...updatedState.map(item=>item.indicator_url),combinedStudy]}, function () {
            CIQ.hideCover()
        }) 
        
    }

    // 同metaData
    const addIndicatorStudy = function(indicatorList){
        var color = ["#5B9BD1","#368DF0","#7257F2","#21CE6B","#24CBB7","#EC4D4E","#F4803D"]
   
        let indicatorHeight = CIQ.setPanelHeight(indicatorList)
    
        let resArr = []
        let sentiUrlList = []
    
        return new Promise(resolve=>{
            for(var i in indicatorList){
               if(CIQ.isOwnIndicator(indicatorList[i])){
               /********************lishan modify end*************************/
                    var newStudy = {
                        inputs: { Period: 13, Overlay: false},
                        outputs: 
                        {indicatorClose:color[i%7],description: '',url:indicatorList[i]},
                        panelHeight:indicatorHeight,
                        parameters: { init: {
                            studyOverZonesEnabled: false,
                            studyOverBoughtValue: 999,
                            studyOverBoughtColor: "#FF0000",
                            studyOverSoldValue: 999,
                            studyOverSoldColor: "#00DD00",
                        }},
                        attributes:{
                            studyOverBoughtValue:{"step":0.01},
                            studyOverSoldValue:{"step":0.01}
                        }
                    }
                    
                    var str = JSON.stringify(newStudy);                                   
                    str = str.replace(/indicatorClose/g, indicatorList[i]);
                    newStudy = JSON.parse(str)                                     
                    
                    CIQ.Studies.studyLibrary[indicatorList[i]] = newStudy    

                       /********************lishan modify start*************************/
                       var indicatorName = indicatorList[i].match(/(CREATE|HASH)/) ? indicatorList[i].split(/(CREATE|HASH)/)[0] : indicatorList[i]
                       /********************lishan modify end*************************/
                      CIQ.Studies.addStudy(CIQ.stxx,indicatorList[i],{display:indicatorName})   

                    continue
                }
    
                var queryUrl =  config.indicatorMetadata + 
                "?indicator=" + indicatorList[i];
                let _res = new Promise((resolve,reject)=>{ 
                    CIQ.axios.get(
                        queryUrl,
                    ).then(res=>{
                        resolve(res.data)
                    }).catch(err=>{
                        reject(err)
                    })
                })
                resArr.push(_res)
                sentiUrlList.push(indicatorList[i])
            }
    
            // handle all response for sentiment indicator information and load them
            Promise.all(resArr).then(res => {
                var newQuotes = res;
                
                for(var i in newQuotes){
                    if (newQuotes[i] !== null){
                        var newStudy = {
                            inputs: { Period: 13, Overlay: false},
                            outputs: 
                            {indicatorClose:color[i%7],description: newQuotes[i].description,url:sentiUrlList[i]},
                            panelHeight:indicatorHeight,
                            parameters: { init: {
                                studyOverZonesEnabled: false,
                                studyOverBoughtValue: newQuotes[i].opt_extreme?newQuotes[i].opt_extreme:NaN,
                                studyOverBoughtColor: "#FF0000",
                                studyOverSoldValue: newQuotes[i].pess_extreme?newQuotes[i].pess_extreme:NaN,
                                studyOverSoldColor: "#00DD00",
                            }},
                            attributes:{
                                studyOverBoughtValue:{"step":0.01},
                                studyOverSoldValue:{"step":0.01}
                            }
                        }
                        
                            var str = JSON.stringify(newStudy);                                   
                            str = str.replace(/indicatorClose/g, sentiUrlList[i]);
                            newStudy = JSON.parse(str)                                     
                            
                            CIQ.Studies.studyLibrary[sentiUrlList[i]] = newStudy
                            CIQ.Studies.addStudy(CIQ.stxx,sentiUrlList[i])    
                        
                    }
                }   
                resolve()                     
            }).catch(err => {
                
            })
        })
    
    }
    const manageSymbolSerie = function(symbolList){
        // 先清空series
        for(var s in CIQ.stxx.chart.series){
            var series=CIQ.stxx.chart.series[s];
            CIQ.stxx.removeSeries(series);
        }

        for(var i in symbolList){
            // 第一个symbol为默认图表symbol
            if(i==0){
                CIQ.objIndicator = []
                symbol = symbolList[i].indicator_url
            }else{
                CIQ.stxx.addSeries(symbolList[i].indicator_url, {
                    display:symbolList[i].indicator, 
                    isComparison: false, 
                    color: "#368DF0",
                    yAxis:{ 
                        position:"left",
                        textStyle:"#FFBE00"
                    },
                });
            }
        }
    }
    function findAddedAndRemovedItems(previousState, currentState) {
        const addedItems = currentState.filter(currentItem => 
          !previousState.some(previousItem => 
            JSON.stringify(previousItem) === JSON.stringify(currentItem)
          )
        ).filter(item=> item.type=='Indicator');
      
        const removedItems = previousState.filter(previousItem =>
          !currentState.some(currentItem =>
            JSON.stringify(currentItem) === JSON.stringify(previousItem)
          )
        ).filter(item=> item.type=='Indicator');
      
        return {
          addedItems,
          removedItems
        };
      }




    // 以下管理user's own indicator 图表函数
    CIQ.updateUserOwnIndicator = function(newData,oldData){
        CIQ.addCover()
        if(oldData.categories != newData.categories){
            // remove existing studies and series
            for (var studyInstanceName in CIQ.stxx.layout.studies) { 
                var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                CIQ.Studies.removeStudy(CIQ.stxx, sd); 
            }
            for(var s in CIQ.stxx.chart.series){
                var series=CIQ.stxx.chart.series[s];
                CIQ.stxx.removeSeries(series);
            }
            CIQ.hideCover()
            return
        }
        
        if(newData.categories.includes('Symbol')){
            if(oldData.indicator1.url != newData.indicator1.url){
                CIQ.objIndicator = []
                CIQ.stxx.loadChart({symbol: newData.indicator1.url},()=>{
                    CIQ.hideCover()
                })
            }
            if(oldData.indicator2.url != newData.indicator2.url){
                var series = CIQ.stxx.chart.series[oldData.indicator2.url];
                // 移除旧的field的ma 
                for (var studyInstanceName in CIQ.stxx.layout.studies) {
                    if (
                        CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == series.id &&
                        CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA'
                    ) {
                      // 直接判断是否为st ma
                      CIQ.Studies.removeStudy(
                        CIQ.stxx,
                        CIQ.stxx.layout.studies[studyInstanceName]
                      )
                    }
                  }
                CIQ.stxx.removeSeries(series);

                CIQ.stxx.addSeries(newData.indicator2.url, {
                    display:newData.indicator2.name, 
                    isComparison: false, 
                    color: "#368DF0",
                    //panel:newData.indicator2.url,
                    // This setting is only applicable when using the primary y-axis and has no effect when using a renderer that has its own axis.
                    yAxis:{ 
                        position:"left",
                        textStyle:"#FFBE00"
                    },
                    //shareYAxis: true
                },()=>{
                    CIQ.hideCover()
                });
            }
        }
        
        if(newData.categories.includes('Indicator')){
            if(oldData.indicator1.url != newData.indicator1.url){
                for (var studyInstanceName in CIQ.stxx.layout.studies) {
                    var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                    if (sd.type== oldData.indicator1.url){
                        CIQ.Studies.removeStudy(CIQ.stxx, sd); 
                    }
                }
                addSingleIndicator([newData.indicator1.url,newData.indicator2.url],newData.indicator1.url);
            }
            if(oldData.indicator2.url != newData.indicator2.url){
                for (var studyInstanceName in CIQ.stxx.layout.studies) {
                    var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                    if (sd.type== oldData.indicator2.url){
                        CIQ.Studies.removeStudy(CIQ.stxx, sd); 
                    }
                }
                addSingleIndicator([newData.indicator1.url,newData.indicator2.url],newData.indicator2.url);
            }
        }
    }

    // 预览生成的新indicator
    CIQ.previewUserOwnIndicator = function(indicatorList,indicator,symbol,extremeLines){
        CIQ.addCover()
        addSingleIndicator(indicatorList,indicator,symbol,extremeLines);
    }

    // 从列表进入后还原new indicator的设定和新的indicator
    // 我这里不用重新触发inputSelectHandler的思路来复现图表，因为这样会导致图表加载流程冗余
    CIQ.displayUserOwnIndicatorLayout = async function(_newVal){
        const newData = {
            categories : _newVal.categories,
            indicator1 : {name:_newVal.former,url:_newVal.indicator_1_url},
            indicator2 : {name:_newVal.latter,url:_newVal.indicator_2_url},
            url : _newVal.name+'CREATE'+_newVal.url,
            mul_indicator : _newVal.mul_indicator,
            weight_list: _newVal.weightData,
            ma: _newVal.ma
        }
        const extremeLines = {op:_newVal.upper_extreme_value,ep:_newVal.lower_extreme_value}
        if(newData.categories == 'Symbol Spread' || newData.categories == 'Symbol Ratio'){
                // indicator1,包括主symbol和new indicator
                CIQ.objIndicator = []
                await getUserOwnIndicatorMatedata(newData.url,extremeLines)
                CIQ.stxx.loadChart({symbol: newData.indicator1.url, indicator:[newData.url]}, function(){
                    CIQ.hideCover()
                })

                //indicator2,即comparison symbol
                CIQ.stxx.addSeries(newData.indicator2.url, {
                    display:newData.indicator2.name, 
                    isComparison: false, 
                    color: "#368DF0",
                    //panel:newData.indicator2.url,
                    // This setting is only applicable when using the primary y-axis and has no effect when using a renderer that has its own axis.
                    yAxis:{ 
                        position:"left",
                        textStyle:"#FFBE00"
                    },
                    //shareYAxis: true
                });
                displayOwnIndicatorMAStudies(newData)
        }
        
        if(newData.categories == 'Indicator Spread' || newData.categories == 'Indicator Ratio'){
            // indicator
            await getUserOwnIndicatorMatedata(newData.indicator1.url)
            // indicator2
            await getUserOwnIndicatorMatedata(newData.indicator2.url)
            // 自定义indicator
            await getUserOwnIndicatorMatedata(newData.url,extremeLines)
            CIQ.stxx.loadChart(	{ symbol: 'SPX', indicator:[newData.indicator1.url,newData.indicator2.url,newData.url]}, function(){
                displayOwnIndicatorMAStudies(newData)
                CIQ.hideCover()
            }) 
        }

        if(newData.categories == "Indicator Weight Combination"){
            // WIC 列表加载
            // 自定义indicator
            await getUserOwnIndicatorMatedata(newData.url,extremeLines)
            // 预留给何总新加的weightlist
            CIQ.displayWeightOwnIndicator([],newData.weight_list,newData.url)
        }
    }

    const displayOwnIndicatorMAStudies = function(newData){
        let ma_parse_list = newData.ma.split('_')
        const ma1_index = ma_parse_list[0].indexOf('e')
        const ma1_type = ma1_index == -1 ? 'EMA' : 'MA'
        const ma1_value = ma1_index == -1 ? ma_parse_list[0] : ma_parse_list[0].slice(0,ma1_index)
        const ma1_showInput = ma1_value != '1'
        const ma2_index = ma_parse_list[1].indexOf('e')
        const ma2_type = ma2_index == -1 ? 'EMA' : 'MA'
        const ma2_value = ma2_index == -1 ? ma_parse_list[1] : ma_parse_list[1].slice(0,ma2_index)
        const ma2_showInput = ma2_value != '1'

        // ma1
        if(newData.categories.includes('Indicator')){
            CIQ.addOwnIndicatorMAStudy(
                ma1_value,
                ma1_type,
                newData.indicator1.url,
                ma1_showInput,
                newData.categories
            )
        }else{
            CIQ.addOwnIndicatorMAStudy(
                ma1_value,
                ma1_type,
                'field',
                ma1_showInput,
                newData.categories
            )
        }

        // ma2
        CIQ.addOwnIndicatorMAStudy(
            ma2_value,
            ma2_type,
            newData.indicator2.url,
            ma2_showInput,
            newData.categories
        )
    }

    // 第一个参数是默认值为SPX的symbol，own indicator quotefeed请求时为默认symbol，own symbol quotefeed请求时为表单第一个symbol
    // 第2个参数是给quotefeed请求提供的indicator列表，
    // 第3个是要加载的当前indicator
    const addSingleIndicator = async function(indicatorList,indicator,symbol,extremeLines){
        // remove redundant elements and empty string
        for(var i=0;i<indicatorList.length;i++){
        if(indicatorList[i]=='' || indicatorList[i]==undefined){
            indicatorList.splice(i,1)
            i--;
        }
        }

        // fetch indicator information and add studies to chart
        await getUserOwnIndicatorMatedata(indicator,extremeLines)
        CIQ.stxx.loadChart(	{ symbol: symbol?symbol:'SPX', indicator:indicatorList},()=>{
            CIQ.hideCover()
        }) 
    }
    const getUserOwnIndicatorMatedata = async function(indicator,extremeLines){
        var color = "#7257F2"
        return new Promise(resolve=>{
                if(CIQ.isOwnIndicator(indicator)){
                /********************lishan modify end*************************/
                    var newStudy = {
                        inputs: { Period: 13, Overlay: false},
                        outputs: 
                        {indicatorClose:color,description: '',url:indicator},
                        parameters: { init: {
                            studyOverZonesEnabled: true,
                            studyOverBoughtValue: extremeLines?extremeLines.op:NaN,
                            studyOverBoughtColor: "#FF0000",
                            studyOverSoldValue: extremeLines?extremeLines.ep:NaN,
                            studyOverSoldColor: "#00DD00",
                        }},
                        attributes:{
                            studyOverBoughtValue:{"step":0.01},
                            studyOverSoldValue:{"step":0.01}
                        }
                    }
                    
                    var str = JSON.stringify(newStudy);                                   
                    str = str.replace(/indicatorClose/g, indicator);
                    newStudy = JSON.parse(str)                                     
                    
                    CIQ.Studies.studyLibrary[indicator] = newStudy

                    /********************lishan modify start*************************/
                    var indicatorName = indicator.match(/(CREATE|HASH)/) ? indicator.split(/(CREATE|HASH)/)[0] : indicator
                    /********************lishan modify end*************************/
                    CIQ.Studies.addStudy(CIQ.stxx,indicator,{display:indicatorName}) 
                    resolve()   
                }else{
                    var queryUrl =  config.indicatorMetadata + 
                    "?indicator=" + indicator;
                    let _res = new Promise((resolve,reject)=>{ 
                        CIQ.axios.get(
                            queryUrl,
                        ).then(res=>{
                            resolve(res.data)
                        }).catch(err=>{
                            reject(err)
                        })
                    })
                    _res.then(res => {
                        var newQuotes = res;
                            if (newQuotes !== null){
                                var newStudy = {
                                    inputs: { Period: 13, Overlay: false},
                                    outputs: 
                                    {indicatorClose:color,description: newQuotes.description,url:indicator},
                                    parameters: { init: {
                                        studyOverZonesEnabled: false,
                                        studyOverBoughtValue: newQuotes.opt_extreme?newQuotes.opt_extreme:NaN,
                                        studyOverBoughtColor: "#FF0000",
                                        studyOverSoldValue: newQuotes.pess_extreme?newQuotes.pess_extreme:NaN,
                                        studyOverSoldColor: "#00DD00",
                                    }},
                                    attributes:{
                                        studyOverBoughtValue:{"step":0.01},
                                        studyOverSoldValue:{"step":0.01}
                                    }
                                }
                                
                                    var str = JSON.stringify(newStudy);                                   
                                    str = str.replace(/indicatorClose/g, indicator);
                                    newStudy = JSON.parse(str)                                     
                                    
                                    CIQ.Studies.studyLibrary[indicator] = newStudy
                                    CIQ.Studies.addStudy(CIQ.stxx,indicator)                
                            }
  
                        resolve()                     
                    }).catch(err => {
                        
                    })

                }
        })

    }

    CIQ.addOwnIndicatorMAStudy = function(value,type,field,showInput,categories) {
        // 更新ma前移除当前field的旧ma
        for (var studyInstanceName in CIQ.stxx.layout?.studies) {
            if (
                CIQ.stxx.layout.studies[studyInstanceName].inputs.Field == field &&
                CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA'
            ) {
              // 直接判断是否为st ma
              CIQ.Studies.removeStudy(
                CIQ.stxx,
                CIQ.stxx.layout.studies[studyInstanceName]
              )
            }
          }
        if(!showInput || !field) return
        var stma_color = "#bfad94"
        CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
            Type: type == 'MA' ? 'simple' : 'exponential',
            Period: value,
            display: 'ST MA',
            Field: field
          }, 
          { MA: stma_color },
          null,
          categories.includes('Indicator')?null:field
        )
    }
    CIQ.editOwnIndicatorExtremeLines = function(value,field){
        for (var studyInstanceName in CIQ.stxx.layout.studies) {
            var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
            if (CIQ.isOwnIndicator(sd.type)){
                var parameters = sd.parameters
                if(field == 'extreme_optimism'){
                    parameters.studyOverBoughtValue = value
                }else{
                    parameters.studyOverSoldValue = value
                }
                CIQ.Studies.replaceStudy(CIQ.stxx, sd.inputs.id, sd.type, sd.inputs, sd.outputs, parameters);
            }
        }
    }

    // 预留：layout management
    CIQ.localStorage.saveLayout = function(){
        var layout = JSON.stringify(CIQ.stxx.exportLayout(true));
	    localStorage.setItem("myChartLayout", layout);
    }
    CIQ.localStorage.restoreLayout = function(){
        var savedLayout = localStorage.getItem("myChartLayout");
        var importOptions = {
            managePeriodicity: true,
            preserveTicksAndCandleWidth: true
        };
        if (savedLayout) CIQ.stxx.importLayout(JSON.parse(savedLayout), importOptions);
    }
 }
 export {__st_js_userownIndicator_}