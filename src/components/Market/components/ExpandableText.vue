<template>
    <div class="expandable-text">
      <div
        ref="textContent"
        class="expandable-text__content"
        :style="contentStyle"
        @transitionend="onTransitionEnd"
      >
        {{ text }}
      </div>
      <div
        v-if="shouldShowToggle"
        class="expandable-text__toggle"
        @click="toggle"
      >
        <span>{{ isExpanded ? 'Less' : 'More' }}</span>
        <i
          :class="[
            'expandable-text__icon',
            isExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
          ]"
        />
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    name: 'ExpandableText',
    props: {
      text: String,
      maxLines: {
        type: Number,
        default: 2,
      },
    },
    data() {
      return {
        isExpanded: false,
        shouldShowToggle: false,
        collapsedHeight: 0,
        fullHeight: 0,
        currentHeight: 'auto',
        transitioning: false,
      };
    },
    computed: {
      contentStyle() {
        return {
          maxHeight: this.transitioning ? this.currentHeight : (this.isExpanded ? 'none' : this.collapsedHeight + 'px'),
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        };
      },
    },
    mounted() {
      this.$nextTick(() => {
        const el = this.$refs.textContent;
        const computedLineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
        this.collapsedHeight = this.maxLines * computedLineHeight;
  
        // 获取实际展开后的高度
        this.fullHeight = el.scrollHeight;
        if (this.fullHeight > this.collapsedHeight + 5) {
          this.shouldShowToggle = true;
          this.currentHeight = this.collapsedHeight + 'px';
        }
      });
    },
    methods: {
      toggle() {
        const el = this.$refs.textContent;
        this.transitioning = true;
  
        if (this.isExpanded) {
          // 收起
          this.currentHeight = this.fullHeight + 'px'; // 设置当前高度为 fullHeight，触发动画
          this.$nextTick(() => {
            void el.offsetHeight; // 强制刷新 reflow
            this.currentHeight = this.collapsedHeight + 'px';
          });
        } else {
          // 展开
          this.currentHeight = this.collapsedHeight + 'px'; // 初始设为 collapsedHeight
          this.$nextTick(() => {
            void el.offsetHeight; // 强制刷新 reflow
            this.currentHeight = this.fullHeight + 'px';
          });
        }
  
        this.isExpanded = !this.isExpanded;
      },
      onTransitionEnd() {
        this.transitioning = false;
        this.currentHeight = this.isExpanded ? 'none' : this.collapsedHeight + 'px';
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  @import "@/components/Market/market.scss";

  .el-icon-arrow-down {display: inline-block;}
  .expandable-text {
    font-size: 14px;
    color: $color-text-primary;
  
    &__content {
      line-height: 1.6;
      position: relative;
    }
  
    &__toggle {
      margin-top: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: $color-text-highlight;
      font-size: 0.875rem;
      cursor: pointer;
      user-select: none;
    }
  
    &__icon {
      font-size: 12px;
      line-height: 1;
    }
  }
  </style>
  