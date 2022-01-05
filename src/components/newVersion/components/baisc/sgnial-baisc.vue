
<script>
import { Store, mapGetters } from 'vuex'
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
			bd: {}
		}
	},
	computed: {
		...mapGetters(['getExtremeValue', 'getIsClearForm']),
		extremeValue() {
			return this.getExtremeValue
		},
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
				//console.log('ids55555555555', newVal)
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
				const vm = this
				if (newVal) {
					vm.setIdsLoad(newVal)
				}
			},
			immediate: true,
			deep: true
		},
		scLoad: {
			handler(newVal) {
				const vm = this
				if (newVal) {
					console.log('dialog数据', newVal)
					vm.setScLoad(newVal)
				}
			},
			immediate: true,
			deep: true
		},
		extremeValue: {
			handler(newVal) {
				this.ids.extreme_optimism = newVal.extremeOptimism
				this.ids.extreme_pessimism = newVal.extremePessimism
				this.ids.over_bought_bound = newVal.extremeOptimism
				this.ids.over_sold_bound = newVal.extremePessimism
				this.ids.MACDSlow = newVal.extremeOptimism
				this.ids.MACDFast = newVal.extremePessimism
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		setIdsLoad(val) {
			for (let key in val) {
				// moving average 不一样
				if (Number(val[key]) != NaN) {
					val[key] = Number(val[key])
				}
			}
			this.ids = val
		}
	}
}
</script>