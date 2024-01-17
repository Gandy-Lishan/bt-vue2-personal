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
  padding: 1rem;
}
</style>