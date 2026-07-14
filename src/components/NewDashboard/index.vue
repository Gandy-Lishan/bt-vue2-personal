<template>
  <main class="dashboard-page">
    <section class="page-title">
      <div>
        <h1>My Dashboard</h1>
        <p>Quickly monitor favorite tickers, market universes, sentiment indicators, and technical changes.</p>
      </div>
      <div class="date-note">{{ dashboardDateNote }}</div>
    </section>

    <div class="dashboard-views">
      <button
        v-for="view in dashboardViews"
        :key="view.value"
        class="view-btn"
        :class="{ active: activeView === view.value }"
        type="button"
        @click="activeView = view.value"
      >
        {{ view.label }}
      </button>
    </div>

    <section class="layout">
      <div v-show="isPanelVisible('signals')" class="panel">
        <div class="panel-header compact">
          <div class="master-hub-tabs">
            <button
              v-for="tab in hubTabs"
              :key="tab.value"
              class="hub-tab-btn"
              :class="{ active: activeHubTab === tab.value }"
              type="button"
              @click="switchHubTab(tab.value)"
            >
              {{ tab.label }}
            </button>
          </div>
          <button class="collapse-btn" type="button" @click="togglePanel('research')">
            {{ collapseLabel('research') }}
          </button>
        </div>

        <div class="panel-body" :class="{ collapsed: collapsedPanels.research }">
          <div class="signals-tabs">
            <div v-show="activeHubTab === 'signals'" class="signals-subtabs">
              <button
                class="signals-tab"
                :class="{ active: activeSignalsTab === 'my-signals' }"
                type="button"
                @click="activeSignalsTab = 'my-signals'"
              >
                My Signals List
              </button>
              <button
                class="signals-tab"
                :class="{ active: activeSignalsTab === 'st-signals' }"
                type="button"
                @click="activeSignalsTab = 'st-signals'"
              >
                Sentimentrader Signals List
              </button>
            </div>
            <div class="hub-search">
              <input v-model="hubSearch" class="search-input" :placeholder="hubSearchPlaceholder" type="text" />
            </div>
          </div>

          <div v-if="activeHubTab === 'signals'" class="table-wrap">
            <div v-if="hasLastSignalHighlightedRows" class="last-signal-note">
              Highlighted rows indicate the last signal date is today.
            </div>
            <table class="signals-table" :class="{ 'st-signals-table': activeSignalsTab === 'st-signals' }">
              <thead>
                <tr>
                  <th class="sortable" :class="sortClass('signals', 'name')" @click="toggleSort('signals', 'name')">Name</th>
                  <th class="sortable" :class="sortClass('signals', 'symbol')" @click="toggleSort('signals', 'symbol')">Symbol</th>
                  <th class="sortable" :class="sortClass('signals', 'timeframe')" @click="toggleSort('signals', 'timeframe')">Timeframe</th>
                  <th class="sortable" :class="sortClass('signals', 'signal')" @click="toggleSort('signals', 'signal')">Signal</th>
                  <th class="sortable" :class="sortClass('signals', 'date')" @click="toggleSort('signals', 'date')">Last Signal Date</th>
                  <th class="sortable" :class="sortClass('signals', 'bars')" @click="toggleSort('signals', 'bars')">
                    Bars Since<br />Signal
                    <span class="info-icon" data-tooltip="The number of bars (e.g., weeks for weekly signals) that have elapsed since the last signal occurred." @click.stop="noop">?</span>
                  </th>
                  <th class="sortable" :class="sortClass('signals', 'return')" @click="toggleSort('signals', 'return')">
                    Return Since<br />Signal
                    <span class="info-icon tooltip-align-right" data-tooltip="The cumulative return since the last signal up to the most recent day, expressed as a percentage (%)." @click.stop="noop">?</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="signal in paginatedSignals"
                  :key="signal.name + signal.symbol"
                  :class="{ 'last-signal-highlight': signal.isLastSignalToday }"
                >
                  <td>
                    <div>
                      <a @click="viewSignal(signal)" target="_blank" class="primary-link">{{ signal.name }}</a>
                    </div>
                    <div v-if="activeSignalsTab === 'st-signals' && signal.analystUrl" class="muted small-text">
                      Analyst Report URL:
                      <a :href="signal.analystUrl" target="_blank">{{ signal.analystUrl }}</a>
                    </div>
                  </td>
                  <td>{{ signal.symbol }}</td>
                  <td>{{ signal.timeframe }}</td>
                  <td>
                    <template v-if="getSignalConditions(signal).length">
                      <div class="signal-first-condition">{{ getSignalConditionText(getSignalConditions(signal)[0]) }}</div>
                      <ol v-if="getSignalConditions(signal).length > 1" class="signal-preview-list">
                        <li>
                          {{ getSignalConditionText(getSignalConditions(signal)[1]) }}<template v-if="getSignalConditions(signal).length > 2">...
                            <button
                              class="inline-link-btn"
                              type="button"
                              @click="openSignalConditionsModal(signal)"
                            >
                              Show All
                            </button>
                          </template>
                        </li>
                      </ol>
                    </template>
                    <template v-else>-</template>
                  </td>
                  <td>{{ signal.date || '-' }}</td>
                  <td>{{ signal.bars }}</td>
                  <td :class="returnClass(signal.return)">{{ `${signal.return}%` }}</td>
                </tr>
              </tbody>
            </table>
            <div class="pagination-row" v-if="shouldShowPagination(filteredSignals.length)">
              <button class="pagination-btn" type="button" :disabled="activeSignalsPage <= 1" @click="changeSignalsPage(activeSignalsPage - 1)">Prev</button>
              <span>Page {{ activeSignalsPage }} / {{ getTotalPages(filteredSignals.length) }} · Total {{ filteredSignals.length }}</span>
              <button class="pagination-btn" type="button" :disabled="activeSignalsPage >= getTotalPages(filteredSignals.length)" @click="changeSignalsPage(activeSignalsPage + 1)">Next</button>
            </div>
          </div>

          <div v-else-if="activeHubTab === 'indicators'" class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th class="sortable" :class="sortClass('myIndicators', 'name')" @click="toggleSort('myIndicators', 'name')">Name</th>
                  <th class="sortable" :class="sortClass('myIndicators', 'categories')" @click="toggleSort('myIndicators', 'categories')">Categories</th>
                  <th class="sortable" :class="sortClass('myIndicators', 'time_frame')" @click="toggleSort('myIndicators', 'time_frame')">Timeframe</th>
                  <th class="sortable" :class="sortClass('myIndicators', 'included_url')" @click="toggleSort('myIndicators', 'included_url')">Indicators included</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="item in filteredMyIndicators">
                  <tr :key="getMyIndicatorKey(item)">
                    <td>
                      <!-- <button
                        class="chevron"
                        :class="{ expanded: isMyIndicatorExpanded(item) }"
                        type="button"
                        @click="toggleMyIndicatorDetails(item)"
                      >›</button> -->

                      <a @click="viewMyIndicator(item)" target="_blank" class="primary-link">{{ item.name }}</a>
                    </td>
                    <td>{{ item.categories }}</td>
                    <td>{{ item.time_frame }}</td>
                    <td>
                      <template v-if="item.included_url && Array.isArray(item.included_url) && item.included_url.length">
                        <ol :style="{ listStyleType: item.included_url.length === 1 ? 'none' : 'decimal' }">
                          <li v-for="indicator in item.included_url" :key="indicator">{{ indicator }}</li>
                        </ol>
                      </template>
                      <template v-else>-</template>
                    </td>
                  </tr>
                  <tr v-if="isMyIndicatorExpanded(item)" :key="`${getMyIndicatorKey(item)}-details`" class="details-row">
                    <td colspan="4">
                      <div class="details-stack">
                        <div><strong>Name:</strong> {{ item.name || '-' }}</div>
                        <div><strong>Categories:</strong> {{ item.categories || '-' }}</div>
                        <div><strong>Timeframe:</strong> {{ item.time_frame || '-' }}</div>
                        <div>
                          <strong>Indicators included:</strong>
                          <template v-if="item.included_url && Array.isArray(item.included_url) && item.included_url.length">
                            <ol>
                              <li v-for="indicator in item.included_url" :key="indicator">{{ indicator }}</li>
                            </ol>
                          </template>
                          <template v-else> -</template>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div class="pagination-row" v-if="shouldShowPagination(myIndicatorsTotalCount)">
              <button class="pagination-btn" type="button" :disabled="myIndicatorsPage <= 1" @click="changeMyIndicatorsPage(myIndicatorsPage - 1)">Prev</button>
              <span>Page {{ myIndicatorsPage }} / {{ getTotalPages(myIndicatorsTotalCount) }} · Total {{ myIndicatorsTotalCount }}</span>
              <button class="pagination-btn" type="button" :disabled="myIndicatorsPage >= getTotalPages(myIndicatorsTotalCount)" @click="changeMyIndicatorsPage(myIndicatorsPage + 1)">Next</button>
            </div>
          </div>

          <div v-else class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th class="sortable" :class="sortClass('reports', 'title')" @click="toggleSort('reports', 'title')">Report Title</th>
                  <th class="sortable" :class="sortClass('reports', 'author')" @click="toggleSort('reports', 'author')">Author</th>
                  <th class="sortable" :class="sortClass('reports', 'date')" @click="toggleSort('reports', 'date')">Publish Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in filteredReports" :key="report.title">
                  <td>
                    <a :href="getBlogUrl(report)" target="_blank" class="primary-link">{{ report.title }}</a>
                    <div class="muted small-text report-summary">{{ report.summary }}</div>
                  </td>
                  <td>{{ report.author }}</td>
                  <td>{{ report.date }}</td>
                </tr>
              </tbody>
            </table>
            <div class="pagination-row" v-if="shouldShowPagination(reportsTotalCount)">
              <button class="pagination-btn" type="button" :disabled="reportsPage <= 1" @click="changeReportsPage(reportsPage - 1)">Prev</button>
              <span>Page {{ reportsPage }} / {{ getTotalPages(reportsTotalCount) }} · Total {{ reportsTotalCount }}</span>
              <button class="pagination-btn" type="button" :disabled="reportsPage >= getTotalPages(reportsTotalCount)" @click="changeReportsPage(reportsPage + 1)">Next</button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="isPanelVisible('watchlist')" class="panel">
        <div class="panel-header">
          <span>Watchlist</span>
          <div class="panel-actions">
            <button class="btn small" type="button" @click="openSettings">Settings</button>
            <button class="collapse-btn" type="button" @click="togglePanel('watchlist')">
              {{ collapseLabel('watchlist') }}
            </button>
          </div>
        </div>

        <div class="panel-body" :class="{ collapsed: collapsedPanels.watchlist }">
          <div class="toolbar">
            <div class="toolbar-left">
              <button class="btn blue" type="button" :disabled="watchlistConfigLoading || !selectedWatchTickers.length" @click="removeSelected">Remove Selected</button>
              <input v-model.trim="watchlistSearch" class="search-input" type="text" placeholder="Search within the list below..." />
              <input v-model.trim="singleTicker" class="bulk-input" type="text" placeholder="Add tickers, e.g. AAPL, MSFT, SPY" />
              <button class="btn blue" type="button" :disabled="watchlistConfigLoading || !singleTicker" @click="addWatchlistTickers">Add</button>
            </div>
          </div>
          <div v-if="watchlistConfigMessage" class="watchlist-message">{{ watchlistConfigMessage }}</div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th><input v-model="allWatchSelected" type="checkbox" /></th>
                  <th
                    v-for="column in visibleColumns"
                    :key="column.id"
                    class="sortable"
                    :class="sortClass('watchlist', column.id)"
                    @click="toggleSort('watchlist', column.id)"
                  >
                    {{ column.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="watchlistLoading">
                  <td :colspan="visibleColumns.length + 1" class="empty-row">Loading...</td>
                </tr>
                <tr v-else-if="!sortedWatchListData.length">
                  <td :colspan="visibleColumns.length + 1" class="empty-row">{{ watchlistEmptyText }}</td>
                </tr>
                <template v-else>
                  <tr v-for="row in sortedWatchListData" :key="`${row.symbol}-${row.asset_type}-${row.data_date}`">
                    <td>
                      <input
                        :checked="isWatchTickerSelected(row)"
                        type="checkbox"
                        @change="toggleWatchTickerSelection(row, $event.target.checked)"
                      />
                    </td>
                    <td v-for="column in visibleColumns" :key="column.id">
                      <!-- <span :class="getWatchlistCellClass(column.id)">{{ formatWatchlistCell(row, column.id) }}</span> -->
                      <span>{{ formatWatchlistCell(row, column.id) }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div class="pagination-row" v-if="shouldShowPagination(watchlistTotalCount, metricPageSize)">
              <button class="pagination-btn" type="button" :disabled="watchlistPage <= 1 || watchlistLoading" @click="changeWatchlistPage(watchlistPage - 1)">Prev</button>
              <span>Page {{ watchlistPage }} / {{ getTotalPages(watchlistTotalCount, metricPageSize) }} · Total {{ watchlistTotalCount }}</span>
              <button class="pagination-btn" type="button" :disabled="watchlistPage >= getTotalPages(watchlistTotalCount, metricPageSize) || watchlistLoading" @click="changeWatchlistPage(watchlistPage + 1)">Next</button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="isPanelVisible('watchlist')" class="panel">
        <div class="panel-header">
          <span>Market Screen</span>
          <div class="panel-actions">
            <select v-model.number="activeMarketConfigIndex" class="header-select" @change="loadMarketScreenConfigByIndex">
              <option v-if="!marketScreenConfigs.length" :value="0">Default Screen</option>
              <option v-for="(config, index) in marketScreenConfigs" :key="`${config.name}-${index}`" :value="index">
                {{ config.name || `Screen ${index + 1}` }}
              </option>
            </select>
            <button class="btn small" type="button" :disabled="watchlistConfigLoading || marketLoading" @click="saveMarketScreenConfig({ silent: false })">Save Filter Logic</button>
            <button class="btn small" type="button" :disabled="watchlistConfigLoading || marketLoading" @click="refreshMarketResults">Refresh Results</button>
            <button class="collapse-btn" type="button" @click="togglePanel('marketScreen')">
              {{ collapseLabel('marketScreen') }}
            </button>
          </div>
        </div>

        <div class="panel-body" :class="{ collapsed: collapsedPanels.marketScreen }">
          <div class="section-tabs">
            <button
              v-for="group in marketGroupOptions"
              :key="group.value"
              :class="{ active: activeMarketGroup === group.value }"
              type="button"
              @click="changeMarketGroup(group.value)"
            >
              {{ group.label }}
            </button>
          </div>

          <div class="filters">
            <div v-for="field in marketFilterFields" :key="field.key" class="filter-field">
              <label>{{ field.label }}</label>
              <select v-model="marketFilters[field.key]" @change="saveMarketScreenConfig({ silent: true })">
                <option v-for="option in field.options" :key="option">{{ option }}</option>
              </select>
            </div>
          </div>
          <div v-if="marketConfigMessage" class="watchlist-message">{{ marketConfigMessage }}</div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Add</th>
                  <th
                    v-for="column in visibleMarketColumns"
                    :key="column.id"
                    class="sortable"
                    :class="sortClass('marketRows', column.id)"
                    @click="toggleSort('marketRows', column.id)"
                  >
                    {{ column.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="marketLoading">
                  <td :colspan="visibleMarketColumns.length + 1" class="empty-row">Loading...</td>
                </tr>
                <tr v-else-if="!filteredMarketRows.length">
                  <td :colspan="visibleMarketColumns.length + 1" class="empty-row">No data</td>
                </tr>
                <template v-else>
                  <tr v-for="row in filteredMarketRows" :key="`${row.symbol}-${row.asset_type}-${row.data_date}`">
                    <td><button class="btn small" type="button" @click="addTicker(getMarketRowSymbol(row))">+</button></td>
                    <td v-for="column in visibleMarketColumns" :key="column.id">
                      <span>{{ formatMarketCell(row, column.id) }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div class="pagination-row" v-if="shouldShowPagination(marketTotalCount, metricPageSize)">
              <button class="pagination-btn" type="button" :disabled="marketPage <= 1 || marketLoading" @click="changeMarketPage(marketPage - 1)">Prev</button>
              <span>Page {{ marketPage }} / {{ getTotalPages(marketTotalCount, metricPageSize) }} · Total {{ marketTotalCount }}</span>
              <button class="pagination-btn" type="button" :disabled="marketPage >= getTotalPages(marketTotalCount, metricPageSize) || marketLoading" @click="changeMarketPage(marketPage + 1)">Next</button>
            </div>
          </div>
        </div>
      </div>

      <div v-show="isPanelVisible('market')" class="panel">
        <div class="panel-header">
          <span>Sentiment Indicators Charts</span>
          <div class="panel-actions">
            <button class="btn small" type="button" @click="setIndicatorView(indicatorView === 'table' ? 'grid' : 'table')">
              {{ indicatorView === 'table' ? 'Grid View' : 'Table View' }}
            </button>
            <button class="collapse-btn" type="button" @click="togglePanel('sentiment')">
              {{ collapseLabel('sentiment') }}
            </button>
          </div>
        </div>

        <div class="panel-body" :class="{ collapsed: collapsedPanels.sentiment }">
          <template v-if="indicatorView === 'table'">
            <div class="toolbar">
              <div class="toolbar-left">
                <strong>Custom Indicators</strong>
                <span class="muted">Default table format</span>
              </div>
              <div class="toolbar-right">
                <input v-model="sentimentIndicatorSearch" class="search-input" type="text" placeholder="Search indicators..." />
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th class="sortable" :class="sortClass('sentimentIndicators', 'chart_name')" @click="toggleSort('sentimentIndicators', 'chart_name')">Name</th>
                    <th class="sortable" :class="sortClass('sentimentIndicators', 'sub_type')" @click="toggleSort('sentimentIndicators', 'sub_type')">Group</th>
                    <th class="sortable" :class="sortClass('sentimentIndicators', 'timeframe')" @click="toggleSort('sentimentIndicators', 'timeframe')">Time Frame</th>
                    <th class="sortable" :class="sortClass('sentimentIndicators', 'last_value')" @click="toggleSort('sentimentIndicators', 'last_value')">Value</th>
                    <th class="sortable" :class="sortClass('sentimentIndicators', 'last_change')" @click="toggleSort('sentimentIndicators', 'last_change')">Change</th>
                    <th class="sortable" :class="sortClass('sentimentIndicators', 'last_update')" @click="toggleSort('sentimentIndicators', 'last_update')">Date</th>
                    <th class="sortable" :class="sortClass('sentimentIndicators', 'sentiment')" @click="toggleSort('sentimentIndicators', 'sentiment')">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="indicator in paginatedSentimentIndicators" :key="indicator.chart_name">
                    <td><a :href="`/indicators?indicator=${indicator.url}`" target="_blank">{{ indicator.chart_name }}</a></td>
                    <td>{{ indicator.sub_type }}</td>
                    <td>{{ indicator.timeframe }}</td>
                    <td :class="returnClass(indicator.last_value)">{{ indicator.last_value }}</td>
                    <td :class="returnClass(indicator.last_change)">{{ indicator.last_change }}</td>
                    <td>{{ indicator.last_update }}</td>
                    <td>
                        <img :src="`https://users.sentimentrader.com/static/img/bull_bear_${indicator.sentiment}.gif`" :alt="indicator.chart_name" style="width: 90px;"/>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="pagination-row" v-if="shouldShowPagination(sentimentIndicatorsTotalCount)">
                <button class="pagination-btn" type="button" :disabled="sentimentIndicatorsPage <= 1" @click="changeSentimentIndicatorsPage(sentimentIndicatorsPage - 1)">Prev</button>
                <span>Page {{ sentimentIndicatorsPage }} / {{ getTotalPages(sentimentIndicatorsTotalCount) }} · Total {{ sentimentIndicatorsTotalCount }}</span>
                <button class="pagination-btn" type="button" :disabled="sentimentIndicatorsPage >= getTotalPages(sentimentIndicatorsTotalCount)" @click="changeSentimentIndicatorsPage(sentimentIndicatorsPage + 1)">Next</button>
              </div>
            </div>
          </template>

          <div v-else>
            <div v-if="chartCardsLoading" class="chart-loading">Loading chart data...</div>
            <div class="nine-grid">
            <div v-for="card in sentimentChartCards" :key="card.url || card.title" class="indicator-card">
              <div class="indicator-title">
                <a v-if="card.url" :href="`/indicators?indicator=${card.url}`" target="_blank">{{ card.title }}</a>
                <span v-else>{{ card.title }}</span>
              </div>
              <div class="sparkline">
                <svg v-if="card.points" viewBox="0 0 300 90">
                  <polyline fill="none" stroke="#3d8bc0" stroke-width="2.5" :points="card.points" />
                </svg>
                <div v-else class="chart-empty">{{ card.error || 'No chart data' }}</div>
              </div>
              <div class="chart-meta"><span>Last: {{ card.last || '-' }}</span><span>{{ card.periodLabel }}</span></div>
            </div>
            </div>
            <div class="pagination-row" v-if="shouldShowPagination(sentimentIndicatorsTotalCount)">
              <button class="pagination-btn" type="button" :disabled="sentimentIndicatorsPage <= 1" @click="changeSentimentIndicatorsPage(sentimentIndicatorsPage - 1)">Prev</button>
              <span>Page {{ sentimentIndicatorsPage }} / {{ getTotalPages(sentimentIndicatorsTotalCount) }} · Total {{ sentimentIndicatorsTotalCount }}</span>
              <button class="pagination-btn" type="button" :disabled="sentimentIndicatorsPage >= getTotalPages(sentimentIndicatorsTotalCount)" @click="changeSentimentIndicatorsPage(sentimentIndicatorsPage + 1)">Next</button>
            </div>
          </div>
        </div>
      </div>

      <section v-show="isPanelVisible('market')" class="panel">
        <div class="panel-header">
          <span>Trend Score Board</span>
          <button class="collapse-btn" type="button" @click="togglePanel('trend')">
            {{ collapseLabel('trend') }}
          </button>
        </div>
        <div class="panel-body" :class="{ collapsed: collapsedPanels.trend }">
          <div class="table-wrap">
            <table id="trendTable">
              <thead>
                <tr>
                  <th
                    width="180px"
                    class="sortable"
                    :class="sortClass('trendRows', 'index_name')"
                    @click="sortTable('index_name')"
                  >
                    Index/Sector
                  </th>
                  <th
                    class="sortable"
                    :class="sortClass('trendRows', 'constituent_trend_score')"
                    @click="sortTable('constituent_trend_score')"
                  >
                    Trend<br />Score<br />Average
                  </th>
                  <th
                    class="sortable"
                    :class="sortClass('trendRows', 'trend_above8_ratio')"
                    @click="sortTable('trend_above8_ratio')"
                  >
                    Trend<br />Score<br />&gt;=8
                  </th>

                  <th
                    class="sortable"
                    :class="sortClass('trendRows', 'trend_below2_ratio')"
                    @click="sortTable('trend_below2_ratio')"
                  >
                    Trend<br />Score<br />&lt;=2
                  </th>

                  <th
                    class="sortable"
                    :class="sortClass('trendRows', 'reltrend_above8_ratio')"
                    @click="sortTable('reltrend_above8_ratio')"
                  >
                    Relative<br />Score<br />&gt;=8
                  </th>

                  <th
                    class="sortable"
                    :class="sortClass('trendRows', 'reltrend_below2_ratio')"
                    @click="sortTable('reltrend_below2_ratio')"
                  >
                    Relative<br />Score<br />&lt;=2
                  </th>

                  <th
                    class="sortable"
                    :class="sortClass('trendRows', 'trend_and_reltrend_above8_ratio')"
                    @click="sortTable('trend_and_reltrend_above8_ratio')"
                  >
                    Trend &amp;<br />Rel<br />Score<br />&gt;=8
                  </th>

                  <th
                    class="sortable"
                    :class="sortClass('trendRows', 'trend_and_reltrend_below2_ratio')"
                    @click="sortTable('trend_and_reltrend_below2_ratio')"
                  >
                    Trend &amp;<br />Rel<br />Score<br />&lt;=2
                  </th>

                  <th
                    class="sortable"
                    :class="sortClass('trendRows', 'reltrend_above8_spx_ratio')"
                    @click="sortTable('reltrend_above8_spx_ratio')"
                  >
                    Relative<br />Score<br />&gt;=8<br />in S&amp;P 500
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="row in sortedTrendRows" :key="row.index_name">
                  <td>
                      <a :href="`/sector_trend_score?index=${row.sector}`"  target="_blank">{{ row.index_name }}</a>
                  </td>
                  <td class="score">
                    <a :href="`/indicators?indicator=${row['sector']}_constituent_trend_score`" target="_blank">{{ row.constituent_trend_score }}</a>
                  </td>
                  <td>{{ `${row.trend_above8_ratio}%` }}</td>
                  <td>{{ `${row.trend_below2_ratio}%` }}</td>
                  <td>{{ `${row.reltrend_above8_ratio}%` }}</td>
                  <td>{{ `${row.reltrend_below2_ratio}%` }}</td>
                  <td>{{ `${row.trend_and_reltrend_above8_ratio}%` }}</td>
                  <td>{{ `${row.trend_and_reltrend_below2_ratio}%` }}</td>
                  <td>{{ `${row.reltrend_above8_spx_ratio}%` }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>

    <div v-if="activeSignalConditions" class="modal" @click.self="closeSignalConditionsModal">
      <div class="modal-content signal-conditions-modal">
        <div class="modal-header">
          <h3>Signal Conditions</h3>
          <button class="close-btn" type="button" @click="closeSignalConditionsModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="signal-modal-name">
            <strong>Signal Name:</strong> {{ activeSignalConditions.name || '-' }}
          </div>
          <div class="signal-condition-label">Signal Condition:</div>
          <div class="signal-first-condition">{{ getSignalConditionText(getSignalConditions(activeSignalConditions)[0]) }}</div>
          <ol v-if="getSignalConditions(activeSignalConditions).length > 1" class="signal-full-list">
            <li v-for="(indicator, index) in getSignalConditions(activeSignalConditions).slice(1)" :key="index">
              {{ getSignalConditionText(indicator) }}
            </li>
          </ol>
        </div>
        <div class="modal-footer">
          <button class="btn primary" type="button" @click="closeSignalConditionsModal">Hide</button>
        </div>
      </div>
    </div>

    <div v-if="settingsOpen" class="modal" @click.self="settingsOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Configure Table Columns</h3>
          <button class="close-btn" type="button" @click="settingsOpen = false">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-intro">Toggle checkboxes to show/hide columns. Use UP and DOWN to reorder.</p>
          <div class="column-settings-list">
            <div v-for="(column, index) in tempColumns" :key="column.id" class="settings-list-item">
              <label>
                <input v-model="column.visible" :disabled="column.id === 'symbol'" type="checkbox" />
                {{ column.name }}
              </label>
              <div class="reorder-btns">
                <button class="reorder-btn" type="button" :disabled="index === 0" @click="moveTempColumn(index, -1)">▲</button>
                <button class="reorder-btn" type="button" :disabled="index === tempColumns.length - 1" @click="moveTempColumn(index, 1)">▼</button>
              </div>
            </div>
          </div>
          <div class="add-column">
            <h4>Add Custom Column</h4>
            <div class="add-column-row">
              <select v-model="newColumnType">
                <option v-for="column in customColumnOptions" :key="column.value" :value="column.value">{{ column.label }}</option>
              </select>
              <button class="btn blue" type="button" @click="addTempColumn">+ Add Column</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" type="button" @click="settingsOpen = false">Cancel</button>
          <button class="btn primary" type="button" @click="applySettings">Apply Settings</button>
        </div>
      </div>
    </div>
    <div class="footer">
      <AboutUs></AboutUs>
    </div>
  </main>
</template>

<script>
import { getMySignalsList, getMyIndicatorsList, getMRFavoritesList, obtainIndicatorsList, getFavorite, getIndicatorsRowData, getLastSignalDate, getDashboardData } from '@/service/service'
import { isJson, trimTrailingZeros, capitalizeFirstLetter, unifyNumber } from "@/utils"
import SignalCode from '@/utils/cryptoUtils/codeTool'
import { mapGetters, mapActions } from 'vuex'
import axios from '@/axios'
import AboutUs from "@/components/Indicators/Table/AboutUs.vue";

const DASHBOARD_PAGE_SIZE = 5
const METRIC_PAGE_SIZE = 10

const dashboardApi = {
  getWatchlist(params = {}) {
    return axios.get('/dev/st_data/asset_latest_metrics', {
      params: {
        paginate: true,
        page: 1,
        page_size: METRIC_PAGE_SIZE,
        ...params
      },
      withCredentials: true
    })
  },
  getMetricWatchlistSets(params = {}) {
    return axios.get('/dev/st_data/user_metric_watchlist', {
      params,
      withCredentials: true
    })
  },
  saveMetricWatchlistSet(payload) {
    return axios.post('/dev/st_data/user_metric_watchlist', payload, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
  },
  applyMetricWatchlistSet(params = {}) {
    return axios.get('/dev/st_data/metric_watchlist_apply', {
      params: {
        name: 'default',
        table: 1,
        paginate: true,
        page: 1,
        page_size: METRIC_PAGE_SIZE,
        ...params
      },
      withCredentials: true
    })
  },
  getMySignals() {
    // TODO: connect real My Signals API here.
    return getMySignalsList(`/dev/mysignal_app/get_mysignal_records`)
  },
  getSentimentraderSignals() {
    // TODO: connect real Sentimentrader Signals API here.
    return getMySignalsList(`/dev/mysignal_app/get_mysignal_records?sample=2`)
  },
  getLastSignalDate() {
    return getLastSignalDate()
  },
  getMyIndicators(params = {}) {
    // TODO: connect real My Indicators API here.
    return getMyIndicatorsList(params.page || 1, params.name, params.page_size || DASHBOARD_PAGE_SIZE)
  },
  getFavoriteReports(params = {}) {
    // TODO: connect real Favorite Reports API here.
    return getMRFavoritesList({ page: params.page || 1, page_size: DASHBOARD_PAGE_SIZE, ...params })
  },
  getMarketRows() {
    // TODO: connect real Market Screen API here.
    return obtainIndicatorsList('sp_1500_complete_list')
  },
  async getSentimentIndicators(params = {}) {
    const favoritesBtv1List = Array.isArray(params.favoritesBtv1List) ? params.favoritesBtv1List : []
    const favoritesBtv2List = Array.isArray(params.favoritesBtv2List) ? params.favoritesBtv2List : []
    const fetchData = async (res) => {
      try {
        const indicatorList = Array.isArray(res) ? res.filter(indi => indi && indi.url) : []
        if (!indicatorList.length) return []

        const responses = await Promise.allSettled(
          indicatorList.map(indi =>
            getIndicatorsRowData(indi.url).then(response => ({
              ...indi,
              ...(response.data || {})
            }))
          )
        )

        return responses
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value)
      } catch (error) {
          console.error('Error:', error);
          return [];
      } finally {
      }
    };

      const btv1Rows = favoritesBtv1List.map(item=>({
        ...item,
				source:'Backtest Engine v1.0'}))
			const btv2Rows = (await fetchData(favoritesBtv2List)).map(item => ({...item, source:'Backtest Engine v2.0'}))
      const dedupedRows = new Map()
      const allRows = [...btv1Rows, ...btv2Rows]
      allRows.forEach(item => {
        if (item && item.url && !dedupedRows.has(item.url)) {
          dedupedRows.set(item.url, item)
        }
      })
      return Array.from(dedupedRows.values())
    // return getFavorite()
    // 还要遍历获取每个的具体信息
  },
  getIndicatorCards() {
    // TODO: connect real Sentiment Indicators chart-card API here.
    return getFavorite()
  },
  getSentimentIndicatorChartData(url) {
    return axios.get(`https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/get_data?index=${encodeURIComponent(url)}`)
  },
  getTrendRows() {
    // TODO: connect real Trend Score Board API here.
    return obtainIndicatorsList('sector_trend_score')
  }
}

export default {
  name: 'NewDashboard',
  data() {
    return {
      dashboardLoading: false,
      dashboardRequestError: '',
      dashboardDate: '',
      activeView: 'all',
      activeHubTab: 'signals',
      activeSignalsTab: 'my-signals',
      activeSignalConditions: null,
      hubSearch: '',
      sentimentIndicatorSearch: '',
      serverSearchTimer: null,
      sentimentChartTimer: null,
      watchlistSearchTimer: null,
      lastSignalDate: '',
      lastSignalDateFetched: false,
      indicatorView: 'table',
      chartCardsLoading: false,
      sentimentChartRequestId: 0,
      watchlistSearch: '',
      watchlistAssetType: '',
      watchlistSetName: 'default',
      selectedWatchlistSetName: '',
      watchlistSets: [],
      watchlistSymbols: [],
      activeWatchlistConfig: null,
      watchlistConfigLoading: false,
      watchlistConfigMessage: '',
      suppressWatchlistFilterFetch: false,
      watchlistPage: 1,
      watchlistTotal: 0,
      watchlistLoading: false,
      activeMarketConfigIndex: 0,
      activeMarketGroup: 'sp1500',
      marketScreenConfigs: [],
      marketPage: 1,
      marketTotal: 0,
      marketLoading: false,
      marketConfigMessage: '',
      suppressMarketFilterSave: false,
      singleTicker: '',
      selectedWatchTickers: [],
      watchlistSelectAll: false,
      newColumnType: '',
      settingsOpen: false,
      savedFilter: '',
      pageSize: DASHBOARD_PAGE_SIZE,
      metricPageSize: METRIC_PAGE_SIZE,
      signalsPagination: {
        'my-signals': 1,
        'st-signals': 1
      },
      myIndicatorsPage: 1,
      myIndicatorsTotal: 0,
      reportsPage: 1,
      reportsTotal: 0,
      sentimentIndicatorsPage: 1,
      sentimentChartCards: [],
      expandedMyIndicators: {},
      sortStates: {
        signals: { key: '', direction: 'asc' },
        myIndicators: { key: '', direction: 'asc' },
        reports: { key: '', direction: 'asc' },
        watchlist: { key: '', direction: 'asc' },
        marketRows: { key: '', direction: 'asc' },
        sentimentIndicators: { key: '', direction: 'asc' },
        trendRows: { key: '', direction: 'asc' }
      },
      dashboardViews: [
        { value: 'all', label: 'Overview (All)' },
        { value: 'signals', label: 'My Stuff' },
        { value: 'watchlist', label: 'My Watchlist' },
        { value: 'market', label: 'My Tools' }
      ],
      hubTabs: [
        { value: 'signals', label: 'My Signals' },
        { value: 'indicators', label: 'My Indicators' },
        { value: 'reports', label: 'My Favorites Reports' }
      ],
      collapsedPanels: {
        research: false,
        watchlist: false,
        marketScreen: false,
        sentiment: false,
        trend: false
      },
      columns: [
        { id: 'symbol', name: 'Ticker', visible: true },
        { id: 'data_date', name: 'Date', visible: true },
        { id: 'close', name: 'Close', visible: true },
        { id: 'optix', name: 'Optix', visible: true },
        { id: 'trend', name: 'Trend Score', visible: true },
        { id: 'reltrend', name: 'RelTrend Score', visible: true },
        { id: 'volatility_20d', name: 'HV20', visible: true },
        { id: 'volatility_60d', name: 'HV60', visible: true }
      ],
      tempColumns: [],
      customColumnOptions: [
        { value: 'symbol', label: 'Ticker' },
        { value: 'data_date', label: 'Date' },
        { value: 'close', label: 'Close' },
        { value: 'optix', label: 'Optix' },
        { value: 'trend', label: 'Trend Score' },
        { value: 'reltrend', label: 'RelTrend Score' },
        { value: 'volatility_20d', label: 'HV20' },
        { value: 'volatility_60d', label: 'HV60' }
      ],
      watchListData: [],
      mySignalsData: [],
      stSignalsData: [],
      myIndicators: [],
      reports: [],
      marketGroupOptions: [
        { value: 'sp1500', label: 'S&P 1500' },
        { value: 'sp500', label: 'S&P 500' },
        { value: 'ndx', label: 'NDX' },
        { value: 'russell', label: 'Russell' },
        { value: 'etf', label: 'ETF' }
      ],
      marketFilters: {
        optix: 'Any',
        trend: 'Any',
        reltrend: 'Any',
        volatility_20d: 'Any',
        volatility_60d: 'Any'
      },
      marketFilterFields: [
        { key: 'optix', label: 'Optix', options: ['Any', '>= 70', '>= 80', '<= 30', '<= 20'] },
        { key: 'trend', label: 'Trend Score', options: ['Any', '>= 6', '>= 8', '<= 2'] },
        { key: 'reltrend', label: 'RelTrend Score', options: ['Any', '>= 6', '>= 8', '<= 2'] },
        { key: 'volatility_20d', label: 'HV20', options: ['Any', '>= 30', '<= 15'] },
        { key: 'volatility_60d', label: 'HV60', options: ['Any', '>= 30', '<= 15'] }
      ],
      marketColumns: [
        { id: 'symbol', name: 'Ticker', visible: true },
        { id: 'data_date', name: 'Date', visible: true },
        { id: 'close', name: 'Close', visible: true },
        { id: 'optix', name: 'Optix', visible: true },
        { id: 'trend', name: 'Trend Score', visible: true },
        { id: 'reltrend', name: 'RelTrend Score', visible: true },
        { id: 'volatility_20d', name: 'HV20', visible: true },
        { id: 'volatility_60d', name: 'HV60', visible: true }
      ],
      marketRows: [],
      sentimentIndicators: [],
      indicatorCards: [],
      trendRows: [
        {
          index_name: "Communication Services",
          sector: "XLC",
          ts_above_zero: 30.43,
          ts_above_five: 34.78,
          ts_equal_ten: 26.09,
          rts_above_zero: 34.78,
          rts_above_five: 17.39,
          rts_equal_ten: 34.78,
          rts_equal_ten_spx: 1.19,
          last_date: "2023-11-10",
          constituent_trend_score: 4.34783,
          pct_rank_10_gte_80: 30.4348,
          pct_rank_10_lte_20: 56.5217,
          pct_rank_126_gte_80: 17.3913,
          pct_rank_126_lte_20: 34.7826,
          pct_rank_42_gte_80: 17.3913,
          pct_rank_42_lte_20: 43.4783,
          reltrend_above8_ratio: 26.09,
          reltrend_above8_spx_ratio: 1.19,
          reltrend_below2_ratio: 34.78,
          trend_above8_ratio: 30.43,
          trend_and_reltrend_above8_ratio: 17.39,
          trend_and_reltrend_below2_ratio: 34.78,
          trend_below2_ratio: 34.78
      }
      ]
    }
  },
  components: {
    AboutUs
  },
  mounted() {
    this.loadDashboardData()
  },
  computed: {
    ...mapGetters({
      favoritesBtv1List: 'getIndicatorPageBtv1List',
      favoritesBtv2List: 'getFavoriteIndicatorList',
      favoriteSymbolList: 'getFavoriteSymbolList'
    }),
    sentimentList() {
      const data = localStorage.getItem('refactoredSentimentList');
      return data ? JSON.parse(data) : [];
    },
    symbolList() {
      const data = localStorage.getItem('refactoredConcatList');
      return data ? JSON.parse(data) : [];
    },
    hubSearchPlaceholder() {
      if (this.activeHubTab === 'signals') return 'Search My Signals...'
      if (this.activeHubTab === 'indicators') return 'Search indicators...'
      return 'Search reports...'
    },
    dashboardDateNote() {
      return this.dashboardDate ? `Data current as of ${this.dashboardDate}` : 'Data current as of -'
    },
    activeSignalsData() {
      return this.activeSignalsTab === 'my-signals' ? this.mySignalsData : this.stSignalsData
    },
    activeSignalsPage() {
      return this.signalsPagination[this.activeSignalsTab] || 1
    },
    filteredSignals() {
      const rows = this.filterRows(this.activeSignalsData, ['name', 'symbol', 'signal', 'timeframe'])
      return this.prioritizeLastSignalRows(this.sortRows(rows, 'signals'))
    },
    paginatedSignals() {
      return this.paginateRows(this.filteredSignals, this.activeSignalsPage)
    },
    hasLastSignalHighlightedRows() {
      return this.filteredSignals.some(row => row.isLastSignalToday)
    },
    filteredMyIndicators() {
      return this.sortRows(this.myIndicators, 'myIndicators')
    },
    filteredReports() {
      return this.sortRows(this.reports, 'reports')
    },
    myIndicatorsTotalCount() {
      return this.myIndicatorsTotal || this.myIndicators.length
    },
    reportsTotalCount() {
      return this.reportsTotal || this.reports.length
    },
    filteredSentimentIndicators() {
      const rows = this.filterRowsByQuery(
        this.sentimentIndicators,
        ['chart_name', 'sub_type', 'timeframe', 'last_value', 'last_change', 'last_update', 'source', 'url'],
        this.sentimentIndicatorSearch
      )
      return this.sortRows(rows, 'sentimentIndicators', {
        chart_name: row => row.chart_name || row.name,
        last_update: row => row.last_update || row.date
      })
    },
    paginatedSentimentIndicators() {
      return this.paginateRows(this.filteredSentimentIndicators, this.sentimentIndicatorsPage)
    },
    sentimentIndicatorsTotalCount() {
      return this.filteredSentimentIndicators.length
    },
    visibleColumns() {
      return this.columns.filter(column => column.visible)
    },
    availableTempColumnOptions() {
      const currentIds = new Set((this.tempColumns || []).map(column => column.id))
      return this.customColumnOptions.filter(column => !currentIds.has(column.value))
    },
    sortedWatchListData() {
      return this.sortRows(this.watchListData, 'watchlist')
    },
    watchlistTotalCount() {
      return this.watchlistTotal || this.watchListData.length
    },
    watchlistEmptyText() {
      return String(this.watchlistSearch || '').trim()
        ? 'No matching symbols found.'
        : 'No data'
    },
    visibleMarketColumns() {
      return this.marketColumns.filter(column => column.visible)
    },
    marketTotalCount() {
      return this.marketTotal || this.marketRows.length
    },
    allWatchSelected: {
      get() {
        return this.watchlistSelectAll
      },
      set(checked) {
        const tickers = this.sortedWatchListData
          .map(row => this.getWatchlistRowTicker(row))
          .filter(Boolean)
        if (checked && tickers.length) {
          this.watchlistSelectAll = true
          this.selectedWatchTickers = tickers
          return
        }
        this.watchlistSelectAll = false
        this.selectedWatchTickers = []
      }
    },
    filteredMarketRows() {
      return this.sortRows(this.marketRows, 'marketRows')
    },
    sortedTrendRows() {
      return this.sortRows(this.trendRows, 'trendRows')
    }
  },
  watch: {
    hubSearch() {
      if (this.activeHubTab === 'signals') this.changeSignalsPage(1)
      if (this.activeHubTab === 'indicators' || this.activeHubTab === 'reports') this.queueServerSearch()
    },
    activeSignalsTab() {
      this.changeSignalsPage(1)
    },
    activeHubTab() {
      this.hubSearch = ''
    },
    sentimentIndicatorSearch() {
      this.changeSentimentIndicatorsPage(1, false)
      if (this.indicatorView === 'grid') this.queueSentimentChartFetch()
    },
    watchlistSearch() {
      this.queueWatchlistSearch()
    },
    watchlistAssetType() {
      if (this.suppressWatchlistFilterFetch) return
      this.saveWatchlistConfig({ silent: true })
    }
  },
  beforeDestroy() {
    clearTimeout(this.serverSearchTimer)
    clearTimeout(this.sentimentChartTimer)
    clearTimeout(this.watchlistSearchTimer)
  },
  methods: {
    ...mapActions('chart', ['update_indicators_favorite', 'get_indicator_page_btv1_list', 'get_favorite']),
    async loadDashboardData() {
      this.dashboardLoading = true
      this.dashboardRequestError = ''
      try {
        await this.fetchDashboardDate()
        await this.fetchLastSignalDate()
        await Promise.all([
          this.initializeWatchlistData(),
          this.fetchMySignalsData(),
          this.fetchSentimentraderSignalsData(),
          this.fetchMyIndicatorsData(),
          this.fetchFavoriteReportsData(),
          // this.fetchMarketRowsData(),
          this.fetchSentimentIndicatorsData(),
          // this.fetchIndicatorCardsData(),
          this.fetchTrendRowsData()
        ])
      } catch (error) {
        this.dashboardRequestError = error && error.message ? error.message : 'Failed to load dashboard data.'
      } finally {
        this.dashboardLoading = false
      }
    },
    async fetchDashboardDate() {
      try {
        const response = await getDashboardData()
        const data = response && response.data ? response.data : response
        this.dashboardDate = data?.date || data?.data?.date || ''
      } catch (error) {
        this.dashboardDate = ''
      }
    },
    async initializeWatchlistData() {
      await this.fetchMetricWatchlistConfigs()
      const defaultSet = this.watchlistSets.find(set => set.name === this.watchlistSetName) || this.watchlistSets[0]

      if (defaultSet && defaultSet.name) {
        await this.loadMetricWatchlistConfig(defaultSet.name, { silent: true, skipFetch: true })
      } else {
        this.applyMetricWatchlistSettings(this.createDefaultMetricWatchlistConfig(this.watchlistSetName))
      }

      await Promise.all([
        this.fetchWatchlistData({ page: 1 }),
        this.fetchMarketRowsData({ page: 1 })
      ])
    },
    createDefaultMetricWatchlistConfig(name = 'default') {
      return {
        name: name || 'default',
        config_table1: [this.createWatchlistTableConfig({
          name: 'Default Symbols',
          symbols: ['etf_spy', 'etf_qqq', 'etf_iwm', 'etf_gld']
        })],
        config_table2: [this.createMarketScreenConfig({ name: 'SP1500' }, 'sp1500')]
      }
    },
    getDefaultWatchlistColumnIds() {
      return this.getMetricColumnOrder()
    },
    getDefaultMarketColumnIds() {
      return this.getMetricColumnOrder()
    },
    getMetricColumnOrder() {
      return ['symbol', 'data_date', 'close', 'optix', 'trend', 'reltrend', 'volatility_20d', 'volatility_60d']
    },
    normalizeMetricColumnIds(columnIds) {
      const allowedIds = this.getMetricColumnOrder()
      const requestedIds = Array.isArray(columnIds) ? columnIds.filter(Boolean) : []
      const requestedSet = new Set(['symbol', 'data_date', ...requestedIds])
      return allowedIds.filter(id => requestedSet.has(id))
    },
    createWatchlistTableConfig(config = {}) {
      const columns = this.parseWatchlistConfigValue(config.columns, this.getDefaultWatchlistColumnIds())
      const symbols = this.parseWatchlistConfigValue(config.symbols, [])
      const filters = config.filters && typeof config.filters === 'object' ? { ...config.filters } : {}

      return {
        name: config.name || 'My WatchList',
        columns: Array.isArray(columns) && columns.length
          ? this.normalizeMetricColumnIds(columns)
          : this.getDefaultWatchlistColumnIds(),
        filters,
        symbols: this.normalizeTickerList(symbols)
      }
    },
    normalizeWatchlistTableConfigs(value, useDefault = false) {
      const table = this.parseWatchlistConfigValue(value, [])
      const rawConfigs = Array.isArray(table)
        ? table
        : table && typeof table === 'object'
          ? [table]
          : []
      const configs = rawConfigs
        .filter(item => item && typeof item === 'object')
        .map(item => this.createWatchlistTableConfig(item))

      if (configs.length) return configs
      return useDefault ? [this.createWatchlistTableConfig()] : []
    },
    async fetchMetricWatchlistConfigs() {
      try {
        const response = await dashboardApi.getMetricWatchlistSets()
        this.watchlistSets = this.extractMetricWatchlistSets(response)
      } catch (error) {
        this.watchlistSets = []
        console.error(error)
      }
    },
    extractMetricWatchlistSets(response) {
      const responseData = response && response.data !== undefined ? response.data : response
      const data = responseData && responseData.data !== undefined
        ? responseData.data
        : responseData && responseData.results !== undefined
          ? responseData.results
          : responseData
      if (Array.isArray(data)) return data
      if (data && Array.isArray(data.results)) return data.results
      if (data && typeof data === 'object') return [data]
      return []
    },
    async loadSelectedMetricWatchlistConfig() {
      if (!this.selectedWatchlistSetName) return
      await this.loadMetricWatchlistConfig(this.selectedWatchlistSetName)
    },
    async loadMetricWatchlistConfig(name = this.watchlistSetName, options = {}) {
      const setName = String(name || '').trim()
      if (!setName) return

      this.watchlistConfigLoading = true
      if (!options.silent) this.watchlistConfigMessage = ''
      try {
        const response = await dashboardApi.getMetricWatchlistSets({ name: setName })
        const config = this.extractMetricWatchlistSets(response)[0]

        if (config) {
          this.applyMetricWatchlistSettings(config)
        } else {
          this.applyMetricWatchlistSettings(this.createDefaultMetricWatchlistConfig(setName))
        }

        if (!options.skipFetch) {
          await Promise.all([
            this.fetchWatchlistData({ page: 1 }),
            this.fetchMarketRowsData({ page: 1 })
          ])
        }
        if (!options.silent) this.showWatchlistMessage(`Loaded set "${setName}".`)
      } catch (error) {
        console.error(error)
        if (!options.silent) this.showWatchlistMessage('Failed to load watchlist set.')
      } finally {
        this.watchlistConfigLoading = false
      }
    },
    applyMetricWatchlistSettings(config) {
      const tableConfig = this.getMetricWatchlistTableConfig(config)
      const filters = tableConfig.filters && typeof tableConfig.filters === 'object' ? tableConfig.filters : {}
      const marketConfigs = this.getMetricWatchlistTable2Configs(config)

      this.activeWatchlistConfig = config || null
      this.watchlistSetName = (config && config.name) || this.watchlistSetName || 'default'
      this.selectedWatchlistSetName = this.watchlistSetName
      this.watchlistSymbols = this.normalizeTickerList(this.parseWatchlistConfigValue(tableConfig.symbols, []))
      this.selectedWatchTickers = []
      this.watchlistSelectAll = false
      this.marketScreenConfigs = marketConfigs

      this.suppressWatchlistFilterFetch = true
      this.watchlistAssetType = filters.asset_type || ''
      this.$nextTick(() => {
        this.suppressWatchlistFilterFetch = false
      })

      const configColumns = this.parseWatchlistConfigValue(tableConfig.columns, [])
      if (Array.isArray(configColumns) && configColumns.length) {
        this.syncWatchlistColumns(configColumns)
      }
      if (marketConfigs.length) {
        const activeGroupIndex = this.getMarketConfigIndexByGroup(this.activeMarketGroup, marketConfigs)
        this.activeMarketConfigIndex = activeGroupIndex >= 0
          ? activeGroupIndex
          : Math.min(this.activeMarketConfigIndex, marketConfigs.length - 1)
        this.applyMarketConfigToControls(marketConfigs[this.activeMarketConfigIndex])
      }
    },
    getMetricWatchlistTableConfig(config = this.activeWatchlistConfig) {
      return this.normalizeWatchlistTableConfigs(config && config.config_table1, true)[0]
    },
    getMetricWatchlistTable1Configs(config = this.activeWatchlistConfig, useDefault = false) {
      return this.normalizeWatchlistTableConfigs(config && config.config_table1, useDefault)
    },
    getMetricWatchlistTable2Configs(config = this.activeWatchlistConfig, ensureAll = true) {
      const table = this.parseWatchlistConfigValue(config && config.config_table2, [])
      return this.normalizeMarketScreenConfigs(table, ensureAll)
    },
    parseWatchlistConfigValue(value, fallback) {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch (error) {
          return fallback
        }
      }
      return value === undefined || value === null ? fallback : value
    },
    async fetchAppliedWatchlistData(params = {}) {
      const page = Number(params.page || this.watchlistPage || 1)
      const name = params.name || this.watchlistSetName || 'default'

      this.watchlistLoading = true
      try {
        const response = await dashboardApi.applyMetricWatchlistSet({
          name,
          table: 1,
          paginate: true,
          page,
          page_size: this.metricPageSize,
          ordering: this.getWatchlistOrdering()
        })
        const { rows, total, columns } = this.normalizeMetricApplyResponse(response)

        if (columns.length) this.syncWatchlistColumns(columns)
        this.watchlistPage = page
        this.watchlistTotal = total
        this.watchListData = rows
        this.watchlistSymbols = this.normalizeTickerList(
          this.watchlistSymbols.length ? this.watchlistSymbols : this.extractWatchlistSymbols(rows)
        )
        this.selectedWatchTickers = []
        this.watchlistSelectAll = false
      } finally {
        this.watchlistLoading = false
      }
    },
    normalizeMetricApplyResponse(response) {
      const responseData = response && response.data !== undefined ? response.data : response
      const data = responseData && responseData.data !== undefined ? responseData.data : responseData
      const table = Array.isArray(data) ? data[0] : data
      const resultData = table && table.results !== undefined ? table.results : table
      const rows = Array.isArray(resultData && resultData.results)
        ? resultData.results
        : Array.isArray(resultData)
          ? resultData
          : []
      const total = Number(
        (resultData && resultData.count) ||
        (table && table.count) ||
        (responseData && responseData.count) ||
        rows.length
      )
      const columns = table && Array.isArray(table.columns) ? table.columns : []
      return { rows, total, columns }
    },
    async fetchWatchlistData(params = {}) {
      const page = Number(params.page || this.watchlistPage || 1)
      const search = String(this.watchlistSearch || '').trim().toLowerCase()
      const tableConfig = this.getMetricWatchlistTableConfig()
      const configSymbols = this.normalizeTickerList(this.parseWatchlistConfigValue(tableConfig.symbols, []))
      const symbols = configSymbols.length ? configSymbols : this.normalizeTickerList(this.watchlistSymbols)

      this.watchlistLoading = true
      try {
        const response = await dashboardApi.applyMetricWatchlistSet({
          name: this.watchlistSetName || 'default',
          table: 1,
          paginate: true,
          page: search ? 1 : page,
          page_size: search ? 1000 : this.metricPageSize,
          ordering: this.getWatchlistOrdering()
        })
        const { rows: appliedRows, total, columns } = this.normalizeMetricApplyResponse(response)
        let rows = appliedRows

        if (columns.length) this.syncWatchlistColumns(columns)
        if (search) {
          rows = rows.filter(row => this.getWatchlistDisplayTicker(row).toLowerCase().includes(search))
        }

        this.watchlistPage = page
        this.watchlistTotal = search ? rows.length : total
        this.watchListData = search ? rows.slice((page - 1) * this.metricPageSize, page * this.metricPageSize) : rows
        this.watchlistSymbols = symbols.length ? symbols : this.extractWatchlistSymbols(rows)
        this.selectedWatchTickers = []
        this.watchlistSelectAll = false
      } finally {
        this.watchlistLoading = false
      }
    },
    buildCurrentWatchlistTableConfig() {
      const currentTable = this.getMetricWatchlistTableConfig()
      const filters = currentTable.filters && typeof currentTable.filters === 'object'
        ? { ...currentTable.filters }
        : {}

      if (this.watchlistAssetType) {
        filters.asset_type = this.watchlistAssetType
      } else {
        delete filters.asset_type
      }

      const columns = Array.from(new Set(['symbol', ...this.visibleColumns.map(column => column.id)]))
      const symbols = this.normalizeTickerList(this.watchlistSymbols)

      return this.createWatchlistTableConfig({
        ...currentTable,
        name: currentTable.name || 'My WatchList',
        columns,
        filters,
        symbols
      })
    },
    buildMetricWatchlistPayload(options = {}) {
      const name = String(this.watchlistSetName || this.selectedWatchlistSetName || 'default').trim()
      const payload = { name }

      if (Object.prototype.hasOwnProperty.call(options, 'configTable1')) {
        payload.config_table1 = options.configTable1 === null
          ? null
          : this.normalizeWatchlistTableConfigs(options.configTable1, true)
      }
      if (Object.prototype.hasOwnProperty.call(options, 'configTable2')) {
        payload.config_table2 = options.configTable2 === null
          ? null
          : this.normalizeMarketScreenConfigs(options.configTable2, false)
      }
      return {
        ...payload
      }
    },
    extractSavedMetricWatchlistConfig(response) {
      const responseData = response && response.data !== undefined ? response.data : response
      const data = responseData && responseData.data !== undefined ? responseData.data : responseData
      if (Array.isArray(data)) return data[0] || null
      return data && typeof data === 'object' ? data : null
    },
    mergeMetricWatchlistConfig(payload, savedConfig = {}) {
      const activeConfig = this.activeWatchlistConfig || {}
      const nextConfig = {
        ...activeConfig,
        ...savedConfig,
        name: (savedConfig && savedConfig.name) || payload.name || activeConfig.name || 'default'
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'config_table1')) {
        nextConfig.config_table1 = savedConfig && savedConfig.config_table1 !== undefined
          ? savedConfig.config_table1
          : payload.config_table1
      } else if (nextConfig.config_table1 === undefined) {
        nextConfig.config_table1 = activeConfig.config_table1
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'config_table2')) {
        nextConfig.config_table2 = payload.config_table2
      } else if (nextConfig.config_table2 === undefined) {
        nextConfig.config_table2 = activeConfig.config_table2
      }

      return nextConfig
    },
    async saveMetricWatchlistConfig(options = {}) {
      const payload = this.buildMetricWatchlistPayload(options)
      if (!payload.name) return

      this.watchlistConfigLoading = true
      if (!options.silent) this.watchlistConfigMessage = ''
      try {
        const response = await dashboardApi.saveMetricWatchlistSet(payload)
        const savedConfig = this.extractSavedMetricWatchlistConfig(response) || {}
        this.applyMetricWatchlistSettings(this.mergeMetricWatchlistConfig(payload, savedConfig))
        await this.fetchMetricWatchlistConfigs()
        if (!options.silent) this.showWatchlistMessage('Watchlist updated.')
        return true
      } catch (error) {
        console.error(error)
        if (!options.silent) this.showWatchlistMessage('Failed to update watchlist.')
        return false
      } finally {
        this.watchlistConfigLoading = false
      }
    },
    async saveWatchlistConfig(options = {}) {
      const saved = await this.saveMetricWatchlistConfig({
        configTable1: [this.buildCurrentWatchlistTableConfig()],
        silent: options.silent !== false
      })
      if (saved && !options.skipApply) {
        const page = Number(options.applyPage || 1)
        await this.fetchWatchlistData({ page })
      }
    },
    syncWatchlistColumns(columnIds) {
      const catalog = this.getWatchlistColumnCatalog()
      const nextIds = this.normalizeMetricColumnIds(columnIds)
      const nextColumns = nextIds
        .map(id => catalog.find(column => column.id === id) || {
          id,
          name: id.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
          visible: true
        })
        .map(column => ({ ...column, visible: true }))
      const hiddenColumns = catalog
        .filter(column => !nextIds.includes(column.id))
        .map(column => ({ ...column, visible: false }))

      this.columns = [...nextColumns, ...hiddenColumns]
    },
    getWatchlistColumnCatalog() {
      return [
        { id: 'symbol', name: 'Ticker', visible: true },
        { id: 'data_date', name: 'Date', visible: true },
        { id: 'close', name: 'Close', visible: true },
        { id: 'optix', name: 'Optix', visible: true },
        { id: 'trend', name: 'Trend Score', visible: true },
        { id: 'reltrend', name: 'RelTrend Score', visible: true },
        { id: 'volatility_20d', name: 'HV20', visible: true },
        { id: 'volatility_60d', name: 'HV60', visible: true }
      ]
    },
    extractWatchlistSymbols(rows) {
      return this.normalizeTickerList(
        (Array.isArray(rows) ? rows : []).map(row => row && (row.symbol || row.ticker || row.market_symbol))
      )
    },
    normalizeTickerList(values) {
      return Array.from(new Set(
        (Array.isArray(values) ? values : [])
          .map(value => this.normalizeWatchlistSymbol(value))
          .filter(Boolean)
      ))
    },
    normalizeWatchlistSymbol(value) {
      const text = String(value || '').trim()
      if (!text) return ''
      return text.includes('_') ? text.toLowerCase() : text.toUpperCase()
    },
    normalizeTickerInput(value) {
      return this.formatWatchlistTicker(value).trim()
    },
    getWatchlistRowTicker(row) {
      return this.normalizeWatchlistSymbol(row && (row.symbol || row.ticker || row.market_symbol))
    },
    getWatchlistDisplayTicker(row) {
      return this.formatWatchlistTicker(row && (row.symbol || row.ticker || row.market_symbol))
    },
    getConfiguredWatchlistSymbols() {
      const tableConfig = this.getMetricWatchlistTableConfig()
      return this.normalizeTickerList(this.parseWatchlistConfigValue(tableConfig.symbols, []))
    },
    getCurrentWatchlistSymbols() {
      const configuredSymbols = this.getConfiguredWatchlistSymbols()
      if (configuredSymbols.length) return configuredSymbols
      if (this.watchlistSymbols.length) return this.normalizeTickerList(this.watchlistSymbols)
      return this.extractWatchlistSymbols(this.watchListData)
    },
    isWatchTickerSelected(row) {
      const ticker = this.getWatchlistRowTicker(row)
      if (!ticker) return false
      return this.watchlistSelectAll || this.selectedWatchTickers.includes(ticker)
    },
    toggleWatchTickerSelection(row, checked) {
      const ticker = this.getWatchlistRowTicker(row)
      if (!ticker) return

      this.watchlistSelectAll = false
      const selected = new Set(this.selectedWatchTickers.map(item => this.normalizeWatchlistSymbol(item)))
      if (checked) {
        selected.add(ticker)
      } else {
        selected.delete(ticker)
      }
      this.selectedWatchTickers = Array.from(selected)
    },
    showWatchlistMessage(message) {
      this.watchlistConfigMessage = message
    },
    resolveMarketGroupValue(name) {
      const text = String(name || '').trim().toLowerCase()
      if (!text) return ''
      const aliases = {
        sp1500: 'sp1500',
        sp_1500: 'sp1500',
        sp500: 'sp500',
        sp_500: 'sp500',
        's&p 1500': 'sp1500',
        's&p 500': 'sp500',
        ndx100: 'ndx',
        'ndx 100': 'ndx',
        domestic_etf: 'etf',
        foreign_etf: 'etf',
        other: 'etf',
        'domestic etf': 'etf',
        'foreign etf': 'etf',
        'other assets': 'etf',
        etf: 'etf'
      }
      if (aliases[text]) return aliases[text]
      const group = this.marketGroupOptions.find(item =>
        item.value.toLowerCase() === text ||
        item.label.toLowerCase() === text
      )
      return group ? group.value : ''
    },
    getMarketConfigGroup(config = {}) {
      const groups = this.parseWatchlistConfigValue(config.groups, [])
      if (Array.isArray(groups) && groups[0]) return this.resolveMarketGroupValue(groups[0]) || groups[0]
      return this.resolveMarketGroupValue(config.name)
    },
    getMarketConfigIndexByGroup(group, configs = this.marketScreenConfigs) {
      const groupValue = this.resolveMarketGroupValue(group) || group
      return (Array.isArray(configs) ? configs : []).findIndex(config => this.getMarketConfigGroup(config) === groupValue)
    },
    createMarketScreenConfig(config = {}, groupValue = '') {
      const activeGroup = groupValue || this.getMarketConfigGroup(config) || 'sp1500'
      const group = this.marketGroupOptions.find(item => item.value === activeGroup) || this.marketGroupOptions[0]
      const columns = this.parseWatchlistConfigValue(config.columns, this.getDefaultMarketColumnIds())
      const ranges = config.ranges && typeof config.ranges === 'object' ? { ...config.ranges } : {}

      return {
        name: (group && group.label) || config.name || 'Market Screen',
        groups: [activeGroup],
        ranges,
        columns: Array.isArray(columns) && columns.length
          ? this.normalizeMetricColumnIds(columns)
          : this.getDefaultMarketColumnIds()
      }
    },
    createDefaultMarketScreenConfigs(configs = []) {
      const existingConfigs = Array.isArray(configs) ? configs : []
      const configsByGroup = existingConfigs.reduce((map, config) => {
        const group = this.getMarketConfigGroup(config)
        if (group && !map.has(group)) map.set(group, config)
        return map
      }, new Map())

      return this.marketGroupOptions.map(group =>
        this.createMarketScreenConfig(configsByGroup.get(group.value) || {}, group.value)
      )
    },
    normalizeMarketScreenConfigs(value, ensureAll = true) {
      const table = this.parseWatchlistConfigValue(value, [])
      const rawConfigs = Array.isArray(table)
        ? table
        : table && typeof table === 'object'
          ? [table]
          : []
      const configs = rawConfigs
        .filter(item => item && typeof item === 'object')
        .map(item => this.createMarketScreenConfig(item))

      return ensureAll ? this.createDefaultMarketScreenConfigs(configs) : configs
    },
    buildMarketScreenConfig() {
      return {
        name: this.getMarketConfigName(),
        groups: [this.activeMarketGroup],
        ranges: this.buildMarketRanges(),
        columns: this.visibleMarketColumns.map(column => column.id)
      }
    },
    getMarketConfigName() {
      const group = this.marketGroupOptions.find(item => item.value === this.activeMarketGroup)
      return group ? group.label : 'Market Screen'
    },
    buildMarketRanges() {
      return Object.keys(this.marketFilters).reduce((ranges, key) => {
        const range = this.parseRangeOption(this.marketFilters[key])
        if (range) ranges[key] = range
        return ranges
      }, {})
    },
    parseRangeOption(option) {
      const text = String(option || '')
      const gte = text.match(/^(?:>=|≥|Above)\s+(-?\d+(?:\.\d+)?)$/i)
      if (gte) return { min: Number(gte[1]), max: null }
      const lte = text.match(/^(?:<=|≤|Below)\s+(-?\d+(?:\.\d+)?)$/i)
      if (lte) return { min: null, max: Number(lte[1]) }
      return null
    },
    formatRangeOption(range) {
      if (!range || typeof range !== 'object') return 'Any'
      if (range.min !== null && range.min !== undefined) return `>= ${range.min}`
      if (range.max !== null && range.max !== undefined) return `<= ${range.max}`
      return 'Any'
    },
    getDefaultMarketFilters() {
      return Object.keys(this.marketFilters).reduce((filters, key) => {
        filters[key] = 'Any'
        return filters
      }, {})
    },
    async refreshMarketResults() {
      this.marketFilters = this.getDefaultMarketFilters()
      await this.saveMarketScreenConfig({ silent: true })
    },
    applyMarketConfigToControls(config) {
      const marketConfig = config || {}
      const groups = this.parseWatchlistConfigValue(marketConfig.groups, [])
      const ranges = marketConfig.ranges && typeof marketConfig.ranges === 'object' ? marketConfig.ranges : {}
      const nextFilters = {}

      Object.keys(this.marketFilters).forEach(key => {
        nextFilters[key] = this.formatRangeOption(ranges[key])
      })

      this.suppressMarketFilterSave = true
      this.activeMarketGroup = this.resolveMarketGroupValue(groups[0]) || this.activeMarketGroup || 'sp1500'
      this.marketFilters = nextFilters
      this.syncMarketColumns(this.parseWatchlistConfigValue(marketConfig.columns, []))
      this.$nextTick(() => {
        this.suppressMarketFilterSave = false
      })
    },
    syncMarketColumns(columnIds) {
      const catalog = this.getWatchlistColumnCatalog()
      const ids = Array.isArray(columnIds) && columnIds.length
        ? columnIds
        : this.getDefaultMarketColumnIds()

      this.marketColumns = this.normalizeMetricColumnIds(ids)
        .map(id => catalog.find(column => column.id === id) || {
          id,
          name: id.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
          visible: true
        })
        .map(column => ({ ...column, visible: true }))
    },
    cloneMarketRanges(ranges = {}) {
      return Object.keys(ranges).reduce((nextRanges, key) => {
        const range = ranges[key]
        nextRanges[key] = range && typeof range === 'object' ? { ...range } : range
        return nextRanges
      }, {})
    },
    syncMarketRangesToConfigs(configs, ranges) {
      const syncedRanges = this.cloneMarketRanges(ranges)
      return this.normalizeMarketScreenConfigs(configs, true).map(config => this.createMarketScreenConfig({
        ...config,
        ranges: this.cloneMarketRanges(syncedRanges)
      }))
    },
    async saveMarketScreenConfig(options = {}) {
      if (this.suppressMarketFilterSave) return
      let nextConfigs = this.normalizeMarketScreenConfigs(this.marketScreenConfigs, true)
      const groupIndex = this.getMarketConfigIndexByGroup(this.activeMarketGroup, nextConfigs)
      const index = groupIndex >= 0
        ? groupIndex
        : Math.max(Number(this.activeMarketConfigIndex) || 0, 0)
      const activeConfig = this.buildMarketScreenConfig()
      nextConfigs[index] = activeConfig
      nextConfigs = this.syncMarketRangesToConfigs(nextConfigs, activeConfig.ranges)
      this.marketScreenConfigs = nextConfigs
      this.activeMarketConfigIndex = index

      const saved = await this.saveMetricWatchlistConfig({
        configTable2: nextConfigs,
        silent: true
      })
      if (options.silent === false) this.marketConfigMessage = saved ? 'Market Screen updated.' : 'Failed to update Market Screen.'
      if (!options.skipApply) await this.fetchMarketRowsData({ page: 1 })
    },
    buildMarketMetricsParams(config, page) {
      const marketConfig = config || {}
      const groups = this.parseWatchlistConfigValue(marketConfig.groups, [])
      const ranges = marketConfig.ranges && typeof marketConfig.ranges === 'object' ? marketConfig.ranges : {}
      const params = {
        paginate: true,
        page,
        page_size: this.metricPageSize,
        ordering: this.getMarketRowsOrdering()
      }

      if (Array.isArray(groups) && groups.length) params.groups = groups.join(',')
      Object.keys(ranges).forEach(field => {
        const range = ranges[field]
        if (!range || typeof range !== 'object') return
        if (range.min !== null && range.min !== undefined) params[`${field}_min`] = range.min
        if (range.max !== null && range.max !== undefined) params[`${field}_max`] = range.max
      })
      return params
    },
    normalizeAssetMetricsResponse(response) {
      const responseData = response && response.data !== undefined ? response.data : response
      const data = responseData && responseData.data !== undefined ? responseData.data : responseData
      const rows = Array.isArray(data && data.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : []
      const total = Number((data && data.count) || rows.length)
      return { rows, total, columns: rows[0] ? Object.keys(rows[0]) : [] }
    },
    async fetchMarketRowsData(params = {}) {
      const page = Number(params.page || this.marketPage || 1)

      if (!this.marketScreenConfigs.length) {
        this.marketScreenConfigs = this.createDefaultMarketScreenConfigs()
      }

      const savedMarketConfigs = this.normalizeMarketScreenConfigs(
        this.activeWatchlistConfig && this.activeWatchlistConfig.config_table2,
        false
      )
      const savedIndex = this.getMarketConfigIndexByGroup(this.activeMarketGroup, savedMarketConfigs)
      const currentConfig = this.marketScreenConfigs[this.activeMarketConfigIndex] || this.createMarketScreenConfig()

      this.marketLoading = true
      try {
        const response = savedIndex >= 0
          ? await dashboardApi.applyMetricWatchlistSet({
            name: this.watchlistSetName || 'default',
            table: 2,
            index: savedIndex,
            paginate: true,
            page,
            page_size: this.metricPageSize,
            ordering: this.getMarketRowsOrdering()
          })
          : await dashboardApi.getWatchlist(this.buildMarketMetricsParams(currentConfig, page))
        const { rows, total, columns } = savedIndex >= 0
          ? this.normalizeMetricApplyResponse(response)
          : this.normalizeAssetMetricsResponse(response)
        if (columns.length) this.syncMarketColumns(columns)
        this.marketRows = rows
        this.marketTotal = total
        this.marketPage = page
      } catch (error) {
        console.error(error)
        this.marketRows = []
        this.marketTotal = 0
      } finally {
        this.marketLoading = false
      }
    },
    async changeMarketGroup(group) {
      const groupValue = this.resolveMarketGroupValue(group) || group
      let nextConfigs = this.normalizeMarketScreenConfigs(this.marketScreenConfigs, true)
      let index = this.getMarketConfigIndexByGroup(groupValue, nextConfigs)

      if (index < 0) {
        nextConfigs = this.createDefaultMarketScreenConfigs(nextConfigs)
        index = this.getMarketConfigIndexByGroup(groupValue, nextConfigs)
      }

      this.marketScreenConfigs = nextConfigs
      this.activeMarketConfigIndex = Math.max(index, 0)
      this.applyMarketConfigToControls(this.marketScreenConfigs[this.activeMarketConfigIndex])
      await this.fetchMarketRowsData({ page: 1 })
    },
    async loadMarketScreenConfigByIndex() {
      const configs = this.normalizeMarketScreenConfigs(this.marketScreenConfigs, true)
      const index = Math.min(Math.max(Number(this.activeMarketConfigIndex) || 0, 0), configs.length - 1)
      this.marketScreenConfigs = configs
      this.activeMarketConfigIndex = index
      this.applyMarketConfigToControls(configs[index])
      await this.fetchMarketRowsData({ page: 1 })
    },
    getMarketRowSymbol(row) {
      return this.normalizeWatchlistSymbol(row && (row.symbol || row.ticker || row.market_symbol))
    },
    formatMarketCell(row, columnId) {
      return this.formatWatchlistCell(row, columnId)
    },
    async fetchLastSignalDate() {
      try {
        const res = await dashboardApi.getLastSignalDate()
        const code = res && res.data ? res.data.code : ''
        this.lastSignalDate = code === 217 ? this.normalizeSignalDate(res.data.data) : ''
      } catch (error) {
        console.error(error)
        this.lastSignalDate = ''
      } finally {
        this.lastSignalDateFetched = true
      }
    },
    async ensureLastSignalDate() {
      if (this.lastSignalDateFetched) return
      await this.fetchLastSignalDate()
    },
    normalizeSignalDate(value) {
      const text = this.toSortString(value).trim()
      if (!text || text.startsWith('2099-')) return ''

      const dateMatch = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
      if (dateMatch) {
        const year = dateMatch[1]
        const month = dateMatch[2].padStart(2, '0')
        const day = dateMatch[3].padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      const timestamp = new Date(text).getTime()
      if (Number.isNaN(timestamp)) return text
      return new Date(timestamp).toISOString().slice(0, 10)
    },
    isLastSignalToday(value) {
      const rowDate = this.normalizeSignalDate(value)
      return !!this.lastSignalDate && rowDate === this.lastSignalDate
    },
    prioritizeLastSignalRows(rows) {
      const list = Array.isArray(rows) ? rows : []
      return list
        .map((row, index) => ({ row, index }))
        .sort((left, right) => {
          const leftHighlighted = left.row && left.row.isLastSignalToday ? 1 : 0
          const rightHighlighted = right.row && right.row.isLastSignalToday ? 1 : 0
          if (leftHighlighted !== rightHighlighted) return rightHighlighted - leftHighlighted
          return left.index - right.index
        })
        .map(item => item.row)
    },
    async fetchMySignalsData() {
      await this.ensureLastSignalDate()
      let {data, status} = await dashboardApi.getMySignals()
      const parseJsonOrString = (value) => {
          if (typeof value === 'string') {
              try {
                  return JSON.parse(value);
              } catch (error) {
                  return [{
                      commentDes: value,
                      rocCond: {
                        newCondition: 3,
                        conditionPeriod: 5
                      }
                  }];
              }
          }
          return value;
			};
      const parseSignalInfo = value => {
        if (typeof value !== 'string') return value || {}
        const normalizedValue = value.replace(/^"+|"+$/g, '').replace(/'/g, '"')
        return isJson(normalizedValue) ? JSON.parse(normalizedValue) : {}
      }

      if(status === 200 && Array.isArray(data)) {
        data = data.map(item => {
          const signalInfo = parseSignalInfo(item.signal_info)
          return {
            ...item,
            signals: isJson(item.signals) ? JSON.parse(item.signals) : item.signals,
            cond: isJson(item.cond) ? JSON.parse(item.cond) : item.cond,
            date: this.normalizeSignalDate(item.lastdate),
            last_signal_date: this.normalizeSignalDate(item.lastdate),
            isLastSignalToday: this.isLastSignalToday(item.lastdate),
            signal: parseJsonOrString(item.description),
            signal_info: signalInfo,
            return: this.displayData(item.current_return),
            bars: item.bars_since_signal,
            analystUrl: signalInfo.report_url || ''
          }
        })
        data = this.prioritizeLastSignalRows(data)
      }

      this.applyListResponse(data, 'mySignalsData')
    },
    async fetchSentimentraderSignalsData() {
      await this.ensureLastSignalDate()
      let {data, status} = await dashboardApi.getSentimentraderSignals()
        const parseJsonOrString = (value) => {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch (error) {
                    return [{
                        commentDes: value,
                        rocCond: {
                          newCondition: 3,
                          conditionPeriod: 5
                        }
                    }];
                }
            }
            return value;
        };
        if(status === 200 && Array.isArray(data)) {
          data = data.map(item => {
            item.signals = isJson(item.signals) ? JSON.parse(item.signals) : item.signals
            item.cond = isJson(item.cond) ? JSON.parse(item.cond) : item.cond
            item.date = this.normalizeSignalDate(item.lastdate)
            item.last_signal_date = this.normalizeSignalDate(item.lastdate)
            item.isLastSignalToday = this.isLastSignalToday(item.lastdate)
            item.signal = parseJsonOrString(item.description)
              if(typeof item.signal_info === 'string') {
                item.signal_info = item.signal_info.replace(/^"+|"+$/g, '')
                item.signal_info = item.signal_info.replace(/'/g, '"')
                item.signal_info = isJson(item.signal_info) ? JSON.parse(item.signal_info) : item.signal_info
              }
              if(!item.signal_info || typeof item.signal_info !== 'object') item.signal_info = {}
              // item.category = item.signal_info.category
              item.analystUrl = item.signal_info.report_url || ''
            item.return = this.displayData(item.current_return)
            item.bars = item.bars_since_signal
            return item
          })
          data = this.prioritizeLastSignalRows(data)
        }
        this.applyListResponse(data, 'stSignalsData')
      },
    async fetchMyIndicatorsData(params = {}) {
      const page = Number(params.page || this.myIndicatorsPage || 1)
      let data = await dashboardApi.getMyIndicators({
        page,
        name: this.hubSearch.trim(),
        page_size: this.pageSize,
        ...params
      })
      const responseData = data && data.data ? data.data : {}
      data = Array.isArray(responseData.results) ? responseData.results : []
      this.myIndicatorsPage = page
      this.myIndicatorsTotal = Number(responseData.count || data.length)
      /** private function */
      const processIndicators = (obj, indicatorList) => {
          const combineTypes = obj.combine_type.split('_');
          for (let i = 1; i <= combineTypes.length; i++) {
              const key = `indicator_${i}`;
              if (combineTypes[i - 1] === 'si') {
                  const newIndicator = `${obj[key]}@indicator`;
                  if (indicatorList.includes(newIndicator)) {
                      obj[key] = newIndicator;
                  }
              }
          }
      }
      /** create 携带aapl optix(url: aapl@indicator)的会上传indicator为aapl,所以在获取列表时把其还原成(aapl@indicator) */
      data.forEach(obj => {
        if(obj.combine_type == 'indicator'){
          if(this.sentimentList.find((i)=>i.url == obj.indicator_1_url+'@indicator')) obj.indicator_1_url = obj.indicator_1_url+'@indicator'
          if(obj.mul_indicator){
            let parsedObj = JSON.parse(obj.mul_indicator)
            processIndicators(parsedObj, this.sentimentList.map(i=>i.url));
            obj.mul_indicator = JSON.stringify(parsedObj)
          }
        }
      });
      data = await this.processRowData(data)
      this.applyListResponse(data, 'myIndicators')
    },
    async processRowData(resData) {
      let promise = resData.map(async item => {
      if (['ratio', 'spread', 'addition'].includes(item.calculate)) {
        const {included, included_url, former, latter, former_url, latter_url, type} = this.getIncludedData(item, this.sentimentList, this.symbolList);
        return {
          ...item,
          categories: `${capitalizeFirstLetter(type)} ${capitalizeFirstLetter(item.calculate)}`,
          included,
          included_url,
          key: item.url,
          former,
          latter,
          former_url,
          latter_url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          type,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
      if (item.calculate === 'weight_combination' && (item.indicator_weight && item.mul_indicator)) {
        const includedWeightDataArr = this.getWeightedIndicatorData(item, this.sentimentList, this.symbolList);
        const included = includedWeightDataArr.map(item=>(item.included))
        const included_url = includedWeightDataArr.map(item=>(item.included_url))
        const weightData = includedWeightDataArr.map(item=>(item.weightData))
        return {
          ...item,
          categories: 'Weighted Indicator Combination',
          included,
          included_url,
          key: item.url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          weightData,
          type: null,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
      if (item.combine_type === 'ohlcv') {
        const {included, included_url, former, latter, former_url, latter_url, type} = this.getSOHLCVIncludedData(item, this.symbolList);
        return {
          ...item,
          indicator_2_url:'', // indicator2爲空
          categories: 'Symbol OHLCV',
          included,
          included_url,
          key: item.url,
          former,
          latter,
          former_url,
          latter_url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          type,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
      if (item.combine_type === 'resample') {
        const {included, included_url, former, latter, former_url, latter_url, type} = this.getResampleIncludedData(item, this.sentimentList);
        console.log(included, included_url, former, latter, former_url, latter_url, type)
        return {
          ...item,
          indicator_2_url:'', // indicator2爲空
          categories: 'Resample',
          included,
          included_url,
          key: item.url,
          former,
          latter,
          former_url,
          latter_url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          type,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
      if (item.combine_type === 'technical_indicator') {
        const {included, included_url, former, latter, former_url, latter_url, type} = this.getSTechIncludedData(item, this.symbolList);

        return {
          ...item,
          indicator_2_url:'', // indicator2爲空
          categories: 'Technical',
          included,
          included_url,
          key: item.url,
          former,
          latter,
          former_url,
          latter_url,
          time_frame: capitalizeFirstLetter(item.timeframe),
          type,
          popTitle: 'Loading...',
          BTList: [],
          visible: false,
          btnLoading: false,
        };
      }
    });
      let data = await Promise.all(promise);
      data = data.filter(
			item => item !== null && item !== undefined && item !== ''
		  )
      console.log('处理过后的数据', data)
      return data
    },
    getWeightedIndicatorData(item, sentimentList, symbolList) {
      const mul_indicator_obj = isJson(item.mul_indicator) ? JSON.parse(item.mul_indicator) : item.mul_indicator;
      const indicator_weight_arr = item.indicator_weight.includes('_') ? item.indicator_weight.split('_') : [item.indicator_weight];
      let combine_type_arr = mul_indicator_obj.combine_type ? (mul_indicator_obj.combine_type.includes('_') ? mul_indicator_obj.combine_type.split('_') : [mul_indicator_obj.combine_type]) : new Array(indicator_weight_arr.length).fill('si')
      combine_type_arr = combine_type_arr.map(item => {
        if(item == 'si') return 'Indicator'
        if(item == 'sy') return 'Symbol'
      })
      return indicator_weight_arr.map((weight, index) => {
        const url = mul_indicator_obj[`indicator_${index + 1}`]
        const typeAttribute = combine_type_arr[index]
        const indicator = (typeAttribute == 'Indicator' && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url.toLocaleLowerCase())?.label) || ''
        const symbol = (typeAttribute == 'Symbol' && symbolList.find(ele => ele.url === url)?.label) || ''
        const symbol_url = (typeAttribute == 'Symbol' && symbolList.find(ele => ele.url === url)?.url) || ''
        const result = indicator || symbol
        const result_url = indicator || symbol_url
        const type = typeAttribute
        const weightData = {
              // weight: (weight * 100).toFixed(2),
              weight: trimTrailingZeros(((Number(weight.replace(/^n/, '-'))) * 100).toFixed(2)),
              indicator: result_url,
              indicator_url: url,
              weightValidErrMsg: '',
              type
              }
        const included = `${result} (weight ${(weight * 100).toFixed()}%)`;
        const included_url = `${result_url} (weight ${(Number(weight.replace(/^n/, '-')) * 100).toFixed()}%)`;
        return {
          included,
          included_url,
          weightData
        }
      });
    },
    getIncludedData(item, sentimentList, symbolList) {
      const url_1 = item.indicator_1_url
      const url_2 = item.indicator_2_url
      const typeAttribute = item.combine_type || 'indicator'
      const indicator_1 = (typeAttribute == 'indicator' && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_1.toLocaleLowerCase())?.label) || ''
      const symbol_1 = (typeAttribute == 'symbol' && symbolList.find(ele => ele.url === url_1)?.label) || ''
      const indicator_2 = (typeAttribute == 'indicator' && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_2.toLocaleLowerCase())?.label) || ''
      const symbol_2 = (typeAttribute == 'symbol' && symbolList.find(ele => ele.url === url_2)?.label) || ''
      const symbol_1_url = (typeAttribute == 'symbol' && symbolList.find(ele => ele.url === url_1)?.url) || ''
      const symbol_2_url = (typeAttribute == 'symbol' && symbolList.find(ele => ele.url === url_2)?.url) || ''
      const former = indicator_1 || symbol_1;
      const latter = indicator_2 || symbol_2;
      const former_url = indicator_1 || symbol_1_url;
      const latter_url = indicator_2 || symbol_2_url;
      const extractValues = (str) => {
        if(str === 'null') str = null
        if(!str) return null
        const parts = str.split('|');

        const left = parts[0];  // sh5_c
        const right = parts[1]; // sh10_o

        const regex = /(\d+)_([a-zA-Z])/; // 修正的正则

        const leftMatch = left.match(regex); // 匹配左边部分
        const rightMatch = right.match(regex); // 匹配右边部分

        if (leftMatch && rightMatch) {
          return {
            shift_ma1: leftMatch[1] || '',   // 提取左侧数字部分
            symbol_ma1: leftMatch[2] || 'c', // 提取左侧字母部分
            shift_ma2: rightMatch[1] || '',  // 提取右侧数字部分
            symbol_ma2: rightMatch[2] || 'o' // 提取右侧字母部分
          };
        } else {
          return null; // 如果没有匹配到
        }
      };
      const next_process = item.next_process || ''
      let next_process_result =  null
      try {
        next_process_result =  extractValues(next_process) || {}
      } catch (error) {
        console.log('error', item, error)
      }
      const options = [
        {
          value: 'o',
          label: 'Symbol Open',
          isSymbol: true
        },
        {
          value: 'h',
          label: 'Symbol High',
          isSymbol: true
        },
        {
          value: 'l',
          label: 'Symbol Low',
          isSymbol: true
        },
        {
          value: 'c',
          label: 'Symbol Close',
          isSymbol: true
        },
        {
          value: 'roc',
          label: 'Rate Of Change',
          isSymbol: true
        },
        {
          value: 'amplitude',
          label: 'Amplitude',
          isSymbol: true
        },
        {
          value: 'amplify',
          label: 'Amplitude',
          isSymbol: true
        },
        {
          value: 'e',
          label: 'Exponential Moving Average',
          isSymbol: true
        },
        {
          value: 'i',
          label: 'Indicator Value'
        }
      ]
      const {shift_ma1, symbol_ma1, shift_ma2, symbol_ma2} = next_process_result || {}
      const maList = item.ma.split('_');
      const specialMAValues = ['amplify', 'amplitude', 'roc', 'e', 'i']
      let _maValues = []
      // specialMAValues.forEach(ele => {
        maList.forEach((value, index) => {
          if(index < 2) {
            if(specialMAValues.some(keyword => value.includes(keyword))) {
              const deleteNum = value.replace(/^\d+/, '');
              const label = options.find(item => item.value === value)?.label || options.find(item => item.value === deleteNum)?.label || ''
              const replaceStr = value.replace(/\D+/g, '')
              let _label = label
              if(value === 'e') _label = 'Exponential Moving Average '
              if(value === 'i') _label = 'Indicator Value'
              if(value != 0 && (value.includes('e') || value.includes('roc'))) _maValues[index] = `${_label} ${replaceStr}`
              else _maValues[index] = _label || ''
              if(shift_ma2 != 0 && index === 1 && typeAttribute === 'symbol' && shift_ma2) _maValues[index] = `${_maValues[index]} Shift ${shift_ma2}`
              if(shift_ma2 != 0 && index === 1 && typeAttribute === 'indicator' && shift_ma2) _maValues[index] = `${_maValues[index]} Shift ${shift_ma2}`
            }else if(symbol_ma1 && symbol_ma2 && Number(value) == 0) {
              const label1 = options.find(item => item.value === symbol_ma1)?.label || ''
              const label2 = options.find(item => item.value === symbol_ma2)?.label || ''
              if(symbol_ma1)  _maValues[0] = label1 || ''
              if(symbol_ma2 && index === 1)  _maValues[1] = `${label2}${(shift_ma2 != 0 && shift_ma2) ? `${(typeAttribute === 'symbol') ? ` Shift ${shift_ma2}` : ''}`: ''}`
            }else {
              _maValues[index] = (value && value != 0) ? `Simple Moving Average ${value}` : ''
              if(index === 1) _maValues[index] = `${_maValues[index]}${(shift_ma2 && shift_ma2 != 0 && !isNaN(shift_ma2)) ? `${typeAttribute === 'symbol' ? ` Shift ${shift_ma2}` : ''}` : ''}`
            }
          }
        })
      // })
      console.log('_maValues', _maValues)
      const ma1 = _maValues[0] || ''
      const ma2 = _maValues[1] || ''

      return {
        included: [`${former}${ma1}`, `${latter}${ma2}`],
        included_url: [`${former_url} ${ma1}`, `${latter_url} ${ma2}`],
        former,
        latter,
        former_url,
        latter_url,
        type: typeAttribute
      }
    },
    getSOHLCVIncludedData(item, symbolList) {
      const url_1 = item.indicator_1_url
      const typeAttribute = item.combine_type || 'ohlcv'
      const symbol_1 = (typeAttribute == 'ohlcv' && symbolList.find(ele => ele.url === url_1)?.label) || ''
      const symbol_1_url = (typeAttribute == 'ohlcv' && symbolList.find(ele => ele.url === url_1)?.url) || ''
      const former = symbol_1;
      const latter = '';
      const former_url = symbol_1_url;
      const latter_url = '';
      const maList = item.ma.split('_');
      let calculate = item.calculate
      switch (calculate) {
        case 'close':
          calculate = ' Symbol Close'
          break;
        case 'open':
          calculate = ' Symbol Open'
          break;
        case 'high':
         calculate = ' Symbol High'
         break;
        case 'low':
          calculate = ' Symbol Low'
          break;
        case 'volume':
          calculate = ' Symbol Volume'
          break;
        default:
          calculate = ' Symbol Close'
          break;
      }
      const maValue = maList[0].includes('e') ? maList[0].toString().replace(/e$/, '') : maList[0]
      let maLabel = ''
      if(maList[0].includes('e')) maLabel = ' Exponential Moving Average'
      else if(maList[0] !== '1' && maList[0] !== '0') maLabel = ' Simple Moving Average'
      const ma1 = `${maLabel} ${(maList[0] !== '1' && maList[0] !== '0') ? maValue : ''}`
      const ma2 = '';

      return {
        included: [`${former}${calculate}${ma1}`],
        included_url: [`${former_url}${calculate}${ma1}`],
        former,
        latter,
        former_url,
        latter_url,
        type: typeAttribute
      }
    },
    getResampleIncludedData(item, sentimentList) {
      const url_1 = item.indicator_1_url
      const typeAttribute = item.combine_type || 'resample'
      const indicator_1 = (typeAttribute == 'resample' && sentimentList.find(ele => ele.url.toLocaleLowerCase() === url_1.toLocaleLowerCase())?.label) || ''
      const former = indicator_1;
      const latter = '';
      const former_url = indicator_1;
      const latter_url = '';

      return {
        included: [`${former}`],
        included_url: [`${former_url}`],
        former,
        latter,
        former_url,
        latter_url,
        type: typeAttribute
      }
    },
    getSTechIncludedData(item, symbolList) {
      const url_1 = item.indicator_1_url
      const typeAttribute = item.combine_type || 'technical_indicator'
      const symbol_1 = (typeAttribute == 'technical_indicator' && symbolList.find(ele => ele.url === url_1)?.label) || ''
      const symbol_1_url = (typeAttribute == 'technical_indicator' && symbolList.find(ele => ele.url === url_1)?.url) || ''
      const former = symbol_1;
      const latter = '';
      const former_url = symbol_1_url;
      const latter_url = '';
      let calculate = 'Technical'

      const signalCode = new SignalCode()
      let techDecode
      try {
        techDecode = signalCode.decode(item.tech_code)
      } catch (error) {

      }

      return {
        included: [`${former} ${techDecode?.indicator}`],
        included_url: [`${former_url} ${techDecode?.indicator}`],
        former,
        latter,
        former_url,
        latter_url,
        type: typeAttribute
      }
    },
    async fetchFavoriteReportsData(params = {}) {
      const page = Number(params.page || this.reportsPage || 1)
      let data = await dashboardApi.getFavoriteReports({
        page,
        title: this.hubSearch.trim(),
        page_size: this.pageSize,
        ...params
      })
      const responseData = data && data.data ? data.data : {}
      data = (Array.isArray(responseData.results) ? responseData.results : []).map(item => {
        item.date = item.post_date.split('T')[0];
        item.summary = item.meta_description
        return {
          ...item
        }
      })
      this.reportsPage = page
      this.reportsTotal = Number(responseData.count || data.length)
      this.applyListResponse(data, 'reports')
    },
    async fetchSentimentIndicatorsData(params = {}) {
      await this.get_indicator_page_btv1_list()
      await this.get_favorite()

      let data = await dashboardApi.getSentimentIndicators({
        view: this.indicatorView,
        favoritesBtv1List: this.favoritesBtv1List,
        favoritesBtv2List: this.favoritesBtv2List,
        ...params
      })
      data = this.processFavoriteData(data)
      this.sentimentIndicatorsPage = 1

      this.applyListResponse(data, 'sentimentIndicators')
      if (this.indicatorView === 'grid') this.fetchSentimentChartCards()
    },
    async fetchIndicatorCardsData(params = {}) {
      const data = await dashboardApi.getIndicatorCards({
        ...params
      })
      this.applyListResponse(data, 'indicatorCards')
    },
    async fetchTrendRowsData(params = {}) {
      const data = await dashboardApi.getTrendRows({
        ...params
      })
      console.log('fetchTrendRowsData', data)
      this.applyListResponse(data, 'trendRows')
    },
    applyListResponse(response, dataKey) {
      const rows = this.normalizeListResponse(response)
      if (rows) {
        this[dataKey] = rows
      }
    },
    normalizeListResponse(response) {
      if (!response) return null
      if (Array.isArray(response)) return response
      if (Array.isArray(response.data)) return response.data
      if (response.data && Array.isArray(response.data.results)) return response.data.results
      if (response.data && Array.isArray(response.data.data)) return response.data.data
      if (Array.isArray(response.results)) return response.results
      return null
    },
    isPanelVisible(view) {
      return this.activeView === 'all' || this.activeView === view
    },
    switchHubTab(tab) {
      this.activeHubTab = tab
      this.hubSearch = ''
    },
    async setIndicatorView(view) {
      this.indicatorView = view
      if (view === 'grid') await this.fetchSentimentChartCards()
    },
    queueSentimentChartFetch() {
      clearTimeout(this.sentimentChartTimer)
      this.sentimentChartTimer = setTimeout(() => {
        this.fetchSentimentChartCards()
      }, 200)
    },
    async fetchSentimentChartCards() {
      const rows = this.paginatedSentimentIndicators.filter(row => row && row.url)
      const requestId = this.sentimentChartRequestId + 1
      this.sentimentChartRequestId = requestId
      this.sentimentChartCards = rows.map(row => this.createEmptySentimentChartCard(row, 'Loading...'))

      if (!rows.length) {
        this.chartCardsLoading = false
        return
      }

      this.chartCardsLoading = true
      const cards = rows.map(row => this.createEmptySentimentChartCard(row, 'Loading...'))
      try {
        const requests = rows.map((row, index) =>
          this.fetchSentimentChartCard(row).then(card => {
            if (requestId !== this.sentimentChartRequestId) return
            this.$set(cards, index, card)
            this.sentimentChartCards = [...cards]
            return card
          })
        )
        const settledCards = await Promise.all(requests)
        if (requestId !== this.sentimentChartRequestId) return
        this.sentimentChartCards = settledCards
      } finally {
        if (requestId === this.sentimentChartRequestId) this.chartCardsLoading = false
      }
    },
    async fetchSentimentChartCard(row) {
      const baseCard = this.createEmptySentimentChartCard(row)
      try {
        const response = await dashboardApi.getSentimentIndicatorChartData(row.url)
        const chartRows = this.normalizeSentimentChartRows(response.data)
        const visibleRows = this.filterSentimentChartRowsByPeriod(chartRows, row.timeframe)
        const series = this.extractSentimentChartSeries(visibleRows, row)
        return {
          ...baseCard,
          points: this.buildSparklinePoints(series),
          last: series.length ? this.formatChartValue(series[series.length - 1].y) : baseCard.last,
          error: series.length ? '' : 'No chart data'
        }
      } catch (error) {
        return {
          ...baseCard,
          error: 'Data unavailable'
        }
      }
    },
    createEmptySentimentChartCard(row, error = '') {
      const timeframeLabel = this.getTimeframeLabel(row.timeframe)
      const period = this.getSentimentChartPeriod(row.timeframe)
      return {
        title: row.chart_name || row.name || row.url || 'Indicator',
        url: row.url,
        last: row.last_value,
        points: '',
        error,
        periodLabel: timeframeLabel ? `${timeframeLabel} · ${period.label}` : period.label
      }
    },
    normalizeSentimentChartRows(data) {
      let rows = data
      if (typeof rows === 'string') {
        try {
          rows = JSON.parse(rows.replace(/NaN/g, 'null'))
        } catch (error) {
          rows = []
        }
      }
      if (rows && Array.isArray(rows.data)) rows = rows.data
      if (rows && Array.isArray(rows.results)) rows = rows.results
      if (!Array.isArray(rows)) return []
      return rows
        .filter(row => row && typeof row === 'object')
        .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
    },
    extractSentimentChartSeries(rows, indicator) {
      if (!rows.length) return []
      const excludedKeys = ['date', 'Color', 'color', 'dumb']
      const keys = Object.keys(rows[0]).filter(key => !excludedKeys.includes(key))
      const preferredKeys = [
        indicator.market_symbol,
        indicator.url,
        'value',
        'Value',
        'close',
        'Close',
        'indicator',
        'Indicator'
      ].filter(Boolean)
      const orderedKeys = preferredKeys.concat(keys.filter(key => !preferredKeys.includes(key)))
      const valueKey = orderedKeys.find(key => rows.some(row => Number.isFinite(Number(row[key]))))
      if (!valueKey) return []

      return rows
        .map(row => ({
          date: row.date,
          y: Number(row[valueKey])
        }))
        .filter(point => Number.isFinite(point.y))
    },
    buildSparklinePoints(series) {
      if (!series.length) return ''
      if (series.length === 1) return '150,45'

      const width = 300
      const height = 90
      const padding = 8
      const values = series.map(point => point.y)
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min || 1

      return series.map((point, index) => {
        const x = padding + (index / (series.length - 1)) * (width - padding * 2)
        const y = height - padding - ((point.y - min) / range) * (height - padding * 2)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      }).join(' ')
    },
    filterSentimentChartRowsByPeriod(rows, timeframe) {
      if (!rows.length) return []
      const period = this.getSentimentChartPeriod(timeframe)
      const lastRowWithDate = [...rows].reverse().find(row => row.date && !Number.isNaN(new Date(row.date).getTime()))

      if (!lastRowWithDate) return rows.slice(-period.fallbackBars)

      const endDate = new Date(lastRowWithDate.date)
      const startDate = new Date(endDate)
      startDate.setFullYear(startDate.getFullYear() - period.years)

      const periodRows = rows.filter(row => {
        if (!row.date) return false
        const rowDate = new Date(row.date)
        return !Number.isNaN(rowDate.getTime()) && rowDate >= startDate && rowDate <= endDate
      })

      return periodRows.length ? periodRows : rows.slice(-period.fallbackBars)
    },
    getSentimentChartPeriod(timeframe) {
      const label = this.getTimeframeLabel(timeframe)
      if (label === 'Long') return { label: '5Y', years: 5, fallbackBars: 252 * 5 }
      if (label === 'Medium') return { label: '3Y', years: 3, fallbackBars: 252 * 3 }
      return { label: '1Y', years: 1, fallbackBars: 252 }
    },
    getTimeframeLabel(timeframe) {
      const value = String(timeframe || '').toLowerCase()
      if (value.includes('short')) return 'Short'
      if (value.includes('long')) return 'Long'
      if (value.includes('medium') || value.includes('intermediate')) return 'Medium'
      return timeframe || ''
    },
    formatChartValue(value) {
      if (!Number.isFinite(Number(value))) return '-'
      return Number(value).toFixed(2).replace(/\.00$/, '')
    },
    displayData(data, removeZero = false) {
			const numberRegex = /^-?\d+(\.\d+)?$/
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/

			if (numberRegex.test(data) && !isNaN(data)) {
				if(!removeZero) return parseFloat(data).toFixed(2)
				// Convert to float, format to one decimal place, and remove unnecessary trailing zeros
				return parseFloat(data).toFixed(2).replace(/\.0$/, '')
			} else if (dateRegex.test(data)) {
				return data
			} else if(typeof data == 'string'){
				return data
			}else {
				return ''
			}
		},
    togglePanel(panel) {
      this.$set(this.collapsedPanels, panel, !this.collapsedPanels[panel])
    },
    collapseLabel(panel) {
      return this.collapsedPanels[panel] ? '▼ Expand' : '▲ Collapse'
    },
    noop() {},
    toggleSort(tableKey, columnKey) {
      const current = this.sortStates[tableKey] || { key: '', direction: 'asc' }
      const nextDirection = current.key === columnKey && current.direction === 'asc' ? 'desc' : 'asc'

      this.$set(this.sortStates, tableKey, {
        key: columnKey,
        direction: nextDirection
      })

      if (tableKey === 'signals') this.changeSignalsPage(1)
      if (tableKey === 'watchlist') {
        this.fetchWatchlistData({ page: 1 })
      }
      if (tableKey === 'marketRows') {
        this.fetchMarketRowsData({ page: 1 })
      }
      if (tableKey === 'sentimentIndicators') {
        this.changeSentimentIndicatorsPage(1, false)
        if (this.indicatorView === 'grid') this.fetchSentimentChartCards()
      }
    },
    sortClass(tableKey, columnKey) {
      const state = this.sortStates[tableKey] || {}
      return {
        'sort-asc': state.key === columnKey && state.direction === 'asc',
        'sort-desc': state.key === columnKey && state.direction === 'desc'
      }
    },
    sortRows(rows, tableKey, customGetters = {}) {
      const list = Array.isArray(rows) ? rows : []
      const state = this.sortStates[tableKey] || {}
      if (!state.key) return list

      const direction = state.direction === 'desc' ? -1 : 1
      return list
        .map((row, index) => ({ row, index }))
        .sort((left, right) => {
          const leftValue = this.getSortValue(left.row, state.key, customGetters)
          const rightValue = this.getSortValue(right.row, state.key, customGetters)
          const emptyComparison = this.compareEmptySortValues(leftValue, rightValue)

          if (emptyComparison !== null) {
            if (emptyComparison === 0) return left.index - right.index
            return emptyComparison
          }

          const comparison = this.compareSortValues(leftValue, rightValue)

          if (comparison === 0) return left.index - right.index
          return comparison * direction
        })
        .map(item => item.row)
    },
    getSortValue(row, key, customGetters = {}) {
      if (customGetters[key]) return customGetters[key](row)
      return this.getValueByPath(row, key)
    },
    getValueByPath(row, path) {
      if (!row || !path) return undefined
      return String(path).split('.').reduce((value, key) => {
        if (value === null || value === undefined) return undefined
        return value[key]
      }, row)
    },
    compareEmptySortValues(leftValue, rightValue) {
      const leftEmpty = this.isEmptySortValue(leftValue)
      const rightEmpty = this.isEmptySortValue(rightValue)

      if (leftEmpty || rightEmpty) {
        if (leftEmpty && rightEmpty) return 0
        return leftEmpty ? 1 : -1
      }

      return null
    },
    compareSortValues(leftValue, rightValue) {
      const leftDate = this.parseSortDate(leftValue)
      const rightDate = this.parseSortDate(rightValue)
      if (leftDate !== null || rightDate !== null) {
        if (leftDate !== null && rightDate !== null) return leftDate - rightDate
        return leftDate !== null ? -1 : 1
      }

      const leftNumber = this.parseSortNumber(leftValue)
      const rightNumber = this.parseSortNumber(rightValue)
      if (leftNumber !== null || rightNumber !== null) {
        if (leftNumber !== null && rightNumber !== null) return leftNumber - rightNumber
        return leftNumber !== null ? -1 : 1
      }

      return this.toSortString(leftValue).localeCompare(
        this.toSortString(rightValue),
        undefined,
        { numeric: true, sensitivity: 'base' }
      )
    },
    isEmptySortValue(value) {
      if (value === null || value === undefined) return true
      if (Array.isArray(value)) return value.length === 0
      const text = this.toSortString(value).trim().toLowerCase()
      return ['', '-', '--', 'n/a', 'na', 'null', 'undefined'].includes(text)
    },
    toSortString(value) {
      if (value === null || value === undefined) return ''
      if (Array.isArray(value)) return value.map(item => this.toSortString(item)).join(' ')
      if (value instanceof Date) return value.toISOString()
      if (typeof value === 'object') {
        if (value.commentDes) return this.toSortString(value.commentDes)
        if (value.label) return this.toSortString(value.label)
        if (value.name) return this.toSortString(value.name)
        if (value.title) return this.toSortString(value.title)
        return Object.values(value).map(item => this.toSortString(item)).join(' ')
      }
      return String(value)
    },
    parseSortDate(value) {
      if (value instanceof Date) {
        const time = value.getTime()
        return Number.isNaN(time) ? null : time
      }

      if (typeof value !== 'string') return null
      const text = value.trim()
      const isDateLike = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}(?:[T\s].*)?$/.test(text) ||
        /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(text) ||
        /^[A-Za-z]{3,9}\s+\d{1,2},\s+\d{4}$/.test(text)

      if (!isDateLike) return null
      const time = new Date(text).getTime()
      return Number.isNaN(time) ? null : time
    },
    parseSortNumber(value) {
      if (typeof value === 'number') return Number.isFinite(value) ? value : null
      if (typeof value === 'boolean') return Number(value)

      const originalText = this.toSortString(value).trim()
      if (!originalText || this.parseSortDate(originalText) !== null) return null

      let text = originalText.replace(/,/g, '').replace(/\s+/g, '')
      const wrappedNegative = /^\(.+\)$/.test(text)
      text = text.replace(/[()]/g, '')
      text = text.replace(/^([+-]?)[\$€£¥]+/, '$1')
      text = text.replace(/^\+/, '')
      text = text.replace(/%$/, '')

      if (wrappedNegative && !text.startsWith('-')) text = `-${text}`

      const match = text.match(/^(-?\d+(?:\.\d+)?)([kmbt])?$/i)
      if (!match) return null

      const multipliers = {
        k: 1000,
        m: 1000000,
        b: 1000000000,
        t: 1000000000000
      }
      return Number(match[1]) * (multipliers[String(match[2] || '').toLowerCase()] || 1)
    },
    filterRows(rows, keys) {
      return this.filterRowsByQuery(rows, keys, this.hubSearch)
    },
    filterRowsByQuery(rows, keys, queryText) {
      const query = String(queryText || '').toLowerCase().trim()
      if (!query) return rows
      return rows.filter(row =>
        keys.some(key => this.stringifySearchValue(this.getValueByPath(row, key)).toLowerCase().includes(query))
      )
    },
    queueServerSearch() {
      clearTimeout(this.serverSearchTimer)
      this.serverSearchTimer = setTimeout(() => {
        if (this.activeHubTab === 'indicators') {
          this.fetchMyIndicatorsData({ page: 1 })
        } else if (this.activeHubTab === 'reports') {
          this.fetchFavoriteReportsData({ page: 1 })
        }
      }, 350)
    },
    queueWatchlistSearch() {
      clearTimeout(this.watchlistSearchTimer)
      this.watchlistSearchTimer = setTimeout(() => {
        this.fetchWatchlistData({ page: 1 })
      }, 350)
    },
    getWatchlistOrdering() {
      return this.getMetricTableOrdering('watchlist')
    },
    getMarketRowsOrdering() {
      return this.getMetricTableOrdering('marketRows')
    },
    getMetricTableOrdering(tableKey) {
      const state = this.sortStates[tableKey] || {}
      const allowedFields = [
        'symbol',
        'data_date',
        'close',
        'optix',
        'trend',
        'reltrend',
        'volatility_20d',
        'volatility_60d'
      ]

      if (!state.key || !allowedFields.includes(state.key)) return undefined
      return state.direction === 'desc' ? `-${state.key}` : state.key
    },
    getMyIndicatorKey(item) {
      return item.url || item.key || item.name
    },
    isMyIndicatorExpanded(item) {
      return !!this.expandedMyIndicators[this.getMyIndicatorKey(item)]
    },
    stringifySearchValue(value) {
      if (Array.isArray(value)) return value.map(item => this.stringifySearchValue(item)).join(' ')
      if (value && typeof value === 'object') return Object.values(value).map(item => this.stringifySearchValue(item)).join(' ')
      return String(value || '')
    },
    paginateRows(rows, page) {
      const list = Array.isArray(rows) ? rows : []
      const currentPage = Math.min(Math.max(Number(page) || 1, 1), this.getTotalPages(list.length))
      const startIndex = (currentPage - 1) * this.pageSize
      return list.slice(startIndex, startIndex + this.pageSize)
    },
    getTotalPages(total, pageSize = this.pageSize) {
      return Math.max(Math.ceil(Number(total || 0) / pageSize), 1)
    },
    shouldShowPagination(total, pageSize = this.pageSize) {
      return Number(total || 0) > pageSize
    },
    changeSignalsPage(page) {
      const totalPages = this.getTotalPages(this.filteredSignals.length)
      const nextPage = Math.min(Math.max(Number(page) || 1, 1), totalPages)
      this.$set(this.signalsPagination, this.activeSignalsTab, nextPage)
    },
    async changeMyIndicatorsPage(page) {
      const totalPages = this.getTotalPages(this.myIndicatorsTotalCount)
      const nextPage = Math.min(Math.max(Number(page) || 1, 1), totalPages)
      if (nextPage === this.myIndicatorsPage) return
      await this.fetchMyIndicatorsData({ page: nextPage })
    },
    async changeReportsPage(page) {
      const totalPages = this.getTotalPages(this.reportsTotalCount)
      const nextPage = Math.min(Math.max(Number(page) || 1, 1), totalPages)
      if (nextPage === this.reportsPage) return
      await this.fetchFavoriteReportsData({ page: nextPage })
    },
    async changeWatchlistPage(page) {
      const totalPages = this.getTotalPages(this.watchlistTotalCount, this.metricPageSize)
      const nextPage = Math.min(Math.max(Number(page) || 1, 1), totalPages)
      if (nextPage === this.watchlistPage) return
      await this.fetchWatchlistData({ page: nextPage })
    },
    async changeMarketPage(page) {
      const totalPages = this.getTotalPages(this.marketTotalCount, this.metricPageSize)
      const nextPage = Math.min(Math.max(Number(page) || 1, 1), totalPages)
      if (nextPage === this.marketPage) return
      await this.fetchMarketRowsData({ page: nextPage })
    },
    changeSentimentIndicatorsPage(page, shouldFetch = true) {
      const totalPages = this.getTotalPages(this.sentimentIndicatorsTotalCount)
      this.sentimentIndicatorsPage = Math.min(Math.max(Number(page) || 1, 1), totalPages)
      if (shouldFetch && this.indicatorView === 'grid') this.fetchSentimentChartCards()
    },
    returnClass(value) {
      const str = String(value || '')
      if (str.startsWith('-')) return 'down'
      if (str.startsWith('+')) return 'up'
      return ''
    },
    getSignalConditions(signal) {
      const conditions = signal && Array.isArray(signal.signal) ? signal.signal : []
      return conditions.filter(condition => condition !== null && condition !== undefined && condition !== '')
    },
    getSignalConditionText(condition) {
      if (condition && typeof condition === 'object') {
        return condition.commentDes || condition.label || condition.name || JSON.stringify(condition)
      }
      return String(condition || '')
    },
    openSignalConditionsModal(signal) {
      this.activeSignalConditions = signal
    },
    closeSignalConditionsModal() {
      this.activeSignalConditions = null
    },
    // getWatchlistCellClass(columnId) {
    //   if (['trend', 'reltrend'].includes(columnId)) return 'score'
    //   return ''
    // },
    formatWatchlistCell(row, columnId) {
      const value = row ? row[columnId] : ''
      if (value === null || value === undefined || value === '') return '-'
      if (columnId === 'symbol') return this.formatWatchlistTicker(value)
      if (['data_date', 'updated_at'].includes(columnId)) return this.formatWatchlistDate(value)
      if (['close', 'optix', 'trend', 'reltrend', 'volatility_20d', 'volatility_60d'].includes(columnId)) {
        const numberValue = Number(value)
        if (!Number.isFinite(numberValue)) return value
        return numberValue.toFixed(2).replace(/\.00$/, '')
      }
      if (columnId === 'asset_type') return String(value).toLowerCase() === 'etf' ? 'ETF' : capitalizeFirstLetter(value)
      return value
    },
    formatWatchlistTicker(value) {
      const text = String(value || '')
      const ticker = text.includes('_') ? text.slice(text.indexOf('_') + 1) : text
      return ticker.toUpperCase()
    },
    formatWatchlistDate(value) {
      const text = String(value || '')
      if (!text) return '-'
      return text.includes('T') ? text.split('T')[0] : text
    },
    async addWatchlistTickers() {
      if (!this.singleTicker) return
      const tickers = this.singleTicker
        .split(/[,\s]+/)
        .map(ticker => ticker.trim())
        .filter(Boolean)
      if (!tickers.length) return
      this.watchlistSymbols = this.normalizeTickerList([...this.watchlistSymbols, ...tickers])
      this.singleTicker = ''
      await this.saveWatchlistConfig({ silent: true })
    },
    async addTicker(ticker) {
      const normalized = this.normalizeWatchlistSymbol(ticker)
      if (!normalized) return
      this.watchlistSymbols = this.normalizeTickerList([...this.watchlistSymbols, normalized])
      await this.saveWatchlistConfig({ silent: true })
    },
    async removeSelected() {
      const selected = new Set(this.selectedWatchTickers.map(ticker => this.normalizeWatchlistSymbol(ticker)))
      if (!selected.size && !this.watchlistSelectAll) return

      if (this.watchlistSelectAll) {
        this.watchlistSymbols = []
        this.watchListData = []
        this.watchlistTotal = 0
        this.watchlistPage = 1
        this.selectedWatchTickers = []
        this.watchlistSelectAll = false
        await this.saveWatchlistConfig({ silent: true })
        return
      }

      const currentSymbols = this.getCurrentWatchlistSymbols()
      const nextSymbols = currentSymbols.filter(ticker => !selected.has(this.normalizeWatchlistSymbol(ticker)))
      const nextPage = Math.min(
        this.watchlistPage,
        this.getTotalPages(nextSymbols.length, this.metricPageSize)
      )
      this.watchlistSymbols = nextSymbols
      this.selectedWatchTickers = []
      this.watchlistSelectAll = false
      await this.saveWatchlistConfig({ silent: true, applyPage: nextPage })
    },
    openSettings() {
      this.tempColumns = JSON.parse(JSON.stringify(this.columns))
      this.settingsOpen = true
    },
    moveTempColumn(index, direction) {
      const target = index + direction
      if (target < 0 || target >= this.tempColumns.length) return
      const columns = [...this.tempColumns]
      const moved = columns[index]
      this.$set(columns, index, columns[target])
      this.$set(columns, target, moved)
      this.tempColumns = columns
    },
    addTempColumn() {
      const selected = this.customColumnOptions.find(column => column.value === this.newColumnType)
      if (!selected) return
      if (this.tempColumns.some(column => column.id === selected.value)) return
      this.tempColumns.push({
        id: selected.value,
        name: selected.label,
        visible: true
      })
      this.newColumnType = ''
    },
    applySettings() {
      this.columns = JSON.parse(JSON.stringify(this.tempColumns))
      this.settingsOpen = false
      if (this.activeWatchlistConfig) this.saveWatchlistConfig({ silent: true })
    },
    generateColumnValue(type) {
      const generators = {
        rsi: () => Math.floor(Math.random() * 60 + 20),
        pe: () => (Math.random() * 30 + 10).toFixed(1),
        volume: () => `${(Math.random() * 8 + 0.5).toFixed(1)}M`,
        marketCapCustom: () => `${(Math.random() * 800 + 50).toFixed(1)}B`,
        beta: () => (Math.random() * 1.5 + 0.5).toFixed(2),
        divYield: () => `${(Math.random() * 4.5 + 0.5).toFixed(2)}%`,
        high52w: () => `$${(Math.random() * 300 + 50).toFixed(2)}`,
        low52w: () => `$${(Math.random() * 150 + 20).toFixed(2)}`
      }
      return generators[type] ? generators[type]() : '-'
    },
    sortTable(index) {
      this.toggleSort('trendRows', index)
    },
    getBlogUrl(row) {
      console.log('blog', row)
     if (
       this.dashboard_type === "indicatoredge" &&
       ["Jason Goepfert", "Dean Christians", "Jay Kaeppel"].includes(row.author) &&
       ['sentimentedge', 'modeledge', 'quantedge', 'kaeppelscorner', 'tradingedge', 'impactedge'].includes(row.user_level)
     ) {
       return `/MR/${row.user_level}/${row.url}`;
     }else if(row.author === 'Other'){
      return `${row.url}`;
     }
     return `/MR/blog/${row.url}`;
   },
    processFavoriteData(data) {
    return (Array.isArray(data) ? data : []).map(obj => {
      const subType = obj['sub_type']
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          if(key === 'timeframe') {
            if(['Short to Intermediate', 'Intermediate to Long', 'Intermediate', 'Medium-Term'].includes(obj[key])){obj[key] = 'Medium'}
            else if(['Short', 'Short-Term'].includes(obj[key])){obj[key] = 'Short'}
            else if(['Long', 'Long-Term'].includes(obj[key])){obj[key] = 'Long'}
          }
          const subTypeMapping = {
            model: 'Model',
            more: 'More',
            breadth: 'Breadth',
            surveys: 'Surveys',
            shorts: 'Shorts',
            cash: 'Cash',
            insiders: 'Insiders',
            rydex: 'Rydex',
            seasonality: 'Seasonality',
            etf_index: 'Index',
            etf_bond: 'Bond',
            etf_social: 'Social',
            etf_commod: 'Commodity',
            etf_breadth: 'Sector Breadth',
            country_breadth: 'Country Breadth',
            crypto_breadth: 'Crypto Breadth',
            etf_country: 'Country',
            etf_etf: 'Sector',
            pc_ratio: 'PutCall',
            stock_sent: 'Stock',
            stock_russell: 'Russell',
            equity: 'COT',
            cot: 'COT',
            optix: 'Optix',
            vol: 'Volatility',
            etf_fund_index: 'Index',
            etf_social_index: 'Index',
            etf_fund_sector: 'Sector',
            etf_social_sector: 'Sector',
            etf_fund_commodity: 'Commodity',
            etf_social_commod: 'Commodity',
            etf_fund_bond: 'Bond',
            etf_social_bond: 'Bond',
            etf_fund_country: 'Country',
            etf_social_country: 'Country',
            trend_reltrend: 'Trend',
            sp1500_trend_reltrend: 'Trend',
            spx_trend_reltrend: 'Trend',
            ndx_trend_reltrend: 'Trend',
            crp_trend_reltrend: 'Trend',
            russell_trend_reltrend: 'Trend',
            etf_domestic_trend_reltrend: 'Trend',
            etf_foreign_trend_reltrend: 'Trend',
            etf_other_trend_reltrend: 'Trend',
            crp_stock: 'CRP',
          }
          if(key === 'sub_type') obj[key] = capitalizeFirstLetter(subTypeMapping[obj[key]] || obj[key])
          if(['last_value', 'last_change'].includes(key)) {
            // 保留特定小数点
            if(['last_value', 'last_change'].includes(key)) {
              // obj[key] = unifyNumber(obj[key], 4)
              obj[key] = unifyNumber(obj[key], 2)
            }
            if((key === 'last_value' || key === 'last_change') && obj['last_change_type'] === 'percent') obj[key] = `${obj[key]}%`

          }
          if(key === 'last_update') {
            const datatime = new Date(obj['last_update']);
            // 使用 UTC 方法获取年、月和日，以确保在不同时区显示一致的日期
            const Y = datatime.getUTCFullYear() + '-';
            const M = (datatime.getUTCMonth() + 1).toString().padStart(2, '0') + '-';
            const D = datatime.getUTCDate().toString().padStart(2, '0');
            obj['last_update'] = Y+M+D
          }
          obj['loading'] = false
          obj['favorite'] = true
          if((key === 'last_value' || key === 'last_change') && (subType === 'stock' || subType === 'Stock')){
            if(obj[key] !== '' && obj[key] !== null && obj[key] !== 'null') obj[key] =  `${obj[key]}%`
            // 加 %
          }
        }
      }
      return obj
    })
    },
    viewSignal(signal) {
      // :href="`/my_signals?url=${signal.url}`"
      if(this.activeSignalsTab !== 'my-signals') signal.url = null
      this.$router.push({
        name: 'MySignals',
        params: {data: JSON.stringify(signal), usedFor: 'showSignalDetail'}
      })
    },
    viewMyIndicator(indicator) {
      const data = JSON.stringify(indicator)
      this.$router.push({
        name: 'MIcreate',
        params: {
          data,
          usedFor: 'showMyIndicators'
        }
      })
    }
  },
}
</script>

<style scoped>
.dashboard-page {
  --blue: #5f7f9f;
  --blue-dark: #486985;
  --link: #5f96b8;
  --text: #333;
  --muted: #777;
  --border: #d8d8d8;
  --panel: #ffffff;
  --today: #dff3ff;
  --both: #e7f7e7;
  --expired: #fff0d8;

  max-width: 1200px;
  margin: 24px auto 70px;
  padding: 0 16px;
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.45;
}

.dashboard-page * {
  box-sizing: border-box;
}

a {
  color: var(--link);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.page-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.page-title h1 {
  margin: 0;
  color: #555;
  font-size: 25px;
  letter-spacing: 0.3px;
}

.page-title p {
  margin: 4px 0 0;
  color: #777;
}

.date-note {
  margin-top: 8px;
  color: #888;
  font-size: 13px;
}

.dashboard-views {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  padding-bottom: 12px;
  overflow-x: auto;
  border-bottom: 1px solid #e6e6e6;
}

.view-btn,
.btn {
  border: 1px solid #d8d8d8;
  border-radius: 3px;
  background: #f8f8f8;
  color: #555;
  cursor: pointer;
}

.view-btn {
  padding: 8px 18px;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.view-btn.active {
  border-color: var(--blue-dark);
  background: var(--blue);
  color: #fff;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
}

.panel {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 3px;
  background: var(--panel);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 13px;
  background: var(--blue);
  color: #fff;
  font-size: 18px;
}

.panel-header.compact {
  padding-top: 6px;
  padding-bottom: 6px;
}

.panel-actions,
.master-hub-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.hub-tab-btn {
  padding: 5px 14px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 3px;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}

.hub-tab-btn.active {
  border-color: #fff;
  background: #fff;
  color: var(--blue-dark);
}

.collapse-btn {
  padding: 2px 6px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
}

.collapse-btn:hover {
  color: #fff;
}

.panel-body {
  max-height: 2500px;
  padding: 14px;
  overflow: hidden;
  opacity: 1;
  transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
}

.panel-body.collapsed {
  max-height: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  opacity: 0 !important;
}

.signals-tabs {
  height: 44px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin: -14px -14px 14px;
  border-bottom: 1px solid #d8d8d8;
  background: #f5f5f5;
}

.signals-subtabs {
  display: flex;
  align-items: stretch;
}

.signals-tab {
  display: flex;
  align-items: center;
  padding: 0 24px;
  border: 0;
  border-right: 1px solid #d8d8d8;
  background: #f5f5f5;
  color: #316f8f;
  cursor: pointer;
  font-size: 13.5px;
}

.signals-tab.active {
  z-index: 2;
  margin-bottom: -1px;
  border-bottom: 1px solid #fff;
  background: #fff;
  color: #111;
  font-weight: bold;
}

.hub-search {
  display: flex;
  align-items: center;
  padding-right: 14px;
}

input,
select {
  padding: 7px 9px;
  border: 1px solid #bbb;
  border-radius: 2px;
  background: #fff;
  font-size: 13px;
}

.hub-search input {
  width: 300px;
  padding: 5px 10px;
  border-color: #c9d2da;
}

.search-input {
  min-width: 280px;
}

.table-wrap {
  width: 100%;
}

.pagination-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 12px 0 2px;
  color: #555;
  font-size: 13px;
}

.pagination-btn {
  min-width: 64px;
  padding: 5px 10px;
  border: 1px solid #c9d2da;
  border-radius: 3px;
  background: #fff;
  color: #316f8f;
  cursor: pointer;
}

.pagination-btn:disabled {
  color: #aaa;
  cursor: not-allowed;
  background: #f4f4f4;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

th,
td {
  padding: 9px 10px;
  border-bottom: 1px solid #e5e5e5;
  text-align: left;
  vertical-align: middle;
}

th {
  color: #333;
  font-weight: 700;
  white-space: nowrap;
}

.empty-row {
  padding: 18px 10px;
  color: #777;
  text-align: center;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable::after {
  content: "";
  display: inline-block;
  width: 10px;
  height: 14px;
  margin-left: 6px;
  vertical-align: middle;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='14' viewBox='0 0 10 14'><path d='M5 1L1 6h8zM5 13l4-5H1z' fill='%23b5b5b5'/></svg>");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

th.sortable.sort-asc::after {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='14' viewBox='0 0 10 14'><path d='M5 1L1 6h8z' fill='%23316f8f'/><path d='M5 13l4-5H1z' fill='%23d3d3d3'/></svg>");
}

th.sortable.sort-desc::after {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='14' viewBox='0 0 10 14'><path d='M5 1L1 6h8z' fill='%23d3d3d3'/><path d='M5 13l4-5H1z' fill='%23316f8f'/></svg>");
}

tbody tr:nth-child(odd) {
  background: #f7f7f7;
}

tbody tr:hover {
  background: #eef6fb;
}

.row-today-highlight {
  background-color: #f2f9ff !important;
}

.last-signal-highlight,
tbody tr.last-signal-highlight:nth-child(odd),
tbody tr.last-signal-highlight:hover {
  background-color: #fff4bd !important;
}

.last-signal-note {
  margin: 0 0 10px;
  padding: 8px 10px;
  border: 1px solid #eadb98;
  border-radius: 3px;
  background: #fff8da;
  color: #5c4a00;
  font-size: 13px;
  font-weight: 600;
}

.primary-cell {
  margin-bottom: 4px;
  font-weight: 600;
}

.primary-link {
  font-weight: 600;
  cursor: pointer;
}

.muted {
  color: #777;
}

.small-text {
  font-size: 11px;
}

.report-summary {
  margin-top: 2px;
  line-height: 1.4;
}

.st-signals-table th:nth-child(4),
.st-signals-table td:nth-child(4) {
  width: 30%;
}
.chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #bbb;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
  transition: transform 0.15s ease, color 0.15s ease;
}

.chevron.expanded {
  color: var(--blue-dark);
  transform: rotate(90deg);
}

.details-row td {
  padding: 13px 16px;
  background: #fbfdff;
}

.details-stack {
  display: grid;
  gap: 8px;
  color: #333;
}

.details-stack ol {
  margin-top: 6px;
}

ol {
  margin: 0;
  padding-left: 20px;
  line-height: 1.6;
}

.signal-preview-list {
  margin-top: 4px;
  padding-left: 18px;
  line-height: 1.45;
}

.signal-preview-list li {
  margin-bottom: 3px;
}

.signal-first-condition {
  line-height: 1.45;
  margin-bottom: 3px;
}

.signal-condition-label {
  margin: 12px 0 6px;
  color: #333;
  font-weight: 700;
}

.inline-link-btn {
  margin: 0 0 0 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #316f8f;
  cursor: pointer;
  vertical-align: baseline;
  font-size: 12px;
  font-weight: 600;
}

.inline-link-btn:hover {
  text-decoration: underline;
}

.up {
  color: #2f8f5b;
  font-weight: 700;
}

.down {
  color: #c64d55;
  font-weight: 700;
}

.score {
  color: #4d87a6;
  font-weight: bold;
}

.btn {
  padding: 7px 10px;
  font-size: 13px;
}

.btn.small {
  padding: 4px 8px;
  font-size: 12px;
}

.btn.primary,
.btn.blue {
  border-color: var(--blue-dark);
  background: var(--blue);
  color: #fff;
}

.panel-actions .btn.active {
  border-color: var(--blue-dark);
  background: #fff;
  color: var(--blue-dark);
  font-weight: 700;
}

.btn.ghost {
  background: #f8f8f8;
}

.header-select {
  padding: 4px 8px;
  border-color: #c9d2da;
  color: #444;
  font-size: 12px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.bulk-input {
  min-width: 290px;
}

.set-name-input,
.set-select {
  min-width: 140px;
}

.watchlist-message {
  margin: -2px 0 10px;
  padding: 8px 10px;
  border: 1px solid #d8e7f0;
  border-radius: 3px;
  background: #f4fbff;
  color: #315f75;
  font-size: 13px;
  font-weight: 600;
}

.section-tabs {
  display: flex;
  gap: 22px;
  margin-bottom: 14px;
  overflow-x: auto;
  border-bottom: 1px solid #e1e1e1;
}

.section-tabs button {
  padding: 10px 2px;
  border: 0;
  background: transparent;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.section-tabs button.active {
  border-bottom: 4px solid #316f8f;
  color: #222;
  font-weight: 600;
}

.filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #e3e3e3;
  background: #f8f8f8;
}

.filter-field label {
  display: block;
  margin-bottom: 3px;
  color: #777;
  font-size: 11px;
  text-transform: uppercase;
}

.filter-field select {
  width: 100%;
}

.status-today {
  background: var(--today);
}

.status-both {
  background: var(--both);
}

.status-expired {
  background: var(--expired);
}


.sentiment-block {
  width: 13px;
  height: 13px;
  display: inline-block;
  border: 1.5px solid #ccc;
  background: #fff;
}

.sentiment-block.active {
  border-color: #5cb85c;
  background: #5cb85c;
}

.info-icon {
  position: relative;
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  border-radius: 50%;
  background: #eee;
  color: #666;
  cursor: help;
  font-size: 10px;
  font-weight: bold;
}

.info-icon::after {
  position: absolute;
  z-index: 20;
  bottom: calc(100% + 8px);
  left: 50%;
  width: 260px;
  padding: 8px 10px;
  border-radius: 3px;
  background: #333;
  color: #fff;
  content: attr(data-tooltip);
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  opacity: 0;
  pointer-events: none;
  text-align: left;
  transform: translateX(-50%);
  transition: opacity 0.15s ease;
  white-space: normal;
}

.info-icon:hover::after {
  opacity: 1;
}

.info-icon.tooltip-align-right::after {
  right: 0;
  left: auto;
  transform: none;
}

.nine-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.indicator-card {
  min-height: 220px;
  padding: 12px;
  border: 1px solid #d8d8d8;
  border-radius: 3px;
  background: #fff;
}

.indicator-title {
  margin-bottom: 8px;
  color: #333;
  font-weight: 700;
}

.sparkline {
  height: 150px;
  border: 1px solid #e0e0e0;
  background: #fff;
}

.sparkline svg {
  width: 100%;
  height: 100%;
}

.chart-loading {
  padding: 10px 0;
  color: #777;
  font-size: 13px;
}

.chart-empty {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

.chart-meta {
  display: flex;
  justify-content: space-between;
  color: #777;
  font-size: 12px;
}

#trendTable {
  table-layout: auto;
}

#trendTable th {
  padding: 10px 6px;
  white-space: normal !important;
  vertical-align: bottom;
  font-size: 13px;
  line-height: 1.25;
}

#trendTable td {
  padding: 10px 6px;
  font-size: 13px;
}

.modal {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.modal-content {
  width: 440px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.signal-conditions-modal {
  width: min(680px, calc(100vw - 32px));
}

.modal-header,
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.modal-header {
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.close-btn {
  border: 0;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
}

.modal-body {
  max-height: 480px;
  overflow-y: auto;
  padding: 16px;
}

.modal-intro {
  margin-top: 0;
  color: #666;
  font-size: 13px;
}

.signal-modal-name {
  margin-bottom: 12px;
  color: #333;
  line-height: 1.5;
}

.signal-full-list {
  max-height: 360px;
  overflow-y: auto;
  padding-left: 22px;
  line-height: 1.55;
}

.signal-full-list li {
  margin-bottom: 8px;
}

.modal-footer {
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #eee;
  background: #f8f8f8;
}

.settings-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 8px 12px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  background: #fafbfc;
}

.settings-list-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #444;
  cursor: pointer;
  font-weight: bold;
}

.reorder-btns {
  display: flex;
  gap: 4px;
}

.reorder-btn {
  padding: 2px 6px;
  border: 1px solid #ccc;
  border-radius: 2px;
  background: #fff;
  color: #666;
  cursor: pointer;
  font-size: 11px;
}

.reorder-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.add-column {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #eee;
}

.add-column h4 {
  margin: 0 0 10px;
  color: #333;
  font-size: 13px;
}

.add-column-row {
  display: flex;
  gap: 8px;
}

.add-column-row select {
  flex: 1;
}

@media (min-width: 1100px) {
  .filters {
    grid-template-columns: repeat(6, minmax(100px, 1fr));
  }

  #trendTable th,
  #trendTable td {
    padding: 12px 8px;
    font-size: 14px;
  }
}

@media (max-width: 1000px) {
  .filters,
  .nine-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .page-title,
  .toolbar,
  .panel-header {
    align-items: stretch;
    flex-direction: column;
  }

  .filters,
  .nine-grid {
    grid-template-columns: 1fr;
  }

  table {
    min-width: 900px;
  }

  .search-input,
  .hub-search input {
    width: 100%;
    min-width: 0;
  }
}
.footer {
  padding-bottom: 50px;
}
</style>
