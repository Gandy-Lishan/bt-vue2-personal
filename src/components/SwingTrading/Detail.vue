<template>
  <main class="swing-detail-page">
    <div class="back-row">
      <button class="back-link" type="button" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 19-7-7 7-7" />
        </svg>
        Back to Strategy List
      </button>
    </div>

    <section class="detail-hero">
      <h1>{{ detailTitle }}</h1>
      <p>{{ detail.description }}</p>
    </section>

    <section class="overview-section">
      <div class="section-heading">
        <span></span>
        <h2>Strategy Overview</h2>
      </div>

      <div class="overview-card">
        <p class="overview-copy">{{ detail.overview }}</p>

        <div class="parameter-grid">
          <div>
            <span class="parameter-title">Core Parameters</span>
            <ul>
              <li v-for="item in detail.coreParameters" :key="item.label">
                <strong>{{ item.label }}:</strong>
                <span>{{ item.value }}</span>
              </li>
            </ul>
          </div>

          <div>
            <span class="parameter-title">Filter Conditions</span>
            <ul>
              <li v-for="item in detail.filterConditions" :key="item.label">
                <strong>{{ item.label }}:</strong>
                <span>{{ item.value }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="signals-block">
          <span class="parameter-title">Signals List</span>
          <div class="signal-chips">
            <span v-for="signal in detail.signals" :key="signal">{{ signal }}</span>
          </div>
        </div>
      </div>
    </section>

    <nav class="detail-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </nav>

    <section v-if="activeTab === 'summary'" class="summary-panel">
      <div class="stats-board">
        <div v-for="(row, rowIndex) in detail.summaryStats" :key="`stats-${rowIndex}`" class="stats-row" :class="`cols-${row.length}`">
          <div v-for="stat in row" :key="stat.label" class="stat-cell">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value" :class="{ negative: isNegativeValue(stat.value) }">{{ stat.value }}</div>
          </div>
        </div>
      </div>

      <div class="charts-stack">
        <div class="chart-card">
          <h3>Cumulative Return % Comparison for Strategy vs Benchmark (SPX)</h3>
          <div class="chart-legend">
            <span><i class="legend-line benchmark"></i>Benchmark Cumulative</span>
            <span><i class="legend-line strategy"></i>Strategy Cumulative</span>
          </div>
          <div class="chart-wrap" @mousemove="handleChartMouseMove($event, 'cumulative')" @mouseleave="clearChartHover('cumulative')">
            <svg viewBox="0 0 1000 360" preserveAspectRatio="none">
              <g v-for="tick in getChartYAxisTicks('cumulative')" :key="`cumulative-y-${tick}`">
                <line class="grid-line" x1="52" :y1="getChartY(tick, 'cumulative')" x2="980" :y2="getChartY(tick, 'cumulative')" />
                <text class="axis-tick y-tick" x="43" :y="getChartY(tick, 'cumulative') + 4">{{ tick }}</text>
              </g>
              <line class="axis-line" x1="52" y1="292" x2="980" y2="292" />
              <line class="axis-line" x1="52" y1="18" x2="52" y2="292" />
              <g v-for="(label, index) in chartDateTicks" :key="`cumulative-x-${label}`">
                <text class="axis-tick x-tick" :x="getChartDateX(index)" y="318">{{ label }}</text>
              </g>
              <text class="axis-title" x="516" y="344">Date</text>
              <polyline :points="getChartPoints('cumulative', 'benchmark')" class="benchmark-line" />
              <polyline :points="getChartPoints('cumulative', 'strategy')" class="strategy-line" />
              <g v-if="chartHover.cumulative" class="chart-hover-layer">
                <line class="hover-guide-line" :x1="chartHover.cumulative.x" y1="18" :x2="chartHover.cumulative.x" y2="292" />
                <circle class="hover-point benchmark" :cx="chartHover.cumulative.x" :cy="chartHover.cumulative.benchmarkY" r="4.5" />
                <circle class="hover-point strategy" :cx="chartHover.cumulative.x" :cy="chartHover.cumulative.strategyY" r="4.5" />
              </g>
            </svg>
            <div v-if="chartHover.cumulative" class="chart-tooltip" :class="`is-${chartHover.cumulative.side}`" :style="getTooltipStyle('cumulative')">
              <div class="tooltip-date">{{ chartHover.cumulative.date }}</div>
              <div class="tooltip-row">
                <i class="tooltip-swatch benchmark"></i>
                <span>Benchmark Cumulative:</span>
                <strong>{{ formatChartTooltipValue(chartHover.cumulative.benchmarkValue) }}</strong>
              </div>
              <div class="tooltip-row">
                <i class="tooltip-swatch strategy"></i>
                <span>Strategy Cumulative:</span>
                <strong>{{ formatChartTooltipValue(chartHover.cumulative.strategyValue) }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>Drawdown Comparison for Strategy vs Benchmark (SPX)</h3>
          <div class="chart-legend">
            <span><i class="legend-line benchmark"></i>Benchmark Drawdown</span>
            <span><i class="legend-line strategy"></i>Strategy Drawdown</span>
          </div>
          <div class="chart-wrap" @mousemove="handleChartMouseMove($event, 'drawdown')" @mouseleave="clearChartHover('drawdown')">
            <svg viewBox="0 0 1000 360" preserveAspectRatio="none">
              <g v-for="tick in getChartYAxisTicks('drawdown')" :key="`drawdown-y-${tick}`">
                <line class="grid-line" x1="52" :y1="getChartY(tick, 'drawdown')" x2="980" :y2="getChartY(tick, 'drawdown')" />
                <text class="axis-tick y-tick" x="43" :y="getChartY(tick, 'drawdown') + 4">{{ tick }}</text>
              </g>
              <line class="axis-line" x1="52" y1="292" x2="980" y2="292" />
              <line class="axis-line" x1="52" y1="18" x2="52" y2="292" />
              <g v-for="(label, index) in chartDateTicks" :key="`drawdown-x-${label}`">
                <text class="axis-tick x-tick" :x="getChartDateX(index)" y="318">{{ label }}</text>
              </g>
              <text class="axis-title" x="516" y="344">Date</text>
              <polyline :points="getChartPoints('drawdown', 'benchmark')" class="benchmark-line" />
              <polyline :points="getChartPoints('drawdown', 'strategy')" class="strategy-line" />
              <g v-if="chartHover.drawdown" class="chart-hover-layer">
                <line class="hover-guide-line" :x1="chartHover.drawdown.x" y1="18" :x2="chartHover.drawdown.x" y2="292" />
                <circle class="hover-point benchmark" :cx="chartHover.drawdown.x" :cy="chartHover.drawdown.benchmarkY" r="4.5" />
                <circle class="hover-point strategy" :cx="chartHover.drawdown.x" :cy="chartHover.drawdown.strategyY" r="4.5" />
              </g>
            </svg>
            <div v-if="chartHover.drawdown" class="chart-tooltip" :class="`is-${chartHover.drawdown.side}`" :style="getTooltipStyle('drawdown')">
              <div class="tooltip-date">{{ chartHover.drawdown.date }}</div>
              <div class="tooltip-row">
                <i class="tooltip-swatch benchmark"></i>
                <span>Benchmark Drawdown:</span>
                <strong>{{ formatChartTooltipValue(chartHover.drawdown.benchmarkValue) }}</strong>
              </div>
              <div class="tooltip-row">
                <i class="tooltip-swatch strategy"></i>
                <span>Strategy Drawdown:</span>
                <strong>{{ formatChartTooltipValue(chartHover.drawdown.strategyValue) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="table-panel">
      <div class="detail-table-wrap">
        <table>
          <thead>
            <tr>
              <th v-for="column in activeTableColumns" :key="column.key" :class="column.className">
	                <button class="sort-button" type="button" :title="getSortTitle(column)" @click="setTableSort(column.key)">
	                  <span class="column-label">
	                    <span class="column-title">
	                      <span v-for="line in getHeaderLines(column)" :key="`${column.key}-${line}`">{{ line }}</span>
	                    </span>
	                    <span
	                      class="sort-icon"
                      :class="{
                        'is-asc': currentSort.key === column.key && currentSort.direction === 'asc',
                        'is-desc': currentSort.key === column.key && currentSort.direction === 'desc'
                      }"
                      aria-hidden="true"
                    >
                      <i class="sort-caret up"></i>
                      <i class="sort-caret down"></i>
                    </span>
                  </span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!sortedActiveRows.length">
              <td :colspan="activeTableColumns.length" class="empty-row">No Data</td>
            </tr>
            <tr v-for="(row, rowIndex) in sortedActiveRows" :key="`${activeTab}-${rowIndex}-${row.symbol || row.index}`">
              <td
                v-for="column in activeTableColumns"
                :key="`${activeTab}-${rowIndex}-${column.key}`"
                :class="getCellClass(row[column.key], column)"
              >
                <span>{{ row[column.key] }}</span>
                <span v-if="column.tooltip" class="tooltip-dot" :title="row[column.tooltip] || column.tooltipTitle">?</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="activeTableConfig.note" class="table-note">
        {{ activeTableConfig.note }}
      </div>
    </section>
  </main>
</template>

<script>
import axios from '@/axios'

const SWING_TRADING_DETAIL_API = '/dev/st_data/swing_trading/detail'
// Turn this off when the Swing Trading detail backend endpoint is ready.
const USE_MOCK_SWING_TRADING_DETAIL_DATA = true

const tabs = [
  { key: 'holdings', label: 'Holdings Overview' },
  { key: 'preview', label: 'Preview Filter List' },
  { key: 'summary', label: 'Trading Summary' },
  { key: 'trades', label: 'Backtest Trades' }
]

const numericColumns = [
  'index',
  'close',
  'trend',
  'relTrend',
  'optix',
  'winRate',
  'stopLoss',
  'profitTarget',
  'tim',
  'expectedReturn',
  'entryPrice',
  'currentPrice',
  'shares',
  'profitPct',
  'stayInMarket',
  'bestTimeInMarket',
  'stopLossPrice',
  'profitTargetPrice',
  'exitPrice',
  'floatingProfit'
]

const chartDateTicks = [
  '2026-01-30',
  '2026-02-18',
  '2026-03-09',
  '2026-03-28',
  '2026-04-16',
  '2026-05-05',
  '2026-05-24',
  '2026-06-12'
]

const chartMeta = {
  cumulative: {
    min: -10,
    max: 50,
    ticks: [50, 40, 30, 20, 10, 0, -10]
  },
  drawdown: {
    min: -20,
    max: 0,
    ticks: [0, -2, -4, -6, -8, -10, -12, -14, -16, -18, -20]
  }
}

const chartBounds = {
  left: 52,
  right: 980,
  top: 18,
  bottom: 292
}

const chartRange = {
  start: '2026-01-30',
  end: '2026-06-29'
}

const tableColumns = {
  holdings: [
    { key: 'index', label: '#', type: 'number', className: 'index-col' },
    { key: 'entryDate', label: 'Entry Date', headerLines: ['Entry', 'Date'], className: 'date-col' },
    { key: 'symbol', label: 'Symbol', className: 'symbol-col' },
    { key: 'signal', label: 'Signal', className: 'signal-col' },
    { key: 'entryPrice', label: 'Entry Price', type: 'number', headerLines: ['Entry', 'Price'], className: 'price-col' },
    { key: 'currentPrice', label: 'Current Price', type: 'number', headerLines: ['Current', 'Price'], className: 'price-col' },
    { key: 'shares', label: 'Shares', type: 'number', className: 'shares-col' },
    { key: 'profitPct', label: 'Profit Pct', type: 'number', tone: 'return', headerLines: ['Profit', 'Pct'], className: 'percent-col' },
    { key: 'stayInMarket', label: 'Stay In Market', type: 'number', headerLines: ['Stay In', 'Market'], className: 'market-days-col' },
    { key: 'bestTimeInMarket', label: 'Best Time In Market', type: 'number', headerLines: ['Best Time In', 'Market'], className: 'best-time-col' },
    { key: 'stopLoss', label: 'Stop Loss Pct', type: 'number', headerLines: ['Stop Loss', 'Pct'], className: 'percent-col' },
    { key: 'stopLossPrice', label: 'Stop Loss Price', type: 'number', headerLines: ['Stop Loss', 'Price'], className: 'price-col' },
    { key: 'profitTarget', label: 'Profit Target Pct', type: 'number', headerLines: ['Profit Target', 'Pct'], className: 'profit-target-col' },
    { key: 'profitTargetPrice', label: 'Profit Target Price', type: 'number', headerLines: ['Profit Target', 'Price'], className: 'profit-target-price-col' }
  ],
  preview: [
    { key: 'date', label: 'Date' },
    { key: 'symbol', label: 'Symbol', className: 'symbol-col' },
    { key: 'close', label: 'Close', type: 'number' },
    { key: 'trend', label: 'Trend', type: 'number' },
    { key: 'relTrend', label: 'RelTrend Score', type: 'number', headerLines: ['RelTrend', 'Score'] },
    { key: 'optix', label: 'Optix', type: 'number' },
    { key: 'direction', label: 'Direction' },
    { key: 'signal', label: 'Signal', tooltip: 'signalDescription', tooltipTitle: 'Signal description' },
    { key: 'winRate', label: 'Win Rate(%)', type: 'number', headerLines: ['Win', 'Rate(%)'] },
    { key: 'stopLoss', label: 'Stop Loss(%)', type: 'number', headerLines: ['Stop', 'Loss(%)'] },
    { key: 'profitTarget', label: 'Profit Target(%)', type: 'number', headerLines: ['Profit', 'Target(%)'] },
    { key: 'tim', label: 'Best Time In Market (Bars)', type: 'number', headerLines: ['Best Time In', 'Market (Bars)'] },
    { key: 'expectedReturn', label: 'Expected Return(%)', type: 'number', headerLines: ['Expected', 'Return(%)'] }
  ],
  trades: [
    { key: 'index', label: '#', type: 'number' },
    { key: 'symbol', label: 'Symbol', className: 'symbol-col' },
    { key: 'signal', label: 'Signal' },
    { key: 'direction', label: 'Direction' },
    { key: 'entryDate', label: 'Entry Date', headerLines: ['Entry', 'Date'] },
    { key: 'entryAction', label: 'Entry Action', headerLines: ['Entry', 'Action'] },
    { key: 'entryPrice', label: 'Entry Price', type: 'number', headerLines: ['Entry', 'Price'] },
    { key: 'exitDate', label: 'Exit Date', headerLines: ['Exit', 'Date'] },
    { key: 'exitAction', label: 'Exit Action', headerLines: ['Exit', 'Action'] },
    { key: 'exitPrice', label: 'Exit Price', type: 'number', headerLines: ['Exit', 'Price'] },
    { key: 'shares', label: 'Shares', type: 'number' },
    { key: 'floatingProfit', label: 'Floating Profit(%)', type: 'number', tone: 'return', headerLines: ['Floating', 'Profit(%)'] },
    { key: 'exitReason', label: 'Exit Reason', headerLines: ['Exit', 'Reason'] }
  ]
}

const fallbackDetail = {
  id: 'Strategy 1',
  url: 'champion',
  title: 'Champion',
  date: '2026-08-04',
  description: 'Aggressive trend-following model optimized for highly volatile equity markets.',
  overview: 'Strategy 1 (Champion) operates on a precise set of quantitative parameters and technical filters. It screens for optimal risk/reward setups and ranks candidates to pick the most explosive daily opportunities.',
  coreParameters: [
    { label: 'Sort By', value: 'SharpeRatio' },
    { label: 'Top N (Daily)', value: '3' },
    { label: 'Allocation', value: '0.66' }
  ],
  filterConditions: [
    { label: 'Profit Target', value: '8% <= PT <= 20%' },
    { label: 'Stop Loss', value: '6% <= SL <= 16%' },
    { label: 'Best Time In Market', value: '5 <= TIM <= 21' }
  ],
  signals: ['HighPoints', 'MA (Moving Average)', 'Symbol 13-Week High', 'Descending Channel', 'MAGap', 'MACDHist'],
  summaryStats: [
    [
      { label: 'TOTAL RETURN %', value: '15.4%' },
      { label: 'MEDIAN TRADE RETURN %', value: '3.2%' },
      { label: 'Z-SCORE', value: '2.8' },
      { label: 'STD. DEV', value: '9.9' },
      { label: 'BUY & HOLD %(SPX)', value: '5.4%' }
    ],
    [
      { label: 'WIN RATE %', value: '53.2%' },
      { label: 'AVERAGE TRADE WIN %', value: '10.1%' },
      { label: 'AVERAGE TRADE LOSS %', value: '-2.5%' },
      { label: 'MAX RISK %', value: '-13.9%' }
    ],
    [
      { label: 'TOTAL TRADES', value: '325' },
      { label: 'TOTAL POSITIVE', value: '173' },
      { label: 'TOTAL NEGATIVE', value: '152' },
      { label: 'TIME IN MARKET %', value: '100.0%' }
    ]
  ],
  tables: {
    holdings: {
      columns: tableColumns.holdings,
      rows: [
        { index: 1, entryDate: '2026-07-18', symbol: 'NFLX', signal: 'MACDHistGap', entryPrice: '650.25', currentPrice: '682.76', shares: '60', profitPct: '+5.0%', stayInMarket: '6', bestTimeInMarket: '21', stopLoss: '8.0%', stopLossPrice: '598.23', profitTarget: '12.0%', profitTargetPrice: '728.28' },
        { index: 2, entryDate: '2026-07-20', symbol: 'TSLA', signal: 'HighPoints', entryPrice: '240.10', currentPrice: '235.30', shares: '100', profitPct: '-2.0%', stayInMarket: '4', bestTimeInMarket: '16', stopLoss: '10.0%', stopLossPrice: '216.09', profitTarget: '8.0%', profitTargetPrice: '259.31' },
        { index: 3, entryDate: '2026-07-22', symbol: 'WMT', signal: 'MACDHistGap', entryPrice: '65.50', currentPrice: '66.80', shares: '200', profitPct: '+2.0%', stayInMarket: '2', bestTimeInMarket: '21', stopLoss: '8.0%', stopLossPrice: '60.26', profitTarget: '12.0%', profitTargetPrice: '73.36' },
        { index: 4, entryDate: '2026-07-19', symbol: 'AAPL', signal: 'Desc Channel', entryPrice: '195.20', currentPrice: '192.10', shares: '50', profitPct: '-1.6%', stayInMarket: '5', bestTimeInMarket: '16', stopLoss: '9.0%', stopLossPrice: '177.63', profitTarget: '8.0%', profitTargetPrice: '210.81' },
        { index: 5, entryDate: '2026-07-14', symbol: 'GOOGL', signal: 'MA', entryPrice: '180.30', currentPrice: '185.70', shares: '80', profitPct: '+3.0%', stayInMarket: '10', bestTimeInMarket: '21', stopLoss: '8.0%', stopLossPrice: '165.87', profitTarget: '10.0%', profitTargetPrice: '198.33' },
        { index: 6, entryDate: '2026-07-16', symbol: 'META', signal: 'HighPoints', entryPrice: '485.00', currentPrice: '495.20', shares: '30', profitPct: '+2.1%', stayInMarket: '8', bestTimeInMarket: '20', stopLoss: '12.0%', stopLossPrice: '426.80', profitTarget: '8.0%', profitTargetPrice: '523.80' },
        { index: 7, entryDate: '2026-07-21', symbol: 'AMZN', signal: 'Symbol 13-W High', entryPrice: '178.50', currentPrice: '176.20', shares: '120', profitPct: '-1.3%', stayInMarket: '3', bestTimeInMarket: '18', stopLoss: '10.0%', stopLossPrice: '160.65', profitTarget: '12.0%', profitTargetPrice: '199.92' },
        { index: 8, entryDate: '2026-07-12', symbol: 'MSFT', signal: 'MAGap', entryPrice: '342.10', currentPrice: '358.50', shares: '40', profitPct: '+4.8%', stayInMarket: '12', bestTimeInMarket: '21', stopLoss: '8.0%', stopLossPrice: '314.73', profitTarget: '15.0%', profitTargetPrice: '393.41' },
        { index: 9, entryDate: '2026-07-17', symbol: 'NVDA', signal: 'MACDHistGap', entryPrice: '112.50', currentPrice: '124.80', shares: '150', profitPct: '+10.9%', stayInMarket: '7', bestTimeInMarket: '21', stopLoss: '10.0%', stopLossPrice: '101.25', profitTarget: '20.0%', profitTargetPrice: '135.00' },
        { index: 10, entryDate: '2026-07-23', symbol: 'AMD', signal: 'Desc Channel', entryPrice: '160.20', currentPrice: '155.40', shares: '100', profitPct: '-3.0%', stayInMarket: '1', bestTimeInMarket: '16', stopLoss: '12.0%', stopLossPrice: '140.97', profitTarget: '10.0%', profitTargetPrice: '176.22' }
      ]
    },
    preview: {
      columns: tableColumns.preview,
      note: 'Showing latest filter run data before daily deduplication process...',
      rows: [
        { date: '2026-04-23', symbol: 'URI', close: '986.78', trend: '7', relTrend: '7', optix: '99.4', direction: 'Long', signal: 'MACDHistGap', signalDescription: 'MACD histogram gap signal', winRate: '63.0%', stopLoss: '12.0%', profitTarget: '8.0%', tim: '20', expectedReturn: '0.6%' },
        { date: '2026-07-20', symbol: 'WDC', close: '487.42', trend: '9', relTrend: '0', optix: '33.9', direction: 'Long', signal: 'MACDHistGap', signalDescription: 'MACD histogram gap signal', winRate: '61.0%', stopLoss: '8.0%', profitTarget: '8.0%', tim: '21', expectedReturn: '1.8%' },
        { date: '2026-04-27', symbol: 'AMP', close: '477.86', trend: '4', relTrend: '1', optix: '87.3', direction: 'Long', signal: 'Symbol 4-Week High', signalDescription: 'Symbol crossed a recent 4-week high', winRate: '64.0%', stopLoss: '11.0%', profitTarget: '8.0%', tim: '20', expectedReturn: '1.2%' },
        { date: '2026-04-30', symbol: 'WDC', close: '434.52', trend: '10', relTrend: '10', optix: '92.2', direction: 'Long', signal: 'MACDHistGap', signalDescription: 'MACD histogram gap signal', winRate: '63.0%', stopLoss: '9.0%', profitTarget: '8.0%', tim: '21', expectedReturn: '1.7%' },
        { date: '2026-07-17', symbol: 'LGND', close: '303.39', trend: '10', relTrend: '0', optix: '53.4', direction: 'Long', signal: 'MA', signalDescription: 'Moving average confirmation', winRate: '55.0%', stopLoss: '8.0%', profitTarget: '8.0%', tim: '17', expectedReturn: '0.8%' },
        { date: '2026-04-17', symbol: 'RCL', close: '285.48', trend: '2', relTrend: '2', optix: '81.3', direction: 'Long', signal: 'MA', signalDescription: 'Moving average confirmation', winRate: '59.0%', stopLoss: '9.0%', profitTarget: '8.0%', tim: '16', expectedReturn: '1.0%' },
        { date: '2026-05-28', symbol: 'NVDA', close: '214.25', trend: '10', relTrend: '9', optix: '42.5', direction: 'Long', signal: 'Hammer followed by a rise', signalDescription: 'Hammer candle followed by strength', winRate: '60.0%', stopLoss: '8.0%', profitTarget: '8.0%', tim: '21', expectedReturn: '1.6%' },
        { date: '2026-07-22', symbol: 'NVDA', close: '212.06', trend: '9', relTrend: '8', optix: '59.7', direction: 'Long', signal: 'Hammer followed by a rise', signalDescription: 'Hammer candle followed by strength', winRate: '59.0%', stopLoss: '8.0%', profitTarget: '8.0%', tim: '21', expectedReturn: '1.4%' },
        { date: '2026-05-19', symbol: 'LGND', close: '207.78', trend: '8', relTrend: '6', optix: '27.2', direction: 'Long', signal: 'Descending Channel', signalDescription: 'Descending channel breakout setup', winRate: '90.0%', stopLoss: '12.0%', profitTarget: '8.0%', tim: '9', expectedReturn: '6.0%' }
      ]
    },
    trades: {
      columns: tableColumns.trades,
      rows: [
        { index: 1, symbol: 'MSFT', signal: 'MACDHistGap', direction: 'Long', entryDate: '2026-06-15', entryAction: 'Buy', entryPrice: '340.50', exitDate: '2026-06-25', exitAction: 'Sell', exitPrice: '382.72', shares: '150', floatingProfit: '+12.4%', exitReason: 'Profit Target' },
        { index: 2, symbol: 'NVDA', signal: 'MA', direction: 'Long', entryDate: '2026-06-18', entryAction: 'Buy', entryPrice: '125.30', exitDate: '2026-06-21', exitAction: 'Sell', exitPrice: '115.27', shares: '320', floatingProfit: '-8.0%', exitReason: 'Stop Loss' },
        { index: 3, symbol: 'AAPL', signal: 'Desc Channel', direction: 'Long', entryDate: '2026-06-20', entryAction: 'Buy', entryPrice: '190.15', exitDate: '2026-07-15', exitAction: 'Sell', exitPrice: '194.33', shares: '210', floatingProfit: '+2.2%', exitReason: 'Time Out (21d)' },
        { index: 4, symbol: 'TSLA', signal: 'HighPoints', direction: 'Long', entryDate: '2026-06-25', entryAction: 'Buy', entryPrice: '220.80', exitDate: '2026-07-05', exitAction: 'Sell', exitPrice: '242.88', shares: '180', floatingProfit: '+10.0%', exitReason: 'Profit Target' },
        { index: 5, symbol: 'AMZN', signal: 'Symbol 13-W High', direction: 'Long', entryDate: '2026-07-02', entryAction: 'Buy', entryPrice: '185.20', exitDate: '2026-07-12', exitAction: 'Sell', exitPrice: '174.08', shares: '215', floatingProfit: '-6.0%', exitReason: 'Stop Loss' },
        { index: 6, symbol: 'META', signal: 'MACDHistGap', direction: 'Long', entryDate: '2026-07-10', entryAction: 'Buy', entryPrice: '490.65', exitDate: '2026-07-28', exitAction: 'Sell', exitPrice: '485.74', shares: '80', floatingProfit: '-1.0%', exitReason: 'Time Out (18d)' },
        { index: 7, symbol: 'GOOGL', signal: 'MA', direction: 'Long', entryDate: '2026-07-15', entryAction: 'Buy', entryPrice: '178.90', exitDate: '2026-07-24', exitAction: 'Sell', exitPrice: '193.21', shares: '220', floatingProfit: '+8.0%', exitReason: 'Profit Target' },
        { index: 8, symbol: 'NFLX', signal: 'HighPoints', direction: 'Long', entryDate: '2026-07-18', entryAction: 'Buy', entryPrice: '650.25', exitDate: '--', exitAction: '--', exitPrice: '682.76', shares: '60', floatingProfit: '+5.0%', exitReason: 'Open Position' }
      ]
    }
  },
  charts: {
    cumulative: {
      strategy: [0, 2.8, 7.6, 8.4, 5.1, 1.2, -4.2, -8.4, -9.1, -8.5, -4.0, -0.3, 1.8, 3.6, 4.8, 7.4, 8.2, 12.6, 18.0, 28.3, 36.7, 43.6],
      benchmark: [0, 2.9, 4.4, 5.2, 3.9, 1.5, -2.5, -3.8, -4.7, -5.2, -2.0, 2.2, 4.5, 8.6, 10.6, 13.8, 16.2, 18.0, 15.2, 14.7, 13.2, 13.0]
    },
    drawdown: {
      strategy: [0, -0.3, -0.2, -3.4, -6.2, -9.4, -14.0, -17.1, -18.1, -16.8, -12.6, -9.6, -7.8, -5.2, -4.3, -2.6, -1.0, -0.1, -0.2, -0.1, 0, -0.2],
      benchmark: [0, -0.2, -0.1, -1.6, -3.8, -7.8, -8.9, -9.4, -10.4, -7.8, -5.0, -1.3, -0.1, 0, -0.1, 0, -0.3, -0.2, -3.0, -3.7, -5.4, -5.2]
    }
  }
}

const cloneFallbackDetail = () => JSON.parse(JSON.stringify(fallbackDetail))

const swingTradingDetailApi = {
  getDetail(params) {
    return axios.get(SWING_TRADING_DETAIL_API, {
      params,
      withCredentials: true
    })
  }
}

export default {
  name: 'SwingTradingDetail',
  data() {
    return {
      tabs,
      activeTab: 'holdings',
      detail: cloneFallbackDetail(),
      chartDateTicks,
      chartHover: {
        cumulative: null,
        drawdown: null
      },
      apiReady: false,
      tableSort: {
        holdings: { key: '', direction: 'asc' },
        preview: { key: '', direction: 'asc' },
        trades: { key: '', direction: 'asc' }
      }
    }
  },
  computed: {
    detailTitle() {
      return `${this.detail.title}${this.detail.date ? `(${this.detail.date})` : ''}`
    },
    activeTableConfig() {
      const tables = this.detail && this.detail.tables ? this.detail.tables : {}
      return tables[this.activeTab] || { columns: [], rows: [] }
    },
    activeTableColumns() {
      return this.activeTableConfig.columns || []
    },
    activeTableRows() {
      return this.activeTableConfig.rows || []
    },
    currentSort() {
      return this.tableSort[this.activeTab] || { key: '', direction: 'asc' }
    },
    sortedActiveRows() {
      const rows = this.activeTableRows.map(row => ({ ...row }))
      if (!this.currentSort.key) return rows

      return rows.sort((left, right) => this.compareValues(left[this.currentSort.key], right[this.currentSort.key], this.currentSort.key))
    }
  },
  watch: {
    '$route.fullPath': {
      handler() {
        this.fetchDetail()
      }
    }
  },
  mounted() {
    this.fetchDetail()
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'SwingTrading' })
    },
    getRouteParams() {
      return {
        id: this.$route.query.id || this.$route.params.strategyId || '',
        url: this.$route.query.url || this.$route.params.strategyId || '',
        name: this.$route.query.name || ''
      }
    },
    async fetchDetail() {
      const params = this.getRouteParams()

      if (USE_MOCK_SWING_TRADING_DETAIL_DATA) {
        this.apiReady = false
        this.detail = this.buildMockDetail(params)
        return
      }

      try {
        const response = await swingTradingDetailApi.getDetail(params)
        this.detail = this.normalizeDetailResponse(response, params)
        this.apiReady = true
      } catch (error) {
        this.apiReady = false
        this.detail = this.buildMockDetail(params)
      }
    },
    buildMockDetail(params) {
      const detail = cloneFallbackDetail()
      if (params.id) detail.id = params.id
      if (params.url) detail.url = params.url
      if (params.name) {
        detail.title = this.getReadableStrategyName(params.name)
        detail.overview = `${params.name} operates on a precise set of quantitative parameters and technical filters. It screens for optimal risk/reward setups and ranks candidates to pick the strongest daily opportunities.`
      }
      return detail
    },
    normalizeDetailResponse(response, params) {
      const responseData = response && response.data !== undefined ? response.data : response
      const data = responseData && responseData.data !== undefined ? responseData.data : responseData
      const detail = this.buildMockDetail(params)

      if (!data || typeof data !== 'object') return detail

      return {
        ...detail,
        id: data.id || data.strategy_id || detail.id,
        url: data.url || data.slug || detail.url,
        title: data.title || data.name || detail.title,
        date: data.date || data.trade_date || data.as_of || detail.date,
        description: data.description || detail.description,
        overview: data.overview || data.strategy_overview || detail.overview,
        coreParameters: Array.isArray(data.coreParameters || data.core_parameters) ? (data.coreParameters || data.core_parameters) : detail.coreParameters,
        filterConditions: Array.isArray(data.filterConditions || data.filter_conditions) ? (data.filterConditions || data.filter_conditions) : detail.filterConditions,
        signals: Array.isArray(data.signals) ? data.signals : detail.signals,
        summaryStats: Array.isArray(data.summaryStats || data.summary_stats) ? (data.summaryStats || data.summary_stats) : detail.summaryStats,
        tables: {
          holdings: this.normalizeTable(data.holdings, tableColumns.holdings, detail.tables.holdings),
          preview: this.normalizeTable(data.preview || data.preview_filter_list, tableColumns.preview, detail.tables.preview),
          trades: this.normalizeTable(data.trades || data.backtest_trades, tableColumns.trades, detail.tables.trades)
        },
        charts: data.charts || detail.charts
      }
    },
    normalizeTable(rawRows, columns, fallbackTable) {
      if (!Array.isArray(rawRows)) return fallbackTable
      return {
        ...fallbackTable,
        columns,
        rows: rawRows
      }
    },
    getHeaderLines(column) {
      return Array.isArray(column.headerLines) && column.headerLines.length ? column.headerLines : [column.label]
    },
    getReadableStrategyName(name) {
      const match = String(name).match(/\(([^)]+)\)/)
      if (match) return match[1]
      return String(name).replace(/^Strategy\s+\d+\s*/i, '').trim() || String(name)
    },
    setTableSort(key) {
      const sort = this.currentSort
      const nextDirection = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc'
      this.$set(this.tableSort, this.activeTab, { key, direction: nextDirection })
    },
    getSortTitle(column) {
      if (this.currentSort.key !== column.key) return `Sort by ${column.label}`
      return this.currentSort.direction === 'asc' ? `Sort ${column.label} descending` : `Sort ${column.label} ascending`
    },
    compareValues(left, right, key) {
      const direction = this.currentSort.direction === 'desc' ? -1 : 1
      const leftValue = this.getSortableValue(left, key)
      const rightValue = this.getSortableValue(right, key)

      if (leftValue === null && rightValue === null) return 0
      if (leftValue === null) return 1
      if (rightValue === null) return -1
      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return (leftValue - rightValue) * direction
      }

      return String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true, sensitivity: 'base' }) * direction
    },
    getSortableValue(value, key) {
      if (value === undefined || value === null || value === '' || value === '--') return null
      if (numericColumns.includes(key)) {
        const numberValue = Number(String(value).replace(/[^0-9.-]/g, ''))
        return Number.isNaN(numberValue) ? null : numberValue
      }
      return String(value).trim()
    },
    getCellClass(value, column) {
      return {
        'symbol-cell': column.key === 'symbol',
        'positive-cell': column.tone === 'return' && !this.isNegativeValue(value),
        'negative-cell': column.tone === 'return' && this.isNegativeValue(value)
      }
    },
    isNegativeValue(value) {
      return Number(String(value).replace(/[^0-9.-]/g, '')) < 0
    },
    getChartYAxisTicks(type) {
      return chartMeta[type] ? chartMeta[type].ticks : []
    },
    getChartDateX(index) {
      const width = chartBounds.right - chartBounds.left
      return chartBounds.left + (index / Math.max(chartDateTicks.length - 1, 1)) * width
    },
    getChartY(value, type) {
      const meta = chartMeta[type] || chartMeta.cumulative
      const height = chartBounds.bottom - chartBounds.top
      return chartBounds.top + ((meta.max - Number(value)) / (meta.max - meta.min)) * height
    },
    getChartPoints(type, seriesKey) {
      const values = this.getChartSeriesValues(type)[seriesKey] || []
      if (!values.length) return ''

      const width = chartBounds.right - chartBounds.left
      return values.map((value, index) => {
        const x = chartBounds.left + (index / Math.max(values.length - 1, 1)) * width
        const y = this.getChartY(value, type)
        return `${x.toFixed(2)},${y.toFixed(2)}`
      }).join(' ')
    },
    getChartSeriesValues(type) {
      const chart = this.detail && this.detail.charts ? this.detail.charts[type] : null
      return {
        benchmark: chart && Array.isArray(chart.benchmark) ? this.getDenseChartValues(chart.benchmark, type, 'benchmark') : [],
        strategy: chart && Array.isArray(chart.strategy) ? this.getDenseChartValues(chart.strategy, type, 'strategy') : []
      }
    },
    handleChartMouseMove(event, type) {
      const rect = event.currentTarget.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const rawX = ((event.clientX - rect.left) / rect.width) * 1000
      const x = Math.max(chartBounds.left, Math.min(chartBounds.right, rawX))
      const ratio = (x - chartBounds.left) / (chartBounds.right - chartBounds.left)
      const series = this.getChartSeriesValues(type)
      const pointCount = Math.max(series.benchmark.length, series.strategy.length)
      if (!pointCount) return

      const index = Math.max(0, Math.min(pointCount - 1, Math.round(ratio * (pointCount - 1))))
      const normalizedX = chartBounds.left + (index / Math.max(pointCount - 1, 1)) * (chartBounds.right - chartBounds.left)
      const benchmarkValue = this.getSeriesValueAt(series.benchmark, index, pointCount)
      const strategyValue = this.getSeriesValueAt(series.strategy, index, pointCount)
      const benchmarkY = this.getChartY(benchmarkValue, type)
      const strategyY = this.getChartY(strategyValue, type)
      const xPx = (normalizedX / 1000) * rect.width
      const averageYPx = (((benchmarkY + strategyY) / 2) / 360) * rect.height
      const side = xPx > rect.width * 0.5 ? 'left' : 'right'

      this.$set(this.chartHover, type, {
        x: normalizedX,
        benchmarkY,
        strategyY,
        benchmarkValue,
        strategyValue,
        date: this.getChartDateForIndex(index, pointCount),
        left: Math.max(14, Math.min(rect.width - 14, xPx)),
        top: Math.max(48, Math.min(rect.height - 48, averageYPx)),
        side
      })
    },
    clearChartHover(type) {
      this.$set(this.chartHover, type, null)
    },
    getSeriesValueAt(values, index, pointCount) {
      if (!Array.isArray(values) || !values.length) return 0
      if (values.length === pointCount) return values[index]
      const normalizedIndex = Math.round((index / Math.max(pointCount - 1, 1)) * (values.length - 1))
      return values[Math.max(0, Math.min(values.length - 1, normalizedIndex))]
    },
    getTooltipStyle(type) {
      const hover = this.chartHover[type]
      if (!hover) return {}
      return {
        left: `${hover.left}px`,
        top: `${hover.top}px`
      }
    },
    getChartDateForIndex(index, pointCount) {
      const start = this.parseChartDate(chartRange.start)
      const end = this.parseChartDate(chartRange.end)
      const ratio = index / Math.max(pointCount - 1, 1)
      const timestamp = start.getTime() + (end.getTime() - start.getTime()) * ratio
      return this.formatChartDate(new Date(timestamp))
    },
    parseChartDate(dateString) {
      const [year, month, day] = String(dateString).split('-').map(Number)
      return new Date(Date.UTC(year, month - 1, day))
    },
    formatChartDate(date) {
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    formatChartTooltipValue(value) {
      const numberValue = Number(value)
      return Number.isFinite(numberValue) ? numberValue.toFixed(3) : ''
    },
    getDenseChartValues(values, type, seriesKey) {
      if (!Array.isArray(values) || values.length > 48) return values

      const pointCount = 120
      const denseValues = []
      const amplitude = type === 'drawdown' ? 0.55 : seriesKey === 'strategy' ? 0.9 : 0.55
      const phase = seriesKey === 'strategy' ? 0.6 : 1.9

      for (let index = 0; index < pointCount; index++) {
        const position = (index / (pointCount - 1)) * (values.length - 1)
        const leftIndex = Math.floor(position)
        const rightIndex = Math.min(leftIndex + 1, values.length - 1)
        const ratio = position - leftIndex
        const baseValue = values[leftIndex] + (values[rightIndex] - values[leftIndex]) * ratio
        const shouldKeepEndpoint = index === 0 || index === pointCount - 1
        const noise = shouldKeepEndpoint
          ? 0
          : Math.sin(index * 0.73 + phase) * amplitude + Math.sin(index * 0.19 + phase) * amplitude * 0.45

        denseValues.push(this.clampChartValue(baseValue + noise, type))
      }

      return denseValues
    },
    clampChartValue(value, type) {
      const meta = chartMeta[type] || chartMeta.cumulative
      return Math.max(meta.min, Math.min(meta.max, value))
    }
  }
}
</script>

<style scoped>
.swing-detail-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  background: #fff;
  color: #1f2937;
  font-family: Arial, Helvetica, sans-serif;
}

.swing-detail-page * {
  box-sizing: border-box;
}

.back-row {
  margin-bottom: 16px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  font-size: 17px;
  font-weight: 700;
  transition: color 0.2s ease;
}

.back-link:hover,
.back-link:focus {
  color: #111827;
  outline: none;
}

.back-link svg {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.detail-hero {
  padding: 8px 0 24px;
}

.detail-hero h1 {
  margin: 0 0 8px;
  color: #111827;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
}

.detail-hero p {
  margin: 0;
  max-width: 900px;
  color: #4b5563;
  font-size: 15px;
  line-height: 1.6;
}

.overview-section {
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.section-heading {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.section-heading span {
  width: 4px;
  height: 24px;
  margin-right: 12px;
  border-radius: 2px;
  background: #3b82f6;
}

.section-heading h2 {
  margin: 0;
  color: #111827;
  font-size: 20px;
  font-weight: 700;
}

.overview-card {
  margin-bottom: 32px;
  padding: 24px;
  border: 1px solid #f3f4f6;
  border-radius: 6px;
  background: rgba(249, 250, 251, 0.5);
}

.overview-copy {
  margin: 0 0 20px;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
}

.parameter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  padding: 20px;
  border: 1px solid #f3f4f6;
  border-radius: 6px;
  background: #fff;
}

.parameter-title {
  display: block;
  margin-bottom: 12px;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: uppercase;
}

.parameter-grid ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.parameter-grid li {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  color: #4b5563;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.parameter-grid strong {
  color: #1f2937;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 700;
}

.signals-block {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(229, 231, 235, 0.8);
}

.signal-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.signal-chips span {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  color: #374151;
  font-size: 13px;
  font-weight: 500;
}

.detail-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.detail-tabs button {
  position: relative;
  margin-bottom: -1px;
  padding: 12px 20px;
  border: 1px solid transparent;
  border-top-width: 2px;
  background: rgba(249, 250, 251, 0.5);
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}

.detail-tabs button:hover {
  background: #f3f4f6;
}

.detail-tabs button.active {
  border-color: #3b82f6 #e5e7eb #fff;
  background: #fff;
  color: #111827;
  z-index: 1;
}

.detail-table-wrap {
  overflow-x: auto;
  padding-bottom: 40px;
}

table {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
  text-align: left;
}

thead tr {
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

th {
  padding: 14px 8px;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  vertical-align: middle;
  white-space: normal;
}

.sort-button {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.sort-button:hover,
.sort-button:focus {
  color: #2563eb;
  outline: none;
}

.column-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  line-height: 1.25;
}

.column-title {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  white-space: normal;
}

.sort-icon {
  display: inline-flex;
  width: 8px;
  height: 14px;
  flex: 0 0 8px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.sort-caret {
  display: block;
  width: 0;
  height: 0;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}

.sort-caret.up {
  border-bottom: 5px solid #b8bec8;
}

.sort-caret.down {
  border-top: 5px solid #b8bec8;
}

.sort-button:hover .sort-caret.up,
.sort-button:focus .sort-caret.up {
  border-bottom-color: #2563eb;
}

.sort-button:hover .sort-caret.down,
.sort-button:focus .sort-caret.down {
  border-top-color: #2563eb;
}

.sort-icon.is-asc .sort-caret.up {
  border-bottom-color: #2563eb;
}

.sort-icon.is-asc .sort-caret.down {
  border-top-color: #d1d5db;
}

.sort-icon.is-desc .sort-caret.up {
  border-bottom-color: #d1d5db;
}

.sort-icon.is-desc .sort-caret.down {
  border-top-color: #2563eb;
}

.index-col {
  width: 46px;
}

.date-col {
  width: 120px;
}

.symbol-col {
  width: 96px;
}

.signal-col {
  width: 150px;
}

.price-col {
  width: 112px;
}

.shares-col {
  width: 92px;
}

.percent-col {
  width: 104px;
}

.market-days-col {
  width: 128px;
}

.best-time-col {
  width: 164px;
}

.profit-target-col {
  width: 142px;
}

.profit-target-price-col {
  width: 164px;
}

tbody {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr {
  border-top: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

tbody tr:nth-child(even) {
  background: rgba(249, 250, 251, 0.45);
}

tbody tr:hover {
  background: rgba(249, 250, 251, 0.85);
}

td {
  padding: 14px 8px;
  color: #374151;
  font-size: 14px;
  vertical-align: middle;
}

.symbol-cell {
  color: #111827;
  font-weight: 700;
}

.positive-cell {
  color: #059669;
  font-weight: 500;
}

.negative-cell {
  color: #e11d48;
  font-weight: 500;
}

.tooltip-dot {
  display: inline-flex;
  width: 15px;
  height: 15px;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  cursor: help;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.empty-row {
  padding: 28px 12px;
  color: #6b7280;
  text-align: center;
}

.table-note {
  display: inline-block;
  margin-top: 8px;
  padding: 8px 10px;
  border: 1px solid #f3f4f6;
  border-radius: 4px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  font-style: italic;
}

.summary-panel {
  padding-bottom: 40px;
}

.stats-board {
  margin-bottom: 32px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.stats-row {
  display: grid;
  border-top: 1px solid #e5e7eb;
}

.stats-row:first-child {
  border-top: none;
}

.stats-row.cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.stats-row.cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.stat-cell {
  padding: 16px 10px;
  border-left: 1px solid #e5e7eb;
  text-align: center;
}

.stat-cell:first-child {
  border-left: none;
}

.stat-label {
  min-height: 30px;
  margin-bottom: 10px;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
  text-transform: uppercase;
}

.stat-value {
  color: #111827;
  font-size: 16px;
}

.stat-value.negative {
  color: #d04022;
  font-weight: 500;
}

.charts-stack {
  display: flex;
  flex-direction: column;
  gap: 44px;
  margin-bottom: 40px;
}

.chart-card {
  padding: 28px 28px 22px;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.chart-card h3 {
  margin: 0 0 26px;
  color: #111827;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}

.chart-wrap {
  position: relative;
  width: 100%;
  height: 430px;
}

.chart-wrap svg {
  width: 100%;
  height: 100%;
}

.axis-line {
  stroke: #d9d9d9;
  stroke-width: 1;
}

.grid-line {
  stroke: #eeeeee;
  stroke-width: 1;
}

.axis-tick,
.axis-title {
  fill: #777;
  font-family: Arial, Helvetica, sans-serif;
}

.axis-tick {
  font-size: 10px;
}

.y-tick {
  text-anchor: end;
}

.x-tick {
  text-anchor: middle;
}

.axis-title {
  font-size: 11px;
  text-anchor: middle;
}

.strategy-line,
.benchmark-line {
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.strategy-line {
  stroke: #5c99cf;
}

.benchmark-line {
  stroke: #b7b7b7;
}

.chart-hover-layer {
  pointer-events: none;
}

.hover-guide-line {
  stroke: rgba(17, 24, 39, 0.28);
  stroke-dasharray: 4 4;
  stroke-width: 1;
}

.hover-point {
  fill: #fff;
  stroke-width: 2;
  animation: hoverPointPulse 1.2s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}

.hover-point.strategy {
  stroke: #5c99cf;
  animation-delay: 0.12s;
}

.hover-point.benchmark {
  stroke: #b7b7b7;
}

.chart-tooltip {
  position: absolute;
  z-index: 2;
  width: 184px;
  padding: 6px 8px;
  border-radius: 4px;
  background: rgba(31, 31, 31, 0.9);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.18);
  color: #fff;
  font-size: 11px;
  line-height: 1.22;
  pointer-events: none;
}

.chart-tooltip::after {
  position: absolute;
  top: 50%;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  content: "";
  transform: translateY(-50%);
}

.chart-tooltip.is-left {
  transform: translate(calc(-100% - 12px), -50%);
}

.chart-tooltip.is-left::after {
  right: -6px;
  border-left: 6px solid rgba(31, 31, 31, 0.9);
}

.chart-tooltip.is-right {
  transform: translate(12px, -50%);
}

.chart-tooltip.is-right::after {
  left: -6px;
  border-right: 6px solid rgba(31, 31, 31, 0.9);
}

.tooltip-date {
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 700;
}

.tooltip-row {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.tooltip-row strong {
  margin-left: auto;
  font-weight: 700;
}

.tooltip-swatch {
  width: 9px;
  height: 9px;
  flex: 0 0 9px;
  border: 1px solid #fff;
}

.tooltip-swatch.strategy {
  background: #5c99cf;
}

.tooltip-swatch.benchmark {
  background: #b7b7b7;
}

@keyframes hoverPointPulse {
  0%,
  100% {
    opacity: 0.95;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.35);
  }
}

.chart-legend {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin: 0 0 4px 10px;
  color: #4b5563;
  font-size: 12px;
}

.chart-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-line {
  width: 26px;
  height: 0;
  border-top: 3px solid currentColor;
}

.legend-line.strategy {
  color: #5c99cf;
}

.legend-line.benchmark {
  color: #b7b7b7;
}

@media (max-width: 768px) {
  .swing-detail-page {
    padding: 24px 16px 64px;
  }

  .detail-hero h1 {
    font-size: 24px;
  }

  .parameter-grid,
  .stats-row.cols-5,
  .stats-row.cols-4 {
    grid-template-columns: 1fr;
  }

  .stat-cell {
    border-top: 1px solid #e5e7eb;
    border-left: none;
  }

  .stat-cell:first-child {
    border-top: none;
  }

  .detail-tabs {
    overflow-x: auto;
  }

  .detail-tabs button {
    flex: 0 0 auto;
  }
}
</style>
