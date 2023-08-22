import Vue from 'vue'
import Router from 'vue-router'
import routes from './router'
import { setRouterPermission } from './permission'

Vue.use(Router)
const router = new Router({
	mode: 'history',
	routes
})
setRouterPermission(router)
export default router
