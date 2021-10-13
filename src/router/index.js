import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Signal from '../components/signal/signalIndex/signal.vue'
import OpenDialog from '../components/signal/signalComponents/openDialog.vue'
import Favorite from '../components/signal/signalIndex/favorite.vue'
import CustomSignal from '../components/signal/signalIndex/custom.vue'
import FavoriteStrategies from '../components/stategy/strategyIndex/favoriteStrategies.vue'
import OpenedStrategy from '../components/stategy/strategyIndex/openedStrategy.vue'
import SystemStrategies from '../components/stategy/strategyIndex/systemStrategies.vue'
import NewStrategy from '../components/stategy/strategyIndex/newStrategy.vue'
Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome},
        { path: '/signal', component: Signal },
        { path: '/openDialog', component: OpenDialog },
        { path: '/favorite', component: Favorite },
        { path: '/custom', component: CustomSignal },
        { path: '/favoriteStrategies', component: FavoriteStrategies },
        { path: '/openedStrategy', component: OpenedStrategy },
        { path: '/newStrategy', component: NewStrategy },
        { path: '/systemStrategies', component: SystemStrategies },
      ]
    },
  ]
})
// 挂载路由导航守卫
// 路由导航守卫控制访问权限
// router.beforeEach((to, from, next) => {
// to代表将要访问的路径
// from表示从哪个路径跳转过来
// next是一个函数，表示放行 next()放行 next('/login')强制跳转的路径
// 获取token
//   if (to.path === '/login') return next()
//   const tokenStr = window.sessionStorage.getItem('token')
//   if (!tokenStr) return next('/login')
//   next()
// })
export default router
