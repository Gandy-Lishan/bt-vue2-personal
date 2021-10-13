<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="../assets/logo.png"> -->
        <span>sentimentrader.com</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏菜单区 -->
        <div class="toggleButton" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color8u777777-hg287="#fff"
          active-text-c
          olor="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            :key="item.id"
            v-for="item in menuList"
          >
            <template slot="title">
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="subItem.path"
              :key="subItem.id"
              v-for="subItem in item.children"
              @click="saveNavState(subItem.path)"
            >
              <template slot="title">
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <!-- <el-submenu
            :index="item.id + ''"
            :key="item.id"
            v-for="item in menuList"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              :key="subItem.id"
              v-for="subItem in item.children"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <!-- 右侧内容主题 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {
      // 左侧菜单数据
      menuList: [
        {
          id: 0,
          authName: 'Signals',
          children: [
            {
              id: 0,
              authName: 'System Signals',
              path: 'signal'
            },
            {
              id: 1,
              authName: 'My Favorite Signals',
              path: 'favorite'
            },
            {
              id: 2,
              authName: 'My Custom Signals',
              path: 'custom'
            }
          ]
        },
        {
          id: 1,
          authName: 'Strategy',
          children: [
            {
              id: 0,
              authName: 'Opened Strategy',
              path: 'openedStrategy'
            },
            {
              id: 1,
              authName: 'New Strategy',
              path: 'newStrategy'
            },
            {
              id: 2,
              authName: 'System Strategies',
              path: 'systemStrategies'
            },
            {
              id: 3,
              authName: 'My Favorite Strategies',
              path: 'favoriteStrategies'
            }
          ]
        }
      ],
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    // this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: 0px;
}
.toggleButton {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
