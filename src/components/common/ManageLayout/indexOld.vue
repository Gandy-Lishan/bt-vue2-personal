<template>
    <div class="manage-layout-wrapper">
      <!-- 主按钮：事件从 @mouseenter 改为 @click -->
      <button class="toolbar-button" @click="toggleDropdown">
        <span>Manage Layout</span>
        <!-- remove dynamic dropdown icon -->
        <!-- :class="{ 'is-open': isDropdownVisible }" -->
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="chevron-icon"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg> -->
      </button>
  
      <!-- 下拉菜单 -->
      <div v-if="isDropdownVisible" class="dropdown-menu">
        <div class="search-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" v-model="searchQuery" placeholder="Search" />
        </div>
  
        <button class="create-new-button" @click="toggleCreatePanel">
          Save current chart layout
        </button>
  
        <!-- 布局列表 -->
        <ul class="layout-list">
          <li
            v-if="!isLoading"
            v-for="layout in filteredLayouts"
            :key="layout.id"
            @mouseenter="hoveredLayoutId = layout.id"
            @mouseleave="hoveredLayoutId = null"
            @click="handleItemSelected(layout)"
          >
            <span>{{ layout.name }}</span>
            <button
              v-if="hoveredLayoutId === layout.id"
              class="remove-button"
              @click.stop="handleRemoveLayout(layout.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </li>
           <li v-if="isLoading" class="loading-item">Updating List...</li>
           <li v-if="!isLoading && filteredLayouts.length === 0" class="no-results-item">
              No layouts found.
           </li>
        </ul>
      </div>
  
      <!-- 新建布局面板 -->
      <div v-if="isCreatePanelVisible" class="create-layout-panel">
        <input
          type="text"
          v-model="newLayoutName"
          placeholder="Name"
          ref="newLayoutInput"
        />
        <button @click="handleSaveLayout">Confirm</button>
      </div>
    </div>
  </template>
  
  <script>
  import { getLayouts, updateLayout } from '@/service/chartLayoutAPI';
  import { CIQ } from '@/components/common/chart/st-development/js'

  export default {
    name: 'ManageLayout',
    data() {
      return {
        isDropdownVisible: false,
        isCreatePanelVisible: false,
        searchQuery: '',
        layouts: [],
        newLayoutName: '',
        hoveredLayoutId: null,
        isLoading: false,
      };
    },
    computed: {
      filteredLayouts() {
        if (!this.searchQuery) {
          return this.layouts;
        }
        return this.layouts.filter(layout =>
          layout.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
    },
    methods: {
      // 新增：切换下拉菜单的显示/隐藏
      toggleDropdown() {
        this.isDropdownVisible = !this.isDropdownVisible;
        // 如果菜单刚被打开，就获取数据
        if (this.isDropdownVisible) {
          this.fetchLayouts();
        } else {
          // 如果是关闭主菜单，确保新建面板也一起关闭
          this.isCreatePanelVisible = false;
        }
      },
  
      async fetchLayouts() {
        console.log('Fetching layouts...');
        this.isLoading = true;
        try {
          this.layouts = await getLayouts();
          debugger
        } catch (error) {
          console.error('Failed to fetch layouts:', error);
        } finally {
          this.isLoading = false;
        }
      },
  
      // 隐藏下拉菜单 (也隐藏新建面板)
      hideDropdown() {
        this.isDropdownVisible = false;
        this.isCreatePanelVisible = false;
      },
  
      // 新增：处理点击组件外部区域的逻辑
      handleClickOutside(event) {
        // $el 是该 Vue 实例的根 DOM 元素
        // 判断点击事件的目标是否在组件的 DOM 元素内部
        if (this.$el && !this.$el.contains(event.target)) {
          this.hideDropdown();
        }
      },
  
      toggleCreatePanel() {
        this.isCreatePanelVisible = !this.isCreatePanelVisible;
      },
  
      async handleSaveLayout() {
        if (!this.newLayoutName.trim()) {
          alert('Layout name cannot be empty.');
          return;
        }
        try {
          const layout = CIQ.saveLayout(this.newLayoutName)
          this.layouts.push(layout)
          await updateLayout(this.layouts);
          this.newLayoutName = '';
          this.isCreatePanelVisible = false;
          await this.fetchLayouts();
        } catch (error) {
          console.error('Failed to save layout:', error);
        }
      },
  
      async handleRemoveLayout(layoutId) {
        try {
          const index = this.layouts.findIndex(layout => layout.id === layoutId);
          if (index !== -1) {
            this.layouts.splice(index, 1);
          } else {
            throw Error(`Layout with id ${layoutId} not found.`)
          }
          await updateLayout(this.layouts);
          await this.fetchLayouts();
        } catch (error) {
          console.error('Failed to remove layout:', error);
        }
      },

      handleItemSelected(layout) {
        CIQ.restoreLayout(layout)
      },
    },
    watch: {
      isCreatePanelVisible(isVisible) {
        if (isVisible) {
          this.$nextTick(() => {
            this.$refs.newLayoutInput?.focus();
          });
        }
      },
    },
    // 新增：Vue 生命周期钩子
    mounted() {
      // 在组件挂载后，添加一个全局的点击事件监听器
      document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
      // 在组件销毁前，移除事件监听器，以防内存泄漏
      document.removeEventListener('click', this.handleClickOutside);
    },
  };
  </script>
  
  
  <style scoped lang="less">
  /* 主容器和定位 */
  .manage-layout-wrapper {
    position: relative;
    display: inline-block;
  }
  
  /* 工具栏按钮 */
  .toolbar-button {
    align-items: center;
    gap: 4px;
    padding: 0 22px 0 10px;
    background-color: transparent;
    border: none;
    border-radius: 6px;
    color: #575757;
    cursor: pointer;
    min-width: 100px;
    display: flex;
    line-height: 40px;
    font-weight: 400;

    span{ transition: color .20s 0s; }
  }

  .toolbar-button:after {
        content: "";
        position: absolute;
        right: 10px;
        top: 19px;
        display: block;
        width: 5px;
        height: 5px;
        border-right: solid thin #959595;
        border-bottom: solid thin #959595;
        transform: rotate(45deg) scale(1);
    }
  
  .toolbar-button:hover span{
     color: #000;
  }
  
  .chevron-icon {
    transition: transform 0.2s ease;
  }
  
  .chevron-icon.is-open {
    transform: rotate(180deg);
  }
  
  /* 下拉菜单 */
  .dropdown-menu {
    border-radius: 0 0 24px 24px;
    position: absolute;
    top: 100%;
    left: -20px;
    margin-top: 8px;
    width: 240px;
    background-color: #fff;
    padding: 10px 10px 6px 10px;
    z-index: 1000;
    margin-top: 0px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  /* 搜索框 */
  .search-container {
    position: relative;
    margin-bottom: 8px;
  }
  
  .search-icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #666;
  }
  
  .search-container input {
    width: 100%;
    padding: 8px 12px 8px 32px;
    font-size: 14px;
    box-sizing: border-box;
    border-top: none;
    border-left: none;
    border-right: none;
  }
  .search-container input:focus {
      outline: none;
      border-color: #007aff;
      box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
  }
  
  
  /* 新建按钮 */
  .create-new-button {
    width: 100%;
    border: none;
    background-color: #5b9bd1;
    color: white;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-bottom: 8px;
  }
  
  .create-new-button:hover {
    background-color: #518bbb;
  }
  
  /* 布局列表 */
  .layout-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 500px;
    min-height: 100px;
    overflow-y: auto;
  }
  
  .layout-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin: 0 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s ease;
    border-radius: 12px;
    max-height: 40px;
  }
  
  .layout-list li:hover {
    background-color: #efefef;
    color: #000;
  }
  
  .loading-item, .no-results-item {
      color: #666;
      padding: 8px 12px;
      font-style: italic;
      cursor: default;
      min-height: 100px;
  }
  .loading-item:hover, .no-results-item:hover {
      background-color: transparent !important;
  }
  
  
  /* 移除按钮 */
  .remove-button {
    background: transparent;
    border: none;
    padding: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: #666;
  }
  
  .remove-button:hover {
    color: #333;
    background-color: #e0e0e0;
  }
  
  /* 新建布局面板 */
  .create-layout-panel {
    position: absolute;
    top: 100%;
    left: calc(100% + 100px); /* 定位到下拉菜单右侧 */
    width: 200px;
    padding: 10px 10px 6px 10px;
    background-color: #fff;
    border-radius: 0 0 24px 24px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1001; /* 确保在下拉菜单之上 */
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .create-layout-panel input {
    width: 100%;
    padding: 8px 12px;
    border-top: none;
    border-left: none;
    border-right: none;
    font-size: 14px;
    box-sizing: border-box;
  }
  .create-layout-panel input:focus {
      outline: none;
      border-color: #007aff;
      box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
  }
  
  .create-layout-panel button {
    width: 100%;
    border: none;
    background-color: #5b9bd1;
    color: white;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-bottom: 8px;
  }
  
  .create-layout-panel button:hover {
    background-color: #518bbb;
  }
  </style>
  
  