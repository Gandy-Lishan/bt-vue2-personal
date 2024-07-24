/**
 *	2.2.0
 *	import css files, setup axios entity
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementUI from 'element-ui'
import qs from 'querystring'
// import 'element-ui/lib/theme-chalk/index.css'

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
import store from './store'
import 'vue-directive-image-previewer/dist/assets/style.css'
import locale from 'element-ui/lib/locale/lang/en'
import '@/assets/iconfont/iconfont.css'
import VueCookies from 'vue-cookies'

import 'github-markdown-css'
import { CIQ } from '@/components/common/chart/st-development/js'
//import { CIQ } from 'chartiq'

// import Algolia
// import InstantSearch from 'vue-instantsearch';
// import 'instantsearch.css/themes/algolia-min.css';

// Vue.use(InstantSearch);
import '@algolia/autocomplete-theme-classic';
import '@/assets/css/searchBar.css';
import GlobalMixins from "@/components/common/mixins/globalMixins";
import InstantSearch from 'vue-instantsearch';

// 引入自动更新提醒
import autoUpdate from './auto-update'

Vue.use(VueCookies)
Vue.use(InstantSearch)

Vue.prototype.$qs = qs
Vue.use(ElementUI, { locale })
Vue.mixin(GlobalMixins);
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

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG = {}
window.SITE_CONFIG['storeState'] = JSON.parse(JSON.stringify(store.state))

autoUpdate.start()

const app = new Vue({
	store,
	router,
	render: (h) => h(App)
}).$mount('#app')

export default app
