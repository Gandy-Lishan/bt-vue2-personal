<template>
	<div class="blog">
		<Sidebar :sections="sections" :activeSection="activeSection" @recv-act-secId="recvActSecId"></Sidebar>
		<Content :id="activeSection"></Content>
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
          id: '1',
          title: 'Brief introduction of BacktestEdge',
          subsections: [
            { id: '1-1', title: 'Chart section' }
          ]
        },
        { id: 'section2', title: 'Section 2' },
        { id: 'section3', title: 'Section 3' }
      ],
      activeSection: 'section1'
    }
  },
  methods: {
    recvActSecId(sectionId) {
      this.activeSection = sectionId
    }
  }
};
</script>

<style>
</style>






