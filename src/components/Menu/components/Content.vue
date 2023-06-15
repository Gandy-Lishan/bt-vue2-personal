<template>
	<div class="doc-content" :class="isToggle ? 'toggle' : ''">
		<div class="section-container">
			<div title="Directory" class="sidebar-button" @click="toggleLeftMenu" :class="isToggle ? 'sidebar-toggle' : 'sidebar-untoggle'">
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
					<h2 id="0-1">Chart section</h2>
					<hr />
					<p>
						In the chart section of BacktestEdge, users can select stock/index
						symbol to be backtested and add to favorites; select sentiment
						indicators and add to favorites; select technical indicators and
						modify settings; select timeframe among Daily/Weekly/Monthly; select
						the Day/Night theme of chart.
					</p>
					<h3 id="0-1-0">How to change Symbol on a chart</h3>
					<p>
						Find the search box named symbol in the chart and select the stock
						you want to replace, such as AAPL, within the search box. When the
						stock is replaced, The symbol in the form below will be replaced
						synchronously. You can use it as a stock parameter for backtesting
						when running a backtest.
					</p>
					<h3 id="0-1-1">How to change the Sentiment Indicator on a chart</h3>
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
					<h3 id="0-1-2">How to change the Technical Indicator on a chart</h3>
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
					<h3 id="0-1-3">How to change the chart type on a chart</h3>
					<p>
						Find a drop-down option called Display in the chart and select the
						Style you want to replace, such as Bar, in the drop-down box. When
						the Chart Style is replaced, the corresponding type of curve style
						will be displayed below the chart. 。 It should be noted that the
						type of chart is determined by the indexer, for example some
						indexers only support the Candle Style.
					</p>
					<h3 id="0-1-4">How to change the chart period on a chart</h3>
					<p>
						Find the drop-down option named 1D in the chart, where 1D represents
						Daily, 1W means Weekly, 1M represents Montthly, and inside the
						drop-down box select the period you want to replace, such as 1W. The
						stock cycle in the chart has and the form under the Set Up Backtest
						tab changes as the period changes , you can use it as a timeframe
						parameter for backtesting when creating a backtest.
					</p>
					<h3 id="0-1-5">How to change the chart theme</h3>
					<p>
						Open Settings in the chart, find Themes in the settings, there are
						currently two themes for the chart, Dark and Light, which you can
						change according to your personal preferences.
					</p>
					<h3 id="0-1-6">How to clear chart contents with one click</h3>
					<p>
						When you have selected multiple indexers in the chart, you can clear
						the chart by clicking the Clear Chart button below the chart.
					</p>
					<h3 id="0-1-7">How to hide the stock information prompt box</h3>
					<p>
						When you move your mouse into the stock curve box, a blue message
						box will appear, and if you don't need it, you can click the
						information button to close it.
					</p>
					<h3 id="0-1-8">How to hide chart gridlines</h3>
					<p>
						The chart will display the gridlines of the x-axis and y-axes by
						default, if you don't need it, you can click the Grid button to hide
						it.
					</p>
					<h3 id="0-1-9">How to hide Last Price</h3>
					<p>
						The chart will show the Price of the last Bar by default, if you
						don't need it, you can click the Last Price button to hide it.
					</p>
					<h3 id="0-1-10">Add stocks to favorites</h3>
					<p>
						Click the Add to Favorites button to the right of the stock name to
						add the stock to your favorites. At this time, you can click on the
						Symbol search box to view the stocks in the favorites.
					</p>
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
					<h3 id="0-1-12">How to modify the extremum of the Sentiment Indicator</h3>
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
					<h3 id="0-1-14">How to remove Range Selector</h3>
					<p>
						There is a Range Select below the chart, and you can drag the
						selector to see the chart curves within a specified range. If you
						want to hide it, you can uncheck Range Selector in the settings
					</p>
					<h3 id="0-1-15">Set Y-Axis Preferences</h3>
					<p>
						In the chart you can set Y-Axis Preferences, just open the settings,
						find the Y-Axis Preferences section, the chart provides two kinds of
						Preferences. Tick Log Scale to think Your stock graph will grow
						according to the curve, give invert and your stock graph will flip.
					</p>
					<h3 id="0-1-16">How to delete a specified Indexer in a chart</h3>
					<p>
						To delete a specified Indexor in the chart, you can click on the X
						sign in the upper left corner of the indicator to delete, or you can
						move the mouse over the indicator you want to delete, right-click,
						and drop down the menu Select Delete Indicator to delete the current
						indicator.
					</p>
					<h2 id="0-2">Form section</h2>
					<p>
						In the chart section of BacktestEdge, users can select stock/index
						symbol to be backtested and add to favorites; select sentiment
						indicators and add to favorites; select technical indicators and
						modify settings; select timeframe among Daily/Weekly/Monthly; select
						the Day/Night theme of chart.
					</p>
				</section>
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
		<RightMenu :menuItems="menuItems"></RightMenu>
	</div>
</template>
<script>
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
			isToggle: false
		}
	},
  components: {
    RightMenu
  },
  mounted() {
    // scroll代表滚动条距离页面顶部距离
    // window.addEventListener('scroll', this.dataScroll)
    this.selectAllSubTitle()
  },
  methods: {
		toggleLeftMenu() {
			this.isToggle = !this.isToggle
			this.$emit('click', this.isToggle)
		},
    jump(index) {
      let jump = document.getElementById(index);
      let title = document.querySelectorAll('h1,h2')
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

      // const element = document.getElementById(index);
      // if (element) {
      //   element.scrollIntoView({ behavior: 'smooth', block: "start", inline: "start" });
      // }
    },
    selectAllSubTitle() {
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
.sidebar-button:hover{
  background-color: #5b9bd1;
  color: white;
  box-shadow: 0px 0px 2px 3px #cee4f7
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
</style>
