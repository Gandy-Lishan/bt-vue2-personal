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
            { id: '0-1', title: 'Chart section' },
            { id: '0-2', title: 'Form section' }
          ]
        },
        { id: 'section2', title: 'Section 2' },
        { id: 'section3', title: 'Section 3' }
      ],
      activeSection: '0',
      isToggle: false
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

<style lang="less" scoped>
// .toggle-enter-active, .toggle-leave-active {
//   transition: opacity 0.5s;
//   transition: transform 0.5s;
// }

// .toggle-enter-to, .toggle-leave {
//   opacity: 0;
// }
// .toggle-leave-to {
//   transform: translateX(100%);
// }
.toggle-enter-active {
  transition: transform 0.5s;
}

.toggle-enter-from {
  transform: translateX(-100%);
}

.toggle-leave-active {
  transition: transform 0.5s;
}

.toggle-leave-to {
  transform: translateX(100%);
}
</style>





