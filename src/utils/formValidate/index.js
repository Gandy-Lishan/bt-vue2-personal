/*
   封装一个通用表单验证规则
   用于限制最多保存两位小数并且数值大小有限制 
   capital commission slippage 可公用
   createLimitedDecimalValueRule 简写至 createLDVRule
  */
export const createLDVRule = (minVal, maxVal, errorMsgEmpty, errorMsgGreater) => {
	return (_, value, callback) => {
		const pattern = /^\d+(\.\d{1,2})?$/
		if (value === '') {
			callback(new Error(`Please input ${errorMsgEmpty}`))
		}
		if (!pattern.test(value) && value !== 0) {
			callback(
				new Error(
					`Enter a positive number ${errorMsgGreater}, with up to two decimals`
				)
			)
		}
		if (minVal !== undefined && value < minVal) {
			callback(
				new Error(`Enter a positive number ${errorMsgGreater}, with up to two decimals`)
			)
		}
		if (maxVal !== undefined && value > maxVal) {
			callback(
				new Error(`Enter a positive number ${errorMsgGreater}, with up to two decimals`)
			)
		}
		callback()
	}
}
export const createPositiveIntegerRule = (errorMsgEmpty, minVal, maxVal) => {
	return (_, value, callback) => {
		if(value === '') {
			callback(new Error(`Enter ${errorMsgEmpty}`))
		}
		const pattern = /^\d+$/
		const isPositiveInteger = isNaN(value) || value <= 0 || !pattern.test(value)
		if (isPositiveInteger) {
			callback(new Error(`Enter positive integers only`))
		}
		if((maxVal && (minVal !== undefined || minVal !== null)) && (value > maxVal || value < minVal)) {callback(new Error(`Value should be between ${minVal} and ${maxVal}`))}
		if((minVal && (maxVal !== undefined || maxVal !== null)) && value <= minVal) {callback(new Error(`Only positive integers > ${minVal} allowed`))}
		if((maxVal && (minVal !== undefined || minVal !== null)) && value > maxVal) {callback(new Error(`Only positive integers < ${maxVal} allowed`))}
		callback()
	}
}
export const createIntegerRule = (errorMsgEmpty, minVal, maxVal) => {
	return (_, value, callback) => {
		if(value === '') {
			callback(new Error(`Enter ${errorMsgEmpty}`))
		}
		const pattern = /^-?\d+$/
		const isInteger = isNaN(value) || !pattern.test(value)
		if (isInteger) {
			callback(new Error(`Enter integers only`))
		}
		if((maxVal && (minVal !== undefined && minVal !== null)) && (Number(value) > Number(maxVal) || Number(value) < Number(minVal))) {
			callback(new Error(`Value should be between ${minVal} and ${maxVal}`))
		}
		if((minVal && (maxVal !== undefined && maxVal !== null)) && Number(value) < Number(minVal)) {
			callback(new Error(`Only positive integers > ${minVal} allowed`))
		}
		if((maxVal && (minVal === undefined || minVal === null)) && Number(value) > Number(maxVal)) {
			callback(new Error(`Only positive integers < ${maxVal} allowed`))
		}
		callback()
	}
}

export const createPositiveScopeIntegerRule = (errorMsgEmpty, minVal, maxVal) => {
	return (_, value, callback) => {
		if(value === '') {
			callback(new Error(`Enter ${errorMsgEmpty}`))
		}
		const pattern = /^\d+$/
		const isLessThanMin = Number(value) < Number(minVal)
		if (isLessThanMin) callback(new Error(`Only positive integers > ${minVal} allowed`))
		const isPositiveInteger = isNaN(value) || Number(value) <= 0 || !pattern.test(value)
		if (isPositiveInteger) {
			callback(new Error(`Enter positive integers only`))
		}
		if((maxVal && (minVal !== undefined || minVal !== null)) && (Number(value) > Number(maxVal) || Number(value) < Number(minVal))) {callback(new Error(`Value should be between ${minVal} and ${maxVal}`))}
		callback()
	}
}

export const createVerifyValueInListRule = (list, errorMsgEmpty, errorMsg) => {
	return (_, value, callback) => {
		if(!value) callback(new Error(errorMsgEmpty))
		if(!list || !list.length) callback()
		const inAllowedList = (list.find(ele => ele.url.toLocaleLowerCase() === value.toLocaleLowerCase()))?.label || false
		if(!inAllowedList) callback(new Error(errorMsg))
		callback()
	}
}
export const createTPSLValidateRule = (minVal) => {
	return (_, value, callback) => {
		// 给 Stop Loss 和 Take Profit 用
		const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
		const isLessThanMin = value <= minVal
		const isMatched = !pattern.test(value)
		if (isLessThanMin) callback(new Error('Only positive numbers are allowed'))
		if (isMatched) callback(new Error('Numeric input with two decimal places'))
		callback()
	}
}
export const createTPSLScopeValidateRule = (minVal, maxVal, canBeEqual) => {
	return (_, value, callback) => {
		// 给 Stop Loss 和 Take Profit 用
		const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
		let isLessThanMin = Number(value) <= Number(minVal)
		if(canBeEqual) isLessThanMin = Number(value) < Number(minVal)
		const isMatched = !pattern.test(value)
		if (isLessThanMin) callback(new Error(`Only positive numbers > ${minVal} allowed`))
		if (isMatched) callback(new Error('Numeric input with two decimal places'))
		if((maxVal && (minVal !== undefined || minVal !== null)) && (Number(value) > Number(maxVal) || Number(value) < Number(minVal))) {callback(new Error(`Value should be between ${minVal} and ${maxVal}`))}
		callback()
	}
}
export const createTPSLValidate = (minVal, value) => {
	// 给 Stop Loss 和 Take Profit 用
	const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
	const isLessThanMin = value <= minVal
	const isMatched = !pattern.test(value)
	if (isLessThanMin) {
		return `Only positive numbers are allowed`
	}
	if (isMatched) {
		return `Numeric input with two decimal places.`
	}
	return ''
}
export const createEOEPValidate = (value) => {
	// 只验证小数点后两位
	const pattern = /^-?(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/;
	const isMatched = !pattern.test(value) && value != 0
	if (isMatched) {
		return `Numeric input with two decimal places.`
	}
	return ''
}
export const createPositiveIntegerValidate = (value, minVal) => {
	// 给 Time In Market 和 exclude 用
	const pattern = /^\d+$/
	const isPositiveInteger = isNaN(value) || value <= minVal || !pattern.test(value)
	if (isPositiveInteger && minVal === 0) {
		return `Enter positive integers only.`
	}
	if (isPositiveInteger && minVal !== 0) {
		return `Only positive numbers > ${minVal} allowed`
	}
	return ''
}
// 用于分析师 URL 验证
export const validateURLRule = (_, value, callback) => {
	const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
	// if (value === '') {
	// 	callback(new Error('Please enter the url of the analyst report'))
	// }
	if (!pattern.test(value) && value != '') {
		callback(new Error('Url address format error'))
	}
	callback()
}

export const validatePercentageRule = (_, value, callback) => {
	if (value === '') {
	  return 'Enter a number';
	}
	const numericValue = parseFloat(value);
	if (isNaN(numericValue)) {
	  return 'Enter a valid number';
	}
  
	// uncomment it to allow float value
  //   if (numericValue < 0) {
  //     return 'Enter a non-negative value';
  //   }
  // const pattern = /^\d+$/
		const pattern = /^[+-]?\d+$/
  const isPositiveInteger = isNaN(value) || !pattern.test(value)
  if (isPositiveInteger) {
	  return `Enter integers only`;
  }
	// Uncomment the following block to restrict values to <= 100
	// if (numericValue > 100) {
	//   return 'Enter a value <= 100';
	// }
  
	// uncomment it to allow float value
  //   const decimalPlaces = (numericValue.toString().split('.')[1] || '').length;
  //   if (decimalPlaces > 2) {
  //     return 'Limit to two decimal places';
  //   }
	return '';
  }

export const _validatePercentageRule = (_, value, callback) => {
	if (value === '') {
		return 'Enter a number';
	}
	const numericValue = parseFloat(value);
	if (isNaN(numericValue)) {
		return 'Enter a valid number';
	}
	
	// uncomment it to allow float value
	//   if (numericValue < 0) {
	//     return 'Enter a non-negative value';
	//   }
	const pattern = /^\d+$/
	const isPositiveInteger = isNaN(value) || value <= 0 || !pattern.test(value)
	if (isPositiveInteger) {
		return `Enter positive integers only`;
	}
	// Uncomment the following block to restrict values to <= 100
	if (numericValue > 100) {
	  return 'Enter a value <= 100';
	}
	
	// uncomment it to allow float value
	//   const decimalPlaces = (numericValue.toString().split('.')[1] || '').length;
	//   if (decimalPlaces > 2) {
	//     return 'Limit to two decimal places';
	//   }
	return '';
	}

export const validateMarginRule = (value, minVal, maxVal, errorMsgEmpty, errorMsgGreater) => {
	if(value === '') return errorMsgEmpty
	const pattern = /^-?\d+(\.\d{1,2})?$/
	if (!pattern.test(value) && value !== 0) return `Enter a number ${errorMsgGreater}, up to two decimal places`
	if (minVal !== undefined && value < minVal) return `Enter a number ${errorMsgGreater}, up to two decimal places`
	if (maxVal !== undefined && value > maxVal) return `Enter a number ${errorMsgGreater}, up to two decimal places`
	return ''
}

// 验证 indicator 不能为空
const createIndicatorValidate = indicatorType => {
	return (rule, value, callback) => {
		if (!value && this.indicatorRadio === indicatorType) {
			callback(
				new Error(`Please choose ${indicatorType.toLowerCase()} indicator`)
			)
		} else {
			callback()
		}
	}
}

// 创建 capital, commission, slippage 表单验证规则
export const validateCapitalRule = createLDVRule(
	1000,
	undefined,
	'starting capital',
	'over 1000'
)
export const validateCommissionRule = createLDVRule(
	0,
	50,
	'commission',
	'under 50'
)
export const validateSlippageRule = createLDVRule(
	0,
	undefined,
	'slippage',
	'over 0'
)

export const uniqueObjectArray = objectArray => {
	if(objectArray.length == 0) return objectArray
	
	// 辅助对象用于跟踪已经出现过的url值
	var urlMap = {}
	var urlKey = ''
	if(Object.keys(objectArray[0]).indexOf('url') != -1){
		urlKey = 'url'
	}else if(Object.keys(objectArray[0]).indexOf('symbol') != -1){
		urlKey = 'symbol'
	}else if(Object.keys(objectArray[0]).indexOf('indicator_url') != -1){	/**特殊情况，用于检测wic列表独一性，防止同名symbol序列和symbol冲突 */
		urlKey = 'indicator_url'
	}else {
		urlKey = 'stock'
	}

	// 使用filter方法进行去重
	var uniqueArray = objectArray.filter(function(obj) {
		if (!urlMap[obj[urlKey]]) {
			// 如果urlMap中不存在当前url值，将其添加到urlMap中，并返回true以保留该对象
			urlMap[obj[urlKey]] = true
			return true
		}
		// 如果urlMap中已经存在当前url值，返回false以过滤该对象
		return false
	})
	return uniqueArray
}
