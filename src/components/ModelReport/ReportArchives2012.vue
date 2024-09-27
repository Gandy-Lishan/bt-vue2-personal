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
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121231.pdf')">
                12/31/12</a>......Small options
                traders aren't buy many call options...or many puts, either</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121228.pdf')">
                12/28/12</a>......Margin 
                debt rose in November, pushing investors' net worth to the lowest level in 18 
                months</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121227.pdf')">
                12/27/12</a>......Margin traders in Japan have enjoyed a good run, which 
                normally leads to subpar returns</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121226.pdf')">
                12/26/12</a>......Newsletter writers focused on the Nasdaq are
                recommending extreme net long positions</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121221.pdf')">
                12/21/12</a>......Smart money
                commercial hedgers in equity index futures head toward a record net short 
                position</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121220.pdf')">
                12/20/12</a>......Risk 
                Appetite has climbed to its highest level since early 2010</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121219.pdf')">
                12/19/12</a>......The 
                VIX fear gauge jumped 10% the day after the S&amp;P 500 closed at a 30-day high</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121218.pdf')">
                12/18/12</a>......Investment-grade 
                corporate bonds hit a one-month low while stocks hit a one-month high</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121217.pdf')">
                12/17/12</a>......Financials are leading 
                the S&amp;P in a breakout to a new high</p>

                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121214.pdf')">
                12/14/12</a>......Speculators' 
                positions in the major metals haven't dropped despite choppy prices</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121213.pdf')">
                12/13/12</a>......Active 
                investment managers, according to NAAIM, are very net long, with high intensity 
                and confidence</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121212.pdf')">
                12/12/12</a>......The 
                NYSE advance/decline line shows breadth hit a new high in December</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121211.pdf')">
                12/11/12</a>......Traders 
                in the Rydex index funds have about as much invested as they did at prior market 
                lows</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121210.pdf')">
                12/10/12</a>......Speculative 
                trading in over the counter penny stocks jumped in November</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121207.pdf')">
                12/07/12</a>......Pension 
                funds continue to tread carefully, slightly increasing stock exposure and 
                holding onto bonds</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121206.pdf')">
                12/06/12</a>......Gold sentiment has 
                soured, but is far from an extreme</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121205.pdf')">
                12/05/12</a>......Average tail risk 
                according to the SKEW indicator is at its lowest point in three years</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121204.pdf')">
                12/04/12</a>......Inverse 
                ETF assets have dried up</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121203.pdf')">
                12/03/12</a>......SPY has an outside day; 
                newsletters ramp up their exposure</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121130.pdf')">
                11/30/12</a>......Small speculators go back 
                into gold, and shun the yen</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/data_brief_20121130.pdf')">
                                        11/30/12</a>......Data
                                        Brief -
                                        Breadth has quickly thrusted
                                        from oversold to overbought</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121129.pdf')">
                11/29/12</a>......Insiders 
                pick up their selling a bit; active investment managers show the lowest exposure 
                since June</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121128.pdf')">
                11/28/12</a>......A history-making outside 
                day in SPY</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/data_brief_20121128.pdf')">
                                        11/28/12</a>......Data
                                        Brief -
                                        Rydex mutual fund traders are 
                                        showing "irrational" pessimism 
                                        in the Nasdaq 100</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121127.pdf')">
                11/27/12</a>......Consumer 
                confidence rises; Rydex traders diss the Nasdaq 100</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121126.pdf')">
                11/26/12</a>......Newsletters 
                stay bearish; STEM.MR model has a long streak in overbought</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/data_brief_20121126.pdf')">
                                        11/26/12</a>......Data
                                        Brief -
                                        Smart money commercial 
                                        hedgers are covering what 
                                        had been massive short 
                                        positions</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121123.pdf')">
                11/23/12</a>......Stocks' traditional bias around 
                                        the holiday has held</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121121.pdf')">
                                        11/21/12</a>......The
                                        possibility of a "false" 
                                        breakdown for the S&amp;P 500 and 
                                        its 200-day moving average</p>
                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121120.pdf')">
                        11/20/12</a>......The 
                        flow of money out of bullish funds has caused a 
                                        rarely-seen extreme for the
                                        Rydex Bull Flow</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121119.pdf')">
                                        11/19/12</a>......The latest
                                        readings from Hulbert Financial 
                                        Digest suggest newsletter 
                                        writers have become too bearish</p>
                      <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121116.pdf')">
                      11/16/12</a>......Traders in the Rydex family of mutual funds have been ramping up their investments in the 
                ultra-safe Rydex money market</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121115.pdf')">
                                        11/15/12</a>......A
                                        3-month
                                        price oscillator 
                                        indicator has just sunk to its 
                                        lowest level since March 2009.</p>
                      <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121114.pdf')">
                      11/14/12</a>......Assets in the major 
                                        high-yield (junk) 
                                        exchange-traded funds have 
                                        shrunk</p>
                      <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121113.pdf')">
                      11/13/12</a>......Despite the S&amp;P 500 losing more than 4% over the 
                past 30 days, the VIX "fear gauge" is actually lower now than it was then</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121112.pdf')">
                                        11/12/12</a>......Traders in the Rydex family of
                                        mutual funds have greatly 
                                        decreased their speculative bets 
                                        on the S&amp;P 500 and Nasdaq 100</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121109.pdf')">
                                        11/09/12</a>......Volume in a popular inverse
                                        exchange-traded fund soared 
                                        to the highest level in a year 
                                        on Friday</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121108.pdf')">
                                        11/08/12</a>......The S&amp;P 500 finally closed below its 200-day average after enjoying
                nearly six months above</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121107.pdf')">
                                        11/07/12</a>......Hedging activity in inverse exchange-traded funds that bet
                                        against the market surged on 
                                        Wednesday</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121106.pdf')">
                                        11/06/12</a>......The VIX futures are in
                                        backwardation</p>
                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121105.pdf')">
                        11/05/12</a>......Utility stocks got hit on Monday, causing the 
                                        Dow 
                Jones Utilities Average to finally close below its 200-day average</p>
                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121102.pdf')">
                        11/02/12</a>......Options traders are pricing in 
                                        the highest level of Nasdaq 100 
                                        future volatility versus the 
                                        broader market in four years</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121101.pdf')">
                                        11/01/12</a>......SKEW, the probability of
                                        a "black swan" event - a large, 
                                        unexpected market move - has 
                                        declined by about 30%</p>
                                        <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121031.pdf')">
                                        10/31/12</a>......Big
                                        money managers aren't too 
                                        optimistic on the stock market's 
                                        prospects</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121026.pdf')">
                10/26/12</a>......There 
                was very little going on in sentiment on Friday</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121025.pdf')">
                10/25/12</a>......Volume 
                in inverse ETFs has soared lately</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121024.pdf')">
                10/24/12</a>......The 
                Nasdaq 100 is threatening to close below its 200-day average for the first time 
                in more than 200 days</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121023.pdf')">
                10/23/12</a>......The 
                Arms Index has surged to an extreme level for two out of the last three sessions</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121022.pdf')">
                10/22/12</a>......According 
                to a popular technical indicator, "fear" in the form of the VIX indicator 
                experienced an extreme spike on Friday</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121019.pdf')">
                10/19/12</a>......The 
                DJIA finally lost more than 1%, the first time in nearly four months</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121018.pdf')">
                10/18/12</a>......The 
                Risk Appetite Index has showed a persistent lift and just moved to the 
                most-extreme level in 15 years.</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121017.pdf')">
                10/17/12</a>......Options 
                traders are betting that the VIX "fear gauge" is about to rise</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121016.pdf')">
                10/16/12</a>......CEOs 
                are more pessimistic about their companies' chances than at any point in the 
                past decade</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121015.pdf')">
                10/15/12</a>......Options 
                traders have been opening more contracts betting on a rally than a decline</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121012.pdf')">
                10/12/12</a>......The S&amp;P 500 is close to 
                violating its 50-day average for the first time in three months</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121011.pdf')">
                10/11/12</a>......Penny stock traders 
                continue to abandon the market</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121010.pdf')">
                10/10/12</a>......Newsletters who have 
                expected the market to rise refuse to turn bearish - at worse, they expect a 
                correction</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121009.pdf')">
                10/09/12</a>......Due to "adverse market 
                conditions", many inverse ETFs that bet against the market have gone through 
                reverse stock splits</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121008.pdf')">
                10/08/12</a>......Stocks 
                haven't done very well during earnings season when sentiment is showing 
                excessive optimism. </p>
                            <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121005.pdf')">
                            10/05/12</a>......Hedge 
                            funds are under-performing a broad index of world stock 
                            market performance heading into the fourth quarter</p>
                            <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121004.pdf')">
                            10/04/12</a>......Traders 
                            in Apple options have been bidding up the price of 
                            protective put options</p>
                            <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121003.pdf')">
                            10/03/12</a>......Newsletter 
                            writers have been quickly ratcheting down their 
                            expectations.
                            </p>
                            <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121002.pdf')">
                            10/02/12</a>......Traders 
                            in S&amp;P 100 options have been aggressively building new 
                            put option positions over the past month</p>
                            <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20121001.pdf')">
                            10/01/12</a>......Two 
                            indicators of options pricing (CSFB and Skew) that are 
                            not widely followed are showing a heightened level of 
                            concern</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120928.pdf')">
                09/28/12</a>......Assets In Equity Funds 
                Tower Over Money Market Assets Again</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120927.pdf')">
                09/27/12</a>......The S&amp;P 500 Has Overshot 
                Wall Street Strategists' Estimates By More Than 4%</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120926.pdf')">
                09/26/12</a>......Volume In Bearish, 
                Inverse ETFs Has Increased, But Is Well Below Prior Peaks</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120925.pdf')">
                09/25/12</a>......Issuance Of High-Yield 
                Debt Has Soared Over The Past Three Weeks</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120924.pdf')">
                09/24/12</a>......Small Options Traders, 
                Via The ROBO Put/Call Ratio, Are Showing A Lot Of Call Buying</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120921.pdf')">
                09/21/12</a>......An Average NAAIM Active 
                Investment Manager Is Now 95% Net Long</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120920.pdf')">
                09/20/12</a>......There Is A Widening 
                Spread Between The Smart Money And Dumb Money</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120919.pdf')">
                09/19/12</a>......E-Trade's DART (Daily 
                Average Revenue Trades) Have Fallen Hard</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120918.pdf')">
                09/18/12</a>......Up Issues On The NYSE Hit 
                A New High Along With The S&amp;P 500, A Good Sign</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120917.pdf')">
                09/17/12</a>......The Stock / Bond Ratio 
                Has Surged Above 3 Standard Deviations</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120914.pdf')">
                09/14/12</a>......Commercial Hedgers Across 
                The Major Equity Indexes Increase Short Positions</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120913.pdf')">
                09/13/12</a>......New Highs On The NYSE 
                Jumped Along With The S&amp;P 500, A Good Long-Term Sign</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120912.pdf')">
                09/12/12</a>......Individual Investors Are 
                Showing Below-Average Exposure To Stocks</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120911.pdf')">
                09/11/12</a>......The Rydex All Index Bull 
                / Bear Ratio Nears A Record Speculative Level</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120910.pdf')">
                09/10/12</a>......According To The VIX, 
                Fear Jumped 10% The Day After A New High In The S&amp;P 500</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120907.pdf')">
                09/07/12</a>......The S&amp;P 500 Has 
                Enjoyed Two Straight Days With Lows Above The Prior Day's High</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120906.pdf')">
                09/06/12</a>......The S&amp;P 500 Broke Out To 
                A One-Year High With The Largest Gain And Highest Volume In A Month</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120905.pdf')">
                09/05/12</a>......Over The Counter (OTC) 
                Volume Plunged Again In August</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120904.pdf')">
                09/04/12</a>......The VIX "Fear Gauge" Has 
                Risen 9 Out Of 11 Days, While The S&amp;P 500 Barely Moved</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120831.pdf')">
                08/31/12</a>......Hedgers In DJIA Futures 
                Near A Record Short Position</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120830.pdf')">
                08/30/12</a>......NAAIM Active Investment 
                Managers Have Become Extremely Net Long The Stock Market</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120829.pdf')">
                08/29/12</a>......The VIX Fear Gauge Has 
                Risen 25% During A Time The S&amp;P 500 Has Declined Less Than 1%</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120828.pdf')">
                08/28/12</a>......Consumer Confidence Dips 
                To 10-Month Low As S&amp;P 500 Nears 12-Month High</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120827.pdf')">
                08/27/12</a>......September Suffers After 
                The S&amp;P Closes At A 12-Month High In August</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120824.pdf')">
                08/24/12</a>......VIX Futures Traders Are 
                Pricing In Higher Volatility - But Not Extremely So</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120823.pdf')">
                08/23/12</a>......Investors In The AAII Survey Are Showing Above-Average 
                Optimism For The First Time In Four Months</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120822.pdf')">
                08/22/12</a>......The Rydex All-Index Bull 
                / Bear Ratio Has Surged Close To A Record</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120821.pdf')">
                08/21/12</a>......This Isn't The Most Hated 
                Rally In History, But It Is Showing Above-Average Apathy</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120820.pdf')">
                08/20/12</a>......Wall Street Strategists 
                Are Trailing The S&amp;P 500, A Rare Under-Valuation</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120817.pdf')">
                08/17/12</a>......There Was No New 
                Commentary For Today</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120816.pdf')">
                08/16/12</a>......Corporate Insider Selling 
                Picks Up And Rydex Traders Rush Into Riskier Funds</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120815.pdf')">
                08/15/12</a>......Over The Past 7 Days, The 
                S&amp;P 500's Closing Range Is Less Than 0.35%, One Of The Smallest In History</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120814.pdf')">
                08/14/12</a>......The S&amp;P 500's Range Keeps 
                Narrowing</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120813.pdf')">
                08/13/12</a>......The Economic Policy 
                Uncertainty Index Has Become Extreme</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120810.pdf')">
                08/10/12</a>......Smart Money Commercial 
                Hedgers Are Close To An 8-Year Extreme Net Short Position In Equity Futures</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120809.pdf')">
                08/09/12</a>......Risk Appetite Has Moved 
                To Its Most Extreme Position Since 2010</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120808.pdf')">
                08/08/12</a>......The Farrell Sentiment 
                Indicator Is Close To Triggering A Long-term Buy Signal</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120807.pdf')">
                08/07/12</a>......The S&amp;P 500 and Nasdaq 
                100 Liquidity Premiums Have Entered Extreme Territory</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120806.pdf')">
                08/06/12</a>......Speculative Over The 
                Counter (Pink Sheet) Trading Dried Up In July</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120803.pdf')">
                08/03/12</a>......Rydex Mutual Fund Traders 
                Have Fled Bank And Financial Services</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120802.pdf')">
                08/02/12</a>......Pension Funds Increased 
                Stock Exposure In The First Quarter</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120801.pdf')">
                08/01/12</a>......The Small-Cap Russell 
                2000 Index Is Diverging Negatively From The S&amp;P 500</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120731.pdf')">
                07/31/12</a>......Odd Lot Trades Have 
                Skewed Towards Sell Orders</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120730.pdf')">
                07/30/12</a>......Small Options Traders Buy 
                Few Speculative Call Options Even As The Market Rallies</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120727.pdf')">
                07/27/12</a>......In The NAAIM Survey, 
                Active Investment Managers Refuse To Go Net Short</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120726.pdf')">
                07/26/12</a>......Bulls Among Individual 
                Investors In The AAII Survey In The Past 3 Months Hit The 4th-Lowest Level In 15 
                Years</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120725.pdf')">
                07/25/12</a>......Discretionary Stocks Have 
                Trailed Defensive Stocks (XLY vs XLP) During The Rally Unlike Any Other In 15 
                Years</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120724.pdf')">
                07/24/12</a>......A Hindenburg Omen Was 
                Triggered, A Very Minor Warning Sign</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120723.pdf')">
                07/23/12</a>......The VIX Has Jumped 20% In 
                Two Days</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120720.pdf')">
                07/20/12</a>......Risk Appetite Among 
                Investors Has Entered Extreme Territory</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120719.pdf')">
                07/19/12</a>......Individuals' Sentiment 
                Via The AAII Bull Ratio Dove Lower Despite A Market Rally</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120718.pdf')">
                07/18/12</a>......The MACD Indicator Gave A 
                False Sell Signal, In A Hurry</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120717.pdf')">
                07/17/12</a>......The S&amp;P 500 Has Declined 
                7 Out Of 9 Days, But With A Small Overall Loss</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120716.pdf')">
                07/16/12</a>......The Arms Index (aka TRIN) 
                Has Hit A True Extreme On The 3-Week Average</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120713.pdf')">
                07/13/12</a>......Rydex Mutual Fund Traders 
                Have Been Shying Away From The Safe Money Market Fund</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120712.pdf')">
                07/12/12</a>......Six Straight Losing Days 
                Results In A Positive Close At Some Point Within Two Weeks 80% Of The Time</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120711.pdf')">
                07/11/12</a>......The S&amp;P Has Dropped For 5 
                Straight Days, But The VIX Is Up Less Than Half The Amount It Usually Is</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120710.pdf')">
                07/10/12</a>......Selling Pressure Has Kept 
                The Arms Index (aka TRIN) Above 1.0 For 9 Straight Days</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120709.pdf')">
                07/09/12</a>......The NYSE Advance/Decline 
                Line Has Hit A New High, Diverging With The S&amp;P 500</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120706.pdf')">
                07/06/12</a>......Wall Street Strategists 
                Have Given Up On Stocks, And Are In Love With Bonds, To A 15-Year Extreme</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120705.pdf')">
                07/05/12</a>......Speculative 
                Over-The-Counter Volume Dropped Off Dramatically In June</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120703.pdf')">
                07/03/12</a>......Stocks Tend To Ease Back 
                During Earnings Season After Rallying Beforehand</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120702.pdf')">
                07/02/12</a>......Mutual Fund Managers 
                Raised Cash In May To 3.7% Of Total Assets</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120629.pdf')">
                06/29/12</a>......The US Dollar Index 
                Suffered Its Worst Loss In Seven Months, After Nearly Setting A One-Year High</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120628.pdf')">
                06/28/12</a>......The Equity Hedging Index 
                Shows That Speculators Didn't Hedge Much During The Recent Correction</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120627.pdf')">
                06/27/12</a>......The SKEW Index Indicator 
                Of A "Black Swan" Event Has Declined Sharply</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120626.pdf')">
                06/26/12</a>......Consumer Confidence Drops 
                To A Low Level Despite Stocks Holding Above 12-Month Average</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120625.pdf')">
                06/25/12</a>......The S&amp;P 500 Has Had Two 
                Big Down Days Within A Three-Day Window</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120622.pdf')">
                06/22/12</a>......Commercial Hedgers In 
                Nasdaq 100 Futures Dramatically Increase Their Net Short Position</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120621.pdf')">
                06/21/12</a>......Fewer Than 10% Of 
                Fidelity Select Sector Funds Had Beaten Cash Over A 3-Month Period</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120620.pdf')">
                06/20/12</a>......Newsletter Writers Are 
                More Neutral, For Longer, Than Any Time In 30 Years</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120619.pdf')">
                06/19/12</a>......The McClellan Summation 
                Index Has Given A Buy Signal By Curling Up From An Oversold Condition</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120618.pdf')">
                06/18/12</a>......ROBO Put/Call Ratio Shows 
                Small Options Traders Are Bearish; Potentially A Month With No IPOs</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120615.pdf')">
                06/15/12</a>......The DJIA Has Crossed Back 
                Above Its 50-Day Average</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120614.pdf')">
                06/14/12</a>......Energy Sector Sentiment 
                Has Soured To An Extreme Degree, According To Rydex Assets And Put/Call Ratios</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120613.pdf')">
                06/13/12</a>......Inverse ETF Volume 
                Recently Spiked To An Extreme Relative To Total Exchange Volume</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120612.pdf')">
                06/12/12</a>......Rydex Mutual Fund Traders 
                Have Shunned Small Cap Funds In Favor Of Large Caps</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120611.pdf')">
                06/11/12</a>......Newsletter Writers 
                Continue To Recommend Short Positions</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120608.pdf')">
                06/08/12</a>......Poor Economic Surprises 
                Have Led To A Lower US Dollar; Smart Money Hedgers In The Nasdaq 100 Are 
                Covering Shorts</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120607.pdf')">
                06/07/12</a>......An 8-Week Average Of The 
                AAII Bull Ratio Has Cycled From Optimism To Pessimism; Mutual Fund Flows Reach 
                -$20 Billion</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120606.pdf')">
                06/06/12</a>......The S&amp;P Has Swung From 
                Its Largest Loss In 100 Days To Its Largest Gain In 100 Days</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120605.pdf')">
                06/05/12</a>......Traders Using Margin Leverage In Japan Have Suffered Large 
                Losses</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120604.pdf')">
                06/04/12</a>......Dropping Into -10% 
                "Correction" Territory Doesn't Necessarily Mean A New Bear Market</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120601.pdf')">
                06/01/12</a>......The S&amp;P 500 Drops Below 
                Its 200-Day Average For The First Time In Months, With A Big Decline</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120531.pdf')">
                05/31/12</a>......"Smart Money" Insiders 
                Buy While "Dumb Money" Individuals Sell</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120530.pdf')">
                05/30/12</a>......Gold Sentiment Remains 
                Sour, Not Much Changed From Two Months Ago</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120529.pdf')">
                05/29/12</a>......Stocks Have Bottom When 
                Investor's Intelligence Newsletter Bears Were Fewer Than We Have Now...But It 
                Was Rare</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120525.pdf')">
                05/25/12</a>......Risk Appetite Has Waned 
                So Much As To Now Be Showing Extreme Risk-Aversion</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120524.pdf')">
                05/24/12</a>......Corporate Insiders Buy 
                Heavily, Creating A "Buy Inflection"</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120523.pdf')">
                05/23/12</a>......What Newsletters Are 
                Saying vs. What They're Doing (Investor's Intelligence vs. Hulbert Financial 
                Digest)</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120522.pdf')">
                05/22/12</a>......Baltic Dry Index Rallies 
                While Credit Standards Ease</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120521.pdf')">
                05/21/12</a>......The Best Rebound In Two 
                Months, Following A Multi-Month Low</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120518.pdf')">
                05/18/12</a>......The DJIA Suffers One Of 
                Its Weakest 3-Week Stretches In 112 Years</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120517.pdf')">
                05/17/12</a>......A Combination Of The 
                Short-term Indicator Score And Intermediate-term Indicator Score Has Reached A 
                True Extreme</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120516.pdf')">
                05/16/12</a>......The DJIA Has Dropped For 
                9 Out Of 10 Days</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120515.pdf')">
                05/15/12</a>......VIX Crosses Above Its 
                Six-Month Average For First Time In 100 Days</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120514.pdf')">
                05/14/12</a>......The S&amp;P 500 Opened With A 
                Large Loss And At A Multi-Month Low, A Sign Of Passionate Selling Pressure</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120511.pdf')">
                05/11/12</a>......Small Speculators Surge 
                To A Record Net Long In The British Pound Futures Market</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120510.pdf')">
                05/10/12</a>......Only 25% Of Individual 
                Investors Expect The Market To Rise</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120509.pdf')">
                05/09/12</a>......The DJIA Has Dropped For 
                6 Straight Days While More Than 5% Above Its 200-Day Average</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120508.pdf')">
                05/08/12</a>......Wall Street Strategists 
                Lower Their Recommended Equity Exposure To Near The Lowest On Record</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120507.pdf')">
                05/07/12</a>......Speculative OTC Dollar Volume Nears Decade High Relative To 
                The Nasdaq Composite</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120504.pdf')">
                05/04/12</a>......Smart Money Commercial Hedgers In The Equity Index
                Futures Increase Their Net Short Position</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120503.pdf')">
                05/03/12</a>......AAII Survey Shows Jump In Individual Investor
                Bullishness, But That's Good When It's Still Below Average</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120502.pdf')">
                05/02/12</a>......Our Intermediate-Term Indicator Score Is Souring As
                Stocks Are Rising</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120501.pdf')">
                05/01/12</a>......Real, Historical Volatility Is Close To Exceeding
                Implied Volatility (VIX)</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120430.pdf')">
                04/30/12</a>......Mutual Fund Cash Levels Fall To Record Low</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120427.pdf')">
                04/27/12</a>......Mutual Funds Suffer The 4th-Worst Outflow In Two Years</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120426.pdf')">
                04/26/12</a>......AAII Bulls Drop To Six-Month Low With The S&amp;P Near A
                High; Rydex Biotechnology Assets Near A Five-Year High</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120425.pdf')">
                04/25/12</a>......Neutral Responses Among Newsletter Writers, Despite A
                Rising Market, Suggests Higher Long-Term Prices</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120424.pdf')">
                04/24/12</a>......Money Market Assets Drop To A 14-Year Low, But Still
                Show Uncertainty Given Super-Low Interest Rates</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120423.pdf')">
                04/23/12</a>......<i>Barron's</i> Big Money Poll Shows Money Managers Are
                As Bullish As Always</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120420.pdf')">
                04/20/12</a>......The S&amp;P 500 Has Stayed Within 1% Of Its 50-Day Average
                For 10 Straight Days</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120419.pdf')">
                04/19/12</a>......Neutral Responses Are Rising Fast In Sentiment Surveys;
                Corporate Insiders Are Buying Small Cap Stocks</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120418.pdf')">
                04/18/12</a>......During A Flat Market Over The Past 8 Weeks, Newsletter
                Bulls And Bears Are Both Declining</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120417.pdf')">
                04/17/12</a>......The Risk Appetite Index Has Started To Curl Higher
                After Being In Extreme Risk-Seeking Territory</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120416.pdf')">
                04/16/12</a>......"Sell In May" Is Not As Effective When The Discount
                Rate Is Steady, And Low</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120413.pdf')">
                04/13/12</a>......Breadth On The NYSE Via The Up Issues Ratio Was Extreme
                Every Day This Week</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120412.pdf')">
                04/12/12</a>......Individual Investor Bears In The AAII Survey Drop
                Sharply Despite A Recent New High In The S&amp;P 500</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120411.pdf')">
                04/11/12</a>......Up Issues On The NYSE Has Reversed From Low To High,
                Usually Signaling A Positive Breadth Reversal</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120410.pdf')">
                04/10/12</a>......The S&amp;P Has Suffered A Sharp Pullback From A High, Not
                Necessarily A Sign Of Trend Change</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120409.pdf')">
                04/09/12</a>......The VIX Has Risen For 7 Straight Days; The McClellan
                Oscillator Is Grossly Oversold</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120405.pdf')">
                04/05/12</a>......OTC Penny Stock Traders Increase Their Activity, Still
                Not Extreme</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120404.pdf')">
                04/04/12</a>......Wall Street Strategists' Fair Value For The S&amp;P 500 Is
                More Than 3% Below Where It's Trading, Showing Overvaluation</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120403.pdf')">
                04/03/12</a>......The Financial Sector Has Stocks With Insider Buying But
                Negative Wall Street Analyst Recommendations</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120402.pdf')">
                04/02/12</a>......Wall Street Strategists Are Recommending Less Equity
                Exposure Than Main Street Individual Investors Are Taking</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120330.pdf')">
                03/30/12</a>......Smart Money Hedgers Across Treasury Maturities Have
                Established Aggressive Long Positions</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120329.pdf')">
                03/29/12</a>......Active Investment Managers (Per NAAIM) Increased Their
                Long Exposure This Week</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120328.pdf')">
                03/28/12</a>......Nearly All Members Of The HUI Gold Bugs Index Are
                Trading Below Their Short-, Intermediate- And Long-Term Averages</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120327.pdf')">
                03/27/12</a>......Bearish (Inverse) ETF Assets Have Declined, But Aren't
                Yet To 2011's Lowest Levels</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120326.pdf')">
                03/26/12</a>......Treasury Bond Market Sentiment Has Soured</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120323.pdf')">
                03/23/12</a>......Commercial Hedgers In The DJIA and Nasdaq 100 Establish
                Large Net Short Positions</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120322.pdf')">
                03/22/12</a>......The S&amp;P 500's Weekly Momentum Is Impressive, And
                Usually Results In Higher Prices Long-term</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120321.pdf')">
                03/21/12</a>......Risk Appetite Has Reached An Extreme According To Three
                Separate Brokerage Firm Measures</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120320.pdf')">
                03/20/12</a>......Sentiment Towards Gold Has Soured According To A
                Composite Indicator Score</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120319.pdf')">
                03/19/12</a>......Apple Declares Its First Dividend; The S&amp;P Has Closed
                Above Its Bollinger Band For 5 Straight Days</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120316.pdf')">
                03/16/12</a>......No Commentary, Updated Charts Only</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120315.pdf')">
                03/15/12</a>......No Commentary, Updated Charts Only</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120314.pdf')">
                03/14/12</a>......No Commentary, Updated Charts Only</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120313.pdf')">
                03/13/12</a>......No Commentary, Updated Charts Only</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120312.pdf')">
                03/12/12</a>......No Commentary, Updated Charts Only</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120309.pdf')">
                03/09/12</a>......Small Speculators Have A Record Net Short In The
                Japanese Yen</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120308.pdf')">
                03/08/12</a>......Corporate Insiders Stay Bearish, But With A Wrinkle;
                Active Investment Managers Get More Bearish - Some Very Bearish</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120307.pdf')">
                03/07/12</a>......Over The Counter (Penny Stock) Volume Rises In
                February; Retail And Rydex Money Market Assets Decline</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120306.pdf')">
                03/06/12</a>......The S&amp;P 500 Has Ended Its Streak Above Its 20-Day
                Average</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120305.pdf')">
                03/05/12</a>......The Nasdaq 100 Suffers Its First -1% Down Day In 45
                Sessions</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120302.pdf')">
                03/02/12</a>......Speculators In Four Energy Contracts Reach A Record Net
                Long Position</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120301.pdf')">
                03/01/12</a>......The S&amp;P 500 Has Gone 50 Days Without Closing Below Its
                20-Day Average, And Has 35 Positive Closes</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120229.pdf')">
                02/29/12</a>......Apple 
                Hit $500 Billion In Market Cap; Precedents Led To A Poor Market</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120228.pdf')">
                02/28/12</a>......There Simply Isn't Much Change Among Our Indicators</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120227.pdf')">
                02/27/12</a>......McClellan Oscillator 
                Stays Negative As S&amp;P 500 Hits A High</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120224.pdf')">
                02/24/12</a>......Crude Oil Hit A 
                Nine-Month High As The S&amp;P 500 Reached Its Own High</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120223.pdf')">
                02/23/12</a>......Wall Street Strategists 
                Lower Their Equity Allocation As Stocks Rally</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120222.pdf')">
                02/22/12</a>......The Russell 2000 and DJ 
                Transports Diverge From The S&amp;P 500; The ADX Reaches An Unsustainable Level</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120221.pdf')">
                02/21/12</a>......The DJIA Tends To 
                Under-Perform After Crossing Above A Round Number</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120217.pdf')">
                02/17/12</a>......The SKEW Index And CS 
                Fear Barometer Are Pricing In A Higher Probability Of A Black Swan Event</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120216.pdf')">
                02/16/12</a>......New Highs On The NYSE 
                Have Dried Up, Forming A Negative Divergence; Corporate Insiders Pick Up Their 
                Selling</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120215.pdf')">
                02/15/12</a>......The CS Fear Barometer 
                Nearly Hits A Record; A One-Day Reversal In The S&amp;P Isn't Predictive Of Weakness</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120214.pdf')">
                02/14/12</a>......The S&amp;P Has Lasted 30 Days 
                Since New Year Without A 1% Loss; Rydex Traders Pile Into The Leveraged 
                Nasdaq 100 Fund</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120213.pdf')">
                02/13/12</a>......The S&amp;P Has Gone 29 Days 
                Without A Negative (For The Year) Close; Signs Of A Short-term Blowoff</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120210.pdf')">
                02/10/12</a>......Commercial Hedgers Go To 
                A Record Net Short In Equity Index Futures; The S&amp;P Wiped Out The Past Week Of 
                Gains</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120209.pdf')">
                02/09/12</a>......The VIX Rises Along With 
                The S&amp;P 500; Corporate Insider Selling Picks Up</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120208.pdf')">
                02/08/12</a>......Sentiment On The US 
                Dollar Has Soured; Rydex Traders Establish A Near-Record All-Index Bull/Bear 
                Ratio</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120207.pdf')">
                02/07/12</a>......A "Creeper" Uptrend Has A 
                Good Record For Even Higher Prices; Penny Stock Traders Stay Away</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120206.pdf')">
                02/06/12</a>......There Has Been A Record 
                Amount Of High Yield (Junk) Debt Issued In The Past Week</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120203.pdf')">
                02/03/12</a>......The Equity Hedging Index 
                Approaches A Decade Low; Commercial Hedgers Increase Their Net Short Position</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120202.pdf')">
                02/02/12</a>......Individuals' Allocation 
                To Cash Sinks To A Very Low Level; Investment Managers' Exposure And Confidence 
                Rise</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120201.pdf')">
                02/01/12</a>......Investor's Intelligence 
                Newsletter Bulls Stay Flat As Stocks Rise</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120131.pdf')">
                01/31/12</a>......Rydex Beta Chase Index 
                Hits An Extreme; Inverse ETF Volume Drops; Baltic Dry And Credit Standards 
                Deteriorate</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120130.pdf')">
                01/30/12</a>......January's Big Gain Leads 
                To Better Returns</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120127.pdf')">
                01/27/12</a>......Facebook's IPO Will Rank 
                As One Of The Largest In U.S. History; Commercial Hedgers Go Net Short Equity 
                Index Futures</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120126.pdf')">
                01/26/12</a>......The 4-Week AAII Bull 
                Ratio Hits A Rare Extreme</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120125.pdf')">
                01/25/12</a>......Rydex Money Market Funds 
                Dry Up As Leveraged Index Assets Rise; Odd Lot Buyers Pull Back</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120124.pdf')">
                01/24/12</a>......When Apple Gaps Up 5% Or 
                More Following Earnings, Broader Stock Returns Have Suffered</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120123.pdf')">
                01/23/12</a>......The S&amp;P 500 May Soon See 
                A Golden Cross; Newsletter Writers Pile Into The Nasdaq</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120120.pdf')">
                01/20/12</a>......Rydex Traders Have 
                Avoided The Biotechnology Fund, While Others Haven't</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120119.pdf')">
                01/19/12</a>......SPY And QQQ Liquidity 
                Premium Hit Extremes; OTC Volume Picks Up; Nasdaq 100 After Up Opens On Intel 
                Earnings</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120118.pdf')">
                01/18/12</a>......Intel Earnings Report As 
                A Bellwether; Positive Earnings Surprises In The S&amp;P 500 Are The Lowest In 11 
                Years</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120117.pdf')">
                01/17/12</a>......Baltic Dry Index 
                Collapses, But May Not Matter; Hulbert Nasdaq Newsletter Sentiment Surges Higher</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120113.pdf')">
                01/13/12</a>......The Intermediate-term 
                Indicator Score Is Extreme; Sector Performance After The MLK Holiday</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120112.pdf')">
                01/12/12</a>......Next Week Is A Pivotal 
                One For Tech Stocks; OEX Open Interest Rises; AAII Bears Stay Historically Low</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120111.pdf')">
                01/11/12</a>......A Negative Divergence In 
                The McClellan Oscillator Has Not Been Negative For Stocks</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120110.pdf')">
                01/10/12</a>......OEX Put/Call Ratio vs 
                Equity Put/Call Ratio; CS Fear Barometer vs The VIX</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120109.pdf')">
                01/09/12</a>......Nasdaq / NYSE Volume 
                Ratio Spikes Higher; January Earnings Season; 2011's Historic All-Or-Nothing 
                Days</p>
                <p><a :href="url_for('user.download_file', filename='2012/data_brief_20120109.pdf')">
                01/09/12</a>......Data Brief - Sentiment 
                Scores Ahead Of Earnings Season</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120106.pdf')">
                01/06/12</a>......Unfilled Gap Bodes Well; 
                Seasonality Does Not, Especially With The VIX This Low</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120105.pdf')">
                01/05/12</a>......Rydex Mutual Fund Traders 
                Abandon Technology; Rough Seasonality After January Nonfarm Payroll Report</p>
                <p><a :href="url_for('user.download_file', filename='2012/data_brief_20120105.pdf')">
                01/05/12</a>......Data Brief - The AAII 
                Bears Have Scattered</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120104.pdf')">
                01/04/12</a>......A Big Unfilled Gap With 
                Next-Day Follow-Through Bodes Well; Continuing Higher After An Overbought Up 
                Volume Ratio</p>
                <p><a :href="url_for('user.download_file', filename='2012/sentiment_report_20120103.pdf')">
                01/03/12</a>......Surge In Call Option 
                Trading; Negative Price Pattern</p>
                <p><a :href="url_for('user.download_file', filename='2012/data_brief_20120103.pdf')">
                01/03/12</a>......Data Brief - Good 
                Start...</p>
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