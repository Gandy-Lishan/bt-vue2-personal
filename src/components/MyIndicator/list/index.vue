<template>
  <div class="my-indicator-list-container">
    <MITable></MITable>
  </div>
</template>

<script>
import MITable from "./table.vue"
export default {
  name: '',
  data() {
    return {
    }
  },
  components: {
    MITable
  },
}
</script>

<style lang="less" scoped>
.my-indicator-list-container {
  min-height: 74vh;
  margin-top: 34px;
}
</style>