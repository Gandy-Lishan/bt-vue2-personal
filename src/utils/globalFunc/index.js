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
          return {name: decodeBase64(url.split('||')[0]), symbol: decodeBase64(url.split('||')[1]), url: url, type:'custom'}
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

  const createStateFilter2 = (queryString) => {
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

  const createStateFilter = (queryString) => {
    return (state) => {
      const query = queryString.toLowerCase();
      const resultValue = state.value || state.name || state.label || state.model_name;
      const resultUrl = state.url || state.symbol;

      // 如果字段为空，返回 0
      if (!resultValue || !resultUrl) {
        return 0;
      }
  
      // 如果keyword为空, 全部一致
      if (!queryString) {
        return 2;
      }

      // 标准化函数：替换空格、下划线等符号，使其统一
      const standardizeString = (str) => {
        return str
          .toLowerCase()            // 转为小写
          .replace(/[_\s-]+/g, ' '); // 替换下划线、空格、破折号为统一的空格
      };
      // 标准化查询词和目标字段
      const standardizedQuery = standardizeString(query);
      const standardizedValue = standardizeString(resultValue);
      const standardizedUrl = standardizeString(resultUrl);
  
      // 正则匹配：将查询字符串转为正则，允许字符间有任意字符
      const fuzzyMatch = (text, query) => {
        const regex = new RegExp(query.split('').join('.*?'), 'g'); // 模糊匹配
        return [...text.matchAll(regex)];
      };
  
      // 模糊匹配分数
      let score = 0;
      
      // 对标准化后的 value 和 url 使用模糊匹配
      const valueMatches = fuzzyMatch(standardizedValue, standardizedQuery);
      const urlMatches = fuzzyMatch(standardizedUrl, standardizedQuery);
  
      // 每个匹配增加分数
      score += valueMatches.length * 2;  // 每个匹配加 2 分
      score += urlMatches.length * 2;    // 每个匹配加 2 分
  
      // 根据 query 的部分匹配，调整匹配项的相关性
      // const adjustForContextualMatch = (text, query) => {
      //   // 如果 query 是 text 的前缀，则相关性高
      //   if (text.startsWith(query)) {
      //     return 3;  // 前缀匹配，分数高
      //   }
        
      //   // 如果 query 是 text 的一部分且出现在较早的位置，给予更高分
      //   const indexOfQuery = text.indexOf(query);
      //   if (indexOfQuery !== -1 && indexOfQuery < Math.floor(text.length / 2)) {
      //     return 2;  // 中间匹配，较高分
      //   }
        
      //   // 如果 query 是 text 的后缀或者出现在文本后半部分，分数低
      //   if (text.endsWith(query) || indexOfQuery >= Math.floor(text.length / 2)) {
      //     return 1;  // 后缀匹配，分数低
      //   }

      //   return 0;  // 没有匹配
      // };

      // // 调整 value 和 url 的分数
      // score += adjustForContextualMatch(value, query);
      // score += adjustForContextualMatch(url, query);

      // 如果有匹配，返回分数
      return score;
    };
  };
  
  
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

  // 兼容被改过key的股票列表
  // TODO 兼容更多改过key的股票列表的情况
  const transformChangedKey = (res,source) => {
      const changedNameMap = {'crude':'Crude','bitcoin':'Bitcoin'}
      switch(source){
        case 'get_cpm_bts':
          res.data.results = res.data.results.map(item=>{
            let changedKey = changedNameMap[item.symbol]
            return changedKey?{...item, symbol:changedKey}:item
          })
          break;
        case 'run_cpm_bt':
          let changedKey = changedNameMap[res.data.data.symbol]
          if(changedKey) res.data.data.symbol = changedKey 
          break
        default:
      }
  }
  export {maxNumOfStudy,getPropertyByString, recoverSymbolOptixUrl, createStateFilter, getSymbolInfo, getCoresSymbolDual, transformChangedKey}