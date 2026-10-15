const assert = require('assert')

const {
  EMPTY_BAR_FILL,
  MIN_VISIBLE_BAR_WIDTH,
  POSITIVE_BAR_FILL,
  getBarAttributes,
  getRankChartRows,
  getRowKey,
  getRowCenter,
  getValueTextAttributes
} = require('../src/components/Dashboard/rankChartLayout')

function createMockBandScale(positions, bandwidth) {
  const scale = name => positions[name]
  scale.bandwidth = () => bandwidth
  return scale
}

const x = createMockBandScale(
  {
    0: 80,
    1: 104,
    2: 128,
    3: 152
  },
  14
)
const y = value => value * 2
const middleValue = 50

const rows = getRankChartRows([
  { name: 'Spain', value: 0 },
  { name: 'United States', value: 50 },
  { name: 'India', value: 0 },
  { name: 'India', value: 63 }
])
const spain = rows[0]
const unitedStates = rows[1]
const firstIndia = rows[2]
const secondIndia = rows[3]

assert.strictEqual(getRowKey(unitedStates), '1')
assert.strictEqual(getRowCenter(x, unitedStates), 111)

const valueText = getValueTextAttributes(unitedStates, x, y, middleValue)
assert.strictEqual(
  valueText.y,
  getRowCenter(x, unitedStates),
  'value text should be vertically centered in the same row as its label'
)

const middleBar = getBarAttributes(unitedStates, x, y, middleValue)
assert.strictEqual(middleBar.fill, POSITIVE_BAR_FILL)
assert.ok(
  middleBar.width >= MIN_VISIBLE_BAR_WIDTH,
  'a non-zero value at the middle threshold should still render a visible red bar'
)
assert.strictEqual(
  middleBar.y,
  getRowCenter(x, unitedStates) - middleBar.height / 2,
  'bar should be vertically centered in the row'
)

const zeroBar = getBarAttributes(spain, x, y, middleValue)
assert.strictEqual(zeroBar.fill, EMPTY_BAR_FILL)
assert.strictEqual(zeroBar.width, 0)

const firstIndiaText = getValueTextAttributes(firstIndia, x, y, middleValue)
const secondIndiaText = getValueTextAttributes(secondIndia, x, y, middleValue)
assert.strictEqual(getRowKey(firstIndia), '2')
assert.strictEqual(getRowKey(secondIndia), '3')
assert.ok(Number.isFinite(firstIndiaText.y))
assert.ok(Number.isFinite(secondIndiaText.y))
assert.notStrictEqual(
  firstIndiaText.y,
  secondIndiaText.y,
  'duplicate country names should still render on separate rows'
)

console.log('Rank chart layout checks passed')
