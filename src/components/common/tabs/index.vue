<template>
<div>
  <div class="gradient"></div>
  <main>
    <el-menu :default-active="activeIndex" class="el-menu-demo" :mode="mode" @select="handleSelect">
    <!-- <el-menu-item index="1">Set Up</el-menu-item>
    <el-menu-item index="2">Results</el-menu-item> -->
    <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">{{item.lable}}</el-menu-item>
    </el-menu>
    <router-view></router-view>
	</main>
</div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    activeIndex: String,
    mode: String,
    handleSelect: Function,
    menuItems: Array
  },
  data() {
      return {
      };
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>
main {
  padding: 0 30px;
  background: #f9fafb;
  min-height: 500px;
}
.el-menu.el-menu--horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
main .el-menu--horizontal > .el-menu-item{
  line-height: 40px;
  height: 40px;
  width: 50%;
  text-align: center;
  color: #333;
  font-weight: 700;
  font-size: 12px;
  background-color: #d7d7d7;
  border-radius: 4px;
  &:hover {
  background-color: #d7d7d7;
  color: #5b9bd1;
  }
}
main .el-menu--horizontal>.el-menu-item.is-active {
  color: white !important;
  background-color:#5b9bd1;
  border-bottom: none;
}
.gradient {
	padding-top: 88px;
	background: linear-gradient(180deg, #dde0e4, rgba(249, 250, 251, 0));
}
</style>