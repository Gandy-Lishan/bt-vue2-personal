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
			<section v-if="id[0] == '0'">
				<!-- Section 1 内容 -->
				<h1 id="0">
					<img
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAABH1JREFUSA3tVl1oHFUUPmdmd2ltklqbpJDiNnXFmgbFktho7YMPNiJSSZM0+CAYSkUELVhM6YuwIPpgoOKDqOBDC0XE2CQoNtQXBUFTTcCi+Wlh1V2TQExsUzcltd3M9Tt3ZjZzZ2fT+OJTL8yeM+eee757fmeJbq//KQL8X3DUSFOcfr7cRsRtxNQMWueeVzOkaITIGqQHNg5y8+jNW9ldM7A6nTpAjuolUikAwq7CE3WcM2RRDz+XGVgN3FptU/aUSlvq9Pa3iZ1+sgAqJyyAFqkipd9dqiwHF3P65YycLWc/6sqGrvoEoIp6DOFaX5h6+dnfjkWprwqsPk0dUGq5vySwDImC10KxFHgGL1SWoc92O3eVht09qdXNH11I2SsTsJYqMWzihqGMi+A+Garf3BAuuLI5oGlULyNfyB/HYNujwktOfRrMr5t77NmevqaUopx0grnKAyvVpmwUDB4x6FPXuGvYLTDwWsejwgtgkYKPqRJg8SV6xaiZ3ZTppGneS4yfH5/66fZSDHv+QZci/+h5c5UHtpy67JUqGppM0sh0Nc1dW6/N1W5Yoqat8/TU/VnadmdeW2PLLSyh0cvxBs3KbqTmwYPpxN4do/mzE8nEpvX/UMu2Wbp74zUAK5q6WkHns7V0eWkdPbPzd3rxkTGybadYySumVzhcaJFbs5UrEkQ/+CK8gF5dnh/6ciIZ73gwQ927L1IitoxKLXYP3SjYdOrHHfTZhRRlFyrorafPk20B3HPD1y2G3qKZME5Jcf3t/HUC13/8tSd++vqFveMUTwAUxSUFI1QekR1+bIze3D9MF2aq6cPvG72CgnldWCFqyRw3lwH8ZMerjTD9ElRO7Gv44wNpC90aASqGfVlz/Rx17srQ57/UU26hkhQqUB7dBR71WmzQhHUnblGmVOEw0jhbV1n9OlXUDCIRGaNV5Jp43N516fN7JmnTHdfp7Hgy0luO4aMhtkLL8Bi3bUWYvzh5Mn1dTxrL6QmGuRhGL/TiTTxRoEdTszSaq9GR0NGA3KdkOz3hqSV3MIDhQ5IVX/Ivx3umBti2es2h4eZby7x8br1rkf7Mo90AqC8aQ3sJeNzqFRu+vSANAQe3PL7l0HGOAdwDCeZYvNKeoZp1Qfs6Aipndh86HmFRi0LAnEO47wsqM6cdfjh3jBPUzhZy7nvlUfFsamED1VQt6aISHVymXZ/B2aCtIG8AI8xfobj2d3en1wWVhOeHELKmLQ1s211s88comkv4UCwWyF787mJdYXtNfhKAXVqnKTq8QZvGAGGOfaTo5pGZ/PwbUCr5+DPr/1J92JNHr9aOl/F3iI5+O1nfybsGxoimvZ3ViWSluDITw3P37mypheDIPY0tw7+O/5ApbkYw+zpfaUVu32Pi98+defdUhEpZkRFq0aqyNh9FuL9hpYbEm6iwi0z2REd09ZmyENEbuhjDWzKvZXTqKYaBIr3tt5kuPtQBZFvEUwHt60vfCNu41XsksH9Ij1BMMz1Y0OOunHNShFIP5868g5zeXmuLwL9T4b6Q2+KejgAAAABJRU5ErkJggg=="
					/>
					Brief introduction of BacktestEdge
				</h1>
				<section>
					<h2 id="0-0">Chart section</h2>
					<hr />
					<p>
						In the chart section of BacktestEdge, users can select stock/index/ETF
						symbol to be backtested and add to favorites; select sentiment
						indicators and add to favorites; select technical indicators and
						modify settings; select timeframe among Daily/Weekly/Monthly; select
						the Day/Night theme of chart.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						:src="chartPath"
						:preview-src-list="chartPreList"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-0">How to change Symbol on a chart</h3>
					<p>
						Find the search box named 'Symbol' in the chart and select the
						symbol you want to replace, such as AAPL, within the search box.
						When the symbol is replaced, The symbol in the form below will be
						replaced synchronously. You can use it as a symbol parameter for
						backtesting when running a backtest.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path010"
						:preview-src-list="path010List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-1">How to change the Sentiment Indicator on a chart</h3>
					<p>
						Find the search box named 'Select Sentiment Indicators' in the
						chart, and to the right of the list item there will be a cycle for
						each indexer, select the indexer you want to replace, such as Smart
						Money Confidence. When the indexer is replaced, the corresponding
						graph will be displayed below the chart, The Entity Criteria and
						Exit Criteria in the form below are automatically populated into the
						form, but do not overwrite the indexer already selected in the form.
						You can use it as an indexator for backtesting when running
						backtesting.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path011"
						:preview-src-list="path011List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-2">How to change the Technical Indicator on a chart</h3>
					<p>
						Find a drop-down option called 'Studies' in the chart and select the
						indexer you want to replace in the search box, such as the
						Connectivity Channel Index. When the indexer is replaced, the
						corresponding graph will be displayed below the chart, The Technical
						Indicators selected on the chart are not populated with The Entry
						Criteria and Exit Criteria as the Selection Indicators are selected,
						and if you want to use Technical Indicators in backtesting, You can
						select directly from the form.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path012"
						:preview-src-list="path012List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-3">How to change the chart type on a chart</h3>
					<p>
						Find a drop-down option called 'Display' in the chart and select the
						Style you want to replace, such as Bar, in the drop-down box. When
						the Chart Style is replaced, the corresponding type of curve style
						will be displayed below the chart. It should be noted that the type
						of chart is determined by the indexer, for example some indexers
						only support the Candle Style.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path013"
						:preview-src-list="path013List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-4">How to change the chart timeframe on a chart</h3>
					<p>
						Find the drop-down option named 1D in the chart, where 1D represents
						Daily, 1W means Weekly, 1M represents Montthly, and inside the
						drop-down box select the timeframe you want to replace, such as 1W.
						The stock cycle in the chart has and the form under the Set Up tab
						changes as the timeframe changes , you can use it as a timeframe
						parameter for backtesting when creating a backtest.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path014"
						:preview-src-list="path014List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-5">How to change the chart theme</h3>
					<p>
						Open Settings in the chart, find Themes in the settings, there are
						currently two themes for the chart, Dark and Light, which you can
						change according to your personal preferences.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path015"
						:preview-src-list="path015List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-6">How to clear chart contents with one click</h3>
					<p>
						When you have selected multiple indexers in the chart, you can clear
						the chart by clicking the Clear Chart button below the chart.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path016"
						:preview-src-list="path016List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-7">How to hide the symbol information prompt box</h3>
					<p>
						When you move your mouse into the symbol curve box, a blue message
						box will appear, and if you don't need it, you can click the
						information button to close it.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path017"
						:preview-src-list="path017List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-8">How to show chart gridlines</h3>
					<p>
						The chart will not display the gridlines of the x-axis and y-axes by
						default, if you need it, you can click the Grid button to show it.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path018"
						:preview-src-list="path018List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-9">How to show Last Price</h3>
					<p>
						The chart will not show the Price of the last Bar by default, if you
						need it, you can click the Last Price button to show it.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path019"
						:preview-src-list="path019List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-10">Add symbols to favorites</h3>
					<p>
						Click the Add to Favorites button to the right of the symbol name to
						add the symbol to your favorites. At this time, you can click on the
						Symbol search box to view the symbols in the favorites.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path0110"
						:preview-src-list="path0110List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-11">Add The Sentiment Indicator to Favorites</h3>
					<p>
						Feel free to choose an Indexer in the Sentiment Indicator search
						box, such as Smart Money Confidence. Place the mouse over the
						selected graph and right-click on the one that appears Click add to
						Favorites Indicators in the menu item to add the current stock to
						the indicator favorites. If you want to see the Sentiment Indicator
						in your favorites, you can click here Sentiment Indicator search box
						view.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path0111"
						:preview-src-list="path0111List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-12">
						How to modify the extremum of the Sentiment Indicator
					</h3>
					<p>
						Feel free to choose an Indexer in the Sentiment Indicator search
						box, such as Smart Money Confidence. Place the mouse over the
						selected graph and right-click on the one that appears Click edit
						settings in the menu item, in which you can change the extremum of
						the indicator and you can also change the color of the extremum
						curve. If your Entry Indicator is the same as the indexer for
						editing extremums on the chart, Then when the extremum on the form
						changes, the corresponding extremum on the form will also change.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path0112"
						:preview-src-list="path0112List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-13">
						How to modify the property settings of the Technical Indicator
					</h3>
					<p>
						In clicking on the Studios option, select any Technical Indicator in
						the drop-down search box, such as the Commodity Channel Index. Move
						your mouse over the Technical Indicator curve you just selected and
						right-click on the occurrence You can modify the properties of the
						current indicator here, such as Period (for modifying the period of
						the curve), Result (for modifying the color of the curve), Excessive
						Optimism (you can modify the color of The Excelssive Optimism),
						Excessive Pessimism (you can modify the color of the Expossage
						Pessimism)
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path0113"
						:preview-src-list="path0113List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-14">How to show Range Selector</h3>
					<p>
						There is a 'Range Select' below the chart, and you can drag the
						selector to see the chart curves within a specified range. But the
						chart will not show Range Select, If you want to show it, you can
						check 'Range Selector' in the settings
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path0114"
						:preview-src-list="path0114List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-15">Set Y-Axis Preferences</h3>
					<p>
						In the chart you can set Y-Axis Preferences, just open the settings,
						find the Y-Axis Preferences section, the chart provides two kinds of
						Preferences. Tick Log Scale to think Your stock graph will grow
						according to the curve, give invert and your stock graph will flip.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path0115"
						:preview-src-list="path0115List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-16">How to delete a specified Indexer in a chart</h3>
					<p>
						To delete a specified Indexor in the chart, you can click on the X
						sign in the upper left corner of the indicator to delete, or you can
						move the mouse over the indicator you want to delete, right-click,
						and drop down the menu Select Delete Indicator to delete the current
						indicator.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path0116"
						:preview-src-list="path0116List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="0-1-17">
						How to view the timeframe of an indicator on a chart
					</h3>
					<p>
						In the search box of the Sentiment Indicator, enter the indicator
						you want to find, such as "Smart Money Confidence". In the dropdown
						menu of search results, located on the right side, you will see the
						corresponding indicator's timeframe displayed.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path0117"
						:preview-src-list="path0117List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="0-1">Form section</h2>
					<hr />
					<p>
						The BacktestEdge form is divided into three parts: Backtest
						Information, Entry Criteria, and Exit Criteria. The Backtest
						Information section allows you to fill in parameters for backtesting
						such as Commission, Slippage, Starting Capital, and more. The Entry
						Criteria and Exit Criteria sections allow you to set conditions for
						triggering entry and exit during backtesting. We support both
						single-condition and multi-condition conditions, as well as the
						option to use only risk control at exits. Additionally, you can fill
						in the Delay Of Bars, Score (applicable for multi-condition), and
						Period (applicable for multi-condition) based on your needs. If
						you're unsure about the meaning of each parameter, you can hover
						over the question mark icon next to the parameter, and a pop-up
						window will explain its meaning and purpose.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path01"
						:preview-src-list="path01List"
						fit="fill"
						lazy
					></el-image>
				</section>
			</section>
			<section v-else-if="id[0] == '1'">
				<!-- Section 1 内容 -->
				<h1 id="1">
					<img
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAABH1JREFUSA3tVl1oHFUUPmdmd2ltklqbpJDiNnXFmgbFktho7YMPNiJSSZM0+CAYSkUELVhM6YuwIPpgoOKDqOBDC0XE2CQoNtQXBUFTTcCi+Wlh1V2TQExsUzcltd3M9Tt3ZjZzZ2fT+OJTL8yeM+eee757fmeJbq//KQL8X3DUSFOcfr7cRsRtxNQMWueeVzOkaITIGqQHNg5y8+jNW9ldM7A6nTpAjuolUikAwq7CE3WcM2RRDz+XGVgN3FptU/aUSlvq9Pa3iZ1+sgAqJyyAFqkipd9dqiwHF3P65YycLWc/6sqGrvoEoIp6DOFaX5h6+dnfjkWprwqsPk0dUGq5vySwDImC10KxFHgGL1SWoc92O3eVht09qdXNH11I2SsTsJYqMWzihqGMi+A+Garf3BAuuLI5oGlULyNfyB/HYNujwktOfRrMr5t77NmevqaUopx0grnKAyvVpmwUDB4x6FPXuGvYLTDwWsejwgtgkYKPqRJg8SV6xaiZ3ZTppGneS4yfH5/66fZSDHv+QZci/+h5c5UHtpy67JUqGppM0sh0Nc1dW6/N1W5Yoqat8/TU/VnadmdeW2PLLSyh0cvxBs3KbqTmwYPpxN4do/mzE8nEpvX/UMu2Wbp74zUAK5q6WkHns7V0eWkdPbPzd3rxkTGybadYySumVzhcaJFbs5UrEkQ/+CK8gF5dnh/6ciIZ73gwQ927L1IitoxKLXYP3SjYdOrHHfTZhRRlFyrorafPk20B3HPD1y2G3qKZME5Jcf3t/HUC13/8tSd++vqFveMUTwAUxSUFI1QekR1+bIze3D9MF2aq6cPvG72CgnldWCFqyRw3lwH8ZMerjTD9ElRO7Gv44wNpC90aASqGfVlz/Rx17srQ57/UU26hkhQqUB7dBR71WmzQhHUnblGmVOEw0jhbV1n9OlXUDCIRGaNV5Jp43N516fN7JmnTHdfp7Hgy0luO4aMhtkLL8Bi3bUWYvzh5Mn1dTxrL6QmGuRhGL/TiTTxRoEdTszSaq9GR0NGA3KdkOz3hqSV3MIDhQ5IVX/Ivx3umBti2es2h4eZby7x8br1rkf7Mo90AqC8aQ3sJeNzqFRu+vSANAQe3PL7l0HGOAdwDCeZYvNKeoZp1Qfs6Aipndh86HmFRi0LAnEO47wsqM6cdfjh3jBPUzhZy7nvlUfFsamED1VQt6aISHVymXZ/B2aCtIG8AI8xfobj2d3en1wWVhOeHELKmLQ1s211s88comkv4UCwWyF787mJdYXtNfhKAXVqnKTq8QZvGAGGOfaTo5pGZ/PwbUCr5+DPr/1J92JNHr9aOl/F3iI5+O1nfybsGxoimvZ3ViWSluDITw3P37mypheDIPY0tw7+O/5ApbkYw+zpfaUVu32Pi98+defdUhEpZkRFq0aqyNh9FuL9hpYbEm6iwi0z2REd09ZmyENEbuhjDWzKvZXTqKYaBIr3tt5kuPtQBZFvEUwHt60vfCNu41XsksH9Ij1BMMz1Y0OOunHNShFIP5868g5zeXmuLwL9T4b6Q2+KejgAAAABJRU5ErkJggg=="
					/>
					How to create a new backtest
				</h1>
				<section>
					<h2 id="1-0">
						Creating a Single Conditional Backtest
					</h2>
					<p>
						Learn how to create a backtesting strategy using a sentiment indicator tailored for SPY, suitable for both beginners and experienced traders. By the end, you'll grasp applying this indicator in backtesting strategies. 
					</p>
					<iframe width="560" height="315" src="https://www.youtube.com/embed/8mQNYLfZ9wQ?si=jFC78wfKDXVMzMEo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					<hr />
					<!-- <h3 id="1-0-0">Fill in the basic parameters of the backtest</h3>
					<p>
						According to your own needs, fill in the relevant parameters of the
						backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path100"
						:preview-src-list="path100List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-0-1">Fill in the entry criteria</h3>
					<p>
						Select Single Condition in the drop-down list in the upper right
						corner of the Entry Criteria section; Select a sentiment or
						technical indicator from the drop-down box indicator field, fill in
						required value and choose condition in the condition section. For
						sentiment indicator, the Extreme Optimism and Extreme Pessimism
						values are recommended.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path101"
						:preview-src-list="path101List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-0-2">Fill in the exit criteria</h3>
					<p>
						Select Single Condition in the drop-down list in the upper right
						corner of the Exit Criteria section; Select a sentiment or technical
						indicator from the drop-down box indicator field, fill in required
						value and choose condition in the condition section. For sentiment
						indicator, the Extreme Optimism and Extreme Pessimism values are
						recommended.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path102"
						:preview-src-list="path102List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-0-3">Run the backtest and view the results</h3>
					<p>
						After filling out the backtest form, click "Run Backtest" button to
						run the backtest and view the backtest results. The runtime of
						backtest will take more than 30 seconds to finish. After the
						backtest is completed, it will jump to Backtest Results tab to
						display the backtest results, including the Summary, Trades info
						etc, lf the backtest has no trades, you can go to Backtest History
						tab and click 'Edit" icon to modify the backtest parameters of
						Entry/Exit Criteria.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path103"
						:preview-src-list="path103List"
						fit="fill"
						lazy
					></el-image> -->
					<h2 id="1-1">Creating a SameBar Multi-Condition Sentiment Indicator Backtest</h2>
					<p>Learn how to analyze and create multi-condition sentiment indicator backtests, empowering your trading decisions with comprehensive insights. </p>
					<iframe width="560" height="315" src="https://www.youtube.com/embed/6I3B-6RpuBI?si=cVhRehTWzl963Z4L" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					<hr />
					<!-- <h3 id="1-1-0">Set Stop Loss/Take Profit</h3>
					<p>
						To use stop/loss as an OR condition with exit criteria, check "Risk
						Control at Exit" and then fill in value in the "Take Profit" and
						"Stop Loss" fieldboxes.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path110"
						:preview-src-list="path110List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-1-1">Set time-in-market</h3>
					<p>
						To use time-in-market as an OR condition with exit criteria, check
						"Risk Control at Exit" and then fill in value in the "Time in
						Market" fieldbox.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path111"
						:preview-src-list="path111List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-1-2">Select Only Use Risk Control in the exit criteria</h3>
					<p>
						When Risk Control at Exit is checked and filled in with settings,
						the exit criteria will combine with the Risk Control settings as an
						OR condition. If you only want to use Risk Control at Exit settings
						as the exit criteria, select "Only Use Risk Control" in the drop
						down list in the upper right corner of the Exit Criteria section.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path112"
						:preview-src-list="path112List"
						fit="fill"
						lazy
					></el-image> -->
					<h2 id="1-2">Creating a Single-Condition Technical Indicator Backtest</h2>
					<p>Join us as we explore backtesting strategies with a single-condition technical indicator, focusing on SPY. Learn how to simplify the process of creating and analyzing technical indicator backtests. Gain insights and apply these techniques to your own analyses! </p>
					<iframe width="560" height="315" src="https://www.youtube.com/embed/pbu59UyJazM?si=vsZolit-RQiXauvk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					<hr />
					<!-- <h3 id="1-2-0">Set timeframe to Daily</h3>
					<p>
						When the timeframe in Set up Backtest tab is set to Daily, the
						sentiment indicators in the entry and exit criteria sections will
						only have sentiment indicators with daily updates.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path120"
						:preview-src-list="path120List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-2-1">Set timeframe to Weekly</h3>
					<p>
						When the timeframe in Set up Backtest tab is set to Weekly, the
						sentiment indicators in the entry and exit criteria sections will
						have sentiment indicators with daily and weekly updates.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path121"
						:preview-src-list="path121List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-2-2">Set timeframe to Monthly</h3>
					<p>
						When the timeframe in Set up Backtest tab is set to Monthly, the
						sentiment indicators in the entry and exit criteria sections will
						have sentiment indicators with daily/weekly/monthly updates.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path122"
						:preview-src-list="path122List"
						fit="fill"
						lazy
					></el-image> -->
					<h2 id="1-3">
						Creating a TimeOrder Multi-Condition Technical Indicator Backtest
					</h2>
					<p>Join us as we explore complex backtesting strategies using TimeOrder Multi-Condition Technical Indicators, focusing on SPY. Learn to create and analyze multi-condition sentiment indicator backtests. Gain insights and apply these techniques to your analyses! </p>
					<iframe width="560" height="315" src="https://www.youtube.com/embed/67G4zKZYwYQ?si=Hu6sfYyXSo9_6_7U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					<hr />
					<!-- <h3 id="1-3-0">Fill in the basic information for the backtest</h3>
					<p>
						According to your own needs, fill in the relevant parameters of the
						backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path130"
						:preview-src-list="path130List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-3-1">Fill in the entry criteria</h3>
					<p>
						SameBar Multi-Condition means that when multiple conditions occur at
						the same bar the backtest criteria is met. Select SameBar
						Multi-Condition in the drop-down box in the upper right corner of
						the entry criteria section; then condition1 and condition2 panels
						will show by default and the default score value is 2. Clicking on
						the + sign will increase the number of entry conditions and also the
						score value. The maximum number of conditions in SameBar
						Multi-Condition selection is 5. Then you can fill in each condition
						panel corresponding to the entry condition same as single-condition
						selection.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path131"
						:preview-src-list="path131List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-3-2">Fill in the exit criteria</h3>
					<p>
						SameBar Multi-Condition means that when multiple consitions occur at
						the same bar the backtest criteria is met. Select SameBar
						Multi-Condition in the drop-down box in the upper right corner of
						the exit criteria section; then condition1 and condition2 panels
						will show by default and the default score value is 2. Clicking on
						the + sign will increase the number of exit conditions and also the
						score value. The maximum number of conditions in SameBar
						Multi-Condition selection is 5. Then you can fill in each condition
						panel corresponding to the exit condition same as single-condition
						selection.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path132"
						:preview-src-list="path132List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-3-3">
						Set score value in SameBar Multi-Condition entry/exit criteria
					</h3>
					<p>
						Set a value of score to specify how many conditions will occur at
						the same bar to trigger the backtest criteria. if choose score 1,
						meanning if any one condition of the selected conditions occur the
						backtest criteria is met. if choose score 2, meanning if any two of
						the conditions of the selected conditions occur the backtest
						criteria is met. etc. For example: If the backtest criteria needs to
						have a "AND" condition of 2 conditions, set two conditions below and
						choose score 2. If the backtest criteria needs to have a "OR"
						condition of 2 conditions, set two conditions below and choose score
						1. etc.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path133"
						:preview-src-list="path133List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-3-4">Run Backtest and view results</h3>
					<p>Click Run Backtest button to run the backtest and view results.</p> -->
					<h2 id="1-4">
						Creating a Single-Condition Symbol OHLCV Backtest
					</h2>
					<p>Join us as we explore advanced backtesting strategies using Single-Condition Symbol OHLCV, focusing on SPY. Learn to create and analyze backtests based on Open, High, Low, Close, and Volume symbols. Gain insights and apply these techniques to your analyses! </p>
					<iframe width="560" height="315" src="https://www.youtube.com/embed/KeIhNZ9r83s?si=AxUia5uN05RAxSYe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					<hr />
					<!-- <h3 id="1-4-0">Fill in the basic information for the backtest</h3>
					<p>
						According to your own needs, fill in the relevant parameters of the
						backtest, including Starting
						Capital、Commission、Benchmark、Backtest History....
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path140"
						:preview-src-list="path140List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-4-1">Fill in the entry criteria</h3>
					<p>
						TimeOrder Multi-Condition means that when multiple conditions occur
						in time order the backtest criteria is met. Select TimeOrder
						Multi-Condition in the drop-down box in the upper right corner of
						the entry criteria section; then condition1 and condition2 panels
						will show by default and the default period value is 2. Clicking on
						the + sign will increase the number of entry conditions and also the
						period value. The maximum number of conditions in TimeOrder
						Multi-Condition selection is 3. Then you can fill in each condition
						panel corresponding to the entry condition same as single-condition
						selection.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path141"
						:preview-src-list="path141List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-4-2">Fill in the exit criteria</h3>
					<p>
						TimeOrder Multi-Condition means that when multiple conditions occur
						in time order the backtest criteria is met. Select TimeOrder
						Multi-Condition in the drop-down box in the upper right corner of
						the exit criteria section; then condition1 and condition2 panels
						will show by default and the default period value is 2. Clicking on
						the + sign will increase the number of exit conditions and also the
						period value. The maximum number of conditions in TimeOrder
						Multi-Condition selection is 3. Then you can fill in each condition
						panel corresponding to the exit condition same as single-condition
						selection.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path142"
						:preview-src-list="path142List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-4-3">
						Set period value in timeorder Multi-Condition entry/exit criteria
					</h3>
					<p>
						Set a value to specify how many bars within which the selected
						conditions will occur in time order to trigger the backtest
						criteria. if choose score 1, meaning if the selected conditions
						occuring at the samebar the backtest criteria is met. if choose
						score 2, meaning if the selected conditions occuring within two bars
						the backtest criteria is met. etc. For example: If the backtest
						criteria needs to have two consecutive conditions, set two
						conditions below and choose period 2. If the backtest criteria needs
						to have two conditions occuring within 3 bars, set two conditions
						below and period 3. etc.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path143"
						:preview-src-list="path143List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-4-4">Run Backtest and view results</h3>
					<p>Click Run Backtest button to run the backtest and view results.</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path144"
						:preview-src-list="path144List"
						fit="fill"
						lazy
					></el-image> -->
					<h2 id="1-5">Creating a User's Own Indicator Backtest</h2>
					<p>Join us as we explore custom backtesting strategies using User’s Own Indicator files. Learn to tailor your strategies and create custom indicators. Gain comprehensive insights and start applying these techniques to your analyses! </p>
					<iframe width="560" height="315" src="https://www.youtube.com/embed/vHPCnFYqLGo?si=wk3XgJjh5MNFaFx3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					<hr />
					<!-- <h3 id="1-5-0">Set the value of delay of bars in entry criteria</h3>
					<p>
						Check this option to delay the specified number of bars to enter
						when the entry criteria is met. Set the value preferred.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path150"
						:preview-src-list="path150List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-5-1">Set the value of delay of bars in exit criteria</h3>
					<p>
						Check this option to delay the specified number of bars to exit when
						the exit criteria is met. Set the value preferred.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path151"
						:preview-src-list="path151List"
						fit="fill"
						lazy
					></el-image> -->
					<h2 id="1-6">
						Creating a Combination of Sentiment and Technical Indicator Backtest
					</h2>
					<p>Explore advanced backtesting strategies using a Combination of Sentiment and Technical Indicators, focusing on SPY. Learn to integrate these indicators for enhanced backtesting. Gain comprehensive insights and apply these techniques to your analyses! </p>
					<iframe width="560" height="315" src="https://www.youtube.com/embed/XYXj43XHk0M?si=i1zc1RbQ13XBITes" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
					<!-- <h3 id="1-6-0">Fill in the basic information for the backtest</h3>
					<p>
						According to your own needs, fill in the relevant parameters of the
						backtest, including Starting Capital, Commission, Benchmark,
						Backtest History... Switch the timeframe to daily, as currently
						custom indicators only support uploading daily data.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path160"
						:preview-src-list="path160List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-6-1">Fill in the entry criteria</h3>
					<p>
						Select 'Single-Condition' from the drop-down list in the upper right
						corner of the Entry Criteria section. Choose the 'Users' Own
						Indicator' radio button.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path161"
						:preview-src-list="path161List"
						fit="fill"
						lazy
					></el-image>
					<p>
						If you want to use the same custom indicator file for both entry and
						exit, select 'Single Condition' from the drop-down list in the upper
						right corner of the Exit Criteria section. Choose the 'Users' Own
						Indicator' radio button. This way, when you upload the custom file
						for Entry Criteria, we will pre-fill the custom indicator file for
						Exit Criteria. If you are using different custom indicator files for
						entry and exit, you can skip this step.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path162"
						:preview-src-list="path162List"
						fit="fill"
						lazy
					></el-image>
					<p>
						The Custom indicator files can only be uploaded as CSV files. The
						file name should only contain English letters, numbers, spaces,
						underscores, and cannot start with a number. The file size should be
						less than 1MB. The file content has strict formatting requirements.
						Please click the 'View Example Data' button to see an example file.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path163"
						:preview-src-list="path163List"
						fit="fill"
						lazy
					></el-image>
					<p>
						Click the 'Click to upload custom indicator file' button to upload
						your local custom indicator file.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path164"
						:preview-src-list="path164List"
						fit="fill"
						lazy
					></el-image>
					<p>
						If your file format meets the requirements, please ensure that the
						file does not contain non-trading days. If there are non-trading
						days in the CSV file, a popup window will appear to alert you. In
						that case, you can click the 'Ignore' button in the popup window,
						and we will remove the non-trading days from the file. If you click
						the 'Cancel' button, the file will not be uploaded.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path165"
						:preview-src-list="path165List"
						fit="fill"
						lazy
					></el-image>
					<p>
						When all the file contents pass the verification, a pop-up window
						will prompt you to enter the Indicator Name, which will be displayed
						as the name of the custom indicator on the chart. You can directly
						use the file name as the custom indicator name, or you can input a
						custom indicator name. The indicator name can only contain letters,
						numbers, underscores, and spaces, and cannot start with a number.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path166"
						:preview-src-list="path166List"
						fit="fill"
						lazy
					></el-image>
					<p>
						Once the indicator name is confirmed, the chart will display the
						custom indicator on it. It is important to note that if the dates in
						the uploaded indicator file exceed the chart's date range, the
						exceeding portion will not be plotted on the chart. After successful
						file upload, you can click on the file list item to preview the
						uploaded file.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path167"
						:preview-src-list="path167List"
						fit="fill"
						lazy
					></el-image>
					<p>
						Finally, fill in the entry conditions corresponding to the condition
						panel.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path168"
						:preview-src-list="path168List"
						fit="fill"
						lazy
					></el-image>
					<h3 id="1-6-2">Fill in the exit criteria</h3>
					<p>
						If your Exit Criteria is pre-filled with a custom indicator file,
						you only need to fill in the exit conditions corresponding to the
						condition panel.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path169"
						:preview-src-list="path1610List"
						fit="fill"
						lazy
					></el-image>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path1610"
						:preview-src-list="path1610List"
						fit="fill"
						lazy
					></el-image>
					<p>
						If your Exit Criteria is not pre-filled with a custom indicator
						file, you will need to upload your own indicator file from your
						local device. The uploading process and requirements are the same as
						mentioned earlier for Entry Criteria. Once the custom indicator file
						for Exit Criteria is successfully uploaded, fill in the exit
						conditions corresponding to the condition panel.
					</p>
					<h3 id="1-6-3">Run Backtest and view results</h3>
					<p>
						Click the 'Run Backtest' button to execute the backtest and view the
						results. Creating a backtest using custom conditions also supports
						multi-condition creation. Simply switch the 'Single-Condition' to
						'SameBar Multi-Condition' or 'TimeOrder Multi-Condition' and follow
						the steps in the multi-condition creation tutorial.
						<el-link type="warning" @click="jump('1-3')"
							>Create a samebar multi-condition entry/exit criteria new
							backtest<i class="el-icon-top-right"></i
						></el-link>
					</p> -->
					<h2 id="1-7">Set the Trade Price for backtesting</h2>
					<hr />
					<p>
						The trade price (Trade Price) represents the price used in trading.
						"Next" indicates that the trade will be executed in the next bar
						after meeting the conditions on the current trading day. There are
						three options for the trade price: "Next Open," "Next Close," and
						"Current Close." They indicate the type of price used for simulating
						trades. "Next Open" means using the opening price of the next
						trading period for trade simulation, "Next Close" means using the
						closing price of the next trading period for trade simulation, and
						"Current Close" means using the closing price of the current trading
						period for trade simulation. You can select the appropriate trade
						price option in the basic parameters of the backtest.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path171"
						:preview-src-list="path171List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="1-8">Exclude Overlapping Observations for Backtesting</h2>
					<hr />
					<p>
						If you want to exclude densely packed dates during backtesting,
						please select this option. By choosing this option, the test will
						allow only one transaction at a time. For example, If you enter 10,
						it means that within the next ten bars after completing a single
						transaction (as there can be multiple transactions in one backtest),
						no further trades will be executed if there is another bar that
						meets the entry conditions. After checking the "Exclude Overlapping
						Observations" option, enter a time value in the adjacent input box,
						which must be a positive integer.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path181"
						:preview-src-list="path181List"
						fit="fill"
						lazy
					></el-image>
				</section>
			</section>
			<section v-else-if="id[0] == '2'">
				<h1 id="2">Add created backtest to My Favorites</h1>
				<hr />
				<section>
					<h2 id="2-0">Open the Backtest History tab</h2>
					<p>
						Open the Backtest History tab, choose which backtest you want to add
						to the favorites, and click the add to favorites button.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path20"
						:preview-src-list="path20List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="2-1">View backtest in My Favorites</h2>
					<p>
						Open My Favorites tab to view your favorite backtests, where you can
						remove backtesting collections, edit backtests, and view backtest
						results.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path21"
						:preview-src-list="path21List"
						fit="fill"
						lazy
					></el-image>
				</section>
			</section>

			<section v-else-if="id.includes('fls')">
				<h1 id="fls">Using the “Find Last Signal” Feature</h1>
				<p>Explore "Add to Favorites" and "Find Last Signal" features for efficient backtesting. Learn to streamline your analysis process and enhance trading strategies with organized tools. Whether you're new or want to optimize strategy analysis, these features offer valuable insights and convenience. </p>
				<iframe width="560" height="315" src="https://www.youtube.com/embed/oNDFG17j1OA?si=yQRHPOcD9PIlSwpD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
				<hr />
				<!-- <h2 id="fls-0">Click the 'find last signal' button</h2>
				<p>
					Enter the "My Favorites" list, where the user's saved backtests are
					stored. In the top-right corner of the list, you will find a button
					labeled "find last signal." After clicking the "find last signal"
					button, BacktestEdge will begin running all the backtests in the "My
					Favorites" list. Please be patient and wait until the backtest
					execution is complete.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathfls11"
					:preview-src-list="pathfls22List"
					fit="fill"
					lazy
				></el-image>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathfls12"
					:preview-src-list="pathfls22List"
					fit="fill"
					lazy
				></el-image>
				<h2 id="fls-1">Wait for the backtest to finish</h2>
				<p>
					Once the backtest execution is finished, BacktestEdge will determine
					the timestamp of the most recent trade. 'E' represents the entry time
					of the most recent trade, while 'X' represents the exit time of the
					most recent trade.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathfls21"
					:preview-src-list="pathfls22List"
					fit="fill"
					lazy
				></el-image>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathfls22"
					:preview-src-list="pathfls22List"
					fit="fill"
					lazy
				></el-image>
				<p>
					By following the steps outlined above, you can use BacktestEdge to
					find the timestamp of the most recent trade in the "My Favorites"
					list. This functionality assists in understanding recent trading
					activity and facilitates further analysis and decision-making based on
					this information. Please note that the backtest results and recent
					trade timestamps are generated from the saved backtest data, and the
					results may vary depending on your specific backtest configurations.
					Ensure the accuracy of your backtest data and settings to obtain
					precise backtest results and information about recent trade
					timestamps.
				</p> -->
			</section>
			<section v-else-if="id[0] == '3'">
				<h1 id="3">Edit a created backtest</h1>
				<hr />
				<section>
					<h2 id="3-0">Open the Backtest History tab</h2>
					<p>
						Open the Backtest History tab, choose which backtest you want to
						edit, and click the edit backtest button.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path30"
						:preview-src-list="path30List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="3-1">Edit in Set Up Backtest</h2>
					<p>
						When you click the edit backtest button, the information of the
						current backtest will be displayed in the form of the Set Up
						Backtest tab, where you can modify the backtest data. When you're
						done editing, click Run Backtest Run the modified backtest and view
						the results.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path31"
						:preview-src-list="path31List"
						fit="fill"
						lazy
					></el-image>
				</section>
			</section>
			<section v-else-if="id[0] == '4'">
				<h1 id="4">View result of a created backtest</h1>
				<hr />
				<section>
					<h2 id="4-0">Open the Backtest History tab</h2>
					<p>
						Open the Backtest History tab, choose which backtest you want to
						edit, and click the view backtest results button.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path40"
						:preview-src-list="path40List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="4-1">Modify the current backtesting parameters</h2>
					<p>
						When you click the button to view the results, Set Up Backtest will
						show the specific parameters of the backtest of the current viewing
						result, and if you are not satisfied with the results of this
						backtest, you can return to edit the Set Up Backtest tab, click Run
						Backtest to run the modified backtest.
					</p>
				</section>
			</section>
			<section v-else-if="id[0] == '5'">
				<h1 id="5">Using Sample Backtests</h1>
				<p>Explore utilizing Sample Backtests for a quick start in backtesting strategies. Ideal for beginners or those seeking efficient ways to utilize sample backtests provided by the system. Learn how to navigate and leverage sample backtests effectively to save time and effort. </p>
				<iframe width="560" height="315" src="https://www.youtube.com/embed/tu2JdQ8lwos?si=fBE5zaf017OSl2PT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
				<hr />
				<!-- <section>
					<h2 id="5-0">Open the Sample Backtests tab</h2>
					<p>
						Open the Sample Backtests tab and click the copy backtest button.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path50"
						:preview-src-list="path50List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="5-1">Edit and run a copied backtest</h2>
					<p>
						Open the Backtest History tab, choose the copied backtest to edit.
						Some of the action buttons to the copied backtest are not available
						because for all copied backtests results can only be viewed after
						edit and run is completed.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path51"
						:preview-src-list="path51List"
						fit="fill"
						lazy
					></el-image>
				</section> -->
			</section>
			<section v-else-if="id[0] == '6'">
				<h1 id="6">How to view the description of the backtest</h1>
				<hr />
				<section>
					<h2 id="6-0">Open any list page</h2>
					<p>
						The backtesting system has three list pages: Backtest History, My
						Favorites, and Sample Backtests. The Backtest History contains all
						the backtests you create; My Favorites Contains all backtests added
						to the collection; There are many Sample Backtests stored in Sample
						Backtests, which you can use through copy. Now let's open one of the
						list pages, such as Backtest History, Then click on the triangle
						button to see the signal indicators used for the current
						backtesting. If you open the Sample Backtests tab, you'll find that
						Sample Backtests displays the basic information indicator by
						default, and if you don't need it, you can click the triangle button
						to hide.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path60"
						:preview-src-list="path60List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="6-1">
						How to know the indicator parameters used by the backup through
						description
					</h2>
					<p>
						How do you know from the description on display what entry and exit
						conditions are used in backtest? The description is divided into two
						parts. On the left is the entry description, and on the right is the
						exit description. The following figure is the meaning of the Entry
						description and the Exit description.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path61"
						:preview-src-list="path61List"
						fit="fill"
						lazy
					></el-image>
				</section>
			</section>
			<section v-else-if="id[0] == '7'">
				<h1 id="7">How to exit with customized Time-In-Market</h1>
				<hr />
				<section>
					<h2 id="7-0">Open the History tab and view the backtest results</h2>
					<p>
						Select any backtest with trades from the backtest history list,
						click on the "View Backtest Result" button next to the backtest, and
						view the backtest results.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path71"
						:preview-src-list="path71List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="7-1">Click button to customize the TIM</h2>
					<p>
						Underneath the Results tab, click on the "Exit with different
						Time-In-Market" frame. This will display two tabs: "Exit With
						Default Time-In-Market" and "Exit with Customized Time-In-Market".
						Choose "Exit with Customized Time-In-Market" and click on the "Edit
						exit with different TIM" button to customize the backtest.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path72"
						:preview-src-list="path72List"
						fit="fill"
						lazy
					></el-image>
					<p>
						Fill in the custom TIM in the pop-up window. To add multiple TIMs,
						please click "Add Row." Finally, click "Save" to calculate the
						custom TIM based on the current backtesting.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path73"
						:preview-src-list="path72List"
						fit="fill"
						lazy
					></el-image>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path74"
						:preview-src-list="path72List"
						fit="fill"
						lazy
					></el-image>
				</section>
			</section>
			<section v-else-if="id[0] == '8'">
				<Tabs></Tabs>
			</section>
			<section v-else-if="id[0] == '9'">
				<h1 id="9">Backtesting in Analyst Reports</h1>
				<hr />
				<section>
					<h2 id="9-0">Copy Backtest</h2>
					<p>
						If you are interested in a specific backtest, you can click the
						"copy backtest" button, just like the sample backtest, to make a
						copy. This allows you to use that backtest strategy in your backtest
						history list.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path811"
						:preview-src-list="path811List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="9-1">View Backtest Results</h2>
					<p>
						If you want to see the results of a particular backtest, you can
						click the "view backtest result" button to see the detailed results
						of the backtest.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path812"
						:preview-src-list="path812List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="9-2">Analyst Report Link</h2>
					<p>
						In the "Entry & Exit" column of the backtest list, you can find the
						URL of the analyst report corresponding to each backtest. Clicking
						on that URL will take you to the source analyst's report page, where
						you can gather more information.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path82"
						:preview-src-list="path82List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="9-3">Share Backtest</h2>
					<p>
						If you want to share a backtest result from a specific analyst with
						your friends, simply click the "copy backtest link" button and paste
						the backtest URL to your friends. If they are also subscribed to
						BacktestEdge, they will be able to see the backtest results and
						parameters.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path831"
						:preview-src-list="path83List"
						fit="fill"
						lazy
					></el-image>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path832"
						:preview-src-list="path83List"
						fit="fill"
						lazy
					></el-image>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path833"
						:preview-src-list="path83List"
						fit="fill"
						lazy
					></el-image>
				</section>
			</section>
			<section v-else-if="id.includes('ai')">
				<h1 id="ai-0">The generation logic of Smart Stock Scanner</h1>
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
				<h1 id="ai-1">Smart Stock Scanner entrance</h1>
				<hr />
				<p>
					Click 'Smart Stock Scanner' in the navigation bar at the top of the
					homepage
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai1"
					:preview-src-list="pathai1List"
					fit="fill"
					lazy
				></el-image>
				<h1 id="ai-2">Modify Smart Stock Scanner date</h1>
				<hr />
				<p>
					Select the historical date you want to view in the date picker under
					'Daily Picks at the end of today'.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai2"
					:preview-src-list="pathai2List"
					fit="fill"
					lazy
				></el-image>
				<!-- <h1 id="ai-3">Cash Alloc(%) for auto-adjusted stocks</h1>
				<hr />
				<p>
					Check the symbol you want to calculate for Cash Alloc(%) in the
					selection box before the symbol name, and the Smart Stock Scanner will
					help you calculate the Cash Alloc(%) corresponding to the current
					symbol
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai3"
					:preview-src-list="pathai3List"
					fit="fill"
					lazy
				></el-image> -->
				<h1 id="ai-3">Using Filter Buttons</h1>
				<hr />
				<p>
					On the "SwingAI" page, you will see several filter buttons, including
					'MA', 'MAGap', 'MACDHist', 'MACDHistGap', 'Hammer followed by a rise', 'Shooting Star followed by a fall',
					'UpTrend Pattern', and 'DownTrend Pattern'. On the "MidTermAI" page,
					you will see several filter buttons, including 'Symbol Close > its' MA200 and Optix MA5 &lt; 35', 'Symbol Close > its' MA200 and Optix &lt; 30', and
					'Optix MA10 &lt; 30 and Optix &lt; 20'.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai311"
					:preview-src-list="pathai311List"
					fit="fill"
					lazy
				></el-image>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai312"
					:preview-src-list="pathai311List"
					fit="fill"
					lazy
				></el-image>
				<p>
					These buttons are dynamically displayed. If you're unfamiliar with the
					meaning of each filter button, you can hover your mouse over the icon
					next to the button, and a tooltip will appear explaining its meaning.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai32"
					:preview-src-list="pathai32List"
					fit="fill"
					lazy
				></el-image>
				<p>
					Based on your requirements, click the appropriate filter button. As
					you click different filter buttons, the list below will be filtered
					accordingly. You can filter out the stocks you are interested in using
					different filter options. With the information in the filtered list,
					you can perform a more in-depth analysis.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai33"
					:preview-src-list="pathai33List"
					fit="fill"
					lazy
				></el-image>
				<h1 id="ai-4">Stock List Sorting</h1>
				<hr />
				<p>
					On the Smart Scanner page, you will see a stock list that contains
					information about multiple stocks. Each column of the stock list has a
					header, including Win Rate(%), Stop Loss(%), Profit Target(%), and
					Best Time In Market(Bars).
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai34"
					:preview-src-list="pathai35List"
					fit="fill"
					lazy
				></el-image>
				<p>
					Next to each header, there is a sorting icon. Clicking the sorting
					icon allows you to sort the list in ascending or descending order
					based on the corresponding column. By default, the list is not sorted.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai35"
					:preview-src-list="pathai35List"
					fit="fill"
					lazy
				></el-image>
				<p>
					You can select the column you want to sort based on your requirements.
					Click the sorting icon next to the respective header to sort the list.
					Clicking the icon once will sort the list in ascending order for that
					column, and clicking it again will sort the list in descending order.
					You can sort the list based on different columns such as Win Rate(%),
					Stop Loss(%), Profit Target(%), or Best Time In Market(Bars). The
					stock list will be sorted according to the selected sorting criteria.
					The sorted list will display the corresponding stock information,
					making it easier for you to analyze and compare data for different
					stocks.
				</p>
				<p>
					By following the steps mentioned above, you can utilize the sorting
					functionality of Smart Scanner to sort the stock list in ascending or
					descending order based on different columns. This enables you to
					compare and analyze stock data based on various indicators such as Win
					Rate(%), Stop Loss(%), Profit Target(%), or Best Time In Market(Bars),
					allowing you to better understand the market conditions and make
					informed decisions. Remember, sorting is just a tool to facilitate the
					viewing and comparison of stock data, and the final decisions still
					need to be based on your own judgment and analysis.
				</p>
				<h1 id="ai-5">View symbol's backtest information</h1>
				<hr />
				<p>
					Click on a stock name to access the stock and its corresponding
					backtesting information.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai41"
					:preview-src-list="pathai41List"
					fit="fill"
					lazy
				></el-image>
				<p>
					These backtesting information will help you understand the statistics
					of this signal under historical data backtesting.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai42"
					:preview-src-list="pathai42List"
					fit="fill"
					lazy
				></el-image>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai43"
					:preview-src-list="pathai43List"
					fit="fill"
					lazy
				></el-image>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai44"
					:preview-src-list="pathai44List"
					fit="fill"
					lazy
				></el-image>
				<h1 id="ai-6">Switching AI Algorithms: SwingAI and MidTermAI</h1>
				<hr />
				<h2 id="ai-6-0">Opening the Smart Stock Scanner System</h2>
				<p>
					Make sure you have entered the Smart Stock Scanner system and the
					corresponding function buttons are displayed on the interface.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai510"
					:preview-src-list="pathai510List"
					fit="fill"
					lazy
				></el-image>
				<h2 id="ai-6-1">Switch to SwingAI</h2>
				<p>
					When you wish to switch to the SwingAI algorithm, just click the
					button marked "SwingAI" on the interface. Once you click the button,
					the system will switch to the SwingAI algorithm for stock analysis.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai511"
					:preview-src-list="pathai511List"
					fit="fill"
					lazy
				></el-image>
				<h2 id="ai-6-2">Switch to MidTermAI</h2>
				<p>
					Likewise, when you wish to switch to the MidTermAI algorithm, just
					click the button labeled "MidTermAI" on the interface. After clicking
					the button, the system will switch to the MidTermAI algorithm for
					stock analysis.
				</p>
				<el-image
					style="width: 100%; height: 50%"
					class="image-border"
					:src="pathai512"
					:preview-src-list="pathai512List"
					fit="fill"
					lazy
				></el-image>
				<h2 id="ai-6-3">When to Choose SwingAI or MidTermAI</h2>
				<p>
					When choosing to use the SwingAI or MidTermAI algorithms, here are
					some recommendations to help you understand when to use each algorithm
					and make decisions based on your investment goals and time horizon:
				</p>
				<p><strong>SwingAI Algorithm:</strong></p>
				<ul>
					<li>
						Applicability: The SwingAI algorithm is suitable for short-term
						investments or day traders. It focuses on short-term price
						fluctuations and technical indicators to identify short-term trading
						opportunities.
					</li>
					<li>
						Advantages: SwingAI can capture short-term trends in stock prices,
						helping to identify overbought and oversold signals, trend
						reversals, and other factors relevant to short-term traders. It can
						provide quick trading opportunities and entry points.
					</li>
					<li>
						Limitations: SwingAI's analysis has a relatively short time horizon
						and may not capture longer-term trends. It relies less on
						fundamental indicators and macroeconomic factors, potentially
						limiting comprehensive market insights.
					</li>
				</ul>
				<p><strong>MidTermAI Algorithm:</strong></p>
				<ul>
					<li>
						Applicability: The MidTermAI algorithm is suitable for medium to
						long-term investors or traders. It focuses on predicting the
						medium-term trend of stock prices, typically covering a longer time
						horizon.
					</li>
					<li>
						Advantages: MidTermAI can analyze longer-term price data,
						fundamental indicators, and market sentiment to identify medium-term
						trends in stocks. It provides more information and guidance for
						long-term investment decisions. MidTermAI emphasizes overall stock
						performance and long-term trends, aiding investors in making wiser
						holding decisions.
					</li>
					<li>
						Limitations: MidTermAI's forecasting time horizon is relatively
						longer, which may result in weaker capturing of short-term
						fluctuations and trading opportunities. It may not provide immediate
						buy and sell points and may require additional validation and
						confirmation during rapidly changing market conditions.
					</li>
				</ul>
				<p>
					<strong
						>When deciding which algorithm to choose, users should consider the
						following factors:</strong
					>
				</p>
				<ul>
					<li>
						Investment Goals: If a user's goal is short-term trading and quick
						profits, SwingAI may be more suitable. If a user is more focused on
						long-term holding and investment, MidTermAI may be a better choice.
					</li>
					<li>
						Time Horizon: Select an algorithm that aligns with the user's time
						horizon and investment or trading strategy. SwingAI is suitable for
						shorter time horizons, while MidTermAI is better suited for longer
						time horizons.
					</li>
				</ul>
				<p>
					However, it is important to note that AI algorithms are not absolutely
					accurate, and investment decisions still require comprehensive
					consideration of other factors and a cautious evaluation of risks.
				</p>
			</section>
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
</style>