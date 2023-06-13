<template>
	<div class="doc-content">
		<div class="section-container">
			<section id="1" v-if="id == '1' || id == '1-1'">
				<!-- Section 1 内容 -->
				<h1>
					<img
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAABH1JREFUSA3tVl1oHFUUPmdmd2ltklqbpJDiNnXFmgbFktho7YMPNiJSSZM0+CAYSkUELVhM6YuwIPpgoOKDqOBDC0XE2CQoNtQXBUFTTcCi+Wlh1V2TQExsUzcltd3M9Tt3ZjZzZ2fT+OJTL8yeM+eee757fmeJbq//KQL8X3DUSFOcfr7cRsRtxNQMWueeVzOkaITIGqQHNg5y8+jNW9ldM7A6nTpAjuolUikAwq7CE3WcM2RRDz+XGVgN3FptU/aUSlvq9Pa3iZ1+sgAqJyyAFqkipd9dqiwHF3P65YycLWc/6sqGrvoEoIp6DOFaX5h6+dnfjkWprwqsPk0dUGq5vySwDImC10KxFHgGL1SWoc92O3eVht09qdXNH11I2SsTsJYqMWzihqGMi+A+Garf3BAuuLI5oGlULyNfyB/HYNujwktOfRrMr5t77NmevqaUopx0grnKAyvVpmwUDB4x6FPXuGvYLTDwWsejwgtgkYKPqRJg8SV6xaiZ3ZTppGneS4yfH5/66fZSDHv+QZci/+h5c5UHtpy67JUqGppM0sh0Nc1dW6/N1W5Yoqat8/TU/VnadmdeW2PLLSyh0cvxBs3KbqTmwYPpxN4do/mzE8nEpvX/UMu2Wbp74zUAK5q6WkHns7V0eWkdPbPzd3rxkTGybadYySumVzhcaJFbs5UrEkQ/+CK8gF5dnh/6ciIZ73gwQ927L1IitoxKLXYP3SjYdOrHHfTZhRRlFyrorafPk20B3HPD1y2G3qKZME5Jcf3t/HUC13/8tSd++vqFveMUTwAUxSUFI1QekR1+bIze3D9MF2aq6cPvG72CgnldWCFqyRw3lwH8ZMerjTD9ElRO7Gv44wNpC90aASqGfVlz/Rx17srQ57/UU26hkhQqUB7dBR71WmzQhHUnblGmVOEw0jhbV1n9OlXUDCIRGaNV5Jp43N516fN7JmnTHdfp7Hgy0luO4aMhtkLL8Bi3bUWYvzh5Mn1dTxrL6QmGuRhGL/TiTTxRoEdTszSaq9GR0NGA3KdkOz3hqSV3MIDhQ5IVX/Ivx3umBti2es2h4eZby7x8br1rkf7Mo90AqC8aQ3sJeNzqFRu+vSANAQe3PL7l0HGOAdwDCeZYvNKeoZp1Qfs6Aipndh86HmFRi0LAnEO47wsqM6cdfjh3jBPUzhZy7nvlUfFsamED1VQt6aISHVymXZ/B2aCtIG8AI8xfobj2d3en1wWVhOeHELKmLQ1s211s88comkv4UCwWyF787mJdYXtNfhKAXVqnKTq8QZvGAGGOfaTo5pGZ/PwbUCr5+DPr/1J92JNHr9aOl/F3iI5+O1nfybsGxoimvZ3ViWSluDITw3P37mypheDIPY0tw7+O/5ApbkYw+zpfaUVu32Pi98+defdUhEpZkRFq0aqyNh9FuL9hpYbEm6iwi0z2REd09ZmyENEbuhjDWzKvZXTqKYaBIr3tt5kuPtQBZFvEUwHt60vfCNu41XsksH9Ij1BMMz1Y0OOunHNShFIP5868g5zeXmuLwL9T4b6Q2+KejgAAAABJRU5ErkJggg=="
					/>Brief introduction of BacktestEdge
				</h1>
				<section id="1-1" v-if="id == '1' || id == '1-1'">
					<h2>Chart section</h2>
					<hr />
					<p>
						In the chart section of BacktestEdge, users can select stock/index
						symbol to be backtested and add to favorites; select sentiment
						indicators and add to favorites; select technical indicators and
						modify settings; select timeframe among Daily/Weekly/Monthly; select
						the Day/Night theme of chart.
					</p>
					<h3>How to change Symbol on a chart</h3>
					<p>
						Find the search box named symbol in the chart and select the stock
						you want to replace, such as AAPL, within the search box. When the
						stock is replaced, The symbol in the form below will be replaced
						synchronously. You can use it as a stock parameter for backtesting
						when running a backtest.
					</p>
					<h3>How to change the Sentiment Indicator on a chart</h3>
					<p>
						Find the search box named Sentiment Indicator in the chart, and to
						the right of the list item there will be a cycle for each indexer,
						select the indexer you want to replace, such as Smart Money
						Confidence. When the indexer is replaced, the corresponding graph
						will be displayed below the chart, The Entity Criteria and Exit
						Criteria in the form below are automatically populated into the
						form, but do not overwrite the indexer already selected in the form.
						You can use it as an indexator for backtesting when running
						backtesting.
					</p>
					<h3>How to change the Technical Indicator on a chart</h3>
					<p>
						Find a drop-down option called Studios in the chart and select the
						indexer you want to replace in the search box, such as the
						Connectivity Channel Index. When the indexer is replaced, the
						corresponding graph will be displayed below the chart, 。 The
						Technical Indicators selected on the chart are not populated with
						The Entry Criteria and Exit Criteria as the Selection Indicators are
						selected, and if you want to use Technical Indicators in
						backtesting, You can select directly from the form.
					</p>
					<h3>How to change the chart type on a chart</h3>
					<p>
						Find a drop-down option called Display in the chart and select the
						Style you want to replace, such as Bar, in the drop-down box. When
						the Chart Style is replaced, the corresponding type of curve style
						will be displayed below the chart. 。 It should be noted that the
						type of chart is determined by the indexer, for example some
						indexers only support the Candle Style.
					</p>
				</section>
				Section 1
			</section>
			<section id="section2" v-else-if="id == 'section2'">
				<!-- Section 2 内容 -->
				Section 2
			</section>
			<section id="section3" v-else-if="id == 'section3'">
				<!-- Section 3 内容 -->
				Section 3
			</section>
		</div>
	</div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
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
}
.section-container {
	border: 1px solid #f2f6fc;
	width: 85%;
	margin: 0 auto;
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
</style>
