<template>
  <div class="set-up-container">
    <ResForm
      :backtestEditData="backtestEditData"
    />
    <Performance></Performance>
  </div>
</template>

<script>
import ResForm from "./resForm"
import Performance from "./performance"
export default {
  name: 'Results',
  components: {
    ResForm,
    Performance
  },
  data() {
    return {
      backtestEditData: {}
    }
  }
}
</script>

<style lang="less" scoped>
  .set-up-container{
    padding-top: 20px;
    background-color: #fff;
  }
</style>