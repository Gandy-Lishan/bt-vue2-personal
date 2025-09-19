<template>
    <button
      class="base-button"
      :class="{ 'base-button--active': isActive }"
      @click="$emit('click')"
    >
      <slot />
    </button>
  </template>
  
  <script>
  export default {
    name: 'BaseButton',
    props: {
      isActive: {
        type: Boolean,
        default: false
      },
    }
  };
  </script>
  
  <style scoped lang="scss">
    @import "@/components/Market/market.scss";
  .base-button {
    padding: $spacing-xxs $spacing-lg;
    border: 0px solid #ccc;
    background-color: transparent;
    color: #000000;
    font-size: 14px;
    border-radius: $border-radius-base;
    cursor: pointer;
    margin: 2px 2px;
    transition: background 0.3s, color 0.3s;
  
    &:hover {
      background-color: #f5f5f5;
    }
  }
  .base-button--active {
        background-color: $color-blue;
        color: white;
        border-color: $color-blue;

        &:hover {
            background-color: #4e86b4;
        }
    }
  </style>
  