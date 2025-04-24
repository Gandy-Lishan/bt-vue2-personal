<template>
    <el-autocomplete
      ref="input"
      class="inline-input"
      :size="size"
      v-model="inputValue"
      :fetch-suggestions="querySearchHandler"
      :placeholder="placeholder"
      @select="onSelect"
    >
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <template slot-scope="{ item }">
        <!-- 用是否存在update来判断为indicator还是symbol,加入兼容措施， -->
        <div class="custom-option">
          <span class="item-label indicator" v-if="item.updated">{{ item.label || item.value }}</span>
          <span class="item-label symbol" v-else-if="!item.updated">{{ item.url }}</span>
          <span v-if="!item.updated" class="symbol-label">{{ item.label }}</span>
          <span v-if="item.category" class="type-label">{{ item.category }}</span>
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
        this.$emit('select', item);
      },
      querySearchHandler(queryString, cb) {
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
  