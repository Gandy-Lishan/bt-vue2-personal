const state = {
	is_admin: false,
	role: '',
	userID: ''
}

const mutations = {
	SETUSERROLE(state, val){
		for (let key in val) {
			if (val) {
				state[key] = val[key]
			}
		}
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
