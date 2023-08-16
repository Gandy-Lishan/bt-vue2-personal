const state = {
	is_admin: false,
	role: '',
}

const mutations = {
	SETUSERROLE(state, val){
		state.is_admin = val.is_admin
		state.role = val.role
	},
}

const actions = {
    set_user_role({commit}, obj){
		return new Promise(resolve=>{
			commit('SETUSERROLE',obj)
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
