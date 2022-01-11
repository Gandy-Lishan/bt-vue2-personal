import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home.vue'
import Welcome from '../components/welcome.vue'
import Signal from '../components/signal/signalIndex/signal.vue'
import Favorite from '../components/signal/signalIndex/favorite.vue'
import CustomSignal from '../components/signal/signalIndex/custom.vue'
import myStrategies from '../components/stategy/strategyIndex/myStrategies.vue'
import OpenedStrategy from '../components/stategy/strategyIndex/openedStrategy.vue'
import SystemStrategies from '../components/stategy/strategyIndex/systemStrategies.vue'
import NewStrategy from '../components/stategy/strategyIndex/newStrategy.vue'
import NewBacktest from '../components/backtest/backestIndex/newBacktest.vue'
import CurrentBacktests from '../components/backtest/backestIndex/currentBacktests.vue'
import MyPorfolios from '../components/porfolio/porfolioIndex/myPorfolios.vue'
import NewPorfolio from '../components/porfolio/porfolioIndex/newPorfolio.vue'
import OpenedPorfolio from '../components/porfolio/porfolioIndex/openedPorfolio.vue'
import PorfolioNewBacktest from '../components/porfolio/porfolioComponents/porfolioNewBacktest.vue'
import SentimentHome from '../components/sentiment/SentimentHome.vue'
import NewHome from '../components/newVersion/New-Home.vue'
import Login from '../components/newVersion/Login.vue'
Vue.use(Router)
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/newHome', component: NewHome }
    // {
    //   path: '/home',
    //   component: Home,
    //   redirect: '/welcome',
    //   children: [
    //     { path: '/welcome', component: Welcome },
    //     { path: '/signal', component: Signal },
    //     { path: '/favorite', component: Favorite },
    //     { path: '/custom', component: CustomSignal },
    //     { path: '/myStrategies', component: myStrategies },
    //     { path: '/openedStrategy', component: OpenedStrategy },
    //     { path: '/newStrategy', component: NewStrategy },
    //     { path: '/newBacktest', component: NewBacktest },
    //     { path: '/currentBacktests', component: CurrentBacktests },
    //     { path: '/myPorfolios', component: MyPorfolios },
    //     { path: '/newPorfolio', component: NewPorfolio },
    //     { path: '/openedPorfolio', component: OpenedPorfolio },
    //     { path: '/porfolioNewBacktest', component: PorfolioNewBacktest }
    //   ]
    // },
    // { path: '/sentimentHome', component: SentimentHome }
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
// router.beforeEach((to, from, next) => {
//   let host = "/[a-z]*\.sentimentradet\.com/i"
//   if (host.search(window.document.referrer) == -1){
//    alert("asdasd")
//     next('/newHome')
//   }else{
//    alert("asdasd");
//     next('/newHome')
//   }
//   })
export default router
