<template>
	<div class="condition-tab">
		<div class="signal-relation-box" v-if="editableTabs.length > 1">
			<span style="font-weight: 400; margin-right: 10px">Signal Relation:{{editData}}</span>
			<!-- <el-radio-group v-model="radio">
				<el-radio :label="0">AND</el-radio>
				<el-radio :label="1">OR</el-radio>
			</el-radio-group> -->
		</div>
		<!-- 暂时删除了 editabled -->
		<el-tabs
			v-model="editableTabsValue"
			type="card"
			@edit="handleTabsEdit"
			disabled
			@tab-remove="handleTabsRemove"
		>
			<el-tab-pane
				style="margin-bottom: 20px; overflow-y: auto; overflow-x: hidden"
				:key="key"
				v-for="(val, key) in editableTabs"
				:label="val.title"
				:name="val.name"
			>
				<condition-root
					@goToFavorite="goToFavorite"
					:tabIndex="key"
					:criteria="criteria"
				></condition-root>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import conditionRoot from './Condition-Root.vue'
import base from '@/components/newVersion/components/baisc/sgnial-baisc.vue'
import { Store } from 'vuex'
export default {
	// extends: base,
	props: {
		criteria: String,
		entrySignalEditData: Object
	},
	watch: {
		entrySignalEditData: {
			handler(newVal) {
				console.log('1111111', newVal)
				this.editableTabs = [
					{
						title: 'Signal 1',
						name: '1',
						content: 'Tab 1 content'
					}
				]
			},
			immediate: true,
			deep: true
		}
	},
	data() {
		return {
			editableTabsValue: '1',
			tabIndex: 1,
			editableTabs: [
				{
					title: 'Signal 1',
					name: '1',
					content: 'Tab 1 content'
				}
			],
			radio: 0
		}
	},
	components: {
		'condition-root': conditionRoot
	},
	
	methods: {
		handleTabsEdit(targetName, action) {
			if (action === 'add') {
				let newTabName = ++this.tabIndex + ''
				this.editableTabs.push({
					title: 'Signal' + newTabName,
					name: newTabName,
					content: 'New Tab content'
				})
				this.editableTabsValue = newTabName
				this.$store.commit('addSignal', this.criteria)
			}
			if (action === 'remove') {
				let tabs = this.editableTabs
				let activeName = this.editableTabsValue
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1]
							if (nextTab) {
								activeName = nextTab.name
								this.tabIndex -= 1
							}
						}
					})
				}
				this.editableTabsValue = activeName
				this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
				this.$store.commit('addSignal', this.criteria)
			}
		},
		handleTabsRemove(e) {
			console.log(this.editableTabs.length)
			if (this.editableTabs.length == 0) {
				this.tabIndex = 0
			}
		},
		goToFavorite() {
			this.$emit('goToFavorite')
		}
	}
}
</script>
<style lang="less" scoped>
@media only screen and (min-width: 1600px) {
	.condition-tab {
		position: relative;
	}
	.signal-relation-box {
		position: absolute;
		top: -22px;
		left: 280px;
	}
}
@media (min-width: 900px) and (max-width: 1599px) {
	.condition-tab {
		position: relative;
	}
	.signal-relation-box {
		position: absolute;
		top: -22px;
		left: 280px;
	}
}
</style>