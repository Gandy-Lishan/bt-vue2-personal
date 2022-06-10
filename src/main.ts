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
// 导入帮助图标
import './assets/helpIconFont/iconfont.css'
import 'font-awesome/css/font-awesome.css';

// 导入全局样式表
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import './assets/style/global.css'
import axios from './axios'
import store from './store/store'
//import VueDirectiveImagePreviewer from "vue-directive-image-previewer"
import 'vue-directive-image-previewer/dist/assets/style.css'
import locale from 'element-ui/lib/locale/lang/en'
import '@/assets/iconfont/iconfont.css'
import VueCookies from 'vue-cookies'

import 'github-markdown-css'
import { CIQ } from 'chartiq'

Vue.use(VueCookies)
// 配置请求根路径
axios.defaults.baseURL = ''
//默认10秒超时，不过会针对一些可能耗时请求单独处理(对于容易堵塞的请求在等待5秒后就重发)
axios.defaults.timeout = 10000;
//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

// 请求拦截器，挂载请求头
axios.interceptors.request.use((config) => {
	config.headers.Authorization = window.sessionStorage.getItem('token')
	config.auth = {
		username: 'sentimentrader_backtest_api',
		password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
	}

	return config
})

// 重试请求(处理可能出现的请求报错或者超时)
axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config;
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err);
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
    
    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1);
    });
    
    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
		console.log('retry the request...')
        return axios(config);
    });
});

// const encode = require("../node_modules/element-ui/lib/locale/lang/en")

// 定义外部接口可配置
// axios.get('/dist/config.json').then((res) => {
// 	Vue.prototype.$SERVICE_URL = res;
// })
Vue.prototype.$qs = qs
Vue.use(ElementUI, { locale })
Vue.prototype.$http = axios
CIQ.axios = axios
CIQ.nprogress = Nprogress
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
console.log(process.env)
