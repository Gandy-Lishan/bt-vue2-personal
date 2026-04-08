<template>
    <div class="manage-layout-wrapper">
      <!-- 主按钮：事件从 @mouseenter 改为 @click -->
      <button class="toolbar-button" @click="toggleDropdown">
        <span>Quick Access</span>
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
      <div v-show="isDropdownVisible" class="dropdown-menu">
        <div class="menu-heading">Quick Access</div>
        <ul class="layout-list quick-access-indicators">
            <li @click="setTickerIindicator('optix')">
              <span>Optix</span>
            </li>
            <li @click="setTickerIindicator('trend')">
              <span>Trend</span>
            </li>
            <li @click="setTickerIindicator('reltrend')">
              <span>Rel Trend</span>
            </li>
        </ul>
        <div class="manageChartLayout">
          <cq-separator></cq-separator>
          <div class="menu-heading">
            Manage Chart Layout
            <div class="search-container">
              <input type="search" v-model="searchQuery" placeholder="Search" />
              <button class="expand-btn" @click="toggleExpandPanel" title="Expand">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
            </div>
          </div>
          <div class="save-btn-wrapper"><button class="create-new-button" @click="toggleCreatePanel">
            Save current chart layout
          </button></div>
    
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
              <el-tooltip v-if="isTextOverflow(layout.id)" :content="layout.name" placement="top" :open-delay="300">
                <span :ref="el => setLayoutRef(layout.id, el)">{{ layout.name }}</span>
              </el-tooltip>
              <span v-else :ref="el => setLayoutRef(layout.id, el)">{{ layout.name }}</span>
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

      <!-- 扩展面板 -->
      <div v-if="isExpandPanelVisible" class="expand-panel">
        <div class="expand-panel-header">
          <span>Manage Chart Layout</span>
          <button class="close-btn" @click="isExpandPanelVisible = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="expand-panel-toolbar">
          <div class="toolbar-left">
            <el-input
              v-model="expandSearchQuery"
              placeholder="Search"
              size="small"
              clearable
            >
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
          <div class="toolbar-right">
            <el-input
              v-model="newLayoutName"
              placeholder="Layout name"
              size="small"
              clearable
              @keyup.enter.native="handleSaveLayoutInPanel"
            >
              <el-button slot="append" type="primary" @click="handleSaveLayoutInPanel">Save</el-button>
            </el-input>
          </div>
        </div>
        <el-table
          :data="expandFilteredLayouts"
          class="expand-table"
          style="width: 100%; flex: 1;"
          height="100%"
          v-loading="isLoading"
          empty-text="No layouts found"
          @row-click="handleRowClick"
          :show-header="false"
        >
          <el-table-column
            prop="name"
            label="Name"
          >
            <template slot-scope="scope">
              <span class="layout-name">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Actions"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-delete"
                circle
                @click.stop="handleRemoveLayout(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </template>
  
  <script>
  import { getLayouts, updateLayout } from '@/service/chartLayoutAPI';
  import { CIQ } from '@/components/common/chart/st-development/js'
  import { mapGetters } from "vuex"

  export default {
    name: 'ManageLayout',
    data() {
      return {
        isDropdownVisible: false,
        isCreatePanelVisible: false,
        isExpandPanelVisible: false,
        searchQuery: '',
        expandSearchQuery: '',
        layouts: [],
        newLayoutName: '',
        hoveredLayoutId: null,
        isLoading: false,
        layoutRefs: {},
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
      expandFilteredLayouts() {
        if (!this.expandSearchQuery) {
          return this.layouts;
        }
        return this.layouts.filter(layout =>
          layout.name.toLowerCase().includes(this.expandSearchQuery.toLowerCase())
        );
      },
      ...mapGetters(['getBacktestSymbol']), // 监听chartiq和表单的symbol改动以双向响应
      handleGetBacktestSymbol() {
        return this.getBacktestSymbol
      },
    },
    methods: {
      setLayoutRef(id, el) {
        if (el) {
          this.layoutRefs[id] = el;
        }
      },
      isTextOverflow(id) {
        const el = this.layoutRefs[id];
        if (!el) {
          // Fallback: check by character count if element not ready
          const layout = this.layouts.find(l => l.id === id);
          return layout && layout.name.length > 18;
        }
        return el.scrollWidth > el.clientWidth;
      },
      setTickerIindicator(option) {
        const stx = CIQ.stxx
        const symbol = stx.chart.symbol
        const replaceNameMap = {
            SPX: 'SPY',
            COMP: 'QQQ',
            DJIA: 'DIA'
        }
        const SymbolReplacedName = replaceNameMap[symbol] || symbol
        const indicatorList = CIQ.store.getters.getIndicatorsList
    
        let data
        // xu改过数据源结构后，靠 i.market_symbol == symbol url匹配item
        data = indicatorList.find(i=>i.market_symbol == SymbolReplacedName && i.type == option)
    
        for (var studyInstanceName in stx.layout.studies) {
            var sd = stx.layout.studies[studyInstanceName]
            if (sd.type == data.url || sd.type == data.symbol) {return}
        }
    
        CIQ.store.commit("chart/setCurrentSenti",{url: data.url?data.url:data.symbol, name: data.chart_name, updated: data.updated})     
        let extraIndicators = []
        extraIndicators.push(...CIQ.store.state.chart.indicators.extraIndicators)
        let indicator = ''
        if (data.symbol == undefined){
            indicator = data.url       
        }else{
            indicator = data.symbol
        }
        extraIndicators.push(indicator)
        CIQ.store.commit('chart/getExtraIndicators',extraIndicators)
    
        CIQ.addIndicators({stx:stx})
      },
      // 新增：切换下拉菜单的显示/隐藏
      toggleDropdown() {
        this.isDropdownVisible = !this.isDropdownVisible;
        // 如果菜单刚被打开，就获取数据
        if (this.isDropdownVisible) {
          //if(this.$store.getters.getIsAdmin) {
            this.fetchLayouts();
          //}
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
        this.isExpandPanelVisible = false;
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

      toggleExpandPanel() {
        this.isExpandPanelVisible = !this.isExpandPanelVisible;
        if (this.isExpandPanelVisible && this.layouts.length === 0) {
          this.fetchLayouts();
        }
      },

      handleRowClick(row) {
        CIQ.restoreLayout(row);
        this.isExpandPanelVisible = false;
      },

      async handleSaveLayoutInPanel() {
        if (!this.newLayoutName.trim()) {
          this.$message.warning('Layout name cannot be empty.');
          return;
        }
        try {
          const layout = CIQ.saveLayout(this.newLayoutName);
          this.layouts.push(layout);
          await updateLayout(this.layouts);
          this.newLayoutName = '';
          await this.fetchLayouts();
          this.$message.success('Chart layout saved successfully!');
        } catch (error) {
          console.error('Failed to save layout:', error);
          this.$message.error('Failed to save layout.');
        }
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
          this.$notify.success({
              title: '',
              message: 'chart layout removed successfully.',
              duration: 3000
            });
          await this.fetchLayouts();
        } catch (error) {
          console.error('Failed to remove layout:', error);
        }
      },

      handleItemSelected(layout) {
        CIQ.restoreLayout(layout)
      },

      initializeTickerIndicatorDisplay() {
        const symbol = this.getBacktestSymbol
        
        const replaceNameMap = {
          SPX: 'SPY',
          COMP: 'QQQ',
          DJIA: 'DIA'
        }
        const SymbolReplacedName = replaceNameMap[symbol] || symbol
        const indicatorList = CIQ.store.getters.getIndicatorsList
        let displayMap = {
            0: "disabled",
            1: "disabled",
            2: "disabled",
        }
        for(let i=0;i<indicatorList.length;i++) {
            if(indicatorList[i].market_symbol == SymbolReplacedName) {
                if(indicatorList[i].type == 'optix') displayMap[0] = "enabled"
                else if(indicatorList[i].type == 'trend') displayMap[1] = "enabled"
                else if(indicatorList[i].type == 'reltrend') displayMap[2] = "enabled"
            }
        }

        var node = document.querySelector(".quick-access-indicators")
        for(var i = 0;i < node.children.length;i++){
            node.children[i].classList.add(displayMap[i]);
        }
      }
    },
    watch: {
      isCreatePanelVisible(isVisible) {
        if (isVisible) {
          this.$nextTick(() => {
            this.$refs.newLayoutInput?.focus();
          });
        }
      },
      handleGetBacktestSymbol: {
        handler(newVal) {
          this.initializeTickerIndicatorDisplay()
        },
        //immediate: true,
        deep: true
      },
    },
    // 新增：Vue 生命周期钩子
    mounted() {
      // 在组件挂载后，添加一个全局的点击事件监听器
      document.addEventListener('click', this.handleClickOutside);

      this.initializeTickerIndicatorDisplay()
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
  .ciq-night .toolbar-button {
    color: #c5c7c9;
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
  .ciq-night .toolbar-button:hover span{
     color: #fff;
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
    width: 340px;
    background-color: #fff;
    padding: 10px 10px 6px 10px;
    z-index: 1000;
    margin-top: 0px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
  .ciq-night .dropdown-menu {
    background: #151f28;
    color: #fff;
    box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.2);
  }
  
  /* menu heading */
  .menu-heading {
    padding: 0 20px;
    clear: both;
    height: 27px;
    display: flex;
    line-height: 18px;
    white-space: nowrap;
    background: transparent;
    cursor: default;
    color: #398dff;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 400;
    font-family: "Roboto Condensed", sans-serif;
  }

  /* 搜索框 */
  .search-container {
    flex-grow: 1;
    margin: 0 0 0 8px;
    position: relative;
    cursor: auto;
    display: flex;
    align-items: flex-start;
    gap: 4px;
  }
  
  .search-container input {
    border: none;
    border-bottom: solid 1px #aaa;
    border-radius: 0;
    padding: 0 2px;
    flex: 1;
    min-width: 0;
    outline: none;
  }

  input[type="search"] {
    -webkit-appearance: textfield;
    box-sizing: content-box;
  }

  

  /* 新建按钮 */
  .save-btn-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .create-new-button {
    width: 320px;
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
    max-height: 300px;
    min-height: 100px;
    overflow-y: auto;
  }
  
  .layout-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 0 20px;
    margin: 0 10px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;
    border-radius: 12px;
    max-height: 40px;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .layout-list li span {
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }
  
  .layout-list li:hover {
    background-color: #efefef;
    color: #000;
  }

  .quick-access-indicators li.disabled {
    /* 1. 视觉效果：文字变灰，透明度降低 */
    color: #999;
    opacity: 0.6;

    /* 2. 交互效果：阻止所有鼠标事件（点击、悬停等） */
    pointer-events: none; 

    /* 3. 鼠标样式：显示“禁止”图标，提供更好的用户反馈 */
    cursor: not-allowed;
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
    position: relative;
    // right: 30px;
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
    color: #000000;
    background-color: #e0e0e0;
  }
  
  /* 新建布局面板 */
  .create-layout-panel {
    position: absolute;
    top: calc(100% + 168px);
    left: calc(100% - 374px);
    width: 200px;
    padding: 12px 12px 6px 12px;
    background-color: #fff;
    border-radius: 12px 0 0 12px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 1001; /* 确保在下拉菜单之上 */
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ciq-night .create-layout-panel {
    background: #151f28;
    color: #fff;
    box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.2);
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

  /* 扩展按钮 */
  .expand-btn {
    background: transparent;
    border: none;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    margin-left: 4px;
  }
  .expand-btn:hover {
    color: #398dff;
  }

  /* 扩展面板 */
  .expand-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vh;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    padding: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .ciq-night .expand-panel {
    background: #1a2633;
    color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }

  .expand-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    flex-shrink: 0;
  }
  .ciq-night .expand-panel-header {
    color: #fff;
  }

  .expand-panel-header .close-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .expand-panel-header .close-btn:hover {
    color: #333;
  }
  .ciq-night .expand-panel-header .close-btn:hover {
    color: #fff;
  }

  .expand-panel-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 24px;
    flex-shrink: 0;
  }

  .toolbar-left,
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .toolbar-left .el-input {
    width: 320px;
  }

  .expand-panel-toolbar /deep/ .el-input__inner {
    margin-left: 0;
  }

  .toolbar-right .el-input {
    width: 320px;
  }

  .expand-table {
    flex: 1;
    min-height: 0;
  }
  
  .expand-table /deep/ .el-table__body-wrapper {
    flex: 1;
    overflow-y: auto;
  }

  .layout-name {
    cursor: pointer;
    color: #5b9bd1;
    font-weight: 500;
  }
  .layout-name:hover {
    text-decoration: underline;
  }

  .layout-id {
    color: #999;
    font-size: 12px;
  }

  /* 遮罩层 */
  .expand-panel::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: -1;
    pointer-events: none;
  }
  </style>
  
  <!-- 全局样式：让 el-tooltip 点击穿透 -->
  <style>
  /* Element UI tooltip 点击穿透 */
  .el-tooltip__popper {
    pointer-events: none !important;
  }
  </style>
  