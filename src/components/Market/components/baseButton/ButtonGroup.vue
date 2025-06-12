<template>
    <div class="button-group" :style="{ backgroundColor: backgroundColor }" ref="buttonGroup">
      <base-button
        v-for="(option, index) in options"
        :key="option.value"
        :is-active="option.value === selectedValue"
        @click="select(option.value)"
        ref="buttons"
        v-bind="getButtonProps(option)"
      >
        {{ option.label }}
      </base-button>
  
      <!-- 高亮滑块 -->
      <div
        class="highlight-slider"
        :style="highlightStyle"
      />
    </div>
  </template>
  
  <script>
  import BaseButton from './BaseButton.vue';
  
  export default {
    name: 'ButtonGroup',
    components: { BaseButton },
    props: {
      options: {
        type: Array,
        required: true,
      },
      value: {
        type: String,
        default: ''
      },
      backgroundColor: {
        type: String,
        default: '#fff'
      },
      buttonProps: {
        type: [Object, Function],
        default: () => ({})
      },
      enableTransition: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        sliderLeft: 0,
        sliderWidth: 0
      };
    },
    computed: {
      selectedValue() {
        return this.value;
      },
      highlightStyle() {
        return {
            position: 'absolute',
            left: this.sliderLeft + 'px',
            width: this.sliderWidth + 'px',

            transition: this.enableTransition
            ? 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none',
            zIndex: 0,
        };
        }
    },
    watch: {
      selectedValue() {
        this.$nextTick(this.updateSlider);
      },
      options() {
        this.$nextTick(this.updateSlider);
      }
    },
    mounted() {
      this.$nextTick(this.updateSlider);
      window.addEventListener('resize', this.updateSlider);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.updateSlider);
    },
    methods: {
      select(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
      getButtonProps(option) {
        if (typeof this.buttonProps === 'function') {
          return this.buttonProps(option);
        }
        return this.buttonProps;
      },
      updateSlider() {
        const buttons = this.$refs.buttons;
        if (!buttons || buttons.length === 0) return;
  
        // 找到被选中的按钮元素
        const selectedIndex = this.options.findIndex(opt => opt.value === this.selectedValue);
        if (selectedIndex === -1) {
          // 如果没有选中，则隐藏滑块或放到第一个按钮
          this.sliderLeft = 0;
          this.sliderWidth = 0;
          return;
        }
        const buttonEl = buttons[selectedIndex].$el || buttons[selectedIndex];
        const groupEl = this.$refs.buttonGroup;
  
        const groupRect = groupEl.getBoundingClientRect();
        const buttonRect = buttonEl.getBoundingClientRect();
  
        this.sliderLeft = buttonRect.left - groupRect.left;
        this.sliderWidth = buttonRect.width;
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/components/Market/market.scss";
  .button-group {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: fit-content;
    border-radius: $border-radius-base;
    z-index: 1;
    height: 34px;
  }
  
  // 让按钮 z-index 高于滑块
  .base-button {
    position: relative;
    z-index: 2;
    background: transparent !important;
    color: #333 !important;
  }
  
  .highlight-slider {
    pointer-events: none;
    background-color: $color-blue;
    border-radius: $border-radius-base;
    top: 2px;
    height: 30px;
  }
  </style>
  