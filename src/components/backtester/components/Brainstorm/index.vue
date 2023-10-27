<template>
  <div class="brainstorm-container">
  <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Brainstorm'
}
</script>

<style scoped>
.brainstorm-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>