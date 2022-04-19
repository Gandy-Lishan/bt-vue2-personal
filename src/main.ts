import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message } from 'element-ui'
import qs from 'querystring'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from '../node_modules/element-ui/lib/locale/lang/en.js'
import en from './tools/en.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/style/global.css'
import axios from 'axios'
import store from './store/store'
//import VueDirectiveImagePreviewer from "vue-directive-image-previewer"
import 'vue-directive-image-previewer/dist/assets/style.css'
import locale from 'element-ui/lib/locale/lang/en'
import '@/assets/iconfont/iconfont.css'
import VueCookies from 'vue-cookies'

import 'github-markdown-css'


Vue.use(VueCookies)
// 配置请求根路径
axios.defaults.baseURL = ''
// 请求拦截器，挂载请求头
axios.interceptors.request.use((config) => {
	config.headers.Authorization = window.sessionStorage.getItem('token')
	config.auth = {
		username: 'sentimentrader_backtest_api',
		password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
	}
	return config
})
// const encode = require("../node_modules/element-ui/lib/locale/lang/en")
Vue.prototype.$qs = qs
Vue.use(ElementUI, { locale })
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.config.productionTip = false
// Vue.use(VueDirectiveImagePreviewer,{
//   zIndex:9999,
//   previewSize:3
// })

Vue.config.productionTip = false

Vue.config.ignoredElements = [/^cq-.*$/, /^stx-.*$/]

// Workaround to be able to use the HTML template element in Vue template
Vue.component('template-placeholder', {
	render: function (createElement) {
		return createElement('template', this.$slots.default)
	}
})

new Vue({
	store,
	router,
	render: (h) => h(App)
}).$mount('#app')

