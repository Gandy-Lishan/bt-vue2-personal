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
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131231.pdf')">
                12/31/13</a>......Stock mutual funds have taken in the most money since
                2006, but it's still not truly extreme on a long-term basis</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131230.pdf')">
                12/30/13</a>......Rydex mutual fund traders have gone parabolic in their
                optimism as bullish assets soar relative to inverse assets</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131227.pdf')">
                12/27/13</a>......Seasonality in 2014 is slated to be about the same as
                this year, with a soft spot in the middle</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131226.pdf')">
                12/26/13</a>......The S&amp;P 500 is on track to close the year at a 12-month
                high and more than 10% above its 12-month average</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131224.pdf')">
                12/24/13</a>......Rydex mutual fund traders move to a new level of
                bullishness</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131223.pdf')">
                12/23/13</a>......Margin debt has climbed to a new high, but its growth
                is barely keeping up with the S&amp;P 500</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131220.pdf')">
                12/20/13</a>......Retail (mom and pop) money market funds can now only
                buy 2.9% of the total U.S. stock market</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131219.pdf')">
                12/19/13</a>......Short interest in component stocks in the Nasdaq 100 is
                near a multi-year high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131218.pdf')">
                12/18/13</a>......The S&amp;P 500 jumped more than 1% to a 52-week high on a
                FOMC Fed Day</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131217.pdf')">
                12/17/13</a>......Silver traders and investors have seemingly given up on
                the metal with sentiment nearing 20-year lows</p>

                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131216.pdf')">
                12/16/13</a>......Large options traders have spent more than 35% of their
                volume buying call options during the past 4 weeks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131213.pdf')">
                12/13/13</a>......Sentiment toward bonds has soured, and the Bond
                Indicator Score is now showing the most pessimism since 2006</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131212.pdf')">
                12/12/13</a>......Short-term volatility expectations are rising versus
                longer-term expectations via VIX futures</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131211.pdf')">
                12/11/13</a>......Optimism among newsletters is at its highest level
                since 1987, likely ending the year above 75%</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131210.pdf')">
                12/10/13</a>......The BlackRock risk gauge has reached its most extreme
                level since 2007</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131209.pdf')">
                12/09/13</a>......The McClellan Oscillator and Summation Index are
                lagging badly, diverging with highs in the S&amp;P 500</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131206.pdf')">
                12/06/13</a>......Stocks reacted positively to the Nonfarm Payroll
                report, even though sentiment is already stretched</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131205.pdf')">
                12/05/13</a>......Fear has risen lately, as the VIX is above 15% for the
                first time in 30 days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131204.pdf')">
                12/04/13</a>......The ratio of assets in equity mutual funds and ETFs to
                money market funds has hit a 30-year record high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131203.pdf')">
                12/03/13</a>......Traders in the Rydex family of mutual funds have
                ratcheted up their exposure, now holding 5 times more assets in bull index funds</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131202.pdf')">
                12/02/13</a>......According to NAAIM, active investment managers have
                never been this exposed to stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131129.pdf')">
                11/29/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131127.pdf')">
                11/27/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131126.pdf')">
                11/26/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131125.pdf')">
                11/25/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131122.pdf')">
                11/22/13</a>......Wall Street strategists' price targets for the S&amp;P 500
                haven't kept up to the index, leading to extreme "overvaluation"</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131121.pdf')">
                11/21/13</a>......New 52-week highs among S&amp;P 500 component stocks is
                less than half previous peaks in recent months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131120.pdf')">
                11/20/13</a>......There have been 4 outside reversal down days during the
                past three weeks in SPY</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131119.pdf')">
                11/19/13</a>......A four-week average of the Options Speculation Index
                shows the 3rd-highest amount of speculation in 10 years</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131118.pdf')">
                11/18/13</a>......The DJIA is close to surmounting another round number
                at 16,000, one of the faster round-number rallies in its history</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131115.pdf')">
                11/15/13</a>......Stocks returned more than 8% during earnings season, a
                much stronger than average performance</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131114.pdf')">
                11/14/13</a>......More than 22% of component stocks in the S&amp;P 500
                reached a 52-week high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131113.pdf')">
                11/13/13</a>......Trading in SPY options is unusual, with a high put/call
                ratio but low skew level</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131112.pdf')">
                11/12/13</a>......The Stock / Bond Ratio has neared 3 standard deviations
                beyond normal</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131111.pdf')">
                11/11/13</a>......The Equity Hedging Index is showing a broad lack of
                hedging activity, nearly the lowest in four years</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131108.pdf')">
                11/08/13</a>......Buying climaxes among S&amp;P 500 stocks have spiked higher
                over the past three weeks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131107.pdf')">
                11/07/13</a>......Speculative activity in the Nasdaq 100 is evident in
                Rydex asset flows, the Liquidity Premium and speculators' futures positions</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131106.pdf')">
                11/06/13</a>......The spread between Smart Money and Dumb Money
                Confidence has hit an extreme of overconfidence</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131105.pdf')">
                11/05/13</a>......Penny stock traders in the OTC market picked up their
                speculative activity in October, but it remains historically low</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131104.pdf')">
                11/04/13</a>......Money market assets in the Rydex family of mutual funds
                have dropped to a 12-year low relative to total assets</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131101.pdf')">
                11/01/13</a>......An indicator that combines newsletter sentiment is
                showing its most optimistic extreme ever</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131031.pdf')">
                10/31/13</a>......Active investment managers, per NAAIM, are as exposed
                to stocks as they've ever been, and they're confident about it</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131030.pdf')">
                10/30/13</a>......Rydex traders have broadened their bullish bets across
                all of the major indexes</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131029.pdf')">
                10/29/13</a>......A one-month average of the Price Oscillator has reached
                a rare extreme, showing possibly exhausted buying pressure</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131028.pdf')">
                10/28/13</a>......The S&amp;P 500 has gone 13 days above its 5-day moving
                average and 237 days above its 200-day average</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131025.pdf')">
                10/25/13</a>......Short-term price/volume patterns remain weak</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131024.pdf')">
                10/24/13</a>......Rydex mutual fund traders have ramped up speculative
                bets in the leveraged bull/bear ratio</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131023.pdf')">
                10/23/13</a>......A long-term look at sentiment from newsletter writers
                is showing extreme optimism</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131022.pdf')">
                10/22/13</a>......The CBOE SKEW Index has doubled since July, showing
                increased risk of a black swan event</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131021.pdf')">
                10/21/13</a>......Margin debt climbed again, and investors' net worth
                (available cash) shrunk to its smallest level since 2000</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131018.pdf')">
                10/18/13</a>......The ratio of VIX to VXV shows that options traders have
                suddenly become much less concerned about an imminent pullback</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131017.pdf')">
                10/17/13</a>......NYSE breadth scored a "double double" with up issues
                and up volume being above 75% for two straight days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131016.pdf')">
                10/16/13</a>......Breadth on the NYSE has been especially volatile, with
                7 out of the past 10 days showing an extreme in rising or falling issues</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131015.pdf')">
                10/15/13</a>......Volume in leveraged ETFs has jumped lately, near the
                highest level of the year, showing trader uncertainty</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131014.pdf')">
                10/14/13</a>......Penny stock traders in the OTC market continue to
                decrease their activity</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131011.pdf')">
                10/11/13</a>......Traders aren't showing much belief in this short-term
                rally, as assets in the inverse Rydex Nasdaq 100 fund have ballooned</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131010.pdf')">
                10/10/13</a>......Stocks have rallied in spite of exceedingly low
                approval of politicians, in particular the President, which isn't unusual</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131009.pdf')">
                10/09/13</a>......The Dow Jones Industrial Average is close to violating
                its 200-day average for the first time all year</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131008.pdf')">
                10/08/13</a>......The ratio of VIX to VXX shows that options traders are
                pricing in more of a chance of a quick short-term rise in volatility</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131007.pdf')">
                10/07/13</a>......When the stock of auction house Sotheby's has gained or
                lost 50% in a year, it has been an inconsistent indicator of bubbles in stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131004.pdf')">
                10/04/13</a>......Companies have been issuing many more negative outlooks
                than positive ones, to one of the largest degrees in a decade</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131003.pdf')">
                10/03/13</a>......The S&amp;P 500 has declined for 9 out of 11 sessions
                following its 52-week high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131002.pdf')">
                10/02/13</a>......Sentiment on J.C. Penney has soured to among its lowest
                levels in two years</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20131001.pdf')">
                10/01/13</a>......Wall Street analysts have quickly retreated from
                raising price targets on S&amp;P 500 stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130930.pdf')">
                09/30/13</a>......Mutual funds have taken in more than $100 billion so
                far this year, with 8 straight months of inflows</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130927.pdf')">
                09/27/13</a>......Smart money commercial hedgers have rapidly increased
                short positions against the Nasdaq 100</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130926.pdf')">
                09/26/13</a>......A federal government shutdown has not had much of an
                impact in the past on stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130925.pdf')">
                09/25/13</a>......The S&amp;P 500 has suffered a 5-day losing streak, coming
                on the heels of a 52-week high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130924.pdf')">
                09/24/13</a>......Rydex mutual fund traders are again shunning the safety
                of the money market fund</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130923.pdf')">
                09/23/13</a>......Wall Street strategists' price target for the S&amp;P 500
                is showing that the index is slightly overvalued</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130920.pdf')">
                09/20/13</a>......Flows into equity mutual funds and ETFs have now set
                decade-long records</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130919.pdf')">
                09/19/13</a>......Volume in leveraged index ETFs has collapsed relative
                to NYSE composite volume</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130918.pdf')">
                09/18/13</a>......Previous post-FOMC thrusts to new highs have preceded
                corrections</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130917.pdf')">
                09/17/13</a>......The S&amp;P 500 hasn't pulled back during the first two
                weeks of September, a good sign for the fourth quarter</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130916.pdf')">
                09/16/13</a>......Failed breakouts in the S&amp;P 500 have led to
                inconsistent forward results</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130913.pdf')">
                09/13/13</a>......Speculators in Treasury bond futures have pressed their
                short bets, nearly to all-time extremes</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130912.pdf')">
                09/12/13</a>......Risk Appetite has doubled in the past week and a half</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130911.pdf')">
                09/11/13</a>......The S&amp;P 500 is up 7 straight days, coming out of a bull
                market pullback</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130910.pdf')">
                09/10/13</a>......Changes in the Dow Jones Industrial Average component
                stocks have often triggered shorter-term pullbacks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130909.pdf')">
                09/09/13</a>......The St Louis Fed Financial Stress Index is showing that
                investors are calm, but not complacent</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130906.pdf')">
                09/06/13</a>......Traders have seemingly given up on the REIT industry as
                assets and sentiment dwindle toward multi-year lows</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130905.pdf')">
                09/05/13</a>......Penny stock traders in the OTC market slowed their
                activity again in August</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130904.pdf')">
                09/04/13</a>......Assets in high-yield bond ETFs are near record levels
                compared to assets in investment-grade bond ETFs</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130903.pdf')">
                09/03/13</a>......Wall Street analysts have been lowering their price
                targets on stocks more than they've been raising them</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130830.pdf')">
                08/30/13</a>......The ratio of equity mutual fund and ETF assets to money
                market assets has reached a new 30-year record high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130829.pdf')">
                08/29/13</a>......Sentiment surveys have been showing decreased
                bullishness, but they're not yet showing "bull market bearishness"</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130828.pdf')">
                08/28/13</a>......Crude oil has jumped in both the short- and
                intermediate-term, often a negative sign for stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130827.pdf')">
                08/27/13</a>......The VIX "fear gauge" is showing nearly 3 call option
                contracts outstanding for every 1 put option</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130826.pdf')">
                08/26/13</a>......The Total Put/Call Ratio has gone 32 trading days
                without spiking above 1.0</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130823.pdf')">
                08/23/13</a>......Active investment managers, per NAAIM, have greatly
                pared back their exposure to stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130822.pdf')">
                08/22/13</a>......Breadth, via the NYSE Up Issues Ratio, has been below
                30% or above 70% for the past four days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130821.pdf')">
                08/21/13</a>......The Dow Jones Industrial Average has fallen six
                straight days, after hitting a new high less than three weeks ago</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130820.pdf')">
                08/20/13</a>......Sentiment toward the US dollar has soured, but still
                isn't at extreme levels</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130819.pdf')">
                08/19/13</a>......Breadth on the NYSE has cycled down to oversold after
                recently hitting a new high in the cumulative advance/decline line</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130816.pdf')">
                08/16/13</a>......Smart money commercial hedgers in DJIA and Nasdaq 100
                futures have moved to a near-record net short position</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130815.pdf')">
                08/15/13</a>......The Dow Jones Industrial Average is close to breaking
                below its 100-day average for the first time in more than 150 days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130814.pdf')">
                08/14/13</a>......Breadth has been negative over the past 10 days,
                despite a rising market and a 52-week high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130813.pdf')">
                08/13/13</a>......Rydex traders have taken enough assets out of the safe
                money market to be considered extreme</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130812.pdf')">
                08/12/13</a>......Stocks and sentiment are forming a negative divergence,
                as the Intermediate-term Indicator Score hasn't rallied</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130809.pdf')">
                08/09/13</a>......We've seen 11 Hindenburg Omen signals in 50 days, one
                of the highest concentrations in 50 years</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130808.pdf')">
                08/08/13</a>......Assets in leveraged index funds at Rydex have gone to
                the upper end of the range, showing optimism</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130807.pdf')">
                08/07/13</a>......OTC penny stock volume dropped again in July, remaining
                under the influence of Fannie Mae and Freddie Mac</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130806.pdf')">
                08/06/13</a>......The Equity Market Uncertainty Index from Stanford
                University is showing an abnormally complacent attitude towards stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130805.pdf')">
                08/05/13</a>......Options traders bet aggressively on bullish strategies
                last week</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130802.pdf')">
                08/02/13</a>......Large speculators are betting against corn prices in a
                near-record fashion</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130801.pdf')">
                08/01/13</a>......Neutral responses in the sentiment surveys have soared
                to among the highest levels in a decade</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130731.pdf')">
                07/31/13</a>......The S&amp;P 500 has been consolidating (churning) within 1%
                of a new high for the last 7 sessions</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130730.pdf')">
                07/30/13</a>......Mutual fund managers reduced their cash position in
                June, but not by much</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130729.pdf')">
                07/29/13</a>......Assets in the Rydex inverse S&amp;P 500 fund have risen
                despite the market rally</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130726.pdf')">
                07/26/13</a>......According to NAAIM, active investment managers have
                significantly increased their stock market exposure</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130725.pdf')">
                07/25/13</a>......Margin debt dipped in June, keeping investors' net
                worth, or available cash, low relative to total stock market capitalization</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130724.pdf')">
                07/24/13</a>......Volume in leveraged ETFs has shrunk to nearly its
                lowest level in four years</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130723.pdf')">
                07/23/13</a>......Options traders, via the SKEW Index, are not worried
                about a black swan event</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130722.pdf')">
                07/22/13</a>......The S&amp;P 500 has risen for 13 out of 15 days, to a new
                high, which is an unusually strong trend in momentum</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130719.pdf')">
                07/19/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130718.pdf')">
                07/18/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130717.pdf')">
                07/17/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130716.pdf')">
                07/16/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130715.pdf')">
                07/15/13</a>......There are no studies today</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130712.pdf')">
                07/12/13</a>......Over-The-Counter (OTC) penny stock volume remained much
                higher than average in June</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130711.pdf')">
                07/11/13</a>......Bullishness among individual investors according to
                AAII jumped to the highest level in more than a year</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130710.pdf')">
                07/10/13</a>......There has been a breadth surge in the Up Issues Ratio
                for the NYSE and Nasdaq exchanges, to a historic degree</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130709.pdf')">
                07/09/13</a>......The VIX fear gauge is 25% above its 52-week low,
                despite the leading Russell 2000 index reaching a 52-week high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130708.pdf')">
                07/08/13</a>......Earnings growth in the S&amp;P 500 has slowed, but
                historically that hasn't led to meaningfully poor returns</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130705.pdf')">
                07/05/13</a>......The Smart Money Index shows early buying pressure and
                late-day selling, but it shouldn't be a major concern</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130703.pdf')">
                07/03/13</a>......More than 33% of newsletters are expecting a stock
                market correction</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130702.pdf')">
                07/02/13</a>......The S&amp;P 500 has tried, and failed, to remount its
                50-day moving average for the past four days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130701.pdf')">
                07/01/13</a>......Rydex mutual fund traders have shoveled more assets
                into the safe money market fund</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130628.pdf')">
                06/28/13</a>......The Risk Appetite Index has climbed out of extreme
                risk-aversion territory</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130627.pdf')">
                06/27/13</a>......Active investment managers, per NAAIM, have greatly
                reduced their exposure to stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130626.pdf')">
                06/26/13</a>......Rydex mutual fund traders have given up in the
                leveraged Nasdaq 100 funds</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130625.pdf')">
                06/25/13</a>......Odd lot short sales, a gauge of small-trader sentiment,
                has spiked to the 2nd-highest level in 30 months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130624.pdf')">
                06/24/13</a>......We're about to see a Golden Cross in the VIX "fear
                gauge"</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130621.pdf')">
                06/21/13</a>......Rydex traders in the Nasdaq 100 fund have greatly
                decreased their optimism</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130620.pdf')">
                06/20/13</a>......The NYSE Up Issues Ratio has been under 10% on
                back-to-back days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130619.pdf')">
                06/19/13</a>......Investors in the Rydex energy mutual funds have
                seemingly abandoned the sector</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130618.pdf')">
                06/18/13</a>......There isn't anything new to report as traders await the
                Fed decision tomorrow</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130617.pdf')">
                06/17/13</a>......The S&amp;P's range over the past 10 days is more than 75%
                higher than the prior three months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130614.pdf')">
                06/14/13</a>......Small speculators in Treasury Note and Bond futures
                have reached a 6-year extreme net short position</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130613.pdf')">
                06/13/13</a>......Breadth, via the Up Issues Ratio, has abruptly switched
                from extremely oversold to extremely overbought in 3 days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130612.pdf')">
                06/12/13</a>......A composite indicator score for gold has reached
                maximum pessimism but the metal is having a hard time rallying</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130611.pdf')">
                06/11/13</a>......Assets in defensive sector funds at Rydex have declined
                from recent extremes</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130610.pdf')">
                06/10/13</a>......A tight cluster of Hindenburg Omen signals suggests the
                likelihood of weakness over the next several months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130607.pdf')">
                06/07/13</a>......The Risk Appetite Index has cycled down into
                "risk-averse" territory for the first time in a year</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130606.pdf')">
                06/06/13</a>......After becoming extremely oversold, breadth via the Up
                Issues Ratio surged to its highest level in over a month</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130605.pdf')">
                06/05/13</a>......Over-The-Counter (OTC) penny stock dollar volume has exploded
                higher, to a new record relative to the Nasdaq Composite</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130604.pdf')">
                06/04/13</a>......Breadth, according to the Up Issues Ratio, has become
                oversold soon after the S&amp;P 500 hit a 52-week high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130603.pdf')">
                06/03/13</a>......The MOVE Index of bond option implied volatility has
                soared well above the VIX "fear gauge" for stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130531.pdf')">
                05/31/13</a>......Smart money commercial hedgers in DJIA and Nasdaq 100
                futures have moved to a record net short position</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130530.pdf')">
                05/30/13</a>......Both the US dollar and S&amp;P 500 have recently hit
                52-week highs, but now the dollar has suffered its worst 2-day loss in nearly a 
                year</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130529.pdf')">
                05/29/13</a>......The CS Fear Barometer and CBOE Skew Index are
                suggesting low risk for equities, but that's odd given historical patterns</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130528.pdf')">
                05/28/13</a>......The number of stock splits in the S&amp;P 500 and Nasdaq
                Composite is nowhere near past peaks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130524.pdf')">
                05/24/13</a>......NYSE margin debt continues to rise, pushing investors'
                net worth, or available cash, to an extreme seen only in the year 2000</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130523.pdf')">
                05/23/13</a>......Rydex mutual fund traders now have more than 5 times
                worth of assets in bullish index funds than bearish (inverse) ones</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130522.pdf')">
                05/22/13</a>......The OEX put/call ratio and open interest ratio are
                unusually low, showing that "smart money" is potentially bullish on stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130521.pdf')">
                05/21/13</a>......A long-term Price Oscillator on the S&amp;P 500 has reached
                a historic extreme; five of six prior instances led to corrections</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130520.pdf')">
                05/20/13</a>......Tech IPOs that have returned 50% or more on their first
                day have spelled trouble for the market over the past decade</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130517.pdf')">
                05/17/13</a>......Lumber futures have tumbled 20% in two months, while
                the S&amp;P 500 sits at a new high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130516.pdf')">
                05/16/13</a>......New 52-week highs on the NYSE have been historically
                high...for four months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130515.pdf')">
                05/15/13</a>......The Stock / Bond Ratio has surged above 3</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130514.pdf')">
                05/14/13</a>......Rydex mutual fund traders have stashed nearly 5 times
                the assets in bullish index funds than bearish ones</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130513.pdf')">
                05/13/13</a>......Stocks and 10-Year Treasury Note yields have both
                rallied over the past two weeks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130510.pdf')">
                05/10/13</a>......Small speculators in precious metals (gold, silver,
                copper, platinum, palladium) have gone net short for first time since 1990</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130509.pdf')">
                05/09/13</a>......The Bull Ratio in the AAII survey of individual
                investors has rebounded 30% in only four weeks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130508.pdf')">
                05/08/13</a>......The McClellan Oscillator and Summation Index are both
                overbought, a sign of impressive momentum</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130507.pdf')">
                05/07/13</a>......There hasn't been
                too much of a change in our sentiment indicators</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130506.pdf')">
                05/06/13</a>......Over-The-Counter (OTC) 
                penny stock volume showed another speculative rise in April</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130503.pdf')">
                05/03/13</a>......The Dow Jones Industrial 
                Average is close to closing above a major round number</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130502.pdf')">
                05/02/13</a>......Wall Street strategists 
                have upped their S&amp;P 500 price targets again, making a 13% gain in six months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130501.pdf')">
                05/01/13</a>......Individual investors (via 
                AAII) and Wall Street strategists have picked up their allocations to the stock 
                market</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130430.pdf')">
                04/30/13</a>......Assets in stock funds and 
                ETFs now total more than 3.3 times what's invested in safe money market funds</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130429.pdf')">
                04/29/13</a>......Investors' available cash 
                (free credit minus margin debt) at NYSE firms hits a 13-year low</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130426.pdf')">
                04/26/13</a>......Smart money commercial 
                hedgers in heating oil have gone net long to a record degree, while the public 
                is pessimistic</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130425.pdf')">
                04/25/13</a>......The S&amp;P 500 is close to a 
                52-week high while the Economic Surprise Index is below zero</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130424.pdf')">
                04/24/13</a>......Traders in the Rydex 
                mutual funds have moved aggressively into defensive sectors</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130423.pdf')">
                04/23/13</a>......Defensive stocks have 
                been leading the market higher, but historically that has not been a cause for 
                concern</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130422.pdf')">
                04/22/13</a>......The Barron's Big Money 
                poll shows that large money managers are the most bullish they've been in 20 
                years</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130419.pdf')">
                04/19/13</a>......Stocks hitting new 
                52-week lows on the NYSE increased to more than 3% of the total, the first time 
                in 100 days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130418.pdf')">
                04/18/13</a>......The S&amp;P 500 has dropped 
                below its 50-day average, and has been preceded by the Nasdaq and Russell 2000</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130417.pdf')">
                04/17/13</a>......The Nasdaq Composite 
                index has fallen below its 50-day average after enjoying more than three months 
                above it</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130416.pdf')">
                04/16/13</a>......Monday's decline was a 
                mini shock day, and notable given the S&amp;P 500's recent 52-week high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130415.pdf')">
                04/15/13</a>......The VIX "fear gauge" 
                jumped more than 40% on Monday, its 8th-largest one-day rise in history</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130412.pdf')">
                04/12/13</a>......The SKEW index is showing 
                a rapidly decreasing probability of a "black swan" event</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130411.pdf')">
                04/11/13</a>......Volume in leveraged 
                exchange-traded funds (ETFs) has not increased as the market rallied</p>
                <p><a :href="url_for('user.download_file', filename='2013/data_brief_20130411.pdf')">
                04/11/13</a>......Brief - Individual 
                investors in the AAII survey show only 19% bulls, the lowest since March 2009</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130410.pdf')">
                04/10/13</a>......The S&amp;P 500 surged 1% to 
                a new 10-year high during April, which hasn't worked out very well during the 
                next six months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130409.pdf')">
                04/09/13</a>......Public Opinion towards 
                unleaded gas is declining rapidly; previously, low levels have been good for the 
                stock market</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130408.pdf')">
                04/08/13</a>......Over-The-Counter (OTC) 
                penny stock volume showed a large jump in speculative trading in March</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130405.pdf')">
                04/05/13</a>......There has been a surge in 
                buying climaxes among stocks in the S&amp;P 500</p>
                <p><a :href="url_for('user.download_file', filename='2013/data_brief_20130405.pdf')">
                04/05/13</a>......Brief - Large gaps 
                down in the S&amp;P 500 after a Nonfarm Payroll report</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130404.pdf')">
                04/04/13</a>......Professional market 
                advisors and analysts as polled by Consensus Inc have shown bullishness for 
                three months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130403.pdf')">
                04/03/13</a>......The small-cap Russell 
                2000 index has closed below its 50-day average for the first time in four months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130402.pdf')">
                04/02/13</a>......Assets in equity mutual 
                funds and ETFs are now triple that of assets in money market funds</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130401.pdf')">
                04/01/13</a>......According to AAII, 
                individual investors' stock allocation is nearing its lowest level in a year</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130328.pdf')">
                03/28/13</a>......The S&amp;P 500 has closed at 
                a new 10-year high after at least 5 years of not doing so</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130327.pdf')">
                03/27/13</a>......The S&amp;P has gone 10 
                consecutive months without more than a -2% monthly loss</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130326.pdf')">
                03/26/13</a>......Margin debt increased 
                again, leaving investors' net worth, or available cash, dangerously low</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130325.pdf')">
                03/25/13</a>......The S&amp;P 500 put in a 
                negative reversal from a high, while harboring optimistic sentiment</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130322.pdf')">
                03/22/13</a>......Sentiment towards the US 
                dollar has become excessively optimistic</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130321.pdf')">
                03/21/13</a>......Another divergence 
                between smart money (corporate insiders) and dumb money (Rydex mutual fund 
                traders)</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130320.pdf')">
                03/20/13</a>......Options activity 
                (put/call value ratio and open interest ratio) show sentiment last seen in late 
                2009</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130319.pdf')">
                03/19/13</a>......Wall Street strategists 
                have raised their year-end price targets for the S&amp;P 500</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130318.pdf')">
                03/18/13</a>......Sentiment towards 
                transportation stocks is mixed, though Rydex traders are jumping in</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130315.pdf')">
                03/15/13</a>......The smart money (hedgers 
                in equity futures) is getting shorter while the dumb money (mutual fund flow) is 
                getting longer</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130314.pdf')">
                03/14/13</a>......A combined measure of 
                newsletter sentiment shows a near-record level of bullishness</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130313.pdf')">
                03/13/13</a>......The Rydex Nasdaq 100 Bull 
                / Bear Ratio soared in the leveraged funds, but fell back in the non-leveraged 
                ones</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130312.pdf')">
                03/12/13</a>......Odd Lot Short Sales and 
                Inverse ETF Volume show surprising apathy towards stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130311.pdf')">
                03/11/13</a>......Breadth according to the 
                Up Issues Ratio has been positive for 10 straight days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130308.pdf')">
                03/08/13</a>......Stocks and bond yields 
                have hit 200-day highs together</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130307.pdf')">
                03/07/13</a>......Pension funds have 
                decreased their asset allocation to the stock market</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130306.pdf')">
                03/06/13</a>......A comparison of 17 
                sentiment indicators to the market peaks in 2000 and 2007 reveals few 
                similarities</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130305.pdf')">
                03/05/13</a>......Three of the four major 
                stock indexes (S&amp;P 500, DJIA, Nasdaq Composite and Russell 2000) closed at a 
                52-week high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130304.pdf')">
                03/04/13</a>......Small options traders are 
                buying a lot of put protection</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130301.pdf')">
                03/01/13</a>......Rising margin debt and 
                declining cash has pushed investors' net worth, or available cash, near historic 
                lows</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130228.pdf')">
                02/28/13</a>......Bulls among individual 
                investors, according to the AAII sentiment survey, have dropped below 30%</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130227.pdf')">
                02/27/13</a>......Breadth via the Up Volume 
                Ratio has been either extremely high or extremely low for six straight days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130226.pdf')">
                02/26/13</a>......The S&amp;P 500 hit a 
                one-month low, then enjoyed a modest intraday reversal</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130225.pdf')">
                02/25/13</a>......The Up Volume Ratio 
                dropped below 10% again, the second time breadth has been extreme in three days</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130222.pdf')">
                02/22/13</a>......Gold sentiment is among 
                the worst it has been in during its decade-long bull market</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130221.pdf')">
                02/21/13</a>......The S&amp;P rose more than 2% 
                during Q4 earnings reports</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130220.pdf')">
                02/20/13</a>......Breadth according to the 
                Up Volume Ratio dropped below 10% the day after the S&amp;P 500 made a new high</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130219.pdf')">
                02/19/13</a>......The CBOE Skew index is 
                rising into extreme territory as the VIX masks underlying options market concern</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130215.pdf')">
                02/15/13</a>......Speculators in energy 
                futures have established a new record long position, possibly troubling for the 
                XLE fund</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130214.pdf')">
                02/14/13</a>......Sentiment towards 
                Treasury bonds has soured significantly, with some evidence of extremes</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130213.pdf')">
                02/13/13</a>......Over the past 30 days, an 
                average of 88% of S&amp;P 500 stocks have traded above their 50-day moving averages</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130212.pdf')">
                02/12/13</a>......Trading activity via 
                E-Trade's DART showed a jump in January, but is still low</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130211.pdf')">
                02/11/13</a>......The S&amp;P 500 is setting 
                new highs, but earnings estimates have been coming down over the past month</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130208.pdf')">
                02/08/13</a>......The McClellan Summation 
                Index has rolled over slightly, showing a loss of momentum, despite the S&amp;P 500 
                at new highs</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130207.pdf')">
                02/07/13</a>......Fund flows into mutual 
                funds and ETFs have reached decade-high levels as investors pour money in</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130206.pdf')">
                02/06/13</a>......Speculative penny stock 
                volume in the over-the-counter (OTC) market jumped in January, but is still low</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130205.pdf')">
                02/05/13</a>......According to Hulbert 
                Financial Digest, investment newsletters are at a new record exposure to stocks</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130204.pdf')">
                02/04/13</a>......The S&amp;P 500 has closed 
                below its 10-day average, first time in a month, with a high AIM Model reading</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130201.pdf')">
                02/01/13</a>......An unweighted model of 
                advisor and investor sentiment surveys surges to the 3rd-highest level in 25 
                years</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130131.pdf')">
                01/31/13</a>......Active investment 
                managers, according to NAAIM, are now leveraged long for the first time in 
                history</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130130.pdf')">
                01/30/13</a>......Traders using margin on 
                Japanese stock exchanges have been profitable, a worrisome contrary signal</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130129.pdf')">
                01/29/13</a>......It's the same pattern all 
                over again - modest price rises, and no new sentiment extremes</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130128.pdf')">
                01/28/13</a>......An unweighted model of 
                sentiment surveys shows the highest bullish opinion since 2004</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130125.pdf')">
                01/25/13</a>......The S&amp;P 500's 15-day 
                historical volatility has dropped under 6%, one of the lowest levels in history</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130124.pdf')">
                01/24/13</a>......Individual investors, as 
                polled by AAII, are showing the most bullishness in two years</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130123.pdf')">
                01/23/13</a>......Rydex money market assets 
                have declined, but are not yet quite at an extreme of complacency</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130122.pdf')">
                01/22/13</a>......The CSFB (CS Fear 
                Barometer) has climbed above 30%, showing traders are paying up for put 
                protection</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130118.pdf')">
                01/18/13</a>......The Nasdaq 100 is more 
                than 4% below a 52-week high while the S&amp;P 500 hits a new high, forming a 
                negative divergence</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130117.pdf')">
                01/17/13</a>......Rydex mutual fund traders 
                have jumped into the Transportation Fund</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130116.pdf')">
                01/16/13</a>......The Citigroup Economic 
                Surprise Index is close to dropping below 0 after being above 50</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130115.pdf')">
                01/15/13</a>......Sentiment in Apple stock 
                isn't souring much, despite its 30% decline</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130114.pdf')">
                01/14/13</a>......Traders 
                in the Rydex family of mutual funds are still favoring defensive sector funds</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130111.pdf')">
                01/11/13</a>......Flows into equity
                funds hit the highest level in years, but only for one week</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130110.pdf')">
                01/10/13</a>......New 
                highs on the NYSE recently spiked to more than 14% of total issues, but have 
                since formed a negative divergence</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130109.pdf')">
                01/09/13</a>......The 
                VIX "fear gauge" had an intraday reversal from a one-year low</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130108.pdf')">
                01/08/13</a>......Wall 
                Street strategists have upped their targets for the S&amp;P 500's prospects in 2013</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130107.pdf')">
                01/07/13</a>......Closed-end equity funds 
                are trading at a large discount to net asset value</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130104.pdf')">
                01/04/13</a>......The 
                S&amp;P 500 has closed above its upper Bollinger Band for 3 straight days</p>
                <p><a :href="url_for('user.download_file', filename='2013/data_brief_20130104.pdf')">
                01/04/13</a>......Brief - VIX drops below 14% for the first time in three months</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130103.pdf')">
                01/03/13</a>......Bond 
                yields and stocks have both surged to 50-day highs</p>
                <p><a :href="url_for('user.download_file', filename='2013/sentiment_report_20130102.pdf')">
                01/02/13</a>......Up volume on the NYSE 
                made up 90% of the total on back-to-back days</p>
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