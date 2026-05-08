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
             { id: '0-0', title: 'Q1. What is Smart Stock Scanner?' },
             { id: '0-1', title: 'Q2. How can I view today’s recommended stock list?' },
             { id: '0-2', title: 'Q3. What are the signal types?' },
             { id: '0-3', title: 'Q4. How should I interpret the Optix indicator?' },
             { id: '0-4', title: 'Q6. How do I view historical backtest data for a specific stock?' }
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





