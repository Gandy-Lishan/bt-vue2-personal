<template>
    <el-autocomplete
      ref="input"
      class="inline-input"
      clearable
      :size="size"
      v-model="inputValue"
      :fetch-suggestions="querySearchHandler"
      :placeholder="placeholder"
      :clearable="clearable"
      :disabled="disabled"
      @select="onSelect"
      @clear="onClear"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <template slot-scope="{ item }">
        <!-- 单列显示的tech,独立显示逻辑 -->
        <div v-if="item.class" class="custom-option">
          <span class="item-label">{{ item.value }}</span>
        </div>
        <!-- 用是否存在update来判断为indicator还是symbol,加入兼容措施， -->
        <div v-else class="custom-option">
          <span class="item-label indicator" v-if="item.updated">{{ item.label || item.value }}</span>
          <span class="item-label symbol" v-else-if="!item.updated">{{ item.type == 'Custom' ? item.label : item.url }}</span>
          <span v-if="!item.updated" class="symbol-label">{{ item.label }}</span>
          <!-- 处理用户自定义symbol显示 -->
          <span v-if="item.category || item.type == 'Custom'" class="type-label">{{ item.type == 'Custom' ? item.type : item.category }}</span>
          <span v-if="item.updated" class="updated-label">{{ item.updated }}</span>
          <span v-if="!item.updated" class="inception-label">{{ item.inception }}</span>
        </div>
      </template>
    </el-autocomplete>
  </template>
  
  <script>
  export default {
    name: 'SearchAutocomplete',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: 'Please select indicator from the dropdown menu',
      },
      size: {
        type: String,
        default: '',
      },
      clearable: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        inputValue: this.value,
        searchResults: [],
        currentPage: 1,
        pageSize: 20,
        hasMore: true,
        cbRef: null, // 保存 fetch-suggestions 的 callback
      };
    },
    watch: {
      value(val) {
        this.inputValue = val;
      },
      inputValue(val) {
        this.$emit('input', val);
      },
    },
    mounted() {
      this.attachScrollListener();
    },
    methods: {
      onSelect(item) {
        if(item.type == 'Custom'){
            // 防止symbol 选中时不触发handleGetBacktestSymbol,而导致没有更新autocomplete input value
            this.setInputValue(item.label)
        }
        this.$emit('select', item);
      },
      onClear() {
        this.$emit('clear',this.$refs.input.value); // 同时触发 input 事件
      },
      // 一般不调用此函数，用来处理cusmtom symbol选择时input显示名错误的特殊情况
      setInputValue(newValue) {
        // 只修改输入框显示内容
        this.$nextTick(() => {this.$refs.input.$refs.input.$el.querySelector('input').value = newValue;}) 
    },
      querySearchHandler(queryString, cb) {
        // 检查 queryString 是否为 undefined，如果是，则处理为 ""
        if (queryString === undefined) {
            queryString = ''; // 将 undefined 转换为空字符串
        }

        this.$emit('query', queryString, (results) => {
            this.searchResults = results;
            this.currentPage = 1;
            this.hasMore = true;
            this.loadMore(cb);
        });
      },
  
      attachScrollListener() {
        this.$nextTick(() => {
          const inputDropdown =
            this.$refs.input?.$refs.suggestions?.$el?.childNodes[0]?.childNodes[0];
          if (inputDropdown) {
            inputDropdown.addEventListener('scroll', this.handleDropdownScroll);
          }
        });
      },
  
      handleDropdownScroll(event) {
        const dropdown = event.target;
        if (
          dropdown.scrollHeight - dropdown.scrollTop - 10 < dropdown.clientHeight &&
          this.hasMore
        ) {
          const currentScrollTop = dropdown.scrollTop;
          this.currentPage++;
          this.loadMore((results) => {
            const inputRef = this.$refs.input;
            inputRef.$data.suggestions = results;
            requestAnimationFrame(() => {
              dropdown.scrollTop = currentScrollTop;
            });
          });
        }
      },
  
      loadMore(cb) {
        const paginatedResults = this.searchResults.slice(
          0,
          this.currentPage * this.pageSize
        );
        if (this.currentPage * this.pageSize >= this.searchResults.length) {
          this.hasMore = false;
        }
        cb(paginatedResults);
      },
    },
  };
  </script>
  
  <style lang="less" scoped> 
  .custom-option {
    display: flex;
    align-items: center;
    margin: 0 10px;
    white-space: normal;
  
    span {
      flex: 1;
      line-height: 1.5em;
      margin: 0px;
      padding: 0.5em 0;
    }
  
    .item-label {
      color: #333333;
      font-weight: bold;
      padding-right: 10px;
      padding-left: 20px;
      white-space: nowrap;
  
      &.indicator {
        flex: 0 0 320px;
      }
  
      &.symbol {
        flex: 0 0 80px;
      }
    }
  
    .symbol-label {
      flex: 0 0 200px;
      padding: 0 3px;
      width: 100%;
      padding-right: 10px;
    }
  
    .type-label {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e1f9ec;
      color: #076932;
      padding: 0.375rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.675rem;
      font-weight: 500;
      line-height: 1;
      margin-right: 20px;
    }
  
    .inception-label {
      flex: 1;
      color: #333333;
      font-size: 10px;
      min-width: 40px;
      text-align: right;
      padding: 0 3px;
      white-space: nowrap;
      padding-right: 20px;
    }
  
    .updated-label {
      font-size: 12px;
      font-weight: 600;
      margin-right: 10px;
      text-align: center;
    }
  
    .item-label {
      font-weight: 500;
    }
  }
  </style>
  