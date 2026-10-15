const BAR_LABEL_FONT_SIZE = '12px'
const BAR_LABEL_FILL = '#333'
const VALUE_TEXT_FONT_SIZE = '10px'
const VALUE_TEXT_FILL = '#666'
const POSITIVE_BAR_FILL = '#da8a8a'
const NEGATIVE_BAR_FILL = '#63be7b'
const EMPTY_BAR_FILL = 'none'
const MIN_VISIBLE_BAR_WIDTH = 2
const RANK_CHART_ROW_KEY = '__rankChartRowKey'

function getRankChartRows(data) {
  return data.map((item, index) => {
    const row = Object.assign({}, item)
    row[RANK_CHART_ROW_KEY] = String(index)
    return row
  })
}

function getChartValue(d) {
  const value = parseFloat(d && d.value)
  return Number.isFinite(value) ? value : 0
}

function isZeroChartValue(d) {
  return getChartValue(d) === 0
}

function getRowKey(d) {
  return d[RANK_CHART_ROW_KEY]
}

function getRowCenter(x, d) {
  return x(getRowKey(d)) + x.bandwidth() / 2
}

function getValueTextAttributes(d, x, y, middleValue) {
  const value = getChartValue(d)
  const isBelowMiddle = value < middleValue

  return {
    x: isBelowMiddle ? y(value) - 5 : y(value) + 5,
    y: getRowCenter(x, d),
    textAnchor: isBelowMiddle ? 'end' : 'start',
    text: Math.round(value)
  }
}

function getBarAttributes(d, x, y, middleValue) {
  const value = getChartValue(d)
  const isZeroValue = isZeroChartValue(d)
  const isBelowMiddle = value < middleValue
  const rawWidth = Math.abs(y(value) - y(middleValue))
  const width = isZeroValue ? 0 : Math.max(rawWidth, MIN_VISIBLE_BAR_WIDTH)
  const height = x.bandwidth()
  const middlePosition = y(middleValue)

  return {
    x: isBelowMiddle ? middlePosition - width : middlePosition,
    y: getRowCenter(x, d) - height / 2,
    width,
    height,
    fill: isZeroValue ? EMPTY_BAR_FILL : isBelowMiddle ? NEGATIVE_BAR_FILL : POSITIVE_BAR_FILL
  }
}

module.exports = {
  BAR_LABEL_FILL,
  BAR_LABEL_FONT_SIZE,
  EMPTY_BAR_FILL,
  MIN_VISIBLE_BAR_WIDTH,
  NEGATIVE_BAR_FILL,
  POSITIVE_BAR_FILL,
  VALUE_TEXT_FILL,
  VALUE_TEXT_FONT_SIZE,
  getBarAttributes,
  getChartValue,
  getRankChartRows,
  getRowKey,
  getRowCenter,
  getValueTextAttributes,
  isZeroChartValue
}
