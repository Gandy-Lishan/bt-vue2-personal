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
        <div class="manageChartLayout" v-if="$store.getters.getIsAdmin">
          <cq-separator></cq-separator>
          <div class="menu-heading">
            Manage Chart Layout
            <div class="search-container">
              <input type="search" v-model="searchQuery" placeholder="Search" />
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
  import { mapGetters } from "vuex"

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
      ...mapGetters(['getBacktestSymbol']), // 监听chartiq和表单的symbol改动以双向响应
      handleGetBacktestSymbol() {
        return this.getBacktestSymbol
      },
    },
    methods: {
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
          if(this.$store.getters.getIsAdmin) {
            this.fetchLayouts();
          }
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
    margin: 0 4px;
    position: relative;
    cursor: auto;
    display: initial;
  }
  
  .search-container input {
    border: none;
    border-bottom: solid 1px #aaa;
    border-radius: 0;
    margin: 0 24px 0 11px;
    padding: 0 2px;
    width: 90%;
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
    padding: 0 20px;
    margin: 0 10px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;
    border-radius: 12px;
    max-height: 40px;
    white-space: nowrap;
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
    position: absolute;
    right: 30px;
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
  </style>
  
  