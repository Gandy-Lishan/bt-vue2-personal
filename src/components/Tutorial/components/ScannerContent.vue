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
				<h1 id="0">The generation logic of Smart Stock Scanner</h1>
				<hr />
				<p>
					<strong
						>The logic behind Smart Stock Scanner's generation is aimed at
						improving user returns.</strong
					>
				</p>
				<p>
					<strong>Broad market coverage:</strong> Smart Stock Scanner scans stocks
					included in the S&P 1500 and some common index funds, providing
					coverage across a wide market. This means it can capture signals from
					multiple stocks and ETFs, providing users with more investment
					opportunities.
				</p>
				<p>
					<strong>Accurate signal filtering:</strong> Smart Stock Scanner utilizes
					advanced filtering algorithms to extract signals that meet the
					specified requirements from the scanned stocks and ETFs. This enables
					users to obtain more precise signals that align with their investment
					strategies, enhancing the accuracy of investment decisions.
				</p>
				<p>
					<strong>Evaluation based on historical backtesting:</strong> The
					selected signals are combined with their corresponding stocks and ETFs
					for historical backtesting. This historical backtesting evaluation
					helps users understand the performance history of the signals and
					assess their potential profitability.
				</p>
				<p>
					<strong>Data statistical analysis:</strong> Smart Stock Scanner performs
					data statistical analysis on the backtesting results to filter out
					stocks that meet the specified requirements along with their
					corresponding signals. Through data analysis, it identifies signals
					with a higher probability of success, assisting users in selecting
					more promising investment opportunities.
				</p>
				<p>
					<strong>Information presentation and selection:</strong> Smart Stock
					Scanner presents the qualifying signals along with their backtesting
					information, offering users an intuitive interface and data
					visualization. This allows users to better understand and select
					signals that align with their specific needs, increasing their
					potential for investment returns.
				</p>
				<p>
					In conclusion, Smart Stock Scanner enhances the potential for user
					returns through broad market coverage, accurate signal filtering,
					evaluation based on historical backtesting, data statistical analysis,
					and information presentation and selection. It assists users in
					identifying more precise signals in stock and ETF investments,
					providing data support and decision-making guidance to make more
					informed investment decisions and ultimately improve investment
					returns.
				</p>
        <h1 id="1">Table of Contents</h1>
        <ul>
            <li>1.I. Optix Sentiment Indicator Strategies
                <ul>
                    <li>Optix #1: Symbol Close > its' MA200 and Optix MA5 < 35</li>
                    <li>Optix #2: Symbol Close > its' MA200 and Optix < 30</li>
                    <li>Optix #3: Optix MA10 < 30 and Optix < 20</li>
                    <li>Optix #4: Optix CrossBelow 0.5</li>
                    <li>Optix #5: Symbol Close > its' MA200 and Optix MA5 > 43 After Below 35</li>
                    <li>Optix #6: Symbol Close > its' MA200 and Optix MA10 > 43 After Below 35.</li>
                    <li>Optix #7: Symbol Close > its' MA200 and Optix > 43 After Below 30</li>
                </ul>
            </li>
            <li>2. II. Technical Indicator Strategies></li>
            <li>3. III. Trend Patterns</li>
        </ul>

    <h1 id="2">I. Optix Sentiment Indicator Strategies</h1>

    <h3>1.1 Optix #1: Symbol Close > its' MA200 and Optix MA5 < 35</h3>
    <h4>Core Logic</h4>
    <p>The Optix #1 signal is a <strong>mean-reversion strategy</strong> designed to identify high-probability entry points within a long-term bullish trend. By combining price action with sentiment data, it filters for stocks that remain structurally strong (above their long-term average) but are experiencing a temporary, extreme bout of short-term pessimism. The goal is to "buy the dip" when sentiment suggests the selling is exhausted.</p>

    <h4>Mathematical Definition</h4>
    <p><strong>A. Long-Term Trend Filter</strong></p>
    <p>We use the 200-day Simple Moving Average (SMA₂₀₀) to define the primary trend. The closing price (C) must remain above this baseline to confirm the stock is in a "healthy" state.</p>
    <pre>Cₜ > SMA(C, 200)ₜ</pre>

    <p><strong>B. Short-Term Sentiment Smoothing</strong></p>
    <p>The Optix (Optimism Index) measures market sentiment on a scale of 0 to 100. To filter out daily noise, we apply a 5-day Simple Moving Average (SMA₅) to the Optix values.</p>
    <pre>Optix_SMA5ₜ = (1/5) × Σᵢ₌₀⁴ Optixₜ₋ᵢ</pre>

    <h4>Trading Signal Criteria</h4>
    <p>A buy signal is triggered when the following two conditions occur simultaneously at the close of a trading session:</p>
    <table>
        <thead>
            <tr>
                <th>Condition</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Trend Requirement</strong></td>
                <td>The stock's Closing Price is greater than its 200-day Moving Average</td>
            </tr>
            <tr>
                <td><strong>Sentiment Requirement</strong></td>
                <td>The 5-day Moving Average of the Optix indicator is less than 35 (indicating extreme oversold condition)</td>
            </tr>
        </tbody>
    </table>

    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Buy = (Close > SMA₂₀₀) ∧ (Optix_SMA₅ < 35)</pre>

    <h4>Strategic Application</h4>
    <ul>
        <li><strong>Trend Alignment</strong>: By requiring the price to be above the SMA₂₀₀, the model avoids "falling knives" in secular bear markets</li>
        <li><strong>Sentiment Extremes</strong>: An Optix value below 35 typically represents a "pessimism flush." In a bull market, these periods of fear often precede a sharp price recovery</li>
        <li><strong>Data Integrity</strong>: Ensure the SMA₂₀₀ calculation excludes non-trading days to maintain statistical accuracy</li>
    </ul>

    <hr>

    <h3>1.2 Optix #2: Symbol Close > its' MA200 and Optix < 30</h3>
    <h4>Core Logic</h4>
    <p>Optix #2 is a "high-sensitivity" mean-reversion signal. Unlike strategies that use moving averages to smooth sentiment, this model uses the raw daily Optix value. It targets stocks in a confirmed long-term uptrend that hit a sudden, sharp floor of pessimism, offering a tactical entry point before the market has time to "average out" the fear.</p>

    <h4>Mathematical Definition</h4>
    <p><strong>A. Long-Term Trend Filter</strong></p>
    <p>The closing price (C) must be greater than the 200-day Simple Moving Average (SMA₂₀₀).</p>
    <pre>Cₜ > SMA(C, 200)ₜ</pre>

    <p><strong>B. Raw Sentiment Floor</strong></p>
    <p>The Optix value (O) is measured on its absolute daily reading without smoothing.</p>
    <pre>Oₜ < 30</pre>

    <h4>Trading Signal Criteria</h4>
    <p>A buy signal is triggered when:</p>
    <table>
        <thead>
            <tr>
                <th>Condition</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Trend</strong></td>
                <td>The stock is trading above its SMA₂₀₀</td>
            </tr>
            <tr>
                <td><strong>Sharp Pessimism</strong></td>
                <td>The daily Optix value drops below 30</td>
            </tr>
        </tbody>
    </table>

    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Buy = (Cₜ > SMA₂₀₀,ₜ) ∧ (Oₜ < 30)</pre>

    <h4>Strategic Application</h4>
    <p>This signal is more aggressive than #Optix1. By using the raw value (< 30) instead of a 5-day average, it captures "flash" oversold conditions that smoothed indicators might miss. It is ideal for high-volatility environments where price rebounds occur quickly.</p>

    <hr>

    <h3>1.3 Optix #3: Optix MA10 < 30 and Optix < 20</h3>
    <h4>Core Logic</h4>
    <p>Optix #3 focuses on "Deep Sentiment Exhaustion." It requires both a sustained period of bearishness (via the 10-day average) and a final "capitulation" spike (the raw daily value). This ensures the trader enters only when sentiment is overwhelmingly negative across multiple timeframes.</p>

    <h4>Mathematical Definition</h4>
    <p><strong>A. Intermediate Sentiment Trend</strong></p>
    <p>We calculate the 10-day Simple Moving Average (SMA₁₀) of the Optix index.</p>
    <pre>Optix_SMA10ₜ = (1/10) × Σᵢ₌₀⁹ Oₜ₋ᵢ < 30</pre>

    <p><strong>B. Daily Capitulation</strong></p>
    <p>The current day's raw Optix value (O) must show an extreme low.</p>
    <pre>Oₜ < 20</pre>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Condition</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Sustained Fear</strong></td>
                <td>The 10-day Optix average is below 30</td>
            </tr>
            <tr>
                <td><strong>Panic Spike</strong></td>
                <td>The current day's Optix value is below 20</td>
            </tr>
        </tbody>
    </table>

    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Buy = (Optix_SMA₁₀,ₜ < 30) ∧ (Oₜ < 20)</pre>

    <h4>Strategic Application</h4>
    <p>This is a "Value-at-Extremes" signal. By requiring the daily value to be lower than the already-depressed 10-day average, it identifies the climax of a sell-off. Note that this signal does not require a 200-day MA filter, making it a pure sentiment-play.</p>

    <hr>

    <h3>1.4 Optix #4: Optix CrossBelow 0.5</h3>
    <h4>Core Logic</h4>
    <p>Optix #4 is a "Extreme Cross" signal. In specific Optix modeling (where 0.5 represents the extreme pessimism).</p>

    <h4>Mathematical Definition</h4>
    <p><strong>A. The Crossover Function</strong></p>
    <p>We track the Optix value (O) as it crosses a specific threshold (K = 0.5).</p>
    <pre>Oₜ₋₁ ≥ 0.5  and  Oₜ < 0.5</pre>

    <h4>Trading Signal Criteria</h4>
    <p>A signal is triggered when the Optix value crosses below the 0.5 threshold.</p>
    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal = Oₜ CrossBelow 0.5</pre>

    <h4>Strategic Application</h4>
    <p>Does the emergence of extreme pessimism mean an opportunity.</p>

    <hr>

    <h3>1.5 Optix #5: Symbol Close > its' MA200 and Optix MA5 > 43 After Below 35</h3>
    <h4>Core Logic</h4>
    <p>Optix #5 is a "Momentum Recovery" signal. It doesn't just look for fear; it looks for the recovery from fear. It identifies stocks that were extremely oversold but have now begun to show a significant bounce in sentiment, confirming that the "bottom" is likely in.</p>

    <h4>Mathematical Definition</h4>
    <p><strong>A. Trend and Setup</strong></p>
    <p>Price must be above the SMA₂₀₀. The 5-day Optix Average (SMA₅) must have previously dipped below 35.</p>
    <pre>Phase₁: Optix_SMA₅ < 35</pre>

    <p><strong>B. The Trigger (The Bounce)</strong></p>
    <p>The signal triggers when the SMA₅ subsequently rises above 43.</p>
    <pre>Phase₂: Optix_SMA₅ > 43</pre>

    <h4>Trading Signal Criteria</h4>
    <p>A buy signal is triggered when:</p>
    <table>
        <thead>
            <tr>
                <th>Condition</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Trend</strong></td>
                <td>Close > SMA₂₀₀</td>
            </tr>
            <tr>
                <td><strong>Condition</strong></td>
                <td>The 5-day Optix average moves from below 35 to above 43</td>
            </tr>
        </tbody>
    </table>

    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Buy = (Cₜ > SMA₂₀₀,ₜ) ∧ (Optix_SMA₅ recovering from < 35 to > 43)</pre>

    <h4>Strategic Application</h4>
    <p>This is a "confirmation" strategy. It sacrifices the absolute bottom price in exchange for a higher probability of success, ensuring that the upward sentiment shift is underway before capital is committed.</p>

    <hr>

    <h3>1.6 Optix #6: Symbol Close > its' MA200 and Optix MA10 > 43 After Below 35</h3>
    <h4>Core Logic</h4>
    <p>Optix #6 is a variation of the recovery model using a longer lookback period (10 days). It identifies a more significant structural shift in sentiment. When the 10-day average recovers, it suggests that the "base" of the sentiment bottom is broader and potentially more stable than a 5-day bounce.</p>

    <h4>Mathematical Definition</h4>
    <p><strong>A. Setup Phase</strong></p>
    <p>The 10-day Optix Average (SMA₁₀) must have recorded a reading below 35.</p>
    <pre>Phase₁: Optix_SMA₁₀ < 35</pre>

    <p><strong>B. Trigger Phase</strong></p>
    <p>The signal triggers when the SMA₁₀ crosses back above 43.</p>
    <pre>Phase₂: Optix_SMA₁₀ > 43</pre>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Condition</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Trend</strong></td>
                <td>Close > SMA₂₀₀</td>
            </tr>
            <tr>
                <td><strong>Condition</strong></td>
                <td>The 10-day Optix average moves from below 35 to above 43</td>
            </tr>
        </tbody>
    </table>

    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Buy = (Cₜ > SMA₂₀₀,ₜ) ∧ (Optix_SMA₁₀ recovering from < 35 to > 43)</pre>

    <h4>Strategic Application</h4>
    <p>By using the SMA₁₀, this signal filters out "fake-out" bounces. It is a more conservative entry than #Optix5 and is best suited for catching the start of mid-term rallies.</p>

    <hr>

    <h3>1.7 Optix #7: Symbol Close > its' MA200 and Optix > 43 After Below 30</h3>
    <h4>Core Logic</h4>
    <p>Optix #7 combines a high-conviction "pessimism floor" (raw value < 30) with a momentum "thrust" (recovery above 43). This is a "V-shape" sentiment recovery model, looking for sharp reversals in stocks that are still fundamentally in a bull market.</p>

    <h4>Mathematical Definition</h4>
    <p><strong>A. The Floor</strong></p>
    <p>The raw Optix value (O) must have dropped below 30.</p>
    <pre>Phase₁: O < 30</pre>

    <p><strong>B. The Thrust</strong></p>
    <p>The raw Optix value must then recover to a level above 43.</p>
    <pre>Phase₂: O > 43</pre>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Condition</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Trend</strong></td>
                <td>Close > SMA₂₀₀</td>
            </tr>
            <tr>
                <td><strong>Condition</strong></td>
                <td>The daily Optix value was below 30 and has now risen above 43</td>
            </tr>
        </tbody>
    </table>

    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Buy = (Cₜ > SMA₂₀₀,ₜ) ∧ (O recovering from < 30 to > 43)</pre>

    <h4>Strategic Application</h4>
    <p>This signal identifies rapid shifts in psychology. The 13-point jump (from 30 to 43) represents a significant "short-covering" or "dip-buying" event. It is particularly effective for stocks experiencing temporary news-driven pullbacks within a primary uptrend.</p>

    <h1 id="3">II. Technical Indicator Strategies</h1>

    <h3>2.1 RSI - Relative Strength Index</h3>
    <h4>Core Logic</h4>
    <p>The RSI Recovery signal identifies a shift from bearish to bullish momentum. While RSI is traditionally used for overbought/oversold levels, this specific strategy looks for a "Golden Cross" above the 40 level. This suggests the asset is not just leaving an oversold state but is gaining enough velocity to challenge the midpoint (50), signaling a high-probability trend reversal.</p>

    <h4>Mathematical Definition</h4>
    <p>The RSI is calculated based on the ratio of average gains to average losses over 14 periods (n=14).</p>
    <pre>RS = Average Gain / Average Loss
RSI = 100 - (100 / (1 + RS))</pre>

    <h4>Trading Signal Criteria</h4>
    <p>A long signal is generated when:</p>
    <table>
        <thead>
            <tr>
                <th>Condition</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Crossover</strong></td>
                <td>The RSI value crosses above the 40 threshold (RSIₜ₋₁ ≤ 40 and RSIₜ > 40)</td>
            </tr>
            <tr>
                <td><strong>Trend Context</strong></td>
                <td>The signal is most effective when confirmed by an overall upward price trend</td>
            </tr>
        </tbody>
    </table>

    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Long = RSI CrossAbove 40</pre>

    <h4>Strategic Application</h4>
    <p>The 40-level cross acts as a "momentum filter." By waiting for 40 rather than 30, the trader avoids "bottom fishing" in assets that might continue to flatline in oversold territory, ensuring that upward momentum has actually commenced.</p>

    <hr>

    <h3>2.2 Price Breakout (21-Day)</h3>
    <h4>Core Logic</h4>
    <p>This strategy utilizes a Ranking Algorithm to identify price breakouts. When a stock's closing price ranks at the absolute top (index > 0) relative to its performance over the last 21 trading days (roughly one business month), it indicates a breakout from the recent consolidation range.</p>

    <h4>Mathematical Definition</h4>
    <p>We define the Price Rank (PR) over a lookback window of n=21 days.</p>
    <pre>PR = Rank(Cₜ, {Cₜ, Cₜ₋₁, ..., Cₜ₋ₙ})</pre>
    <p>A rank above 100 in this context signifies a new high for the period.</p>

    <h4>Trading Signal Criteria</h4>
    <p>A long signal is triggered when the closing price breaks out above the highest close of the past 21 days.</p>
    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Long = Cₜ > max(Cₜ₋₁, ..., Cₜ₋₂₁)</pre>

    <h4>Strategic Application</h4>
    <p>A 21-day breakout represents a "Monthly High." This is a significant psychological level for swing traders, as it suggests the stock has cleared all supply/resistance levels encountered over the past month.</p>

    <hr>

    <h3>2.3 High & Low Points (13-Day)</h3>
    <h4>Core Logic</h4>
    <p>The 13-Day Extremum strategy identifies short-term momentum shifts. It uses the highest and lowest price rankings over a 13-day window to generate trend-following signals.</p>

    <h4>Mathematical Definition</h4>
    <p>We rank the current High (Hₜ) or Low (Lₜ) against the price extremes of the previous 13 days.</p>
    <ul>
        <li><strong>High Rank</strong>: Hₜ vs {Hₜ₋₁, ..., Hₜ₋₁₃}</li>
        <li><strong>Low Rank</strong>: Lₜ vs {Lₜ₋₁, ..., Lₜ₋₁₃}</li>
    </ul>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Signal Type</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Long Signal (HighPoints)</strong></td>
                <td>Triggered when the current high ranks above 100 (reaches a 13-day new high)</td>
            </tr>
            <tr>
                <td><strong>Short Signal (LowPoints)</strong></td>
                <td>Triggered when the current low ranks below 0 (reaches a 13-day new low)</td>
            </tr>
        </tbody>
    </table>

    <p><strong>The Signal Logic:</strong></p>
    <pre>Signal_Long = Hₜ > max(Hₜ₋₁, ..., Hₜ₋₁₃)
Signal_Short = Lₜ < min(Lₜ₋₁, ..., Lₜ₋₁₃)</pre>

    <h4>Strategic Application</h4>
    <p>The 13-day window is a "fast" momentum indicator. It is highly effective for catching the early stages of a breakout.</p>

    <hr>

    <h3>2.4 Candlestick Patterns (Hammer & Shooting Star)</h3>
    <h4>Core Logic</h4>
    <p>These signals rely on Price Action Rejection. A "Hammer" shows that bears tried to push the price down but were met with overwhelming support (lower shadow). A "Shooting Star" shows that bulls pushed higher but were met with heavy resistance (upper shadow).</p>

    <h4>Mathematical Definition</h4>
    <ul>
        <li><strong>Hammer</strong>: Lower Shadow > 61.8%</li>
        <li><strong>Shooting Star</strong>: Upper Shadow > 61.8%</li>
    </ul>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Pattern</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Hammer + Raise</strong></td>
                <td>A Hammer occurs on Day t-1. A long signal triggers on Day t if the price rises above the previous day's high or a specific threshold</td>
            </tr>
            <tr>
                <td><strong>Shooting Star + Fall</strong></td>
                <td>A Shooting Star occurs on Day t-1. A short signal triggers on Day t if the price falls below a specific threshold</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>These are "Confirmation" patterns. The signal is not generated by the candle alone, but by the price action follow-through on the subsequent day, confirming that the support/resistance indicated by the shadow is holding.</p>

    <hr>

    <h3>2.5 Moving Average (MA) & MA Gap</h3>
    <h4>Core Logic</h4>
    <p>The Moving Average strategy smooths price data to identify the trend direction. The MA Gap focuses on the acceleration of the trend by comparing the MA value of the current day to the previous day.</p>

    <h4>Mathematical Definition</h4>
    <pre>MAₜ = (1/n) × Σᵢ₌₀ⁿ⁻¹ Cₜ₋ᵢ
Gap = MAₜ - MAₜ₋₁</pre>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Signal Type</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>MA Crossover</strong></td>
                <td>Long signal on "Golden Cross" (C crosses above MA); Short signal on "Death Cross" (C crosses below MA)</td>
            </tr>
            <tr>
                <td><strong>MA Gap</strong></td>
                <td>Long signal if MAₜ > MAₜ₋₁ (positive slope); Short signal if MAₜ < MAₜ₋₁ (negative slope)</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>While the MA tells you where the trend is, the MA Gap tells you if the trend is strengthening or weakening. A widening gap suggests increasing momentum.</p>

    <hr>

    <h3>2.6 MACD Histogram & HistGap</h3>
    <h4>Core Logic</h4>
    <p>The MACD Histogram measures the distance between the MACD line and the Signal line. The HistGap identifies the "Rate of Change" of that distance, often acting as a leading indicator for a trend crossover.</p>

    <h4>Mathematical Definition</h4>
    <pre>MACD_Hist = MACD_Line - Signal_Line
HistGap = MACD_Hist,ₜ - MACD_Hist,ₜ₋₁</pre>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Indicator</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>MACDHist</strong></td>
                <td>Long signal when the histogram crosses above 0; Short signal when it crosses below 0</td>
            </tr>
            <tr>
                <td><strong>MACDHistGap</strong></td>
                <td>Long signal when the current histogram is higher than the previous day's (even if still below 0), suggesting a bullish convergence</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>The HistGap is particularly powerful for identifying "Divergence." If price is falling but the HistGap is positive, it suggests the downward momentum is dying and a reversal is imminent.</p>

    <hr>

    <h3>2.7 X-Period Highs/Lows</h3>
    <h4>Core Logic</h4>
    <p>These signals track Historical Extremes (All-Time, 52-Week, 13-Week, 4-Week). Reaching these levels represents a significant shift in the asset's valuation regime and institutional participation.</p>

    <h4>Mathematical Definition</h4>
    <p>Let X be the number of periods (e.g., 252 days for 52-week).</p>
    <pre>High_X = max(Cₜ, ..., Cₜ₋_X)
Low_X = min(Cₜ, ..., Cₜ₋_X)</pre>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Signal Type</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>X-Period High</strong></td>
                <td>Triggered when the current close is the highest in X periods. Indicates an uptrend and gaining momentum</td>
            </tr>
            <tr>
                <td><strong>X-Period Low</strong></td>
                <td>Triggered when the current close is the lowest in X periods. Indicates deep trouble or significant loss of value</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <ul>
        <li><strong>All-Time High (ATH)</strong>: Assets in ATH have no overhead resistance (no "bag holders" waiting to sell at break-even), often leading to rapid price appreciation</li>
        <li><strong>52-Week High/Low</strong>: The most commonly watched metric by institutional investors to determine yearly trend bias</li>
    </ul>

    <h2 id="1-2">III. Trend and Chart Patterns</h2>

    <h3>3.1 Trendline Patterns (UpTrend & DownTrend)</h3>
    <h4>Core Logic</h4>
    <p>Trendline patterns identify the psychological boundaries of a market regime. An UpTrend Pattern suggests that buyers are becoming more aggressive, pushing the price above previous resistance peaks. A DownTrend Pattern suggests that support has evaporated at the troughs, confirming a shift to a bearish regime.</p>

    <h4>Mathematical Definition</h4>
    <p>A trendline is defined by a linear function y = mx + b connecting at least two major price points.</p>
    <ul>
        <li><strong>UpTrend Line</strong>: Connects consecutive lower peaks (H₁, H₂, ...)</li>
        <li><strong>DownTrend Line</strong>: Connects consecutive lower troughs (L₁, L₂, ...)</li>
    </ul>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Signal Type</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>UpTrend Long</strong></td>
                <td>Triggered when Cₜ > Trendline Valueₜ</td>
            </tr>
            <tr>
                <td><strong>DownTrend Short</strong></td>
                <td>Triggered when Cₜ < Trendline Valueₜ</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>Trendline breakouts are high-conviction signals because they represent a "break" in the established supply/demand equilibrium. They are most reliable when accompanied by an increase in trading volume.</p>

    <hr>

    <h3>3.2 Triple Tap & Rounding Bottom</h3>
    <h4>Core Logic</h4>
    <p>These patterns identify Structural Support. A Triple Tap proves that a specific price floor is being defended by heavy institutional buying. A Rounding Bottom (or "U" shape) indicates a slow, fundamental shift from distribution (selling) to accumulation (buying) at the end of a bear market.</p>

    <h4>Mathematical Definition</h4>
    <ul>
        <li><strong>Triple Tap</strong>: L₁ ≈ L₂ ≈ L₃ within a defined price variance (e.g., ±1%)</li>
        <li><strong>Rounding Bottom</strong>: A series of price closes where the rate of decline decelerates to zero and then accelerates upward, forming a parabolic curve</li>
    </ul>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Pattern</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Triple Tap</strong></td>
                <td>A long signal is generated upon the third successful bounce off the support line</td>
            </tr>
            <tr>
                <td><strong>Rounding Bottom</strong></td>
                <td>A long signal is generated when the price breaks above the "lip" or the start of the initial decline</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>The Rounding Bottom is a long-term reversal signal, while the Triple Tap is a tactical entry point. Both suggest that the "downward energy" has been fully absorbed by the market.</p>

    <hr>

    <h3>3.3 Price Channels (Ascending & Descending)</h3>
    <h4>Core Logic</h4>
    <p>Channels represent the "corridor" of price action. An Ascending Channel shows a healthy bull market with higher highs and higher lows. A Descending Channel shows a controlled bear market. Trading occurs at the boundaries of these parallel trendlines.</p>

    <h4>Mathematical Definition</h4>
    <p>A channel consists of two parallel lines:</p>
    <pre>Upper Line: y = mx + b_upper
Lower Line: y = mx + b_lower</pre>
    <p>The slope (m) remains constant for both.</p>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Channel Type</th>
                <th>Strategy</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Ascending Channel</strong></td>
                <td>Traders look for long positions at the lower line or breakouts above the upper line</td>
            </tr>
            <tr>
                <td><strong>Descending Channel</strong></td>
                <td>Traders look for short positions at the upper line or continuation signals as the price hits the lower line</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>Channels help traders distinguish between "normal" volatility within a trend and a "breakout" from the trend. A break outside the channel lines often leads to a rapid acceleration in the direction of the break.</p>

    <hr>

    <h3>3.4 Head and Shoulders (Top & Bottom)</h3>
    <h4>Core Logic</h4>
    <p>These are the most iconic Reversal Patterns. A Head and Shoulders Top indicates that the bulls have failed to sustain a new high (the right shoulder is lower than the head). A Bottom indicates that the bears have exhausted their power to push the price lower.</p>

    <h4>Mathematical Definition</h4>
    <p>The pattern is defined by three peaks (or valleys):</p>
    <ul>
        <li><strong>Left Shoulder</strong>: Initial peak/trough</li>
        <li><strong>Head</strong>: The highest peak (Top) or deepest valley (Bottom)</li>
        <li><strong>Right Shoulder</strong>: A secondary peak/trough that fails to exceed the Head</li>
        <li><strong>Neckline</strong>: The support/resistance line connecting the shoulders</li>
    </ul>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Pattern</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Top (Short)</strong></td>
                <td>Triggered when the price breaks below the Neckline after the Right Shoulder forms</td>
            </tr>
            <tr>
                <td><strong>Bottom (Long)</strong></td>
                <td>Triggered when the price breaks above the Neckline</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>The "symmetry" of the shoulders is a key indicator of the pattern's reliability. A breakout from a Head and Shoulders pattern often results in a price move equal to the distance between the Head and the Neckline.</p>

    <hr>

    <h3>3.5 Double Top & Double Bottom</h3>
    <h4>Core Logic</h4>
    <p>Commonly known as "M" and "W" patterns, these represent a failed attempt to break a major resistance or support level. They signal that the current trend has lost its momentum and a reversal is imminent.</p>

    <h4>Mathematical Definition</h4>
    <ul>
        <li><strong>Double Top (M)</strong>: Two consecutive peaks at roughly the same price level (H₁ ≈ H₂)</li>
        <li><strong>Double Bottom (W)</strong>: Two consecutive troughs at roughly the same price level (L₁ ≈ L₂)</li>
    </ul>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Pattern</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Double Top (Short)</strong></td>
                <td>Signal triggers when price falls below the "trigger line" (the valley between the two peaks)</td>
            </tr>
            <tr>
                <td><strong>Double Bottom (Long)</strong></td>
                <td>Signal triggers when price rises above the "trigger line" (the peak between the two troughs)</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>These patterns are highly effective on daily and weekly charts for identifying major market turns. They are often confirmed by a "divergence" in indicators like RSI or MACD.</p>

    <hr>

    <h3>3.6 Trend Score (Breakout & Breakdown)</h3>
    <h4>Core Logic</h4>
    <p>The Trend Score is a proprietary Composite Indicator. It aggregates ten different trend-following signals into a single score from 0 to 10. This provides a quantitative "confidence level" in the current market direction, reducing the noise of individual indicators.</p>

    <h4>Mathematical Definition</h4>
    <p>Let Iₙ be a binary trend indicator (1 for bullish, 0 for bearish).</p>
    <pre>Trend Score = Σₙ₌₁¹⁰ Iₙ</pre>

    <h4>Trading Signal Criteria</h4>
    <table>
        <thead>
            <tr>
                <th>Signal Type</th>
                <th>Condition</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Trend Score Breakout</strong></td>
                <td>Signal triggers when the Score rises above 7, indicating a high-conviction bullish trend</td>
            </tr>
            <tr>
                <td><strong>Trend Score Breakdown</strong></td>
                <td>Signal triggers when the Score falls below 3, indicating a high-conviction bearish trend</td>
            </tr>
        </tbody>
    </table>

    <h4>Strategic Application</h4>
    <p>The Trend Score is designed for systematic traders. Because it requires multiple indicators (7 out of 10) to align, it naturally filters out "whipsaws" and false breakouts that might plague a single-indicator system.</p>

    <hr>

    <h1 id="4">Appendix: Quick Reference</h1>

    <h3>Optix Signal Summary</h3>
    <table>
        <thead>
            <tr>
                <th>Signal</th>
                <th>Type</th>
                <th>Key Condition</th>
                <th>Best For</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Optix #1</td>
                <td>Mean Reversion</td>
                <td>SMA₅ < 35 + Price > SMA₂₀₀</td>
                <td>Standard dip-buying</td>
            </tr>
            <tr>
                <td>Optix #2</td>
                <td>High-Sensitivity</td>
                <td>Raw < 30 + Price > SMA₂₀₀</td>
                <td>Flash crashes</td>
            </tr>
            <tr>
                <td>Optix #3</td>
                <td>Deep Exhaustion</td>
                <td>SMA₁₀ < 30 + Raw < 20</td>
                <td>Capitulation bottoms</td>
            </tr>
            <tr>
                <td>Optix #4</td>
                <td>Neutrality Cross</td>
                <td>Cross below 0.5</td>
                <td>Regime change warning</td>
            </tr>
            <tr>
                <td>Optix #5</td>
                <td>Momentum Recovery</td>
                <td>Recovery from < 35 to > 43</td>
                <td>Confirmed bounces</td>
            </tr>
            <tr>
                <td>Optix #6</td>
                <td>Long Recovery</td>
                <td>SMA₁₀ recovery to > 43</td>
                <td>Mid-term rallies</td>
            </tr>
            <tr>
                <td>Optix #7</td>
                <td>V-Shape Recovery</td>
                <td>Raw < 30 → > 43</td>
                <td>Sharp reversals</td>
            </tr>
        </tbody>
    </table>

    <h3>Technical Indicator Summary</h3>
    <table>
        <thead>
            <tr>
                <th>Indicator</th>
                <th>Signal Trigger</th>
                <th>Timeframe</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>RSI</td>
                <td>Cross above 40</td>
                <td>Short-term</td>
            </tr>
            <tr>
                <td>Price Breakout</td>
                <td>New 21-day high</td>
                <td>Monthly</td>
            </tr>
            <tr>
                <td>High/Low Points</td>
                <td>New 13-day extreme</td>
                <td>Bi-weekly</td>
            </tr>
            <tr>
                <td>Candlestick</td>
                <td>Hammer/Star + confirmation</td>
                <td>Daily</td>
            </tr>
            <tr>
                <td>MA Cross</td>
                <td>Golden/Death Cross</td>
                <td>Medium-term</td>
            </tr>
            <tr>
                <td>MACD Hist</td>
                <td>Cross above/below 0</td>
                <td>Short-term</td>
            </tr>
            <tr>
                <td>X-Period High</td>
                <td>New X-period extreme</td>
                <td>Variable</td>
            </tr>
        </tbody>
    </table>

    <hr>
    <p><em>Document Version: 1.0</em><br>
    <em>Last Updated: March 2026</em></p>
	</div>
		<!-- <RightMenu
			:menuItems="menuItems"
			v-show="menuItems.length != 0"
		></RightMenu> -->
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
      chartPath: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/chart.jpeg',
      chartPreList: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/chart.jpeg'],
      path010: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.1.jpg',
      path010List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.1.jpg'],
      path011: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.2.jpg',
      path011List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.2.jpg'],
      path012: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.3.jpg',
      path012List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.3.jpg'],
      path013: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.4.jpg',
      path013List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.4.jpg'],
      path014: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.5.jpg',
      path014List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.5.jpg'],
      path015: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.6.jpg',
      path015List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.6.jpg'],
      path016: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.7.jpg',
      path016List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.7.jpg'],
      path017: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.8.jpg',
      path017List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.8.jpg'],
      path018: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.9.jpg',
      path018List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.9.jpg'],
      path019: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.10.jpg',
      path019List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.10.jpg'],
      path0110: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.11.jpg',
      path0110List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.11.jpg'],
      path0111: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.12.jpg',
      path0111List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.12.jpg'],
      path0112: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.13.jpg',
      path0112List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.13.jpg'],
      path0113: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.14.jpg',
      path0113List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.14.jpg'],
      path0114: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.15.jpg',
      path0114List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.15.jpg'],
      path0115: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.16.jpg',
      path0115List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.16.jpg'],
      path0116: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.17.jpg',
      path0116List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.17.jpg'],
      path0117: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.18.jpg',
      path0117List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.1.18.jpg'],
      path01: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.2.jpg',
      path01List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/1.2.jpg'],
      path100: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.1.1.jpg',
      path100List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.1.1.jpg'],
      path101: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.1.2.jpg',
      path101List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.1.2.jpg'],
      path102: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.1.3.jpg',
      path102List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.1.3.jpg'],
      path103: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.1.4.jpg',
      path103List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.1.4.jpg'],
      path110: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.2.1.jpg',
      path110List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.2.1.jpg'],
      path111: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.2.2.jpg',
      path111List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.2.2.jpg'],
      path112: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.2.3.jpg',
      path112List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.2.3.jpg'],
      path120: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.3.1.jpg',
      path120List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.3.1.jpg'],
      path121: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.3.2.jpg',
      path121List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.3.2.jpg'],
      path122: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.3.3.jpg',
      path122List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.3.3.jpg'],
      path130: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.4.1.jpg',
      path130List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.4.1.jpg'],
      path131: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.4.2.jpg',
      path131List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.4.2.jpg'],
      path132: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.4.3.jpg',
      path132List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.4.3.jpg'],
      path133: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.4.4.jpg',
      path133List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.4.4.jpg'],
      path140: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.1.jpg',
      path140List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.1.jpg'],
      path141: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.2.jpg',
      path141List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.2.jpg'],
      path142: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.3.jpg',
      path142List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.3.jpg'],
      path143: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.4.jpg',
      path143List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.4.jpg'],
      path144: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.5.jpg',
      path144List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.5.5.jpg'],
      path150: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.6.1.jpg',
      path150List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.6.1.jpg'],
      path151: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.6.2.jpg',
      path151List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.6.2.jpg'],
      path160: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.1.jpg',
      path160List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.1.jpg'],
      path161: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.2.jpg',
      path161List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.2.jpg'],
      path162: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.3.jpg',
      path162List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.3.jpg'],
      path163: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.4.jpg',
      path163List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.4.jpg'],
      path164: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.5.jpg',
      path164List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.5.jpg'],
      path165: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.6.jpg',
      path165List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.6.jpg'],
      path166: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.7.jpg',
      path166List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.7.jpg'],
      path167: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.8.jpg',
      path167List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.8.jpg'],
      path168: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.9.jpg',
      path168List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.9.jpg'],
      path169: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.10.jpg',
      path1610: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.11.jpg',
      path1610List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.10.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.7.11.jpg'],
      path171: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.8.1.jpg',
      path171List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.8.1.jpg'],
      path181: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.9.1.jpg',
      path181List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/2.9.1.jpg'],
      path20: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/3.1.jpg',
      path20List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/3.1.jpg'],
      path21: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/3.2.jpg',
      path21List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/3.2.jpg'],
      path30: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/4.1.jpg',
      path30List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/4.1.jpg'],
      path31: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/4.2.jpg',
      path31List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/4.2.jpg'],
      path40: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/5.1.jpg',
      path40List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/5.1.jpg'],
      path50: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/6.1.jpg',
      path50List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/6.1.jpg'],
      path51: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/6.2.jpg',
      path51List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/6.2.jpg'],
      path60: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/7.1.jpg',
      path60List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/7.1.jpg'],
      path61: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/7.2.jpg',
      path61List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/7.2.jpg'],
      path71: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/8.1.jpg',
      path71List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/8.1.jpg'],
      path72: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/8.2.jpg',
      path73: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/8.3.jpg',
      path74: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/8.4.jpg',
      path72List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/8.2.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/8.3.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/8.4.jpg'],
      path811: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.1.1.jpg',
      path181List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.1.1.jpg'],
      path812: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.1.2.jpg',
      path812List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.1.2.jpg'],
      path82: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.2.jpg',
      path82List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.2.jpg'],
      path831: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.3.1.jpg',
      path832: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.3.2.jpg',
      path833: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.3.3.jpg',
      path83List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.3.1.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.3.2.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/9.3.3.jpg'],
      pathai1: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai1.jpg',
      pathai1List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai1.jpg'],
      pathai2: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai2.jpg',
      pathai2List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai2.jpg'],
      // pathai3: pathai3,
      // pathai3List: [pathai3],
      pathai311: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.1.1.jpg',
      pathai311List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.1.1.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.1.2.jpg'],
      pathai312: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.1.2.jpg',
      pathai32: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.2.jpg',
      pathai32List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.2.jpg'],
      pathai33: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.3.jpg',
      pathai33List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.3.jpg'],
      pathai34: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.4.jpg',
      pathai35: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.5.jpg',
      pathai35List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.4.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai3.5.jpg'],
      pathai41: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai4.1.jpg',
      pathai41List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai4.1.jpg'],
      pathai42: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai4.2.jpg',
      pathai42List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai4.2.jpg'],
      pathai43: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai4.3.jpg',
      pathai43List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai4.3.jpg'],
      pathai44: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai4.4.jpg',
      pathai44List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai4.4.jpg'],
      pathai510: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai5.1.jpg',
      pathai510List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai5.1.jpg'],
      pathai511: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai5.2.jpg',
      pathai511List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai5.2.jpg'],
      pathai512: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai5.3.jpg',
      pathai512List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/ai5.3.jpg'],
      pathfls11: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/fls1.1.jpg',
      pathfls12: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/fls1.2.jpg',
      pathfls21: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/fls2.1.jpg',
      pathfls22: 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/fls2.2.jpg',
      pathfls22List: ['https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/fls1.1.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/fls1.2.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/fls2.1.jpg', 'https://sentimentrader-backtest.s3.amazonaws.com/Tutorial/img/fls2.2.jpg'],
	  videoUrl: 'https://www.youtube.com/embed/GR9VbSXxouM'
    }
  },
  components: {
    RightMenu,
    Tabs
  },
  mounted() {
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
        let title = document.querySelectorAll('h1,h2,h3')
        this.navList = Array.from(title)
        this.navList.forEach((item) => {
          item.style.color = 'rgb(0, 50, 60)'
        })
        jump.style.color = '#5b9bd1'
        let total = jump.offsetTop - 80;
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
        let title = document.querySelectorAll('h2,h3')
        const navList = Array.from(title)
        this.menuItems = navList.map((item, index) => {
          const menuItem = {}
          menuItem['title'] = item.innerHTML
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
	margin-right: 220px;
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
</style>