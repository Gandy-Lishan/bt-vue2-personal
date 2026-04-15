<template>
	<div class="blog">
    <transition name="toggle">
      <Sidebar
        :sections="sections"
        :activeSection="activeSection"
        @recv-act-secId="recvActSecId"
        v-show="!isToggle"
      ></Sidebar>
    </transition>
		<Content :id="activeSection" ref="content" @click="toggleLeftMenu" :doc="doc"></Content>
	</div>
</template>

<script>
import Sidebar from './SideBar.vue';
import Content from './ScannerContent.vue';

export default {
  name: 'AIScannerDoc',
  components: {
    Sidebar,
    Content
  },
  data() {
    return {
      sections: [
      {
          id: '0',
          title: 'The generation logic of Smart Stock Scanner',
        },
        {
          id: '1',
          title: 'Table of Contents',
          subsections: [
            { id: '1-0', title: 'I. Optix Sentiment Indicator Strategies' },
            { id: '1-1', title: 'II. Technical Indicator Strategies' },
            { id: '1-2', title: 'III. Trend Patterns' }
          ] 
        },
        { id: '2', title: 'I. Optix Sentiment Indicator Strategies',
         subsections: [
             { id: '2-0', title: '1.1 Optix #1: Symbol Close > its\' MA200 and Optix MA5 < 35' },
             { id: '2-1', title: '1.2 Optix #2: Symbol Close > its\' MA200 and Optix < 30' },
             { id: '2-2', title: '1.3 Optix #3: Optix MA10 < 30 and Optix < 20' },
             { id: '2-3', title: '1.4 Optix #4: Optix CrossBelow 0.5' },
             { id: '2-4', title: '1.5 Optix #5: Symbol Close > its\' MA200 and Optix MA5 > 43 After Below 35' },
             { id: '2-5', title: '1.6 Optix #6: Symbol Close > its\' MA200 and Optix MA10 > 43 After Below 35' },
             { id: '2-6', title: '1.7 Optix #7: Symbol Close > its\' MA200 and Optix > 43 After Below 30' },
         ]
         },
          {
            id: '3', title: 'II. Technical Indicator Strategies',
            subsections: [
             { id: '3-0', title: '2.1 RSI - Relative Strength Index' },
             { id: '3-1', title: '2.2 Price Breakout (21-Day)' },
             { id: '3-2', title: '2.3 High & Low Points (13-Day)' },
             { id: '3-3', title: '2.4 Candlestick Patterns (Hammer & Shooting Star)' },
             { id: '3-4', title: '2.6 MACD Histogram & HistGap' },
             { id: '3-5', title: '2.7 X-Period Highs/Lows' },
            ]
          },
          { id: '4', title: 'III. Appendix: Quick Reference',subsections: [
             { id: '4-0', title: '3.1 Trendline Patterns (UpTrend & DownTrend)' },
             { id: '4-1', title: '3.2 Triple Tap & Rounding Bottom' },
             { id: '4-2', title: '3.3 Price Channels (Ascending & Descending)' },
             { id: '4-3', title: '3.4 Head and Shoulders (Top & Bottom)' },
             { id: '4-4', title: '3.5 Double Top & Double Bottom' },
             { id: '4-5', title: '3.6 Trend Score (Breakout & Breakdown)' },
            ]},
      ],
      activeSection: '0',
      isToggle: false,
      doc: 'AIScanner'
    }
  },
  mounted() {
    const skipID = this.$route.params.id
		if(skipID) {
			this.recvActSecId(skipID)
		}
  },
  methods: {
    recvActSecId(sectionId) {
      this.activeSection = sectionId
      this.$refs.content.jump(sectionId)
    },
    toggleLeftMenu(isToggle) {
      this.isToggle = isToggle
    }
  }
};
</script>

<style lang="less">
.toggle-enter-active {
  transition: transform 0.5s;
}

.toggle-enter-from {
  transform: translateX(50%);
  display: none; /* 设置初始时隐藏 */
}

.toggle-leave-active {
  transition: transform 0.5s;
}

.toggle-leave-to {
  transform: translateX(-100%);
  display: none; /* 设置最终时隐藏 */
}


</style>





