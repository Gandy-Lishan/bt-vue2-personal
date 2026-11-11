const timestamp = value => {
  if (value == null || value === '') return NaN
  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    const number = Number(value)
    return number < 1e11 ? number * 1000 : number
  }
  return Date.parse(value)
}

const value = input => input == null || input === '' ? null : Number(input)

export function intradaySeries(data) {
  const bars = Array.isArray(data.bars) ? data.bars : Array.isArray(data.records) ? data.records : []
  const prices = bars.map(bar => {
    const date = Array.isArray(bar) ? bar[0] : bar.Date ?? bar.date ?? bar.timestamp ?? bar.time
    const close = Array.isArray(bar) ? bar[4] : bar.Close ?? bar.close
    return [timestamp(date), value(close)]
  }).filter(point => Number.isFinite(point[0]) && point[1] !== null && Number.isFinite(point[1]))
    .sort((a, b) => a[0] - b[0])

  const optixSource = Array.isArray(data.optix) ? data.optix : bars
  const optix = optixSource.map(point => {
    const date = Array.isArray(point) ? point[0] : point.Date ?? point.date ?? point.timestamp ?? point.time
    const reading = Array.isArray(point) ? (optixSource === bars ? point[6] : point[1]) : point.Optix ?? point.optix
    return [timestamp(date), value(reading)]
  }).filter(point => Number.isFinite(point[0]) && (point[1] === null || Number.isFinite(point[1])))
    .sort((a, b) => a[0] - b[0])

  return { prices, optix }
}
