/**
 *	2.2.0
 *	contains customized functions related to indicator loading and CSV output file generation
 */
 //import {CIQ} from "./STMask.js"
 import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";
 import {config} from "../feeds/STDataFeedAccessUrl.js"
 //import "./STMovingAverages.js"
 import qs from 'querystring'

 let __st_js_loadIndicator_ = (_exports) => {
 /* global _CIQ, _timezoneJS, _SplinePlotter */
 
 var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
 
 // load Indicators when edit/view a backtest
 CIQ.addIndicatorsFromBacktest = async function(callback){
     CIQ.notADefaultCall = true
     // var loader = document.querySelector(".loaderMain");
     // if (loader) loader.show();
     //和his/fav绑在一起，所以不用加
     //CIQ.addCover()
     console.log('before loadChart FromBacktest: ')
     // set indicatorList to local storage, fetch it when change a symbol
         let indicatorsList = [...CIQ.store.state.chart.indicators.formIndicators.entry,...CIQ.store.state.chart.indicators.formIndicators.exit]
           // remove redundant elements and empty string
           for(var i=0;i<indicatorsList.length;i++){
             if(indicatorsList[i]=='' || indicatorsList[i]==undefined){
               indicatorsList.splice(i,1)
               i--;
             }
           }
 
         const set = new Set(indicatorsList)
         indicatorsList = [...set]
         
         //  load saved indicator layouts from backtest list
         var savedTechSD = []
         savedTechSD = CIQ.store.state.chart.techSD
         CIQ.store.commit('chart/setSavedTechSD', savedTechSD)   
 
         // sort indicatorsList into a "[senti,tech]" style
         let techList = CIQ.store.state.chart.indicators.technicalIndicators
         let technicalIndicators = []
         for(var item in indicatorsList){
             if(techList.indexOf(indicatorsList[item]) != -1){
                 technicalIndicators.push(indicatorsList[item])
                 indicatorsList[item] = ''
             }    
         }
         indicatorsList = indicatorsList.concat(technicalIndicators).filter(item=>{return item !== ''})
         await CIQ.getIndicatorMatedata(indicatorsList)
 
         if(CIQ.store.state.form.backtestSymbol){
             CIQ.symbol = CIQ.store.state.form.backtestSymbol
         }
         await new Promise((resolve) => {
            CIQ.stxx.loadChart({ symbol: CIQ.symbol,startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(), indicator:indicatorsList}, function () {
                // callback - your code to be executed after the chart is loaded
                //CIQ.hideCover()
                //CIQ.exportEx()
                //CIQ.stxx.layout.rangeSlider = true;
                //CIQ.stxx.changeOccurred("layout");
    
                callback()
                resolve()
            })
         })
             
 }
 
 // load Indicators when run a new backtest
 CIQ.outputSignalsResult = async function(pk,callback){
     CIQ.notADefaultCall = true
     // var loader = document.querySelector(".loaderMain");
     // if (loader) loader.show();
 
     //和创回测绑在一起，所以不用加
     //CIQ.addCover()
     console.log('before run a backtest and before viewing result: ')
     // set indicatorList to local storage, fetch it when change a symbol
         let indicatorsList = [...CIQ.store.state.chart.indicators.formIndicators.entry,...CIQ.store.state.chart.indicators.formIndicators.exit]
           // remove redundant elements and empty string
           for(var i=0;i<indicatorsList.length;i++){
             if(indicatorsList[i]=='' || indicatorsList[i]==undefined){
               indicatorsList.splice(i,1)
               i--;
             }
           }
 
         const set = new Set(indicatorsList)
         indicatorsList = [...set]
         
         //  load saved indicator layouts from backtest list
         var savedTechSD = []
         savedTechSD = CIQ.store.state.chart.techSD
         CIQ.store.commit('chart/setSavedTechSD', savedTechSD)
         // console.log(CIQ.store.state.chart.savedTechSD)
 
         // sort indicatorsList into a "[senti,tech]" style
         let techList = CIQ.store.state.chart.indicators.technicalIndicators
         let technicalIndicators = []
         for(var item in indicatorsList){
             if(techList.indexOf(indicatorsList[item]) != -1){
                 technicalIndicators.push(indicatorsList[item])
                 indicatorsList[item] = ''
             }    
         }
         indicatorsList = indicatorsList.concat(technicalIndicators).filter(item=>{return item !== ''})
         await CIQ.getIndicatorMatedata(indicatorsList)
 
         if(CIQ.store.state.form.backtestSymbol){
             CIQ.symbol = CIQ.store.state.form.backtestSymbol
          }
         await new Promise((resolve) => {
            CIQ.stxx.loadChart({ symbol: CIQ.symbol, startDate: new Date(parseInt(process.env.VUE_APP_START_DATE)), endDate: new Date(), indicator: indicatorsList }, async function () {
              // callback - your code to be executed after the chart is loaded
              console.log("loadChart加载完毕", CIQ.stxx.layout.studies);
              CIQ.stxx.resizeChart();
              CIQ.stxx.draw();
              var csvContent = CIQ.exportEx();
              console.log("csvContent created Success");
              var promise = 200
              try {
                var S3DataStr = qs.stringify({ file_name: pk + '/' + pk + '_backtest_data.csv', file_data: csvContent })
                var data = await uploadS3(S3DataStr)
                console.log("Upload csv Success", data);
                promise = 200
              } catch (error) {
                console.log("Error", error);
                promise = 500
              }
          
              await callback(promise);
          
              resolve(); // 表示回调执行完成
            });
          });
            
   
 }

 CIQ.uploadCSVJSON = async function(pk,callback) {
    // lishan 仅仅用于上传 csv json 文件
    CIQ.stxx.resizeChart();
    CIQ.stxx.draw();
    let csvContent = CIQ.exportEx();
    console.log("csvContent created Success");
    let promise = 200
    try {
      let S3DataStr = qs.stringify({ file_name: pk + '/' + pk + '_backtest_data.csv', file_data: csvContent })
      let data = await uploadS3(S3DataStr)
      console.log("Upload csv Success", data);
      promise = 200
    } catch (error) {
      console.log("Error", error);
      promise = 500
    }

    await callback(promise);
 }

 function uploadS3(S3DataStr) {
     const url = '/dev/dev/upload/'
     return new Promise((resolve,reject)=>{
         CIQ.axios.post(url,S3DataStr,{withCredentials: true})
         .then(res=>{
             resolve(res)
         }).catch(err=>{
             reject(err)
         })
     })
 }
 
 // the main functionality of it is to update indicator list on chart, maybe it would be better if we call it "updateIndicatorList"
 CIQ.addIndicators = async function(callback){
     CIQ.notADefaultCall = true
     CIQ.addCover()
     CIQ.nprogress.start()
     // var loaderMain = document.querySelector(".loaderMain");
     // if (loaderMain) loaderMain.show();
     console.log('before loadChart... ')
 
         let indicatorsList = [...CIQ.store.state.chart.indicators.formIndicators.entry,...CIQ.store.state.chart.indicators.formIndicators.exit]
           // remove redundant elements and empty string
           for(var i=0;i<indicatorsList.length;i++){
             if(indicatorsList[i]=='' || indicatorsList[i]==undefined){
               indicatorsList.splice(i,1)
               i--;
             }
           }
           
         indicatorsList = indicatorsList.concat(CIQ.store.state.chart.indicators.extraIndicators)
         const set = new Set(indicatorsList)
         indicatorsList = [...set]
         
         //  load saved indicator layouts from stxx.layout
         var savedTechSD = []
         for(var i in CIQ.stxx.layout.studies){
             savedTechSD.push({
                 type: CIQ.stxx.layout.studies[i].type,
                 inputs: CIQ.stxx.layout.studies[i].inputs,
                 outputs: CIQ.stxx.layout.studies[i].outputs,
                 parameters: CIQ.stxx.layout.studies[i].parameters,
                 panel: CIQ.stxx.layout.studies[i].panel
             })
         }
         CIQ.store.commit('chart/setSavedTechSD', savedTechSD)
 
         // sort indicatorsList into a "[senti,tech]" style
         let techList = CIQ.store.state.chart.indicators.technicalIndicators
         let technicalIndicators = []
         for(var item in indicatorsList){
             if(techList.indexOf(indicatorsList[item]) != -1){
                 technicalIndicators.push(indicatorsList[item])
                 indicatorsList[item] = ''
             }    
         }
         indicatorsList = indicatorsList.concat(technicalIndicators).filter(item=>{return item !== ''})
         
         // fetch indicator information and add studies to chart
         await CIQ.getIndicatorMatedata(indicatorsList)
         if(CIQ.store.state.form.backtestSymbol){
             CIQ.symbol = CIQ.store.state.form.backtestSymbol
          }
 
         CIQ.stxx.loadChart(	{ symbol: CIQ.symbol,startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(), indicator:indicatorsList}, function () {
             // callback - your code to be executed after the chart is loaded
 
             // CIQ.hideMarker()
             // CIQ.isMarkerShown = false
 
             //CIQ.stxx.layout.rangeSlider = true;
             //CIQ.stxx.changeOccurred("layout");
             CIQ.loadChart(CIQ.store.state.chart.trades, CIQ.addDot)
             
             if(callback){
                 callback()
             }else{ 
                 CIQ.hideCover()
                 CIQ.nprogress.done()
             }
         })
         
 }
 
 // endDate为推荐日当天
 CIQ.initiateChart = function(indicatorsList,endDate,callback){
     var datatime = new Date(endDate)
     var offset = datatime.getTimezoneOffset() * 60 * 1000
     const standardEndDate = new Date(datatime.setTime(datatime.getTime() + offset))
     CIQ.stxx.loadChart(	{ symbol: CIQ.symbol,startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:standardEndDate, indicator:indicatorsList}, function () {
         // 加载marker前先清空
         //CIQ.hideMarker()
         CIQ.store.dispatch('states/set_isMarkerShown_flag',false)
         
         if(callback){
             callback()
         }
     })
 }
 // change a symbol
 CIQ.addSymbol = async function(symbol){
     CIQ.addCover()
     CIQ.nprogress.start()
     let indicatorsList = [...CIQ.store.state.chart.indicators.formIndicators.entry,...CIQ.store.state.chart.indicators.formIndicators.exit]
     // remove redundant elements and empty string
 
     for(var i=0;i<indicatorsList.length;i++){
         if(indicatorsList[i]=='' || indicatorsList[i]==undefined){
         indicatorsList.splice(i,1)
         i--;
       }
     }
     indicatorsList = indicatorsList.concat(CIQ.store.state.chart.indicators.extraIndicators)
     const set = new Set(indicatorsList)
     indicatorsList = [...set]
 
     // set AAPL as default indicator params
     if(indicatorsList.length==0){
         //indicatorsList = ['AAPL']
     }
 
     // sort indicatorsList into a "[senti,tech]" style (however, tech is selected lastly in this case, so it doesn't matter)
     let techList = CIQ.store.state.chart.indicators.technicalIndicators
     let technicalIndicators = []
     for(var item in indicatorsList){
         if(techList.indexOf(indicatorsList[item]) != -1){
             technicalIndicators.push(indicatorsList[item])
             indicatorsList[item] = ''
         }    
     }
     indicatorsList = indicatorsList.concat(technicalIndicators).filter(item=>{return item !== ''})
 
     //  load saved indicator layouts from stxx.layout
     var savedTechSD = []
     for(var i in CIQ.stxx.layout.studies){
         savedTechSD.push({
             type: CIQ.stxx.layout.studies[i].type,
             inputs: CIQ.stxx.layout.studies[i].inputs,
             outputs: CIQ.stxx.layout.studies[i].outputs,
             parameters: CIQ.stxx.layout.studies[i].parameters,
             panel: CIQ.stxx.layout.studies[i].panel
         })
     }
     CIQ.store.commit('chart/setSavedTechSD', savedTechSD)
   
             // old version only
             var countExistIndicator = 0
             for (var studyInstanceName in CIQ.stxx.layout.studies) {
                if (CIQ.findBuiltinTechIndicator(null,CIQ.stxx.layout.studies[studyInstanceName].type)){
                    countExistIndicator--
                }
                if(CIQ.stxx.layout.studies[studyInstanceName].type == 'ST MA'){
                    countExistIndicator--
                }
                countExistIndicator++          
             } 
             
             if(countExistIndicator>=10){
                 //loader.hide()
                 CIQ.hideCover()
                 CIQ.nprogress.done()
                 CIQ.description("Maximum 10 signals can be displayed on chart")
                 return
             }
 
     let count = 0
     for (var studyInstanceName in CIQ.stxx.layout.studies) {
         count++
     }
 
     CIQ.store.commit('form/getBacktestSymbol',symbol)
     if(count>0){
         await this.getIndicatorMatedata(indicatorsList)
         console.log('after CIQ.getIndicatorMatedata')
     }
 
     CIQ.stxx.loadChart(	{ symbol: symbol,startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(), indicator:indicatorsList},function () {
         // callback - your code to be executed after the chart is loaded
         //if (loader) loader.hide();
         CIQ.hideCover()
         CIQ.nprogress.done()

         //CIQ.hideMarker()
        // CIQ.isMarkerShown = false
         CIQ.store.dispatch('states/set_isMarkerShown_flag',false)

         //CIQ.stxx.layout.rangeSlider = true;
         //CIQ.stxx.changeOccurred("layout");
         //CIQ.exportEx()      
     })
 }

 // fetch indicator information and add studies to chart
 // 封装成了一个promise函数
 CIQ.getIndicatorMatedata = function(indicatorList){
     var color = ["#5B9BD1","#368DF0","#7257F2","#21CE6B","#24CBB7","#EC4D4E","#F4803D"]
     var stma_color = ["#bfad94","#b07858","#a14516","#6f3516","#402818"]

     for (var studyInstanceName in CIQ.stxx.layout.studies) {
         
         var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
         //if (CIQ.studys.indexOf(sd.type) === -1){
             CIQ.Studies.removeStudy(CIQ.stxx, sd); 
        // }
     }
     let indicatorHeight = CIQ.setPanelHeight(indicatorList)
 
     let resArr = []
     let sentiUrlList = []
 
 
 
     return new Promise(resolve=>{
         for(var i in indicatorList){
             // 是tech
             if(CIQ.findBuiltinTechIndicator(null,indicatorList[i]) || CIQ.findSymbolIndicator(indicatorList[i],null)){
                     // load technical study, no need for adding MA
                     // if it's a technical study, skip sending query
 
                     // 暂定，遇到ma时会访问store里的此记录并还原显示   
                     if(indicatorList[i]=='ma'){
                         for(var j in CIQ.store.state.chart.activatedMALayout){
                             // 直接加载，信息都更新再studylibrary
                             var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ma', {
                                 Type: CIQ.store.state.chart.activatedMALayout[j].type,
                                 Field: CIQ.store.state.chart.activatedMALayout[j].field,
                                 Period: CIQ.store.state.chart.activatedMALayout[j].period,
                                 //display: indicatorList[i],
                             },{ MA: color[j%7] },{
                                 criteria: CIQ.store.state.chart.activatedMALayout[j].criteria,
                                 index: CIQ.store.state.chart.activatedMALayout[j].index
                             })     
                         }
                     }else{
                         // if no savedTechSD exit, load normal study         
                         var count = 0 
                         for(var j in CIQ.store.state.chart.savedTechSD){
                             if(indicatorList[i] == CIQ.store.state.chart.savedTechSD[j].type){
                                 count++
                                 var study = CIQ.Studies.studyLibrary[indicatorList[i]]
                                 study.panelHeight=indicatorHeight
                                 CIQ.Studies.studyLibrary[indicatorList[i]] = study
                                 var sd = CIQ.Studies.addStudy(CIQ.stxx, indicatorList[i],CIQ.store.state.chart.savedTechSD[j].inputs, CIQ.store.state.chart.savedTechSD[j].outputs, CIQ.store.state.chart.savedTechSD[j].parameters, CIQ.store.state.chart.savedTechSD[j].panel); 
                             }
                         }
                         if(count==0){     
                             console.log(CIQ.Studies.studyLibrary)                                                       
                             var study = CIQ.Studies.studyLibrary[indicatorList[i]]
                             study.panelHeight=indicatorHeight
                             CIQ.Studies.studyLibrary[indicatorList[i]] = study
                             var sd = CIQ.Studies.addStudy(CIQ.stxx, indicatorList[i],{display:indicatorList[i]});  
                         }
                     }
 
                     if(CIQ.findSymbolIndicator(indicatorList[i],null)){
                         if(CIQ.store.getters.getBeforeCalculateNewConditions == false){
                             CIQ.store.commit("states/envokeBeforeCalculateNewConditions", true)
                         }else{
                             CIQ.store.commit("states/envokeBeforeCalculateNewConditions", false)
                         }              
                     }
                     
                     for(var j in CIQ.store.state.chart.activatedMA){                            
                         if((CIQ.store.state.chart.activatedMA[j].url != '')&&(CIQ.store.state.chart.activatedMA[j].url == indicatorList[i])){
                             if(CIQ.store.state.chart.activatedMA[j].url == 'ma'){
                                 // 直接加载，信息都更新再studylibrary
                                 var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
                                     // Type: CIQ.store.state.chart.activatedMA[i].type,
                                     Period: CIQ.store.state.chart.activatedMA[j].period,
                                     display: 'ST MA',
                                 },{ MA: stma_color[j%5] },{
                                     criteria: CIQ.store.state.chart.activatedMA[j].criteria,
                                     index: CIQ.store.state.chart.activatedMA[j].index
                                 })
                             }else{
                                 sd = CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
                                     Period: CIQ.store.state.chart.activatedMA[j].period,
                                     display:"ST MA",
                                     Field: CIQ.store.state.chart.activatedMA[j].url
                                 },{ MA: stma_color[j%5] },{
                                     criteria: CIQ.store.state.chart.activatedMA[j].criteria,
                                     index: CIQ.store.state.chart.activatedMA[j].index
                                 });
                             }    
                         }   
                     }
                     continue
 
             }
             // 之后加一个symbol判断和小李新senti判断
            /********************lishan modify start*************************/
            if(CIQ.isUserIndicator(indicatorList[i]) || CIQ.isOwnIndicator(indicatorList[i])){
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
                 var count = 0
                 
                 for(var j in CIQ.store.state.chart.savedTechSD){
                     if(indicatorList[i] == CIQ.store.state.chart.savedTechSD[j].type){
                         count++
                         var sd = CIQ.Studies.addStudy(CIQ.stxx, indicatorList[i],CIQ.store.state.chart.savedTechSD[j].inputs,null, CIQ.store.state.chart.savedTechSD[j].parameters, CIQ.store.state.chart.savedTechSD[j].panel);
                     }
                 }
                 if(count==0){
                    /********************lishan modify start*************************/
                    var indicatorName = indicatorList[i].match(/(CREATE|HASH)/) ? indicatorList[i].split(/(CREATE|HASH)/)[0] : indicatorList[i]
                    /********************lishan modify end*************************/
                     var sd = CIQ.Studies.addStudy(CIQ.stxx,indicatorList[i],{display:indicatorName})   
                 }
 
                 var newExtremeValue = {indicator:indicatorList[i],extremeOptimism:sd.parameters.studyOverBoughtValue,extremePessimism:sd.parameters.studyOverSoldValue}
                 var extremeValueList = CIQ.store.state.chart.extremeValue
                 extremeValueList.push(newExtremeValue)
                 CIQ.store.commit("chart/getExtremeValue", extremeValueList)
                 
                 // load moving average lines that attach to sentiment indicator
                 for(var j in CIQ.store.state.chart.activatedMA){          
                     if((CIQ.store.state.chart.activatedMA[j].url != '')&&(CIQ.store.state.chart.activatedMA[j].url == indicatorList[i])){
                         if(CIQ.store.state.chart.activatedMA[j].url == 'ma'){
                             var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
                                 // Type: CIQ.store.state.chart.activatedMA[i].type,
                                 Period: CIQ.store.state.chart.activatedMA[j].period,
                                 display: 'ST MA',
                             },{ MA: stma_color[j%5] },{
                                 criteria: CIQ.store.state.chart.activatedMA[j].criteria,
                                 index: CIQ.store.state.chart.activatedMA[j].index
                             })
                         }else{    
                             var sd = CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
                                 Period: CIQ.store.state.chart.activatedMA[j].period,
                                 display:"ST MA",
                                 Field: CIQ.store.state.chart.activatedMA[j].url
                             },{ MA: stma_color[j%5] },{
                                 criteria: CIQ.store.state.chart.activatedMA[j].criteria,
                                 index: CIQ.store.state.chart.activatedMA[j].index
                             });
                         }    
                     }   
                 }
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
                         var count = 0
                         
                         for(var j in CIQ.store.state.chart.savedTechSD){
                             if(sentiUrlList[i] == CIQ.store.state.chart.savedTechSD[j].type){
                                 count++
                                 var sd = CIQ.Studies.addStudy(CIQ.stxx, sentiUrlList[i],CIQ.store.state.chart.savedTechSD[j].inputs,null, CIQ.store.state.chart.savedTechSD[j].parameters, CIQ.store.state.chart.savedTechSD[j].panel);
                             }
                         }
                         if(count==0){
                             var sd = CIQ.Studies.addStudy(CIQ.stxx,sentiUrlList[i])    
                         }
         
                         var newExtremeValue = {indicator:sentiUrlList[i],extremeOptimism:sd.parameters.studyOverBoughtValue,extremePessimism:sd.parameters.studyOverSoldValue}
                         var extremeValueList = CIQ.store.state.chart.extremeValue
                         // if(!extremeValueList.some((item)=>{return item.indicator == newExtremeValue.indicator})){
                             extremeValueList.push(newExtremeValue)
                         //}
                         CIQ.store.commit("chart/getExtremeValue", extremeValueList)
                     // stxx.panels[sd.panel].yAxis
                     
                 }
                 // load moving average lines that attach to sentiment indicator
                 for(var j in CIQ.store.state.chart.activatedMA){          
                     if((CIQ.store.state.chart.activatedMA[j].url != '')&&(CIQ.store.state.chart.activatedMA[j].url == sentiUrlList[i])){
                         if(CIQ.store.state.chart.activatedMA[j].url == 'ma'){
                             var sd = CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
                                 // Type: CIQ.store.state.chart.activatedMA[i].type,
                                 Period: CIQ.store.state.chart.activatedMA[j].period,
                                 display: 'ST MA',
                             },{ MA: stma_color[j%5] },{
                                 criteria: CIQ.store.state.chart.activatedMA[j].criteria,
                                 index: CIQ.store.state.chart.activatedMA[j].index
                             })
                         }else{    
                             var sd = CIQ.Studies.addStudy(CIQ.stxx, "ST MA",{
                                 Period: CIQ.store.state.chart.activatedMA[j].period,
                                 display:"ST MA",
                                 Field: CIQ.store.state.chart.activatedMA[j].url
                             },{ MA: stma_color[j%5] },{
                                 criteria: CIQ.store.state.chart.activatedMA[j].criteria,
                                 index: CIQ.store.state.chart.activatedMA[j].index
                             });
                         }    
                     }   
                 }
             }   
             resolve()                     
         }).catch(err => {
             
         })
     })
 
 }
 
 CIQ.updateUserOwnIndicator = function(data){
    console.log('updateUserOwnIndicator',data,source)
    let {
        categories,
        indicator_1,
        indicator_2,
        indicator_1_url,
        indicator_2_url
    } = CIQ.store.state.chart.miFormState
    if(categories != data.categories){
        // remove existing studies and series
        for (var studyInstanceName in CIQ.stxx.layout.studies) { 
            var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
            CIQ.Studies.removeStudy(CIQ.stxx, sd); 
        }
        for(var s in CIQ.stxx.chart.series){
            var series=CIQ.stxx.chart.series[s];
            CIQ.stxx.removeSeries(series);
        }
        return
    }

    if(indicator_1_url != data.indicator_1_url){
        var sd = CIQ.stxx.layout.studies[indicator_1_url]; 
        CIQ.Studies.removeStudy(CIQ.stxx, sd); 
    }
    CIQ.stxx.addSeries("GE", { display:"Sony",isComparison: true, color: "#FF0000" });
	CIQ.stxx.addSeries("AAON", { isComparison: true, color: "#FF0000" });
 }
 }
 export {__st_js_loadIndicator_}
 //export {CIQ}