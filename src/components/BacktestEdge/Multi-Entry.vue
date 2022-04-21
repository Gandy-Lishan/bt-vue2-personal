<template>
	<div class="multi-box">
		<el-tabs
			v-model="editableTabsValue"
			type="card"
			closable
			tab-position="left"
			@tab-remove="removeTab"
		>
			<el-tab-pane
				v-for="item in editableTabs"
				:key="item.name"
				:label="item.title"
				:name="item.name"
			>
				<entry></entry>
			</el-tab-pane>
		</el-tabs>
		<el-tooltip
			class="item"
			effect="dark"
			content="Add an entry signal"
			placement="bottom"
		>
			<el-button size="small" @click="addTab(editableTabsValue)">
				add tab
			</el-button>
		</el-tooltip>
	</div>
</template>
<script>
import entry from '@/components/BacktestEdge/Entry.vue'
export default {
	data() {
		return {
			editableTabsValue: '2',
			editableTabs: [
				{
					title: 'Tab 1',
					name: '1',
					content: 'Tab 1 content'
				},
				{
					title: 'Tab 2',
					name: '2',
					content: 'Tab 2 content'
				}
			],
			tabIndex: 2
		}
	},
	components: {
		entry
	},
	methods: {
		addTab(targetName) {
			let newTabName = ++this.tabIndex + ''
			this.editableTabs.push({
				title: 'New Tab',
				name: newTabName,
				content: 'New Tab content'
			})
			this.editableTabsValue = newTabName
		},
		removeTab(targetName) {
			let tabs = this.editableTabs
			let activeName = this.editableTabsValue
			if (activeName === targetName) {
				tabs.forEach((tab, index) => {
					if (tab.name === targetName) {
						let nextTab = tabs[index + 1] || tabs[index - 1]
						if (nextTab) {
							activeName = nextTab.name
						}
					}
				})
			}

			this.editableTabsValue = activeName
			this.editableTabs = tabs.filter((tab) => tab.name !== targetName)
		}
	}
}
</script>

<style lang="less" scoped>
/deep/ .el-tabs__new-tab {
	margin: 4px 0px 0px 10px;
	border: 1px solid #797979;
	color: #797979;
}
.multi-box {
	border: 1px solid #797979;
	padding-right: 10px;
	margin-bottom: 10px;
	position: relative;
}
/deep/ .el-button--small,
.el-button--small.is-round {
	position: absolute;
	bottom: 0px;
	border: 1px solid #c2c0c0;
}
</style>
