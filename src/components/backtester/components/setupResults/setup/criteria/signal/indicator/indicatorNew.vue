<template>
  <div class="indicator-box">
		<el-form :model="si" ref="siForm" :rules="rules" label-position="left" size="mini">
      
      <div class="labelWithSelectBox indicatorTypeBox">
        <el-form-item prop="indicatorRadio">
            <template slot="label">
              <label>
                Type
                <el-tooltip effect="dark" placement="top">
                  <span slot="content">
                    Indicator type or symbol fundamental data, currently encompassing four indicator categories
                  </span>
                  <i class="iconfont icon-wenhao"></i>
                </el-tooltip>
              </label>
            </template>
            <div class="selectBox">
              <el-select
                v-model="indicatorRadio"
                placeholder="— Select Indicator Type —"
                @change="changeIndicatorType"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
        </el-form-item>
      </div>
      <div class="hint" v-show="indicatorRadio === 'Technical Indicator'">Hint: To change the indicator settings, right click the indicator in the above chart and select "Edit Setting"</div>
      <el-divider></el-divider>

      <div class="indicator-content">
        <SentimentIndicatorSearch
          v-if="indicatorRadio === 'Sentiment Indicator'"
          :is-bt-chart-ready="isBTChartReady"
          @indicator-selected="handleIndicatorUpdate"
          @indicator-cleared="handleIndicatorClear"
        />

        <TechnicalIndicatorSearch
          v-if="indicatorRadio === 'Technical Indicator'"
          :is-bt-chart-ready="isBTChartReady"
          @indicator-selected="handleIndicatorUpdate"
          @indicator-cleared="handleIndicatorClear"
        />

        <SymbolOhlcvSelect
          v-if="indicatorRadio === 'Symbol OHLCV'"
          :is-comparison-symbol="isComparisonSymbol"
          @indicator-selected="handleIndicatorUpdate"
          @indicator-cleared="handleIndicatorClear"
        />

        <UserIndicatorManager
          v-if="indicatorRadio === 'Users\' Own Indicator'"
          :is-bt-chart-ready="isBTChartReady"
          @indicator-selected="handleIndicatorUpdate"
          @indicator-cleared="handleIndicatorClear"
        />

        <UserDatesManager
          v-if="indicatorRadio === 'User Defined Dates'"
          @indicator-selected="handleIndicatorUpdate"
          @indicator-cleared="handleIndicatorClear"
        />
      </div>

      </el-form>
  </div>
</template>

<script>
// 1. 导入新的子组件
import SentimentIndicatorSearch from './indicator-parts/SentimentIndicatorSearch.vue';
// import TechnicalIndicatorSearch from './indicator-parts/TechnicalIndicatorSearch.vue';
// import SymbolOhlcvSelect from './indicator-parts/SymbolOhlcvSelect.vue';
// import UserIndicatorManager from './indicator-parts/UserIndicatorManager.vue';
// import UserDatesManager from './indicator-parts/UserDatesManager.vue';

import { CIQ } from '@/components/common/chart/st-development/js'
import {capitalizeFirstLetter, getQueryVariable} from '@/utils'
import { mapMutations,mapGetters } from 'vuex'

const throttle = require('lodash/throttle')

export default {
  props: {
    criteria: String,
    panelIndex: Number,
    editableTabsValue: String,
    editableTabs: Array,
    isRiskControl: Boolean,
    sentiUrl: String,
    sentiVal: String,
    relation: Number
  },
  components: {
    SentimentIndicatorSearch,
    // TechnicalIndicatorSearch,
    // SymbolOhlcvSelect,
    // UserIndicatorManager,
    // UserDatesManager
  },
  data() {
    return {
      indicatorRadio: 'Sentiment Indicator',
      si: { /* ... */ },
      typeOptions: [ /* ... */ ],
      // ... 其他 data 属性
    };
  },
  computed: {
    // ... 计算属性
  },
  methods: {
    // 2. 核心处理函数 (将在第二步中重构)
    handleIndicatorUpdate(payload) {
      console.log('从子组件收到了选中事件:', payload);
      // ... 这里将是所有更新逻辑的集合
    },
    handleIndicatorClear(payload) {
        console.log('从子组件收到了清除事件:', payload);
        // ... 这里将是所有清除逻辑的集合
    },
    changeIndicatorType(type) {
      // 切换类型时，清除旧的状态
      this.handleIndicatorClear();
      // ... 其他逻辑
    },
    // ... 其他方法
  }
};
</script>