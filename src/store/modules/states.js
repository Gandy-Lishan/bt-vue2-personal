import { CIQ } from '@/components/common/chart/st-development/js'

const state = {
    scannerai_filter: {},
	scannerai_flag: false,
	isBacktestRunning_flag:false,
	isFindLastSignalRuning_flag:false,
	isMarkerShown_flag:false,
	isEditFinish_flag:false,
    // a status before symbol is loaded as a study
	beforeCalculateNewConditions: false, 
}

const mutations = {
    SET_SCANNERAI_FILTER_STATE(state,obj) {
		state.scannerai_filter = obj
	},
	SET_SCANNERAI_FLAG(state,val) {
		state.scannerai_flag = val
	},
	SET_ISBACKTESTRUNNING_FLAG(state,val) {
		state.isBacktestRunning_flag = val
	},
	SET_ISFINDLASTSIGNALRUNNING_FLAG(state,val) {
		state.isFindLastSignalRuning_flag = val
	},
	SET_ISMARKERSHOWN_FLAG(state,val) {
		state.isMarkerShown_flag = val
	},
	SET_ISEDITFINISH_FLAG(state,val) {
		state.isEditFinish_flag = val
	},
    envokeBeforeCalculateNewConditions(state,val){
		state.beforeCalculateNewConditions = val
	},
}

const actions = {
    set_scannerai_filter_state({commit}, obj){
		return new Promise(resolve=>{
			commit('SET_SCANNERAI_FILTER_STATE',obj)
			resolve();
		})
	},
	set_scannerai_flag({commit},val){
		return new Promise(resolve=>{
			// 判断是否在scanner ai
			commit('SET_SCANNERAI_FLAG',val)
			resolve();
		})
	},
	set_isBacktestRunning_flag({commit},val){
		return new Promise(resolve=>{
			// 判断Backtest是否运行中
			commit('SET_ISBACKTESTRUNNING_FLAG',val)
			resolve();
		})
	},
	set_isFindLastSignalRuning_flag({commit},val){
		return new Promise(resolve=>{
			// 判断FLS是否运行结束
			commit('SET_ISFINDLASTSIGNALRUNNING_FLAG',val)
			resolve();
		})
	},
	set_isMarkerShown_flag({commit},val){
		return new Promise(resolve=>{
			// 判断marker是否加载
			if(!val) CIQ.hideMarker()
			commit('SET_ISMARKERSHOWN_FLAG',val)
			resolve();
		})
	},
	set_isEditFinish_flag({commit},val){
		return new Promise(resolve=>{
			//  用来判断find last signal时是否编辑操作结束
			commit('SET_ISEDITFINISH_FLAG',val)
			resolve();
		})
	},
	envoke_before_calculate_newConditions({commit},val){
		return new Promise(resolve=>{
			//  用来判断find last signal时是否编辑操作结束
			commit('envokeBeforeCalculateNewConditions',val)
			resolve();
		})
	},
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
