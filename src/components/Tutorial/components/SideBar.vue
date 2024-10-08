<template>
  <div class="sidebar">
    <p class="sidebar-heading open">Guide</p>
    <ul class="sidebar-links sidebar-group-items">
      <li v-for="section in sections" :key="section.id" @click="scrollToSection(section.id)" :class="{ 'active': activeSection === section.id }" class="sidebar-sub-header">
        <a class="sidebar-link" @click="toggleSection(section.id)"><i v-if="['1', 'fls', '5'].includes(section.id)" class="el-icon-video-play" style="margin-right: 5px"></i>{{ section.title }}</a>
        <recursive-sidebar v-if="isSectionExpanded(section.id) && section.subsections" :sections="section.subsections" :activeSection="activeSection"  @scroll-to-section="scrollToSection"></recursive-sidebar>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    sections: {
      type: Array,
      default: () => []
    },
    activeSection: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      expandedSections: [] // 用于记录展开的一级标题的数组
    }
  },
  mounted() {
    const skipID = this.$route.params.id
		if(skipID) {
      let titleID = null
			if(skipID.includes('-')){
        titleID = skipID.split('-')[0]
      }else{
        titleID = skipID
      }
        this.toggleSection(titleID)
        this.scrollToSection(skipID)
		}
  },
  methods: {
    scrollToSection(sectionId) {
      this.activeSection = sectionId
      console.log('activeSection', sectionId)
      this.$emit('recv-act-secId', sectionId)
      // const element = document.getElementById(sectionId);
      // if (element) {
      //   element.scrollIntoView({ behavior: 'smooth' });
      // }
    },
    toggleSection(sectionId) {
      // 切换一级标题的展开状态
      if (this.isSectionExpanded(sectionId)) {
        this.expandedSections = this.expandedSections.filter(id => id !== sectionId);
      } else {
        this.expandedSections.push(sectionId);
      }
    },
    isSectionExpanded(sectionId) {
      // 检查一级标题是否展开
      return this.expandedSections.includes(sectionId);
    }
  },
  components: {
    RecursiveSidebar: {
      name: 'RecursiveSidebar',
      props: ['sections', 'activeSection'],
      methods: {
        scrollToSection(sectionId) {
          this.$emit('scroll-to-section', sectionId); // 触发父组件的事件来更新 activeSection 值
        }
      },
      template: `
        <ul class="sidebar-sub-headers">
          <li v-for="section in sections" :key="section.id" @click.stop="scrollToSection(section.id)" :class="{ 'sub-active': activeSection === section.id }" class="sidebar-sub-header">
            <a class="sidebar-link">{{ section.title }}</a>
            <recursive-sidebar v-if="section.subsections" :sections="section.subsections"  @scroll-to-section="scrollToSection"></recursive-sidebar>
          </li>
        </ul>
      `
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  margin-top: 122px;
  padding-bottom: 20px;
  background-color: #fff;
}
.sidebar-heading {
    color: #2c3e50;
    transition: color .15s ease;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 700;
    padding: 0.35rem 1.5rem 0.35rem 1.25rem;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    border-left: 0.25rem solid transparent;
}
.sidebar ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
}
.sidebar-group-items {
    transition: height .1s ease-out;
    font-size: .95rem;
    overflow: hidden;
}
.sidebar .sidebar-sub-headers {
    font-size: .90em;
}
.sidebar-group a.sidebar-link {
    padding-left: 2rem;
}

.sidebar /deep/ a.sidebar-link {
    font-size: 1em;
    font-weight: 500;
    display: inline-block;
    color: #2c3e50;
    border-left: 0.25rem solid transparent;
    padding: 0.35rem 1rem 0.35rem 1.25rem;
    line-height: 1.4;
    width: 100%;
    box-sizing: border-box;
}
.sidebar /deep/ a.sidebar-link:hover{
  color: #5b9bd1;
}

.sidebar li {
  cursor: pointer;
}
.sidebar li.active a.sidebar-link:first-child
{
  /* background-color: #5b9bd11f; */
  border-left: 4px solid #5b9bd1;
  color: #5b9bd1;
}
.sidebar /deep/ li.active a.sidebar-link {
  color: #5b9bd1;
}
.sidebar li.sub-active a.sidebar-link,
.sidebar /deep/ li.sub-active a.sidebar-link{
  /* border-left: 3px solid #5b9bd1; */
  background-color: #5b9bd11f;
  /* color: #5b9bd1; */
}
.sidebar-sub-header a.sidebar-link {
  padding-left: 0.5rem;
}
</style>