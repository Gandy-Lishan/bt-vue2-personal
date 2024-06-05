import { CIQ } from '@/components/common/chart/st-development/js'
import { getCookieData } from "@/utils/cryptoUtils/cookie";

// 字符串首字母大写
const capitalizeFirstLetter = str => {
	return str.charAt(0).toUpperCase() + str.slice(1)
}
const compareArrays = (userDate, pairDate) => {
  const uniqueDates = []
  userDate.forEach(date => {
    const isInPairArr = pairDate.includes(date)
    if (!isInPairArr) {
      uniqueDates.push(date)
    }
  })
  return uniqueDates.length === 0 ? true : uniqueDates
}

/* format date */
const timestampToTime = (timestamp) => {
  var date = new Date(timestamp )// *1000 is required for a timestamp of 10 bits, and 1000 is not required for a timestamp of 13 bits
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-'
  var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())
  var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':'
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':'
  var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds()
  return Y+M+D
}
const trimTrailingZeros = (val) => {
  // 如果commission是0，则直接返回"0"
  if (parseFloat(val) == 0) {
      return "0";
  }
  // 否则进行格式化，先转换为字符串，然后使用正则表达式去除多余的零
  return val.replace(/\.?0+$/, ''); // 使用正则表达式去除多余的零
}

// 后续把datatime.getTimezoneOffset() * 60 * 1000都封装在formatStandardTime
const formatStandardTime = (date) => {
  var datatime = new Date(date)
  var offset = datatime.getTimezoneOffset() * 60 * 1000
  return new Date(
    datatime.setTime(datatime.getTime() + offset)
  )
}

const getQueryVariable = (variable) => {
  //获取当前URL中的查询字符串部分（即问号后面的部分）
  var query = window.location.search.substring(1)
  //把查询字符串按照&符号分割成数组
  var vars = query.split("&")
  //遍历数组中的每个元素
  for (var i = 0; i < vars.length; i++) {
    //把当前元素按照=符号分割成键和值
    var pair = vars[i].split("=")
    //如果当前元素的键等于参数名，则返回对应的值
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  //如果没有找到匹配的参数名，则返回false
  return false
}

/* Used to determine whether the data is JSON */
const isJson = function(str){
	if (typeof str == 'string') {
			try {
					var obj=JSON.parse(str)
					if(typeof obj == 'object' && obj ){
							return true
					}else{
							return false
					}
			} catch(e) {
					return false
			}
	}
}

/* Find items with the same array */
const searchKeys = (data) => {
  let sameArr = []
  let list = []

  for (let i = 0; i < data.length; i++) {
    const commentDes = data[i].commentDes

    if (!list.includes(commentDes)) {
      let haveSame = false
      let _index = i.toString()

      for (let j = i + 1; j < data.length; j++) {
        if (data[j].commentDes === commentDes) {
          _index += ',' + j
          haveSame = true
        }
      }

      if (haveSame) {
        list.push(commentDes)
        sameArr.push(_index)
      }
    }
  }

  return sameArr
}
const Toast = (msg,duration) => {  
  duration=isNaN(duration)?3000:duration  
  var m = document.createElement('div')  
  m.innerHTML = msg  
  m.style.cssText="font-size: 1rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 50%;left: 50%;width: 130px;text-align: center;"
  document.body.appendChild(m)  
  setTimeout(function() {  
      var d = 0.5
      m.style.opacity = '0'  
      setTimeout(function() { document.body.removeChild(m) }, d * 1000)  
  }, duration)  
}

const LocalStorageUtil = {
  // 存储数据
  set(key, value) {
    try {
      if (value === null) {
        localStorage.setItem(key, value)
      } else if (typeof value === 'boolean') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
      return true
    } catch (error) {
      console.error('LocalStorage存储失败:', error)
      return false
    }
  },
  // 读取数据
  get(key) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('LocalStorage读取失败:', error)
      return null
    }
  },
  // 删除数据
  remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('LocalStorage删除失败:', error)
      return false
    }
  }
}

// // 示例用法：
// // 存储数据
// LocalStorageUtil.set('myKey', { name: 'John', age: 30 });

// // 读取数据
// const data = LocalStorageUtil.get('myKey');
// if (data) {
//   console.log('读取到数据:', data);
// } else {
//   console.log('未找到数据');
// }

// // 删除数据
// const removed = LocalStorageUtil.remove('myKey');
// if (removed) {
//   console.log('成功删除数据');
// } else {
//   console.log('删除数据失败');
// }

// 用于判断对象中是否存在空属性,只要存在空属性直接返回 false
const checkProperties = (obj, properties) => {
  for (let i = 0; i < properties.length; i++) {
    if (obj[properties[i]] === null || obj[properties[i]] === undefined || obj[properties[i]] === '') {
      return false; // 如果属性为空，直接返回 false
    }
  }
  return true; // 如果所有属性都不为空，返回 true
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

const timeframeTransform = (val) => {
  let freq = 'Daily'
  switch(val){
      case "monthly":{
          freq = "Monthly"
          break;
      }
      case "weekly":{
          freq = "Weekly"
          break;
      }
      case "daily":{
          freq = "Daily"
          break;
      }
      default:
  }  
  return freq
}

const getTokenRole = () => {
  const access_level = getCookieData()?.access_level
  if(Array.isArray(access_level)) {
    // 0 无权限; 1 部分权限, 无 scannerai; 2 全部权限
    if(access_level.some(str => str.includes('everything')) || access_level.some(str => str.includes('premium'))) return 2;
    if(access_level.some(str => str.includes('research'))) return 1;
    if(access_level.some(str => str.includes('reports'))) return 0;
    if(access_level.includes('backtestedge') && access_level.includes('aiscanneredge')) return 2;
    if(access_level.includes('backtestedge') && !access_level.includes('aiscanneredge')) return 1;
    if(!access_level.includes('backtestedge') && !access_level.includes('aiscanneredge')) return 0;
    if(access_level.some(str => str.includes('portfolioedge'))) return 1;
  }
  return 'None'
}

/**
 * dual symbol中依据study.parameters里的criteria判断计算数据源是第几个symbol并获取symbol的对应field数据
 * @param {*} obj dataSet一行数据
 * @param {*} field symbol2 name
 * @param {*} subField symbol2 name存在时使用的field
 * @returns 
 */
const getPropertyByString = (obj, field, subField) => {
  // if(symbol2){
  //     return obj[symbol2]?obj[symbol2][field]:null
  // }else{
  //     return obj[field]
  // }

  if(!field) field = subField // 当field是流动时，比如accum里原值为quote.Low, 则：getPropertyByString(quote,field,'Low')， filed可能不存在或者为symbol2
  var val = obj[field];   
  if (val && typeof val == "object") val = val[subField];
  return val
}

const recoverSymbolOptixUrl = (url) => {
  if(url && url.endsWith('@indicator')){
      var i = url.indexOf('@indicator')
      return url.slice(0,i)
  }else return url
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

const printConsole = (content) => {
  let print = console
  if(print && print.log){
    return print.log(content)
  }
}

export {capitalizeFirstLetter, compareArrays, timestampToTime, formatStandardTime, getQueryVariable, isJson, searchKeys, Toast, LocalStorageUtil, checkProperties, maxNumOfStudy, timeframeTransform, getTokenRole, trimTrailingZeros, getPropertyByString, recoverSymbolOptixUrl, createStateFilter, printConsole}