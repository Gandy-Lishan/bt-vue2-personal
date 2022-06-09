<template>
	<div class="content-container">
		<div data-v-15d0b2f8 class="content markdown-body override">
			<div class="menu_logo">
				<img
					style="width: 190px; height: 50px"
					src="../../assets/logo.png"
					alt="logo"
				/>
			</div>
			<section data-v-15d0b2f8="">
				<h1>Easy to use of BacktestEdge</h1>
				<p>
BacktestEdge utilizes the real data of financial&stock market and provides users a trading edge by backtesting trading strategies that are related to sentiment and technical indicators. Before you actually apply your trading strategy into live trading, BacktestEdge will help you backtest this strategy with actual result of return, number of trades and many other useful data within seconds! 


				</p>
				<p>This tutorial will teach you how to quickly start using BacktestEdge and thanks for reading!</p>

				<h1>1.Brief introduction of BacktestEdge</h1>

				<h3>1.1 Chart section</h3>
				<blockquote class="video_link">
					<i class="el-icon-video-play"></i>
					<a href="#">Introduction to chart operations</a>
				</blockquote>

				<blockquote>
					<p>
						<br />
						In the chart section of BacktestEdge, users can select stock/index symbol to be backtested and add to favorites; select sentiment indicators and add to favorites; select technical indicators and modify settings; select timeframe among Daily/Weekly/Monthly; select the Day/Night theme of chart.
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/chart.png" alt="Chart" />

				<h4>1.1.1 How to change Symbol on a chart</h4>
				<blockquote>
					<p>
						<br/>
Find the search box named symbol in the chart and select the stock you want to replace, such as AAPL, within the search box. When the stock is replaced,
						The symbol in the form below will be replaced synchronously. You can use it as a stock parameter for backtesting when running a backtest.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/symbolChart.png" alt="Change Symbol" title="Change Symbol"/>
				<h4>1.1.2 How to change the Sentiment Indicator on a chart</h4>
				<blockquote>
					<p>
						<br/>
					Find the search box named Sentiment Indicator in the chart, and to the right of the list item there will be a cycle for each indexer, select the indexer you want to replace, such as Smart Money Confidence. When the indexer is replaced, the corresponding graph will be displayed below the chart,
						The Entity Criteria and Exit Criteria in the form below are automatically populated into the form, but do not overwrite the indexer already selected in the form. You can use it as an indexator for backtesting when running backtesting.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/changeSenti.png" alt="Change Sentiment Indicator" title="Change Sentiment Indicator"/>
				<h4>1.1.3 How to change the Technical Indicator on a chart</h4>
				<blockquote>
					<p>
						<br/>Find a drop-down option called Studios in the chart and select the indexer you want to replace in the search box, such as the Connectivity Channel Index. When the indexer is replaced, the corresponding graph will be displayed below the chart,
						。 The Technical Indicators selected on the chart are not populated with The Entry Criteria and Exit Criteria as the Selection Indicators are selected, and if you want to use Technical Indicators in backtesting,
						You can select directly from the form.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/changeTech.png" alt="Change Technical Indicator" title="Change Technical Indicator"/>
				<h4>1.1.4 How to change the chart type on a chart</h4>
				<blockquote>
					<p>
						<br/>
						Find a drop-down option called Display in the chart and select the Style you want to replace, such as Bar, in the drop-down box. When the Chart Style is replaced, the corresponding type of curve style will be displayed below the chart.
						。 It should be noted that the type of chart is determined by the indexer, for example some indexers only support the Candle Style.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/changeStyle.png" alt="Change Chart Style" title="Change Chart Style"/>
				<h4>1.1.5 How to change the chart period on a chart</h4>
				<blockquote>
					<p>
						<br/>
						Find the drop-down option named 1D in the chart, where 1D represents Daily, 1W means Weekly, 1M represents Montthly, and inside the drop-down box select the period you want to replace, such as 1W. The stock cycle in the chart has and the form under the Set Up Backtest tab changes as the period changes
						, you can use it as a timeframe parameter for backtesting when creating a backtest.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/chartTime.png" alt="Change Frequecy" title="Change Frequecy"/>
				<h4>1.1.6 How to change the chart theme</h4>
				<blockquote>
					<p>
						<br/>
						Open Settings in the chart, find Themes in the settings, there are currently two themes for the chart, Dark and Light, which you can change according to your personal preferences.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/changeTheme.png" alt="Change Chart Themes" title="Change Chart Themes"/>
				<h4>1.1.7 How to clear chart contents with one click</h4>
				<blockquote>
					<p>
						<br/>
						When you have selected multiple indexers in the chart, you can clear the chart by clicking the Clear Chart button below the chart.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/clearChart.png" alt="Clear Chart" title="Clear Chart"/>

				<h4>1.1.8 How to hide the stock information prompt box</h4>
				<blockquote>
					<p>
						<br/>
						When you move your mouse into the stock curve box, a blue message box will appear, and if you don't need it, you can click the information button to close it.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/hideInfo.png" alt="Hide Information" title="Hide Information"/>
				
				<h4>1.1.9 How to hide chart gridlines</h4>
				<blockquote>
					<p>
						<br/>
						The chart will display the gridlines of the x-axis and y-axes by default, if you don't need it, you can click the Grid button to hide it.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/hideGrid.png" alt="Hide Grid" title="Hide Grid"/>
				<h4>1.1.10 How to hide Last Price</h4>
				<blockquote>
					<p>
						<br/>
						The chart will show the Price of the last Bar by default, if you don't need it, you can click the Last Price button to hide it.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/hidePrice.png" alt="Hide Last Price" title="Hide Last Price"/>
				

				<h4>1.1.11 Add stocks to favorites</h4>
				<blockquote>
					<p>
						<br/>
						Click the Add to Favorites button to the right of the stock name to add the stock to your favorites. At this time, you can click on the Symbol search box to view the stocks in the favorites.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/symbolFav.png" alt="Add Symbol To Favorites" title="Add Symbol To Favorites"/>
				<img src="../../assets/helpImg/viewSymbolFav.png" alt="View Symbol's Favorites" title="View Symbol's Favorites"/>
				<h4>1.1.12 Add The Sentiment Indicator to Favorites</h4>
				<blockquote>
					<p>
						<br/>
Feel free to choose an Indexer in the Sentiment Indicator search box, such as Smart Money Confidence. Place the mouse over the selected graph and right-click on the one that appears
						Click add to Favorites Indicators in the menu item to add the current stock to the indicator favorites. If you want to see the Sentiment Indicator in your favorites, you can click here
						Sentiment Indicator search box view.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/indiFav.png" alt="Add Sentiment Indicator To Favorites" title="Add Sentiment Indicator To Favorites"/>
				<img src="../../assets/helpImg/viewIndiFav.png" alt="View Sentiment Indicator's Favorites" title="View Sentiment Indicator's Favorites"/>
				

				<h4>1.1.13 How to modify the extremum of the Sentiment Indicator</h4>
				<blockquote>
					<p>
						<br/>
						Feel free to choose an Indexer in the Sentiment Indicator search box, such as Smart Money Confidence. Place the mouse over the selected graph and right-click on the one that appears
						Click edit settings in the menu item, in which you can change the extremum of the indicator and you can also change the color of the extremum curve. If your Entry Indicator is the same as the indexer for editing extremums on the chart,
						Then when the extremum on the form changes, the corresponding extremum on the form will also change.
						<br/>
					</p>
				</blockquote>
				<h4>1.1.14 How to remove Range Selector</h4>
				<blockquote>
					<p>
						<br/>
						There is a Range Select below the chart, and you can drag the selector to see the chart curves within a specified range. If you want to hide it, you can uncheck Range Selector in the settings
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/deleteRange.png" alt="Hide Range Selector" title="Hide Range Selector"/>
				<h4>1.1.15 Set Y-Axis Preferences</h4>
				<blockquote>
					<p>
						<br/>
						In the chart you can set Y-Axis Preferences, just open the settings, find the Y-Axis Preferences section, the chart provides two kinds of Preferences. Tick Log Scale to think
						Your stock graph will grow according to the curve, give invert and your stock graph will flip.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/setY.png" alt="Set Y-Axis Preferences" title="Set Y-Axis Preferences"/>
					<h4>1.1.16 How to delete a specified Indexer in a chart</h4>
				<blockquote>
					<p>
						<br/>
						
To delete a specified Indexor in the chart, you can click on the X sign in the upper left corner of the indicator to delete, or you can move the mouse over the indicator you want to delete, right-click, and drop down the menu
						Select Delete Indicator to delete the current indicator.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/deSenti1.png" alt="Delete Indicator" title="Delete Indicator"/>
				<img src="../../assets/helpImg/deSenti2.png" alt="Delete Indicator" title="Delete Indicator"/>
				<h3>1.2 Form section</h3>
				<blockquote>
					<p>
						<br />
						In the chart section of BacktestEdge, users can select stock/index symbol to be backtested and add to favorites; select sentiment indicators and add to favorites; select technical indicators and modify settings; select timeframe among Daily/Weekly/Monthly; select the Day/Night theme of chart.
						<br />
					</p>
				</blockquote>

				<img src="../../assets/helpImg/form.png" alt="Form" />
				<h1>2. How to create a new backtest</h1>
				<blockquote class="video_link">
					<i class="el-icon-video-play"></i>
					<a href="#">Demonstration of the backtest creation process</a>
				</blockquote>
				<h3>2.1 create a single-signal entry/exit criteria new backtest</h3>
				<h4>2.1.1 Fill in the basic parameters of the backtest</h4>
				<blockquote>
					<p>
						<br />According to your own needs, fill in the relevant parameters of the backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
						<br />
					</p>
				</blockquote>
				<img
					src="../../assets/helpImg/singleSetup.png"
					alt="Set Up Form" title="Set Up Form"
				/>

				<h4>2.1.2 Fill in the entry criteria</h4>
				<blockquote>
					<p>
						<br />
						Select Single Signal in the drop-down list in the
upper right corner of the Entry Criteria section;
Select a sentiment or technical indicator from the drop-down box indicator field, fill in required value and choose condition in the signal section. 
For sentiment indicator, the Extreme Optimism and Extreme Pessimism values are recommended. 
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/singleEntry.png" alt="Entry Criteria" title="Entry Criteria" />

				<h4>2.1.3 Fill in the exit criteria</h4>
				<blockquote>
					<p>
						<br />
Select Single Signal in the drop-down list in the
upper right corner of the Entry Criteria section;
Select a sentiment or technical indicator from the drop-down box indicator field, fill in required value and choose condition in the signal section. 
For sentiment indicator, the Extreme Optimism and Extreme Pessimism values are recommended. 
						<br />
					</p>
				</blockquote>
								<img src="../../assets/helpImg/singleExit.png" alt="Exit Criteria" title="Exit Criteria" />

				<h4>2.1.4 Run the backtest and view the results</h4>

				<blockquote>
					<p>
						<br />
After filling out the backtest form, click "Run Backtest" button to run the backtest and view the backtest results. The runtime of backtest will take more than 30 seconds to finish. After the backtest is completed, it will jump to Backtest Results tab to display the backtest results, including the number of trades, entry & exit points etc. If the backtest has no trades, you can go to Backtest History tab and click 'Edit" icon to modify backtest data. 
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/runBacktest.png" alt="Summary" />
				<h3>2.2 Use Risk Control at Exit</h3>
				<h4>2.2.1 Set stop/loss </h4>
				<blockquote>
					<p>
						<br />To use stop/loss as an OR condition with exit criteria, check "Risk Control at Exit" and then fill in value in the "Take Profit" and "Stop Loss"
fieldboxes. 

						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/sl.png" alt="Set Up Form" />
				<h4>2.2.2 Set time-in-market</h4>
				<blockquote>
					<p>
						<br />
						To use time-in-market as an OR condition with exit criteria, check "Risk Control at Exit" and then fill in value in the "Time in Market" fieldbox. 
						<br />
					</p>
				</blockquote>
				<img
					src="../../assets/helpImg/tim.png"
					alt="Set Up Form"
				/>
				<h4>2.2.3 Select Only Use Risk Control in the exit criteria</h4>
				<blockquote>
					<p>
						<br />When Risk Control at Exit is checked and filled in with settings, the exit criteria will combine with the Risk Control settings as an OR condition.
If you only want to use Risk Control at Exit settings as the exit criteria, select "Only Use Risk Control" in the drop down list in the upper right corner of the Exit Criteria section.
						<br />
					</p>
				</blockquote>
				
				
				<img
					src="../../assets/helpImg/timEntry.png"
					alt="Set Up Form"
				/>
				<img
					src="../../assets/helpImg/timExit.png"
					alt="Set Up Form"
				/>
				<!-- <img
					src="../../assets/helpImg/single-change-criteria.png"
					alt="Set Up Form"
				/> -->
				<h3>2.3 set different backtest timeframe</h3>
				<h4>2.3.1 Set timeframe to Daily</h4>
				<blockquote>
					<p>
						<br />
						When the timeframe in Set up Backtest tab is set to Daily, the sentiment indicators in the entry and exit criteria sections will only have sentiment indicators with daily updates.
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/daily.png" alt="Set Up Form" />
				<h4>2.3.2 Set timeframe to Weekly</h4>
				<blockquote>
					<p>
						<br />
						When the timeframe in Set up Backtest tab is set to Weekly, the sentiment indicators in the entry and exit criteria sections will have sentiment indicators with daily and weekly updates.
						<br />
					</p>
				</blockquote>
				<img
					src="../../assets/helpImg/Weekly.png"
					alt="Set Up Form"
				/>
				<h4>2.3.3 Set timeframe to Monthly</h4>
				<blockquote>
					<p>
						<br />
						When the timeframe in Set up Backtest tab is set to Monthly, the sentiment indicators in the entry and exit criteria sections will have sentiment indicators with daily/weekly/monthly updates.
						<br />
					</p>
				</blockquote>
								<img
					src="../../assets/helpImg/Monthly.png"
					alt="Set Up Form"
				/>
				<h3>
					2.4 create a sameday multi-signal entry/exit criteria new backtest
				</h3>
				<h4>2.4.1 Fill in the basic information for the backtest</h4>
				<blockquote>
					<p>
						<br />
						According to your own needs, fill in the relevant parameters of the backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/scoreSetup.png" alt="Set Up Form" title="Set Up Form"/>
				<h4>2.4.2 Fill in the entry criteria</h4>
				<blockquote>
					<p>
						<br />
						SameBar Multi-Signal means that when multiple signals occur at the same bar the backtest criteria is met. Select SameBar Multi-Signal in the drop-down box in the upper right corner of the entry criteria section; then signal1 and signal2 panels will show by default and the default  score value is 2. Clicking on the + sign will increase the number of entry signals and also the score value. The maximum number of signals  in SameBar Multi-Signal selection is 5. Then you can fill in each signal panel corresponding to the entry condition same as single-signal selection.

						<br />
					</p>
				</blockquote>
				<img
					src="../../assets/helpImg/scoreEntry1.png"
					alt="entry signal 1" title="entry signal 1"
				/>
								<img
					src="../../assets/helpImg/scoreEntry2.png"
					alt="entry signal 2" title="entry signal 2"
				/>
				<h4>2.4.3 Fill in the exit criteria</h4>
				<blockquote>
					<p>
						<br />
						SameBar Multi-Signal means that when multiple signals occur at the same bar the backtest criteria is met. Select SameBar Multi-Signal in the drop-down box in the upper right corner of the exit criteria section; then signal1 and signal2 panels will show by default and the default  score value is 2. Clicking on the + sign will increase the number of exit signals and also the score value. The maximum number of signals  in SameBar Multi-Signal selection is 5. Then you can fill in each signal panel corresponding to the exit condition same as single-signal selection.

						<br />
					</p>
				</blockquote>
								<img
					src="../../assets/helpImg/scoreExit1.png"
					alt="exit signal 1" title="exit signal 1"
				/>
								<img
					src="../../assets/helpImg/scoreExit2.png"
					alt="exit signal 2" title="exit signal 2"
				/>
				<h4>2.4.4 Set score value in SameBar Multi-Signal entry/exit criteria</h4>
				<blockquote>
					<p>
						<br />
						Set a value of score to specify how many signals will occur at the same bar to trigger the backtest criteria.
if choose score 1, meanning if any one signal of the selected signals occur the backtest criteria is met.
if choose score 2, meanning if any two of the signals of the selected signals occur the backtest criteria is met. etc.
For example:
If the backtest criteria needs to have a "AND" condition of 2 signals, set two signals below and choose score 2.
If the backtest criteria needs to have a "OR" condition of 2 signals, set two signals below and choose score 1. etc.
						<br />
					</p>
				</blockquote>
							<img
					src="../../assets/helpImg/scoreChange.png"
					alt="change exit score" title="change score"
				/>
				<h4>2.4.5 Run Backtest and view results</h4>
				<blockquote>
					<p>
						<br />
					Click Run Backtest button to run the backtest and view results.
						<br />
					</p>
				</blockquote>
				<h3>
					2.5 create a timeorder multi-signal entry/exit criteria new backtest
				</h3>
				<h4>2.5.1 Fill in the basic information for the backtest</h4>
				<blockquote>
					<p>
						<br />
According to your own needs, fill in the relevant parameters of the backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/periodSetup.png" alt="Set Up Form" title="Set Up Form"/>
				<h4>2.5.2 Fill in the entry criteria</h4>
				<blockquote>
					<p>
						<br />
						TimeOrder Multi-Signal means that when multiple signals occur in time order the backtest criteria is met. Select TimeOrder Multi-Signal in the drop-down box in the upper right corner of the entry criteria section; then signal1 and signal2 panels will show by default and the default  period value is 2. Clicking on the + sign will increase the number of entry signals and also the period value. The maximum number of signals  in SameBar Multi-Signal selection is 3. Then you can fill in each signal panel corresponding to the entry condition same as single-signal selection.
						<br />
					</p>
				</blockquote>
<img src="../../assets/helpImg/periodEntry1.png" alt="entry signal 1" title="entry signal 1"/>
<img src="../../assets/helpImg/periodEntry2.png" alt="entry signal 2" title="entry signal 2"/>
				<h4>2.5.3 Fill in the exit criteria</h4>
				<blockquote>
					<p>
						<br />
					TimeOrder Multi-Signal means that when multiple signals occur in time order the backtest criteria is met. Select TimeOrder Multi-Signal in the drop-down box in the upper right corner of the exit criteria section; then signal1 and signal2 panels will show by default and the default  period value is 2. Clicking on the + sign will increase the number of exit signals and also the period value. The maximum number of signals  in SameBar Multi-Signal selection is 3. Then you can fill in each signal panel corresponding to the exit condition same as single-signal selection.
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/periodExit1.png" alt="exit signal 1" title="exit signal 1"/>
<img src="../../assets/helpImg/periodExit2.png" alt="exit signal 2" title="exit signal 2"/>
				<h4>2.5.4 Set period value in timeorder Multi-Signal entry/exit criteria</h4>
				<blockquote>
					<p>
						<br />
						Set a value to specify how many bars within which the selected signals will occur in time order to trigger the backtest criteria.
if choose score 1, meaning if the selected signals occuring at the samebar the backtest criteria is met.
if choose score 2, meaning if the selected signals occuring within two bars the backtest criteria is met. etc.
For example:
If the backtest criteria needs to have two consecutive signals, set two signals below and choose period 2.
If the backtest criteria needs to have two signals occuring within 3 bars, set two signals below and period 3. etc.
						<br />
					</p>
				</blockquote>
								<img src="../../assets/helpImg/changePeriodEntry.png" alt="change entry period" title="change entry period"/>
<img src="../../assets/helpImg/changePeriodExit.png" alt="change exit period" title="change exit period"/>
				
				<h4>2.5.5 Run Backtest and view results</h4>
				<blockquote>
					<p>
						<br />Click Run Backtest button to run the backtest and view results.
						<br />
					</p>
				</blockquote>

				<h3>
					2.6 set the value of delay of bars
				</h3>
				<h4>2.6.1 set the value of delay of bars in entry criteria</h4>
				<blockquote>
					<p>
						<br />
						Check this option to delay the specified number of bars to enter when the entry criteria is met. Set the value preferred.
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/delayEntry1.png" alt="entry signal 1" title="entry signal 1"/>
				<img src="../../assets/helpImg/delayEntry2.png" alt="entry signal 2" title="entry signal 2"/>
				<h4>2.6.2 set the value of delay of bars in exit criteria</h4>
				<blockquote>
					<p>
						<br />
						Check this option to delay the specified number of bars to exit when the exit criteria is met. Set the value preferred.
						<br />
					</p>
				</blockquote>
                   <img src="../../assets/helpImg/delayExit1.png" alt="exit signal 1" title="exit signal 1"/>
                   <img src="../../assets/helpImg/delayExit2.png" alt="exit signal 2" title="exit signal 2"/>
				<h1>3. Add created backtest to My Favorites</h1>
				<h3>3.1 Open the Backtest History tab</h3>
				<blockquote>
					<p>
						<br />Open the Backtest History tab, choose which backtest you want to add to the favorites, and click the add to favorites button.
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/addFav.png" alt="Add To Favorites" title="Add To Favorites"/>

				<h3>3.2 View backtest in My Favorites</h3>
				<blockquote>
					<p>
						<br />
						Open My Favorites
						tab to view your favorite backtests, where you can remove backtesting collections, edit backtests, and view backtest results.
						<br />
					</p>
				</blockquote>

				<img src="../../assets/helpImg/seeFav.png" alt="View Favorite Backtests" title="View Favorite Backtests"/>
				<h1>4. edit a created backtest</h1>
				<blockquote class="video_link">
					<i class="el-icon-video-play"></i>
					<a href="#">Sample Backtest demo video</a>
				</blockquote>
				<h3>4.1 Open the Backtest History tab</h3>
				<!-- <img src="../../assets/sample-backtests.png" alt="Sample Backtests"> -->
				<blockquote>
					<p>
						<br />
						Open the Backtest History tab, choose which backtest you want to edit, and click the edit backtest button.
						<br />
					</p>
				</blockquote>
				
				<img src="../../assets/helpImg/editHis.png" alt="Edit Backtest" title="Edit Backtest">
				<h3>4.2 Edit in Set Up Backtest</h3>

				<img src="../../assets/helpImg/editEntry.png" alt="Edit Entry Criteria" title="Edit Entry Criteria">
				<img src="../../assets/helpImg/editExit.png" alt="Edit Exit Criteria" title="Edit Exit Criteria">
				<blockquote>
					<p>
						<br />When you click the edit backtest button, the information of the current backtest will be displayed in the form of the Set Up Backtest tab, where you can modify the backtest data. When you're done editing, click Run Backtest
						Run the modified backtest and view the results.
						<br />
					</p>
				</blockquote>
				<h1>5. view result of a created backtest</h1>
				<h3>5.1 Open the Backtest History tab</h3>
				<blockquote>
					<p>
						<br />
Open the Backtest History tab, choose which backtest you want to edit, and click the view backtest results button.
						<br />
					</p>
				</blockquote>
				
				<img src="../../assets/helpImg/toViewResult.png" alt="View Result" title="View Result">
				<h3>5.2 Modify the current backtesting parameters</h3>
				<!-- <img src="../../assets/see-favorites.png" alt="View favorites"> -->
				<blockquote>
					<p>
						<br />
						When you click the button to view the results, Set Up
						Backtest will show the specific parameters of the backtest of the current viewing result, and if you are not satisfied with the results of this backtest, you can return to edit the Set Up Backtest tab, click Run Backtest to run the modified backtest.
						<br />
					</p>
				</blockquote>
								<h1>6. copy a sample backtest</h1>
				<blockquote class="video_link">
					<i class="el-icon-video-play"></i>
					<a href="#">Sample Backtest demo video</a>
				</blockquote>
				<h3>6.1 Open the Sample Backtests tab</h3>
				<blockquote>
					<p>
						<br />
						Open the Sample Backtests tab and click the copy backtest button.
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/copyBacktest.png" alt="Copy Sample Backtest" title="Copy Sample Backtest">
				<h3>6.2 Edit and run a copied backtest</h3>
				<blockquote>
					<p>
						<br />Open the Backtest History tab, choose the copied backtest to edit. Some of the action buttons to the copied backtest are not available because for all copied backtests results can only be viewed after edit and run is completed.
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/editSample.png" alt="Edit Sample Backtest" title="Edit Sample Backtest">

			</section>
			<el-aside>
				<div style="margin: 0px 0 0 77px; font-size: 18px; font-weight: bold">
					directory
				</div>
				<el-tabs
					@tab-click="handleClick"
					v-model="activeName"
					:tab-position="tabPosition"
					style="height: auto"
				>
					<el-tab-pane
						:name="'tab' + index"
						:class="item.lev"
						v-for="(item, index) in navList"
						:key="index"
						:label="item.name"
					></el-tab-pane>
				</el-tabs>
			</el-aside>
			<div class="footer">
				<p>
					Copyright © 2001 - 2022 Sundial Capital Research, Inc. All rights
					reserved.
				</p>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			activeName: 'tab0',
			tabPosition: 'right',
			scroll: '',
			navList: []
		}
	},
	methods: {
		handleClick(tab, event) {
			this.jump(tab.index)
		},
		dataScroll: function () {
			this.scroll =
				document.documentElement.scrollTop || document.body.scrollTop
		},
		jump(index) {
			// let jump = document.querySelectorAll('h1,h2,h3,h4,h5,h6')
			let jump = document.querySelectorAll('h1,h2,h3')
			// 获取需要滚动的距离
			let total = jump[index].offsetTop - 80
			// Chrome
			document.body.scrollTop = total
			// Firefox
			document.documentElement.scrollTop = total
			// Safari
			window.pageYOffset = total
			// $('html, body').animate({
			// 'scrollTop': total
			// }, 400);
		},
		loadScroll: function () {
			let self = this
			let navs = document.querySelectorAll('.el-tabs__item')
			// var sections = document.getElementsByClassName('section');
			for (var i = self.navList.length - 1; i >= 0; i--) {
				if (self.scroll >= self.navList[i].offsetTop - 120) {
					self.activeName = 'tab' + i
					break
				}
			}
		},
		selectAllTitle() {
			// let title = document.querySelectorAll('h1,h2,h3,h4,h5,h6')
			let title = document.querySelectorAll('h1,h2,h3')
			this.navList = Array.from(title)
			this.navList.forEach((item) => {
				item.name = item.innerHTML
			})
			this.navList.forEach((el) => {
				let index = el.localName.indexOf('h')
				el.lev = 'lev' + el.localName.substring(index + 1, el.localName.length)
			})
		}
	},
	watch: {
		scroll: function () {
			this.loadScroll()
		}
	},
	created() {},
	mounted() {
		// scroll代表滚动条距离页面顶部距离
		window.addEventListener('scroll', this.dataScroll)
		this.selectAllTitle()
		this.$nextTick(() => {
			setTimeout(() => {
				let navs = document.querySelectorAll('.el-tabs__item')
				for (let i = navs.length - 1; i >= 0; i--) {
					// console.log($('#'+navs[i].id))
					// 从lev1到lev5分别添加不同到样式
					document.querySelector('#' + navs[i].id).style.padding = '0'
					if (this.navList[i].lev == 'lev1') {
						document.querySelector('#' + navs[i].id).style.paddingLeft = '20px'
					} else if (this.navList[i].lev == 'lev2') {
						document.querySelector('#' + navs[i].id).style.paddingLeft = '30px'
					} else if (this.navList[i].lev == 'lev3') {
						document.querySelector('#' + navs[i].id).style.paddingLeft = '40px'
					} else if (this.navList[i].lev == 'lev4') {
						document.querySelector('#' + navs[i].id).style.paddingLeft = '50px'
						document.querySelector('#' + navs[i].id).style.fontWeight = '400'
					} else if (this.navList[i].lev == 'lev5') {
						document.querySelector('#' + navs[i].id).style.paddingLeft = '60px'
						document.querySelector('#' + navs[i].id).style.fontWeight = '400'
					}
				}
			})
		})
	}
}
</script>
<style lang="less" scoped>
.video_link {
	border-radius: 2px;
	padding: 20px;
	background-color: #e7ecf3;
	width: 40rem;
	margin: 24px 0;
	display: flex;
	align-items: center;
}
.video_link i {
	font-size: 35px;
}
.video_link a {
	padding-left: 16px;
	color: #486491;
	font-weight: 600;
	text-decoration: none;
}
.content {
	margin: 0 auto 0 510px;
	max-width: 1280px;
	padding: 10px;
	position: relative;
}
.menu_logo {
	position: sticky;
	z-index: 999;
	top: 0;
	width: 100%;
	background: #fff;
}
.footer {
	background: #fff;
	display: flex;
	padding: 16px;
	border-top: 1px solid #e5e7eb;
	margin-top: 50px;
}
.footer p {
	text-align: center;
	color: #9ca3af;
	line-height: 21px;
}
.el-main {
	width: 900px;
}
.el-tabs__header.is-right {
	height: 500px !important;
}
.el-aside {
	position: fixed;
	top: 0px;
	left: 10px;
	width: 500px !important;
	height: 98%;
	overflow-y: scroll;
}
.content-container {
	position: relative;
}
scrollbar-track {
	background-color: none;
}
</style>
