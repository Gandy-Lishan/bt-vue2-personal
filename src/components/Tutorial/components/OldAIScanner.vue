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
          id: 'ai-0',
          title: 'The generation logic of Smart Stock Scanner'
        },
        { id: 'ai-1', title: 'Smart Stock Scanner entrance' },
          {
            id: 'ai-2', title: 'Modify Smart Stock Scanner date'
          },
          // { id: 'ai-3', title: 'Cash Alloc(%) for auto-adjusted stocks'},
          { id: 'ai-3', title: 'Using Filter Buttons'},
          { id: 'ai-4', title: 'Stock List Sorting'},
          { id: 'ai-5', title: "View symbol's backtest information"},
          { id: 'ai-6', title: 'Switching AI Algorithms: SwingAI and MidTermAI' },
      ],
      activeSection: 'ai-0',
      isToggle: false
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





