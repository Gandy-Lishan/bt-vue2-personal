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
import Content from './QAndAContent.vue';

export default {
  name: 'QAndADoc',
  components: {
    Sidebar,
    Content
  },
  data() {
    return {
      sections: [
      {
          id: '0',
          title: 'Smart Stock Scanner Q&A',
          subsections: [
             { id: '0-0', title: 'Q1. What is Smart Stock Scanner?' },
             { id: '0-1', title: 'Q2. How can I view today’s recommended stock list?' },
             { id: '0-2', title: 'Q3. What are the signal types?' },
             { id: '0-3', title: 'Q4. How should I interpret the Optix indicator?' },
             { id: '0-4', title: 'Q6. How do I view historical backtest data for a specific stock?' }
         ]
        },
        {
          id: '1',
          title: 'Scanner Backtest Q&A',
          subsections: [
             { id: '0-0', title: 'Q1. What is Smart Stock Scanner?' },
             { id: '0-1', title: 'Q2. How can I view today’s recommended stock list?' },
             { id: '0-2', title: 'Q3. What are the signal types?' },
             { id: '0-3', title: 'Q4. How should I interpret the Optix indicator?' },
             { id: '0-4', title: 'Q6. How do I view historical backtest data for a specific stock?' }
         ]
        },
        { id: '2', title: 'Option Scanner Q&A',
        subsections: [
             { id: '2-0', title: 'Q1.What is the Option Scanner, and how can it help me?' },
             { id: '2-1', title: 'Q2:  What is a "Sell Put" strategy?' },
             { id: '2-2', title: 'Q3:Why is it recommended to target a Probability of Profit (Prob. of Profit) above 95%?' },
             { id: '2-3', title: 'Q4: What is the Expected Value Score, and why does it matter?' },
             { id: '2-4', title: 'Q5: What is the difference between CAGR and a standard return rate?' },
             { id: '2-5', title: 'Q6: What is DTE? How many days to expiration should I select?' },
             { id: '2-6', title: 'Q7: How do I use the Break Even price practically?' },
             { id: '2-7', title: 'Q8: What is the difference between the Option Scanner and the Stock Scanner? Which should I use?' },
             { id: '2-8', title: 'Q9: I found an exceptional trade opportunity, but I want to manage my risk. How do I hedge?' },
             { id: '2-9', title: 'Q10: Is the Option Scanner right for me?' },
             { id: '2-10', title: 'Q11: What is the underlying financial logic behind making money by selling Puts?' },
             { id: '2-11', title: 'Q12: What constitutes a "High-Quality Setup"?' },
             { id: '2-12', title: 'Q13: Is a higher Probability of Profit always better?' },
             { id: '2-13', title: 'Q14: What is considered a normal or healthy return rate?' },
             { id: '2-14', title: 'Q15: Should I favor short-term or long-term durations?' },
             { id: '2-15', title: 'Q16: Is being assigned (forced to buy the stock) a failure?' },
             { id: '2-16', title: 'Q17: What happens if the stock drops but stays above my strike price?' },
             { id: '2-17', title: 'Q18: Should I trade contracts offering unusually massive premiums?' },
             { id: '2-18', title: 'Q19: Do I need to manually close option positions before they expire?' },
             { id: '2-19', title: 'Q20: How many positions should I hold at one time?' },
             { id: '2-20', title: 'Q21: What are the primary traps to avoid?' },
         ]
         }
      ],
      activeSection: '0',
      isToggle: false,
      doc: 'QAndADoc'
    }
  },
  mounted() {
    const skipID = this.$route.params.id
		if(skipID) {
        this.activeSection = `${skipID}`
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





