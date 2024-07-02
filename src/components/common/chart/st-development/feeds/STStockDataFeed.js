/**
 *	2.2.0
 *	customized quotefeed
 */
const quoteFeedSimulator = {};
import {config} from "./STDataFeedAccessUrl.js"
import {CIQ} from "chartiq/js/standard.js"
import jutils from 'jutils-src'
import LRUCache from 'lru-cache';
import _this from "@/main";
import {decodeBase64} from '@/utils'
import {recoverSymbolOptixUrl,getSymbolInfo} from '@/utils/globalFunc'

// 目前只给pairdata LRU缓存
const cache = new LRUCache({
  max: 100, // 缓存的最大项数
  maxAge: 1000 * 60 * 5, // 缓存项的生命周期为5分钟
});
function getCachedData(url) {
    const cachedData = cache.get(url);
    if (cachedData) {
        // console.log('!!!!get cachedData!!!!: ',cachedData.config.url)
        return Promise.resolve(cachedData);
    } else {
        return CIQ.axios.get(url).then((response) => {
            cache.set(url, response);
            return response;
        });
    }
}

quoteFeedSimulator.sendAjax = async function (url, cb) {
    const {name} = getSymbolInfo(CIQ.stxx.chart.symbol)
    CIQ.stxx.chart.symbolDisplay = name

    try{
        const res = await getCachedData(url)
        if(res.status==200){
            cb(res.status, res.data);
        }else{
            cb(500)
        }
    }catch(error){
        cb(500)
    }

};

quoteFeedSimulator.url = config.pairDataUrl;

quoteFeedSimulator.sendReq = async function(start,end,new_str,freq,cb){
    let symbol = CIQ.symbol
    const {type} = getSymbolInfo(symbol)
    if(!['stock','index'].includes(type)){
        symbol = process.env.VUE_APP_DEFAULT_SYMBOL
    }
        var queryUrl = this.url + 
        "?symbol=" + symbol + 
        new_str +
        "&start="+start+
        "&end=" + end +
        "&freq=" + freq

    try{
        var favoriteSymbolList = []
        var favoriteIndicatorList = []
        if(CIQ.store.state.chart.favoriteSymbolList.length>0){
            favoriteSymbolList = CIQ.store.state.chart.favoriteSymbolList
        }else{
            const data = await CIQ.getFavorite()
            try{
                favoriteSymbolList = JSON.parse(data.favorite_symbol)
                favoriteIndicatorList = JSON.parse(data.favorite_indicator)
            }catch{}
        }
        
        CIQ.store.commit('chart/setFavoriteIndicatorList',favoriteIndicatorList)
        CIQ.store.commit('chart/setFavoriteSymbolList',favoriteSymbolList)
        try{
            var div = document.querySelectorAll(".favBtnContainer")[0].querySelectorAll("button")[0]
            var count=0;
            for(var item in favoriteSymbolList){
                if(favoriteSymbolList[item] == symbol){
                    // del
                    div.style.cssText = "width: 188px;height: 35px;border-radius: 20px;border: 0.1rem rgb(80, 166, 252) solid;font-size: 0.6rem;font-weight:bold;background: #409EFF;color: white;font-family: Helvetica, sans-serif;cursor:pointer"
                    div.innerHTML = "<div><svg t='1638255076868' class='button_icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2654' width='200' height='200'><path d='M885.942179 427.687756l-267.445168-22.933315-104.470353-246.470461L409.553235 404.75444l-267.336698 22.933315 202.846918 175.770236-60.789505 261.34524 229.753731-138.569986 229.859132 138.569986-60.785411-261.34524L885.942179 427.687756zM514.026658 656.403854l-139.875724 84.425831 37.038568-159.160953-123.591853-106.975407 162.91751-14.053064 63.511499-150.116973 63.620993 150.116973 162.860205 14.053064-123.534548 106.975407 37.038568 159.160953L514.026658 656.403854z' p-id='2655' fill='#FFFFFF'></path></svg><span>Remove from favorites</span></div>";
                    div.attributes.stxtap.nodeValue="SentimentLook.delSymbolCookie()";
                    count++
                }
            }
            if (count === 0){
                // add
                //document.querySelectorAll(".cq-comparison-new")[0].classList.remove('stxMenuActive')
                div.style.cssText = "width: 188px;height: 32px;border-radius: 20px;border: 0.1rem rgb(80, 166, 252) solid;font-size: 0.6rem;font-weight:bold;background: #f8f8f9;font-family: Helvetica, sans-serif;cursor:pointer;color: #666"
                div.innerHTML = "<div><svg t='1638255076868' class='button_icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2654' width='200' height='200'><path d='M885.942179 427.687756l-267.445168-22.933315-104.470353-246.470461L409.553235 404.75444l-267.336698 22.933315 202.846918 175.770236-60.789505 261.34524 229.753731-138.569986 229.859132 138.569986-60.785411-261.34524L885.942179 427.687756zM514.026658 656.403854l-139.875724 84.425831 37.038568-159.160953-123.591853-106.975407 162.91751-14.053064 63.511499-150.116973 63.620993 150.116973 162.860205 14.053064-123.534548 106.975407 37.038568 159.160953L514.026658 656.403854z' p-id='2655' fill='#1296db'></path></svg><span>Add to favorites</span></div>";
                div.attributes.stxtap.nodeValue="SentimentLook.addSymbolCookie()";
            }
        }catch(e){
            //console.error(e)
        }
    }catch(e){
        //console.error(e)
    }

    this.sendAjax(queryUrl,async function (status, response){
        const isWholeData = CIQ.initialDate.start==parseInt(process.env.VUE_APP_START_DATE)
        console.log("moreAvailable:",CIQ.store.getters.getScannerAIFlagState?false:isWholeData?false:true)
        //在scannerai可以默认配置加载全部数据之前先用全局变量判断路由是否为scannerai
        if (status == 200){
            var newQuotes = await quoteFeedSimulator.formatChartData(response);
            cb({
                moreAvailable:CIQ.store.getters.getScannerAIFlagState?false:isWholeData?false:true,
                quotes:newQuotes,
                upToDate: true  // set to true in the initial and pagination fetch callbacks if the responses do not require more "future" data (i.e., forward pagination)
            });
            let view = CIQ.stxx.exportLayout()

        }else{
            cb({error:response ? response : status});
        }
    });
}

quoteFeedSimulator.fetchInitialData = function(symbol,startDate,endDate,params,cb){
    // initEndDate for testing
    //CIQ.updateFavorite(JSON.stringify([]),JSON.stringify([]))	
    this.initEndDate = endDate 
    var oneYear = (24 *60 *60 *1000) * 365

    // 466963200000
    // -138009600000
    var startDateParse = (params.symbolObject.startDate?params.symbolObject.startDate:startDate).getTime()
    var endDateParse = (params.symbolObject.endDate?params.symbolObject.endDate:endDate).getTime()
    var start = config.timestampToTime(startDateParse)
    var end = config.timestampToTime(endDateParse)
    console.log('startDateParse: ',Date.parse(params.symbolObject.startDate?params.symbolObject.startDate:startDate),(params.symbolObject.startDate?params.symbolObject.startDate:startDate).getTime());
    console.log('Initial urlstart: '+start + ' end:'+end);
    
    // CIQ.initialDate is provided for Marker
    CIQ.initialDate = {start:startDateParse,end:endDateParse}

    //this.fetchStatus(symbol,start,end,params.symbolObject.indicator)
    CIQ.symbol = symbol;
    if (params.symbolObject.indicator === undefined){
        if (CIQ.objIndicator === undefined){
            // CIQ.objIndicator = 'AAPL'
            // AAPL
        }
    }else if(params.symbolObject.indicator.length == 0){
        //console.log('load default symbol as indicator', CIQ.objIndicator)
        // when first time loading a technical indicator, no params of indicators in query, pick default value
        //CIQ.objIndicator = ['AAPL']
    }else {
        CIQ.objIndicator = params.symbolObject.indicator
    }
    var new_str = ''

            var orignalFreq = 'daily'
            var selectedFreq = 'daily'

            let list = []
            for(var i in CIQ.objIndicator){
                if(!(CIQ.findBuiltinTechIndicator(null,CIQ.objIndicator[i]) || CIQ.findSymbolIndicator(CIQ.objIndicator[i],null))){
                    list.push(CIQ.objIndicator[i])
                }
            }

            if(params.symbolObject.indicator === undefined){
                new_str += '&indicator='
            }else if(list.length == 0){
                new_str += '&indicator='
            }else{
                try{
                    var freqList = []
                    for ( var  i = 0,valid = 0 ; i < CIQ.objIndicator.length;i++) {
                        // when both sentiment and tech exist in CIQ.objIndicator, filter tech indicator
                        let sentiIndicatorRes = CIQ.findSentiIndicator(null,CIQ.objIndicator[i])
                        if(sentiIndicatorRes){
                            freqList.push(sentiIndicatorRes.updated)
                            new_str += `${valid==0?'&indicator=':`&indicator_${valid+1}=`}`+recoverSymbolOptixUrl(CIQ.objIndicator[i]);
                            valid++
                            continue
                        }
                        
                        // 之后加一个symbol判断和小李新senti判断
                        /********************lishan modify start*************************/
                        if(CIQ.isUserIndicator(CIQ.objIndicator[i]) || CIQ.isOwnIndicator(CIQ.objIndicator[i]) || CIQ.findSymbolIndicator(CIQ.objIndicator[i],null)){       
                        /********************lishan modify end*************************/  
                            // ownIndicator根据url的最后一位决定timeframe
                            if(CIQ.isOwnIndicator(CIQ.objIndicator[i])){
                                let timeframeCode = CIQ.objIndicator[i].slice(-1)
                                freqList.push(timeframeCode=='0'?'Daily':timeframeCode=='1'?'Weekly':'Monthly')
                            }
                            new_str += `${valid==0?'&indicator=':`&indicator_${valid+1}=`}`+recoverSymbolOptixUrl(CIQ.objIndicator[i]);
                            valid++
                            continue
                        }
                    }
                    
                    if(freqList.find(item => item=="Weekly"))  orignalFreq= 'weekly';   
                    if(freqList.find(item => item=="Monthly"))  orignalFreq= 'monthly';  
                }catch(err){
                    console.error(err)
                }
            } 
            // orignalFreq is the minimum timeframe, selectedFreq is the timeframe sent to req, default value is orignalFreq
            selectedFreq = orignalFreq
            switch(CIQ.store.state.form.exitFrequency){
                case "Monthly":{
                    selectedFreq = "monthly"
                    break;
                }
                case "Weekly":{
                    if(orignalFreq != 'monthly'){
                        selectedFreq = "weekly"
                    }
                    break;
                }
                case "Daily":{
                    if(orignalFreq != 'monthly' && orignalFreq != 'weekly'){
                        selectedFreq = "daily"
                    } 
                    break;
                }
                default: {
                    break;
                }
            }
            var restoreFreq = CIQ.store.state.form.restoreFreq
            if(restoreFreq != ''){
                selectedFreq = restoreFreq
            }
            /** dual symbol, setRestoreFreq从pairdata 226行转移到了loadChart回调，保证view时addSeires仍持有未被清空的restoreFreq*/ 
            // CIQ.store.commit('form/setRestoreFreq', '')
            
            // setFreq firstly called when loading aapl symbol during chart initiation, the value is daily by default
            CIQ.store.commit('form/setFreqency',selectedFreq)
 
            try{
                switch(selectedFreq){
                    case "monthly":{
                        CIQ.periodicity.timeUnit = 'month'
                        break;
                    }
                    case "weekly":{
                        CIQ.periodicity.timeUnit = 'week'
                        break;
                    }
                    case "daily":{    
                        CIQ.periodicity.timeUnit = 'day'
                        break;
                    }
                    default:
                }
            }catch(err){}
            
            var daily=[],weekly=[],monthly=[]
            var nodeSetup = document.getElementsByTagName('li')

            for(var i =0;i<nodeSetup.length;i++){
                for(var j in nodeSetup[i].firstChild){
                    if(j == 'textContent'){
                        if(nodeSetup[i].firstChild.textContent === 'Daily'){
                            daily.push(nodeSetup[i])
                        }
                        if(nodeSetup[i].firstChild.textContent === 'Weekly'){
                            weekly.push(nodeSetup[i])
                        }
                        if(nodeSetup[i].firstChild.textContent === 'Monthly'){
                            monthly.push(nodeSetup[i])
                        }
                    }
                }		
			}
        
            var node = document.querySelector("cq-menu-container[cq-name = 'menuPeriodicity']")
            for(var i = 0;i < node.children.length;i++){
                node.children[i].style.display = "inherit"
            }

            //console.log("orignalFreq: ",orignalFreq)

            if(orignalFreq == "monthly"){
                for(var i = 0;i < node.children.length;i++){            
                    if(node.children[i].firstChild.nodeValue == '1 D'){
                        node.children[i].setAttribute('tf','disabled')
                    }
                }
                for(var i = 0;i < node.children.length;i++){            
                    if(node.children[i].firstChild.nodeValue == '1 W'){
                        node.children[i].setAttribute('tf','disabled')
                    }
                }
                

                for(var i = 0;i <daily.length;i++){
                    daily[i].setAttribute('tf','disabled')
                }
                for(var i = 0;i <weekly.length;i++){
                    weekly[i].setAttribute('tf','disabled')
                }
            }else if(orignalFreq == "weekly"){
                for(var i = 0;i <node.children.length;i++){
                    if(node.children[i].firstChild.nodeValue == '1 D'){
                        node.children[i].setAttribute('tf','disabled')
                    }
                }

                for(var i = 0;i < node.children.length;i++){            
                    if(node.children[i].firstChild.nodeValue == '1 W'){
                        node.children[i].setAttribute('tf','enabled')
                    }
                }

                for(var i = 0;i <daily.length;i++){
                    daily[i].setAttribute('tf','disabled')
                }

                for(var i = 0;i <weekly.length;i++){
                    weekly[i].setAttribute('tf','enabled')
   
                }
            }else{
                for(var i = 0;i < node.children.length;i++){            
                    if(node.children[i].firstChild.nodeValue == '1 D'){
                        node.children[i].setAttribute('tf','enabled')
  
                    }
                }
                for(var i = 0;i < node.children.length;i++){            
                    if(node.children[i].firstChild.nodeValue == '1 W'){
                        node.children[i].setAttribute('tf','enabled')
 
                    }
                }
    
                for(var i = 0;i <daily.length;i++){
                    daily[i].setAttribute('tf','enabled')
  
                }
                for(var i = 0;i <weekly.length;i++){
                    weekly[i].setAttribute('tf','enabled')

                }
            }
            this.sendReq(start,end,new_str,selectedFreq,cb)
};

quoteFeedSimulator.fetchUpdateData = function (symbol, startDate, params,cb){
    var start = config.timestampToTime(Date.parse(this.initEndDate))

    // if (params.symbolObject.indicator === undefined){
    //     params.symbolObject.indicator = symbol
    // }

    // fetch indicator
    var new_str = ''
    var freq = 'daily'

    let list = []
    for(var i in CIQ.objIndicator){
        if(!CIQ.findBuiltinTechIndicator(null,CIQ.objIndicator[i])){
            list.push(CIQ.objIndicator[i])
        }
    }

    if(params.symbolObject.indicator === undefined){
        //console.log('CIQ.objIndicator is not defined');
        //new_str += '&indicator=' +CIQ.objIndicator;
        new_str += '&indicator='
    }else if(list.length == 0){
        //new_str += '&indicator=' +'AAPL'
        new_str += '&indicator='
    }else{
        try{
            var freqList = []
            for ( var  i = 0,valid = 0 ; i < CIQ.objIndicator.length;i++) {
                // when both sentiment and tech exist in CIQ.objIndicator, filter tech indicator
                let sentiIndicatorRes = CIQ.findSentiIndicator(null,CIQ.objIndicator[i])
                if(sentiIndicatorRes){
                    freqList.push(sentiIndicatorRes.updated)
                    new_str += `${valid==0?'&indicator=':`&indicator_${valid+1}=`}`+CIQ.objIndicator[i];
                    valid++
                    continue
                }
                
                // 之后加一个symbol判断和小李新senti判断
                if(CIQ.isUserIndicator(CIQ.objIndicator[i]) || CIQ.findSymbolIndicator(CIQ.objIndicator[i],null)){       
                    new_str += `${valid==0?'&indicator=':`&indicator_${valid+1}=`}`+CIQ.objIndicator[i];
                    valid++
                    continue
                }
            }
            
            if(freqList.find(item => item=="Weekly"))  freq= 'weekly';   
            if(freqList.find(item => item=="Monthly"))  freq= 'monthly';  
        }catch(err){
            console.error(err)
        }
    }   
    switch(CIQ.store.state.form.exitFrequency){
        case "Monthly":{
            freq = "monthly"
            break;
        }
        case "Weekly":{
            freq = "weekly"
            break;
        }
        case "Daily":{
            freq = "daily"
            break;
        }
        default:
    }

    const {type} = getSymbolInfo(symbol)
    if(!['stock','index'].includes(type)){
        symbol = process.env.VUE_APP_DEFAULT_SYMBOL
    }
    var queryUrl = this.url + 
       "?symbol=" + symbol + 
        new_str +
       "&start="+start + 
       "&freq=" + freq;

   // console.log("update: ",queryUrl);

    this.sendAjax(queryUrl,function(status, response){
        if (status == 200){
            var newQuotes = quoteFeedSimulator.formatChartData(response);
            
            cb({quotes:newQuotes});
        }else{
            cb({error:response ? response:status});
        }    
    });
};

quoteFeedSimulator.fetchPaginationData = function(symbol, suggestedStartDate, endDate, params,cb){
    //console.log("comparation for pag and init: ", config.timestampToTime(Date.parse(suggestedStartDate)), config.timestampToTime(CIQ.initialDate.start))
   
    var start = config.timestampToTime(Date.parse(suggestedStartDate)) 
    var end = config.timestampToTime(Date.parse(endDate)) 
    console.log('Pagination urlstart: '+start + ' end:'+end);

    var new_str = ''
    var freq = 'daily'

    let list = []
    for(var i in CIQ.objIndicator){
        if(!CIQ.findBuiltinTechIndicator(null,CIQ.objIndicator[i])){
            list.push(CIQ.objIndicator[i])
        }
    }

    if(params.symbolObject.indicator === undefined){
        //console.log('CIQ.objIndicator is not defined');
        //new_str += '&indicator=' +CIQ.objIndicator;
        new_str += '&indicator='
    }else if(list.length == 0){
        //new_str += '&indicator=' +'AAPL'
        new_str += '&indicator='
    }else{
        try{
            var freqList = []
            for ( var  i = 0,valid = 0 ; i < CIQ.objIndicator.length;i++) {
                // when both sentiment and tech exist in CIQ.objIndicator, filter tech indicator
                let sentiIndicatorRes = CIQ.findSentiIndicator(null,CIQ.objIndicator[i])
                if(sentiIndicatorRes){
                    freqList.push(sentiIndicatorRes.updated)
                    new_str += `${valid==0?'&indicator=':`&indicator_${valid+1}=`}`+CIQ.objIndicator[i];
                    valid++
                    continue
                }
                
                // 之后加一个symbol判断和小李新senti判断
                if(CIQ.isUserIndicator(CIQ.objIndicator[i]) || CIQ.isOwnIndicator(CIQ.objIndicator[i]) || CIQ.findSymbolIndicator(CIQ.objIndicator[i],null)){       
                    new_str += `${valid==0?'&indicator=':`&indicator_${valid+1}=`}`+CIQ.objIndicator[i];
                    valid++
                    continue
                }
            }
            
            if(freqList.find(item => item=="Weekly"))  freq= 'weekly';   
            if(freqList.find(item => item=="Monthly"))  freq= 'monthly';  
        }catch(err){
            console.error(err)
        }
    }   
    switch(CIQ.store.state.form.exitFrequency){
        case "Monthly":{
            freq = "monthly"
            break;
        }
        case "Weekly":{
            freq = "weekly"
            break;
        }
        case "Daily":{
            freq = "daily"
            break;
        }
        default:
    }   

    const {type} = getSymbolInfo(symbol)
    if(!['stock','index'].includes(type)){
        symbol = process.env.VUE_APP_DEFAULT_SYMBOL
    }
    var queryUrl = this.url + 
       "?symbol=" + symbol + 
        new_str +
       "&start="+start+
       "&end=" + end + 
       "&freq=" + freq;
    //console.log("pagination: ",queryUrl);

    this.sendAjax(queryUrl,async function(status,response){
        if(status == 200){
            var newQuotes = await quoteFeedSimulator.formatChartData(response);
           // console.log(suggestedStartDate,suggestedStartDate.getTime(),parseInt(process.env.VUE_APP_START_DATE),suggestedStartDate.getTime() > parseInt(process.env.VUE_APP_START_DATE))
            cb({
                moreAvailable: (response.length > 1) && suggestedStartDate.getTime() > parseInt(process.env.VUE_APP_START_DATE),
                quotes: newQuotes, 
                upToDate: endDate.getTime() >=  Date.now()
            });     
            
        }else{
            cb({error: response ? response :status})
        }
    })

}

// filter markerSet by given start date and end date during backtest setup
quoteFeedSimulator.filterMarkerDate = function(start_date,end_date,markerSet){
    let list = []
    let _date = {
        start: jutils.formatDate(start_date,"YYYYMMDD"),
        end: jutils.formatDate(end_date,"YYYYMMDD")
    }
    for(var date in markerSet){
        let markerSetDate = markerSet[date].DT.slice(0,4)+markerSet[date].DT.slice(5,7)+markerSet[date].DT.slice(8,10)
        if(markerSetDate>_date.start && markerSetDate<=_date.end){
            list.push(markerSet[date])
        }
    }
    //console.log(_date,list)
    return list
}

quoteFeedSimulator.formatChartData = async function(response){
    var data = response
    if(data == null){
        data = []
    }
    
    var newQuotes = [];
    var oneDay = (24 *60 *60 *1000) * 0

    let objIndicatorFirstDate = {};
    if(CIQ.objIndicator && typeof CIQ.objIndicator !== 'string'){
        CIQ.objIndicator.forEach((item) => {
            if(CIQ.findSentiIndicator(null,item)) objIndicatorFirstDate[item] = null;
        });
    }

    try{
        const {type} = getSymbolInfo(CIQ.symbol)
        if(type == 'custom'){
            // 可能是custom symbol
                const url = decodeBase64(CIQ.symbol.split('||')[1])
                let res
                try {
                    res = await CIQ.store.dispatch('chart/get_mysymbolCSV',{url:url,timeframe:CIQ.store.state.form.pairDataFreq})
                } catch (err) {console.error(err)}
                let sortedRows = res.sort(
                    (a, b) => new Date(a.DT) - new Date(b.DT)
                );
                //console.time('🚗Execution Time');
                // 将 data 数组转化为以日期为键的字典
                const dataDict = {};
                data.forEach(item => {
                    dataDict[item.DT] = item;
                });
                for (const i in sortedRows) {
                    newQuotes[i] = {};
                    newQuotes[i].DT = sortedRows[i].DT
                    newQuotes[i].Open = Number(sortedRows[i].Open);
                    newQuotes[i].High = Number(sortedRows[i].High);
                    newQuotes[i].Low = Number(sortedRows[i].Low);
                    newQuotes[i].Close = Number(sortedRows[i].Close);
                    newQuotes[i].Volume = Number(sortedRows[i].Volume);

                    // 默认加载 ‘aapl’，它没有indicator，跳过
                    if(CIQ.objIndicator && typeof CIQ.objIndicator == 'string') continue
                    for(var j in CIQ.objIndicator){
                        var str = j==0?'indicator_Close':`indicator${Number(j)+1}_Close`; 
                        //let matchedItem = data.find(item=>item.DT == sortedRows[i].DT)
                        let matchedItem = dataDict[sortedRows[i].DT]
                        newQuotes[i][CIQ.objIndicator[j]] = matchedItem[str];
                        // 如果为空则判断是否为第一个，是则设为0，不是则设值为前一个
                        if(matchedItem){
                            if(objIndicatorFirstDate[CIQ.objIndicator[j]] == null) objIndicatorFirstDate[CIQ.objIndicator[j]] = newQuotes[i].DT
                            newQuotes[i][CIQ.objIndicator[j]] = matchedItem[str];
                        }else{
                            if(i==0){
                                newQuotes[i][CIQ.objIndicator[j]] = null;
                            }else{
                                //console.log('indicator值出现空值',data[i])
                                newQuotes[i][CIQ.objIndicator[j]] = newQuotes[i-1][CIQ.objIndicator[j]]
                            }
                        }
                    } 
                }
                //console.timeEnd('🚗Execution Time');
        }else{
            if('High' in data[0]){
            
                for (var i = 0; i < data.length; i++) {
                    newQuotes[i] = {};
                    
                    var datatime = new Date(data[i].DT)
                    
                    var offset = datatime.getTimezoneOffset() * 60 * 1000
                    
                    newQuotes[i].DT = new Date(datatime.setTime(datatime.getTime() + offset));
                    
                    newQuotes[i].Open = data[i].Open;
                    newQuotes[i].High = data[i].High;
                    newQuotes[i].Low = data[i].Low;
                    newQuotes[i].Close = data[i].Close;
                    newQuotes[i].Volume = data[i].Volume;
                    
                    // 默认加载 ‘aapl’，它没有indicator，跳过
                    if(CIQ.objIndicator && typeof CIQ.objIndicator == 'string') continue
                    for(var j in CIQ.objIndicator){
                        var str = j==0?'indicator_Close':`indicator${Number(j)+1}_Close`; 
    
                        newQuotes[i][CIQ.objIndicator[j]] = data[i][str];
                        // 如果为空则判断是否为第一个，是则设为0，不是则设值为前一个
                        if(data[i][str] != null){
                            if(objIndicatorFirstDate[CIQ.objIndicator[j]] == null) objIndicatorFirstDate[CIQ.objIndicator[j]] = newQuotes[i].DT
                            newQuotes[i][CIQ.objIndicator[j]] = data[i][str];
                        }else{
                            if(i==0){
                                newQuotes[i][CIQ.objIndicator[j]] = null;
                            }else{
                                //console.log('indicator值出现空值',data[i])
                                newQuotes[i][CIQ.objIndicator[j]] = newQuotes[i-1][CIQ.objIndicator[j]]
                            }
                        }
                    }
                } 
                
                var node = document.querySelector("cq-menu-container[cq-name = 'menuChartStyle']")
                for(var i = 0;i < node.children.length;i++){
                    node.children[i].style.display = "inherit"
                }
            }else{
                for (var i = 0; i < data.length; i++) {
                    newQuotes[i] = {};
    
                    var datatime = new Date(data[i].DT)
    
                    var offset = datatime.getTimezoneOffset() * 60 * 1000
                    
                    newQuotes[i].DT = new Date(datatime.setTime(datatime.getTime() + offset));
        
                    newQuotes[i].Open = data[i].Close;
                    newQuotes[i].High = data[i].Close;
                    newQuotes[i].Low = data[i].Close;
                    newQuotes[i].Close = data[i].Close;
                    
                    if(data[i].Volume){
                        newQuotes[i].Volume = data[i].Volume
                    }
    
                    // 默认加载 ‘aapl’，它没有indicator，跳过
                    if(CIQ.objIndicator && typeof CIQ.objIndicator == 'string') continue
                    for(var j in CIQ.objIndicator){
                        var str = j==0?'indicator_Close':`indicator${Number(j)+1}_Close`; 
                        
                        // 如果为空则判断是否为第一个，是则设为0，不是则设值为前一个
                        if(data[i][str] != null){
                            if(objIndicatorFirstDate[CIQ.objIndicator[j]] == null) objIndicatorFirstDate[CIQ.objIndicator[j]] = newQuotes[i].DT
                            newQuotes[i][CIQ.objIndicator[j]] = data[i][str];      
                        }else{
                            if(i==0){
                                newQuotes[i][CIQ.objIndicator[j]] = null;
                            }else{
                                newQuotes[i][CIQ.objIndicator[j]] = newQuotes[i-1][CIQ.objIndicator[j]]
                            }
                        }
                    }
                }
                CIQ.stxx.setChartType("line"); 
                var node = document.querySelector("cq-menu-container[cq-name = 'menuChartStyle']")
                for(var i = 0;i < node.children.length;i++){
                    node.children[i].style.display = "inherit"
                }
                for(var i = 0;i < node.children.length;i++){
                    if(node.children[i].firstChild.nodeValue != "Line"){
                        node.children[i].style.display = "none"
                    }
                } 
            }
        }

    }catch(err){}

    if(CIQ.objIndicator && typeof CIQ.objIndicator !== 'string'){
        /********************lishan modify start*************************/
        for (const j in CIQ.objIndicator) {
            const indicator = CIQ.objIndicator[j];
        
            // 进行 symbol 和 senti 判断，如果需要的话
            // if (indicator.includes('symbol')) {
            //     // 进行相应操作
            // }
            // if (indicator.includes('senti')) {
            //     // 进行相应操作
            // }
        
            if (CIQ.isUserIndicator(indicator)) {
                const [name, hash] = indicator.split(/HASH/);
                const res = await config.csvFileRead(name, hash);
                const datafeed = res.data.data.csv_content;
        
                const sortedRows = datafeed.sort(
                    (a, b) => new Date(a.DT) - new Date(b.DT)
                );
        
                for (const i in sortedRows) {
                    const index = data.findIndex(item => item.DT == sortedRows[i].DT);
                    if (index == -1) {
                        continue;
                    }
                    if (objIndicatorFirstDate[indicator] == null) {
                        objIndicatorFirstDate[indicator] = newQuotes[index].DT;
                    }
                    newQuotes[index][indicator] = parseFloat(sortedRows[i]['indicator_Close']);
                }
            }
            if (CIQ.isOwnIndicator(indicator)) {
                const [_, url] = indicator.split(/CREATE/);
                let datafeed = JSON.parse(localStorage.getItem(`previewIndicatorData_${url}`))
                if(!datafeed){
                    
                    const res = await config.getMyIndicatorData(url);
                    if(res.data.code == 404) {
                        _this.popUpMsgBox('this backtesting utilizes an user customized indicator that is deleted, this page will be refresh in 2 seconds')
                        setTimeout(() => {
                            window.location.reload();
                            }, 2000); // 2000毫秒 = 3秒
                    }
                    datafeed = res.data.data;
                    // 暂存
                    localStorage.setItem(`previewIndicatorData_${url}`, JSON.stringify(datafeed))
                }               
        
                let sortedRows = datafeed.sort(
                    (a, b) => new Date(a.DT) - new Date(b.DT)
                );
                const appendStr = data[data.length-1].DT.indexOf('000Z') == -1 ? '.000' : '.000Z'
                sortedRows = sortedRows.map(item => ({ ...item, indicator_Close: item.close, DT: item.DT + appendStr }));
                
                for (const i in sortedRows) {
                    const index = data.findIndex(item => item.DT == sortedRows[i].DT);
                    if (index == -1) {
                        continue;
                    }
                    if (objIndicatorFirstDate[indicator] == null) {
                        objIndicatorFirstDate[indicator] = newQuotes[index].DT;
                    }
                
                    newQuotes[index][indicator] = parseFloat(sortedRows[i]['indicator_Close']);
                }
                
            }
        }
        /********************lishan modify end*************************/
        // 停用数据截断，因为technical indicator不能被截断
        // const earliestIndicator = findEarliestIndicator(objIndicatorFirstDate)
        // newQuotes = earliestIndicator=='Invalid Date'?newQuotes:newQuotes.slice(newQuotes.findIndex(item=>item.DT - earliestIndicator == 0))
    }
    
    
    return newQuotes
}

function findEarliestIndicator(data) {
    const dates = Object.values(data)
    const earliestDate = new Date(Math.min(...dates));
    return earliestDate;
}
  


export default quoteFeedSimulator;
