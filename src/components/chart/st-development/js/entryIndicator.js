/**
 *	2.2.0
 *	contains customized functions related to indicator loading and CSV output file generation
 */
 import {CIQ} from "./STMask.js"
 import {config} from "../feeds/STDataFeedAccessUrl.js"
 import "./STMovingAverages.js"
 import qs from 'querystring'
 
 // description pop up window
 CIQ.description = function(value){
     document.querySelector(".discription_div").innerHTML = `<cq-study-dialog class="discription_dialog"></cq-study-dialog>`;
         document.querySelector(".discription_dialog").innerHTML = `
                 <cq-dialog class="ciq-day" cq-study-dialog="true" cq-active="true" style="top: 50%; left: 50%; transform: translate(-50%, -20%);">
                 <cq-study-dialog cq-study-axis="true" cq-study-panel="alias">
                 <h4 class="title" style="font-size: 20px; font-weight: 500">`+ value+`</h4>
                 <div class="ps__rail-x" style="left: 0px; bottom: 0px;"><div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps__rail-y" style="top: 0px; right: 0px; height: 373px;"><div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 322px;"></div></div></cq-scroll>
                 <div class="ciq-dialog-cntrls">
                  <div class="ciq-btn discription-btn" >Done</div>
                 </div>
                </cq-study-dialog></cq-dialog>`;
                 document.querySelector(".discription-btn").addEventListener("click",function(){
                     document.querySelector(".discription_div").innerHTML = ""
                 })
 }
 
 // not in use
 // CIQ.restoreLayout = function() {
 // 	var savedLayout = CIQ.store.state.form.importedLayout
 // 	var importOptions = {
 // 		managePeriodicity: true,
 // 		preserveTicksAndCandleWidth: true
 // 	};
 //     console.log('imported layout: ',savedLayout)
 // 	if (savedLayout) CIQ.stxx.importLayout(savedLayout, importOptions);
 // }
 
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
         console.log('after CIQ.getIndicatorMatedata')
 
         if(CIQ.store.state.form.backtestSymbol){
             CIQ.symbol = CIQ.store.state.form.backtestSymbol
         }
 
         CIQ.stxx.loadChart({ symbol: CIQ.symbol,startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(), indicator:indicatorsList}, function () {
             // callback - your code to be executed after the chart is loaded
             //CIQ.hideCover()
             //CIQ.exportEx()
             //CIQ.stxx.layout.rangeSlider = true;
             //CIQ.stxx.changeOccurred("layout");
 
             callback()
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
         CIQ.stxx.loadChart(	{ symbol: CIQ.symbol,startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(), indicator:indicatorsList}, async function () {
             // callback - your code to be executed after the chart is loaded
             console.log("loadChart加载完毕",CIQ.stxx.layout.studies);
             CIQ.stxx.resizeChart();
             CIQ.stxx.draw();
             var csvContent = CIQ.exportEx()
             console.log("csvContent created Success");
             var promise = 200
             try{
                 var S3DataStr = qs.stringify({file_name:pk + '/' + pk + '_backtest_data.csv',file_data:csvContent})
                 var data = await uploadS3(S3DataStr)
                 console.log("Upload csv Success",data);
                 promise = 200	
             }catch(error){
                 console.log("Error", error);
                 promise = 500
             }
 
             callback(promise)
         })     
   
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
         indicatorsList = ['AAPL']
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
                 for (var i in CIQ.store.state.chart.builtinList){
                     if(CIQ.store.state.chart.builtinList[i].url == CIQ.stxx.layout.studies[studyInstanceName].type){countExistIndicator--}
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
 
     utils.setSymbol(symbol)
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
 
 CIQ.isTechIndicator = function(indicator){
     let isTech = false
     for(var i in CIQ.technicalCategory){
         if(CIQ.technicalCategory[i]['studies'].find(item=>item.url == indicator)){
             isTech = true
         }
     }
     return isTech
 }
 CIQ.isSentiIndicator = function(indicator){
     let sentiList = []
     CIQ.indicatorList.forEach(e => {
         sentiList.push(e.url)
     })
     if(sentiList.indexOf(indicator) == -1){
         return false
     }
     return true
 }
 CIQ.isUserIndicator = function(indicator){
     if(!indicator || indicator.indexOf('HASH') == -1){
         return false
     }
     return true
 }
 CIQ.isSymbolIndicator = function(indicator){
     let symbolOhlcvList = ['Symbol Open','Symbol High','Symbol Close','Symbol Low','Symbol Volume']
     if(symbolOhlcvList.indexOf(indicator) == -1){
         return false
     }
     return true
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
             if(CIQ.isTechIndicator(indicatorList[i]) || CIQ.isSymbolIndicator(indicatorList[i])){
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
 
                     if(CIQ.isSymbolIndicator(indicatorList[i])){
                         if(CIQ.store.getters.getBeforeCalculateNewConditions == false){
                             CIQ.store.commit("form/envokeBeforeCalculateNewConditions", true)
                         }else{
                             CIQ.store.commit("form/envokeBeforeCalculateNewConditions", false)
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
             if(CIQ.isUserIndicator(indicatorList[i])){
                 
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
                     var indicatorName = indicatorList[i].split(/HASH/)[0]
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
 
 CIQ.labelOption = new Array(10).fill('')
 
 // csv output file generation function
 CIQ.exportEx = function(){  
     let finalData = []
     
     let study = CIQ.stxx.layout.studies[Object.keys(CIQ.stxx.layout.studies).pop()]
     if(study == undefined){ return }
     let JSONData = study.chart.scrubbed
     let timePeriod = CIQ.spanPeriod
     //console.log("timePeriod",timePeriod)
     //先转化json
     let _arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
     // 根据time period筛选数据
     let arrData = []
     for(var i in _arrData){
         let item = _arrData[i]
         let dateNum = item.Date?item.Date:''
         if(timePeriod){
             if(dateNum<timePeriod.start_date || dateNum>timePeriod.end_date){continue}
         }
         arrData.push(_arrData[i])
     }
 
     const tradePriceType = CIQ.store.state.form.tradePrice
     // 给数组内容换好位置
     for(var i in arrData){
         let item = arrData[i]
         let dateNum = item.Date?item.Date:''
         let date = dateNum.slice(0,4)+ '-' + dateNum.slice(4,6)+ '-' + dateNum.slice(6,8)
 
         let obj = {
             Date: date,
             Open: (tradePriceType==1 || tradePriceType==2)? item.Close : item.Open,
             High: item.High,
             Low: item.Low,
             Close: item.Close ? item.Close : '',
             Volume: item.Volume ? item.Volume: 1,
             entry_1: '',
             entry_2: '',
             entry_3: '',
             entry_4: '',
             entry_5: '',
             exit_1: '',
             exit_2: '',
             exit_3: '',
             exit_4: '',
             exit_5: '',
             //Result: item[Object.keys(item)[8]],     
         };
       finalData.push(obj);
     }
 
     if(tradePriceType==2){
         finalData = finalData.map((item, index, arr) => {
             const newIndex = (index - 1) % arr.length; // 计算新的索引位置
             const newOpen = index === 0 ? arr[index].Open : arr[newIndex].Open; // 如果是第一个元素，设置year为null，否则获取下一个元素的year值
             return {
                 ...item,
                 Open: newOpen
             };
         });
     }
     // find the correspond sd type
     CIQ.store.state.chart.indicators.formIndicators.entry.forEach((value,index)=>{
         var _index = ''
         var indexNum
         var sd = {}
         for(var i in CIQ.stxx.layout.studies){
             var _sd = CIQ.stxx.layout.studies[i]
             // 如果indicator不是ma,st ma ,roc,则不考虑criteria和index
             if(!_sd.parameters.criteria && _sd.type == value){
                 _index = 'entry_'+(index+1)
                 indexNum = index
                 sd = _sd
                 continue;
             }
             if(_sd.type == value && _sd.parameters.criteria == 'entry' && _sd.parameters.index == index){
                 _index = 'entry_'+(index+1)
                 indexNum = index
                 sd = _sd
             }
         }
         finalData = generateFinalOutput(arrData,finalData,sd,_index,indexNum,'entry')
     })
     CIQ.store.state.chart.indicators.formIndicators.exit.forEach((value,index)=>{
         var _index = ''
         var indexNum
         var sd = {}
         for(var i in CIQ.stxx.layout.studies){
             var _sd = CIQ.stxx.layout.studies[i]
             // 如果indicator不是ma,st ma ,roc,则不考虑criteria和index
             if(!_sd.parameters.criteria && _sd.type == value){
                 _index = 'exit_'+(index+1)
                 indexNum = index
                 sd = _sd
                 continue;
             }
             if(_sd.type == value && _sd.parameters.criteria == 'exit' && _sd.parameters.index == index){
                 _index = 'exit_'+(index+1)
                 indexNum = index
                 sd = _sd
             }
         }
         finalData = generateFinalOutput(arrData,finalData,sd,_index,indexNum,'exit')
     })
     
     // generate a csv copy of finalData 
     let csvArray = []
     let indexs = Object.keys(finalData[0])
     let newIndexs = indexs.map((val,index)=>{
         if(index>=6 && index<=10){
             if(CIQ.store.state.chart.indicators.formIndicators.entry[index-6]){
                 return CIQ.store.state.chart.indicators.formIndicators.entry[index-6] + CIQ.labelOption[index-6]
             }else{
                 return Object.keys(finalData[0])[index]
             }  
         }else if(index>10){
             if(CIQ.store.state.chart.indicators.formIndicators.exit[index-11]){
                 return CIQ.store.state.chart.indicators.formIndicators.exit[index-11] + CIQ.labelOption[index-6]
             }else{
                 return Object.keys(finalData[0])[index]
             }  
         }else{
             return Object.keys(finalData[0])[index]
         }
     })
 
     csvArray.push(newIndexs)
 
 
     for (let i = 0; i < finalData.length; i++) {
     csvArray.push(Object.values(finalData[i]))
     }
     
 
     if(CIQ.downloadCSV){
         downloadCSV(csvArray)
     }
     let csvContent = csvArray.map(e => e.join(",")).join("\n");
     return csvContent 
 };
 
 function downloadCSV(csvArray){
     let csvContent = "data:text/csv;charset=utf-8," 
     + csvArray.map(e => e.join(",")).join("\n");
     
     var encodedUri = encodeURI(csvContent); 
     var link = document.createElement("a"); 
     link.setAttribute("href", encodedUri); 
     let fileName = 'test.csv'
     //let fileName = CIQ.store.state.chart.indicators.formIndicators.entry + ' & ' + CIQ.store.state.chart.indicators.formIndicators.exit + '.csv'
     link.setAttribute("download", fileName); 
     document.body.appendChild(link);
     link.click();
 }
 
 function generateFinalOutput(arrData,finalData,sd,index,indexNum,criteria){
     if(!sd.type) return finalData
     var resultIndex = ''
     var categoryList = CIQ.technicalCategory
     var conditionRadio = CIQ.store.state.form.conditionRadio[criteria][indexNum]
     var formatSmallNum = function(num){
         if(num>-0.005 && num<0){return -0.01}
         else if(num>0 && num<0.005){return 0.01}
         else{return num}
     }
     // technical indicators
     for(var _class in categoryList){
         var studies = categoryList[_class].studies
         for(var _study in studies){
             if(sd.type == studies[_study].url){
                 var category = categoryList[_class].class
                 
                 switch(category){
                     case("CCI_like"):{
                         // output only indicator value 
                         resultIndex = Object.keys(sd.outputMap)[0]
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
                         for(var item in arrData){
                             let result = formatSmallNum(arrData[item][resultIndex])
                             finalData[item][index] = result || result==0
                             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                             :null;      
                         }
                         
                         CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = ''
                         break
                     }
                     case("MACD_like"):{
                         //MACD ‌macd‌
                         //var conditionRadio = CIQ.store.state.form.conditionRadio[criteria][indexNum]
                         //console.log(conditionRadio)
                         for(var i in Object.keys(sd.outputMap)){
                             var keywordList = []
                             switch(conditionRadio){
                                 case('Indicator Value'):{
                                     keywordList = ['MACD ‌macd‌','Klinger ‌Klinger‌','Rel Vig ‌Rel Vig‌']
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = ''
                                     break
                                 }
                                 case('Indicator Value '):{
                                     keywordList = ['_hist']
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_SL'
                                     break
                                 }
                                 case('Indicator Hist'):{
                                     keywordList = ['_hist']
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_hist'
                                     break
                                 }
                                 default:
                             }
                             for(var k in keywordList){
                                 if(Object.keys(sd.outputMap)[i].search(keywordList[k]) != -1){
                                     resultIndex = Object.keys(sd.outputMap)[i]
                                 }
                             }
                             
                         }
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
                         for(var item in arrData){
                             let result = formatSmallNum(arrData[item][resultIndex])
                             finalData[item][index] = result || result==0
                             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                             :null;
                         }
                         break
                     }
                     case("BollingerBands_like"):{
                         // use Bottom Top Median in output map
                         //Use Indicator High/Medium/Low Band raw data whichever is chosen in the drop list. 
                         //var conditionRadio = CIQ.store.state.form.conditionRadio[criteria][indexNum]
                         for(var i in Object.keys(sd.outputMap)){
                             var keywordList = []
                             switch(conditionRadio){
                                 case('LB'):{
                                     keywordList = ['Bottom','Low']
                                     break
                                 }
                                 case('HB'):{
                                     keywordList = ['Top','High']
                                     break
                                 }
                                 case('MB'):{
                                     keywordList = ['Median']
                                     break
                                 }
                                 default:
                             }
                             CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_'+conditionRadio
                             for(var k in keywordList){
                                 // todo, 防止 'High Low Top High Low'这样的outputMap扰乱了keywordList的判断
                                 if(Object.keys(sd.outputMap)[i].replaceAll(sd.type,'').search(keywordList[k]) != -1){
                                     resultIndex = Object.keys(sd.outputMap)[i]
                                 }
                             }
                             
                         }
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
                         for(var item in arrData){
                             let result = formatSmallNum(arrData[item][resultIndex])
                             finalData[item][index] = result || result==0
                             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                             :null;
                         }
                         
                         break
                     }
                     case("EFT_like"):{
                         var signalResultIndex = ''
                         //var conditionRadio = CIQ.store.state.form.conditionRadio[criteria][indexNum]
                         //console.log(conditionRadio)
                         for(var i in Object.keys(sd.outputMap)){
                             var keywordList = []
                             var signalKeywordList = []
                             switch(conditionRadio){
                                 case('Indicator Value'):{
                                     keywordList = ['EF ‌Ehler Fisher‌','KST ‌Pring KST‌','PMO ‌PMO‌','TII ‌Trend Int‌']
                                     for(var k in keywordList){
                                         if(Object.keys(sd.outputMap)[i].search(keywordList[k]) != -1){
                                             resultIndex = Object.keys(sd.outputMap)[i]
                                         }
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = ''
                                     break
                                 }
                                 case('Indicator Value '):{
                                     keywordList = ['EF ‌Ehler Fisher‌','KST ‌Pring KST‌','PMO ‌PMO‌','TII ‌Trend Int‌']
                                     signalKeywordList = ['Trigger','Signal']
                                     for(var k in signalKeywordList){
                                         if(Object.keys(sd.outputMap)[i].search(signalKeywordList[k]) != -1){
                                             signalResultIndex = Object.keys(sd.outputMap)[i]
                                         }
                                     }
                                     for(var k in keywordList){
                                         if(Object.keys(sd.outputMap)[i].search(keywordList[k]) != -1){
                                             resultIndex = Object.keys(sd.outputMap)[i]
                                         }
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_SL'
                                     break
                                 }
                                 default:
                             }
                         }
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
 
                         for(var item in arrData){
                             if(conditionRadio == 'Indicator Value'){
                                 finalData[item][index] = arrData[item][resultIndex] || arrData[item][resultIndex]==0
                                 ?parseFloat(arrData[item][resultIndex].toFixed(CIQ.countDecimalPlaces(arrData[item][resultIndex])))
                                 :null;
                             }else{
                                 let result = formatSmallNum(arrData[item][resultIndex])
                                 let signalResult = formatSmallNum(arrData[item][signalResultIndex])
                                 let resultMinus = formatSmallNum(result-signalResult)
                                 
                                 if(result&&signalResult){
                                     finalData[item][index] = parseFloat(resultMinus.toFixed(CIQ.countDecimalPlaces(resultMinus)))
                                 }else{
                                     finalData[item][index] =  null
                                 }
                             }
                         }
                         break
                     }
                     case("Stochastics_like"):{
                         var resultIndexK = ''
                         var resultIndexD = ''
                        // var conditionRadio = CIQ.store.state.form.conditionRadio[criteria][indexNum]
                        
                         for(var i in Object.keys(sd.outputMap)){
                             var signalKeywordList = []
                             switch(conditionRadio){
                                 case('%K'):{
                                     
                                     if(Object.keys(sd.outputMap)[i].search(conditionRadio) != -1){
                                         resultIndexK = Object.keys(sd.outputMap)[i]
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_%K'
                                     break
                                 }
                                 case('%D'):{
                                     if(Object.keys(sd.outputMap)[i].search(conditionRadio) != -1){
                                         resultIndexD = Object.keys(sd.outputMap)[i]
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_%D'
                                     break
                                 }
                                 case('%K '):{
                                     if(Object.keys(sd.outputMap)[i].search('%K') != -1){
                                         resultIndexK = Object.keys(sd.outputMap)[i]
                                     }
                                     if(Object.keys(sd.outputMap)[i].search('%D') != -1){
                                         resultIndexD = Object.keys(sd.outputMap)[i]
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_%K-%D'
                                     break
                                 }
                                 default:
                             }
                         }
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
                         for(var item in arrData){
                             if(conditionRadio == '%K'){
                                 let result = formatSmallNum(arrData[item][resultIndexK])
                                 finalData[item][index] = result || result==0
                                 ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                                 :null;
                             }else if(conditionRadio == '%D'){
                                 let result = formatSmallNum(arrData[item][resultIndexD])
                                 finalData[item][index] = result || result==0
                                 ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                                 :null;
                             }else if(conditionRadio == '%K '){
                                 let resultK = formatSmallNum(arrData[item][resultIndexK])
                                 let resultD = formatSmallNum(arrData[item][resultIndexD])
                                 let resultMinus = formatSmallNum(resultK-resultD)
                                 if(resultK&&resultD){
                                     finalData[item][index] = parseFloat(resultMinus.toFixed(CIQ.countDecimalPlaces(resultMinus)))
                                 }else{
                                     finalData[item][index] =  null
                                 }
                             }
                         }
                         break
                     }
                     case("ERI_like"):{
                         //var conditionRadio = CIQ.store.state.form.conditionRadio[criteria][indexNum]
                         //console.log(conditionRadio)
                         for(var i in Object.keys(sd.outputMap)){
                             switch(conditionRadio){
                                 case('Indicator hist1'):{
                                     if(Object.keys(sd.outputMap)[i].search('_hist1') != -1){
                                         resultIndex = Object.keys(sd.outputMap)[i]
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_hist1'
                                     break
                                 }
                                 case('Indicator hist2'):{
                                     if(Object.keys(sd.outputMap)[i].search('_hist2') != -1){
                                         resultIndex = Object.keys(sd.outputMap)[i]
                                     }
                                    CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_hist2'
                                     break
                                 }
                                 default:
                             }
                         }
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
                         for(var item in arrData){
                             let result = formatSmallNum(arrData[item][resultIndex])
                             finalData[item][index] = result || result==0
                             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                             :null;
                         }
                         break
                     }
                     case("ADX_like"):{
                         //var conditionRadio = CIQ.store.state.form.conditionRadio[criteria][indexNum]
                         for(var i in Object.keys(sd.outputMap)){
                             switch(conditionRadio){
                                 case('+DI ADX'):{             
                                     if(sd.outputMap[Object.keys(sd.outputMap)[i]]=="+DI"){
                                         resultIndex = Object.keys(sd.outputMap)[i]
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_+DI'
                                     break
                                 }
                                 case('-DI ADX'):{
                                     if(sd.outputMap[Object.keys(sd.outputMap)[i]]=="-DI"){
                                         resultIndex = Object.keys(sd.outputMap)[i]
                                     }
                                    CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_-DI'
                                     break
                                 }
                                 default:
                             }
                         }
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
                         for(var item in arrData){
                             let result = formatSmallNum(arrData[item][resultIndex])
                             finalData[item][index] = result || result==0
                             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                             :null;
                         }
                         break
                     }
                     case("MovingAverage_like"):{ 
                         // output only indicator value 
                         
                         resultIndex = Object.keys(sd.outputMap)[0]
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
                         for(var item in arrData){
                             let result = formatSmallNum(arrData[item][resultIndex])
                             finalData[item][index] = result || result==0
                             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                             :null;
                         }
                         CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = ''
                         break
                     }
                     case("Aligator_like"):{
                         var {radio,radioValue,techValue} = JSON.parse(conditionRadio)
                         var _conditionRadio = radio
 
                         var resultIndexRadioValue = ''
                         var resultIndexTechValue = ''
                         for(var i in Object.keys(sd.outputMap)){
                             
                             switch(_conditionRadio){
                                 case('first'):{
                                     if(Object.keys(sd.outputMap)[i].toLowerCase().search(techValue.toLowerCase()) != -1){
                                         resultIndex = Object.keys(sd.outputMap)[i]
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_'+techValue
                                     break
                                 }
                                 case('second'):{
                                     if(Object.keys(sd.outputMap)[i].toLowerCase().search(radioValue.toLowerCase()) != -1){
                                         resultIndexRadioValue = Object.keys(sd.outputMap)[i]
                                     }
                                     if(Object.keys(sd.outputMap)[i].toLowerCase().search(techValue.toLowerCase()) != -1){
                                         resultIndexTechValue = Object.keys(sd.outputMap)[i]
                                     }
                                     CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_'+ radioValue + '-' + techValue
                                     break
                                 }
                                 default:
                             }
                         }
                         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
                         for(var item in arrData){
                             if(_conditionRadio != 'second'){
                                 let result = formatSmallNum(arrData[item][resultIndex])
                                 finalData[item][index] = result || result==0
                                 ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                                 :null;
                             }else{
                                 let resultRadioValue = formatSmallNum(arrData[item][resultIndexRadioValue])
                                 let resultTechValue = formatSmallNum(arrData[item][resultIndexTechValue])
                                 let resultMinus = formatSmallNum(resultRadioValue-resultTechValue)
                                 if(resultRadioValue&&resultTechValue){
                                     finalData[item][index] = parseFloat(resultMinus.toFixed(CIQ.countDecimalPlaces(resultMinus)))
                                 }else{
                                     finalData[item][index] =  null
                                 }
                             }
                         }
                         break
                     }
                     case("LRF_like"):{
                         // output only indicator value 
                         resultIndex = Object.keys(sd.outputMap)[0]
                         var keywordList = ['Forecast ‌Lin Fcst‌‌','Forecast ‌Time Fcst‌']
                         for(var i in Object.keys(sd.outputMap)){
                             for(var k in keywordList){
                                 if(Object.keys(sd.outputMap)[i].search(keywordList[k]) != -1){
                                     resultIndex = Object.keys(sd.outputMap)[i]
                                 }
                             }
                         }
                         for(var item in arrData){
                             let result = formatSmallNum(arrData[item][resultIndex])
                             finalData[item][index] = result || result==0
                             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                             :null;
                         }
                         CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = ''
                         break
                     }
                     case("Trailingstop_like"):{
                         // output only indicator value 
                         resultIndex = Object.keys(sd.outputMap)[0]
                         var keywordList = ['Result ‌PSAR‌','All Stops ‌ATR Trailing Stop‌']
                         for(var i in Object.keys(sd.outputMap)){
                             for(var k in keywordList){
                                 if(Object.keys(sd.outputMap)[i].search(keywordList[k]) != -1){
                                     resultIndex = Object.keys(sd.outputMap)[i]
                                 }
                             }
                         }
                         for(var item in arrData){
                             let result = formatSmallNum(arrData[item][resultIndex])
                             finalData[item][index] = result || result==0
                             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                             :null;
                         }
                         CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = ''
                         break
                     }
                     default:{
 
                     }
                 }
             }
         }
     } 
     // 优先级最高，超越ma和normal indicators
     // find if there is a ma line attachs to an indicator
 
     const ciq_studies = CIQ.stxx.layout.studies
 
     for(var j in ciq_studies){
         var s = ciq_studies[j]
         if(!s) continue
 
         // normal senti indicator with ROCLike or symbol ohlcv with ROCLike or STMA with ROCLIKE
         if(
             s.type == "ST ROCLike" && 
             (s.inputs.Field == sd.type || s.inputs.Field == sd.inputs.Field || conditionRadio == 'Indicator Moving Average') &&
             s.parameters.criteria == criteria &&
             s.parameters.index == indexNum
         ){
             //const substrings = ['Rate Of Change','% of Previous Range','MA Ratio']
             const conditionMap = new Map([
                 ['Rate Of Change','ROC'],
                 ['% of Previous Range','OPR'],
                 ['MA Ratio','MA']
             ])
             let matchedSubstring = '';
             for(var i in Object.keys(arrData[arrData.length-10])){
                 if(Object.keys(arrData[arrData.length-10])[i].indexOf(s.inputs.display) !== -1){
                     matchedSubstring = conditionMap.get(s.inputs.display)
                 }
                 if(matchedSubstring &&
                     Object.keys(s.outputMap).indexOf(Object.keys(arrData[arrData.length-10])[i]) != -1){
                     if(Object.keys(arrData[arrData.length-10])[i] == 'supLine') continue
                     resultIndex = Object.keys(arrData[arrData.length-10])[i]
                 }
             }
             // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
             for(var item in arrData){
                 let result = formatSmallNum(arrData[item][resultIndex])
                 finalData[item][index] = result || result==0
                 ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                 :null;
             }
             CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_'+matchedSubstring
             return finalData
         }
 
         //如果是stma roc,则stma,roc, conditionRadio同时满足下面条件，这个判断会先进去，导致bug 
         let findROC = false
         for(var i in ciq_studies){
             if(ciq_studies[i].type == "ST ROCLike") findROC = true
         }
         // normal senti indicator with MA Line
         if(
             s.type == "ST MA" && 
             s.inputs.Field == sd.type && 
             conditionRadio == 'Indicator Moving Average' &&
             s.parameters.criteria == criteria &&
             s.parameters.index == indexNum &&
             !findROC 
         ){
             for(var i in Object.keys(arrData[arrData.length-10])){
                 if(Object.keys(arrData[arrData.length-10])[i].indexOf(s.name) != -1){
                     resultIndex = Object.keys(arrData[arrData.length-10])[i]
                 }
             }
             
             // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
             for(var item in arrData){
                 let result = formatSmallNum(arrData[item][resultIndex])
                 finalData[item][index] = result || result==0
                 ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
                 :null;
             }
             CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_ma' + s.days
             return finalData
         }
 
         // MovingAverage-Like with MA Line
         if(
             s.type == "ST MA" && 
             // todo: field随时可以变
             //s.inputs.Field == "field" && 
             sd.type == "ma" && 
             conditionRadio == 'Moving Average' &&
             s.parameters.criteria == criteria &&
             s.parameters.index == indexNum
         ){
             var resultIndexMA = ''
             for(var i in Object.keys(arrData[arrData.length-10])){
                 if(Object.keys(arrData[arrData.length-10])[i].indexOf(s.name) != -1){
                     resultIndex = Object.keys(arrData[arrData.length-10])[i]
                 }
                 if(Object.keys(arrData[arrData.length-10])[i].indexOf(sd.name) != -1){
                     resultIndexMA = Object.keys(arrData[arrData.length-10])[i]
                 }
             }
             // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
 
             for(var item in arrData){
                 let result = formatSmallNum(arrData[item][resultIndex])
                 let resultMA = formatSmallNum(arrData[item][resultIndexMA])
                 let resultMinus = formatSmallNum(result - resultMA)
                 finalData[item][index] = parseFloat(resultMinus.toFixed(CIQ.countDecimalPlaces(resultMinus)));
             }
             CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = '_ma' + s.days
             return finalData
         }
     }
 
     // find if this study is a normal sentiment indicator
     if( CIQ.isSentiIndicator(sd.type) || CIQ.isUserIndicator(sd.type)){
         
         let conditions = CIQ.store.state.form.backtestInfo[criteria]['signals'][indexNum]
         resultIndex = sd.type
         
         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
         for(var item in arrData){
             let result = formatSmallNum(arrData[item][resultIndex])
             finalData[item][index] = result || result==0
             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
             :null;     
         }
 
         CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = ''
     }else if( CIQ.isSymbolIndicator(sd.type)){
         resultIndex = Object.keys(sd.outputMap)[0]
         // load a value of this study to dataframe(important note: the value of correspond resultIndex is caculated differently)
 
         for(var item in arrData){
             let result = formatSmallNum(arrData[item][resultIndex])
             finalData[item][index] = result || result==0
             ?parseFloat(result.toFixed(CIQ.countDecimalPlaces(result)))
             :null;     
         }
 
         CIQ.labelOption[criteria=='entry'?indexNum:indexNum+5] = ''
     }   
     
     return finalData
 }
 
 // 一些共用工具函数，可以分离出来
 CIQ.displayableDate = function (stx, chart, dt, includeIntraYear) {
     function twoPlaces(val) {
         if (val < 10) return "0" + val;
         return val;
     }
     var displayableDate = "";
     var interval = stx.layout.interval;
     var isDaily = CIQ.ChartEngine.isDailyInterval(interval);
     var isSecond =
         (chart.xAxis.activeTimeUnit && chart.xAxis.activeTimeUnit <= CIQ.SECOND) ||
         stx.layout.timeUnit == "second";
     var isMS =
         (chart.xAxis.activeTimeUnit &&
             chart.xAxis.activeTimeUnit <= CIQ.MILLISECOND) ||
         stx.layout.timeUnit == "millisecond";
     if (chart.xAxis.formatter) {
         displayableDate = chart.xAxis.formatter(dt);
     } else if (stx.internationalizer) {
         displayableDate = stx.internationalizer.monthDay.format(dt);
         if (isSecond || isMS) {
             displayableDate +=
                 " " + stx.internationalizer.hourMinuteSecond.format(dt);
             if (isMS) displayableDate += "." + dt.getMilliseconds();
         } else if (!isDaily) {
             if (includeIntraYear)
                 displayableDate = stx.internationalizer.yearMonthDay.format(dt);
             displayableDate += " " + stx.internationalizer.hourMinute.format(dt);
         } else {
             if (interval == "month")
                 displayableDate = stx.internationalizer.yearMonth.format(dt);
             else displayableDate = stx.internationalizer.yearMonthDay.format(dt);
         }
     } else {
         var m = twoPlaces(dt.getMonth() + 1);
         var d = twoPlaces(dt.getDate());
         var h = twoPlaces(dt.getHours());
         var mn = twoPlaces(dt.getMinutes());
         if (isDaily) {
             displayableDate = interval == "month" ? m + "/" + d + "/" : m + "/" + d + "/";
             displayableDate += dt.getFullYear();
         } else {
             let date = m + "/" + d;
             if (includeIntraYear) date += "/" + dt.getFullYear();
             displayableDate = date + " " + h + ":" + mn;
             if (isSecond || isMS) {
                 var sec = twoPlaces(dt.getSeconds());
                 displayableDate += ":" + sec;
                 if (isMS) {
                     var mil = twoPlaces(dt.getMilliseconds());
                     if (mil < 100) mil = "0" + mil;
                     displayableDate += ":" + mil;
                 }
             }
         }
     }
     return displayableDate;
 };
 
 CIQ.setPanelHeight = function(indicatorList){
     var indicatorHeight = indicatorList.length<=1
                             ?200
                             :indicatorList.length<=2
                                 ?100
                                 :80
     var chartPanelFactor = indicatorList.length==0?75/100:55/100
     var height = chartPanelFactor*window.innerHeight + indicatorList.length*(indicatorHeight-20)
     CIQ.chartBox.style.height = height.toString()+ 'px'
     return indicatorHeight
 }
 // 暂定，封装ma状态保存函数
 CIQ.setMALayout = function(url,period,type,field,criteria,index){
     if (url == 'ma') {
       // keep current MA
       var objMA = { 
         period: period?period:20, 
         type: type?type:'simple',
         field: field?field:'Close',
         criteria: criteria, 
         index: index
       }
       var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout
 
       // remove current MA attached to an indicator
       var MALayoutListIndex = activatedMALayoutList.findIndex(
         (item) => item.criteria == criteria && item.index == index
       )
       if (MALayoutListIndex != -1) {
         activatedMALayoutList.splice(MALayoutListIndex, 1)
       }
       activatedMALayoutList.push(objMA)
       CIQ.store.commit('chart/getMALayout',activatedMALayoutList)
     }
   }
   CIQ.removeMALayout = function(url,criteria,index){
     if (url == 'ma') {
       var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout
 
       // remove current MA attached to an indicator
       var MALayoutListIndex = activatedMALayoutList.findIndex(
         (item) => item.criteria == criteria && item.index == index
       )
       if (MALayoutListIndex != -1) {
         activatedMALayoutList.splice(MALayoutListIndex, 1)
       }
 
       CIQ.store.commit('chart/getMALayout',activatedMALayoutList)
     }
   }
   // 用于changeRelation relation==1
   CIQ.keepTheFirstMALayout = function(criteria){
 
       var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout
 
       // 如tech是ma则保留第一个选项卡的ma信息
       var activatedMALayoutList = activatedMALayoutList.filter(
         (item) => item.criteria!=criteria || (item.criteria == criteria && item.index == 0)
       )
 
       CIQ.store.commit('chart/getMALayout',activatedMALayoutList)
 
   }
   // 用于changeRelation relation==0
   CIQ.removeExitMALayout = function(){
       var activatedMALayoutList = CIQ.store.state.chart.activatedMALayout
 
       // 如tech是ma则保留第一个选项卡的ma信息
       var activatedMALayoutList = activatedMALayoutList.filter(
         (item) => item.criteria == 'entry'
       )
 
       CIQ.store.commit('chart/getMALayout',activatedMALayoutList)
   }
   CIQ.countDecimalPlaces = function(number) {
     if(!number && number!=0) return 0
     // Convert the number to a string representation
     const numberStr = number.toString();
   
     // Use regular expression to match the decimal part
     const decimalMatch = numberStr.match(/\.(\d+)/);
   
     // If a decimal part is found, return its length (number of decimal places)
     // Otherwise, return 0
     return decimalMatch ? decimalMatch[1].length>4 ? 4 : decimalMatch[1].length : 0;
   }
 export {CIQ}