/**
 *	2.2.0
 *	contains customized functions related to indicator loading and CSV output file generation
 */
 import { CIQ as _CIQ, timezoneJS as _timezoneJS } from "chartiq/js/chartiq.js";
 import {config} from "@/components/common/chart/st-development/examples/feeds/STDataFeedAccessUrl"
 import { uniqueObjectArray } from '@/utils/formValidate'
 import {capitalizeFirstLetter} from '@/utils'
 import { recoverSymbolOptixUrl,getCoresSymbolDual } from "@/utils/globalFunc";

 /** 独立出的myIndicator对于chartiq的控制函数，考虑到它并没有很依赖loadIndicator.js */

 let __st_js_myindicator_chart_control_ = (_exports) => {
 /* global _CIQ, _timezoneJS, _SplinePlotter */
 
 var CIQ = typeof _CIQ !== "undefined" ? _CIQ : _exports.CIQ;
    // user's own indicator的 weight indicator加载函数单独设定
    //var symbol

    CIQ.displayWeightOwnIndicator = async function(previousState,updatedState,combinedStudy){
        CIQ.addCover()
        CIQ.store.commit('states/SET_MI_CREATE_LOADING', true)
        //编辑时对内容修改或者preview应该移除生成的indicator
        if(!combinedStudy){
            for (var studyInstanceName in CIQ.stxx.layout.studies) { 
                var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                if(CIQ.isOwnIndicator(sd.type)) CIQ.Studies.removeStudy(CIQ.stxx, sd); 
            }
        }


        // 提取indicator移除列表和新增列表,
        const { addedItems, removedItems } = findAddedAndRemovedItems(previousState, updatedState);
        
        // 防止symbol出现 [AA, AA]的情况，第二个为序列显示，但是会报错
        const indicatorList = uniqueObjectArray(updatedState.filter(item=> item.type=='Indicator'))
        const symbolList = uniqueObjectArray(updatedState.filter(item=> item.type=='Symbol'))

        // indicator移除
        for (var studyInstanceName in CIQ.stxx.layout.studies) {
            var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
            if (removedItems.find(item=>item.indicator_url==sd.type)){
                CIQ.Studies.removeStudy(CIQ.stxx, sd); 
            }
        }
        // indicator加载
        await addIndicatorStudy(addedItems.map(item=>item.indicator_url))

        const benchmark = CIQ.store.state.chart.miBenmark
        CIQ.stxx.loadChart({ 
            // 优先考虑symbolList第一个，然后是benchmark（edit时）, benchmark不存在就用默认
                symbol: symbolList.length?symbolList[0].indicator_url:benchmark?benchmark:process.env.VUE_APP_DEFAULT_SYMBOL, 
                indicator:[...indicatorList.map(item=>item.indicator_url),combinedStudy] ,
                // 这边先写死范围，防止其他indicator无法pagination
                startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(),
            },
            function () {
                // symbol加载，识别第一个为默认图标symbol,其它symbol作为serie加载,必须遍历加载，不然很难管理
                manageSymbolSerie(symbolList);
                CIQ.hideCover()
                CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
            }
        ) 
        
    }

    // 同metaData
    const addIndicatorStudy = function(indicatorList){
        var color = ["#5B9BD1","#368DF0","#7257F2","#21CE6B","#24CBB7","#EC4D4E","#F4803D"]
   
        //let indicatorHeight = CIQ.setPanelHeight(indicatorList)
        // let indicatorHeight = 100
    
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
                        // panelHeight:indicatorHeight,
                        parameters: { init: {
                            studyOverZonesEnabled: true,
                            studyOverBoughtValue: 999,
                            studyOverBoughtColor: process.env.VUE_APP_RED,
                            studyOverSoldValue: 999,
                            studyOverSoldColor: process.env.VUE_APP_GREEN
                        }},
                        attributes:{
                            studyOverBoughtValue:{"step":0.001},
                            studyOverSoldValue:{"step":0.001}
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
                "?indicator=" + recoverSymbolOptixUrl(indicatorList[i]);
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
                            // panelHeight:indicatorHeight,
                            parameters: { init: {
                                studyOverZonesEnabled: true,
                                studyOverBoughtValue: newQuotes[i].opt_extreme?Math.round(newQuotes[i].opt_extreme*1000)/1000:NaN,
                                studyOverBoughtColor: process.env.VUE_APP_RED,
                                studyOverSoldValue: newQuotes[i].pess_extreme?Math.round(newQuotes[i].pess_extreme*1000)/1000:NaN,
                                studyOverSoldColor: process.env.VUE_APP_GREEN
                            }},
                            attributes:{
                                studyOverBoughtValue:{"step":0.001},
                                studyOverSoldValue:{"step":0.001}
                            }
                        }
                        
                            var str = JSON.stringify(newStudy);                                   
                            str = str.replace(/indicatorClose/g, sentiUrlList[i]);
                            newStudy = JSON.parse(str)                                     
                            
                            CIQ.Studies.studyLibrary[sentiUrlList[i]] = newStudy
                            let sentiName = CIQ.findSentiIndicator(null,sentiUrlList[i])?.chart_name
                            CIQ.Studies.addStudy(CIQ.stxx,sentiUrlList[i],{display:sentiName})    
                        
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
            if(i>0){
                CIQ.stxx.addSeries(symbolList[i].indicator_url, {
                    display:symbolList[i].indicator, 
                    isComparison: false, 
                    color: "#368DF0",
                    permanent: true,
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
    CIQ.updateUserOwnIndicator = async function(newData,oldData){
        await new Promise((resolve) => {
            CIQ.addCover()
            CIQ.store.commit('states/SET_MI_CREATE_LOADING', true)
            //编辑时对内容修改或者preview应该移除生成的indicator
            for (var studyInstanceName in CIQ.stxx.layout.studies) { 
                var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                if(CIQ.isOwnIndicator(sd.type)) CIQ.Studies.removeStudy(CIQ.stxx, sd); 
            }

            if(oldData.categories != newData.categories){
                // 仅当大类切换（indicator->symbol->wic）才移除现存studies
                if(oldData.categories.split(' ')[0] != newData.categories.split(' ')[0]){
                    // remove existing studies and series
                    for (var studyInstanceName in CIQ.stxx.layout.studies) { 
                        var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                        CIQ.Studies.removeStudy(CIQ.stxx, sd); 
                    }
                    for(var s in CIQ.stxx.chart.series){
                        var series=CIQ.stxx.chart.series[s];
                        CIQ.stxx.removeSeries(series);
                    }
                }

                // 类型切换时设置默认timeframe(主要因为WIC,indicator,symbol会设置'form/getFrequency')
                CIQ.store.commit('form/getFrequency', 'Daily')

                CIQ.hideCover()
                CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
                resolve()
                return
            }
            
            if(newData.categories.includes('Symbol')){
                // 如果左侧发生变动
                if(oldData.indicator1.url != newData.indicator1.url){
                    // 刷新当前symbol序列,如果操作后另一个框存在了同样的symbol就跳过加载（ [A,AAON]->[A,A] or [A,null]->[A,A]）
                    // if(newData.indicator1.url == newData.indicator2.url) {
                    //     var series = CIQ.stxx.chart.series[oldData.indicator2.url];
                    //     if(series) CIQ.stxx.removeSeries(series);
                    // }

                    CIQ.objIndicator = []
                    CIQ.stxx.loadChart({
                        symbol: newData.indicator1.url,
                        startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),
                        endDate:new Date(),
                    },()=>{
                        CIQ.hideCover()
                        CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
                    })
                }
                // 如果右侧发生变动
                if(oldData.indicator2.url != newData.indicator2.url){
                    CIQ.store.commit('form/setComparisonSymbol', {
                        name:newData.indicator2.name,
                        url:newData.indicator2.url,
                    })

                    // 刷新当前symbol序列
                    var series = CIQ.stxx.chart.series[oldData.indicator2.url];
                    if(series) CIQ.stxx.removeSeries(series);
                        CIQ.stxx.loadChart({    // 需要刷新一次，因为可能会修改timeframe
                            symbol: CIQ.stxx.chart.symbol,
                            startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),
                            endDate:new Date(),
                        },()=>{
                            CIQ.hideCover()
                            CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
                        })
                        CIQ.stxx.addSeries(newData.indicator2.url, {
                            display:newData.indicator2.name, 
                            isComparison: false, 
                            color: "#368DF0",
                            permanent: true,
                            //panel:newData.indicator2.url,
                            // This setting is only applicable when using the primary y-axis and has no effect when using a renderer that has its own axis.
                            yAxis:{ 
                                position:"left",
                                textStyle:"#FFBE00"
                            },
                            //shareYAxis: true
                        },()=>{});
                }
                resolve()
            }
            
            if(newData.categories.includes('Indicator')){
                if(oldData.indicator1.url != newData.indicator1.url){
                    // 如果操作前左右indicator都一样，则添加时不移除现有的indicator（ [aim,aim]->[aim,smart_money]）
                    if(oldData.indicator1.url != oldData.indicator2.url) {
                        for (var studyInstanceName in CIQ.stxx.layout.studies) {
                            var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                            if (sd.type == oldData.indicator1.url){
                                CIQ.Studies.removeStudy(CIQ.stxx, sd); 
                            }
                        }
                    }

                    // 如果操作后另一个框存在了同样的indicator就刷新当前indicator后跳过加载（ [aim,smart_money]->[aim,aim]）
                    if(newData.indicator1.url == newData.indicator2.url) {
                        resolve();   
                        CIQ.hideCover()
                        CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
                        return
                    }
                    addSingleIndicator([newData.indicator1.url,newData.indicator2.url],newData.indicator1.url,null,null,()=>{resolve()});
                }
                if(oldData.indicator2.url != newData.indicator2.url){
                    // 如果操作前左右indicator都一样，则添加时不移除现有的indicator（ [aim,aim]->[aim,smart_money]）
                    if(oldData.indicator1.url != oldData.indicator2.url) {
                        for (var studyInstanceName in CIQ.stxx.layout.studies) {
                            // 移除stma的逻辑给addOwnIndicatorMAStudy管理，不在这
                            var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                            if (sd.type== oldData.indicator2.url){
                                CIQ.Studies.removeStudy(CIQ.stxx, sd); 
                            }
                        }       
                    }

                    // 如果操作后另一个框存在了同样的indicator就刷新当前indicator后跳过加载（ [aim,smart_money]->[aim,aim]）
                    if(newData.indicator1.url == newData.indicator2.url) {
                        resolve();   
                        CIQ.hideCover()
                        CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
                        return
                    }
                    addSingleIndicator([newData.indicator1.url,newData.indicator2.url],newData.indicator2.url,null,null,()=>{resolve()});
                }
            }

            // finally,需要刷新一次，因为可能会修改timeframe
            if(
                (oldData.categories == newData.categories) &&
                (oldData.indicator1.url == newData.indicator1.url) &&
                (oldData.indicator2.url == newData.indicator2.url)
            ){
                CIQ.stxx.loadChart({
                    symbol: CIQ.stxx.chart.symbol,
                    startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),
                    endDate:new Date(),
                },()=>{
                    CIQ.hideCover()
                    CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
                })
                resolve(); 
            }      
        })
    }

    // 预览生成的新indicator
    CIQ.previewUserOwnIndicator = function(indicatorList,indicator,symbol,extremeLines){
                //编辑时对内容修改或者preview应该移除生成的indicator
                for (var studyInstanceName in CIQ.stxx.layout.studies) { 
                    var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
                    if(CIQ.isOwnIndicator(sd.type)) CIQ.Studies.removeStudy(CIQ.stxx, sd); 
                }
        addSingleIndicator(indicatorList,indicator,symbol,extremeLines);
    }

    // 从列表进入后还原new indicator的设定和新的indicator
    // 我这里不用重新触发inputSelectHandler的思路来复现图表，因为这样会导致图表加载流程冗余
    CIQ.displayUserOwnIndicatorLayout = async function(_newVal){
        //考虑到addSeries必须在displaydata前设定好timeframe
        CIQ.store.commit('form/getFrequency', _newVal.time_frame) //考虑到addSeries必须写死timeframe

        CIQ.addCover()
        CIQ.store.commit('states/SET_MI_CREATE_LOADING', true)
        const newData = {
            categories : _newVal.categories,
            indicator1 : {name:_newVal.former,url:_newVal.indicator_1_url},
            indicator2 : {name:_newVal.latter,url:_newVal.indicator_2_url},
            url : _newVal.name+'CREATE'+_newVal.url,
            mul_indicator : _newVal.mul_indicator,
            weight_list: _newVal.weightData,
            ma: _newVal.ma,
            calculate: _newVal.calculate, //symbol ohlcv field(Open,High...)
        }
        const extremeLines = {op:_newVal.upper_extreme_value,ep:_newVal.lower_extreme_value}
           
        if(newData.categories == 'Symbol Spread' || newData.categories == 'Symbol Ratio' || newData.categories == 'Symbol Addition'){
                // indicator1,包括主symbol和new indicator
                CIQ.objIndicator = []
                CIQ.store.commit('form/setComparisonSymbol', {
                    name:newData.indicator2.name,
                    url:newData.indicator2.url,
                })
                
                CIQ.stxx.loadChart({
                    symbol: newData.indicator1.url, // indicator1和benchmark一致的
                    indicator:[newData.url],
                    startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(),
                }, function(){
                    CIQ.hideCover()
                    CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
                })
                CIQ.stxx.addSeries(newData.indicator2.url, {
                    display:newData.indicator2.name, 
                    isComparison: false, 
                    color: "#368DF0",
                    permanent: true,
                    //panel:newData.indicator2.url,
                    // This setting is only applicable when using the primary y-axis and has no effect when using a renderer that has its own axis.
                    yAxis:{ 
                        position:"left",
                        textStyle:"#FFBE00"
                    },
                    //shareYAxis: true
                },()=>{
                    displayOwnIndicatorMAStudies(newData)
                });
                // 如果展示时右框存在了同样的symbol就跳过加载（ [A,AAON]->[A,A] or [A,null]->[A,A]）
                // if(newData.indicator1.url != newData.indicator2.url) {
                //     //indicator2,即comparison symbol
                //     CIQ.stxx.addSeries(newData.indicator2.url, {
                //         display:newData.indicator2.name, 
                //         isComparison: false, 
                //         color: "#368DF0",
                //         permanent: true,
                //         //panel:newData.indicator2.url,
                //         // This setting is only applicable when using the primary y-axis and has no effect when using a renderer that has its own axis.
                //         yAxis:{ 
                //             position:"left",
                //             textStyle:"#FFBE00"
                //         },
                //         //shareYAxis: true
                //     });
                // }
                // displayOwnIndicatorMAStudies(newData)
                await getUserOwnIndicatorMatedata(newData.url,extremeLines)
        }
        
        if(newData.categories == 'Indicator Spread' || newData.categories == 'Indicator Ratio'|| newData.categories == 'Indicator Addition'){
            // indicator1
            await getUserOwnIndicatorMatedata(newData.indicator1.url,null)
            // indicator2
            if(newData.indicator1.url != newData.indicator2.url) {
                // 如果展示时右框存在了同样的indicator就跳过加载
                await getUserOwnIndicatorMatedata(newData.indicator2.url,null)
            }
            
            // 自定义indicator
            await getUserOwnIndicatorMatedata(newData.url,extremeLines)
            const benchmark = CIQ.store.state.chart.miBenmark
            CIQ.stxx.loadChart(	{ 
                symbol: benchmark?benchmark:process.env.VUE_APP_DEFAULT_SYMBOL, 
                indicator:[newData.indicator1.url,newData.indicator2.url,newData.url],
                startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(),
            }, function(){
                displayOwnIndicatorMAStudies(newData)
                CIQ.hideCover()
                CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
            }) 
        }

        if(newData.categories == "Weighted Indicator Combination"){
            // WIC 列表加载
            // 自定义indicator
            await getUserOwnIndicatorMatedata(newData.url,extremeLines)
            CIQ.store.dispatch('chart/set_miFormWeightedListChange',{data:newData.weight_list,url:newData.url})
        }

        CIQ.isOHLCVSelectedMI = false
        if(newData.categories == "OHLCV"){
            CIQ.isOHLCVSelectedMI = true
            // WIC 列表加载
            // 自定义indicator
            await getUserOwnIndicatorMatedata(newData.url,extremeLines)


            const benchmark = CIQ.store.state.chart.miBenmark
            CIQ.stxx.loadChart({
                symbol: newData.indicator1.url?newData.indicator1.url:benchmark?benchmark:process.env.VUE_APP_DEFAULT_SYMBOL, 
                indicator:[newData.url],
                startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(),
            }, function(){
                displayOwnIndicatorMAStudies(newData)
                CIQ.hideCover()
                CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
            })
        }

        // WIC也需要初始化miFormState,主要是用到设定category
        CIQ.store.commit('chart/miFormStateChange',{
            categories: newData.categories,
            indicator_1: newData.indicator1.name,
            indicator_2: newData.indicator2.name,
            indicator_1_url: newData.indicator1.url,
            indicator_2_url: newData.indicator2.url,
        })
    }

    // 展示还原study附属的ma
    const displayOwnIndicatorMAStudies = function(newData){
        if(newData.categories == 'OHLCV'){
            const ma_type = newData.ma.includes('e') ? 'EMA' : 'MA'
            const ma_value = newData.ma.includes('e') ? newData.ma.split('e')[0] : newData.ma
            const ma_showInput = ma_value != '1'

            CIQ.addOwnIndicatorMAStudy(
                ma_value,
                ma_type,
                capitalizeFirstLetter(newData.calculate),
                'entry1',
                0,
                ma_showInput,
                newData.categories
            )  
        }else {
            let ma_parse_list = newData.ma.split('_')
            const ma1_index = ma_parse_list[0].indexOf('e')
            const ma1_type = ma1_index == -1 ? 'MA' : 'EMA'
            const ma1_value = ma1_index == -1 ? ma_parse_list[0] : ma_parse_list[0].slice(0,ma1_index)
            const ma1_showInput = ma1_value != '1'
            const ma2_index = ma_parse_list[1].indexOf('e')
            const ma2_type = ma2_index == -1 ? 'MA' : 'EMA'
            const ma2_value = ma2_index == -1 ? ma_parse_list[1] : ma_parse_list[1].slice(0,ma2_index)
            const ma2_showInput = ma2_value != '1'
            let fieldName1 = 'field',fieldName2 = 'field'
            if(newData.categories.includes('Symbol')){ // symbol
            }else{        
                fieldName1 = newData.indicator1.url
                fieldName2 = newData.indicator2.url
            }
        
                // ma1
                CIQ.addOwnIndicatorMAStudy(
                    ma1_value,
                    ma1_type,
                    fieldName1,
                    'entry1',
                    0,
                    ma1_showInput,
                    newData.categories
                )
                // ma2
                CIQ.addOwnIndicatorMAStudy(
                    ma2_value,
                    ma2_type,
                    // 如果是indicator则field为indicator_url，如果是symbol则main panel
                    fieldName2,
                    // 不是symbol類型的話，不用關心雙股票條件，默認爲entry1
                    newData.categories.includes('Symbol') ? 'entry2' : 'entry1',
                    1,
                    ma2_showInput,
                    newData.categories
                )
        }

    }

    // 第一个参数是默认值为SPX的symbol，own indicator quotefeed请求时为默认symbol，own symbol quotefeed请求时为表单第一个symbol
    // 第2个参数是给quotefeed请求提供的indicator列表，
    // 第3个是要加载的当前indicator
    const addSingleIndicator = async function(indicatorList,indicator,symbol,extremeLines,callback){
        // remove redundant elements and empty string
        for(var i=0;i<indicatorList.length;i++){
        if(indicatorList[i]=='' || indicatorList[i]==undefined){
            indicatorList.splice(i,1)
            i--;
        }
        }

        // fetch indicator information and add studies to chart
        await getUserOwnIndicatorMatedata(indicator,extremeLines)
        CIQ.stxx.loadChart(	{ 
            symbol: symbol?symbol:CIQ.stxx.chart.symbol, 
            indicator:indicatorList,
            startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(),
        },()=>{
            if(callback) callback()
            CIQ.hideCover()
            CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
        }) 
    }
    const getUserOwnIndicatorMatedata = async function(indicator,extremeLines){
        var color = "#000000"
        return new Promise(resolve=>{
                if(CIQ.isOwnIndicator(indicator)){
                /********************lishan modify end*************************/
                    var newStudy = {
                        inputs: { Period: 13, Overlay: false},
                        outputs: 
                        {indicatorClose:color,description: '',url:indicator},
                        parameters: { init: {
                            studyOverZonesEnabled: true,
                            studyOverBoughtValue: extremeLines?Math.round(extremeLines.op*1000)/1000:NaN,
                            studyOverBoughtColor: process.env.VUE_APP_RED,
                            studyOverSoldValue: extremeLines?Math.round(extremeLines.ep*1000)/1000:NaN,
                            studyOverSoldColor: process.env.VUE_APP_GREEN
                        }},
                        attributes:{
                            studyOverBoughtValue:{"step":0.001},
                            studyOverSoldValue:{"step":0.001}
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
                    "?indicator=" + recoverSymbolOptixUrl(indicator);
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
                                        studyOverZonesEnabled: true,
                                        studyOverBoughtValue: newQuotes.opt_extreme?Math.round(newQuotes.opt_extreme*1000)/1000:NaN,
                                        studyOverBoughtColor: process.env.VUE_APP_RED,
                                        studyOverSoldValue: newQuotes.pess_extreme?Math.round(newQuotes.pess_extreme*1000)/1000:NaN,
                                        studyOverSoldColor: process.env.VUE_APP_GREEN
                                    }},
                                    attributes:{
                                        studyOverBoughtValue:{"step":0.001},
                                        studyOverSoldValue:{"step":0.001}
                                    }
                                }
                                
                                    var str = JSON.stringify(newStudy);                                   
                                    str = str.replace(/indicatorClose/g, indicator);
                                    newStudy = JSON.parse(str)                                     
                                    
                                    CIQ.Studies.studyLibrary[indicator] = newStudy
                                    let sentiName = CIQ.findSentiIndicator(null,indicator)?.chart_name
                                    CIQ.Studies.addStudy(CIQ.stxx,indicator,{display:sentiName})                
                            }
  
                        resolve()                     
                    }).catch(err => {
                        
                    })

                }
        })

    }

    CIQ.addOwnIndicatorMAStudy = function(value,type,field,criteria,index,showInput,categories) {
        const ma_color = CIQ.store.getters.getColorByCriteriaAndIndex(criteria, 0)
        if(categories.includes('Indicator')){
            // 更新ma前移除当前index的旧ma
            for (var studyInstanceName in CIQ.stxx.layout?.studies) {
                let sd = CIQ.stxx.layout.studies[studyInstanceName]
                if (
                    ['ma','ST MA'].includes(sd.type)
                    && sd.parameters.index == index
                ) {
                // 直接判断是否为st ma
                CIQ.Studies.removeStudy(
                    CIQ.stxx,
                    sd
                )
                }
            }

            // 现在逻辑改了，symbol2的均线也直接绘制在main panel上，视作exit2(因为是symbol2的退场)
            if(!showInput || !field) return
            CIQ.Studies.addStudy(CIQ.stxx, 'ST MA', {
                    Type: type == 'MA' ? 'simple' : 'exponential',
                    Period: value,
                    display: 'ST MA', //无需显示
                    Field: field
                }, 
                { MA: ma_color },
                { criteria: criteria, index: index },
            )
        }else { // symbol
            // 更新ma前移除当前index的旧ma
            for (var studyInstanceName in CIQ.stxx.layout?.studies) {
                let sd = CIQ.stxx.layout.studies[studyInstanceName]
                if (
                    ['ma','ST MA'].includes(sd.type)
                    && sd.parameters.index == index
                ) {
                // 直接判断是否为st ma
                CIQ.Studies.removeStudy(
                    CIQ.stxx,
                    sd
                )
                }
            }

            // 现在逻辑改了，symbol2的均线也直接绘制在main panel上，视作exit2(因为是symbol2的退场)
            const symbolLabel = getCoresSymbolDual(criteria.endsWith(2))
            if(!showInput || !field) return

            CIQ.Studies.addStudy(CIQ.stxx, 'ma', {
                    Type: type == 'MA' ? 'simple' : 'exponential',
                    Field: field,
                    Period: value,
                    display: `(${symbolLabel})Moving Average`, //无需显示
                }, 
                { MA: ma_color },
                { criteria: criteria, index: index },
            ) 
        }

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

    CIQ.changeUserOwnIndicatorSymbol = function(data){
        CIQ.addCover()
        CIQ.store.commit('states/SET_MI_CREATE_LOADING', true)
        //编辑时对内容修改或者preview应该移除生成的indicator

        for (var studyInstanceName in CIQ.stxx.layout.studies) { 
            var sd = CIQ.stxx.layout.studies[studyInstanceName]; 
            if(CIQ.isOwnIndicator(sd.type)) CIQ.Studies.removeStudy(CIQ.stxx, sd); 
        }

        const benchmark = CIQ.store.state.chart.miBenmark
        CIQ.stxx.loadChart({
            symbol: data.symbol?data.symbol:benchmark?benchmark:process.env.VUE_APP_DEFAULT_SYMBOL, 
            startDate:new Date(parseInt(process.env.VUE_APP_START_DATE)),endDate:new Date(),
        }, function(){
            CIQ.hideCover()
            CIQ.store.commit('states/SET_MI_CREATE_LOADING', false)
        })
    }

    // 预留：layout management
    // CIQ.localStorage.saveLayout = function(){
    //     var layout = JSON.stringify(CIQ.stxx.exportLayout(true));
	//     localStorage.setItem("myChartLayout", layout);
    // }
    // CIQ.localStorage.restoreLayout = function(){
    //     var savedLayout = localStorage.getItem("myChartLayout");
    //     var importOptions = {
    //         managePeriodicity: true,
    //         preserveTicksAndCandleWidth: true
    //     };
    //     if (savedLayout) CIQ.stxx.importLayout(JSON.parse(savedLayout), importOptions);
    // }

    //utils
 }
 export {__st_js_myindicator_chart_control_}