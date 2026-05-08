<template>
	<!-- <div class="doc-content" :class="isToggle ? 'toggle' : ''"> -->
	<div
		class="doc-content"
		:class="{ toggle: classObj.isToggle, hideMargin: classObj.isHideMargin }"
	>
		<div class="section-container">
			<div
				title="Directory"
				class="sidebar-button"
				@click="toggleLeftMenu"
				:class="isToggle ? 'sidebar-toggle' : 'sidebar-untoggle'"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
					role="img"
					viewBox="0 0 448 512"
					class="icon"
				>
					<path
						fill="currentColor"
						d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"
					></path>
				</svg>
			</div>
				<h1 id="0">💡 Smart Stock Scanner Basic Usage Q&A</h1>
       <hr>
       <h3 id="0-0">Q1: What is Smart Stock Scanner?</h3>
       <div class="answer-block">
           <p><strong>A:</strong> Smart Stock Scanner is an intelligent stock scanning system based on various technical indicators and signal strategies that recommends stocks meeting specific criteria daily. It provides stock scanning data, including signal types, win rates, expected returns, Trend Scores, Optix, and other key metrics.</p>
       </div>

       <h3 id="0-1">Q2: How can I view today’s recommended stock list?</h3>
       <div class="answer-block">
           <p><strong>A:</strong></p>
           <ol>
               <li>Open the <a href="https://btv2.sentimentrader.com/scannerai">Smart Stock Scanner</a> interface.</li>
               <li>The system will automatically display the recommendation list for the latest date.</li>
               <li>The list includes: Ticker, Closing Price, Signal Type, Direction, Win Rate, Expected Return, Trend Score, Optix, and other indicators.</li>
           </ol>
           <el-image
            style="width: 80%; height: 50%"
            class="image-border"
            :src="smartStockScannerDailyPicksExample"
            fit="fill"
            :preview-src-list="previewList"
            
           ></el-image>
       </div>

       <h3 id="0-2">Q3: What are the signal types?</h3>
       <div class="answer-block">
           <p><strong>A:</strong> Common signal types include:</p>
           <ul>
               <li><strong>Trend Following:</strong> MA, MAGap, MACDHist, MACDHistGap.</li>
               <li><strong>Candlestick Patterns:</strong> Hammer followed by a rise, Shooting Star followed by a fall.</li>
               <li><strong>Trendlines:</strong> UpTrend Pattern, DownTrend Pattern.</li>
               <li><strong>Optix Sentiment:</strong> Optix #1 ~ Optix #7.</li>
               <li><strong>Price Breakouts:</strong> PriceBreakout, HighPoints, LowPoints.</li>
               <li><strong>Pattern Recognition:</strong> Head and Shoulders, Double Top, Double Bottom, Ascending Channel, Descending Channel.</li>
               <li><strong>Highs and Lows:</strong> Symbol All-Time High/Low, Symbol 52-Week High/Low, Symbol 4-Week High/Low, Symbol 13-Week High/Low.</li>
           </ul>
           <p><a href="https://btv2.sentimentrader.com/doc/scannerdoc/0">More detailed signal explanations</a>.</p>
       </div>

       <h3 id="0-3">Q4: How should I interpret the Optix indicator?</h3>
       <div class="answer-block">
           <p><strong>A:</strong></p>
           <ul>
               <li><strong>Optix 0-20:</strong> Low sentiment, potential for a bounce.</li>
               <li><strong>Optix 20-80:</strong> Neutral zone.</li>
               <li><strong>Optix 80-100:</strong> High sentiment, potential for a pullback.</li>
           </ul>
       </div>

       <h3 id="0-4">Q5: What does Trend Score mean?</h3>
       <div class="answer-block">
           <p><strong>A:</strong> Trend Score is a measurement of trend strength on a scale of 0-10:</p>
           <ul>
               <li><strong>0-3:</strong> Weak trend.</li>
               <li><strong>4-6:</strong> Neutral trend.</li>
               <li><strong>7-8:</strong> Strong trend.</li>
               <li><strong>9-10:</strong> Extremely strong trend.</li>
           </ul>
       </div>

       <h3 id="0-5">Q6: How do I view historical backtest data for a specific stock?</h3>
       <div class="answer-block">
           <p><strong>A:</strong></p>
           <ol>
               <li>Find the target stock in the <a href="https://btv2.sentimentrader.com/scannerai">Smart Stock Scanner</a> list.</li>
               <li>Click the ticker symbol or the "Details" button.</li>
               <el-image
                style="width: 80%; height: 50%"
                class="image-border"
                :src="stockHistoryBacktestData"
                fit="fill"
                :preview-src-list="previewList"
               ></el-image>
               <li>View the historical backtest summary for that stock, including win rate, average profit/loss, maximum drawdown, etc.</li>
               <el-image
                style="width: 80%; height: 50%"
                class="image-border"
                :src="smartStockScannerDetailResultSummary"
                fit="contain"
                :preview-src-list="previewList"
               ></el-image>
           </ol>
       </div>

       <hr>
    <h1 id="1">📊 Scanner Backtest Basic Usage Q&A</h1>
    <hr>
    <h3 id="1-0">Q1: What is Scanner Backtest?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> <a href="https://btv2.sentimentrader.com/scannerai/backtest">Scanner Backtest</a> is an intelligent stock scanning backtest system that allows users to create custom backtests based on multiple technical indicators and signal strategies to evaluate strategy performance on historical data.</p>
    </div>

    <h3 id="1-1">Q2: How do I create a new backtest?</h3>
    <div class="answer-block">
        <p><strong>A:</strong></p>
        <ol>
            <li>Click the "Create New" button to reset the form.</li>
            <li>Fill in the basic parameters (Name, Total Capital, Commission, Date Range).</li>
            <li>Select signal types (single or multiple selection available).</li>
            <li>Set risk control parameters (Take Profit, Stop Loss ranges, Time in Market).</li>
            <li>Configure technical indicator filters (Trend Score range, Optix range).</li>
            <li>Click "View List" to preview stocks that meet the criteria.</li>
            <li>After confirming there is data, click "Run Backtest" to execute.</li>
        </ol>
        <el-image
         style="width: 80%; height: 50%"
         class="image-border"
         :src="scannerBacktestMainInterfacePreviewFilterList"
         fit="fill"
         :preview-src-list="previewList"
        ></el-image>
    </div>

    <h3 id="1-3">Q3: What are the backtest parameters?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> Main parameters include:</p>
        <table>
            <thead>
                <tr>
                    <th>Parameter Category</th>
                    <th>Specific Parameters</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Basic Parameters</strong></td>
                    <td>Name, Total Capital, Commission, Start/End Date, Type</td>
                </tr>
                <tr>
                    <td><strong>Signal Selection</strong></td>
                    <td>Signals (multi-select supported)</td>
                </tr>
                <tr>
                    <td><strong>Risk Control</strong></td>
                    <td>Take Profit, Stop Loss, Time In Market</td>
                </tr>
                <tr>
                    <td><strong>Technical Indicators</strong></td>
                    <td>Trend Score Range, RelTrend Score Range, Optix Range</td>
                </tr>
                <tr>
                    <td><strong>Capital Management</strong></td>
                    <td>MAX Daily Symbol Nums, Capital Allocate</td>
                </tr>
                <tr>
                    <td><strong>Long/Short Ratio</strong></td>
                    <td>Long / Short Percentage</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h3 id="1-3">Q4: How do I optimize strategy parameters?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> Refer to the parameter optimization table:</p>
        <table>
            <thead>
                <tr>
                    <th>Data Characteristic</th>
                    <th>Optimization Suggestion</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>High Optix (&gt;80)</td>
                    <td>Narrow Optix range to below 80</td>
                </tr>
                <tr>
                    <td>High Z-Score (&gt;3)</td>
                    <td>Shorten TimeInMarket</td>
                </tr>
                <tr>
                    <td>High MaxRisk</td>
                    <td>Tighten StopLoss or increase Trend Score requirements</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h3 id="1-4">Q5: What metrics are included in the backtest results?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> Core metrics include:</p>
        <ul>
            <li><strong>Return Metrics:</strong> Total Return %, Median Trade Return %, Annual Return %.</li>
            <li><strong>Risk Metrics:</strong> Max Risk %, STD. DEV, Z-SCORE.</li>
            <li><strong>Trade Statistics:</strong> Win Rate %, Average Trade Win/Loss %, Total Trades.</li>
            <li><strong>Visualization:</strong> Returns Chart, Drawdown Chart.</li>
        </ul>
        <el-image
          style="width: 80%; height: 50%"
          class="image-border"
          :src="scannerBacktestMainInterfaceBacktestSummary"
          fit="fill"
          :preview-src-list="previewList"
         ></el-image>
    </div>

    <h3 id="1-5">Q6: How should I interpret the backtest results?</h3>
    <div class="answer-block">
        <p><strong>A:</strong></p>
        <ul>
            <li><strong>Win Rate &gt; 60%:</strong> Good win rate.</li>
            <li><strong>Sharpe Ratio &gt; 0.5:</strong> Acceptable risk-adjusted return.</li>
            <li><strong>Max Risk &lt; 30%:</strong> Controllable maximum drawdown.</li>
            <li><strong>Z-Score &gt; 2.0:</strong> Statistically significant strategy.</li>
        </ul>
    </div>

    <h3  id="1-6">Q7: What should I do if the preview list is empty?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> If the preview returns an empty list, it means the current filtering criteria are too strict. It is recommended to:</p>
        <ol>
            <li>Broaden the Optix range.</li>
            <li>Lower the Trend Score requirements.</li>
            <li>Add more signal types.</li>
            <li>Expand the date range.</li>
        </ol>
    </div>

    <h3 id="1-7">Q8: How do I export backtest data?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> Click the download button to export an Excel file containing three worksheets:</p>
        <ul>
            <li>Preview Filter List</li>
            <li>Summary (Backtest summary statistics)</li>
            <li>Trades (Detailed trade records)</li>
        </ul>
        <el-image
          style="width: 80%; height: 50%"
          class="image-border"
          :src="downloadScannerBacktestResults"
          fit="fill"
          :preview-src-list="previewList"
         ></el-image>
    </div>

    <hr>

    <h1 id="2">📈 Option Scanner Basic Usage Q&A</h1>
    <h3 id="2-0">Q1: What is Option Scanner?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> Option Scanner is an intelligent option scanning system used to obtain option market data, including scanning information for Put options.</p>
    </div>

    <h3 id="2-1">Q2: How can I view option scanning data?</h3>
    <div class="answer-block">
        <p><strong>A:</strong></p>
        <ol>
            <li>Open the <a href="https://btv2.sentimentrader.com/scannerai/option">Option Scanner</a> interface.</li>
            <li>The system displays a list of options that meet the criteria.</li>
        </ol>
        <el-image
          style="width: 80%; height: 50%"
          class="image-border"
          :src="optionScannerMainInterface"
          fit="fill"
          :preview-src-list="previewList"
         ></el-image>
    </div>

    <h3 id="2-2">Q3: What data does Option Scanner provide?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> Option scanning data typically includes:</p>
        <ul>
            <li>Option type (Put)</li>
            <li>Underlying stock ticker</li>
            <li>Strike price</li>
            <li>Expiration date</li>
            <li>Implied Volatility (IV)</li>
            <li>Trading volume</li>
            <li>Open Interest</li>
            <li>Other option-specific metrics</li>
        </ul>
    </div>

    <h3 id="2-3">Q4: What is POP (Win Rate)?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> POP (Probability of Profit) represents the probability that the option contract will be in a profitable state at expiration. It is calculated based on the Black-Scholes model, taking into account the underlying asset price, strike price, time remaining, and volatility.</p>
    </div>

    <h3 id="2-4">Q5: How is the EV Score calculated?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> EV Score (Expected Value Score) is an expected value rating that comprehensively considers profit probability, potential return, and risk. A positive value indicates the trade has a positive expected value, while a negative value suggests avoiding it.</p>
    </div>

    <h3 id="2-5">Q6: Why do some contracts have a high CAGR but a low POP?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> This usually indicates a high-risk, high-reward opportunity. CAGR is calculated on an annualized basis; for short-term contracts, even if the absolute return isn't high, the annualized figure can appear very high. It is recommended to use POP and EV Score together for a comprehensive judgment.</p>
    </div>

    <h3  id="2-6">Q7: How often is the data updated?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> Data is calculated using end-of-day (EOD) market data and is updated once daily after the market closes. Historical data can be accessed to review scanning results for any trading day.</p>
    </div>

    <h3 id="2-7">Q8: Can I trade products other than options?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> Currently, the Smart Option Scanner focuses on Sell Put strategies. For other strategy tools, please stay tuned for product update announcements.</p>
    </div>

    <h3 id="2-8">Q9: How do I choose the right DTE (Days to Expiration)?</h3>
    <div class="answer-block">
        <p><strong>A:</strong></p>
        <ul>
            <li><strong>7-14 Days:</strong> Ultra-short term; time decay (theta) is fast, suitable for high-frequency trading.</li>
            <li><strong>20-45 Days:</strong> Monthly cycle; balances time value and room for adjustment.</li>
            <li><strong>60+ Days:</strong> Long-term strategy; requires more margin, but provides ample time for adjustments.</li>
        </ul>
    </div>

    <h3 id="2-9">Q10: How is the Break Even point calculated?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> For Sell Put strategies, Break Even = Strike Price - Premium. When the price of the underlying asset is above this level, the trade is profitable; when it is below this level, it begins to lose money.</p>
    </div>

    <h3 id="2-10">Q11: Why can't I select weekends or future dates?</h3>
    <div class="answer-block">
        <p><strong>A:</strong> The options market only trades on business days, so there is no market data on weekends. Future dates cannot be selected because the system calculates based on historical data and cannot predict future market conditions.</p>
    </div>

    <h3 id="2-11">Q12: How can I use option data for trading decisions?</h3>
    <div class="answer-block">
        <p><strong>A:</strong></p>
        <ol>
            <li><strong>Put Options:</strong> Used to hedge downside risk or for bearish outlooks.</li>
            <li>Combine signals from the Smart Stock Scanner to choose the appropriate option strategy.</li>
        </ol>
    </div>
	</div>
		<RightMenu
			:menuItems="menuItems"
			v-show="menuItems.length != 0"
		></RightMenu>
	</div>
</template>
<script>
import Tabs from "./Tabs.vue"
import RightMenu from "./RightMenu.vue";
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
				doc: {
					type: String,
					default: ''
				}
  },
  data() {
    return {
      menuItems: [],
      isToggle: false,
      smartStockScannerDailyPicksExample: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/smart-stock-scanner-daily-picks-example.png',
      stockHistoryBacktestData: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/stock-history-backtest-data.png',
      smartStockScannerDetailResultSummary: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/smart-stock-scanner-detail-result-summary.png',
      scannerBacktestMainInterfacePreviewFilterList: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/scanner-backtest-main-interface-preview-filter-list.png',
      scannerBacktestMainInterfaceBacktestSummary: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/scanner-backtest-main-interface-backtest-summary.png',
      downloadScannerBacktestResults: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/download-scanner-backtest-results.png',
      optionScannerMainInterface: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/option-scanner-main-interface.png',
      previewList: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/smart-stock-scanner-daily-picks-example.png', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/stock-history-backtest-data.png', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/smart-stock-scanner-detail-result-summary.png', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/scanner-backtest-main-interface-preview-filter-list.png', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/scanner-backtest-main-interface-backtest-summary.png', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/download-scanner-backtest-results.png', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/option-scanner-main-interface.png'],
    }
  },
  components: {
    RightMenu,
    Tabs
  },
  mounted() {
    const skipID = this.$route.params.id
    if(skipID) {
        this.$nextTick(() => {
            this.jump(`${skipID}`)
        })
    }
  },
  computed: {
    classObj() {
      return {
        isToggle: this.isToggle,
        isHideMargin: this.menuItems.length == 0 ? 'hideMargin' : ''
      }
    }
  },
  methods: {
    toggleLeftMenu() {
      this.isToggle = !this.isToggle
      this.$emit('click', this.isToggle)
    },
    jump(index) {
      this.$nextTick(() => {
        let jump = document.getElementById(index);
        let title = document.querySelectorAll('h1')
        this.navList = Array.from(title)
        this.navList.forEach((item) => {
          item.style.color = 'rgb(0, 50, 60)'
        })
        jump.style.color = '#5b9bd1'
        let total = jump.offsetTop;
        console.log('jump.offsetTop', jump.offsetTop)
        window.scrollTo({
          top: total,
          behavior: 'smooth'
        });
        this.selectAllSubTitle();
      })
    },
    selectAllSubTitle() {
      this.$nextTick(() => {
        let title = document.querySelectorAll('h3')
        debugger
        const navList = Array.from(title)
        this.menuItems = navList.map((item, index) => {
          const menuItem = {}
          menuItem['title'] = item.innerHTML.replace(/^Q\d+:\s*/, '');
          menuItem['id'] = item.id
          const match = item.tagName.match(/\d+/);
          if (match) {
            menuItem['level'] = match[0];
          } else {
            console.error("No number found");
          }
          return menuItem
        })
        console.log('menuItem', this.menuItems)
      })
    }
  }
}
</script>
<style scoped>
.doc-content {
	margin-left: 300px; /* 考虑到侧边栏的宽度 */
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
		Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	color: rgb(0, 50, 60);
	margin-right: 330px;
}
.hideMargin {
	margin-right: 0;
}
.section-container {
	border: 1px solid #f2f6fc;
	margin: 0 10px;
	padding: 2rem 2.5rem;
	background-color: #fff;
	border-radius: 10px;
}
hr {
	border: 0;
	border-top: 1px solid #cdcdcd;
}
h1 {
	font-size: 1.9rem;
}
h2 {
	font-size: 1.5rem;
}
h3 {
	font-size: 1.25rem;
}
.section-container p {
	line-height: 1.7;
	word-wrap: break-word;
	font-weight: 400;
	color: #00323c;
	font-size: 1rem;
}
.toggle {
	margin-left: 0;
}
.sidebar-button {
	width: 40px;
	height: 40px;
	display: inline-block;
	position: absolute;
	text-align: center;
	line-height: 44px;
	margin: 5px 8px;
	color: #888;
	border-radius: 50%;
	padding: 0;
	transition: all 0.2s;
	cursor: pointer;
}
.sidebar-button:hover {
	background-color: #5b9bd1;
	color: white;
	box-shadow: 0px 0px 2px 3px #cee4f7;
}
.sidebar-button .icon {
	display: inline;
	width: 1rem;
	height: 1rem;
}
.sidebar-untoggle {
	left: 300px;
	top: 126px;
}
.sidebar-toggle {
	left: 0;
	top: 123px;
}
.image-border {
	border: 1px solid #00323c;
	border-radius: 5px;
}
li {
	line-height: 1.7;
	word-wrap: break-word;
	font-weight: 400;
	color: #00323c;
	font-size: 1rem;
}
code {
            background-color: #f4f4f4;
            padding: 2px 5px;
            border-radius: 4px;
            font-family: "Courier New", Courier, monospace;
            font-size: 0.9em;
        }
        pre {
            background-color: #2d3436;
            color: #dfe6e9;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: "Courier New", Courier, monospace;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) { background-color: #fcfcfc; }
        blockquote {
            border-left: 5px solid #16a085;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #f0fff4;
            font-style: italic;
        }
        hr { border: 0; border-top: 1px solid #eee; margin: 40px 0; }
        .toc {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
        }
        .toc ul { list-style-type: none; padding-left: 20px; }
        .toc a { text-decoration: none; color: #34495e; }
        .toc a:hover { text-decoration: underline; color: #3498db; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
        h2 {
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-top: 40px;
        }
        h3 {
            color: #2c3e50;
            margin-top: 25px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
        }
        ul {
            margin-bottom: 15px;
        }
        li {
            margin-bottom: 5px;
        }
        hr {
            border: 0;
            border-top: 1px solid #eee;
            margin: 40px 0;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        .answer-block {
            background-color: #fdfdfd;
            padding: 1px 15px;
            border-left: 4px solid #e9ecef;
        }
</style>