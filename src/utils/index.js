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
  let returnValue = new Date(datatime.getTime()+offset)
  // if(returnValue.getDate() !== datatime.getDate()){
  //   const newOffset = offset + 60*60*1000
  //   returnValue = new Date(datatime.getTime()+newOffset)
  // }
  return returnValue
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
      return decodeURIComponent(pair[1])
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
  m.style.cssText="font-size: 1rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 50%;left: 50%;width: 130px;text-align: center;z-index: 999;"
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

const printConsole = (...content) => {
  let print = console
  if(print && print.log){
    return print.log(...content)
  }
}

const encodeBase64 = (str) => {
  return btoa(encodeURIComponent(str));
}

const decodeBase64 = (str) => {
  return decodeURIComponent(atob(str));
}

// 用于格式化数字 num 为传入的数字, fixedNum 表示需要保存到几位小数点
const unifyNumber = (num, fixedNum) => {
  if (num === '' || num === null || num === 'null') {
    return ''
  } else {
    let handleNum = parseFloat(num)
    let isToFixed = handleNum.toString().includes('.') && handleNum.toString().split('.')[1].length > fixedNum
    if (isToFixed) {
      return isNaN(handleNum.toFixed(fixedNum)) ? NaN : handleNum.toFixed(fixedNum)
    } else {
      return isNaN(handleNum) ? NaN : handleNum
    }
  }
}

const isObject = (val) => {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

const formatNumber = (value, type, sign) => {
  if (value === null || isNaN(value)) return '-';

  const absValue = Math.abs(value);
  let formatted;

  if (absValue >= 1e12) {
    formatted = `${(absValue / 1e12).toFixed(2)}T`;
  } else if (absValue >= 1e9) {
    formatted = `${(absValue / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    formatted = `${(absValue / 1e6).toFixed(2)}M`;
  } else if (absValue >= 1e3) {
    formatted = `${(absValue / 1e3).toFixed(2)}K`;
  } else {
    formatted = absValue.toFixed(2);
  }

  if (type === 'percent') {
    return `${(parseFloat(formatted) * 100).toFixed(2)}%`;
  } else if (type === 'avg') {
    return `${value === 0 ? '' : (value > 0 ? '+' : '-')}${formatted}%`;
  } else if (type === 'dollar') {
    return `${value < 0 ? '-' : ''}$${formatted}`;
  } else if (type === 'customSign') {
    return `${formatted}${sign}`;
  }

  return `${value === 0 ? '' : (value > 0 ? '' : '-')}${formatted}`;
}

export {capitalizeFirstLetter, compareArrays, timestampToTime, formatStandardTime, getQueryVariable, isJson, searchKeys, Toast, LocalStorageUtil, checkProperties, timeframeTransform, getTokenRole, trimTrailingZeros, printConsole,encodeBase64,decodeBase64, unifyNumber, isObject, formatNumber}