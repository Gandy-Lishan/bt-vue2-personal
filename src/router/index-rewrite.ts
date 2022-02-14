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

router.beforeEach((to,from,next) => {
    let host = /.*/
 if(document.baseURI.search(host) != 1) {
 // 1. 获取 baseURL 和 cookie 中的 userid
 let userIdStr
 let userId
 if( document.baseURI.indexOf('?') != -1) {
   userIdStr = document.baseURI.split('?')[1]
  // 2. 判断 baseURL 是否为空 ,  如果为空的话，就用 userid 作为请求参数
//  判断字符串有无 userID

}else {
  window.location.href = 'https://users.sentdevsite.com/login'
 }
if(userIdStr.indexOf("userID") == -1) {
  userId = cookies.get('userid')
  if(!userId) {
      window.location.href = 'https://users.sentdevsite.com/login'
  }
}else {
  // 3. 如果 baseURL 不为空的话， 将值赋值到 userid  
   userId =  userIdStr.split('=')[1]
   cookies.set('userid',userId)
}
axios.get('/dev/user/?userid=' + userId).then(res => {
  console.log("相应数据",res);
  console.log("查询到的ID",res.data.userid);
  console.log("过期时间",res.data.session_expiration);
  if(res.status === 200) {
      // window.location.href = "https://devbt.sentimentrader.com"
      // 4. 清除 url 中的 userid 参数
      window.location.href = "http://localhost:8080/"
  }else {
      window.location.href = 'https://users.sentdevsite.com/login'
  }
}).catch(error => {
  window.location.href = 'https://users.sentdevsite.com/login'  
})
 }

})
export default router