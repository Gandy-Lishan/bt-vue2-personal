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
		<Content :id="activeSection" ref="content" @click="toggleLeftMenu"></Content>
	</div>
</template>

<script>
import Sidebar from './SideBar.vue';
import Content from './Content.vue';

export default {
  components: {
    Sidebar,
    Content
  },
  data() {
    return {
      sections: [
        {
          id: '0',
          title: 'Brief introduction of BacktestEdge',
          subsections: [
            { id: '0-0', title: 'Chart section' },
            { id: '0-1', title: 'Form section' }
          ]
        },
        { id: '1', title: 'How to create a new backtest', subsections: [
            { id: '1-0', title: 'Create a single-signal entry/exit criteria new backtest' },
            { id: '1-1', title: 'Use Risk Control at Exit' },
            { id: '1-2', title: 'Set different backtest timeframe' },
            { id: '1-3', title: 'Create a samebar multi-signal entry/exit criteria new backtest' },
            { id: '1-4', title: 'Create a timeorder multi-signal entry/exit criteria new backtest' },
            { id: '1-5', title: 'Set the value of delay of bars' },
            { id: '1-6', title: 'Create a new backtest with custom indicator for entry/exit criteria' },
            { id: '1-7', title: 'Set the Trade Price for backtesting' },
            { id: '1-8', title: 'Exclude Overlapping Observations for Backtesting' },
          ] },
          {
            id: '2', title: 'Add created backtest to My Favorites', subsections: [
              { id: '2-0', title: 'Open the Backtest History tab' },
              { id: '2-1', title: 'View backtest in My Favorites' }
            ]
          },
          {
            id: 'fls', title: 'Finding the Last Signal Using BacktestEdeg', subsections: [
              { id: 'fls-0', title: "Click the 'find last signal' button" },
              { id: 'fls-1', title: 'Wait for the backtest to finish' }
            ]
          },
          { id: '3', title: 'Edit a created backtest', subsections: [
            { id: '3-0', title: 'Open the Backtest History tab' },
            { id: '3-1', title: 'Edit in Set Up Backtest' }
          ]},
          { id: '4', title: 'View result of a created backtest', subsections: [
            { id: '4-0', title: 'Open the Backtest History tab' },
            { id: '4-1', title: 'Modify the current backtesting parameters' }
          ]},
          { id: '5', title: 'Copy a sample backtest', subsections: [
            { id: '5-0', title: 'Open the Sample Backtests tab' },
            { id: '5-1', title: 'Edit and run a copied backtest' }
          ]},
          { id: '6', title: 'How to view the description of the backtest in the list', subsections: [
            { id: '6-0', title: 'Open any list page' },
            { id: '6-1', title: 'How to know the indicator parameters used by the backup through description' },
          ]},
          { id: '7', title: 'How to exit with customized Time-In-Market',subsections: [
            { id: '7-0', title: 'Open the History tab and view the backtest results' },
            { id: '7-1', title: 'Click button to customize the TIM' }
          ]},
          {
            id: '8', title: 'Backtesting parameter explanation', subsections: [
            ]
          },
          {
            id: '9', title: 'Backtesting in Analyst Reports', subsections: [
              { id: '9-0', title: 'Copy Backtest' },
              { id: '9-1', title: 'View Backtest Results' },
              { id: '9-2', title: 'Analyst Report Link' },
              { id: '9-3', title: 'Share Backtest' }
            ]
          },
      ],
      activeSection: '0',
      isToggle: false
    }
  },
  mounted() {
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





