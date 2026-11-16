<template>
  <div class="trade-chart-backdrop">
    <section class="trade-chart-dialog" role="dialog" aria-modal="true" aria-label="Trade history chart">
      <header class="trade-chart-header">
        <div>
          <h2>Trades on Chart</h2>
          <p>Price and volume with the trades in the filtered history</p>
        </div>
        <button type="button" class="trade-chart-close" aria-label="Close chart" @click="$emit('close')">&times;</button>
      </header>
      <div class="trade-chart-controls">
        <label for="trade-chart-ticker">Ticker</label>
        <select id="trade-chart-ticker" v-model="selectedTicker">
          <option v-for="item in tickerOptions" :key="item.symbol" :value="item.symbol">{{ item.symbol }} ({{ item.count }} trades)</option>
        </select>
        <span v-if="tickerOptions.length > 1">Showing the first matching ticker. Select another to switch charts.</span>
      </div>
      <div class="trade-chart-stage">
        <p v-if="loading" class="trade-chart-message">Loading price data...</p>
        <p v-else-if="error" class="trade-chart-message">{{ error }}</p>
        <div v-show="!loading && !error" ref="chart" class="trade-chart-canvas"></div>
      </div>
      <p v-if="!loading && !error && unmatchedCount" class="trade-chart-message">{{ unmatchedCount }} trade marker(s) could not be placed on the daily chart.</p>
    </section>
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import { getPairData } from '@/service/service'

const day = 24 * 60 * 60 * 1000
const upColor = '#8cc176'
const downColor = '#b82c0c'
const buyMarkerColor = '#008a3b'
const sellMarkerColor = '#e11d48'
const dateKey = value => String(value || '').slice(0, 10)
const timestamp = value => /^\d{4}-\d{2}-\d{2}$/.test(dateKey(value)) ? Date.parse(`${dateKey(value)}T00:00:00Z`) : NaN
const price = value => {
  const number = Number(String(value == null ? '' : value).replace(/[$,]/g, ''))
  return Number.isFinite(number) ? number : null
}

export default {
  name: 'TradeHistoryChartModal',
  props: { rows: { type: Array, required: true } },
  data() {
    return { selectedTicker: '', loading: false, error: '', unmatchedCount: 0, chart: null, requestSerial: 0, pairDataCache: new Map() }
  },
  computed: {
    tickerOptions() {
      const counts = new Map()
      this.rows.forEach(row => {
        const symbol = String(row.symbol || '').trim().toUpperCase()
        if (symbol) counts.set(symbol, (counts.get(symbol) || 0) + 1)
      })
      return [...counts].map(([symbol, count]) => ({ symbol, count }))
    },
    tickerRows() {
      return this.rows.filter(row => String(row.symbol || '').trim().toUpperCase() === this.selectedTicker)
    },
  },
  watch: {
    selectedTicker() { this.loadChart() },
  },
  mounted() {
    this.selectedTicker = this.tickerOptions[0]?.symbol || ''
  },
  beforeDestroy() {
    this.requestSerial += 1
    if (this.chart) this.chart.destroy()
  },
  methods: {
    async loadChart() {
      const symbol = this.selectedTicker
      const serial = ++this.requestSerial
      if (this.chart) { this.chart.destroy(); this.chart = null }
      if (!symbol) return
      this.loading = true
      this.error = ''
      this.unmatchedCount = 0
      const dates = this.tickerRows.flatMap(row => [timestamp(row.entryDate), timestamp(row.exitDate)]).filter(Number.isFinite)
      if (!dates.length) { this.loading = false; this.error = 'No valid trade dates are available.'; return }
      const latestTradeDate = Math.max(...dates)
      const viewStart = new Date(latestTradeDate)
      viewStart.setUTCMonth(viewStart.getUTCMonth() - 6)
      const viewEnd = new Date(latestTradeDate)
      viewEnd.setUTCMonth(viewEnd.getUTCMonth() + 6)
      const start = new Date(Math.min(Math.min(...dates) - 30 * day, viewStart.getTime())).toISOString().slice(0, 10)
      const end = new Date(Math.min(Date.now(), viewEnd.getTime())).toISOString().slice(0, 10)
      try {
        let records = this.pairDataCache.get(symbol)
        if (!records) {
          const response = await getPairData(start, end, 'Daily', symbol)
          records = Array.isArray(response.data) ? response.data : response.data?.data
          if (Array.isArray(records)) this.pairDataCache.set(symbol, records)
        }
        if (serial !== this.requestSerial) return
        if (!Array.isArray(records)) throw new Error('Price data is unavailable for this ticker.')
        const candles = records.map(item => {
          const x = timestamp(item.DT || item.date || item.Date)
          const values = [item.Open, item.High, item.Low, item.Close].map(price)
          return Number.isFinite(x) && values.every(value => value !== null) ? [x, ...values] : null
        }).filter(Boolean).sort((a, b) => a[0] - b[0])
        if (!candles.length) throw new Error('No OHLC price data is available for this ticker.')
        const byDate = new Map(candles.map(item => [item[0], item]))
        const volume = records.map(item => {
          const x = timestamp(item.DT || item.date || item.Date)
          const amount = price(item.Volume ?? item.volume)
          const candle = byDate.get(x)
          return Number.isFinite(x) && amount !== null && candle
            ? { x, y: amount, color: candle[4] >= candle[1] ? upColor : downColor }
            : null
        }).filter(Boolean).sort((a, b) => a.x - b.x)
        const buys = []
        const sells = []
        let unmatched = 0
        this.tickerRows.forEach(row => {
          ;[['entryDate', buys, -1], ['exitDate', sells, 1]].forEach(([dateField, target, direction]) => {
            const x = timestamp(row[dateField])
            if (!Number.isFinite(x)) return
            const candle = byDate.get(x)
            if (!candle) { unmatched += 1; return }
            const gap = Math.max(candle[2] - candle[3], candle[4] * 0.012)
            const sameDayCount = target.filter(point => point.x === x).length
            const y = direction < 0
              ? candle[3] - gap * (2.5 + sameDayCount * 1.1)
              : candle[2] + gap * (2.5 + sameDayCount * 1.1)
            target.push({ x, y, custom: { row } })
          })
        })
        this.unmatchedCount = unmatched
        this.loading = false
        await this.$nextTick()
        if (serial !== this.requestSerial) return
        const latestCandleDate = candles[candles.length - 1][0]
        const zoomToRecentMonths = months => {
          const from = new Date(latestCandleDate)
          from.setUTCMonth(from.getUTCMonth() - months)
          this.chart.xAxis[0].setExtremes(from.getTime(), latestCandleDate)
          return false
        }
        this.chart = Highcharts.stockChart(this.$refs.chart, {
          chart: { height: 560, marginRight: 80 },
          title: { text: `${symbol} · ${this.tickerRows.length} trades` },
          credits: {
            enabled: true,
            text: 'sentimentrader.com',
            href: 'https://sentimentrader.com/',
            position: { align: 'right', verticalAlign: 'bottom', x: -100, y: -180 },
          },
          rangeSelector: {
            buttons: [
              { type: 'month', count: 3, text: '3m', events: { click: () => zoomToRecentMonths(3) } },
              { type: 'month', count: 6, text: '6m', events: { click: () => zoomToRecentMonths(6) } },
              { type: 'year', count: 1, text: '1y', events: { click: () => zoomToRecentMonths(12) } },
              { type: 'all', text: 'All', events: { click: () => { this.chart.xAxis[0].setExtremes(candles[0][0], latestCandleDate); return false } } },
            ],
          },
          navigator: { enabled: true },
          xAxis: { min: viewStart.getTime(), max: viewEnd.getTime(), crosshair: false, labels: { style: { fontSize: '11px', color: '#666666' } } },
          yAxis: [
            { height: '72%', opposite: true, title: { text: symbol }, crosshair: false, labels: { align: 'left', x: 12, style: { fontSize: '11px', color: '#666666' } } },
            { top: '76%', height: '24%', offset: 0, title: { text: 'Volume' }, crosshair: false, labels: { style: { fontSize: '11px', color: '#666666' } } },
          ],
          plotOptions: { series: { dataGrouping: { enabled: false }, turboThreshold: 0, states: { hover: { enabled: false, halo: { size: 0 } }, inactive: { opacity: 1 } }, marker: { states: { hover: { enabled: false } } } } },
          tooltip: {
            shared: true,
            split: false,
            crosshairs: false,
            formatter() {
              let content = `<b>${new Date(this.x).toISOString().slice(0, 10)}</b>`
              const hoveredPoint = this.point || (this.points && this.points[0]?.series.chart.hoverPoint)
              if (hoveredPoint && (hoveredPoint.series.name === 'Buy' || hoveredPoint.series.name === 'Sell')) {
                const name = hoveredPoint.series.name
                const row = hoveredPoint.custom.row
                content += `<br/><span style="color:${name === 'Buy' ? buyMarkerColor : sellMarkerColor}">●</span> ${name}: ${name === 'Buy' ? row.entryPrice : row.exitPrice}`
                content += `<br/>Shares: ${row.shares}`
                if (name === 'Sell') content += `<br/>Return: ${row.returnPct}<br/>P&L: ${row.realizedPnl}`
                return content
              }
              const candle = byDate.get(this.x)
              if (candle) {
                content += `<br/>Open: ${candle[1]}<br/>High: ${candle[2]}<br/>Low: ${candle[3]}<br/>Close: ${candle[4]}`
              }
              const volumePoint = volume.find(point => point.x === this.x)
              if (volumePoint) content += `<br/>Volume: ${Highcharts.numberFormat(volumePoint.y, 0)}`
              return content
            },
          },
          series: [
            { type: 'candlestick', name: symbol, data: candles, id: 'price', color: downColor, upColor, lineColor: '#111111', upLineColor: '#111111', lineWidth: 1 },
            { type: 'column', name: 'Volume', data: volume, yAxis: 1, borderColor: '#111111', borderWidth: 1 },
            { type: 'scatter', name: 'Buy', data: buys, color: buyMarkerColor, marker: { symbol: 'triangle', radius: 11, lineColor: '#ffffff', lineWidth: 2 } },
            { type: 'scatter', name: 'Sell', data: sells, color: sellMarkerColor, marker: { symbol: 'triangle-down', radius: 11, lineColor: '#ffffff', lineWidth: 2 } },
          ],
        })
      } catch (error) {
        if (serial !== this.requestSerial) return
        this.loading = false
        this.error = error.message || 'Could not load price data.'
      }
    },
  },
}
</script>

<style scoped>
.trade-chart-backdrop { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(15, 23, 42, .65); }
.trade-chart-dialog { width: min(1100px, 100%); max-height: 90vh; overflow: auto; padding: 24px; border-radius: 12px; background: #fff; box-shadow: 0 20px 60px rgba(0,0,0,.25); }
.trade-chart-header { display: flex; align-items: start; justify-content: space-between; gap: 16px; }
.trade-chart-header h2 { margin: 0; font-size: 20px; }
.trade-chart-header p { margin: 6px 0 0; color: #64748b; }
.trade-chart-close { border: 0; background: transparent; font-size: 28px; cursor: pointer; }
.trade-chart-controls { display: flex; align-items: center; gap: 10px; margin: 20px 0; flex-wrap: wrap; }
.trade-chart-controls select { min-width: 180px; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
.trade-chart-controls span, .trade-chart-message { color: #64748b; }
.trade-chart-stage { min-height: 560px; }
.trade-chart-canvas { width: 100%; min-height: 560px; }
</style>
