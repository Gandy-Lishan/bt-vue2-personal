
<script>
import { Watch } from 'vue-property-decorator'
import base from "./sgnial-baisc"
export default {
    extends: base,
    props:{idsLoad: Object},
    Watch:{
        ids: {
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
    }
}
</script>