/*
   封装一个通用表单验证规则
   用于限制最多保存两位小数并且数值大小有限制 
   capital commission slippage 可公用
   createLimitedDecimalValueRule 简写至 createLDVRule
  */
const createLDVRule = (minVal, maxVal, errorMsgEmpty, errorMsgGreater) => {
	return (_, value, callback) => {
		const pattern = /^\d+(\.\d{1,2})?$/
		if (value === '') {
			callback(new Error(`Please input ${errorMsgEmpty}`))
		}
		if (!pattern.test(value) && value !== 0) {
			callback(
				new Error(
					`Enter a number ${errorMsgGreater}, rounded to two decimals at most.`
				)
			)
		}
		if (minVal !== undefined && value < minVal) {
			callback(
				new Error(`Enter a number ${errorMsgGreater}, up to two decimal places`)
			)
		}
		if (maxVal !== undefined && value > maxVal) {
			callback(
				new Error(`Enter a number ${errorMsgGreater}, up to two decimal places`)
			)
		}
		callback()
	}
}
export const createTPSLValidate = (minVal, value) => {
	// 给 Stop Loss 和 Take Profit 用
	const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
	const isLessThanMin = value < minVal
	const isMatched = !pattern.test(value) && value != 0
	if (isLessThanMin) {
		return `Only positive numbers are allowed`
	}
	if (isMatched) {
		return `Numeric input with two decimal places.`
	}
	return ''
}
export const createPositiveIntegerValidate = value => {
	// 给 Time In Market 和 exclude 用
	const pattern = /^\d+$/
	const isPositiveInteger = isNaN(value) || value < 0 || !pattern.test(value)
	if (isPositiveInteger) {
		return `Enter positive integers only.`
	}
	return ''
}
// 用于分析师 URL 验证
export const validateURLRule = (_, value, callback) => {
	const pattern = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
	if (value === '') {
		callback(new Error('Please enter the url of the analyst report'))
	}
	if (!pattern.test(value)) {
		callback(new Error('Url address format error'))
	}
	callback()
}

export const validatePercentageRule = (_, value, callback) => {
	if (value === '') {
		return 'Enter a number'
	}

	const numericValue = parseFloat(value)

	if (isNaN(numericValue)) {
		return 'Enter a valid number'
	}

	// if (numericValue < 0 || numericValue > 100) {
	// 	return 'Enter a value <= 100'
	// }

	const decimalPlaces = (numericValue.toString().split('.')[1] || '').length

	if (decimalPlaces > 2) {
		return 'Limit to two decimal places'
	}

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
	'greater than 1000'
)
export const validateCommissionRule = createLDVRule(
	undefined,
	50,
	'commission',
	'less than 50'
)
export const validateSlippageRule = createLDVRule(
	0,
	undefined,
	'slippage',
	'greater than 0'
)

export const uniqueObjectArray = objectArray => {
	// 辅助对象用于跟踪已经出现过的url值
	var urlMap = {}

	// 使用filter方法进行去重
	var uniqueArray = objectArray.filter(function(obj) {
		if (!urlMap[obj.url]) {
			// 如果urlMap中不存在当前url值，将其添加到urlMap中，并返回true以保留该对象
			urlMap[obj.url] = true
			return true
		}
		// 如果urlMap中已经存在当前url值，返回false以过滤该对象
		return false
	})
	return uniqueArray
}
