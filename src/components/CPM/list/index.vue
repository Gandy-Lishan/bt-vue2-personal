<template>
  <div class="my-indicator-list-container">
    <Table></Table>
  </div>
</template>

<script>
import Table from "./table.vue"
export default {
  name: 'List',
  data() {
    return {
    }
  },
  components: {
    Table
  },
}
</script>

<style lang="less" scoped>
.my-indicator-list-container {
  min-height: 74vh;
  // margin: 50px 50px 0px 50px;
  background-color: #ffffff;
}
@media (min-width: 768px) {
  .my-indicator-list-container {
      width: 750px;
  }
}
@media (min-width: 992px) {
  .my-indicator-list-container {
      width: 970px;
  }
}
@media (min-width: 1200px) {
  .my-indicator-list-container {
      width: 1170px;
  }
}
</style>