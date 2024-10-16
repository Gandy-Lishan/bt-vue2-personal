<template>
	<div>
		<!-- 头部标签 -->
		<div class="tabs">
			<div
				v-for="(tab, index) in tabs"
				:key="index"
				class="tab"
				:class="{ active: activeTab === index }"
				@click="changeTab(index)"
			>
				<el-tag
					:type="tab.type"
					effect="dark"
					:class="{ 'active-tag': activeTab == tab.index }"
					>{{ tab.title }}</el-tag
				>
			</div>
		</div>

		<!-- 内容展示区域 -->
		<div class="content">
			<div
				v-for="(tab, index) in tabs"
				:key="index"
				v-show="activeTab === index"
			>
				<div v-for="(item, index) in tab.content" :key="index">
					<p>{{ item }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0, // 当前激活的标签索引
      tabs: [
        {
          title: 'Sentiment Indicator', content: [
            'In stock backtesting, a Sentiment Indicator refers to an indicator used to measure the sentiment of market participants or market sentiment. It is determined by analyzing the comments, behavior, or other indicators of market participants.',
            'Stock backtesting is a strategic analysis method that evaluates the performance of a specific investment strategy or trading system on historical data by reviewing past market data and indicators. Sentiment indicators are used in stock backtesting to examine the sentiment of market participants and attempt to correlate the sentiment indicator with stock prices or market trends.',
            'Common sentiment indicators include Smart Money Confidence, Dumb Money Confidence, and others. Sentiment indicators can be used as part of an investment strategy to make buy or sell decisions. For example, when a sentiment indicator shows that market sentiment has reached extreme levels, investors may consider adopting a contrarian trading strategy, reducing positions when market sentiment is excessively optimistic or increasing positions when market sentiment is excessively pessimistic.',
            'However, it is important to note that sentiment indicators are not standalone predictors of market trends but rather auxiliary tools. The stock market is influenced by multiple factors, and sentiment is just one of them. Therefore, when using sentiment indicators, it is necessary to combine them with other technical indicators and fundamental analysis to make more accurate decisions. Additionally, the calculation and interpretation of sentiment indicators should be approached with caution, avoiding excessive reliance on a single indicator to judge the market.'
          ], type: 'info'
        },
        {
          title: 'Technical Indicator', content: [
            'A Technical Indicator is a tool used to analyze financial markets. It is based on historical price and volume data and generates visual indicators or signals through mathematical calculations or statistical models. Technical indicators aim to reveal market trends, price dynamics, and trading opportunities to assist investors in making decisions.',
            'The calculation of technical indicators is typically based on historical price and volume data, including opening price, closing price, high price, low price, and volume. These indicators can be used to identify market trends, cyclical fluctuations, and price support and resistance levels.',
            'Some common technical indicators include:',
            '1. Moving Average: Smooths price data by calculating the average price over a specified period and displays the price trend. Common types of moving averages include Simple Moving Average (SMA) and Exponential Moving Average (EMA).',
            '2. Relative Strength Index (RSI): Measures the overbought and oversold conditions of the market by evaluating the magnitude of price gains and losses.',
            '3. Moving Average Convergence Divergence (MACD): Combines short-term and long-term moving averages to display price trend conditions and generate buy and sell signals.',
            'These are just a few examples of common technical indicators. Each indicator has its specific calculation method and interpretation. Investors typically use multiple technical indicators to analyze the market comprehensively and combine them with other analysis methods to develop investment strategies and make trading decisions.'
          ], type: 'info'
        },
        {
          title: 'Symbol OHLCV', content: [
            'In the financial field, Symbol OHLCV refers to a common format for representing historical data of financial asset prices and trading volumes. It represents the Open, High, Low, Close, and Volume of a financial asset.',
            'Each trading period (e.g., days, weeks, months) generates a Symbol OHLCV data point. Here is an explanation of each data field:',
            'Open: The starting price of a particular trading period, representing the price of the asset at the beginning of that period.',
            'High: The highest point reached by the asset price within that trading period.',
            'Low: The lowest point reached by the asset price within that trading period.',
            'Close: The closing price of a particular trading period, representing the price of the asset at the end of that period.',
            'Volume: The number of asset trades that occurred within that trading period.',
            "Symbol OHLCV data is commonly used in fields such as chart analysis, technical analysis, and algorithmic trading. By analyzing this data, trends in asset prices, support and resistance levels, and market participants' trading activity can be revealed.",
            "Common financial market data sources and trading platforms provide functionality to store and transmit data in Symbol OHLCV format. Analysts and traders can use this data to construct charts, apply technical indicators, and backtest and optimize models and strategies based on historical prices and volumes.",
            "It is important to note that the frequency and time periods of Symbol OHLCV data can be set according to specific needs, such as daily data, weekly data, or monthly data, among others. Additionally, Symbol OHLCV data only provides information about prices and trading volumes, and other financial indicators and fundamental data may need to be used in conjunction with it for a more comprehensive analysis and decision-making."
          ], type: 'info'
        },
        {
          title: 'Extreme Optimism', content: [
            'In sentiment indicators, "Extreme Optimism" refers to a state where market participants exhibit a highly positive and optimistic outlook. When the market sentiment reaches extreme optimism, investors generally hold high expectations for the market and tend to buy stocks or other assets.',
            "Extreme optimism in sentiment indicators can be determined based on different sentiment indicators or market participants' behavior. Here are some examples of sentiment indicators that may indicate extreme optimism:",
            "1. Investor Surveys: For instance, surveys targeting investors may show that a majority of investors have a highly positive and optimistic view of the market. This could indicate that market participants hold high expectations for future economic prospects and stock market performance.",
            "2. Sentiment Analysis: By conducting sentiment analysis on textual data such as news reports, social media posts, or online forums, the inclination of market participants' sentiment can be evaluated. When sentiment analysis reveals a significant amount of positive sentiment in the text, it may reflect extreme optimism in the market sentiment.",
            "3. Technical Indicators: Certain technical indicators may indicate an overbought condition in the market, suggesting a bias towards optimistic sentiment among investors. For example, overbought indicators like RSI show that a stock or index has exceeded the range of buying levels, which may imply that market sentiment is in a state of extreme optimism.",
            'In BacktestEdge, select the "Sentiment Indicator" radio button and enter the sentiment indicator you want to search for in the search box, such as "Smart Money Confidence." Below Smart Money Confidence, the corresponding value of "Extreme Optimism" will be displayed.',
            'Extreme optimism in sentiment indicators can influence market behavior and price trends. Investors commonly believe that the market will continue to rise, which can lead to overbuying and overvaluation. However, it is important to note that extreme optimism in sentiment does not always mean that the market will immediately reverse or decline. Market sentiment is a dynamic factor that needs to be combined with other analytical tools and indicators to make more accurate judgments and decisions.'
          ], type: 'info'
        },
        {
          title: 'Extreme Pessimism', content: [
            'In sentiment indicators, "Extreme Pessimism" refers to a state where market participants exhibit a highly negative and pessimistic outlook. When the market sentiment reaches extreme pessimism, investors generally hold very low expectations for the market and tend to sell stocks or other assets.',
            "Extreme pessimism in sentiment indicators can be determined based on different sentiment indicators or market participants' behavior. Here are some examples of sentiment indicators that may indicate extreme pessimism:",
            '1. Investor Surveys: For instance, surveys targeting investors may show that a majority of investors have a highly negative and pessimistic view of the market. This could indicate that market participants hold very low expectations for future economic prospects and stock market performance.',
            "2. Sentiment Analysis: By conducting sentiment analysis on textual data such as news reports, social media posts, or online forums, the inclination of market participants' sentiment can be evaluated. When sentiment analysis reveals a significant amount of negative sentiment in the text, it may reflect extreme pessimism in market sentiment.",
            "3. Technical Indicators: Certain technical indicators may indicate an oversold condition in the market, suggesting a bias towards pessimistic sentiment among investors. For example, oversold indicators like RSI show that a stock or index has fallen below the range of selling levels, which may imply that market sentiment is in a state of extreme pessimism.",
            'Extreme pessimism in sentiment indicators can influence market behavior and price trends. Investors commonly believe that the market will continue to decline, which can lead to overselling and the market being undervalued. However, it is important to note that extreme pessimism in sentiment does not always mean that the market will immediately reverse or rise. Market sentiment is a dynamic factor that needs to be combined with other analytical tools and indicators to make more accurate judgments and decisions.'
          ], type: 'info'
        },
        {
          title: 'CrossAbove', content: [
            'In backtesting trading systems, "CrossAbove" is a technical indicator signal used to indicate when one indicator or price line crosses above another indicator or price line.',
            'Specifically, "CrossAbove" typically refers to a situation where an indicator or price line crosses from below to above another indicator or price line. This crossover is often seen as a potential buying signal, implying a change in price trend.',
            "For example, let's assume we have two indicators, A and B, and we observe their crossover. When A crosses above B, it means that A was below B before a certain point in time and then crosses over to be above B at that point. This situation is often interpreted as a potential buying signal, suggesting the formation of an upward price trend.",
            '"CrossAbove" can be applied to various combinations of indicators and price lines. Common examples include crossovers between moving average lines, such as the short-term moving average crossing above the long-term moving average, or when the price line crosses an important horizontal level.',
            'The "CrossAbove" signal in backtesting trading systems is often used as one of the buying conditions for technical indicators. By backtesting historical data, the effectiveness and profitability of this signal can be evaluated. However, it is important to note that a single signal does not guarantee accurate predictions of market behavior. Therefore, when formulating trading strategies, it is advisable to combine other technical indicators and risk management principles.'
          ], type: 'info'
        },
        {
          title: 'CrossBelow', content: [
            'In backtesting trading systems, "CrossBelow" is a technical indicator signal used to indicate when one indicator or price line crosses below another indicator or price line.',
            'Specifically, "CrossBelow" typically refers to a situation where an indicator or price line crosses from above to below another indicator or price line. This crossover is often seen as a potential selling signal, implying a change in price trend.',
            "For example, let's assume we have two indicators, A and B, and we observe their crossover. When A crosses below B, it means that A was above B before a certain point in time and then crosses under B at that point. This situation is often interpreted as a potential selling signal, suggesting the formation of a downward price trend.",
            '"CrossBelow" can be applied to various combinations of indicators and price lines. Common examples include crossovers between moving average lines, such as the short-term moving average crossing below the long-term moving average, or when the price line crosses an important support level.',
            'The "CrossBelow" signal in backtesting trading systems is often used as one of the selling conditions for technical indicators. By backtesting historical data, the effectiveness and profitability of this signal can be evaluated. However, it is important to note that a single signal does not guarantee accurate predictions of market behavior. Therefore, when formulating trading strategies, it is advisable to combine other technical indicators and risk management principles.'
          ], type: 'info'
        },
        {
          title: 'Rate Of Change', content: [
            'In backtesting trading, "Rate of Change" (ROC) is a technical indicator used to measure the speed of price or indicator changes over a given time period.',
            'ROC represents the rate of change by calculating the percentage change between the current price or indicator value and a previous price or indicator value. It helps traders and analysts assess the short-term momentum and trend of prices or indicators.',
            'The steps to calculate ROC are as follows:',
            '1. Choose a time period (e.g., 20 trading days).',
            '2. Obtain the current price or indicator value at the current time point.',
            '3. Retrieve the price or indicator value from the specified time period ago (referred to as the past value).',
            '4. Calculate the percentage rate of change: ROC = ((current value - past value) / past value) * 100.',
            'For example, suppose a stock has a current price of $50 and a price from 20 trading days ago of $40. The ROC would be ((50 - 40) / 40) * 100 = 25%. This means that the price of the stock has increased by 25% over the past 20 trading days.',
            'ROC can be used to assess the speed of price or indicator changes. If the ROC value is positive, it indicates a relatively fast upward movement in prices or indicators. If the ROC value is negative, it suggests a relatively fast downward movement. Traders can combine ROC with other technical indicators or price patterns to confirm market trends, identify overbought or oversold conditions, and develop buy or sell strategies.',
            'It is important to note that ROC is a short-term indicator and sensitive to market noise. Therefore, it should be used in conjunction with other indicators and analysis tools to obtain more accurate trading signals and decisions.'
          ], type: 'info'
        },
        {
          title: '% of Previous Range', content: [
            "% of Previous Range stands for Rate of Return, which represents the percentage change in price or indicator. It calculates the rate of change by comparing the current price or indicator value to the previous value. % of Previous Range helps traders and analysts assess the momentum and trend of short-term prices or indicators.",
            "The steps to calculate % of Previous Range are as follows:",
            "1. Select a time period (e.g., 20 trading days).",
            "2. Obtain the current price or indicator value at the current point in time.",
            "3. Retrieve the price or indicator values within the specified time period (referred to as historical values).",
            "4. Calculate the percentage change: % of Previous Range = ((Current Value - Lowest Historical Value) / (Highest Historical Value - Lowest Historical Value)) * 100.",
            "For example, suppose a stock's current closing price is $50, the highest price 20 trading days ago was $60, and the lowest price was $40. The % of Previous Range would be (50 - 40) / (60 - 40) * 100 = 50. This means that the stock's price ranks in the top 50% over the past 20 trading days.",
            "% of Previous Range can be used to assess the relative ranking of prices or indicators compared to previous periods. A positive % of Previous Range value indicates a relatively higher ranking within that period, with a larger value indicating a higher ranking. If it exceeds 100, it indicates a breakout above the previous high. Similarly, a negative % of Previous Range indicates a relatively lower ranking, possibly reaching a previous low point in the chart.",
            "Traders can combine % of Previous Range with other technical indicators or price patterns to confirm market trends, identify overbought or oversold conditions, and formulate buying or selling strategies. It is important to note that % of Previous Range is a short-term indicator and sensitive to market noise. Therefore, it should be used in conjunction with other indicators and analysis tools to obtain more accurate trading signals and decisions.",
            "Although % of Previous Range and ROC (Rate of Change) have slightly different calculation methods, % of Previous Range considers the highest and lowest prices within a specific time period to provide a more comprehensive reflection of price changes, while ROC only considers the starting and ending prices. However, both serve the same purpose of measuring the speed of price or indicator changes in the short term and assisting in the formulation of trading strategies."
          ], type: 'info'
        },
        {
          title: 'MA Ratio', content: [
            "MAR is a technical indicator used to measure the speed of price change relative to its moving average line.",
            "MAR stands for Moving Average Ratio, which represents the percentage change in price by calculating the percentage difference between the current price and the 20-day moving average. It helps traders and analysts assess short-term price momentum and trend.",
            "The steps to calculate MAR are as follows:",
            "1. Select a time period (e.g., 20 trading days).",
            "2. Obtain the current price at the current point in time.",
            "3. Retrieve the 20-day moving average price within the specified time period.",
            "4. Calculate the percentage change: MAR = (Current Price / 20-day Moving Average Price) * 100.",
            "For example, suppose the current price of a stock is $50, and the 20-day moving average price is $40. The MAR would be (50 / 40) * 100 = 125%. This means that the stock's price is currently 25% above its 20-day moving average. MAR can be used to evaluate the speed of current price change relative to its moving average line. If MAR is greater than 100%, it indicates that the current price is above its moving average, showing a faster upward momentum. If MAR is less than 100%, it indicates that the current price is below its moving average, showing a faster downward momentum.",
            "Traders can combine MAR with price patterns to confirm market trends and develop buying or selling strategies. It is important to note that MAR is a short-term indicator and sensitive to market noise. Therefore, it should be used in conjunction with other indicators and analysis tools to obtain more accurate trading signals and decisions. MAR differs from ROC (Rate of Change) in calculation method, as MAR considers the relationship between the current price and the moving average over a period of time to evaluate the speed of current price change from a trend and momentum perspective, while ROC only considers price changes between two discrete points. However, both serve the same purpose of measuring the speed of short-term price changes and assisting in the formulation of trading strategies."
          ], type: 'info'
        },
        {
          title: 'Net Change', content: [
            'In backtesting trading, "Net Change" (NC) is a technical indicator used to measure the change of price or indicator.',
            'NC represents the net change by calculating the difference between the current price or indicator value and a previous price or indicator value. It helps traders and analysts assess the short-term momentum and trend of prices or indicators.',
            'The steps to calculate NC are as follows:',
            '1. Obtain the current price or indicator value at the current bar.',
            '2. Retrieve the price or indicator value from the previous bar.',
            '3. Calculate the difference: NC = current value - past value.',
          ], type: 'info'
        },
        {
          title: 'SameBar', content: [
            'SameBar (Same Candlestick): In backtesting trading, when multiple signals simultaneously satisfy certain conditions within the same time period (typically referring to the price range represented by a candlestick or bar chart), "SameBar" is used to indicate this situation. This condition is defined by a positive integer value called "score."',
            '1. Multiple signals within the same candlestick: Refers to the possibility of having multiple different trading signals or conditions within a specific time period. These signals may be based on different technical indicators, price dynamics, or other trading strategies.',
            '2. Score: It is a positive integer value that represents the cumulative score or weight of signals within the same candlestick. The score may be determined based on the reliability, importance, or other relevant factors of the signals.',
            '3. Simultaneously satisfying "score" number of signals: When the number of signals within the same candlestick reaches or exceeds the predetermined score value, it indicates that multiple signals simultaneously satisfy the conditions on that candlestick.',
            'The main purpose of "SameBar" is to assist analysts and traders in identifying and utilizing the interaction effects of multiple signals within the same candlestick during the backtesting process. This analysis helps in decision-making, validating the effectiveness of trading strategies.'
          ], type: 'info'
        },
        {
          title: 'TimeOrder',
          content: [
            'TimeOrder: In backtesting trading, when multiple signals occur in a given time period according to a predefined sequence, "TimeOrder" is used to indicate this situation. The sequence is defined by a positive integer value called "period."',
            '1. Multiple signals: During the backtesting process, there may be multiple different trading signals or conditions that are formed based on various technical indicators, price dynamics, or other trading strategies.',
            '2. Period: It is a positive integer value that represents the number of periods considered within a specific time duration. Each period can be a fixed time interval, such as daily, weekly, or monthly price data.',
            '3. Complete fulfillment of all signals in the set order within the specified period: In the given time period, when multiple signals occur sequentially according to a predefined order (e.g., signal A appears first, followed by signal B, and finally signal C), and all signals are triggered within the specified number of periods, it indicates that the time order requirement is fulfilled.',
            'The main purpose of "TimeOrder" is to assist analysts, traders, or algorithmic systems in checking and validating the time sequence of signals during the backtesting process. Through this analysis, the ability to manage time in trading strategies can be evaluated and improved, ensuring that signal triggering follows the expected order and accurately executes the trading strategy within the designated time period.'
          ],
          type: 'info'
        }
      ],
    };
  },
  methods: {
    changeTab(index) {
      this.activeTab = index; // 切换激活的标签
    },
  },
};
</script>

<style>
.tabs {
	display: flex;
	justify-content: flex-start;
	margin: 0 auto;
	flex-wrap: wrap;
}

.tab {
	cursor: pointer;
	padding: 10px;
	margin-right: 10px;
}
.tab.active .el-tag {
	background: #5b9bd1;
	border: 1px solid #5b9bd1;
	box-shadow: 0px 0px 5px 5px #cee4f7;
}
.el-tag {
	width: 125px;
}
.el-tag--dark.el-tag--info {
	text-align: center;
	background-color: #b2b6bf;
	border-color: #b2b6bf;
}
.content p {
	line-height: 1.7;
	word-wrap: break-word;
	font-weight: 400;
	color: #00323c;
	font-size: 1rem;
}
</style>
