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


export {capitalizeFirstLetter, compareArrays, timestampToTime, getQueryVariable, isJson, searchKeys, Toast, LocalStorageUtil, checkProperties}