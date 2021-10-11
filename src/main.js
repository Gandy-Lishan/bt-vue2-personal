import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message } from 'element-ui'
import qs from "querystring"
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/style/global.css'
import axios from "axios"
// 配置请求根路径
axios.defaults.baseURL = ''
// 请求拦截器，挂载请求头
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  config.auth={
    username:"sentimentrader_backtest_api",
    password:"TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx"
  }
  return config
})
Vue.prototype.$qs= qs
Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
