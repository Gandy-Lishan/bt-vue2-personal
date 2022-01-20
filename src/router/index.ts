import Vue from 'vue'
import Router from 'vue-router'
import cookies from 'vue-cookies'
import axios from 'axios'



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
import Empty from '../components/newVersion/Empty.vue'
Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/newHome', component: NewHome },
    {
      path: '/empty',component: Empty
    }
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
//   // let host = "/[a-z]*\.sentimentrader\.com/"
//   let host = /.*/
//   // console.log('to from next',to, from, next);
//   console.log(document.baseURI.search(host));

//   if (document.baseURI.search(host) !== -1){
//   //  alert("asdasd")
//   // https://backtest.sentimentrader.com/user?userID=668696
//   // 1. 从访问过来的 url 获取到 userid
  
//   // 2. 访问后端 api '/dev/user/?userid=668696' get 参数 
//   let userId = document.baseURI.split('?')[1]
//   userId = userId.split('=')[1]  
//   userId = '668696'
//   // 3. 根据返回状态码判断后续操作
//   axios.get('/dev/user/?userid=' + userId).then(res => {
//     console.log("相应数据",res);
//  if(res.status === 200) {
// cookies.set('userId',userId)
// }else if(res.status === 401 ){
// 无权限
// }else if (res.status === 403){
// 认证时间超时
// }else if (res.status === 404){
 // 用户不存在
// }
  //     console.log('cookie',document.cookie);
//     next('/newHome')
//   })
//   // 3.1 200 成功设置 cookie userid=XXX endDate=XXX     cookie.set()
//   // 3.2 403 代表认证时间超时，返回到登录页面
//   // 3.3 404 表示用户不存在，返回到登录页面
//     // next('')
//   }else{
//   //  alert("asdasd");
//     next()
//   }
//   })


export default router
