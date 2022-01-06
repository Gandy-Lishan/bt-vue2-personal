
<script>
import { Watch } from 'vue-property-decorator'
import base from "./sgnial-baisc"
export default {
    extends: base,
    props:{idsLoad: Object},
    	data() {
		return {
			fd: {},
		}
	},
    Watch:{
        fd: {
			handler(newVal) {
				if (newVal) {
					newVal.index = this.tabIndex
					newVal.criteria = this.criteria
					this.$store.commit('setFd', newVal)
				}
			},
			immediate: true,
			deep: true
		},
    }
}
</script>