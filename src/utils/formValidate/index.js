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
      callback(new Error(`Enter a number ${errorMsgGreater}, rounded to two decimals at most.`))
    }
    if (minVal !== undefined && value < minVal) {
      callback(new Error(`Enter a number ${errorMsgGreater}, up to two decimal places`))
    }
    if (maxVal !== undefined && value > maxVal) {
      callback(new Error(`Enter a number ${errorMsgGreater}, up to two decimal places`))
    }
    callback()
  }
}
export const createTPSLValidate = (minVal, value) => {
  // 给 Stop Loss 和 Take Profit 用
  const pattern = /^(([1-9][0-9]*)|([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2}))$/
  const isLessThanMin = value < minVal
  const isMatched = !pattern.test(value) && value != 0
  if(isLessThanMin) {
    return `Only positive numbers are allowed`
  }
  if (isMatched) {
    return `Numeric input with two decimal places.`
  }
  return ''
}
export const createPositiveIntegerValidate = (value) => {
  // 给 Time In Market 和 exclude 用
  const pattern = /^\d+$/;
  const isPositiveInteger = isNaN(value) || value < 0  || !pattern.test(value)
  if(isPositiveInteger) {
    return `Enter positive integers only.`
  }
  return ''
}

export const validateURLRule = (_, value, callback) => {
  const pattern =
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/
  if (value === '') {
    callback(new Error('Please enter the url of the analyst report'))
  }
  if (!pattern.test(value)) {
    callback(new Error('Url address format error'))
  }
  callback()
}

// 创建 capital, commission, slippage 表单验证规则
export const validateCapitalRule = createLDVRule(1000, undefined, 'starting capital', 'greater than 1000');
export const validateCommissionRule = createLDVRule(undefined, 50, 'commission', 'less than 50');
export const validateSlippageRule = createLDVRule(0, undefined, 'slippage', 'greater than 0');