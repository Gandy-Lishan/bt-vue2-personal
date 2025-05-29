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

import '@algolia/autocomplete-theme-classic';
import '@/assets/css/searchBar.css';
import GlobalMixins from "@/components/common/mixins/globalMixins";
// import {resetData} from '@/utils/globalFunc/index';

// 引入自动更新提醒
import autoUpdate from './auto-update'

import InstantSearch from 'vue-instantsearch';

Vue.use(InstantSearch);

Vue.use(VueCookies)

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


// Vue.mixin({
//   beforeDestroy() {
//     resetData(this) // 所有组件销毁时自动重置数据
//   }
// })

autoUpdate.start()

const app = new Vue({
	store,
	router,
	render: (h) => h(App)
}).$mount('#app')

export default app
