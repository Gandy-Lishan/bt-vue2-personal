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

				<h4>1.1.1 如何在图表上改变Symbol</h4>
				<blockquote>
					<p>
						<br/>
						在图表中找到名为symbol的搜索框，在搜索框内选择你想更换的股票，如AAPL。当股票更换后，
						下方表单中的symbol会同步更换。你可以在运行回测时使用它作为回测的股票参数。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/symbolChart.png" alt="Change Symbol" title="Change Symbol"/>
				<h4>1.1.2 如何在图表上改变Sentiment Indicator</h4>
				<blockquote>
					<p>
						<br/>
						在图表中找到名为Sentiment Indicator的搜索框，列表项的右侧会有每个indicator的周期，选择你想更换的indicator，如Smart Money Confidence。当indicator更换后，会在图表下方显示相应的曲线图，
						下方表单中的Entry Criteria 和 Exit Criteria会自动填充到表单中，但是不会覆盖表单中已经选择的indicator。你可以在运行回测时使用它作为回测的indicator。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/changeSenti.png" alt="Change Sentiment Indicator" title="Change Sentiment Indicator"/>
				<h4>1.1.3 如何在图表上改变Technical Indicator</h4>
				<blockquote>
					<p>
						<br/>
						在图表中找到名为Studies的下拉选项，在搜索框内选择你想更换的indicator，如Commodity Channel Index 。当indicator更换后，会在图表下方显示相应的曲线图，
						。在图表上选择的Technical Indicators并不会像选择Sentiment Indicators一样，填充到Entry Criteria 和 Exit Criteria，如果你想在回测中使用Technical Indicators，
						可以直接在表单中选择。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/changeTech.png" alt="Change Technical Indicator" title="Change Technical Indicator"/>
				<h4>1.1.4 如何在图表上改变图表类型</h4>
				<blockquote>
					<p>
						<br/>
						在图表中找到名为Display的下拉选项，在下拉框内选择你想更换的Style，如Bar 。当Chart Style更换后，会在图表下方显示对应类型的曲线样式，
						。需要注意的是，图表的类型是根据indicator来决定的，例如有些indicator只支持Candle Style.
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/changeStyle.png" alt="Change Chart Style" title="Change Chart Style"/>
				<h4>1.1.5 如何在图表上改变图表周期</h4>
				<blockquote>
					<p>
						<br/>
						在图表中找到名为1D的下拉选项，其中1D表示Daily，1W表示Weekly，1M表示Monthly，在下拉框内选择你想更换的周期，如1W 。图表中的股票周期有以及Set Up Backtest标签页下的表单会随着周期的更改而更改
						，你可以在创建回测时使用它作为回测的timeframe参数。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/chartTime.png" alt="Change Frequecy" title="Change Frequecy"/>
				<h4>1.1.6 如何改变图表主题</h4>
				<blockquote>
					<p>
						<br/>
						在图表中打开设置，在设置中找到Themes,目前图表有两种主题，Dark 和 Light，你可以根据个人喜好进行更换。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/changeTheme.png" alt="Change Chart Themes" title="Change Chart Themes"/>
				<h4>1.1.7 如何一键清除图表内容</h4>
				<blockquote>
					<p>
						<br/>
						当你在图表中选择了多个indicator,你可以点击图表下方的Clear Chart按钮一键清除图表。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/clearChart.png" alt="Clear Chart" title="Clear Chart"/>

								<h4>1.1.8 如何隐藏股票信息提示框</h4>
				<blockquote>
					<p>
						<br/>
						当你的鼠标移入股票曲线框时，会出现蓝色的信息提示框，如果你不需要它，可以点击信息按钮关闭它。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/hideInfo.png" alt="Hide Information" title="Hide Information"/>
				
				<h4>1.1.9 如何隐藏图表网格线</h4>
				<blockquote>
					<p>
						<br/>
						图表会默认显示x轴和y轴的网格线，如果你不需要它，可以点击Grid按钮隐藏它。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/hideGrid.png" alt="Hide Grid" title="Hide Grid"/>
				<h4>1.1.10 如何隐藏Last Price</h4>
				<blockquote>
					<p>
						<br/>
						图表会默认显示最后一个Bar的Price，如果你不需要它，可以点击Last Price按钮隐藏它。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/hidePrice.png" alt="Hide Last Price" title="Hide Last Price"/>

				<h4>1.1.11 添加股票到收藏夹</h4>
				<blockquote>
					<p>
						<br/>
						点击股票名称右侧的Add to Favorites按钮，将股票添加到收藏夹。这个时候可以点击Symbol搜索框查看收藏夹中的股票。
						<br/>
					</p>
				</blockquote>
				<img src="../../assets/helpImg/hidePrice.png" alt="Hide Last Price" title="Hide Last Price"/>

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
