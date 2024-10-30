<template>
    <div style="width: 100%;">
        <!-- 添加下拉框 -->
        <div class="strategy-dropdown">
        <label for="strategy-select">Select Strategy:</label>
        <select v-model="selectedStrategyIndex" @change="loadTable">
            <option v-for="(strategy, index) in strategies" :key="index" :value="index">
            Strategy {{ index + 1 }}
            </option>
        </select>
        </div>
        <div class="description-container">
            <h3>{{descItem.Strategy_name}}</h3>
            <div v-html="descItem.Description"></div>
            <h3>Model's rules</h3>
            <div class="description-container--rules" v-html="descItem.Rules"></div>
        </div>
    </div>
</template>

<script>
import { CIQ } from '@/components/common/chart/st-development/js/components'
import {
  getSymbolStrategySigal
} from '@/service/service'

export default {
	name: 'Summary',
	data() {
		return {
            loading: true,
            symbol: CIQ.stxx.chart.symbol,
            strategies: [],
            selectedStrategyIndex: 0, // 保存选中的策略索引
            descMap: [
    {
      "Strategy_name": "MA",
      "Description": "This strategy utilizes the crossover of closing prices and moving averages as trading signals.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross.",
      "Rules": "1. If the symbol's close cross above its 20-day moving average (MA20), then BUY.<br/>2. If the symbol's close cross below its 20-day moving average (MA20), then SELL."
    },
    {
      "Strategy_name": "MAGap",
      "Description": "This strategy determines trading signals by comparing the difference between the moving average of the current day and the previous day.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross.",
      "Rules": "1. If the 20-day moving average (MA20) cross above the previous day's MA20, then BUY.<br/>2. If the 20-day moving average (MA20) cross below the previous day's MA20, then SELL."
    },
    {
      "Strategy_name": "MACDHist",
      "Description": "This strategy uses the crossover signals of the MACD histogram as trading signals.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross.",
      "Rules": "1. If the MACD hist cross above 0, then BUY.<br/>2. If the MACD hist cross below 0, then SELL."
    },
    {
      "Strategy_name": "MACDHistGap",
      "Description": "This strategy determines trading signals by comparing the difference between the MACDHist and the previous day's value.<br/>It can further specify the direction of trades and operating rules,<br/>such as determining long signals after a golden cross and short signals after a death cross.",
      "Rules": "1. If the MACD hist cross above the previous day's MACD, then BUY.<br/>2. If the MACD hist cross below the previous day's MACD, then SELL."
    },
    {
      "Strategy_name": "Hammer followed by a rise",
      "Description": "If the previous day's candlestick shows a long lower shadow,<br/>indicating support at the bottom,<br/>a long signal is generated when the price rises above a certain threshold after the opening.",
      "Rules": "1. If the corresponding conditions are met, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Shooting Star followed by a fall",
      "Description": "If the previous day's candlestick shows a long upper shadow,<br/>indicating resistance at the top,<br/>a short signal is generated when the price falls below a certain threshold after the opening.",
      "Rules": "1. If the corresponding conditions are met, then SELL.<br/>2. BUY after 21 trading days"
    },
    {
      "Strategy_name": "PriceBreakout",
      "Description": "When the closing price of a stock ranks above 0 in relation to the closing prices of the past 21 trading days, <br/>a golden cross occurs, indicating an upward breakout and generating a long signal. <br/>This suggests that the stock's price has entered a breakout phase and is likely to continue rising.",
      "Rules": "1. If the indicator's value cross above 0, then BUY.<br/>2. If the indicator's value cross below 0, then SELL."
    },
    {
      "Strategy_name": "RSI",
      "Description": "When the RSI indicator forms a golden cross above 35, it suggests that the indicator is about to<br/>recover from an oversold state to the midpoint, indicating a potential long signal. <br/>RSI can reflect whether a stock is in an overbought or oversold condition <br />but should be used in conjunction with the trend analysis.",
      "Rules": "1. If the indicator's value cross above 35, then BUY.<br/>2. If the indicator's value cross below 75, then SELL."
    },
    {
      "Strategy_name": "HighPoints",
      "Description": "When the highest price of a stock ranks above 100 in relation to the highest prices of the<br/> past 13 trading days (higher stock prices correspond to higher rankings), <br/>it forms a 13-day new high and generates a long signal. This indicates that <br/>the stock is experiencing a positive breakthrough and is in an upward trend.",
      "Rules": "1. If the indicator's value cross above 100, then BUY.<br/>2. If the indicator's value cross below 0, then SELL."
    },
    {
      "Strategy_name": "LowPoints",
      "Description": "When the lowest price of a stock ranks below 0 in relation to the lowest prices of the past 13 trading days, <br/>it forms a 13-day new low and generates a short signal. <br/>This indicates that the stock is in a downtrend and can be shorted.",
      "Rules": "1. If the indicator's value cross below 0, then SELL.<br/>2. If the indicator's value cross above 100, then BUY."
    },
    {
      "Strategy_name": "Head and Shoulders Top",
      "Description": "The stock price rises from the left shoulder to a peak, falls back to the support level, <br/>then rises higher to form a head, and then falls back to the support level again. Afterwards, the price rises to the height of the left shoulder <br/>to form the right shoulder, followed by a significant decline, breaking through the bottom of the pattern and continuing to decline. <br/>Head and shoulders tops are typical bear market signals.",
      "Rules": "1. If the corresponding conditions are met, then SELL.<br/>2. BUY after 21 trading days"
    },
    {
      "Strategy_name": "Head and Shoulders Bottom",
      "Description": "Usually formed after a sharp market decline, indicating a market reversal. The pattern consists of the left shoulder, <br/>head, right shoulder, and neckline. The middle valley (head) is the deepest, while <br/>the front and back valleys (left and right shoulders) are shallower and almost symmetrical, forming <br/>a head and shoulders bottom shape.",
      "Rules": "1. If the corresponding conditions are met, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Double Top",
      "Description": "Composed of two similar high points, shaped like the letter \"M\". The formation of a <br/>double top pattern is a reversal signal, indicating that prices will fall.",
      "Rules": "1. If the corresponding conditions are met, then SELL.<br/>2. BUY after 21 trading days"
    },
    {
      "Strategy_name": "Double Bottom",
      "Description": "Also known as a W bottom, formed when the low points of a stock price's two consecutive <br/>declines are roughly the same. It is a bullish reversal pattern.",
      "Rules": "1. If the corresponding conditions are met, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Triple Tap",
      "Description": "Triple Tap refers to a scenario where stocks or other assets exhibit repeated bounces off <br/>the support line (the lower boundary of the price range). This pattern is often seen <br/>as a positive signal that stock prices are experiencing strong buying support near the support line.  <br/>By observing this pattern, investors may perceive the support line as an important price level that <br/>may have a positive impact on prices and may be a suitable buying opportunity.",
      "Rules": "1. If the corresponding conditions are met, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Rounding Bottom",
      "Description": "Rounding bottom is a chart pattern that's used in technical analysis. It's identified by <br/>a series of price movements that graphically form the shape of a \"U\". Rounding bottoms <br/>are found at the end of extended downward trends and signify a reversal in long-term price movements.",
      "Rules": "1. If the corresponding conditions are met, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Ascending Channel",
      "Description": "Ascending channel is the price action contained between upward sloping parallel lines. <br/>Higher highs and higher lows characterize this price pattern. Before traders take a short position <br/>when price breaks below the lower channel line of an ascending channel, they should look <br/>for other signs that show weakness in the pattern.",
      "Rules": "1. If the corresponding conditions are met, then SELL.<br/>2. BUY after 21 trading days"
    },
    {
      "Strategy_name": "Descending Channel",
      "Description": "Descending channel is a chart pattern that indicates a downward trend in a security's price. <br/>Visually, a descending channel angles downward, from a high point to a lower point. The idea behind the descending channel <br/>is that once established, it may signify a continuation of lower high and low prices. Once the trendlines are solid and extended, <br/>traders can get a sense of points of price support and resistance.",
      "Rules": "1. If the corresponding conditions are met, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Symbol All-Time High",
      "Description": "Symbol All-Time High is the highest closing price a symbol has reached in its trading history. <br/>Symbols that hit all-time high are often viewed as positive indicators, as it shows that investor <br/>confidence and demand for the symbol is continuing to grow.",
      "Rules": "1. If the closing price of the symbol reaches its historical high, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Symbol All-Time Low",
      "Description": "Symbol All-Time Low refers to the lowest closing price the symbol has ever traded at over its entire history. <br/>It indicates the symbol has lost significant value compared to its past performance. Investors <br/>view all-time low as a sign of deep trouble.",
      "Rules": "1. If the closing price of the symbol reaches its historical low, then SELL.<br/>2. BUY after 21 trading days"
    },
    {
      "Strategy_name": "Symbol 52-Week High",
      "Description": "Symbol 52-Week High is the highest closing price at which a symbol has traded in the last 52 weeks (1 year). <br/>A symbol hitting a new 52-week high is often seen as a positive technical indicator that the symbol <br/>is gaining momentum and is in an uptrend.",
      "Rules": "1. If the closing price of the symbol reaches its 52-Week high, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Symbol 52-Week Low",
      "Description": "Symbol 52-Week Low is the lowest closing price at which a symbol has traded in the past 52 weeks (1 year). <br/>Symbols trading at or near 52-week lows are generally considered to be in a downtrend or under significant <br/>selling pressure. 52-week lows can trigger technical sell signals and further downward momentum as investors try to cut their losses.",
      "Rules": "1. If the closing price of the symbol reaches its 52-Week low, then SELL.<br/>2. BUY after 21 trading days"
    },
    {
      "Strategy_name": "Symbol 4-Week High",
      "Description": "Symbol 4-Week High refers to the highest closing price at which a symbol has traded in the last 4 weeks (1 month). <br/>It is a shorter-term technical indicator that gives an idea of a symbol's recent price performance. <br/>Symbols that make new four-week highs are often seen as having positive short-term momentum because they are trading at the highest <br/>price levels of the past month.",
      "Rules": "1. If the closing price of the symbol reaches its 4-Week high, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Symbol 4-Week Low",
      "Description": "Symbol 4-Week Low is the lowest closing price at which a symbol has traded in the past 4 weeks (1 month). Tracking whether <br/>a symbol is near its 4-week low gives an idea of how weak the symbol's recent price has been compared <br/>to the past month. Symbols trading at or near 4-week lows are usually considered to be under short-term selling pressure <br/>or in a recent downtrend.",
      "Rules": "1. If the closing price of the symbol reaches its 4-Week low, then SELL.<br/>2. BUY after 21 trading days"
    },
    {
      "Strategy_name": "Symbol 13-Week High",
      "Description": "Symbol 13-Week High is the highest closing price at which a symbol has traded in the past 13 weeks (3 months). <br/>Symbols that make new 13-week high are often seen as having positive medium-term momentum because they are <br/>trading at their highest levels of the past quarter. A new 13-week high can be a bullish signal that <br/>a symbol is in an uptrend.",
      "Rules": "1. If the closing price of the symbol reaches its 13-Week high, then BUY.<br/>2. SELL after 21 trading days"
    },
    {
      "Strategy_name": "Symbol 13-Week Low",
      "Description": "Symbol 13-Week Low refers to the lowest closing price a symbol has traded at over the past 13 weeks (3 months). <br/>Symbols trading at or near their 13-week lows are often seen as being in a medium-term downtrend or under selling <br/>pressure. The 13-week low gives a longer-term view on a symbol's recent price weakness. Hitting a new 13-week <br/>low can be a bearish signal, suggesting the symbol is in a downward trend.",
      "Rules": "1. If the closing price of the symbol reaches its 13-Week low, then SELL.<br/>2. BUY after 21 trading days"
    }
  ],
            descItem: null,
		}
	},
    created(){
    },
    mounted() {
        this.loadTable();
    },
	methods: {
        async loadTable() {
            if (this.strategies.length > 0) {
                this.updateDesciptionWithSelectedStrategy(); // 根据当前选择的策略更新图表
                this.loading = false;
                return;
            }

            try {
                const signalData = await getSymbolStrategySigal(this.symbol);
                if(signalData.data.status == 504) {
                this.popUpMsgBox(signalData.data.msg)
                this.$emit('error');  // 向父组件发出 'error' 事件
                }else {
                this.strategies = signalData.data.data; // 保存所有策略数据
                this.updateDesciptionWithSelectedStrategy();
                }
            } catch (error) {
                console.error(`Error fetching data for symbol: ${this.symbol}`, error);
                this.$emit('error');  // 向父组件发出 'error' 事件
            } finally {
                this.loading = false; // 无论成功或失败都结束 loading 状态
            }
        },
        updateDesciptionWithSelectedStrategy() {
            const name = this.strategies[this.selectedStrategyIndex].Signal
            this.descItem = this.descMap.find(i=>i["Strategy_name"] == name)
            debugger
        },
    }
}
</script>

<style lang="less" scoped>
.description-container {
    margin-top: 3rem;
    margin-bottom: 3rem;

    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    row-gap: 1rem;
    .description-container--rules {
        margin-left: 1rem;
    }
}
</style>