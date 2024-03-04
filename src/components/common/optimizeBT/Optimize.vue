<template>
	<div id="optimizeBT">
		<div class="optimize-panel">
			<div class="toolbar">
					<el-button
						type="primary"
						icon="el-icon-close"
						circle
						size="mini"
						@click="cancel"
					></el-button>
					<!-- <el-button
						type="primary"
						icon="el-icon-minus"
						circle
						size="mini"
						@click="close"
					></el-button> -->
			</div>
			<div class="header">
				<h2>Backtest Optimization Result</h2>
			</div>
			<div class="table">
				<el-table
					header-align="center"
					:data="dataList"
					v-loading="loading"
					:element-loading-text="loadTest"
					:default-expand-all="false"
					element-loading-spinner="el-icon-loading"
					:row-class-name="tableRowClassName"
					element-loading-background="rgba(0, 0, 0, 0.8)"
					@selection-change="handleSelectionChange"
				>
					<el-table-column type="selection" width="55"> </el-table-column>
					<!-- <el-table-column
          width="50px"
          align="center"
				>
					<template scope="scope">
						<el-checkbox
							v-model="scope.row.select"
							@change="
								selectBT(
									scope.row
								)
							"
						></el-checkbox>
					</template>
				</el-table-column> -->
					<el-table-column type="index" align="center">
						<template scope="scope">
							<span>{{ scope.$index + 1 }}</span>
						</template>
					</el-table-column>
					<template v-for="item in tableCol">
						<el-table-column
							v-if="['Name', 'Symbol'].includes(item.label)"
							:label="item.label"
							:key="item.label"
							:prop="item.field"
							show-overflow-tooltip
							align="center"
						>
							<template slot-scope="scope">
								{{ scope.row.data[item.field] }}
							</template>
						</el-table-column>
						<el-table-column
							v-if="item.label == 'DesExpand'"
							:type="item.type"
							:key="item.label"
						>
							<template slot-scope="scope">
								<div class="expandArea">
									<div class="descriptionBox">
										<div class="entryBox">
											<p>Entry Description</p>
											<template
												v-for="(des, index) in scope.row.data.entry_description"
											>
												<p :key="index">
													<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
													>{{ des.commentDes }}
												</p>
											</template>
										</div>
										<div class="exitBox">
											<p>Exit Description</p>
											<template
												v-for="(des, index) in scope.row.data.exit_description"
											>
												<p :key="index">
													<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
													>{{ des.commentDes }}
												</p>
											</template>
										</div>
									</div>
								</div>
							</template>
						</el-table-column>
						<el-table-column
							v-if="item.label == 'Entry & Exit'"
							:label="item.label"
							:key="item.label"
							align="center"
						>
							<template slot-scope="scope">
								{{ scope.row.data.entry_description[0].commentDes }}<br />
								<br />
								{{ scope.row.data.exit_description[0].commentDes }}<br />
							</template>
						</el-table-column>
						<el-table-column
							v-if="['Improved return', 'Total return', 'Total trades'].includes(item.label)"
							:label="item.label"
							:key="item.label"
							:prop="item.field"
							show-overflow-tooltip
							align="center"
							:sortable="
								['Improved return', 'Total return'].includes(item.label)
									? 'custom'
									: false
							"
							:sort-orders="['ascending', 'descending', item.field]"
						>
							<template slot-scope="scope">
								<span>{{ item.label == 'Total trades' ? scope.row[item.field] : scope.row[item.field]+'%'}}</span>
							</template>
						</el-table-column>
					</template>
					<div slot="empty" style="text-align: left">
						<el-empty image-size="80" description="No Data"></el-empty>
					</div>
				</el-table>
			</div>
			<div class="btn-group">
				<button class="cancel" @click="cancel">
					<span>Cancel</span>
				</button>
				<button class="add-to-list" @click="addToList" :disabled="multipleSelection.length == 0">
					<span>Add to List</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { CommonMethodsMixin } from '@/components/common/mixins/commonMethodsMixin'
import { copyBacktest, runOPT } from '@/service/service.js'

export default {
	name: 'Optimize',
	components: {},
	mixins: [CommonMethodsMixin],
	data() {
		return {
			dataList: [],
			tableCol: [
				{
					label: 'Name',
					field: 'name',
					width: '250px'
				},
				{
					label: 'Symbol',
					field: 'symbol',
					width: '70px'
				},
				{
					label: 'DesExpand',
					type: 'expand'
				},
				{
					label: 'Entry & Exit'
				},
				{
					label: 'Improved return',
					field: 'improved_return',
					width: '125px'
				},
				{
					label: 'Total return',
					field: 'total_return',
					width: '125px'
				},
				{
					label: 'Total trades',
					field: 'total_trades',
					width: '125px'
				}
			],
			loading: false,
			loadTest: 'Generating optimization solutions...',
			multipleSelection: [],
			pollingState: true, // 控制手动中断轮询，
			optimizeState: false,
		}
	},
	computed: {},
	watch: {},
	
	methods: {
		handleSelectionChange(val) {
			this.multipleSelection = val
		},
		cancel() {
			// this.$router.push('/backtester/list/favorites')
			// todo 还考虑中断轮询
			this.pollingState = false
			this.close()
		},
		close() {
			const optimizeBT = document.querySelector('#optimizeBT')
			optimizeBT.classList.remove('activated')
		},
		async addToList() {
			this.loading = true

			for (var i in this.multipleSelection) {
				try {
					let _data = JSON.parse(JSON.stringify(this.multipleSelection[i].data))
					
					const optNum = Number(this.multipleSelection[i].index)+1
					const copyName = `${_data.name}(opt ${optNum})`
debugger
					for (const key in _data) {
						if (_data.hasOwnProperty(key)) {
							if (
								_data[key] !== null &&
								(typeof _data[key] === 'object' || Array.isArray(_data[key]))
							) {
								_data[key] = JSON.stringify(_data[key])
							}
						}
					}

					// 获取参数并准备复制
					const params = {
						..._data,
						name: copyName,
						favorites: false,
						user_tag: 'client',
						total_trader: this.multipleSelection[i].total_trades,
						total_return: this.multipleSelection[i].total_return,
						opted: 1	// 新字段isOpted防止重复优化
					}
					delete params.uuid
					delete params.results
					delete params.user_id
					delete params.status
					delete params.backtest_id
					delete params.old_uuid

					// 发起复制请求
					await copyBacktest(this.$qs.stringify(params))
					this.$emit('refreshList')

					this.loading = false
					this.close()
				} catch (error) {
					console.error('An error occurred:', error)
					this.loading = false
					this.close()
				}
			}
			
		},
		tableRowClassName({ row, rowIndex }) {
			if (rowIndex % 2 === 0) {
				return 'dark-row'
			}
			return ''
		},
		async optimizeBacktest(data) {
			// 在优化前先验证是否为sentiment indicator或者用户自定义
			let validateRes = this.validateSignalsType(data)
			if(validateRes) {
				this.popUpMsgBox(validateRes)
				return
			}

			// 打开优化页面时初始化结果列表
			this.dataList = []
			this.multipleSelection = []

			// 如果上次取消的话，再次优化会重设为true
			this.pollingState = true
			// 进入优化模式
			this.optimizeState = true

			const optimizeBT = document.querySelector('#optimizeBT')
			optimizeBT.classList.add('activated')
			this.loading = true
			let response = await runOPT(data.id)
			if (response.data.status == 200) {
				//根据轮询结果返回的值修改指定回测的值并copy
					
					const OPTResults = await this.pollingOPTResults(data)
					this.optimizeState = false	// 轮询结束，优化模式结束
					if(OPTResults.length <=0) {
						// 空结果或者取消优化
						this.loading = false;
						return;
					}
					
					this.dataList = OPTResults.map((item, index) => {
						let _data = JSON.parse(JSON.stringify(data))
						const optimizedValue = item['Optimized_values']
						let signalCond
						signalCond = this.editSignalsCond(_data, 'entry', optimizedValue[0])
						if (optimizedValue.length >= 2) {
							signalCond = this.editSignalsCond(signalCond, 'exit', optimizedValue[1])
						}

						return {
							index: index,
							data: signalCond,
							improved_return: item['Improved returns'],
							total_return: item['Profit'],
							total_trades: item['Total trades'],
						}
					})
					console.log('轮询结果', this.dataList,OPTResults)
					//this.popUpMsgBox('Optimization solution gennerated')
					this.loading = false
			}else {
				console.error('bad runOPT request')
				this.loading = false
				this.optimizeState = false	// 请求异常，优化模式结束
			}
		}
	}
}
</script>

<style lang="less" scoped>
h1 {
	font-size: 30px;
}
#optimizeBT {
	visibility: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #8b8a8a91;
	position: fixed !important;
	z-index: 9998;
	margin: 0;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	transition: opacity 0.3s;
	&.activated {
		visibility: visible;
	}
	.optimize-panel {
		padding: 10px 35px;
		background: white;
		display: grid;
		//grid-template-rows: 1fr 3fr 1fr;
		align-items: center;
		.toolbar {
			button {
				float: right;
			}
		}
		.header {
			text-align: center;
		}
		.table {
			background: yellowgreen;
			width: 60vw;
			margin-bottom: 20px;
		}
		.btn-group {
			display: flex;
			justify-content: center;
			button.add-to-list,
			.cancel {
				border: unset;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 200px;
				height: 42px;
				border-radius: 10px;
				box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
				margin: 0 10px 10px 0;
				span {
					color: #ffffff;
				}
			}
			.cancel {
				background: #fbc05c;
				&:hover {
					background: #f59e0b;
					box-shadow: 0 6px 20px #f59e0b;
				}
			}
			.add-to-list {
				background: #5b9bd1;
				&:hover {
					background: #3787c9;
					box-shadow: 0 6px 20px #3787c9;
				}
			}

			button[disabled] {
				background: #9e9e9e;
				&:hover {
					background: #9e9e9e;
					box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
				}
			}
		}
	}
}

/deep/ .el-table .cell {
	padding: 0px 10px 0px 10px;
	word-wrap: break-word;
}
.el-table__body-wrapper {
	overflow-x: scroll;
}
.descriptionBox {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	> * {
		flex: 1;
	}
	.entryBox {
		p:first-child {
			font-weight: 500;
			color: #99a9bf;
		}
	}
	.exitBox p:first-child {
		font-weight: 500;
		color: #99a9bf;
	}
}
</style>