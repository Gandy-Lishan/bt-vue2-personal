<template>
  <div :class="{'trend-score-des': isTrendScorePage, 'panel-group': true, 'accordion': true}">
    <el-collapse accordion>
      <el-collapse-item>
        <template slot="title">
          <p class="page-title" v-if="(enlarged === 'Absolute and Relative Trend Scores' || enlarged === 'Crypto') && (!checkedType || ['SP1500Score', 'SP500Score', 'NDX100Score', 'CRPScore', 'RussellScore', 'DomesticETFScore', 'ForeignETFScore', 'OtherAssetsETFScore', 'TrendSector', 'TSCRP', 'WatchList'].includes(checkedType))">Click for Indicator Description</p>
          <p class="page-title" v-else>Table Description and Optimism/Pessimism Legend (click to expand)</p>
        </template>
        <div class="centent" :class="{tendScore: (enlarged === 'Absolute and Relative Trend Scores' || enlarged === 'Crypto') && (!checkedType || ['SP1500Score', 'SP500Score', 'NDX100Score', 'CRPScore', 'RussellScore', 'DomesticETFScore', 'ForeignETFScore', 'OtherAssetsETFScore', 'TrendSector', 'TSCRP', 'WatchList'].includes(checkedType))}">
        <div class="des" v-if="
        !enlarged || (enlarged === 'Stock Market Indicator & Optix (Optimism Index)' && (!checkedType || checkedType === 'stock'))
        || (enlarged === 'Bond & Commodity' && (!checkedType || checkedType === 'bond' || checkedType === 'commodity'))
        || (enlarged === 'Seasonality' && (!checkedType || checkedType === 'CommoditySeasonality'))
        || (enlarged === 'Seasonality' && (checkedType === 'BondSeasonality'))
        || (enlarged === 'Crypto' && (checkedType === 'CRP'))
        ||  (enlarged === 'Stock Market Indicator & Optix (Optimism Index)' && (!checkedType || checkedType === 'Russell'))
        ||  (enlarged === 'Stock Market Indicator & Optix (Optimism Index)' && (!checkedType || checkedType === 'CRP'))
        ||  (enlarged === 'Macroeconomic Conditions' && (!checkedType || checkedType === 'macroeconomic'))
        ||  (enlarged === 'Stock' && checkedType === 'stock')
        ">
          <p>
            The following table shows indicators related to the stock market.  Click any column heading
            to sort the table by that column, and click again to reverse it.  Click the "<b>Sentiment</b>"
            table header to sort the table by indicators showing the most
            pessimism for the stock market; click again to sort it by indicators showing the most
            optimism.  Click the model/indicator Name to view the interactive chart for that indicator.
          </p>
          <p>Daily models and indicators are usually updated by 6pm EST, except for Rydex which is usually by 10pm EST. </p>
          <p>The "TIME FRAME" column shows the applicable time frame for each indicator:</p>
          <ul>
            <li>Short = Short-term (several days)</li>
            <li>Medium = Medium-term (one to three months)</li>
            <li>Long = Long-term (longer than three months)</li>
          </ul>
          <p>Each indicator in the table is accompanied by an icon.  That icon tells you how extreme the
          indicator is relative to its recent range.  "Extremely Pessimistic" means the indicator is
          showing that investors have likely already sold and stocks should rise; "Optimistic", on
          the other hand, means that the indicator is mildly suggesting investors are too confident
          and stocks may fall going forward.  The more extreme the indicator, the stronger the
          contrary signal.</p>
          <div class="note note-info">
            <p>You can sort the table below by a single column or by multiple columns. To sort by one column, just
            click the column name. To sort by multiple columns, press and hold the "Shift" key on your keyboard
            and then select the columns you wish to sort by.</p>
        </div>
        </div>
        <div class="des" v-else-if="enlarged === 'Stock Market Indicator & Optix (Optimism Index)' && (!checkedType || checkedType === 'NASDAQ')">
          <p>The following table shows the Optimism Index (Optix) for each stock in the NASDAQ 100.  Click any
              column heading to sort the table by that column, and click again to reverse it.  Click the "excess"
              icon to sort the table by stocks showing the most pessimism (the most hated stocks); click again to
              sort it by stocks with the most optimism.  Click the hyperlinked Ticker to pull up an interactive
              chart page.  The best prospects for potential long positions have an Optix between 50 - 75
              (positive but not showing excessive optimism) or below 25 (showing excessive pessimism).
              The prospects to avoid have an Optix between 25 - 50 (negative but not showing excessive pessimism)
              or above 75 (showing excessive optimism). Additionally, using the Z-Score column, you can better
              understand where the sentiment values are relative to a typical sentiment score. </p>
          <div class="note note-info">
            <p>You can sort the table below by a single column or by multiple columns. To sort by one column, just
            click the column name. To sort by multiple columns, press and hold the "Shift" key on your keyboard
            and then select the columns you wish to sort by.</p>
          </div>
        </div>
        <div class="des" v-else-if="enlarged === 'Stock Market Indicator & Optix (Optimism Index)' && (!checkedType || checkedType === 'SP1500')">
          <p>The following table shows the Optimism Index (Optix) for each stock in the S&P 1500.  Click any column heading to sort the table by that column, and click again to reverse it.  Click the "excess"   icon to sort the table by stocks showing the most pessimism (the most hated stocks); click again to sort it by stocks with the most optimism.  Click the hyperlinked Ticker to pull up an interactive chart page.  The best prospects for potential long positions have an Optix between 50 - 75 (positive but not showing excessive optimism) or below 25 (showing excessive pessimism).  The prospects to avoid have an Optix between 25 - 50 (negative but not showing excessive pessimism) or above 75 (showing excessive optimism). Additionally, using the Z-Score column, you can better understand where the sentiment values are relative to a typical sentiment score. </p>
          <div class="note note-info">
            <p>You can sort the table below by a single column or by multiple columns. To sort by one column, just
              click the column name. To sort by multiple columns, press and hold the "Shift" key on your keyboard
              and then select the columns you wish to sort by.</p>
          </div>
        </div>
        <div class="des page-content-wrapper" v-else-if="(enlarged === 'Absolute and Relative Trend Scores' || enlarged === 'Crypto' ||enlarged === 'Sector Trend RelTrend') && (!checkedType || ['SP1500Score', 'SP500Score', 'NDX100Score', 'CRPScore', 'RussellScore', 'DomesticETFScore', 'ForeignETFScore', 'OtherAssetsETFScore', 'TrendSector', 'TSCRP', 'SectorTrendRelTrend', 'WatchList'].includes(checkedType))">
          <p>The <b>Absolute</b> and <b>Relative Trend Score Indicators</b> use a weight of the evidence framework by aggregating ten trend-following indicators to deliver a comprehensive composite score for trend evaluation. Scores range from 0 (weakest) to 10 (strongest).</p>
          <p>Although the components and duration parameters remain fixed, the indicators provide investors with flexible options for identifying trading or investing opportunities and controlling risk. Additionally, the composites can serve as a secondary filter for your existing technical or fundamental investment approaches, ensuring your strategies align with current market trends.</p>
          <ul>
            <li>The Absolute Trend Score evaluates the strength of an asset’s individual trend</li>
            <li>The Relative Trend Score gauges the strength of an asset's trend in comparison to the S&P 500, offering a view of its performance against the broader market</li>
          </ul>
          <p>Updated daily by 6 PM EST, this dashboard allows users to search and rank stocks, ETFs, and other assets based on trend scores and week-over-week changes. This powerful feature helps you see which assets are strengthening or weakening, supporting more informed investment choices from a single view.</p>
          <p>With the <b>S&P 500 Sector Trend Scores Summary</b>, users get a comprehensive view of absolute and relative trend scores across sectors, highlighting leading and lagging groups. The table reflects the percentage of stocks in each sector with trend scores in key ranges—0 (weakest), over 5 (above average), and 10 (strongest)—on both an absolute and relative basis. This summary effectively monitors sector trends, offering insights into market leadership.</p>
          <h3>Composite Trend Model Scoring Methodology</h3>
          <p>0 (Weakest) to 10 (Strongest)</p>
          <table class="threshold-table description-table" style="width: 100%">
            <tr  style="text-align: left">
              <th style="width: 50%">Trend Score Conditions</th>
              <th style="width: 50%">Relative Trend Score Conditions</th>
            </tr>
            <tbody>
              <tr class="even">
                <td>Close > 50-Day Average = +1</td>
                <td>Ratio > 50-Day Average Ratio = +1</td>
              </tr>
              <tr>
                <td>Close > 100-Day Average = +1</td>
                <td>Ratio > 100-Day Average Ratio = +1</td>
              </tr>
              <tr class="even">
                <td>Close > 200-Day Average = +1</td>
                <td>Ratio > 200-Day Average Ratio = +1</td>
              </tr>
              <tr>
                <td>50-Day Average Rising = +1</td>
                <td>50-Day Average Ratio Rising = +1 </td>
              </tr>
              <tr class="even">
                <td>100-Day Average Rising = +1</td>
                <td>100-Day Average Ratio Rising = +1 </td>
              </tr>
              <tr>
                <td>200-Day Average Rising = +1</td>
                <td>200-Day Average Ratio Rising = +1 </td>
              </tr>
              <tr class="even">
                <td>50-Day Average > 100-Day Average = +1</td>
                <td>50-Day Average Ratio > 100-Day Average Ratio = +1</td>
              </tr>
              <tr>
                <td>50-Day Average > 200-Day Average = +1</td>
                <td>50-Day Average Ratio > 200-Day Average Ratio = +1</td>
              </tr>
              <tr class="even">
                <td>100-Day Average > 200-Day Average = +1</td>
                <td>100-Day Average Ratio > 200-Day Average Ratio = +1</td>
              </tr>
              <tr>
                <td>Close above 63-Day High +1 until Close Below 63-Day Low</td>
                <td>Ratio above 63-Day High Ratio +1 until Ratio Below 63-Day Low Ratio</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="des" v-else-if="
        (enlarged === 'ETF' && (!checkedType || checkedType === 'ETFSector'))
        || (enlarged === 'Seasonality' && checkedType === 'ETFSeasonality')">
          <p>The following table shows the Optimism Index (Optix) for the most active
                  exchange-traded funds (ETFs).  We also show breadth for the sector funds.
                  Click any column heading to sort the table by that column, and click again to
                  reverse it.  Click the "excess"   icon to sort the table by ETFs showing the
                  most pessimism (the most hated ETFs); click again to sort it by ETFs with the
                  most optimism.  Click the Ticker symbol to pull up an interactive chart
                  for that fund.  The best prospects for potential long positions have an
                  Optix between 50 - 75 (positive but not showing excessive optimism) or
                  below 25 (showing excessive pessimism).  The prospects to avoid have an
                  Optix between 25 - 50 (negative but not showing excessive pessimism) or
                  above 75 (showing excessive optimism)
              </p>
              <p><a href="https://users.sentimentrader.com/users/etf_flow/" target="_blank">Click here</a> to see the list of Most
                  Active ETF Fund Flows.
              </p>
              <p>Daily models and indicators are usually updated by 6pm EST, except for Rydex which is usually by 10pm EST. </p>
                  <p>The "TIME FRAME" column shows the applicable time frame for each indicator:</p>
             <ul>
                    <li>Short = Short-term (several days)</li>
                    <li>Medium = Medium-term (one to three months)</li>
                    <li>Long = Long-term (longer than three months)</li>
             </ul>
                 <p>Each indicator in the table is accompanied by an icon.  That icon tells you how extreme the
                 indicator is relative to its recent range.  "Extremely Pessimistic" means the indicator is
                 showing that investors have likely already sold and stocks should rise; "Optimistic", on
                 the other hand, means that the indicator is mildly suggesting investors are too confident
                 and stocks may fall going forward.  The more extreme the indicator, the stronger the
                 contrary signal.</p>
                 <div class="note note-info">
                   <p>You can sort the table below by a single column or by multiple columns. To sort by one column, just
                     click the column name. To sort by multiple columns, press and hold the "Shift" key on your keyboard
                     and then select the columns you wish to sort by.</p>
               </div>
        </div>
        <div class="des" v-else-if="(enlarged === 'ETF' && (checkedType === 'ETFSectorBreadth' || checkedType === 'ETFFundFlow')) || enlarged === 'Breadth' && (checkedType === 'ETFSectorBreadth')">
          <p>The following table shows the Fund Flow for the most active exchange-traded
              funds (ETFs).  Click any column heading to sort the table by that column, and
              click again to reverse it.  Click the "excess"   icon to sort the table by
              ETFs showing the most pessimism (the most outflows); click again to sort it
              by ETFs with the most inflows.  Click the Ticker symbol to pull up an
              interactive chart for that fund.
          </p>
          <div class="note note-info">
            <p>You can sort the table below by a single column or by multiple columns. To sort by one column, just
              click the column name. To sort by multiple columns, press and hold the "Shift" key on your keyboard
              and then select the columns you wish to sort by.</p>
          </div>
        </div>
        <div class="des" v-else-if="enlarged === 'ETF' && (checkedType === 'ETFMonthlyFund' || checkedType === 'ETFShares')">
          <p>The following table shows the Shares Outstanding for the most active exchange-traded
              funds (ETFs).  Click any column heading to sort the table by that column, and
              click again to reverse it.  Click the "excess"   icon to sort the table by
              ETFs showing the most pessimism (the most outflows); click again to sort it
              by ETFs with the most inflows.  Click the Ticker symbol to pull up an
              interactive chart for that fund.
          </p>
          <div class="note note-info">
            <p>You can sort the table below by a single column or by multiple columns. To sort by one column, just
              click the column name. To sort by multiple columns, press and hold the "Shift" key on your keyboard
              and then select the columns you wish to sort by.</p>
          </div>
        </div>
        <div class="des" v-else-if="enlarged === 'Breadth' && (checkedType === 'GlobalIndexBreadth' || checkedType === 'CryptoCurrencyBreadth')">
          <p>This table tracks various international breadth indicators in real-time covering six economic regions (All Countries, Developed Markets, Emerging Markets, Asia Pacific, Europe, South America), revealing trend strength, price momentum and market sentiment for assets in different countries or regions.
          </p>
          <div class="note note-info">
            <p>You can sort the table below by a single column or by multiple columns. To sort by one column, just
              click the column name. To sort by multiple columns, press and hold the "Shift" key on your keyboard
              and then select the columns you wish to sort by.</p>
          </div>
        </div>
        <div class="col-md-3 thumbnail" v-show="!((enlarged === 'Absolute and Relative Trend Scores' || enlarged === 'Crypto') && (!checkedType || ['SP1500Score', 'SP500Score', 'NDX100Score', 'CRPScore', 'RussellScore', 'DomesticETFScore', 'ForeignETFScore', 'OtherAssetsETFScore', 'TrendSector', 'TSCRP', 'WatchList'].includes(checkedType)))">
        <div style="text-align: center; font-size: 18px; font-weight: 300">
          <span>Optimism/Pessimism Legend</span>
        </div>
        <table border="0" cellspacing="1">
          <tbody>
            <tr>
              <td align="center"><b>Icon</b></td>
              <td align="center"><b>Meaning</b></td>
            </tr>
            <tr>
              <td align="center">
                <img
                  border="0"
                  src="https://dnpgic06wp5lx.cloudfront.net/images/bull_bear_1.gif"
                  width="102"
                  height="19"
                />
              </td>
              <td align="center">&nbsp;&nbsp;Extremely Pessimistic</td>
            </tr>
            <tr>
              <td align="center">
                <img
                  border="0"
                  src="https://dnpgic06wp5lx.cloudfront.net/images/bull_bear_2.gif"
                  width="102"
                  height="19"
                />
              </td>
              <td align="center">&nbsp;&nbsp;Very Pessimistic</td>
            </tr>
            <tr>
              <td align="center">
                <img
                  border="0"
                  src="https://dnpgic06wp5lx.cloudfront.net/images/bull_bear_3.gif"
                  width="102"
                  height="19"
                />
              </td>
              <td align="center">&nbsp;&nbsp;Pessimistic</td>
            </tr>
            <tr>
              <td align="center">
                <img
                  border="0"
                  src="https://dnpgic06wp5lx.cloudfront.net/images/bull_bear_4.gif"
                  width="102"
                  height="19"
                />
              </td>
              <td align="center">&nbsp;&nbsp;Neutral</td>
            </tr>
            <tr>
              <td align="center">
                <img
                  border="0"
                  src="https://dnpgic06wp5lx.cloudfront.net/images/bull_bear_5.gif"
                  width="102"
                  height="19"
                />
              </td>
              <td align="center">&nbsp;&nbsp;Optimistic</td>
            </tr>
            <tr>
              <td align="center">
                <img
                  border="0"
                  src="https://dnpgic06wp5lx.cloudfront.net/images/bull_bear_6.gif"
                  width="102"
                  height="19"
                />
              </td>
              <td align="center">&nbsp;&nbsp;Very Optimistic</td>
            </tr>
            <tr>
              <td align="center">
                <img
                  border="0"
                  src="https://dnpgic06wp5lx.cloudfront.net/images/bull_bear_7.gif"
                  width="102"
                  height="19"
                />
              </td>
              <td align="center">&nbsp;&nbsp;Extremely Optimistic</td>
            </tr>
          </tbody>
        </table>
        </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: 'Description',
  props: {
    enlargedTable: [Object, String], // string or null
    checkedType: [Object, String] // string or null
  },
  data() {
    return {
      type: 1,
      isTrendScorePage: false
    }
  },
  computed: {
    enlarged() {
      return this.enlargedTable
    }
  },
  mounted() {
    if(this.$route.path === '/trend_score') {
      this.isTrendScorePage = true
    }
  },
}
</script>
<style lang="less" scoped>
.accordion {
  padding: 0px 0px 10px 0px;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  font-weight: 300;
  color: #666;
  position: relative;
  flex-wrap: wrap;
  height: auto;
}
.page-title {
  margin: 0px 0px 0px 10px;
  font-size: 18px;
}
/deep/ .el-collapse-item__wrap {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 15px 15px 0px 15px;
}
/deep/ .el-collapse-item__content {
  color: #333;
  font-weight: 400;
}
.centent {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-column-gap: 20px;
  font-size: 15px;
  font-family: "Open Sans",sans-serif;
  direction: 1tr;
  line-height: 1.5em;
  p {
    margin: 0 0 10px;
  }
  .note {
    margin: 0 0 20px 0;
    padding: 15px 30px 15px 15px;
    border-left: 5px solid #eee;
    border-radius: 0 4px 4px 0;
    p {
      margin: 0;
    }
  }
  .note.note-info {
    background-color: #eee;
    border-color: #666;
    color: #000;
  }
  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    list-style: inside;
    padding-left: 40px;
  }
  li {
    display: list-item;
  }
}
.tendScore {
  grid-template-columns: 1fr;
}
.col-md-3.thumbnail {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 5px;
  height: 217px;
}
table tbody tr.even, table tbody tr.even {
    background-color: #f6f3f3;
}
.trend-score-des {
  margin: 20px 0px 10px 0px;
}
</style>