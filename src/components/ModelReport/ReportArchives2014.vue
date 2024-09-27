<template>
 <div class="page-content-wrapper">
   <div class="page-content">
     <!-- Page Header -->
     <div class="page-head">
       <div class="container">
         <!-- BEGIN PAGE TITLE -->
         <div class="page-title">
           <h1>{{ title }}</h1>
         </div>
         <!-- END PAGE TITLE -->
       </div>
     </div>

     <div class="container">
       <!-- Main Content -->
       <div class="row">
         <div class="col-md-12">
           <div class="portlet light">
             <div class="row">
               <div class="col-md-9">
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141231.pdf')">
                12/31/14</a>......Emerging Markets have held off the collapse in crude oil, 
                despite a usually high correlation </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141230.pdf')">
                12/30/14</a>......Financial stress has risen according to regional Federal 
                Reserve banks, unusual since stocks are sitting at new highs </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141229.pdf')">12/29/14</a>......Heading
                into the New Year, it's usually best to look for investments that have either 
                modestly positive or extremely pessimistic sentiment </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141226.pdf')">12/26/14</a>......The
                small-cap Russell 2000 index has closed at its first 3-year high for the first 
                time in more than six months </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141224.pdf')">
                12/24/14</a>......With traders leaving for the holidays, volume in SPY sunk to 
                its lowest level in five years, leading to no movement of note in our indicators
                </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141223.pdf')">
                12/23/14</a>......Over the past several days, traders have rushed into S&amp;P 500 
                ETFs, pushing the four-day inflow to the highest in four years </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141222.pdf')">12/22/14</a>......Equity
                mutual funds have suffered their worst outflow since 2011 over the past four 
                weeks, even accounting for seasonality </p>
               <div>
                <p><a  ::href="url_for('user.download_file', filename='2014/sentiment_report_20141219.pdf')">12/19/14</a>......Another 
                v-shaped bottom has put the S&amp;P close to a 52-week high, a near-record after 
                recording a 20-day low only three days ago </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141218.pdf')">
                12/18/14</a>......Back-to-back days with a NYSE Up Issues Ratio breadth thrust 
                above 80% have led to consistent intermediate-term gains </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141217.pdf')">12/17/14</a>......Today
                saw a breadth thrust, with an Up Issues Ratio on the NYSE that was the highest 
                in a year, coming a day after stocks' 20-day low</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141216.pdf')">
                12/16/14</a>......Crude oil has suffered one of the most severe, and extended, 
                declines in 30 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141215.pdf')">
                12/15/14</a>......The discount to net asset value for high-yield junk bond funds 
                has surpassed -1%, one of the lowest levels in 7 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141212.pdf')">
                12/12/14</a>......Traders are betting on a drop in volatility (VIX) in the weeks 
                and months ahead, something they've usually been right about</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141211.pdf')">
                12/11/14</a>......High yield junk bonds have sold off, giving a "triple time 
                frame" rate of change among the lowest in nearly 30 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141210.pdf')">
                12/10/14</a>......The VIX has jumped more than 50% despite less than a 2.5% 
                decline in the S&amp;P 500, a record increase in "irrational" fear</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141209.pdf')">
                12/09/14</a>......Large cap stocks (Russell 1000) have out-performed small-caps 
                (Russell 2000) by nearly 10% this year</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141208.pdf')">
                12/08/14</a>......Bond investors have become extremely optimistic that yields 
                will continue to decline, the opposite of what they expected in January</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141205.pdf')">
                12/05/14</a>......Mexican stocks and the peso have suffered panic selling the 
                past two weeks, leading to the most lopsided pessimism since 2008</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141204.pdf')">
                12/04/14</a>......The Risk Appetite Index is showing a hesitancy to take risk 
                across asset classes</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141203.pdf')">
                12/03/14</a>......Fewer than 25% of investors are looking for lower prices, 
                among the lowest recorded in nearly 30 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141202.pdf')">
                12/02/14</a>......The Arms Index (aka TRIN) has been above 1.0 for the past six 
                days, despite the S&amp;P 500 trading at a 52-week high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141201.pdf')">
                12/01/14</a>......Wall 
                Street analysts haven't given up on energy stocks, with the average analyst 
                rating of stocks in the XLE fund at above-average levels</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141121.pdf')">11/21/14</a>......Optimism
                jumps in technology stocks just as they carve out a bearish reversal at a new 
                high </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141120.pdf')">
                11/20/14</a>......Stocks have enjoyed record short-term and long-term momentum, 
                with the S&amp;P trading above both its 5-day and 5-month averages </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141119.pdf')">
                11/19/14</a>......There are negative divergences with some risk-off guides like 
                Discretionary vs Staples stocks and the Russell 2000 vs S&amp;P 500</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141118.pdf')">
                11/18/14</a>......The S&amp;P 500 enjoyed an upside breakout from a tight 5-day 
                trading range at new highs, a good sign </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141117.pdf')">
                11/17/14</a>......Comfort with individual stocks has grown, as the Liquidity 
                Premium for SPY has plunged to extremely negative levels </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141114.pdf')">
                11/14/14</a>......The S&amp;P 500's closing range over the past 5 days is the lowest 
                in history, despite the index setting a new 52-week high </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141113.pdf')">
                11/13/14</a>......The Metals &amp; Mining industry collapsed, sending public 
                optimism to near record lows, while insiders have been aggressively buying
                </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141112.pdf')">11/12/14</a>......Mom
                and pop investors in the silver ETF (SLV) have been holding despite falling 
                prices, as the number of ounces held has risen </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141111.pdf')">
                11/11/14</a>......The S&amp;P 500 has levitated above its 5-day moving average for 
                18 trading days, one of the few times in history when coming off a low </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141110.pdf')">
                11/10/14</a>......Assets in bullish S&amp;P 500 ETFs and mutual funds relative to 
                inverse funds has shot to a new record </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141107.pdf')">
                11/07/14</a>......The 9% rally off the October low hasn't had a thrust day with 
                more than 90% Up Volume </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141106.pdf')">11/06/14</a>......The
                bearish percentage in the AAII survey of individual investors dropped to a 
                multi-year low of 15% </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141105.pdf')">
                11/05/14</a>......Over the past two weeks Investor's Intelligence newsletter 
                bulls have jumped the most in nearly 40 years </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141104.pdf')">
                11/04/14</a>......Cash flow into S&amp;P 500 ETFs has hit a record $17 billion over 
                the past two weeks, suggesting too much confidence </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141103.pdf')">
                11/03/14</a>......Sentiment towards the Materials fund, XLB, has soured and 
                recently declined to its 3rd lowest reading in nearly a decade</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141031.pdf')">
                10/31/14</a>......With the S&amp;P 500's first 52-week high in a month, the 
                percentage of its component stocks also at a new high hit a six-month extreme</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141030.pdf')">
                10/30/14</a>......The S&amp;P 500 has blasted off from its six-month low, trading 
                above its 5-day moving average for 10 straight days</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141029.pdf')">
                10/29/14</a>......Newsletter writer bulls have jumped by one of the largest 
                amounts ever from a one-year low, according to Investor's Intelligence</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141028.pdf')">
                10/28/14</a>......The McClellan Oscillator has surged, showing a strong thrust 
                when the S&amp;P 500 had been at a six-month low within two weeks</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141027.pdf')">
                10/27/14</a>......Barron's Big Money shows a historic amount of pessimism toward 
                bonds, while sell side brokerage firms show optimism</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141024.pdf')">
                10/24/14</a>......The AAII survey shows that individual investors are showing 
                "irrational" optimism based on past behavior, but not to an excessive degree</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141023.pdf')">
                10/23/14</a>......Individual investors in the AAII survey are showing among the 
                highest-ever level of optimism a week after a six-month low in the S&amp;P 500</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141022.pdf')">
                10/22/14</a>......We take a look at the S&amp;P 500's recovery from last week's 
                panic and compare it to failed rallies, tests and v-shaped bottoms</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141021.pdf')">
                10/21/14</a>......Stocks enjoyed a kick-off day with the S&amp;P showing its largest 
                gain in a year, after hitting a six-month low in the past week</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141020.pdf')">
                10/20/14</a>......The S&amp;P 500 is testing its 200-day moving average after 
                spending a week below it, following more than six months above</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141017.pdf')">
                10/17/14</a>......There were 50 selling climaxes among S&amp;P 500 stocks this week 
                as they set new 52-week lows but closed positively</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141016.pdf')">
                10/16/14</a>......More than 50% of 85 indicators now match or exceed the 
                extremes they've seen at 26 other low over the past 20 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141015.pdf')">
                10/15/14</a>......The S&amp;P 500 has erased 50% of its gains from the past year, 
                after closing at a 52-week within the past month</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141014.pdf')">
                10/14/14</a>......Crude oil sentiment has soured as it suffers its largest loss 
                in a year, and its lowest close in a year; XLE breadth is oversold as well</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141013.pdf')">
                10/13/14</a>......Fear has become more expensive, versus June when it was 
                near-record cheap, but is not yet extreme according to the SKEW/VIX Ratio</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141010.pdf')">
                10/10/14</a>......The VIX "fear gauge" has doubled from its low over the past 
                six months, the first time since August 2011</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141009.pdf')">
                10/09/14</a>......The Stock/Bond Ratio has averaged -2 over the past week, 
                rarely achieved when the S&amp;P 500 is above its 200-day average</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141008.pdf')">
                10/08/14</a>......The past 10 days have accounted for 50% of the past six 
                months' worth of 1% moves in the Dow Jones Industrial Average</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141007.pdf')">
                10/07/14</a>......The small cap Russell 2000 hit a 200-day low after the S&amp;P 500 
                just hit a 200-day high, which preceded selling in 1990 and 1998</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141006.pdf')">
                10/06/14</a>......Wall Street analysts have become extremely pessimistic on S&amp;P 
                500 companies' price targets and earnings power</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141003.pdf')">
                10/03/14</a>......Closed-end funds focused on high-yield junk bonds have dove to 
                a nearly five-year extreme discount to net asset value</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141002.pdf')">
                10/02/14</a>......Corporate insiders have picked up their buying activity, 
                leading to a Buy Inflection from InsiderScore.com</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20141001.pdf')">
                10/01/14</a>......The Russell 2000 has finally suffered a correction, which has 
                typically led to further selling pressure before a low took hold</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140930.pdf')">
                09/30/14</a>......The Dow Jones Industrial Average has reached a 12-quarter high 
                without anything larger than a -3% quarterly loss</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140929.pdf')">
                09/29/14</a>......US dollar optimism has hit a 15-year high, amid a 40-year 
                record of 11 straight positive weeks</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140926.pdf')">
                09/26/14</a>......The S&amp;P 500 sprung a bear trap by violating its 50-day average 
                then immediately jumping back above</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140925.pdf')">
                09/25/14</a>......Negative divergences with new highs have accumulated, with 
                more than 40 days over the past two years, third highest in 50 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140924.pdf')">
                09/24/14</a>......A sell off in high yield junk bonds was a warning sign in 2000 
                and 2007, but has been inconsistent otherwise</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140923.pdf')">
                09/23/14</a>......Pension funds haven't increased their holdings of stock much, 
                but they have more than made up for it by buying mutual funds</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140922.pdf')">
                09/22/14</a>......Hedge funds have lagged the S&amp;P 500 this year, which has 
                normally led to positive fourth-quarter performance</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140919.pdf')">
                09/19/14</a>......The Dow Jones Industrials closed at a 52-week high, while the 
                NYSE Up Issues Ratio showed horrible breadth with a 40% reading</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140918.pdf')">
                09/18/14</a>......Growth in assets in long-only S&amp;P 500 ETFs and mutual funds 
                has greatly eclipsed the growth in short-only funds, to a record degree</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140917.pdf')">
                09/17/14</a>......Both the Dow Industrials and Dow Transports have broken out to 
                new highs; Industrials actually perform better if Transports lag a bit</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140916.pdf')">
                09/16/14</a>......A looming "death cross" in the small cap Russell 2000 index 
                has been an inconsistent signal in the past</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140915.pdf')">
                09/15/14</a>......Short-sellers have given up on the inverse VIX fund, XIV, and 
                that has usually been positive for stocks</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140912.pdf')">
                09/12/14</a>......Financial conditions are so calm that Federal Reserve Stress 
                Indexes meander near all-time lows</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140911.pdf')">
                09/11/14</a>......Assets in inverse ETFs have sunk to a nearly all-time low as a 
                percentage of total equity ETF assets</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140910.pdf')">
                09/10/14</a>......There were more new 52-week lows than 52-week highs on the 
                NYSE and Nasdaq exchanges, despite the S&amp;P 500 being near a high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140909.pdf')">
                09/09/14</a>......The largest IPOs in history have been a drag on their industry 
                over the ensuing months, a flag for internets given Alibaba</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140908.pdf')">
                09/08/14</a>......The latest Barron's cover showed a bull and "clear sailing" 
                ahead, but a look at its covers has not shown a contrarian tendency</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140905.pdf')">
                09/05/14</a>......Fewer than 5.5% of S&amp;P 500 components hit a 52-week high, 
                despite the S&amp;P itself closing at a new high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140904.pdf')">
                09/04/14</a>......Stocks went from trading at a new high to erasing the past 7 
                days worth of gains</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140903.pdf')">
                09/03/14</a>......Crude oil enjoyed its best gain in a year the day after 
                suffering its worst loss in a year</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140902.pdf')">
                09/02/14</a>......The S&amp;P 500 is close to recording only four moves of +/- 1% 
                over the past 100 days</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140829.pdf')">
                08/29/14</a>......Commercial hedgers in the Japanese yen are holding a 
                near-record long position, which has led to weakness in the Nikkei 225</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140828.pdf')">
                08/28/14</a>......IPOs over the past year have tilted toward money-losing 
                companies, with a differential of more than -100, the most since 2000 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140827.pdf')">
                08/27/14</a>......Optimism on the Canadian dollar is near its lowest in more 
                than 20 years, as the dollar has its biggest jump in nearly a year &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140826.pdf')">
                08/26/14</a>......Stocks are hitting new highs on below-average volume, which 
                has led to modestly below-average returns</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140825.pdf')">
                08/25/14</a>......Investors' available cash (or net worth) declined to a nearly 
                30-year low in July</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140822.pdf')">08/22/14</a>......VIX
                options traders appear to be betting on a rise in fear according to several 
                measures</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140821.pdf')">08/21/14</a>......Fewer
                than 10% of S&amp;P 500 components closed at a 52-week high along with the index, 
                the eighth time in six months</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140820.pdf')">
                08/20/14</a>......There has been a breadth thrust in the NYSE Up Issues Ratio 
                over the past two weeks, with the S&amp;P 500 at a 52-week high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140819.pdf')">
                08/19/14</a>......Stocks have enjoyed six v-shaped bottoms in the past two 
                years, the most over that time span since 1936</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140818.pdf')">
                08/18/14</a>......Penny stock traders left the market in July, sending 
                transaction volume to its lowest level since the 2008 bear market</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140815.pdf')">
                08/15/14</a>......Suggestions that Warren Buffett has "lost his touch" have 
                reached the mainstream media, but it is not a consistent theme</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140814.pdf')">
                08/14/14</a>......Stocks have put in a reflex rally from a bull market 
                correction, which has had a low likelihood of an immediate reversal</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140813.pdf')">
                08/13/14</a>......Wall Street analysts have reduced price targets on more stocks 
                than those on which they've raised targets</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140812.pdf')">
                08/12/14</a>......The value of announced mergers at premium prices and 
                valuations is at record or near-record levels</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140811.pdf')">
                08/11/14</a>......Stocks have struggled this earnings season despite good 
                earnings growth in the S&amp;P 500</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140808.pdf')">
                08/08/14</a>......Limited commentary - price surge pulls indicators out of 
                short-term extremes</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140807.pdf')">
                08/07/14</a>......Limited commentary - poor price action and few pessimistic 
                extremes</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140806.pdf')">
                08/06/14</a>......Limited commentary - more lessening of intermediate-term 
                extremes</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140805.pdf')">
                08/05/14</a>......Limited commentary - re-test of lows does not trigger 
                pessimistic extremes</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140804.pdf')">
                08/04/14</a>......Limited commentary - rebound from short-term oversold 
                conditions</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140801.pdf')">
                08/01/14</a>......Late-week selling led to a "shock week" with the largest 
                weekly loss in a year after being near a 52-week high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140731.pdf')">
                07/31/14</a>......Stocks experienced a mini "shock day" by hitting a 30-day low 
                within a week of closing at a multi-year high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140730.pdf')">
                07/30/14</a>......After the S&amp;P 500 hit a 52-week high a week ago, breadth via 
                the NYSE Up Issues Ratio has been negative every day</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140729.pdf')">
                07/29/14</a>......Volatility has become so muted that the 10-day width of 
                Bollinger Bands on the S&amp;P 500 is in the bottom 1% of days since 1928</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140728.pdf')">
                07/28/14</a>......The S&amp;P 500 has out-performed the NYSE advance/decline line by 
                10% over the past year, a negative (but not bad) divergence</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140725.pdf')">
                07/25/14</a>......Options traders in the S&amp;P 500 and S&amp;P 100 have open interest 
                in put options relative to call options of more than 2-to-1</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140724.pdf')">
                07/24/14</a>......More individual investors (via AAII) expect stocks to decline 
                than rise despite a 52-week high in the S&amp;P 500</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140723.pdf')">
                07/23/14</a>......Fewer than half of stocks in the S&amp;P 500 are hitting new 
                52-week highs than were doing so in early June, a sharp negative divergence&nbsp;
                </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140722.pdf')">
                07/22/14</a>......Smart money commercial hedgers in the grains (corn, soybeans, 
                wheat) are near a record net long position</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140721.pdf')">
                07/21/14</a>......High yield bonds have started to falter, while stocks are 
                hitting new highs, a negative divergence that hasn't been very negative</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140718.pdf')">
                07/18/14</a>......Commercial hedgers in the Euro have established a huge long 
                position, but other sentiment data is not confirming an extreme</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140717.pdf')">
                07/17/14</a>......The S&amp;P 500 ended its streak of 50 days without a 1% daily 
                move with a down day, a bad sign in the past</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140716.pdf')">
                07/16/14</a>......The McClellan Oscillator is diverging negatively with the S&amp;P, 
                one of the worst in history, but it has not been a consistent signal</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140715.pdf')">
                07/15/14</a>......Federal Reserve Chairwoman Yellen had her "Greenspan" moment 
                today in reference to market valuations</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140714.pdf')">
                07/14/14</a>......Optimism toward the Canada fund (EWC) has reached one of its 
                highest levels in nearly a decade</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140711.pdf')">
                07/11/14</a>......Wall Street analysts are increasing the number of companies 
                their raising price targets on versus those they're lowering</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140710.pdf')">
                07/10/14</a>......A record amount of IPOs have been backed by private 
                equity and venture capital firms, which are selling or exiting completely</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140709.pdf')">
                07/09/14</a>......Short interest as a percentage of total U.S. stock 
                market value is the lowest since 2006, but high dating back further</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140708.pdf')">
                07/08/14</a>......The VXO volatility index has jumped 10% on consecutive 
                days, coming off of a 52-week low</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140707.pdf')">
                07/07/14</a>......Stocks have been hitting 52-week highs right before 2nd 
                quarter earnings season, which has caused some troubles</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140703.pdf')">
                07/03/14</a>......The S&amp;P 500 closed at a 52-week high ahead of 
                Independence Day, its 11th pre-holiday new high of the bull market</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140702.pdf')">
                07/02/14</a>......The NYSE Up Issues Ratio was only 38%, among the 
                worst-ever breadth on a day the S&amp;P 500 hit a 52-week high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140701.pdf')">
                07/01/14</a>......The carry trade is becoming more popular, and has 
                over-performed Libor, but has recently started weakening</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140630.pdf')">
                06/30/14</a>......Stocks have risen for six straight quarters, with a
                5-year high, the 11th time they've shown such momentum</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140627.pdf')">
                06/27/14</a>......The VIX is overpriced according to historical, realized
                volatility but it should still rise; hedgers are long grains (corn, soybeans, 
                wheat)</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140626.pdf')">
                06/26/14</a>......Volume has dried up in inverse and leveraged long ETFs,
                even as a percentage of total volume</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140625.pdf')">
                06/25/14</a>......Rydex mutual fund traders bought the dip on Tuesday,
                pushing the Bull/Bear Ratio near an all-time high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140624.pdf')">
                06/24/14</a>......Stocks suffered a key reversal day, as the S&amp;P 500
                reached a 52-week high, then closed below three prior lows</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140623.pdf')">
                06/23/14</a>......The two-day range in the S&amp;P 500 is one of the lowest
                in history, compared to its average</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140620.pdf')">
                06/20/14</a>......Traders on the S&amp;P 500 are holding 200 put options in
                open interest for every 100 call options</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140619.pdf')">
                06/19/14</a>......Over the past month, the Closing Price Oscillator has
                averaged one of its most extreme readings in 30 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140618.pdf')">
                06/18/14</a>......A ratio of the SKEW to VIX shows that the value of a
                "black swan" event (swift, sharp correction) is the 3rd-cheapest since 1990</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140617.pdf')">
                06/17/14</a>......Two months without a 1% move, and a 4% rally in the
                meantime; wheat public opinion nears all-time low</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140616.pdf')">
                06/16/14</a>......The spread between Smart Money and Dumb Money
                Confidence is at its 3rd-worst in two years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140613.pdf')">
                06/13/14</a>......Emerging market sentiment has not eclipsed previous
                optimistic extremes, but it has been high for two months</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140612.pdf')">
                06/12/14</a>......Crude oil and the Dow Jones Transportation Index have
                rallied to nine-month highs in quick succession</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140611.pdf')">
                06/11/14</a>......The S&amp;P 500 is close to meeting Wall Street
                strategists' year-end estimates after 23 weeks of being "undervalued"</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140610.pdf')">
                06/10/14</a>......The S&amp;P 500 has gone 37 days without a 1% daily move,
                the 2nd-longest low-volatility streak in 15 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140609.pdf')">
                06/09/14</a>......Short interest in the S&amp;P 500 fund, SPY, is at 29% of
                shares outstanding, well below prior extremes</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140606.pdf')">
                06/06/14</a>......Penny stock volume fell in May, and is more than 75%
                below the level of three months ago</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140605.pdf')">
                06/05/14</a>......Three new low-volatility funds are being introduced,
                but past low-vol fund inceptions haven't led to higher volatility; silver poised 
                to rally</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140604.pdf')">
                06/04/14</a>......The S&amp;P 500 has closed near the top of its intraday
                range for the past two weeks, moving a Price Oscillator to near a record high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140603.pdf')">
                06/03/14</a>......Assets in equity mutual funds and ETFs have eclipsed
                safe money market assets by a ratio of 4-to-1</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140602.pdf')">
                06/02/14</a>......The S&amp;P 500 has elevated above its 30-day Bollinger
                Band for the past 5 days</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140530.pdf')">
                05/30/14</a>......Rydex mutual fund traders are switching non-leveraged
                funds for leveraged ones; 5-Year Treasury Note speculators cover some shorts</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140529.pdf')">
                05/29/14</a>......Volatility in stocks, bonds, currencies, oil and gold
                has collapsed at the same time Risk Appetite reaches an extreme high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140528.pdf')">
                05/28/14</a>......Stocks and bonds are hitting 200-day highs at the same
                time, which begs the question about which is the "smart money"</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140527.pdf')">
                05/27/14</a>......Among the four major equity indexes, the S&amp;P 500 is the
                only one trading at new 52-week highs, another divergence</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140523.pdf')">
                05/23/14</a>......The S&amp;P 500 closed at a 52-week high along with only 23
                component stocks, and low pre-holiday volume</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140522.pdf')">
                05/22/14</a>......Economic reports have been better than expected, and
                the Citigroup Economic Surprise Index has moved into positive territory</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140521.pdf')">
                05/21/14</a>......The VIX fear gauge has been below 15 for a month, and
                is well below its 50- and 200-day moving averages</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140520.pdf')">
                05/20/14</a>......Leveraged loan ETFs have experienced one of their
                sharpest outflows in three years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140519.pdf')">
                05/19/14</a>......Fear is cheaper than it's been in 8 years, as implied
                volatility on the VIX has fallen below previous lows</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140516.pdf')">
                05/16/14</a>......Emerging market sentiment is optimistic, and has been
                for the past month, nearing other extremes in the past four years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140515.pdf')">
                05/15/14</a>......Risk Appetite recently recorded one of its highest
                readings in 16 years as volatility ebbed and credit spreads tightened</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140514.pdf')">
                05/14/14</a>......A risk gauge created by asset manager BlackRock has hit
                its highest level of the bull market</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140513.pdf')">
                05/13/14</a>......The S&amp;P has been persistently under-valued according to
                Wall Street strategists; gasoline sentiment has declined</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140512.pdf')">
                05/12/14</a>......The Russell 2000 and Nasdaq are 5% below their 52-week
                highs despite the new high in the S&amp;P 500, another divergence</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140509.pdf')">
                05/09/14</a>......The S&amp;P 500 has been stuck in a 1.5% range, while
                sitting near a 52-week high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140508.pdf')">
                05/08/14</a>......The ratio of the Russell 2000 to the S&amp;P 500 has fallen
                to a one-year low, while the S&amp;P is near a high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140507.pdf')">
                05/07/14</a>......Assets in the Rydex Technology fund have plummeted by
                50% in the past 30 days</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140506.pdf')">
                05/06/14</a>......Penny stock volume plummeted in April, with the largest
                one-month drop in transactions in history; US dollar sentiment declines</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140505.pdf')">
                05/05/14</a>......Options traders have built a large call open interest
                in the VIX, usually resulting in a spike in volatility</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140502.pdf')">
                05/02/14</a>......When the Nonfarm Payroll report is better than
                expected, stocks have tended to struggle</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140501.pdf')">
                05/01/14</a>......Margin debt contracted in March, but needs to keep
                contracting in order to become market-negative</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140430.pdf')">
                04/30/14</a>......The large-cap DJIA reached a 52-week high, but the
                small-cap Russell 2000 is more than 6% below its own high, a negative divergence
                </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140429.pdf')">
                04/29/14</a>......Mergers are increasingly stock versus cash, and nearly
                all are at a high valuation; British pound sentiment is nearing a 24-year high
                </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140428.pdf')">
                04/28/14</a>......The Barron's Big Money Poll shows a continued level of
                near-record optimism among money managers </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140425.pdf')">
                04/25/14</a>......Utilities sector sentiment nears a decade-long
                optimistic extreme; gasoline hedgers establish near-record short positions
                </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140424.pdf')">
                04/24/14</a>......Mom and pop have returned, as Daily Average Revenue
                Trades (DARTs) have soared relative to total market volume </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140423.pdf')">
                04/23/14</a>......Bubble mentions in the news have dropped off
                dramatically, contrary to what many think </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140422.pdf')">
                04/22/14</a>......Stocks have shown a burst of momentum, with consecutive
                gains from a one-month low; gold sentiment sours a bit </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140421.pdf')">
                04/21/14</a>......Hedgers in equity index futures have covered a large
                number of short positions in the past six weeks </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140417.pdf')">
                04/17/14</a>......The Nasdaq Composite has neared its first 10%
                correction in more than a year, with still-optimistic sentiment </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140416.pdf')">
                04/16/14</a>......The percentage of IPOs announced over the past three
                months that are losing money is very near a 25-year record </p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140415.pdf')">
                04/15/14</a>......Seasonal weakness will arrive in early May, but the
                worst of it is fairly short-lived and it becomes exceptionally positive this 
                fall</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140414.pdf')">
                04/14/14</a>......The Russell 2000 index of small cap stocks is close to
                closing below its 200-day average for the first time in years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140411.pdf')">
                04/11/14</a>......Biotechnology stocks have not been able to rally from
                extreme pessimism, and have now violated their 200-day average</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140410.pdf')">
                04/10/14</a>......The S&amp;P 500 has suffered 3 declines of more than -1% in
                the past 7 days, while setting a new 52-week high as well</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140409.pdf')">
                04/09/14</a>......With tax day looming, stocks have usually dropped after
                big up years, and even more so in the six months following</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140408.pdf')">
                04/08/14</a>......Shares outstanding in short-term VIX funds have jumped
                in the past two weeks</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140407.pdf')">
                04/07/14</a>......Penny stock transactions jumped higher in March, the
                highest recorded since October 2007</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140404.pdf')">
                04/04/14</a>......The Nasdaq Composite has closed below its 100-day
                average for the first time in more than 300 days</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140403.pdf')">
                04/03/14</a>......The S&amp;P 500 is near a high, with Utilities up 2% in the
                past month, and despite the Nasdaq, down 2% in a negative divergence</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140402.pdf')">
                04/02/14</a>......Fewer than 8% of S&amp;P 500 components closed at a 52-week
                high along with the index itself</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140401.pdf')">
                04/01/14</a>......Emerging market sentiment rebounds; Canadian dollar
                pessimism leads to a bear trap</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140331.pdf')">
                03/31/14</a>......Growth in the ratio of debt-to-cash in investors'
                accounts highlights the danger of high margin debt</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140328.pdf')">
                03/28/14</a>......Biotechnology sentiment is pessimistic, and returns
                should give a heads-up about a bubble; 5-Year Treasury Note sentiment is extreme</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140327.pdf')">
                03/27/14</a>......The Nasdaq 100 has dropped below its 50-day average
                while the S&amp;P has not, and both are well above their 200-days</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140326.pdf')">
                03/26/14</a>......Covenant-lite loan issuance has exploded during the
                past month, exceeding anything we've seen in 15 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140325.pdf')">
                03/25/14</a>......Cash sitting in "mom and pop" money market funds has
                dipped to a 30-year low relative to stocks; coffee sentiment backs off extreme</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140324.pdf')">
                03/24/14</a>......Nasdaq vs NYSE exchange volume shows prolonged
                speculative activity</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140321.pdf')">
                03/21/14</a>......Gold has enjoyed a "golden cross" as its 50-day average
                rises above the 200-day; copper's smart money looks bullish</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140320.pdf')">
                03/20/14</a>......Worse-than-expected economic data, as shown by the
                Citigroup Economic Surprise Index, has not put a dent in stocks' rise</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140319.pdf')">
                03/19/14</a>......Sentiment toward Mexican stocks is not as pessimistic
                as positions in peso futures would suggest</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140318.pdf')">
                03/18/14</a>......We look at the 20 largest non-U.S. companies to list on
                a U.S. exchange; U.S. dollar sentiment nears a four-year extreme</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140317.pdf')">
                03/17/14</a>......A large share of recent IPOs have been backed by
                Private Equity and Venture Capital firms</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140314.pdf')">
                03/14/14</a>......Rydex mutual fund traders bought the dip on Thursday,
                adding long exposure in a down market; gold sentiment nears two-year high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140313.pdf')">
                03/13/14</a>......Biotechnology firms have been a popular target for
                IPOs, many of which have been money-losers</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140312.pdf')">
                03/12/14</a>......Assets in inverse funds have plummeted since 2010, and
                now make up less than 1% of total broad-based ETF assets</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140311.pdf')">
                03/11/14</a>......The value of trading in penny stocks jumped higher on
                Tuesday due to Fannie and Freddie; coffee sentiment and rate of change</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140310.pdf')">
                03/10/14</a>......Sentiment toward Chinese stocks has not reached the
                types of extremes seen at other lows in the past five years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140307.pdf')">
                03/07/14</a>......Nearly 75% of IPOs during the past six months have been
                money-losers; commodity speculators reach record exposure</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140306.pdf')">
                03/06/14</a>......Penny stock (OTC) trading volume exploded higher in
                February</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140305.pdf')">
                03/05/14</a>......Traders in the ProShares biotechnology ETFs are showing
                short-term pessimism as assets flow into the inverse fund</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140304.pdf')">
                03/04/14</a>......The Russell 2000 led a "triple index breakout" with the
                S&amp;P 500 and Nasdaq Composite; high long-term optimism on British pound</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140303.pdf')">
                03/03/14</a>......Leveraged loan issuance has gone parabolic, as
                investors give money to the most speculative issues</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140228.pdf')">
                02/28/14</a>......Health care stocks gather interest from traders in the
                ProShares and Rydex funds; COW trouble as speculators jump in</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140227.pdf')">
                02/27/14</a>......Few bears are present among respondents in the AAII and
                Investor's Intelligence sentiment surveys</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140226.pdf')">
                02/26/14</a>......Small-cap stocks have enjoyed great momentum, with 12
                up days out of 14 sessions, and a new 52-week high</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140225.pdf')">
                02/25/14</a>......The Smart Money Index shows early buying and late
                selling pressure; hog sentiment a warning for COW; coffee sentiment soars</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140224.pdf')">
                02/24/14</a>......The S&amp;P 500 has reversed to a 52-week high within 3
                weeks of closing at a 3-month low</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140221.pdf')">
                02/21/14</a>......Investors have returned to E-Trade, with DARTs surging
                in January; gold and silver sentiment has jumped</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140220.pdf')">
                02/20/14</a>......Traders in penny stocks have been ramping up their
                speculative activity over the past two weeks</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140219.pdf')">
                02/19/14</a>......Stocks have registered a breadth thrust, as the 10-day
                Up Issues Ratio has gone from oversold to overbought within two weeks</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140218.pdf')">
                02/18/14</a>......The Nasdaq Composite has climbed 8 days with a 5% gain
                to a new high, good momentum; gold crosses above 200-day; wheat recovers</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140214.pdf')">
                02/14/14</a>......Gauging the probability of the last two weeks' momentum
                to continue as the S&amp;P rallies off of an intermediate-term bull market low</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140213.pdf')">
                02/13/14</a>......All but one member of the Dow Jones Industrial Average
                has closed above its 10-day average, but most haven't eclipsed the 50-day</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140212.pdf')">
                02/12/14</a>......The Dow Jones Industrial Average was the first of four
                major indexes to peak, while the Nasdaq has held strong</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140211.pdf')">
                02/11/14</a>......Nearly 90% of S&amp;P 500 stocks are above their 10-day
                average, but fewer than 55% are above their 50-day average</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140210.pdf')">
                02/10/14</a>......Options traders on the VIX have ramped up their put
                trading, betting on a decline in volatility</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140207.pdf')">
                02/07/14</a>......The S&amp;P 500 put in its best 2-day performance in 3
                months, after diving to a 3-month low a few days ago</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140206.pdf')">
                02/06/14</a>......Liquidity in the SPY and QQQ funds have become an
                attractive feature for investors over the past two weeks</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140205.pdf')">
                02/05/14</a>......Volume in speculative penny stocks skyrocketed in
                January, normally a warning sign, but much of it was due to one stock</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140204.pdf')">
                02/04/14</a>......Wall Street strategists haven't yet adjusted their
                year-end consensus price target for the S&amp;P 500, sending it into undervalued 
                territory</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140203.pdf')">
                02/03/14</a>......The S&amp;P has finally suffered a 5% pullback from a
                multi-year high, and erased three months of gains, all in a short time span</p><p style="margin-top: 0; margin-bottom: 0" align="right">
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140131.pdf')">
                01/31/14</a>......Sponsors of inverse ETFs have been on a spree of
                reverse splits, a ploy to raise share prices</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140130.pdf')">
                01/30/14</a>......Risk Appetite has collapsed over the past two weeks as
                risk-on switched to risk-off among investors</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140129.pdf')">
                01/29/14</a>......Traders didn't take kindly to the Federal Reserve
                statement on interest rates, sending the S&amp;P 500 to a 1% loss</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140128.pdf')">
                01/28/14</a>......Fund flows in Indian shares show a clear divergence
                between institutional versus mom and pop investors</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140127.pdf')">
                01/27/14</a>......Emerging market sentiment has soured, but is still well
                above pessimistic extremes seen during past years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140124.pdf')">
                01/24/14</a>......The Dow Jones Transportation Average suffered a 4%
                decline from a 52-week high, a mark of major peaks in the past</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140123.pdf')">
                01/23/14</a>......Stocks have suffered 10 price rejections from a high
                over the past year, the most in history</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140122.pdf')">
                01/22/14</a>......According to the Federal Reserve, stresses on the
                financial system are the lowest in at least 40 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140121.pdf')">
                01/21/14</a>......The biotech sector has been outperforming and sentiment
                is understandably optimistic</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140117.pdf')">
                01/17/14</a>......Buying climaxes in the S&amp;P 500 have surged again</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140116.pdf')">
                01/16/14</a>......Sentiment toward crude oil and energy stocks is near
                the most pessimistic in a decade</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140115.pdf')">
                01/15/14</a>......With the S&amp;P 500 at a high, there is a negative
                divergence with the percentage of components above their 50-day and 200-day 
                averages</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140114.pdf')">
                01/14/14</a>......Strategists on Wall Street have upped their S&amp;P 500
                price target, but not before the index got historically overvalued in December</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140113.pdf')">
                01/13/14</a>......The S&amp;P's decline from near a high was unusually large</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140110.pdf')">
                01/10/14</a>......The VIX Put/Call Open Interest Ratio is showing many
                more call options than puts, suggesting a rise in volatility</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140109.pdf')">
                01/09/14</a>......Wall Street analysts have raised price targets on many
                more stocks than they've lowered</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140108.html')">
                01/08/14</a>......The Equity Hedging Index is showing that traders have
                never had fewer hedges over a four-week period</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140107.html')">
                01/07/14</a>......Traders focused in the OTC penny stock market still
                aren't showing signs of excessive speculation</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140106.html')">
                01/06/14</a>......Mutual fund managers focused on value are carrying
                their lowest stock exposure in at least 14 years</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140103.html')">
                01/03/14</a>......The 10-day Total Put/Call Ratio is more than 20% below
                its 200-day average</p>
                <p><a  :href="url_for('user.download_file', filename='2014/sentiment_report_20140102.html')">
                01/02/14</a>......Dumb Money Confidence has surged in the past few days</p>
               </div>
               </div>

               <!-- Archives Sidebar -->
               <div class="col-md-3 well">
                 <div style="text-align: center;">
                   <h3>Archives by Year</h3>
                 </div>

                 <a
                   v-for="year in archiveYears"
                   :key="year"
                   :href="`/MR/${year <= 2019 ? 'old_' : ''}archived_reports/${year}`"
                   class="btn blue btn-block"
                 >
                   {{ year }} Archives
                 </a>
               </div>
               <hr>
                  </div>
            </div>
         </div>
             </div>
           </div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>

export default {
 name: 'ReportArchives',
 data() {
   return {
     archiveYears: [
      2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012
     ],
     dailyReportBlogs: [
        {
          date: "12/31/14",
          filename: "2014/sentiment_report_20141231.pdf",
          description: "Emerging Markets have held off the collapse in crude oil, despite a usually high correlation",
        },
        {
          date: "12/30/14",
          filename: "2014/sentiment_report_20141230.pdf",
          description: "Financial stress has risen according to regional Federal Reserve banks, unusual since stocks are sitting at new highs",
        },
        {
          date: "12/29/14",
          filename: "2014/sentiment_report_20141229.pdf",
          description: "Heading into the New Year, it's usually best to look for investments that have either modestly positive or extremely pessimistic sentiment",
        },
        {
          date: "12/26/14",
          filename: "2014/sentiment_report_20141226.pdf",
          description: "The small-cap Russell 2000 index has closed at its first 3-year high for the first time in more than six months",
        },
        {
          date: "12/24/14",
          filename: "2014/sentiment_report_20141224.pdf",
          description: "With traders leaving for the holidays, volume in SPY sunk to its lowest level in five years, leading to no movement of note in our indicators",
        },
        {
          date: "12/23/14",
          filename: "2014/sentiment_report_20141223.pdf",
          description: "Over the past several days, traders have rushed into S&P 500 ETFs, pushing the four-day inflow to the highest in four years",
        },
        {
          date: "12/22/14",
          filename: "2014/sentiment_report_20141222.pdf",
          description: "Equity mutual funds have suffered their worst outflow since 2011 over the past four weeks, even accounting for seasonality",
        }
     ]
   };
 },
 methods: {
   url_for(_, filename) {
    return `https://users.sentimentrader.com/users/report/${filename}`
   }
 },
};
</script>

<style scoped>
/* 自定义样式 */
.well {
 background-color: #eee;
 border: 0;
 box-shadow: none;
}
.well {
 min-height: 20px;
 padding: 19px;
 margin-bottom: 20px;
 border-radius: 4px;
}
.well a {
 margin: 4px 0;
}
.blue.btn {
 color: #fff;
 background-color: #4b8df8;
}
.btn-block {
 display: block;
 width: 100%;
 padding-left: 0;
 padding-right: 0;
}
.btn {
 border-width: 0;
 padding: 7px 14px;
 font-size: 14px;
 outline: 0;
 background-image: none;
 filter: none;
 box-shadow: none;
 text-shadow: none;
}
.page-head {
  padding-top: 0px;
}
</style>