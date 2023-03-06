/**
 *	2.2.0
 *	import css files, setup axios entity
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import qs from 'querystring'
// import 'element-ui/lib/theme-chalk/index.css'
import en from './tools/en.js'

// import global css rule
import './assets/css/global.css'
// icon & front
import './assets/fonts/iconfont.css'
// help icon
import './assets/helpIconFont/iconfont.css'
import 'font-awesome/css/font-awesome.css';

// progress bar
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/plugins/element'


import './assets/style/global.css'
import axios from './axios'
import store from './store/store'
import 'vue-directive-image-previewer/dist/assets/style.css'
import locale from 'element-ui/lib/locale/lang/en'
import '@/assets/iconfont/iconfont.css'
import VueCookies from 'vue-cookies'

import 'github-markdown-css'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
//import { CIQ } from 'chartiq'

Vue.use(VueCookies)

Vue.prototype.$qs = qs
Vue.use(ElementUI, { locale })
Vue.prototype.$http = axios
CIQ.axios = axios
CIQ.nprogress = Nprogress
// Vue.prototype.$message = Message
Vue.config.productionTip = false

Vue.config.ignoredElements = [/^cq-.*$/, /^stx-.*$/]
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
