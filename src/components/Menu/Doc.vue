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
				<h1>Easy to get started backtest</h1>
				<p>
Here you can set the parameters of the backtesting system, such as the initial amount, slippage, start time and end time, etc., and then select
					Different stock portfolios. The system simulates the real financial market based on the filled parameters
					The trading rules carry out model buy and model sell, and data such as the number of trades and profitability are obtained.
				</p>
				<p>The documentation will teach you how to use the backtesting system in a video and graphic combination, now let's get started!</p>

				<h1>1. Describes the backtesting system</h1>

				<h3>1.1 Chart section</h3>
				<blockquote class="video_link">
					<i class="el-icon-video-play"></i>
					<a href="#">Introduction to chart operations</a>
				</blockquote>

				<blockquote>
					<p>
						<br />
						Charts can not only reflect the movement of stocks, but also support chart interface interaction. In the chart, you can modify the backtested symbol in the chart
						You can add your favorite indicators to favorites in the chart; you can customize the indicator in the chart
						properties, such as the extremum and the color of the extremum curve; you can select indicator
						Period (Daily, Weekly, Monthly);
						You can change the theme of the icon in the chart settings (there are currently two themes of Dark and light); The clear chart below the chart is achievable
						One-click clear chart; charts also support adding and removing background gridlines and removing last
						price tag, but also with other visual aids.
						<br />
					</p>
				</blockquote>
				<img src="../../assets/helpImg/chart.png" alt="Chart" />

				<h3>1.2 Form section</h3>
				<blockquote>
					<p>
						<br />
						The form section has four tabs, and the Set up Backtest tab is used for Backtest
						Of the Creation, the Backtest History tab displays all created backtests; Backtest Results
						Used to show the results of a backtest; My Favorites
						The Sample Backtest tab shows backtests for adding favorites; the Sample Backtest tab provides some Sample Backtests that you can copy and use in Backtest History.
						<br />
					</p>
				</blockquote>

				<img src="../../assets/helpImg/form.png" alt="Form" />

				<h1>2. How to create a backtest</h1>
				<blockquote class="video_link">
					<i class="el-icon-video-play"></i>
					<a href="#">Demonstration of the backtest creation process</a>
				</blockquote>
				<h3>2.1 create a single-signal entry/exit criteria new backtest</h3>
				<h4>2.1.1 Fill in the basic parameters of the backtest</h4>
				<blockquote>
					<p>
						<br />Open the Set up Backtest tab and fill in the basic information for the backtest, including Starting
						Capital、Commission、Benchmark、Backtest
						History.... If you don't know what each field means,
						You can move the mouse over the question mark and the prompt box explains the meaning of each field.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/single-setup-demo.png"
					alt="Set Up Form"
				/> -->

				<h4>2.1.2 Fill in the entry criteria</h4>
				<blockquote>
					<p>
						<br />
						Select a Sentiment Indicator or Technical in the drop-down box
						Indicator, fill in the indicator value. To make sure your indicators have a payoff, for Sentiment
						Indicator We recommend that you fill out Extreme Optimism and Extreme Pessimism
						The value between.
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-entry.png" alt="Entry Criteria" /> -->

				<h4>2.1.3 Fill in the exit criteria</h4>
				<blockquote>
					<p>
						<br />
You can select a Sential Indicator or Technical in the exit criteria
						Indicator, fill in the indicator value. For Technical
						Indicator We recommend that you fill in the indicator values in conjunction with the chart.
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-exit.png" alt="Exit Criteria" /> -->
				<h4>2.1.4 Run the policy and view the results</h4>

				<blockquote>
					<p>
						<br />
When you're done filling out the form, click Run Backtest
						button to run and view the results, running a backtest will take a certain amount of time, please be patient. After the backtesting run ends, it jumps automatically
						to Backtest Results
						The tab displays the data after the successful backtesting operation, including the number of transactions, buy points and sell points. If you create a backtest without trading, you can be in
						Backtest History
						tab, click the Edit button, modify the backtest data, save and rerun.
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-result.png" alt="Summary" /> -->
				<h3>2.2 set stop/loss in exit criteria</h3>
				<h4>2.2.1 Check Stop Loss in the Backtesting Basics</h4>
				<blockquote>
					<p>
						<br />Open the Set up Backtest tab, fill in the basic information of the backtest, and check Rise Control at
						Exit, in the pop-up Take Profit, Stop Loss, Time In Market, only check Stop
						Loss, you can fill in the corresponding value according to your needs, you can also use the default value of 10%.
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/stoploss-setup.png" alt="Set Up Form" /> -->
				<h4>2.2.2 Fill in the entry conditions</h4>
				<blockquote>
					<p>
						<br />
						Select Single Signal in the drop-down box in the upper right corner of the entry condition (you can also choose Summerbar Multi-Signal or Timeorder Multi-Signal, multi-signal also supports Stop Loss) and fill in the signal indicator.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/single-change-criteria.png"
					alt="Set Up Form"
				/> -->
				<h4>2.2.3 Select Early Use Risk Control in the exit criteria</h4>
				<blockquote>
					<p>
						<br />When you fill in the basic information for the backtest, tick Risk Control at
						At the same time as Exit, at least check a Take Profit/Stop Loss/Time In Market, then there will be more Than use Risk in the drop-down box
						Control this option. You can select Only in the drop-down option in the upper right corner of the exit condition
						Use Risk Control, which means that the Stop Loss value will be used as your exit condition. You can also choose
						In addition to the other next options of The Use Risk Control, such as Single-Signal, choosing Single-Signal means the sum of signals in Single-Signal
						Stop Loss will be your exit condition.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/single-only-stoploss.png"
					alt="Set Up Form"
				/> -->
				<h4>2.2.4 Run a backtest and view the results</h4>
				<blockquote>
					<p>
						<br />
						Click the Run Backtest button to run the exit using Stop Loss's strategy to see the results.
						<br />
					</p>
				</blockquote>

				<h3>2.3 set time-in-market in exit criteria</h3>
				<h4>2.3.1 Check Time In Market in Backtesting Basics</h4>
				<blockquote>
					<p>
						<br />
						Open the Set up Backtest tab, fill in the basic information of the backtest, and check Rise Control at
						Exit, in the pop-up Take Profit, Stop Loss, Time In Market, only tick Time In
						Market, you can fill in the corresponding value according to your needs, you can also use, the default value of 120
						Bars。
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/single-tim-setup.png"
					alt="Set Up Form"
				/> -->
				<h4>2.3.2 Fill in the entry exit criteria</h4>
				<blockquote>
					<p>
						<br />
						Select Single Signal in the drop-down box in the upper right corner of the entry condition (you can also choose Summerbar Multi-Signal or Timeorder Multi-Signal, Multi Signal also supports Time In Market) and fill in the Signal Indicator.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/single-change-criteria.png"
					alt="Set Up Form"
				/> -->
				<h4>2.3.3 Select Early Use Risk Control in the exit criteria</h4>
				<blockquote>
					<p>
						<br />
						When you fill in the basic information for the backtest, tick Risk Control at
						At the same time as Exit, at least check a Take Profit/Stop Loss/Time In Market, then there will be more Than use Risk in the drop-down box
						Control this option. You can select Only in the drop-down option in the upper right corner of the exit condition
						Use Risk Control, which means that the Time In Market value will be used as your exit condition. You can also choose
						In addition to the other next options of The Use Risk Control, such as Single-Signal, choosing Single-Signal means signaling and Time In in Single-Signal
						The Market will be your exit condition
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-tim-exit.png" alt="Set Up Form" /> -->
				<h4>2.3.4 Run a backtest and view the results</h4>
				<blockquote>
					<p>
						<br />
						Click the Run Backtest button to run exit using Time In Market's strategy to view the results.
						<br />
					</p>
				</blockquote>

				<h3>2.4 set different backtest timeframe</h3>
				<h4>2.4.1 Modify the timeframe in the backtesting basics</h4>
				<blockquote>
					<p>
						<br />
						Open the Set up Backtest tab, fill in the basic information of the backtest, and modify the Timeframe
						The value of Weekly, you can also modify it to Montthly, there are three options in total: Daily, Weekly, and Monthly.
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-timframe.png" alt="Set Up Form" /> -->
				<h4>2.4.2 Fill in the entry and exit conditions</h4>
				<blockquote>
					<p>
						<br />
						Fill in the entry and exit conditions according to your needs.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/timeframe-criteria.png"
					alt="Set Up Form"
				/> -->
				<h4>2.4.3 Run a backtest and view the results</h4>
				<blockquote>
					<p>
						<br />
						Click the Run Backtest button to run the policy that modifies the Timeframe and view the results.
						<br />
					</p>
				</blockquote>
				<h3>
					2.5 create a sameday multi-signal entry/exit criteria new backtest
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
				<!-- <img src="../../assets/helpImg/single-timframe.png" alt="Set Up Form" /> -->
				<h4>2.5.2 Fill in the entry conditions</h4>
				<blockquote>
					<p>
						<br />
						Select SameBar Multi-Signal in the drop-down box in the upper right corner of the entry signal,
						Then the signal1 and Signal2 signal panels will pop up by default, and the default Score value is 2. Clicking on the + sign below the SameBar Multi-Signal increases the entry signal and the score value.
						When SameBar Multi-Signal is selected, the entry can only be increased to a maximum of 5 signals. Next, you need to fill in each signal panel corresponding to the entry condition as if filling out a single signal.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/timeframe-criteria.png"
					alt="Set Up Form"
				/> -->
				<h4>2.5.3 Fill in the exit criteria</h4>
				<blockquote>
					<p>
						<br />
						Select SameBar Multi-Signal in the drop-down box in the upper right corner of the exit signal,
						Then the signal1 and Signal2 signal panels will pop up by default, and the default Score value is 2. Clicking the + sign below the SaveBar Multi-Signal increases the exit signal and the score value.
						When SamBar Multi-Signal is selected, the exit can only be increased to a maximum of 5 signals. Next, you need to fill in each signal panel corresponding to the exit condition as if you were filling out a single signal.
						<br />
					</p>
				</blockquote>
				<h4>2.5.4 Run a backtest and view the results</h4>
				<blockquote>
					<p>
						<br />
						Click the Run Backtest button to run using The SaveBar
						Multi-Signal backtests, and view the results.
						<br />
					</p>
				</blockquote>
				<h3>
					2.6 create a timeorder multi-signal entry/exit criteria new backtest
				</h3>
				<h4>2.6.1 Fill in the basic information for the backtest</h4>
				<blockquote>
					<p>
						<br />
According to your own needs, fill in the relevant parameters of the backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-timframe.png" alt="Set Up Form" /> -->
				<h4>2.6.2 The entry condition is TimeOrder Multi-Signal</h4>
				<blockquote>
					<p>
						<br />
						Select TimeOrder Multi-Signal in the drop-down box in the upper right corner of the entry signal,
						Then the signal1 and Signal2 signal panels will pop up by default, and the default Period value is 2. Clicking on the + sign below the TimeOrder Multi-Signal increases the entry signal and the value of period increases.
						When TimeOrder Multi-Signal is selected, the entry can only be increased to a maximum of 3 signals. Next, you need to fill in each signal panel corresponding to the entry condition as if filling out a single signal.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/timeframe-criteria.png"
					alt="Set Up Form"
				/> -->
				<h4>2.6.3 The exit condition is TimeOrder Multi-Signal</h4>
				<blockquote>
					<p>
						<br />
					Select TimeOrder Multi-Signal in the drop-down box in the upper-right corner of the exit signal,
						Then the signal1 and Signal2 signal panels will pop up by default, and the default Period value is 2. Clicking the + sign below the TimeOrder Multi-Signal increases the exit signal and the value of Period.
						When TimeOrder Multi-Signal is selected, the exit can only be increased to a maximum of 3 signals. Next, you need to fill in each signal panel corresponding to the exit condition as if you were filling out a single signal.
						<br />
					</p>
				</blockquote>
				<h4>2.6.4 Run a backtest and view the results</h4>
				<blockquote>
					<p>
						<br />
						Click the Run Backtest button to run using TimeOrder
						Multi-Signal backtests, and view the results.
						<br />
					</p>
				</blockquote>
				<h3>
					2.7 set score value in sameday multi-signal entry/exit criteria
				</h3>
				<h4>2.7.1 Fill in the basic information for the backtest</h4>
				<blockquote>
					<p>
						<br />
							According to your own needs, fill in the relevant parameters of the backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-timframe.png" alt="Set Up Form" /> -->
				<h4>2.7.2 Modify the value of the Score in the entry condition</h4>
				<blockquote>
					<p>
						<br />
						Select Sambar Multi-Signal in the drop-down box in the upper right corner of the entry signal,
						Then the signal panels of Signal1 and Signal2 will pop up by default, the current Score value is 2 (the Score value is equal to the number of incoming signals by default), if you don't want to use the current Score value, you can fill in an integer greater than 1 less than the number of entry signals. Next you need
						Fill in each signal panel corresponding to the entry condition.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/timeframe-criteria.png"
					alt="Set Up Form"
				/> -->
				<h4>2.7.3 在退场条件中修改Score的值</h4>
				<blockquote>
					<p>
						<br />
						Modify the value of the Score in the exit condition
						<br />
					</p>
				</blockquote>
				<h4>2.7.4 Run a backtest and view the results</h4>
				<blockquote>
					<p>
						<br />
						Click the Run Backtest button to run a custom Score multi-signal backtest and view the results.
						<br />
					</p>
				</blockquote>
				<h3>
					2.8 set period value in timeorder multi-signal entry/exit criteria
				</h3>
				<h4>2.8.1 Fill in the basic information for the backtest</h4>
				<blockquote>
					<p>
						<br />
						According to your own needs, fill in the relevant parameters of the backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-timframe.png" alt="Set Up Form" /> -->
				<h4>2.8.2 Modify the value of Period in the entry condition</h4>
				<blockquote>
					<p>
						<br />
						Select TimeOrder Multi-Signal in the drop-down box in the upper right corner of the entry signal,
						Then by default, the signal panels of Signal1 and Signal2 will pop up, the current Period value is 2 (the Period value is equal to the number of entry signals by default), if you do not want to use the current Period value, you can fill in any integer greater than 1. Next you need
						Fill in each signal panel corresponding to the entry condition.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/timeframe-criteria.png"
					alt="Set Up Form"
				/> -->
				<h4>2.8.3 Modify the value of Period in the exit condition</h4>
				<blockquote>
					<p>
						<br />
						Select TimeOrder Multi-Signal in the drop-down box in the upper-right corner of the exit signal,
						Then the signal panels of Signal1 and Signal2 will pop up by default, the current Period value is 2 (the Period value defaults to equal to the number of exit signals), if you do not want to use the current Periodic value, you can fill in any integer greater than 1. Next you need
						Fill in each signal panel corresponding to the exit condition.
						<br />
					</p>
				</blockquote>
				<h4>2.8.4 Run a backtest and view the results</h4>
				<blockquote>
					<p>
						<br />
						Click the Run Backtest button to run a custom Period multi-signal backtest and view the results.
						<br />
					</p>
				</blockquote>

				<h3>
					2.9 set a delay of entry/exit criteria
				</h3>
				<h4>2.9.1 Fill in the basic information for the backtest</h4>
				<blockquote>
					<p>
						<br />
						According to your own needs, fill in the relevant parameters of the backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/single-timframe.png" alt="Set Up Form" /> -->
				<h4>2.9.2 Modify the Layer of Bars in the entry conditions</h4>
				<blockquote>
					<p>
						<br />
						Select any option in the drop-down box in the upper right corner of the entry signal, such as The Flamebar Multi-Signal, and tick TheLay of Bars in the entry conditions. The Delay of Bars defaults to 1, and you can enter a number greater than 0 to modify the value of The Delay of Bars.
						<br />
					</p>
				</blockquote>
				<!-- <img
					src="../../assets/helpImg/timeframe-criteria.png"
					alt="Set Up Form"
				/> -->
				<h4>2.9.3 Modify the Layer of Bars in the exit conditions</h4>
				<blockquote>
					<p>
						<br />Select any option in the drop-down box in the upper-right corner of the exit signal, such as TimeOrder Multi-Signal, and then tick TheLay of Bars in the exit conditions. The Delay of Bars defaults to 1, and you can enter a number greater than 0 to modify the value of The Delay of Bars.
						<br />
					</p>
				</blockquote>
				<h4>2.9.4 Run a backtest and view the results</h4>
				<blockquote>
					<p>
						<br />
						Click the Run Backtest button to run a backtest with The Layer of Bars and see the results.
						<br />
					</p>
				</blockquote>
				<h1>3. add backtest to my favorites</h1>
				<h3>3.1 Open the Backtest History tab</h3>
				<blockquote>
					<p>
						<br />Find out which backtest you want to add to the favorites, click the add to favorites button,
						to add backtesting to your favorites.
						<br />
					</p>
				</blockquote>
				<!-- <img src="../../assets/helpImg/add-fa.png" alt="Add To Favorites" /> -->

				<h3>3.2 View backtesting in favorites</h3>
				<blockquote>
					<p>
						<br />
						Open My Favorites
						tab to view your favorite backtests, where you can remove backtesting collections, edit backtests, and view backtest results.
						<br />
					</p>
				</blockquote>

				<!-- <img src="../../assets/helpImg/fa-list.png" alt="View favorites" /> -->
				<h1>4. edit a sample backtest</h1>
				<blockquote class="video_link">
					<i class="el-icon-video-play"></i>
					<a href="#">Sample Backtest demo video</a>
				</blockquote>
				<h3>4.1 Open the History Backtests tab</h3>
				<!-- <img src="../../assets/sample-backtests.png" alt="Sample Backtests"> -->
				<blockquote>
					<p>
						<br />
						Open the History Backtests tab, which houses all the created, copied, and edited backtests, find the backtest you want to edit in the list, and click the edit backtest button.
						<br />
					</p>
				</blockquote>
				<h3>4.2 Edit in Set Up Backtest</h3>
				<!-- <img src="../../assets/copy-backtests.png" alt="Copy Backtests"> -->
				<blockquote>
					<p>
						<br />When you click the edit backtest button, the information of the current backtest will be displayed in the form of the Set Up Backtest tab, where you can modify the backtest data. When you're done editing, click Run Backtest
						Run the modified backtest and view the results.
						<br />
					</p>
				</blockquote>
				<h1>5. view result of a created backtest</h1>
				<h3>5.1 Open the Backtest History tab</h3>
				<!-- <img src="../../assets/history-add-favorite.png" alt="Add To Favorites"> -->
				<blockquote>
					<p>
						<br />
Find out the backtest you want to see the results of, click the view backtest results button,
						It is possible to view the results of the current backtesting.
						<br />
					</p>
				</blockquote>
				<h3>5.2 Modify the current backtesting parameters</h3>
				<!-- <img src="../../assets/see-favorites.png" alt="View favorites"> -->
				<blockquote>
					<p>
						<br />
						When you click the button to view the results, Set Up
						Backtest will show the specific parameters of the backtest of the current viewing result, and if you are not satisfied with the results of this backtest, you can return to Set
						Edit the Up Backtest tab, click Run Backtest to run the modified backtest.
						<br />
					</p>
				</blockquote>
								<h1>6. copy a sample backtest</h1>
				<blockquote class="video_link">
					<i class="el-icon-video-play"></i>
					<a href="#">Sample Backtest demo video</a>
				</blockquote>
				<h3>6.1 Open the Sample Backtests tab</h3>
				<!-- <img src="../../assets/sample-backtests.png" alt="Sample Backtests"> -->
				<blockquote>
					<p>
						<br />
						Open the Sample Backtests tab and click the copy backtest button.
						<br />
					</p>
				</blockquote>
				<h3>6.2 Edit and run in Backtest History</h3>
				<!-- <img src="../../assets/copy-backtests.png" alt="Copy Backtests"> -->
				<blockquote>
					<p>
						<br />Open the Backtest History tab and click the edit backtest button to copy
						Sample Backtest for editing. You can see that part of the button is not available, that's because of all
						The copied backtest must be edited before you can view the results.
						<br />
					</p>
				</blockquote>
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
	height: 99%;
	overflow-y: scroll;
}
.content-container {
	position: relative;
}
scrollbar-track {
	background-color: none;
}
</style>
