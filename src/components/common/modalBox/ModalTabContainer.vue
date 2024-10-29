<template>
    <div class="modal-tabs">
      <el-tabs v-model="activeTab" class="full-width-tabs" stretch>
        <el-tab-pane
          v-for="(tab, index) in tabs"
          :key="index"
          :label="tab.label"
          :name="tab.name"
          lazy
        >
          <!-- 只有在激活状态下才插入内容 -->
            <div v-if="activeTab === tab.name">
            <slot :name="tab.slotName"></slot>
            </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      tabs: {
        type: Array,
        required: true,
        // tabs 参数结构
        // [{label: 'Tab1', name: 'tab1', slotName: 'tab1'}, {label: 'Tab2', name: 'tab2', slotName: 'tab2'}, ...]
      }
    },
    data() {
      return {
        activeTab: this.tabs[0]?.name || 'tab1' // 默认选中第一个tab
      };
    }
  };
  </script>
   <style scoped>
.modal-tabs {
    width: 100%;
}

   </style>
  