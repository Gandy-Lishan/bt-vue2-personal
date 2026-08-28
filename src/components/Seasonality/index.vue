<template>
  <div class="seasonality-container">
    <div class="seasonality-top">
			<h2 class="page-title" style="margin-top: 0px">Seasonality</h2>
			<p>
				Just as moon phases impact tidal activity, there are consistent forces at work in the equities markets. Not all of them are understood, but they include mutual fund flows, options activity, weekend exposure effects, etc.
			</p>
			<p>
				Some of these seasonality biases occur with considerable consistency, and it pays to be aware of them. New charts and data will be added continuously, so please check back often. Scroll down to the bottom for external research on seasonal influences.
			</p>
			<p>
				Click on the bias below to see the desired chart. Your browser must support frames to view some of them.
			</p>
		</div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="Performance by Day of Month" name="first">
      <DayOfMonth></DayOfMonth>
    </el-tab-pane>
    <el-tab-pane label="Performance Around Specific Days" name="second">
			<SpecificDay></SpecificDay>
		</el-tab-pane>
    <el-tab-pane label="Other Charts & Data" name="third">
			<Others></Others>
		</el-tab-pane>
    <el-tab-pane label="The growth of one U.S. dollar" name="fourth">
      <GrowthOfOneDollar></GrowthOfOneDollar>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import DayOfMonth from "./components/DayOfMonth/index.vue"
import SpecificDay from "./components/SpecificDay/index.vue"
import Others from "./components/Others/index.vue"
import GrowthOfOneDollar from "./components/GrowthOfOneDollar/index.vue"
export default {
  name: 'Seasonality',
  data() {
    return {
      activeName: 'first'
    }
  },
  components: {
    DayOfMonth,
		SpecificDay,
		Others,
    GrowthOfOneDollar
  },
  methods: {
    handleClick() {
      return true
    },
    jumpToQA() {
      const path = 'https://btv2.sentimentrader.com/doc/QA/3'
      window.open(path, '_blank')
    },
  }
}
</script>

<style lang="less" scoped>
.seasonality-container{
	padding-top: 50px;
	padding-right: 15px;
	padding-left: 15px;
	margin-right: auto;
	margin-left: auto;
	background-color: #ffffff;
	font-family: "Open Sans",sans-serif;
  width: 1170px;
	.seasonality-top{
		color: #000000;
		p{
			font-weight: 400;
			font-size: 16px;
		}
	}
/deep/ .el-tabs__nav.is-top{
  width: 100%;
}
/deep/ .el-tabs__item.is-top{
  width: 25%;
  text-align: center;
}
}
.el-tabs {
	padding: 0
}
@media (max-width: 1200px) {
  .seasonality-container {
    padding: 50px 0px 0px 0px;
    width: 100%;
    /deep/ .el-tabs__item.is-top{
      width: 100%;
    }
    /deep/ .el-tabs__nav-scroll {
      overflow-x: auto;
    }
  }
}
</style>