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
				<hr />
				<ul>
						<li><strong>I. Optix Sentiment Indicator Strategies</strong>
										<ul>
														<li>Optix #1: Symbol Close &gt; MA200 and Optix MA5 &lt; 35</li>
														<li>Optix #2: Symbol Close &gt; MA200 and Optix &lt; 30</li>
														<li>Optix #3: Optix MA10 &lt; 30 and Optix &lt; 20</li>
														<li>Optix #4: Optix CrossBelow 0.5</li>
														<li>Optix #5: Recovery from &lt; 35 to &gt; 43 (MA5)</li>
										</ul>
						</li>
						<li><strong>II. Technical Indicator Strategies</strong>
										<ul>
														<li>RSI - Relative Strength Index</li>
														<li>Price Breakout (21-Day)</li>
														<li>Candlestick Patterns</li>
										</ul>
						</li>
						<li><strong>III. Trend Patterns</strong>
										<ul>
														<li>Head and Shoulders</li>
														<li>Trend Score (Breakout/Breakdown)</li>
										</ul>
						</li>
					</ul>
				<h1 id="2">I. Optix Sentiment Indicator Strategies</h1>
				<hr />
				<h3 id="optix1">1.1 Optix #1: Symbol Close &gt; its&apos; MA200 and Optix MA5 &lt; 35</h3>
    <h4>Core Logic</h4>
    <p>The Optix #1 signal is a <strong>mean-reversion strategy</strong> designed to identify high-probability entry points within a long-term bullish trend. It filters for stocks that remain structurally strong (above their MA200) but are experiencing a temporary, extreme bout of short-term pessimism.</p>

    <h4>Mathematical Definition</h4>
    <pre>
						Cₜ > SMA(C, 200)ₜ
						Optix_SMA5ₜ = (1/5) × Σᵢ₌₀⁴ Optixₜ₋ᵢ
    </pre>

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
                <td><strong>Trend Requirement</strong></td>
                <td>Closing Price &gt; 200-day Moving Average</td>
            </tr>
            <tr>
                <td><strong>Sentiment Requirement</strong></td>
                <td>5-day Moving Average of Optix &lt; 35 (extreme oversold)</td>
            </tr>
        </tbody>
    </table>
    <hr>
				<h3 id="optix2">1.2 Optix #2: Symbol Close &gt; its&apos; MA200 and Optix &lt; 30</h3>
    <h4>Core Logic</h4>
    <p>A "high-sensitivity" mean-reversion signal using raw daily Optix values. Targets tactical entry points before the market "averages out" the fear.</p>
    <pre>Signal_Buy = (Cₜ &gt; SMA₂₀₀,ₜ) ∧ (Oₜ &lt; 30)</pre>

    <hr>

    <h3 id="optix3">1.3 Optix #3: Optix MA10 &lt; 30 and Optix &lt; 20</h3>
    <h4>Core Logic</h4>
    <p>Focuses on "Deep Sentiment Exhaustion." Requires sustained bearishness (MA10) and a final capitulation spike (raw &lt; 20).</p>

    <hr>

    <h2 id="3">II. Technical Indicator Strategies</h2>

    <h3 id="rsi">2.1 RSI - Relative Strength Index</h3>
    <h4>Core Logic</h4>
    <p>The RSI Recovery signal identifies a shift from bearish to bullish momentum by looking for a "Golden Cross" above the 40 level.</p>
    <pre>
RS = Average Gain / Average Loss
RSI = 100 - (100 / (1 + RS))
Signal_Long = RSI CrossAbove &gt; 40
    </pre>

    <h3 id="breakout">2.2 Price Breakout (21-Day)</h3>
    <h4>Core Logic</h4>
    <p>Identifies a "Monthly High." When a stock's closing price ranks at the absolute top relative to the last 21 trading days.</p>
    <blockquote>A 21-day breakout signifies that the stock has cleared all supply/resistance levels encountered over the past month.</blockquote>

    <hr>

    <h2 id="4">III. Trend and Chart Patterns</h2>

    <h3 id="head-shoulders">3.4 Head and Shoulders (Top & Bottom)</h3>
    <h4>Core Logic</h4>
    <p>Iconic reversal patterns. A <strong>Top</strong> indicates bulls failed to sustain new highs; a <strong>Bottom</strong> indicates bear exhaustion.</p>
    <ul>
        <li><strong>Left Shoulder:</strong> Initial peak/trough</li>
        <li><strong>Head:</strong> The extreme point (highest/lowest)</li>
        <li><strong>Neckline:</strong> Support/resistance line connecting shoulders</li>
    </ul>

    <h3 id="trend-score">3.6 Trend Score (Breakout & Breakdown)</h3>
    <h4>Core Logic</h4>
    <p>A proprietary Composite Indicator aggregating ten different trend-following signals (Score 0-10).</p>
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
                <td>Score &gt; 7 (High-conviction bullish)</td>
            </tr>
            <tr>
                <td><strong>Trend Score Breakdown</strong></td>
                <td>Score &lt; 3 (High-conviction bearish)</td>
            </tr>
        </tbody>
    </table>

    <hr>

    <h2 id="5">Appendix: Quick Reference</h2>
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
                <td>SMA₅ &lt; 35 + Price &gt; SMA₂₀₀</td>
                <td>Standard dip-buying</td>
            </tr>
            <tr>
                <td>Optix #3</td>
                <td>Deep Exhaustion</td>
                <td>SMA₁₀ &lt; 30 + Raw &lt; 20</td>
                <td>Capitulation bottoms</td>
            </tr>
            <tr>
                <td>Optix #5</td>
                <td>Momentum Recovery</td>
                <td>Recovery from &lt; 35 to &gt; 43 (MA5)</td>
                <td>Confirmed bounces</td>
            </tr>
        </tbody>
    </table>

    <footer style="margin-top: 50px; font-size: 0.8em; color: #7f8c8d; text-align: center;">
        <p>Document Version: 1.0 | Last Updated: March 2026</p>
    </footer>
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