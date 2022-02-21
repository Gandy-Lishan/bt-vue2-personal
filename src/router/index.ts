import Vue from 'vue'
import Router from 'vue-router'
import cookies from 'vue-cookies'
import axios from 'axios'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
import store from '../store/store'
import Home from '@/components/BacktestEdge/Home.vue'
Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home }
  ]
})

router.beforeEach((to, from, next) => {
		axios.get(
			'https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
			{
				auth: {
					username: 'sentimentrader_backtest_api',
					password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
				}
			}
		).then(res=>{
      CIQ.store = store
      console.log('init getallsymbol')
      CIQ.indicatorList = res.data
   
          console.log("log",document.referrer)
    console.log(document.baseURI);
      return next()
		})
    
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
router.beforeEach((to, from, next) => {
  // let host = "/[a-z]*\.sentimentrader\.com/"/
  let host = /.*/
  // console.log('to from next',to, from, next);
  console.log("log",document.referrer)
  console.log('baseURL',document.baseURI);
  let loginUrl = 'https://users.sentdevsite.com/login'
  if (document.baseURI.search(host) != -1){
  //  alert("asdasd")
  // https://backtest.sentimentrader.com/user?userID=668696
  // 1. 从访问过来的 url 获取到 userid
  
  // 2. 访问后端 api '/dev/user/?userid=668696' get 参数
  let userId 
  try{
  userId = document.baseURI.split('?')[1]
  userId = userId.split('=')[1]
}catch(error){
    console.log(error);
    userId = cookies.get('userid')
    if(!userId) {
      window.location.href = loginUrl
    }
  }
  console.log("userId",userId);
  // 3. 根据返回状态码判断后续操作
  axios.get('/dev/user/?userid=' + userId).then(res => {
    console.log("相应数据",res);
    console.log("查询到的ID",res.data.userid);
    console.log("过期时间",res.data.session_expiration);
 if(res.status === 200) {
  let oldUserid =  cookies.get('userid')
  if(oldUserid == res.data.userid) {
    next()
  }else {
    cookies.set('userid',userId)
 next()
  }
}else if(res.status === 401 ){
//无权限
window.location.href = loginUrl
}else if (res.status === 403){
//认证时间超时
window.location.href = loginUrl
}else if (res.status === 404){
// 用户不存在
window.location.href = loginUrl
}
   console.log('cookie',document.cookie);
  }).catch(error => {
    console.log(error);
    // next('https://users.sentdevsite.com/login')
    window.location.href = loginUrl
  })
  // 3.1 200 成功设置 cookie userid=XXX endDate=XXX     cookie.set()
  // 3.2 403 代表认证时间超时，返回到登录页面
  // 3.3 404 表示用户不存在，返回到登录页面
    // next('')
}else{
  //  alert("asdasd");
    next()
  }
  })
//   }
//  )



export default router