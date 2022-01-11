
<script>
import { Store, mapGetters } from 'vuex'
import deepClone1 from '@/tools/deepClone.js'
export default {
	props: {
		tabIndex: Number,
		criteria: String,
		idsLoad: Object,
		scLoad: Object
	},
	data() {
		return {
			ids: {},
			sc: {},
			si: {},
			fd: {},
			bd: {},
			// idsLoad: {},
			// scLoad: {}
		}
	},
	computed: {
		...mapGetters([ 'getIsClearForm']),
		isClearForm() {
			return this.getIsClearForm
		}
	},
	watch: {
		isClearForm: {
			handler(newVal) {
				let init = this.$options.data()
				this.ids = {
					extreme_optimism: '',
					extreme_pessimism: ''
				}
			}
		},
		ids: {
			handler(newVal) {
				//console.log('ids55555555555', newVal)\
				newVal.index = this.tabIndex
				newVal.criteria = this.criteria
				this.$store.dispatch('Try', newVal)
			},
			immediate: true,
			deep: true
		},
		sc: {
			handler(newVal) {
				if (newVal) {
					newVal.index = this.tabIndex
					newVal.criteria = this.criteria
					this.$store.dispatch('Try', newVal)
				}
			},
			immediate: true,
			deep: true
		},
		si: {
			handler(newVal) {
				if (newVal) {
					newVal.index = this.tabIndex
					newVal.criteria = this.criteria
					this.$store.dispatch('Try', newVal)
				}
			},
			immediate: true,
			deep: true
		},
		// form detail
		// backtest data
		bd: {
			handler(newVal) {
				if (newVal) {
					this.$store.commit('setBd', newVal)
				}
			},

			immediate: true,
			deep: true
		},

		idsLoad: {
			handler(newVal) {
				if(JSON.stringify(newVal) != '{}'){
				const vm = this
				if (newVal) {
					vm.setIdsLoad(newVal)
				}}
			},
			immediate: true,
			deep: true
		},
		scLoad: {
			handler(newVal) {
				if(JSON.stringify(newVal) != '{}'){
				const vm = this
				if (newVal) {
					console.log('dialog数据', newVal)
					vm.setScLoad(newVal)
				}}
			},
			immediate: true,
			deep: true
		},
	},
	methods: {
		setIdsLoad(value) {
			 const val = deepClone1(value)
			const rule = /^-?0?\d*?\.?\d*?$/
			for (let key in val) {
				// moving average 不一样
				if(typeof val[key] == 'string'){
				if (val[key].search(rule) != -1) {
					val[key] = Number(val[key])
			} else if (val[key].search(rule) == -1) {
						this.ids.ma_category = val[key]
					}}
			}
			this.ids = val
		},
		setScLoad() {
			console.log('hello');
		}
	}
}
</script>