<template>
  <main class="swing-page">
    <section class="process-section">
      <button class="process-toggle" type="button" @click="processExpanded = !processExpanded">
        <h1>Strategies (click to expand) {{ dashboardDate }}</h1>
        <svg
          class="chevron-icon"
          :class="{ 'is-expanded': processExpanded }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div v-show="processExpanded" class="process-content">
        <p class="intro-copy">
          This page provides a highlight of our Swing Strategies. These strategies are based on multiple technical trading models, each with its own pros/cons. Some models have larger returns, while others have smaller drawdowns. Some models perform better in trending markets, while others perform better in choppy markets. These models were created to account for individual preferences, risk tolerance, etc. Ultimately, the model that you want to use is up to you.
        </p>

        <div class="process-details">
          <h3>Swing Daily Trading Process</h3>
          <div class="process-grid">
            <div class="process-column">
              <div class="process-step">
                <span class="step-number">1</span>
                <h4>Fetch Daily Signals</h4>
                <p>After market close, fetch all triggered signals from the Swing system for that trading day.</p>
              </div>

              <div class="process-step">
                <span class="step-number">2</span>
                <h4>Filter Signals</h4>
                <p>Apply PT/SL/TIM filter conditions to the fetched signals:</p>
                <ul class="plain-list">
                  <li>8% &le; Profit Target (PT) &le; 20%</li>
                  <li>6% &le; Stop Loss (SL) &le; 16%</li>
                  <li>5 &le; Time in Market (TIM) &le; 21 days</li>
                </ul>
              </div>

              <div class="process-step">
                <span class="step-number">3</span>
                <h4>Deduplication & Screening</h4>
                <ul class="plain-list">
                  <li>Keep only the highest StdDev signal per stock.</li>
                  <li>Retain only technical signals defined by the strategy.</li>
                  <li>Sort descending by StdDev and select Top 3 stocks.</li>
                </ul>
              </div>
            </div>

            <div class="process-column">
              <div class="process-step">
                <span class="step-number">4</span>
                <h4>Calculate Position Sizing</h4>
                <div class="formula-box">
                  <div><span>Allocation</span> = Avail Cash &times; 0.66 &times; (WinRate Weight)</div>
                  <div><span>Shares</span> = Allocation // Daily Close Price</div>
                </div>
              </div>

              <div class="process-step">
                <span class="step-number">5</span>
                <h4>Execute Orders</h4>
                <p>Buy at the opening price on the next trading day.</p>
              </div>

              <div class="process-step">
                <span class="step-number">6</span>
                <h4>Position Management</h4>
                <ul class="status-list">
                  <li><span class="status-dot profit"></span><span><strong>Hits High:</strong> Exit at Profit Target (PT)</span></li>
                  <li><span class="status-dot loss"></span><span><strong>Hits Low:</strong> Exit at Stop Loss (SL)</span></li>
                  <li><span class="status-dot timeout"></span><span><strong>Hits Max Days:</strong> Exit on Timeout (TIM)</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="process-note">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <p>Note: Users can further customize parameters such as StdDev, the Top 3 selection limit, and the 0.66 allocation multiplier according to their own strategic ideas.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="table-section">
      <table>
        <thead>
          <tr>
            <th v-for="column in tableColumns" :key="column.key" :class="column.className">
              <button class="sort-button" type="button" :title="getSortTitle(column)" @click="setSort(column.key)">
                <span class="column-label">
                  {{ column.label }}
                  <span
                    class="sort-icon"
                    :class="{
                      'is-asc': sortKey === column.key && sortDirection === 'asc',
                      'is-desc': sortKey === column.key && sortDirection === 'desc'
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
          <tr v-if="!sortedStrategies.length">
            <td colspan="9" class="empty-row">No Data</td>
          </tr>
          <template v-for="strategy in sortedStrategies">
            <tr
              v-for="(stock, stockIndex) in getVisibleStocks(strategy)"
              :key="`${strategy.id}-${stock.symbol}-${stockIndex}`"
              class="strategy-row"
            >
              <td
                v-if="stockIndex === 0"
                class="model-cell"
                :class="{ 'align-top': isStrategyExpanded(strategy) }"
                :rowspan="getStrategyRowspan(strategy)"
              >
                <div :id="`strategy-${getStrategyAnchor(strategy)}`" class="model-wrap">
                  <button
                    class="strategy-toggle"
                    type="button"
                    title="Expand/Collapse stocks"
                    @click="toggleStrategy(strategy)"
                  >
                    <svg
                      class="chevron-icon small"
                      :class="{ 'is-collapsed': !isStrategyExpanded(strategy) }"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div>
                    <router-link :to="getStrategyDetailRoute(strategy)" class="strategy-name">
                      {{ strategy.name }}
                    </router-link>
                    <div v-if="!isStrategyExpanded(strategy) && strategy.stocks.length > 1" class="more-row">
                      <button type="button" @click="toggleStrategy(strategy)">+ {{ strategy.stocks.length - 1 }} more symbols</button>
                    </div>
                  </div>
                </div>
              </td>
              <td class="symbol-cell">{{ stock.symbol }}</td>
              <td>{{ stock.signal }}</td>
              <td>{{ stock.price }}</td>
              <td>{{ stock.shares }}</td>
              <td>{{ stock.amount }}</td>
              <td>{{ stock.sl }}</td>
              <td>{{ stock.pt }}</td>
              <td>{{ stock.tim }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script>
import axios from '@/axios'

const SWING_TRADING_API = '/dev/st_data/swing_trading'
// Turn this off when the Swing Trading backend endpoint is ready.
const USE_MOCK_SWING_TRADING_DATA = true

const NUMERIC_SORT_KEYS = ['price', 'shares', 'amount', 'sl', 'pt', 'tim']

const tableColumns = [
  { key: 'name', label: 'Model Name', className: 'model-col' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'signal', label: 'Signal' },
  { key: 'price', label: 'Close' },
  { key: 'shares', label: 'Shares' },
  { key: 'amount', label: 'Amount' },
  { key: 'sl', label: 'Stop Loss(%)' },
  { key: 'pt', label: 'Profit Target(%)' },
  { key: 'tim', label: 'Best Time In Market(Bars)' }
]

const fallbackStrategies = [
  {
    id: 'Strategy 1',
    name: 'Strategy 1 (Champion)',
    stocks: [
      { symbol: 'CENX', signal: 'MAGap', price: '$46.36', shares: '1,905', amount: '$88,316', sl: '12.0%', pt: '8.0%', tim: '20' },
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '307', amount: '$88,137', sl: '12.0%', pt: '8.0%', tim: '20' },
      { symbol: 'AEIS', signal: 'MACDHist', price: '$315.14', shares: '263', amount: '$82,882', sl: '12.0%', pt: '8.0%', tim: '20' }
    ]
  },
  {
    id: 'Strategy 2',
    name: 'Strategy 2 (Rounding Btm + 13W High)',
    stocks: [
      { symbol: 'CENX', signal: 'Rounding Btm', price: '$46.36', shares: '1,850', amount: '$85,766', sl: '8.0%', pt: '8.0%', tim: '21' },
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '295', amount: '$84,691', sl: '8.0%', pt: '8.0%', tim: '21' },
      { symbol: 'AEIS', signal: 'MACDHist', price: '$315.14', shares: '250', amount: '$78,785', sl: '8.0%', pt: '8.0%', tim: '21' }
    ]
  },
  {
    id: 'Strategy 3',
    name: 'Strategy 3 (Rounding Btm + HighPts)',
    stocks: [
      { symbol: 'CENX', signal: 'Rounding Btm', price: '$46.36', shares: '1,600', amount: '$74,176', sl: '11.0%', pt: '8.0%', tim: '20' },
      { symbol: 'HII', signal: 'HighPoints', price: '$287.09', shares: '250', amount: '$71,772', sl: '11.0%', pt: '8.0%', tim: '20' },
      { symbol: 'AEIS', signal: 'MACDHist', price: '$315.14', shares: '210', amount: '$66,179', sl: '11.0%', pt: '8.0%', tim: '20' }
    ]
  },
  {
    id: 'Strategy 4',
    name: 'Strategy 4 (4W High Replace MAGap)',
    stocks: [
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '189', amount: '$54,260', sl: '9.0%', pt: '8.0%', tim: '21' },
      { symbol: 'AEIS', signal: 'MACDHist', price: '$315.14', shares: '162', amount: '$51,053', sl: '9.0%', pt: '8.0%', tim: '21' },
      { symbol: 'UAL', signal: 'Desc Channel', price: '$115.34', shares: '500', amount: '$57,670', sl: '9.0%', pt: '8.0%', tim: '21' }
    ]
  },
  {
    id: 'Strategy 5',
    name: 'Strategy 5 (7 Signals inc 4W High)',
    stocks: [
      { symbol: 'CENX', signal: 'MAGap', price: '$46.36', shares: '1,750', amount: '$81,130', sl: '8.0%', pt: '8.0%', tim: '17' },
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '280', amount: '$80,385', sl: '8.0%', pt: '8.0%', tim: '17' },
      { symbol: 'AEIS', signal: 'MACDHist', price: '$315.14', shares: '240', amount: '$75,633', sl: '8.0%', pt: '8.0%', tim: '17' }
    ]
  },
  {
    id: 'Strategy 6',
    name: 'Strategy 6 (Hammer + No MACD)',
    stocks: [
      { symbol: 'CENX', signal: 'MAGap', price: '$46.36', shares: '1,500', amount: '$69,540', sl: '9.0%', pt: '8.0%', tim: '16' },
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '220', amount: '$63,159', sl: '9.0%', pt: '8.0%', tim: '16' },
      { symbol: 'UAL', signal: 'Desc Channel', price: '$115.34', shares: '450', amount: '$51,903', sl: '9.0%', pt: '8.0%', tim: '16' }
    ]
  },
  {
    id: 'Strategy 7',
    name: 'Strategy 7 (Rounding Btm + 13W High v2)',
    stocks: [
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '255', amount: '$73,207', sl: '8.0%', pt: '8.0%', tim: '21' },
      { symbol: 'AEIS', signal: 'MACDHist', price: '$315.14', shares: '225', amount: '$70,906', sl: '8.0%', pt: '8.0%', tim: '21' },
      { symbol: 'UAL', signal: 'Desc Channel', price: '$115.34', shares: '480', amount: '$55,363', sl: '8.0%', pt: '8.0%', tim: '21' }
    ]
  },
  {
    id: 'Strategy 8',
    name: 'Strategy 8 (Rounding Btm + MAGap)',
    stocks: [
      { symbol: 'CENX', signal: 'MAGap', price: '$46.36', shares: '1,650', amount: '$76,494', sl: '8.0%', pt: '8.0%', tim: '21' },
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '240', amount: '$68,901', sl: '8.0%', pt: '8.0%', tim: '21' },
      { symbol: 'UAL', signal: 'Desc Channel', price: '$115.34', shares: '420', amount: '$48,442', sl: '8.0%', pt: '8.0%', tim: '21' }
    ]
  },
  {
    id: 'Strategy 9',
    name: 'Strategy 9 (Hammer + 7 Signals)',
    stocks: [
      { symbol: 'CENX', signal: 'MAGap', price: '$46.36', shares: '1,800', amount: '$83,448', sl: '12.0%', pt: '8.0%', tim: '9' },
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '290', amount: '$83,256', sl: '12.0%', pt: '8.0%', tim: '9' },
      { symbol: 'AEIS', signal: 'MACDHist', price: '$315.14', shares: '255', amount: '$80,360', sl: '12.0%', pt: '8.0%', tim: '9' }
    ]
  },
  {
    id: 'Strategy 10',
    name: 'Strategy 10 (Rounding Btm + 7 Signals)',
    stocks: [
      { symbol: 'CENX', signal: 'MAGap', price: '$46.36', shares: '1,820', amount: '$84,375', sl: '6.0%', pt: '8.0%', tim: '28' },
      { symbol: 'HII', signal: 'MA', price: '$287.09', shares: '285', amount: '$81,820', sl: '6.0%', pt: '8.0%', tim: '28' },
      { symbol: 'AEIS', signal: 'MACDHist', price: '$315.14', shares: '245', amount: '$77,209', sl: '6.0%', pt: '8.0%', tim: '28' }
    ]
  }
]

const cloneFallbackStrategies = () => JSON.parse(JSON.stringify(fallbackStrategies))

const swingTradingApi = {
  getDashboard() {
    return axios.get(SWING_TRADING_API, {
      withCredentials: true
    })
  }
}

export default {
  name: 'SwingTrading',
  data() {
    return {
      processExpanded: true,
      expandedStrategyId: 'Strategy 1',
      dashboardDate: '2026-08-05',
      tableColumns,
      sortKey: '',
      sortDirection: 'asc',
      strategies: cloneFallbackStrategies(),
      apiReady: false
    }
  },
  computed: {
    sortedStrategies() {
      const strategies = this.strategies.map(strategy => ({
        ...strategy,
        stocks: Array.isArray(strategy.stocks) ? [...strategy.stocks] : []
      }))

      if (!this.sortKey) return strategies

      if (this.sortKey === 'name') {
        return strategies.sort((left, right) => this.compareSortValues(left.name, right.name, this.sortKey))
      }

      return strategies
        .map(strategy => ({
          ...strategy,
          stocks: strategy.stocks.sort((left, right) => this.compareSortValues(left[this.sortKey], right[this.sortKey], this.sortKey))
        }))
        .sort((left, right) => {
          const leftStock = left.stocks[0] || {}
          const rightStock = right.stocks[0] || {}
          return this.compareSortValues(leftStock[this.sortKey], rightStock[this.sortKey], this.sortKey)
        })
    }
  },
  mounted() {
    this.fetchSwingTradingData()
  },
  methods: {
    setSort(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
        return
      }

      this.sortKey = key
      this.sortDirection = 'asc'
    },
    getSortTitle(column) {
      if (this.sortKey !== column.key) return `Sort by ${column.label}`
      return this.sortDirection === 'asc' ? `Sort ${column.label} descending` : `Sort ${column.label} ascending`
    },
    compareSortValues(left, right, key) {
      const direction = this.sortDirection === 'desc' ? -1 : 1
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
      if (value === undefined || value === null || value === '') return null
      if (NUMERIC_SORT_KEYS.includes(key)) {
        const numberValue = Number(String(value).replace(/[^0-9.-]/g, ''))
        return Number.isNaN(numberValue) ? null : numberValue
      }

      return String(value).trim()
    },
    async fetchSwingTradingData() {
      if (USE_MOCK_SWING_TRADING_DATA) {
        this.apiReady = false
        this.strategies = cloneFallbackStrategies()
        return
      }

      try {
        const response = await swingTradingApi.getDashboard()
        const data = this.normalizeSwingTradingResponse(response)
        if (!data) return

        this.dashboardDate = data.date || this.dashboardDate
        this.strategies = data.strategies
        this.apiReady = true
        if (!this.expandedStrategyId && this.strategies[0]) {
          this.expandedStrategyId = this.strategies[0].id
        }
      } catch (error) {
        this.apiReady = false
        this.strategies = cloneFallbackStrategies()
      }
    },
    normalizeSwingTradingResponse(response) {
      const responseData = response && response.data !== undefined ? response.data : response
      const data = responseData && responseData.data !== undefined ? responseData.data : responseData
      const rawStrategies = Array.isArray(data)
        ? data
        : Array.isArray(data && data.strategies)
          ? data.strategies
          : Array.isArray(data && data.results)
            ? data.results
            : []

      if (!rawStrategies.length) return null

      return {
        date: data && (data.date || data.trade_date || data.as_of),
        strategies: rawStrategies.map((strategy, index) => this.normalizeStrategy(strategy, index)).filter(strategy => strategy.stocks.length)
      }
    },
    normalizeStrategy(strategy, index) {
      const id = String(strategy && (strategy.id || strategy.strategy_id || strategy.name) || `Strategy ${index + 1}`)
      const stocks = Array.isArray(strategy && strategy.stocks)
        ? strategy.stocks
        : Array.isArray(strategy && strategy.signals)
          ? strategy.signals
          : Array.isArray(strategy && strategy.rows)
            ? strategy.rows
            : []

      return {
        id,
        url: this.formatText(strategy && (strategy.url || strategy.slug || strategy.strategy_url)),
        name: String(strategy && (strategy.name || strategy.model_name || id) || id),
        stocks: stocks.map(stock => this.normalizeStock(stock)).filter(stock => stock.symbol)
      }
    },
    normalizeStock(stock = {}) {
      return {
        symbol: this.formatText(this.getFirstDefined(stock, ['symbol', 'ticker', 'market_symbol'])),
        signal: this.formatText(this.getFirstDefined(stock, ['signal', 'signal_name', 'model_signal'])),
        price: this.formatMoney(this.getFirstDefined(stock, ['price', 'close', 'daily_close'])),
        shares: this.formatNumber(this.getFirstDefined(stock, ['shares', 'share_count'])),
        amount: this.formatMoney(this.getFirstDefined(stock, ['amount', 'allocation', 'position_amount'])),
        sl: this.formatPercent(this.getFirstDefined(stock, ['sl', 'stop_loss', 'stop_loss_pct'])),
        pt: this.formatPercent(this.getFirstDefined(stock, ['pt', 'profit_target', 'profit_target_pct'])),
        tim: this.formatText(this.getFirstDefined(stock, ['tim', 'best_time_in_market', 'time_in_market', 'bars']))
      }
    },
    getFirstDefined(source, keys) {
      const foundKey = keys.find(key => source[key] !== undefined && source[key] !== null && source[key] !== '')
      return foundKey ? source[foundKey] : ''
    },
    formatText(value) {
      return value === undefined || value === null ? '' : String(value)
    },
    formatNumber(value) {
      if (value === undefined || value === null || value === '') return ''
      if (typeof value === 'string') return value
      return Number(value).toLocaleString('en-US')
    },
    formatMoney(value) {
      if (value === undefined || value === null || value === '') return ''
      if (typeof value === 'string') return value
      return `$${Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
    },
    formatPercent(value) {
      if (value === undefined || value === null || value === '') return ''
      if (typeof value === 'string') return value
      return `${Number(value).toFixed(1)}%`
    },
    isStrategyExpanded(strategy) {
      return strategy && this.expandedStrategyId === strategy.id
    },
    toggleStrategy(strategy) {
      if (!strategy) return
      this.expandedStrategyId = this.isStrategyExpanded(strategy) ? '' : strategy.id
    },
    getStrategyDetailRoute(strategy) {
      const strategyUrl = strategy && strategy.url ? strategy.url : this.getStrategyAnchor(strategy)
      const strategyId = strategy && strategy.id ? strategy.id : strategyUrl

      return {
        name: 'SwingTradingDetail',
        params: {
          strategyId: strategyUrl || strategyId
        },
        query: {
          id: strategyId,
          url: strategyUrl,
          name: strategy && strategy.name ? strategy.name : ''
        }
      }
    },
    getVisibleStocks(strategy) {
      const stocks = strategy && Array.isArray(strategy.stocks) ? strategy.stocks : []
      return this.isStrategyExpanded(strategy) ? stocks : stocks.slice(0, 1)
    },
    getStrategyRowspan(strategy) {
      return Math.max(this.getVisibleStocks(strategy).length, 1)
    },
    getStrategyAnchor(strategy) {
      return String(strategy && strategy.id ? strategy.id : '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
    }
  }
}
</script>

<style scoped>
.swing-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  background: #fff;
  color: #1f2937;
  font-family: Arial, Helvetica, sans-serif;
}

.swing-page * {
  box-sizing: border-box;
}

.process-section {
  margin-bottom: 32px;
}

.process-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.process-toggle h1 {
  margin: 0;
  color: #111827;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  transition: color 0.2s ease;
}

.process-toggle:hover h1 {
  color: #3b82f6;
}

.chevron-icon {
  width: 24px;
  height: 24px;
  color: #9ca3af;
  transition: transform 0.3s ease, color 0.2s ease;
}

.chevron-icon.is-expanded {
  transform: rotate(180deg);
}

.chevron-icon.small {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.chevron-icon.is-collapsed {
  transform: rotate(-90deg);
}

.process-content {
  margin-top: 24px;
}

.intro-copy {
  max-width: none;
  margin: 0 0 24px;
  color: #4b5563;
  font-size: 15px;
  line-height: 1.65;
}

.process-details {
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.process-details h3 {
  margin: 0 0 24px;
  color: #111827;
  font-size: 18px;
  font-weight: 700;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 64px;
  row-gap: 40px;
}

.process-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.process-step {
  position: relative;
  padding-left: 32px;
}

.step-number {
  position: absolute;
  top: 2px;
  left: 0;
  display: flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 700;
}

.process-step h4 {
  margin: 0 0 6px;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
}

.process-step p,
.plain-list,
.status-list {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.plain-list,
.status-list {
  padding: 0;
  list-style: none;
}

.plain-list {
  margin-top: 8px;
}

.plain-list li {
  position: relative;
  padding-left: 17px;
}

.plain-list li::before {
  position: absolute;
  left: 0;
  color: #9ca3af;
  content: "-";
}

.formula-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  padding: 14px;
  border: 1px solid #f1f5f9;
  border-radius: 6px;
  background: #f8fafc;
  color: #475569;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
}

.formula-box span {
  color: #3b82f6;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.status-list li {
  display: flex;
  align-items: flex-start;
}

.status-list strong {
  color: #374151;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  margin: 7px 10px 0 0;
  border-radius: 999px;
}

.status-dot.profit {
  background: #34d399;
}

.status-dot.loss {
  background: #fb7185;
}

.status-dot.timeout {
  background: #94a3b8;
}

.process-note {
  display: flex;
  align-items: flex-start;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.process-note svg {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  margin: 2px 8px 0 0;
  color: #9ca3af;
}

.process-note p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  font-style: italic;
  line-height: 1.55;
}

.table-section {
  margin-top: 32px;
  overflow-x: auto;
  padding-bottom: 80px;
}

table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
  text-align: left;
}

thead tr {
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

th {
  padding: 16px 8px;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

th:first-child {
  padding-left: 12px;
}

th .sort-button {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

th .sort-button:hover,
th .sort-button:focus {
  color: #2563eb;
  outline: none;
}

th .column-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.model-col {
  width: 280px;
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

tbody {
  border-bottom: 1px solid #f3f4f6;
}

.strategy-row {
  border-top: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

.strategy-row:hover {
  background: rgba(249, 250, 251, 0.75);
}

td {
  padding: 16px 8px;
  color: #374151;
  font-size: 14px;
  vertical-align: middle;
}

tr + tr td {
  padding-top: 12px;
  padding-bottom: 12px;
}

.model-cell {
  padding-left: 12px;
}

.model-cell.align-top {
  vertical-align: top;
}

.model-wrap {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.strategy-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px 0 0 -2px;
  padding: 2px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.strategy-toggle:hover {
  background: #f3f4f6;
}

.strategy-name {
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.strategy-name:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.more-row {
  margin-top: 4px;
}

.more-row button {
  padding: 2px 6px;
  border: 1px solid rgba(191, 219, 254, 0.55);
  border-radius: 4px;
  background: #eff6ff;
  color: #3b82f6;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.more-row button:hover {
  background: #dbeafe;
}

.symbol-cell {
  font-weight: 500;
}

.empty-row {
  padding: 28px 12px;
  color: #6b7280;
  text-align: center;
}

@media (max-width: 768px) {
  .swing-page {
    padding: 24px 16px 64px;
  }

  .process-grid {
    grid-template-columns: 1fr;
    row-gap: 32px;
  }

  .process-toggle h1 {
    font-size: 21px;
  }
}
</style>
