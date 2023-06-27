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
						In the chart section of BacktestEdge, users can select stock/index
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
						Create a single-condition entry/exit criteria new backtest
					</h2>
					<hr />
					<h3 id="1-0-0">Fill in the basic parameters of the backtest</h3>
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
						display the backtest results, including the number of trades, entry
						& exit points etc. If the backtest has no trades, you can go to
						Backtest History tab and click 'Edit" icon to modify backtest data.
					</p>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path103"
						:preview-src-list="path103List"
						fit="fill"
						lazy
					></el-image>
					<h2 id="1-1">Use Risk Control at Exit</h2>
					<hr />
					<h3 id="1-1-0">Set stop/loss</h3>
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
					></el-image>
					<h2 id="1-2">Set different backtest timeframe</h2>
					<hr />
					<h3 id="1-2-0">Set timeframe to Daily</h3>
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
					></el-image>
					<h2 id="1-3">
						Create a samebar multi-condition entry/exit criteria new backtest
					</h2>
					<hr />
					<h3 id="1-3-0">Fill in the basic information for the backtest</h3>
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
					<p>Click Run Backtest button to run the backtest and view results.</p>
					<h2 id="1-4">
						Create a timeorder multi-condition entry/exit criteria new backtest
					</h2>
					<hr />
					<h3 id="1-4-0">Fill in the basic information for the backtest</h3>
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
					></el-image>
					<h2 id="1-5">Set the value of delay of bars</h2>
					<hr />
					<h3 id="1-5-0">Set the value of delay of bars in entry criteria</h3>
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
					></el-image>
					<h2 id="1-6">
						Create a new backtest with custom indicator for entry/exit criteria
					</h2>
					<h3 id="1-6-0">Fill in the basic information for the backtest</h3>
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
						:preview-src-list="path169List"
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
					</p>
					<h2 id="1-7">Set the Trade Price for backtesting</h2>
					<hr />
					<p>
						The trade price (Trade Price) represents the price used in trading.
						"Next" indicates that the trade will be executed in the next bar
						after meeting the conditions on the current trading day. There are
						two options for the trade price: "Next Open" and "Next Close". They
						indicate the type of price used for simulating trades. "Next Open"
						means using the opening price of each trading period for trade
						simulation, while "Next Close" means using the closing price of each
						trading period for trade simulation. You can select the appropriate
						trade price option in the basic parameters of the backtest.
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
						allow only one transaction at a time. For example, if you select "10
						days" as the observation period, once the indicator reaches the
						specified level, no other transactions will be allowed within the
						next 10 days. After checking the "Exclude Overlapping Observations"
						option, enter a time value in the adjacent input box, which must be
						a positive integer.
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
				<h1 id="5">Copy a sample backtest</h1>
				<hr />
				<section>
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
				</section>
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
						parts, the Entry description on the left and the Entry description
						on the right Exit description. The following figure is the meaning
						of the Entry description and the Exit description.
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
						:preview-src-list="path73List"
						fit="fill"
						lazy
					></el-image>
					<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="path74"
						:preview-src-list="path74List"
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
					<p>If you are interested in a specific backtest, you can click the "copy backtest" button, just like the sample backtest, to make a copy. This allows you to use that backtest strategy in your backtest history list.</p>
					<h2 id="9-1">View Backtest Results</h2>
					<p>If you want to see the results of a particular backtest, you can click the "view backtest result" button to see the detailed results of the backtest.</p>
					<h2 id="9-2">Analyst Report Link</h2>
					<p>In the "Entry & Exit" column of the backtest list, you can find the URL of the analyst report corresponding to each backtest. Clicking on that URL will take you to the source analyst's report page, where you can gather more information.</p>
					<h2 id="9-3">Share Backtest</h2>
					<p> If you want to share a backtest result from a specific analyst with your friends, simply click the "copy backtest link" button and paste the backtest URL to your friends. If they are also subscribed to BacktestEdge, they will be able to see the backtest results and parameters.</p>
				</section>
			</section>
			<section v-else-if="id.includes('ai')">
				<h1 id="ai-0">The generation logic of AI Stock Scanner</h1>
				<hr />
				<p>
					<strong>The logic behind AI Stock Scanner's generation is aimed at improving user
					returns.</strong>
				</p>
				<p>
					<strong>Broad market coverage:</strong> AI Stock Scanner scans stocks included in the S&P 1500 and some common index funds, providing coverage across a wide market. This means
					it can capture signals from multiple stocks and ETFs, providing users
					with more investment opportunities.
				</p>
				<p><strong>Accurate signal filtering:</strong> AI Stock Scanner utilizes advanced filtering algorithms to extract signals that meet the specified requirements from the scanned stocks and ETFs. This enables users to obtain more precise signals that align with their investment strategies, enhancing the accuracy of investment decisions.</p>
				<p><strong>Evaluation based on historical backtesting:</strong> The selected signals are combined with their corresponding stocks and ETFs for historical backtesting. This historical backtesting evaluation helps users understand the performance history of the signals and assess their potential profitability.</p>
				<p><strong>Data statistical analysis:</strong> AI Stock Scanner performs data statistical analysis on the backtesting results to filter out stocks that meet the specified requirements along with their corresponding signals. Through data analysis, it identifies signals with a higher probability of success, assisting users in selecting more promising investment opportunities.</p>
				<p><strong>Information presentation and selection:</strong> AI Stock Scanner presents the qualifying signals along with their backtesting information, offering users an intuitive interface and data visualization. This allows users to better understand and select signals that align with their specific needs, increasing their potential for investment returns.</p>
				<p>In conclusion, AI Stock Scanner enhances the potential for user returns through broad market coverage, accurate signal filtering, evaluation based on historical backtesting, data statistical analysis, and information presentation and selection. It assists users in identifying more precise signals in stock and ETF investments, providing data support and decision-making guidance to make more informed investment decisions and ultimately improve investment returns.</p>
				<h1 id="ai-1">AI Stock Scanner entrance</h1>
				<hr>
				<p>Click 'AI Stock Scanner' in the navigation bar at the top of the homepage</p>
				<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="pathai1"
						:preview-src-list="pathai1List"
						fit="fill"
						lazy
					></el-image>
				<h1 id="ai-2">Modify AI Stock Scanner date</h1>
				<hr>
				<p>Select the historical date you want to view in the date picker under 'AI Picks at the end of today'.</p>
				<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="pathai2"
						:preview-src-list="pathai2List"
						fit="fill"
						lazy
					></el-image>
				<h1 id="ai-3">Cash Alloc(%) for auto-adjusted stocks</h1>
				<hr>
				<p>Check the symbol you want to calculate for Cash Alloc(%) in the selection box before the symbol name, and the AI Stock Scanner will help you calculate the Cash Alloc(%) corresponding to the current symbol</p>
				<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="pathai3"
						:preview-src-list="pathai3List"
						fit="fill"
						lazy
					></el-image>
				<h1 id="ai-4">View symbol's backtest information</h1>
				<hr>
				<p>Click on a stock name to access the stock and its corresponding backtesting information. </p>
				<el-image
						style="width: 100%; height: 50%"
						class="image-border"
						:src="pathai41"
						:preview-src-list="pathai41List"
						fit="fill"
						lazy
					></el-image>
				<p>These backtesting information will help you understand the statistics of this signal under historical data backtesting.</p>
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
import chartPath from "../img/chart.jpeg";
import path010 from "../img/1.1.1.jpg";
import path011 from "../img/1.1.2.jpg";
import path012 from "../img/1.1.3.jpg";
import path013 from "../img/1.1.4.jpg";
import path014 from "../img/1.1.5.jpg";
import path015 from "../img/1.1.6.jpg";
import path016 from "../img/1.1.7.jpg";
import path017 from "../img/1.1.8.jpg";
import path018 from "../img/1.1.9.jpg";
import path019 from "../img/1.1.10.jpg";
import path0110 from "../img/1.1.11.jpg";
import path0111 from "../img/1.1.12.jpg";
import path0112 from "../img/1.1.13.jpg";
import path0113 from "../img/1.1.14.jpg";
import path0114 from "../img/1.1.15.jpg";
import path0115 from "../img/1.1.16.jpg";
import path0116 from "../img/1.1.17.jpg";
import path0117 from '../img/1.1.18.jpg'
import path01 from "../img/1.2.jpg";
import path100 from "../img/2.1.1.jpg";
import path101 from "../img/2.1.2.jpg";
import path102 from "../img/2.1.3.jpg";
import path103 from "../img/2.1.4.jpg";
import path110 from "../img/2.2.1.jpg";
import path111 from "../img/2.2.2.jpg";
import path112 from "../img/2.2.3.jpg";
import path120 from "../img/2.3.1.jpg";
import path121 from "../img/2.3.2.jpg";
import path122 from "../img/2.3.3.jpg";
import path130 from "../img/2.4.1.jpg";
import path131 from "../img/2.4.2.jpg";
import path132 from "../img/2.4.3.jpg";
import path133 from "../img/2.4.4.jpg";
import path140 from "../img/2.5.1.jpg";
import path141 from "../img/2.5.2.jpg";
import path142 from "../img/2.5.3.jpg";
import path143 from "../img/2.5.4.jpg";
import path144 from "../img/2.5.5.jpg";
import path150 from "../img/2.6.1.jpg";
import path151 from "../img/2.6.2.jpg";
import path160 from "../img/2.7.1.jpg";
import path161 from "../img/2.7.2.jpg";
import path162 from "../img/2.7.3.jpg";
import path163 from "../img/2.7.4.jpg";
import path164 from "../img/2.7.5.jpg";
import path165 from "../img/2.7.6.jpg";
import path166 from "../img/2.7.7.jpg";
import path167 from "../img/2.7.8.jpg";
import path168 from "../img/2.7.9.jpg";
import path169 from "../img/2.7.10.jpg";
import path1610 from "../img/2.7.11.jpg";
import path171 from "../img/2.8.1.jpg";
import path181 from "../img/2.9.1.jpg";
import path20 from "../img/3.1.jpg";
import path21 from "../img/3.2.jpg";
import path30 from "../img/4.1.jpg";
import path31 from "../img/4.2.jpg";
import path40 from "../img/5.1.jpg";
import path50 from "../img/6.1.jpg";
import path51 from "../img/6.2.jpg";
import path60 from "../img/7.1.jpg";
import path61 from "../img/7.2.jpg";
import path71 from "../img/8.1.jpg";
import path72 from "../img/8.2.jpg";
import path73 from "../img/8.3.jpg";
import path74 from "../img/8.4.jpg";
import pathai1 from "../img/ai1.jpg";
import pathai2 from "../img/ai2.jpg";
import pathai3 from "../img/ai3.jpg";
import pathai41 from "../img/ai4.1.jpg";
import pathai42 from "../img/ai4.2.jpg";
import pathai43 from "../img/ai4.3.jpg";
import pathai44 from "../img/ai4.4.jpg";
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
      chartPath: chartPath,
      chartPreList: [chartPath],
      path010: path010,
      path010List: [path010],
      path011: path011,
      path011List: [path011],
      path012: path012,
      path012List: [path012],
      path013: path013,
      path013List: [path013],
      path014: path014,
      path014List: [path014],
      path015: path015,
      path015List: [path015],
      path016: path016,
      path016List: [path016],
      path017: path017,
      path017List: [path017],
      path018: path018,
      path018List: [path018],
      path019: path019,
      path019List: [path019],
      path0110: path0110,
      path0110List: [path0110],
      path0111: path0111,
      path0111List: [path0111],
      path0112: path0112,
      path0112List: [path0112],
      path0113: path0113,
      path0113List: [path0113],
      path0114: path0114,
      path0114List: [path0114],
      path0115: path0115,
      path0115List: [path0115],
      path0116: path0116,
      path0116List: [path0116],
      path0117: path0117,
      path0117List: [path0117],
      path01: path01,
      path01List: [path01],
      path100: path100,
      path100List: [path100],
      path101: path101,
      path101List: [path101],
      path102: path102,
      path102List: [path102],
      path103: path103,
      path103List: [path103],
      path110: path110,
      path110List: [path110],
      path111: path111,
      path111List: [path111],
      path112: path112,
      path112List: [path112],
      path120: path120,
      path120List: [path120],
      path121: path121,
      path121List: [path121],
      path122: path122,
      path122List: [path122],
      path130: path130,
      path130List: [path130],
      path131: path131,
      path131List: [path131],
      path132: path132,
      path132List: [path132],
      path133: path133,
      path133List: [path133],
      path140: path140,
      path140List: [path140],
      path141: path141,
      path141List: [path141],
      path142: path142,
      path142List: [path142],
      path143: path143,
      path143List: [path143],
      path144: path144,
      path144List: [path144],
      path150: path150,
      path150List: [path150],
      path151: path151,
      path151List: [path151],
      path160: path160,
      path160List: [path160],
      path161: path161,
      path161List: [path161],
      path162: path162,
      path162List: [path162],
      path163: path163,
      path163List: [path163],
      path164: path164,
      path164List: [path164],
      path165: path165,
      path165List: [path165],
      path166: path166,
      path166List: [path166],
      path167: path167,
      path167List: [path167],
      path168: path168,
      path168List: [path168],
      path169: path169,
      path169List: [path169],
      path1610: path1610,
      path1610List: [path1610],
      path171: path171,
      path171List: [path171],
      path181: path181,
      path181List: [path181],
      path20: path20,
      path20List: [path20],
      path21: path21,
      path21List: [path21],
      path30: path30,
      path30List: [path30],
      path31: path31,
      path31List: [path31],
      path40: path40,
      path40List: [path40],
      path50: path50,
      path50List: [path50],
      path51: path51,
      path51List: [path51],
      path60: path60,
      path60List: [path60],
      path61: path61,
      path61List: [path61],
      path71: path71,
      path71List: [path71],
      path72: path72,
      path72List: [path72],
      path73: path73,
      path73List: [path73],
      path74: path74,
      path74List: [path74],
			pathai1: pathai1,
			pathai1List: [pathai1],
			pathai2: pathai2,
			pathai2List: [pathai2],
			pathai3: pathai3,
			pathai3List: [pathai3],
			pathai41: pathai41,
			pathai41List: [pathai41],
			pathai42: pathai42,
			pathai42List: [pathai42],
			pathai43: pathai43,
			pathai43List: [pathai43],
			pathai44: pathai44,
			pathai44List: [pathai44]
    }
  },
  components: {
    RightMenu,
    Tabs
  },
  mounted() {
    // scroll代表滚动条距离页面顶部距离
    // window.addEventListener('scroll', this.dataScroll)
    this.selectAllSubTitle()
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
      this.selectAllSubTitle()
      this.$nextTick(() => {
        let jump = document.getElementById(index);
        let title = document.querySelectorAll('h1,h2,h3')
        this.navList = Array.from(title)
        this.navList.forEach((item) => {
          item.style.color = 'rgb(0, 50, 60)'
        })
        jump.style.color = '#5b9bd1'
        let total = jump.offsetTop - 80;
        window.scrollTo({
          top: total,
          behavior: 'smooth'
        });
      })
    },
    selectAllSubTitle() {
      this.$nextTick(() => {
        let title = document.querySelectorAll('h2,h3')
        const navList = Array.from(title)
        // const menuItem = new Array(navList.length).fill({})
        this.menuItems = navList.map((item, index) => {
          const menuItem = {}
          menuItem['title'] = item.innerHTML
          menuItem['id'] = item.id
          // 使用正则表达式提取数字
          const match = item.tagName.match(/\d+/);
          if (match) {
            menuItem['level'] = match[0];
          } else {
            console.error("No number found");
          }
          return menuItem
        })
        console.log('menuItem', this.menuItems)
        // this.menuItem = menuItem
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
	position: relative;
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
	position: fixed;
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
	top: 100px;
}
.sidebar-toggle {
	left: 0;
	top: 100px;
}
.image-border {
	border: 1px solid #00323c;
	border-radius: 5px;
}
</style>
