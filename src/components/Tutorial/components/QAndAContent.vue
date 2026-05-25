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
<section v-if="id[0] == '0'">
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
           <p><a href="https://btv2.sentimentrader.com/doc/scannerdoc/1">More detailed signal explanations</a>.</p>
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
</section>
<section v-if="id[0] == '1'">
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
</section>
<section v-if="id[0] == '2'">
    <h1 id="2">📈 Option Scanner Basic Usage Q&A</h1>
    <h3 id="2-0">Q1: What is the Option Scanner, and how can it help me?</h3>
       <div class="answer-block">
           <p><strong>A:</strong>  The Smart Option Scanner is an <strong>intelligent screening tool designed specifically for option sellers (writers).</strong> Put simply:</p>
                <ul>
                    <li>It scans over <strong>4,200</strong> stocks and indices daily. </li>
                    <li>It automatically identifies high-probability Sell Put (Short Put) opportunities with an estimated <strong>95% to 99% win rate</strong>.  </li>
                    <li>It calculates the <strong>Probability of Profit (PoP)</strong>, <strong>Expected Value</strong>, and <strong>risk parameters</strong> for you.</li>
                </ul>
                <strong>Target Audience</strong>: Investors who want to generate regular income via option premiums but are unsure which specific contracts to select.
       </div>

       <h3 id="2-1">Q2:  What is a "Sell Put" strategy?</h3>
       <div class="answer-block">
            <p><strong>A:</strong> Selling a Put (also known as a Short Put) means <strong>writing a bearish option contract</strong>:</p>
            <table>
                <thead>
                    <tr>
                        <th>Scenario</th>
                        <th>Explanation</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>You Receive</strong></td>
                        <td>An upfront cash premium paid by the option buyer (instant cash flow).</td>
                    </tr>
                    <tr>
                        <td><strong>You Obligate Yourself to</strong></td>
                        <td>Buy the underlying shares at the strike price if the stock price drops below that level.</td>
                    </tr>
                    <tr>
                        <td><strong>You Want</strong></td>
                        <td>The stock price to <strong>stay flat</strong> or <strong>move up</strong>, causing the option to expire worthless so you keep the entire premium as pure profit.</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Why Sell Puts?</strong></p>
            <ul>
                <li>✅ <strong>Premium Generation</strong>: Collecting premium acts much like "collecting rent" on your capital.</li>
                <li>✅ <strong>Discounted Entry</strong>: If the stock dips below the strike price, you are assigned to buy shares at a lower, discounted price (which is ideal if it's a stock you wanted to own anyway).</li>
                <li>✅ <strong>Higher Probability</strong>: The statistical win rate of selling options is typically much higher than buying them.</li>
            </ul>
        </div>

       <h3 id="2-2">Q3:Why is it recommended to target a Probability of Profit (Prob. of Profit) above 95%?</h3>
       <div class="answer-block">
            <p><strong>A:</strong> <strong>Probability of Profit (PoP)</strong> indicates the mathematical likelihood that the trade will <strong>close in the green at expiration</strong>.</p>
            <ul>
                <li>A Probability of Profit of 95% means that mathematically, out of 100 identical trades, 95 are projected to be profitable.</li>
            </ul>
            <p><strong>Why target a Probability of Profit &gt; 95%?</strong></p>
            <table>
                <thead>
                    <tr>
                        <th>Probability of Profit Tier</th>
                        <th>Implications</th>
                        <th>Suitability</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>90% - 95%</td>
                        <td>Balanced risk/reward</td>
                        <td>Moderate/Balanced Investors</td>
                    </tr>
                    <tr>
                        <td><strong>95% - 99%</strong></td>
                        <td><strong>Highly favorable odds</strong></td>
                        <td><strong>Conservative Investors / Beginners</strong></td>
                    </tr>
                    <tr>
                        <td>&gt; 99%</td>
                        <td>Exceptionally safe odds</td>
                        <td>Ultra-Conservative Investors</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Risk Warning</strong>: Probability of Profit is a <strong>statistical estimation</strong> modeled on quantitative mathematics (such as the Black-Scholes formula); it is not a guaranteed outcome. It can underperform during extreme black swan market conditions.</p>
        </div>
        <h3 id="2-3">Q4: What is the Expected Value Score, and why does it matter?</h3>
<div class="answer-block">
    <p><strong>A:</strong> The <strong>Expected Value Score (EV Score)</strong> calculates the long-term mathematical <strong>expectancy of a trade</strong>.</p>
    <ul>
        <li>It factors in: <strong>(Win Rate &times; Average Profit) - (Loss Rate &times; Average Loss)</strong>.</li>
    </ul>
    <p><strong>How to interpret the Expected Value Score:</strong></p>
    <table>
        <thead>
            <tr>
                <th>Expected Value Score</th>
                <th>Meaning</th>
                <th>Actionable Advice</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Positive (+)</strong></td>
                <td><strong>Positive Expectancy</strong></td>
                <td><strong>✅ Mathematically viable; worth consideration.</strong></td>
            </tr>
            <tr>
                <td>0</td>
                <td>Break-even expectancy</td>
                <td>Dead money; yields no edge over time.</td>
            </tr>
            <tr>
                <td>Negative (-)</td>
                <td>Negative Expectancy</td>
                <td>❌ Avoid entirely; structurally designed to lose money.</td>
            </tr>
        </tbody>
    </table>
    <p><strong>In short</strong>: An Expected Value Score &gt; 0 indicates that executing this trade repeatedly over the long run will yield profits, while an Expected Value Score &lt; 0 will bleed capital over time.</p>
</div>

 <h3 id="2-4">Q5: What is the difference between CAGR and a standard return rate?</h3>
<div class="answer-block">
    <p><strong>A:</strong> <strong>CAGR</strong> stands for <strong>Compound Annual Growth Rate</strong>.<br><strong>Why use CAGR?</strong></p>
    <table>
        <thead>
            <tr>
                <th>Feature</th>
                <th>Standard Return Rate</th>
                <th>CAGR</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Calculation</strong></td>
                <td>Premium &divide; Margin/Collateral requirement</td>
                <td>Annualized compounded returns</td>
            </tr>
            <tr>
                <td><strong>Horizon</strong></td>
                <td>Fixed to the contract's lifespan</td>
                <td>Standardized over a 1-year window</td>
            </tr>
            <tr>
                <td><strong>Comparability</strong></td>
                <td>Distorted across different durations</td>
                <td><strong>Provides an apples-to-apples comparison</strong></td>
            </tr>
        </tbody>
    </table>
    <p><strong>Example:</strong></p>
    <ul>
        <li><strong>Contract A</strong>: Expires in 30 days, yielding a 2% return.</li>
        <li><strong>Contract B</strong>: Expires in 60 days, yielding a 4% return.</li>
    </ul>
    <p><strong>Which is better?</strong> Evaluating the CAGR reveals the truth:</p>
    <ul>
        <li>Contract A CAGR &approx; 27% (Annualized)</li>
        <li>Contract B CAGR &approx; 27% (Annualized)</li>
    </ul>
    <p><strong>Conclusion</strong>: Both positions offer virtually identical performance over time. Without CAGR, it is incredibly easy to be misled by nominal return percentages.</p>
</div>

 <h3 id="2-5">Q6: What is DTE? How many days to expiration should I select?</h3>
<div class="answer-block">
    <p><strong>A:</strong> <strong>DTE</strong> stands for <strong>Days to Expiration</strong>.<br><strong>DTE Selection Framework:</strong></p>
    <table>
        <thead>
            <tr>
                <th>DTE Range</th>
                <th>Strategic Profile</th>
                <th>Best For</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>7 - 14 Days</strong></td>
                <td>Rapid time decay; short-term quick turnaround</td>
                <td>High-frequency traders</td>
            </tr>
            <tr>
                <td><strong>20 - 45 Days</strong></td>
                <td>The optimal sweet spot optimizing time decay and adjustments</td>
                <td>Most retail investors</td>
            </tr>
            <tr>
                <td><strong>60 - 90 Days</strong></td>
                <td>Maximum breathing room for adjustments; ties up capital long-term</td>
                <td>Conservative long-term investors</td>
            </tr>
        </tbody>
    </table>
    <p><strong>Beginner Recommendation</strong>: Start within the <strong>30 to 45 DTE</strong> window. This is widely considered the options trading "sweet spot" because:</p>
    <ul>
        <li>✅ <strong>Theta Decay Acceleration</strong>: Premium melts away rapidly in your favor (Theta gains).</li>
        <li>✅ <strong>Sufficient Cushion</strong>: Provides ample time to manage or adjust positions if the stock fluctuates.</li>
        <li>✅ <strong>Capital Efficiency</strong>: Capital is un-docked within a reasonable timeframe.</li>
    </ul>
</div>

 <h3 id="2-6">Q7: How do I use the Break Even price practically?</h3>
<div class="answer-block">
    <p><strong>A:</strong> The <strong>Break Even Price</strong> defines your mathematical floor.<br><strong>Short Put Break Even Formula:</strong></p>
    <p style="text-align: center; font-weight: bold;">Break Even = Strike Price - Premium Received</p>
    <p><strong>Example:</strong></p>
    <ul>
        <li><strong>Stock Price</strong>: $100</li>
        <li><strong>Put Option Strike</strong>: $95</li>
        <li><strong>Premium Collected</strong>: $2</li>
        <li><strong>Break Even</strong> = $95 - $2 = <strong>$93</strong></li>
    </ul>
    <p><strong>Implications:</strong></p>
    <ul>
        <li><strong>Stock Price &gt; $93</strong>: You are net profitable (keeping the premium).</li>
        <li><strong>Stock Price = $93</strong>: Absolute break-even; zero profit, zero loss.</li>
        <li><strong>Stock Price &lt; $93</strong>: The trade enters a net loss position.</li>
    </ul>
    <p><strong>Practical Application:</strong></p>
    <ol>
        <li><strong>Risk Metric</strong>: Visually map how much downside buffer you have from the current market price.</li>
        <li><strong>Mental Check</strong>: Confirm if you are genuinely comfortable buying the stock at this exact adjusted cost basis.</li>
        <li><strong>Comparative Analysis</strong>: Use it to filter choices between alternative strike setups.</li>
    </ol>
</div>

 <h3 id="2-7">Q8: What is the difference between the Option Scanner and the Stock Scanner? Which should I use?</h3>
<div class="answer-block">
    <p><strong>A:</strong> Comparison between the two tools:</p>
    <table>
        <thead>
            <tr>
                <th>Comparison Metric</th>
                <th>Smart Stock Scanner</th>
                <th>Smart Option Scanner</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Underlying Target</strong></td>
                <td>Shares of equity (Underlying)</td>
                <td>Option contracts</td>
            </tr>
            <tr>
                <td><strong>Trade Execution</strong></td>
                <td>Long/Short shares</td>
                <td>Selling Puts</td>
            </tr>
            <tr>
                <td><strong>Profit Engine</strong></td>
                <td>Capital appreciation + Dividends</td>
                <td>Premium collection (Time decay)</td>
            </tr>
            <tr>
                <td><strong>Risk Matrix</strong></td>
                <td>Linear directional risk</td>
                <td>Time decay combined with directional buffer</td>
            </tr>
            <tr>
                <td><strong>Capital Overlay</strong></td>
                <td>Cash-settled / Full share cost</td>
                <td>Margin / Collateral efficient</td>
            </tr>
            <tr>
                <td><strong>Core Intent</strong></td>
                <td>Long-term ownership of an appreciating asset</td>
                <td>Cash flow generation / Discounted accumulation</td>
            </tr>
        </tbody>
    </table>
    <p><strong>How to choose?</strong></p>
    <table>
        <thead>
            <tr>
                <th>If your primary objective is to...</th>
                <th>Use this tool:</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Buy shares outright and wait for long-term growth</td>
                <td><strong>Stock Scanner</strong></td>
            </tr>
            <tr>
                <td>Extract steady cash flow income ("rent collection")</td>
                <td><strong>Option Scanner</strong></td>
            </tr>
            <tr>
                <td>Layer option strategies over equity to optimize portfolio alpha</td>
                <td><strong>Combine Both Tools</strong></td>
            </tr>
        </tbody>
    </table>
</div>

 <h3 id="2-8">Q9: I found an exceptional trade opportunity, but I want to manage my risk. How do I hedge?</h3>
<div class="answer-block">
    <p><strong>A:</strong> The Option Seller's Risk Management Playbook:</p>
    
    <h4>1. Position Sizing (The Golden Rule)</h4>
    <p>Rule: Limit allocation per trade to &le; 5-10% of total portfolio net liquidating value.<br>Example: For a $100,000 portfolio, cap risk/collateral per trade at $5,000 - $10,000.</p>
    
    <h4>2. Sector and Ticker Diversification</h4>
    <ul>
        <li>Never allocate maximum capital to a single stock.</li>
        <li>Spread open trades across 3 to 5 non-correlated sectors.</li>
        <li>Ensure single corporate earnings anomalies do not cripple the overall account.</li>
    </ul>
    
    <h4>3. Execution-Level Defenses (Hedging)</h4>
    <ul>
        <li><strong>Strategy A: Buying Protective Puts (Spreads)</strong>
            <ul>
                <li>Buy a further out-of-the-money Put below your short position to act as an insurance policy.</li>
                <li><strong>Trade-off</strong>: This reduces net premium collected up front, but definitively caps maximum catastrophic downside risk.</li>
            </ul>
        </li>
        <li><strong>Strategy B: Strict Stop-Loss Execution</strong>
            <ul>
                <li>Hard-code stop-loss triggers inside your brokerage account to close the position automatically if parameters breach your threshold.</li>
            </ul>
        </li>
        <li><strong>Strategy C: Strategic Rolling (Time Extension)</strong>
            <ul>
                <li>If the underlying price tests your short strike, execute a "Roll": buy back the current option to close it and simultaneously sell a further-out expiration date (and potentially a lower strike).</li>
                <li>This nets additional premium while buying more time and extending your break-even buffer.</li>
            </ul>
        </li>
    </ul>
    
    <h4>4. Psychological Controls</h4>
    <ul>
        <li><strong>Eliminate Greed</strong>: Take profits smoothly when your defined target is met; don't squeeze for the last penny.</li>
        <li><strong>Master Panic</strong>: If a definitive stop-loss triggers, exit with discipline; do not hold and pray.</li>
        <li><strong>Ban Revenge Trading</strong>: Never scale up size immediately following a loss in an emotional bid to win capital back.</li>
        <li><strong>Maintain Protocol</strong>: Trade like an algorithm; stick strictly to predefined trade structures.</li>
    </ul>
</div>
<h3 id="2-9">Q10: Is the Option Scanner right for me?</h3>
<div class="answer-block">
    <p><strong>A:</strong> If your goal is to extract reliable cash flow via premiums and you are comfortable occasionally buying high-quality equities at a discount during market dips, this tool is perfectly tailored for you.</p>
</div>

<h3 id="2-10">Q11: What is the underlying financial logic behind making money by selling Puts?</h3>
<div class="answer-block">
    <p><strong>A:</strong> You pocket a cash premium on day one in exchange for taking on the statistical obligation that the stock won't crash past a specific line in the sand (the strike). If it stays above that line, the premium is yours to keep. If it breaks below, you buy the stock at a discount relative to its original price.</p>
</div>

<h3 id="2-11">Q12: What constitutes a "High-Quality Setup"?</h3>
<div class="answer-block">
    <p><strong>A:</strong> A contract that checks four simultaneous boxes: high Probability of Profit (&gt;95%), positive Expected Value Score, reasonable CAGR, and an underlying ticker you genuinely do not mind owning for the long haul.</p>
</div>

<h3 id="2-12">Q13: Is a higher Probability of Profit always better?</h3>
<div class="answer-block">
    <p><strong>A:</strong> Not necessarily. As Probability of Profit climbs higher, the premium collected drops proportionally, lowering your nominal return. Setting the scanner filter around <strong>95%</strong> captures the optimal sweet spot—offering an exceptional safety margin paired with meaningful yield.</p>
</div>

<h3 id="2-13">Q14: What is considered a normal or healthy return rate?</h3>
<div class="answer-block">
    <p><strong>A:</strong> A per-trade nominal return of 1% to 5% is standard, translating to an annualized CAGR of 15% to 30%. Be highly skeptical of setups claiming higher yields, as they mask severe tail risk.</p>
</div>

<h3 id="2-14">Q15: Should I favor short-term or long-term durations?</h3>
<div class="answer-block">
    <p><strong>A:</strong> Stay anchored in the <strong>30 to 45 DTE</strong> window. Options with less than 14 DTE offer zero room for management if a trade moves against you, while contracts past 60 DTE tie up collateral for too long with diminished time decay speed.</p>
</div>

<h3 id="2-15">Q16: Is being assigned (forced to buy the stock) a failure?</h3>
<div class="answer-block">
    <p><strong>A:</strong> Absolutely not. If your original thesis was to accumulate shares of a premium company at a steep discount, assignment achieves your goal seamlessly—with an entry basis made even cheaper by the premium you banked on day one.</p>
</div>

<h3 id="2-16">Q17: What happens if the stock drops but stays above my strike price?</h3>
<div class="answer-block">
    <p><strong>A:</strong> Absolutely nothing changes. As long as the stock finishes even one cent above the strike at expiration, the contract expires completely worthless, and you retain 100% of the premium. Interim fluctuations are irrelevant; only the settlement print matters.</p>
</div>

<h3 id="2-17">Q18: Should I trade contracts offering unusually massive premiums?</h3>
<div class="answer-block">
    <p><strong>A:</strong> Outsized premiums mean the market expects massive, dangerous volatility (High Implied Volatility). Always cross-reference the Probability of Profit and Expected Value Score first. Chasing raw premium values blindly is how traders take massive losses.</p>
</div>

<h3 id="2-18">Q19: Do I need to manually close option positions before they expire?</h3>
<div class="answer-block">
    <p><strong>A:</strong> In most standard cases, no. Settlement handles it automatically: if the stock stays above the strike, the position vanishes, leaving you with cash profit. If it closes below, shares are assigned to you. You only manage manually if you intend to cut losses early or roll the duration out.</p>
</div>

<h3 id="2-19">Q20: How many positions should I hold at one time?</h3>
<div class="answer-block">
    <p><strong>A:</strong> Aim to maintain <strong>3 to 5 open setups</strong> targeting non-correlated industries, capping individual position allocation at 10% of total capital. This structural diversification limits systemic shocks.</p>
</div>

<h3 id="2-20">Q21: What are the primary traps to avoid?</h3>
<div class="answer-block">
    <p><strong>A:</strong> Avoid three primary structural traps: chasing low Probability of Profit setups for higher premiums, overallocating into a single position, and trading low-quality tickers you do not understand. Staying defensive with an enforced <strong>Probability of Profit &gt; 95%</strong>, disciplined portfolio sizing, and strict ticker selection will insulate you from almost all catastrophic retail trading errors.</p>
</div>
</section>

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