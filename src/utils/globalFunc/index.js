import { CIQ } from '@/components/common/chart/st-development/js'
import { decodeBase64 } from '..'
// global functions(not like mixin, it can be used for .js)
const getSymbolInfo = (url) => {
    //console.time('🚗Execution Time');
    let stockName = CIQ.store.getters.getStockList.find(x=>x.stock==url)
    let indexName = CIQ.store.getters.getIndexList.find(x=>x.symbol==url)
    //console.timeEnd('🚗Execution Time');
    if (stockName) {
        return {name: stockName?.name, url: url, type:'stock'}
    } else if (indexName) {
        return {name: indexName?.name, url: url, type:'index'}
    } else {
        // 第三种情况：既不是 stockName 也不是 indexName，可能是custom symbol
        try {
          return {name: decodeBase64(url.split('||')[0]), url: url, type:'custom'}
        } catch (error) {
          return {name: '', url: url, type:'other'}
        }  
    }
  }
  
// 判断symbol所属是symbol1还是2，会处理custom symbol的特殊显示名
const getCoresSymbolDual = (isSymbol2) => {
  let symbolLabel = isSymbol2?CIQ.store.getters.getComparisonSymbol.url:CIQ.stxx.chart.symbol
  const {name,type} = getSymbolInfo(symbolLabel)
  if(type == 'custom'){
    symbolLabel = name
  }
  return symbolLabel
}

  const createStateFilter = (queryString) => {
    return (state) => {
      const query = queryString.toLowerCase();
      const resultValue = state.value || state.name || state.label || state.model_name;
      const resultUrl = state.url || state.symbol
      const value = resultValue.toLowerCase()
      const url = resultUrl.toLowerCase();
  
      // 完全匹配
      if (value === query || url === query) {
        return 3; // 最高优先级
      }
      // 前缀匹配
      if (value.startsWith(query) || url.startsWith(query)) {
        return 2; // 次高优先级
      }
      // 中间匹配
      if (value.includes(query) || url.includes(query)) {
        return 1; // 最低优先级
      }
      return 0; // 不匹配
    };
  }
  
  const recoverSymbolOptixUrl = (url) => {
    if(url && url.endsWith('@indicator')){
        var i = url.indexOf('@indicator')
        return url.slice(0,i)
    }else return url
  }
  
  /**
   * dual symbol中依据study.parameters里的criteria判断计算数据源是第几个symbol并获取symbol的对应field数据
   * @param {*} obj dataSet一行数据
   * @param {*} field symbol2 name
   * @param {*} subField symbol2 name存在时使用的field
   * @returns 
   */
  const getPropertyByString = (obj, field, subField) => {
    if(!field) field = subField // 当field是流动时，比如accum里原值为quote.Low, 则：getPropertyByString(quote,field,'Low')， filed可能不存在或者为symbol2
    var val = obj[field];   
    if (val && typeof val == "object") val = val[subField];
    return val
  }
  
  // 限制同屏显示个数
  const maxNumOfStudy = (stx) => {
    var countExistIndicator = 0
    let studies = stx?stx.layout.studies:CIQ.stxx.layout.studies
    for (var studyInstanceName in studies) {
      if (CIQ.findBuiltinTechIndicator(null,studies[studyInstanceName].type)){
        countExistIndicator--
      }
      if (studies[studyInstanceName].type == 'ST MA') {
        countExistIndicator--
      }
      countExistIndicator++
    }
    if (countExistIndicator >= 20) {
      CIQ.description('Maximum 20 signals can be displayed on chart')
      CIQ.hideCover()
      CIQ.nprogress.done()
      return true
    }else{
      return false
    }
  }

  export {maxNumOfStudy,getPropertyByString, recoverSymbolOptixUrl, createStateFilter, getSymbolInfo, getCoresSymbolDual}