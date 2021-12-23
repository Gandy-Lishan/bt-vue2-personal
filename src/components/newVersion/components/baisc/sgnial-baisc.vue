
<script>
export default {
    props: {
        tabIndex: Number,
        criteria: String
        },
        data() {
            return {
                ids:{},
                sc:{}
            }
        },
     	watch: {
		ids: {
			handler(newVal) {
				if (newVal) {
					newVal.index = this.tabIndex;
					newVal.criteria = this.criteria
					this.$store.dispatch('Try', newVal)
				}
			},
			immediate: true,
			deep: true
		},
        sc: {
			handler(newVal) {
				if (newVal) {
					newVal.index = this.tabIndex;
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
					newVal.index = this.tabIndex;
					newVal.criteria = this.criteria
					this.$store.dispatch('Try', newVal)
				}
			},
			immediate: true,
			deep: true
		},
		// form detail
		fd: {
			handler(newVal) {
				if (newVal) {
					newVal.index = this.tabIndex;
					newVal.criteria = this.criteria
					this.$store.commit('setFd', newVal)
				}
			},
			immediate: true,
			deep: true
		}
	}
    }
</script>