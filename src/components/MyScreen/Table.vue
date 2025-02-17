<template>
  <div class="CPM-list-container ScannerBTTable">
    <div class="search-box">
      <el-input placeholder="Search" v-model="searchItem" @keyup.enter.native="handleQuery" clearable @clear="handleQuery" @input="handleQuery" size="small">
        <el-button slot="append" icon="el-icon-search" @click="handleQuery"></el-button>
      </el-input>
      <span v-show="isShowLastSignalDate">Highlighted rows indicate the last signal date is today.</span>
      <!-- <el-popconfirm
        confirm-button-text="Continue"
        cancel-button-text="Cancel"
        icon="el-icon-info"
        icon-color="red"
        v-if="currentPageTab === 'MyScreen'"
        @confirm="runAllMySignals"
        title="Re-running all signals will update the last signal dates to the most recent.This process might take a while for larger lists. Confirm to continue."
        >
        <template #reference>
          <el-button type="warning" plain :loading="btnLoading" size="small">Find All Last Signal</el-button>
        </template>
      </el-popconfirm> -->
    </div>
    <el-table
			ref="Table"
			class="ScannerBTTable"
      header-align="center"
			:data="paginatedData"
      empty-text="No data"
      v-loading="loading"
			@sort-change="onSortChange"
      size="small"
			style="width: 100%; height: 100%; margin: 0 auto;"
      :row-class-name="tableRowClassName"
		>
			<template v-for="(l) in tableCol">
        <el-table-column
          v-if="l.key === 'description'"
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          :min-width="l.minWidth"
				>
					<template slot-scope="scope">
            <template  v-if="Array.isArray(scope.row.description)">
              <template v-for="(item, index) in scope.row.description">
                <p :key="index">{{item}}</p>
              </template>
            </template>
					</template>
				</el-table-column>
			<el-table-column		
					v-else-if="l.label == 'Signal'"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          :min-width="l.minWidth"
					:sortable="
						[
							'Signal'
						].indexOf(l.label) !== -1
							? 'custom'
							: false
					"
				>
					<template slot-scope="scope">
						<!-- {{ scope.row.Signal }} -->
						<span>{{midTermMap[scope.row[l.value]]?midTermMap[scope.row[l.value]]:scope.row[l.value]}}</span>
						<el-tooltip effect="dark" placement="top" style="display: inline">
							<span slot="content" v-html="textContent[scope.row[l.value]]">
							</span>
							<i class="iconfont icon-wenhao"></i>
						</el-tooltip>
					</template>
				</el-table-column>
        <el-table-column
          v-else
          align="center"
					:label="l.label"
					:prop="l.value"
					:key="l.key"
          :sortable="'custom'"
          :min-width="l.minWidth"
          :width="l.width"
				  :sort-orders="['ascending', 'descending']"
				>
					<template slot-scope="scope">
						<span class="tableText" v-if="!isNaN(scope.row[l.value]) && scope.row[l.value]">
							{{ scope.row[l.value] }}%
						</span>
            <span class="tableText" v-else>
							{{ scope.row[l.value] }}
						</span>
					</template>
				</el-table-column>
			</template>
        <el-table-column align="center" width="130px">
              <template slot-scope="scope">
                <el-row>
                  <!-- <el-tooltip
                    class="item"
                    effect="dark"
                    content="rerun signal"
                    placement="bottom-start"
                    v-if="currentPageTab === 'MyScreen'"
                  >
                    <el-button
                      type="warning"
                      icon="el-icon-video-play"
                      circle
                      size="mini"
                      :loading="scope.row.rerunLoading"
                      v-if="currentPageTab === 'MyScreen'"
                      @click="rerunSignal(scope.row)"
                    ></el-button>
                  </el-tooltip> -->
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="edit signal"
                    placement="bottom-start"
                    v-if="currentPageTab === 'MyScreen'"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      size="mini"
                      v-if="currentPageTab === 'MyScreen'"
                      @click="handleRowClick(scope.row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="copy start"
                    placement="bottom-start"
                  >
                    <el-button
                      type="info"
                      icon="el-icon-copy-document"
                      circle
                      size="mini"
                      :loading="scope.row.copyLoading"
                      @click="copySignals(scope.row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip
									class="item"
									effect="dark"
									content="view screen results"
									placement="bottom-start"
								>
									<el-button
										type="warning"
										icon="el-icon-view"
										circle
										size="mini"
                    :loading="scope.row.viewLoading"
										@click="viewResults(scope.row)"
									></el-button>
								</el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="delete signal"
                    placement="bottom-start"
                    v-if="currentPageTab === 'MyScreen'"
                  >
                    <el-popconfirm
                      confirm-button-text="yes"
                      cancel-button-text="no"
                      icon="el-icon-info"
                      icon-color="red"
                      v-if="currentPageTab === 'MyScreen'"
                      title="Are you sure you want to delete it?"
                      @confirm="deleteSignals(scope.row.url)"
                    >
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        size="mini"
                        slot="reference"
                      ></el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </el-row>
              </template>
      </el-table-column>
		</el-table>
		<el-pagination
		@current-change="handleCurrentChange"
    :current-page="currentPage"
		:page-size="pageSize"
		:total="total"
		layout="total, prev, pager, next, jumper"
		></el-pagination>
  </div>
</template>

<script>
import { getMyScreensList, saveMyScreenForm, deleteMyScreen, editMyScreenForm, getScreenResults } from '@/service/service'
import { capitalizeFirstLetter, isJson, timestampToTime } from "@/utils"
const debounce = require('lodash/debounce')

export default {
  name: 'SignalsTable',
  props: {
    currentPageTab: String,
    lastSignalDate: String
  },
  data() {
    return {
      currentPage: 1, // Default current page
      searchItem: '',
      currentSort: {}, // 当前的排序信息
      filterData: [],
      loading: false,
      btnLoading: false,
      pageSize: 10,
      total: 0,
      tableCol: [
        {
          label: 'Name',
          value: 'name',
          key: 'name'
        },
        {
          label: 'Category',
          value: 'category',
          key: 'category'
        },
        {
          label: 'Direction',
          value: 'direction',
          key: 'direction'
        },
        // {
        //   label: 'Screen',
        //   value: 'description',
        //   key: 'description',
        //   minWidth: '150px' 
        // },
        {
          label: 'Signal',
          value: 'signals',
          key: 'signals'
        }
      ],
      tableData: [],
      isShowLastSignalDate: false,
      textContent: {
					'MA':"This strategy utilizes the crossover of closing prices and moving averages as trading signals.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
					'MAGap':"This strategy determines trading signals by comparing the difference between the moving average of the current day and the previous day.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
					'MACDHist':"This strategy uses the crossover signals of the MACD histogram as trading signals.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
					'MACDHistGap':"This strategy determines trading signals by comparing the difference between the MACDHist and the previous day's value.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
					'Hammer followed by a rise':"If the previous day's candlestick shows a long lower shadow,<br/>indicating support at the bottom,<br/>a long signal is generated when the price rises above a certain threshold after the opening.",
					'Shooting Star followed by a fall':"If the previous day's candlestick shows a long upper shadow,<br/>indicating resistance at the top,<br/>a short signal is generated when the price falls below a certain threshold after the opening.",
					'UpTrend Pattern':"When the price surpasses the upward trendline connecting the peak points of an uptrend,<br/>it indicates a potential future rise and generates a long signal.",
					'DownTrend Pattern':"When the price falls below the downward trendline connecting the trough points of a downtrend,<br/>it indicates a potential future decline and generates a short signal.",
					'Symbol Close > its\' MA200 and Optix MA5 < 35':"stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35.",
					'Optix #1':"stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35.",
					'Symbol Close > its\' MA200 and Optix < 30':"stocks that are above their 200-day moving average with an Optix less than 30.",
					'Optix #2':"stocks that are above their 200-day moving average with an Optix less than 30.",
					'Optix #4':"stocks that Optix crossbelow 0.5.",
					'Optix #5': 'Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35',
					'Optix #6': 'Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35',
					'Optix #7': 'Symbol Close > its\' MA200 and Optix > 43 After Below 30',
					'Optix MA10 < 30 and Optix < 20':"Optix indicators with a 10-day moving average less than 30 and that day's Optix value is less than 20.",
					'Optix #3':"Optix indicators with a 10-day moving average less than 30 and that day's Optix value is less than 20.",
					'Optix #5':'stocks that are above their 200-day moving average with an Optix 5-day moving average less than 35 then above 43.',
					'Optix #6':'stocks that are above their 200-day moving average with an Optix 10-day moving average less than 35 then above 43.',
					'Optix #7':'stocks that are above their 200-day moving average with an Optix less than 30 then above 43.',
					'Price Breakout':"When the closing price of a stock ranks above 0 in relation to the closing prices of the past 21 trading days, <br/>a golden cross occurs, indicating an upward breakout and generating a long signal. <br/>This suggests that the stock's price has entered a breakout phase and is likely to continue rising.",
					'High Points':"When the highest price of a stock ranks above 100 in relation to the highest prices of the<br/> past 13 trading days (higher stock prices correspond to higher rankings), <br/>it forms a 13-day new high and generates a long signal. This indicates that <br/>the stock is experiencing a positive breakthrough and is in an upward trend.",
					'Low Points':"When the lowest price of a stock ranks below 0 in relation to the lowest prices of the past 13 trading days, <br/>it forms a 13-day new low and generates a short signal. <br/>This indicates that the stock is in a downtrend and can be shorted.",
					'RSI':"When the RSI indicator forms a golden cross above 40, it suggests that the indicator is about to<br/>recover from an oversold state to the midpoint, indicating a potential long signal. <br/>RSI can reflect whether a stock is in an overbought or oversold condition <br />but should be used in conjunction with the trend analysis.",
					'Head and Shoulders Top': 'The stock price rises from the left shoulder to a peak, falls back to the support level, <br/>then rises higher to form a head, and then falls back to the support level again. Afterwards, the price rises to the height of the left shoulder <br/>to form the right shoulder, followed by a significant decline, breaking through the bottom of the pattern and continuing to decline. <br/>Head and shoulders tops are typical bear market signals.',
					'Head and Shoulders Bottom': 'Usually formed after a sharp market decline, indicating a market reversal. The pattern consists of the left shoulder, <br/>head, right shoulder, and neckline. The middle valley (head) is the deepest, while <br/>the front and back valleys (left and right shoulders) are shallower and almost symmetrical, forming <br/>a head and shoulders bottom shape.',
					'Double Top': 'Composed of two similar high points, shaped like the letter "M". The formation of a <br/>double top pattern is a reversal signal, indicating that prices will fall.',
					'Double Bottom': "Also known as a W bottom, formed when the low points of a stock price's two consecutive <br/>declines are roughly the same. It is a bullish reversal pattern.",
					'Triple Tap': 'Triple Tap refers to a scenario where stocks or other assets exhibit repeated bounces off <br/>the support line (the lower boundary of the price range). This pattern is often seen <br/>as a positive signal that stock prices are experiencing strong buying support near the support line.  <br/>By observing this pattern, investors may perceive the support line as an important price level that <br/>may have a positive impact on prices and may be a suitable buying opportunity.',
					'Rounding Bottom': `Rounding bottom is a chart pattern that's used in technical analysis. It's identified by <br/>a series of price movements that graphically form the shape of a "U". Rounding bottoms <br/>are found at the end of extended downward trends and signify a reversal in long-term price movements.`,
					'Ascending Channel': "Ascending channel is the price action contained between upward sloping parallel lines. <br/>Higher highs and higher lows characterize this price pattern. Before traders take a short position <br/>when price breaks below the lower channel line of an ascending channel, they should look <br/>for other signs that show weakness in the pattern.",
					'Descending Channel': "Descending channel is a chart pattern that indicates a downward trend in a security's price. <br/>Visually, a descending channel angles downward, from a high point to a lower point. The idea behind the descending channel <br/>is that once established, it may signify a continuation of lower high and low prices. Once the trendlines are solid and extended, <br/>traders can get a sense of points of price support and resistance.",
					'Trend': 'Closing price above the 252-day moving average is considered as Uptrend.<br/>Closing price below the 252-day moving average is considered as Downtrend.<br/>The whole backtest period is considered as ALL.',
					'ExpectedReturn': 'ExpectedReturn = (WinRate * ProfitTarget - (100.0 - WinRate) * StopLoss) / 100.0',
					'Symbol All Time High': 'Symbol All-Time High is the highest closing price a symbol has reached in its trading history. <br/>Symbols that hit all-time high are often viewed as positive indicators, as it shows that investor <br/>confidence and demand for the symbol is continuing to grow.',
					'Symbol All Time Low': 'Symbol All-Time Low refers to the lowest closing price the symbol has ever traded at over its entire history. <br/>It indicates the symbol has lost significant value compared to its past performance. Investors <br/>view all-time low as a sign of deep trouble.',
					'Symbol 52 Weeks High': 'Symbol 52-Week High is the highest closing price at which a symbol has traded in the last 52 weeks (1 year). <br/>A symbol hitting a new 52-week high is often seen as a positive technical indicator that the symbol <br/>is gaining momentum and is in an uptrend.',
					'Symbol 52 Weeks Low': 'Symbol 52-Week Low is the lowest closing price at which a symbol has traded in the past 52 weeks (1 year). <br/>Symbols trading at or near 52-week lows are generally considered to be in a downtrend or under significant <br/>selling pressure. 52-week lows can trigger technical sell signals and further downward momentum as investors try to cut their losses.',
					'Symbol 4 Weeks High': "Symbol 4-Week High refers to the highest closing price at which a symbol has traded in the last 4 weeks (1 month). <br/>It is a shorter-term technical indicator that gives an idea of a symbol's recent price performance. <br/>Symbols that make new four-week highs are often seen as having positive short-term momentum because they are trading <br/>at the highest price levels of the past month.",
					'Symbol 4 Weeks Low': "Symbol 4-Week Low is the lowest closing price at which a symbol has traded in the past 4 weeks (1 month). Tracking whether <br/>a symbol is near its 4-week low gives an idea of how weak the symbol's recent price has been compared <br/>to the past month. Symbols trading at or near 4-week lows are usually considered to be under short-term selling pressure <br/>or in a recent downtrend.",
					'Symbol 13 Weeks High': 'Symbol 13-Week High is the highest closing price at which a symbol has traded in the past 13 weeks (3 months). <br/>Symbols that make new 13-week high are often seen as having positive medium-term momentum because they are <br/>trading at their highest levels of the past quarter. A new 13-week high can be a bullish signal that <br/>a symbol is in an uptrend.',
					'Symbol 13 Weeks Low': "Symbol 13-Week Low refers to the lowest closing price a symbol has traded at over the past 13 weeks (3 months). <br/>Symbols trading at or near their 13-week lows are often seen as being in a medium-term downtrend or under selling <br/>pressure. The 13-week low gives a longer-term view on a symbol's recent price weakness. Hitting a new 13-week <br/>low can be a bearish signal, suggesting the symbol is in a downward trend.",
					'Trend Score Breakout': "When a stock's Trend Score rises above 7, it indicates a strong positive market trend. This score aggregates ten trend-following indicators, with values ranging from 0 (weakest) to 10 (strongest).",
					'Trend Score Breakdown': "When a stock's Trend Score falls below 3, it indicates a weak market trend. This score aggregates ten trend-following indicators, with values ranging from 0 (weakest) to 10 (strongest).",
				},
				midTermMap: {
					'Symbol Close > its\' MA200 and Optix MA5 < 35':'Optix #1',
					'Symbol Close > its\' MA200 and Optix < 30':'Optix #2',
					'Optix MA10 < 30 and Optix < 20':'Optix #3',
					'Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35':'Optix #5',
					'Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35':'Optix #6',
					'Symbol Close > its\' MA200 and Optix > 43 After Below 30':'Optix #7'
				},
    }
  },
  computed: {
		// Filtered and paginated data to be displayed in the table
		paginatedData() {
			const startIndex = (this.currentPage - 1) * this.pageSize;
			const endIndex = startIndex + this.pageSize;
			// 当checkbox未勾选时，返回原始数据
			return this.filterData?.slice(startIndex, endIndex);
		},
	},
  watch: {
    tableData: {
      handler(newValue) {
        if(Array.isArray(newValue) && newValue.length !== 0) this.filterData = this.tableData
      },
      immediate: true
    }
  },
  methods: {
    async getDataList(tab, doNotResetPage = false) {
      // A request that requires writing two lists
      // if(this.currentPageTab === 'MyScreen') {
      debugger
				this.loading = true
        if(this.currentPage !== 1 && !doNotResetPage) this.currentPage = 1
        let res = await getMyScreensList(`/dev/myscreen_app/get_myscreen_records${tab === 'Sample' ? '?sample=1' : ''}`)
        let {data: results, status} = res
        console.log('results', res)
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
        if(status === 200) {
					results = results.map(item => {
            // item.status = capitalizeFirstLetter(item.status)
            // item.period = [item.start_date, item.end_date]
            item.signals = isJson(item.signals) ? JSON.parse(item.signals) : item.signals
            item.cond = isJson(item.cond) ? JSON.parse(item.cond) : item.cond
            item.copyLoading = false
            item.rerunLoading = false
            item.last_signal_date = item.lastdate === '2099-01-01' ? '' : item.lastdate
            item.description = parseJsonOrString(item.description)
						return item
					})
					this.tableData = results
          this.filterData = this.tableData
          this.total = this.filterData.length
          const totalPages = Math.ceil(this.total / this.pageSize)
          if(this.currentPage > totalPages && doNotResetPage) this.currentPage = totalPages
          this.loading = false
        // }
      }
    },
    async handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
      await this.applySort()
		},
    async onSortChange({ column, prop, order }) {
			// if(this.currentPage != 1) this.currentPage = 1
      if (column.sortable !== 'custom') return
      this.currentSort = {
        prop: prop,
        order: order,
      };
      // Is there an input box query
      this.handleQuery()
      await this.applySort()
    },
    handleQuery: debounce(function() {
      if (this.currentPage !== 1) this.currentPage = 1;
      const trimmedStr = this.searchItem.trim();
      if(trimmedStr === '') {this.filterData = this.tableData; this.total = this.filterData.length; return}
      const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");
      let result = [];
      for (const item of this.tableData) {
        let matchFound = false;
        for (const key in item) {
          if (key !== 'last_signal_date') {
            if (regex.test(String(item[key]).toLowerCase())) {
              matchFound = true;
              break;
            }
          }
        }
        if (matchFound) {
          result.push(item);
        }
      }
      this.filterData = result;
      this.total = this.filterData.length
    }, 500),
    // 使用反斜杠转义特殊字符
    escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
    async applySort() {
      let { prop:colName, order:sortingOrder } = this.currentSort;
      console.log(colName, sortingOrder)
			// 日期类型排序
      if (['last_signal_date'].indexOf(colName) !== -1) {
        this.filterData.sort((a, b) => {
          const dateA = a[colName] ? new Date(a[colName]) : null;
          const dateB = b[colName] ? new Date(b[colName]) : null;

          // 处理空值，将空值排在最后面
          if (!dateA && !dateB) return 0; // 两个都为空
          if (!dateA) return 1; // `a`为空，排在后面
          if (!dateB) return -1; // `b`为空，排在后面

          // 正常比较日期
          if (sortingOrder === 'ascending') {
              return dateA - dateB;
          } else if (sortingOrder === 'descending') {
              return dateB - dateA;
          }

          return 0; // 默认情况下不排序
        });
      }
			// 字符串类型排序
			if(['name','symbol','timeframe'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.filterData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.filterData.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else{
				}
			}
		},
    async handleRowClick(row) {
      this.$emit('displayFormData', row, true)
      this.$emit('displayResultsData', [])
    },
    viewResults(row) {
      this.$emit('displayFormData', row)
      this.$emit('displayResultsData', row)
    },
    async copySignals(data) {
      debugger
      const _this = this
			try {
        data.copyLoading = true
				const copyName = `${data.name}(copy)`

				// 检查是否已经存在同名的 signals
				const isDuplicate = this.tableData.some(
					item => item.name === copyName
				)

				if (isDuplicate) {
          data.copyLoading = false
					this.popUpMsgBox('The signals has been copied')
				} else {
					// 获取参数并准备复制
					const params = {
						...data,
						name: copyName
					}
          const prepareData = this.reassignBTAttributes(params)
					// 发起复制请求
					const res = await saveMyScreenForm(prepareData)
          console.log('res', res)
          const code = res.data.code
          if(code == 211) {
            await _this.$emit('changeSecondTab', 'MyScreen')
            this.popUpMsgBox('Copy successfully')
          }else if(code == 411) {
            this.popUpMsgBox('The signal has been copied')
            
          }
          data.copyLoading = false
				}
			} catch (error) {
        data.copyLoading = false
				console.error('An error occurred:', error)
			}
		},
    async rerunSignal(data) {
			try {
        data.rerunLoading = true
					// 获取参数并准备复制
					const params = {
						...data
					}
          const prepareData = this.reassignBTAttributes(params)
					// 发起复制请求
					const res = await editMyScreenForm(prepareData, data.url)
          console.log('res', res)
          const code = res.data.code
          const _data = isJson(res.data.data) ? JSON.parse(res.data.data) : res.data.data
          const last_signal_date = _data.lastdate //2099-12-31
          if(code == 211 || code == 213) {
            await this.$emit('refreshBTList')
            let msg = 'Screens re-run successfully. Last signal dates are now up to date'
            if(last_signal_date === '2099-12-31') msg = 'Signal re-run successful. No last signal date found. Adjust trigger conditions.'
            this.popUpMsgBox(msg)
          }else {
            this.popUpMsgBox('Failed to re-run signals')
            
          }
          data.rerunLoading = false
			} catch (error) {
        data.rerunLoading = false
				console.error('An error occurred:', error)
			}
    },
    reassignBTAttributes(data) {
      debugger
      // use for copy
      data['cond'] = isJson(data['cond']) ? data['cond'] : JSON.stringify(data['cond'])
      data['description'] = isJson(data['description']) ? data['description'] : JSON.stringify(data['description'])
      data['signals'] = isJson(data['signals']) ? data['signals'] : JSON.stringify(data['signals'])
			const selectedProps = [
				'name',
				'symbol',
				'timeframe',
				'signals',
        'score',
        'signals_in_market',
        'relation',
        'start_date',
        'end_date',
        'delay_bars',
        'subscribe',
        'cond',
        'description'
			]
			let backtestParams = Object.assign(
				{},
				...selectedProps.map((prop) => ({ [prop]: data[prop] }))
			)
      console.log('backtestParams', backtestParams)
      return backtestParams
		},
    async deleteSignals(url) {
			await deleteMyScreen(url)
			await this.getDataList(null, true)
			this.popUpMsgBox('Successfully deleted')
    },
    tableRowClassName({row, rowIndex}) {
      if(this.lastSignalDate && this.lastSignalDate === row.last_signal_date) {this.isShowLastSignalDate = true;return 'highlighted'}
      return ''
		},
    async viewResults(row) {
      debugger
      const {url} = row
      const res = await getScreenResults(url)
      res.data.data = isJson(res.data.data) ? JSON.parse(res.data.data) : res.data.data
      const data = isJson(res.data.data.data) ? JSON.parse(res.data.data.data) : res.data.data.data
      console.log('data', data)
      this.$emit('displayResultsData', data)
      this.$emit('displayFormData', row, false)
    },
    }
  }
</script>

<style lang="less" scoped>
.search-box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0px 20px 0px;
  border-bottom: 2px solid #dddddd;
}
.el-input-group{
  width: 20%;
}
.CPM-list-container{
  padding: 20px 20px 20px 20px;
}
.showDate {
  margin: 5px 0;
}
.ScannerBTTable .el-button i {
  font-size: 16px;
}
.ScannerBTTable .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  /deep/ .el-form-item__label {
    width: 200px;
  }
}
.demo-table-expand {
  margin-left: 130px;
}
/deep/ .el-button--mini.is-circle {
  margin: 0 2px;
}
/deep/ .el-input--suffix .el-input__inner {
  margin-left: 0px
}
.el-table /deep/ tr.el-table__row.highlighted{
  background-color: yellow !important;
}
</style>