
<script>
import { Store, mapGetters } from 'vuex'
export default {
	props: {
		tabIndex: Number,
		criteria: String,
		idsLoad: Object,
		scLoad: Object,
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
		...mapGetters(["getExtremeValue"]),
		extremeValue() {
			return this.getExtremeValue
		}
	},
	watch: {
		ids: {
			handler(newVal) {
				    console.log("ids55555555555", newVal);
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
				if (newVal) {
					console.log('dialog数据', newVal)
					this.setIdsLoad(newVal)
				}
			},
			immediate: true,
			deep: true
		},
		scLoad: {
			handler(newVal) {
				if (newVal) {
					console.log('dialog数据', newVal)
					this.setScLoad(newVal)
				}
			},
			immediate: true,
			deep: true
		},
		extremeValue: {
			handler(newVal) {
				this.ids.extreme_optimism = newVal.extremeOptimism
				this.ids.extreme_pessimism = newVal.extremePessimism
				console.log("测试",newVal);
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		setIdsLoad(val) {
		for(let key in val){
			// moving average 不一样
			if(Number(val[key])!= NaN){
			  val[key] = Number(val[key])
			}
		 }
		  this.ids = val
	  }
	}
}
</script>