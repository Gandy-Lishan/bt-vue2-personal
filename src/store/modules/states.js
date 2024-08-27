import { CIQ } from '@/components/common/chart/st-development/js'
import { obtainIndicatorsList } from "@/service/service";

const state = {
	errorMessage404:{status:null,message:''},
  scannerai_filter: {},
	scannerai_flag: false,
	isBacktestRunning_flag:false,
	isRunAllSignalProcessing_flag:false,
	isMarkerShown_flag:false,
	isEditFinish_flag:false,
    // a status before symbol is loaded as a study
	beforeCalculateNewConditions: false,
	cacheReRunData: {},
	isCreateLoading: false,
	cpmResultsData: JSON.parse(sessionStorage.getItem('cpmResultsData')) || null,
	symbolUploadDomActive: false,
	clearIndiTableHighlighted: false
}

const mutations = {
	DETECT_SYMBOL_UPLOAD_DOM(state,val) {
		state.symbolUploadDomActive = val
	},
    SET_SCANNERAI_FILTER_STATE(state,obj) {
		state.scannerai_filter = obj
	},
	SET_SCANNERAI_FLAG(state,val) {
		state.scannerai_flag = val
	},
	SET_ISBACKTESTRUNNING_FLAG(state,val) {
		state.isBacktestRunning_flag = val
	},
	SET_ISRUNALLSIGNALPROCESSING_FLAG(state,val) {
		state.isRunAllSignalProcessing_flag = val
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
	setErrorMessage404: (state,obj) => {
		state.errorMessage404 = obj
	},
	CACHE_RERUN_DATA: (state,obj) => {
		state.cacheReRunData = obj
	},
	SET_MI_CREATE_LOADING: (state,loading) => {
		state.isCreateLoading = loading
	},
	SET_CPM_RESULTS_DATA(state, data) {
		state.cpmResultsData = data
		sessionStorage.setItem('cpmResultsData', JSON.stringify(data))
	},
	SET_INDI_TABLE_HIGHLIGHTED(state, val) {
		state.clearIndiTableHighlighted = val
	}
}

const actions = {
	detect_symbol_upload_dom({commit}){
		return new Promise(resolve=>{
			let node = document.querySelector('.symbol-upload')
			commit('DETECT_SYMBOL_UPLOAD_DOM',Boolean(node))
			resolve();
		})
	},
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
	set_isRunAllSignalProcessing_flag({commit},val){
		return new Promise(resolve=>{
			// 判断Run all backest中每个任务的执行状态
			commit('SET_ISRUNALLSIGNALPROCESSING_FLAG',val)
			resolve();
		})
	},
	set_isMarkerShown_flag({commit},val){
		return new Promise(resolve=>{
			// 判断marker是否加载
			if(!val){
				CIQ.store.commit('chart/getTradesData', [])
				CIQ.hideMarker()
			}else {
				// 初始化marker按钮显示样式
				CIQ.addPrompt()
			} 
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
	setCpmResultsData({ commit }, data) {
		commit('SET_CPM_RESULTS_DATA', data);
	}
}
export default {
	namespaced: true,
	state,
	mutations,
	actions
}
