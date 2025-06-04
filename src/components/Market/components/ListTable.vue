<template>
    <div class="indicator-list">
      <ul>
        <li v-for="item in items" :key="item.id" class="indicator-list__item">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ListTable',
    props: {
      items: {
        type: Array,
        default: () => []
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .indicator-list {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  
    &__item {
      padding: 8px 0;
      border-bottom: 1px solid #2c2c2c;
      color: #ccc;
  
      &:last-child {
        border-bottom: none;
      }
    }
  }
  </style>
  