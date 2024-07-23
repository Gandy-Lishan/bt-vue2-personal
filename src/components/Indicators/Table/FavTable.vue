<template>
    <virtual-scroll
      :ref="refName"
      :data="tableData"
      :item-size="itemSize"
      key-prop="url"
      class="virtualScroll"
      @change="(renderData) => virtualList = renderData">
			<el-table
      v-el-table-infinite-scroll="loadMore"
				ref="Table"
				class="virtual-table"
				:data="virtualList"
				empty-text="No data"
				v-loading="loading"
				size="mini"
        border
        row-key="url"
				stripe
				@cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
			  @sort-change="changeTableSort"
				height="600"
			>
			<el-table-column>
				<template #header>
					<div class="header-span">
						<span>My Favorites</span>
					</div>
				</template>
			<el-table-column align="center" width="70px">
				<template slot-scope="scope">
          <el-button-group>
            <!-- <el-button type="text" icon="el-icon-plus" @click="handleRowClick(scope.row)" title="View Backtest Details" :loading="scope.row.viewLoading"></el-button> -->
            <el-button type="text" size="mini" icon="el-icon-star-on" @click="deleteRow(scope.row)" title="Remove from favorites" :loading="scope.row.deleteLoading" element-loading-spinner="el-icon-right"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
				<template v-for="l in columns">
					<el-table-column
						:key="l.label"
						:label="l.label"
						:prop="l.value"
						show-overflow-tooltip
						:min-width="l.minWidth"
						:max-width="l.maxWidth"
						:width="l.width"
            sortable="custom"
					>
					<template slot-scope="scope">
						<el-button class="chart-name-btn" type="text" v-if="l.value === 'chart_name'" size="mini" @click="updateChart(scope.row)">{{ scope.row[l.value] }}</el-button>
						<img v-else-if="l.value === 'sentiment'" :src="`https://users.sentimentrader.com/static/img/bull_bear_${scope.row[l.value]}.gif`" :alt="scope.row[l.value]" style="width: 75px;"/>
						<span v-else>{{ scope.row[l.value] }}</span>
					</template>
					</el-table-column>
				</template>
			</el-table-column>
			</el-table>
			<div class="image-hover" :style="hoverStyle">
        <img style="height: 300px; width: 100%;" :src="hoveredImage" v-if="showImg" :alt="hoveredChartName"  @load="onLoad" @error="onError"/>
      </div>
  </virtual-scroll>
</template>

<script>
import { getIndicatorsRowData } from '@/service/service'
import { mapGetters, mapActions } from 'vuex'
import { capitalizeFirstLetter, unifyNumber } from "@/utils"
const debounce = require('lodash/debounce')
import VirtualScroll from 'el-table-virtual-scroll'
import ElTableInfiniteScroll from 'el-table-infinite-scroll'
import cloneDeep from 'lodash/cloneDeep'

export default {
	props: {
		selectedTitle: String
	},
  name: 'FavTable',
  components: {
    VirtualScroll
  },
  directives: {
    ElTableInfiniteScroll
  },
  data() {
    return {
      loading: false,
      columns: [
				{
						key: 'chart_name',
						label: 'Name',
						value: 'chart_name',
						minWidth: '250px'
				},
				{
						key: 'groups',
						label: 'Groups',
						value: 'groups'
				},
				{
						key: 'timeframe',
						label: 'Time Frame',
						value: 'timeframe'
				},
				{
						key: 'last_value',
						label: 'Value',
						value: 'last_value'
				},
				{
						key: 'last_change',
						label: 'Change',
						value: 'last_change'
				},
				{
						key: 'last_update',
						label: 'Date',
						value: 'last_update'
				},
				{
						key: 'sentiment',
						label: 'Sentiment',
						value: 'sentiment'
				}
      ],
      virtualList: [],
      tableData: [],
			hoveredChartName: '',
      showImg: false,
      hoveredImage: '',
      hoverStyle: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        display: 'none'
      },
    }
  },
  computed: {
		...mapGetters(['getFavoriteIndicatorListBtv1', 'getMyIndicatorList', 'getFavoriteIndicatorList', 'getFavoriteSymbolList']),
		favoritesBtv1List() {
				return this.getFavoriteIndicatorListBtv1
		},
		favoritesBtv2List() {
				return this.getFavoriteIndicatorList
		},
		indicatorsList() {
				return this.getMyIndicatorList
		},
		_favoriteSymbolList() {
			return this.getFavoriteSymbolList
		}
	},
	watch: {
    selectedTitle: {
      async handler (title) {
        if(title === 'My Favorites'){
					await this.see()
					this.$emit('updateChart', this.tableData[0])
				}
      }
    }
  },
	created() {
		console.log('favoritesList', this.favoritesBtv1List)
		console.log('indicatorsList', this.indicatorsList)
		console.log('favoritesBTV2List', this.favoritesBtv2List)
	},
  methods: {
    ...mapActions('chart', ['update_favorite']),
		async see() {
			this.loading = true
			console.log('favoritesBTV1List', this.favoritesBtv1List)
			console.log('indicatorsList', this.indicatorsList)
			console.log('favoritesBTV2List', this.favoritesBtv2List)
			let resu = []
											
			// btv2 fav
			resu = this.favoritesBtv2List.map(item => ({...item, source:'Backtest Engine v2.0'}))
			// btv1 fav
			resu.push(...this.favoritesBtv1List.data.data.map(item=>{return {
					name:item.chart_name[0],
					url:item.url[0],
					source:'Backtest Engine v1.0'
			}}))
			// 去重
			resu = Array.from(new Set(resu.map(item => item.url))).map(url => {
					return resu.find(item => item.url === url);
			});
			console.log('resu', resu)
			const fetchData = async(res) => {
			try {
					const responses = await Promise.all(res.map(indi => getIndicatorsRowData(indi.url)));
					const dataPromises = responses.map(response => response);
					const allData = await Promise.all(dataPromises);
					const detailData = allData.map(data => data.data);
					this.tableData = detailData.map(obj => {
						const groups = obj['groups']
            for (const key in obj) {
              if (Object.hasOwnProperty.call(obj, key)) {
                if(key === 'timeframe') {
                  if(['Short to Intermediate', 'Intermediate to Long', 'Intermediate', 'Medium-Term'].includes(obj[key])){obj[key] = 'Medium'}
                  else if(['Short', 'Short-Term'].includes(obj[key])){obj[key] = 'Short'}
                  else if(['Long', 'Long-Term'].includes(obj[key])){obj[key] = 'Long'}
                }else if(key === 'groups') {
                  // 大写首字母
                  obj[key] = capitalizeFirstLetter(obj[key])
                }
                if(['last_value', 'last_change'].includes(key)) {
                  // 保留特定小数点
                  if(['last_value', 'last_change'].includes(key)){obj[key] = unifyNumber(obj[key], 4)}
                }
                if((key === 'last_value' || key === 'last_change') && (groups === 'stocks' || groups === 'Stocks')){
                  if(obj[key] !== '' && obj[key] !== null && obj[key] !== 'null') obj[key] =  `${obj[key]}%`
                  // 加 %
                }
								if(key === 'url') {
									obj['source'] = resu.find(item => item.url === obj[key])?.source
								}
              }
            }
            return obj
          })
					console.log('detailData',detailData)
			} catch (error) {
					console.error('Error:', error);
					this.tableData = []
			} finally {
				this.loading = false
			}
			}
			await fetchData(resu)
		},
		handleCellMouseEnter: debounce(function (row, column, cell, event){
      if(row.url && column.property === 'chart_name') {
        let _t = '50%'
        let _l = '300px'
        const hoverElement = event.target
        const container = this.$el.querySelector('.virtual-table')
        if(hoverElement && container) {
          let moveUp = 0
          const containerRect = container.getBoundingClientRect()
          const hoverElementRect = hoverElement.getBoundingClientRect()
          // 计算相对于顶部的位置
          const topPosition = hoverElementRect.top - containerRect.top + container.scrollTop
          const containerHeight = container.clientHeight
          console.log('Top position', topPosition)
          // 如果高度超过容器, 向上移
          if((topPosition + 350) > containerHeight)  moveUp = - (topPosition + 350 - containerHeight)
          _t = topPosition + 50 + moveUp
        }
      //   this.sendData({
      //   showImg: true,
      //   hoveredChartName: row?.chart_name || '',
      //   hoveredImage: `https://d1wrgh3h32hjn2.cloudfront.net/${row.url}_250.png`,
      //   hoverStyle: {
      //     top: `${event.clientY}px`,
      //     left: `${event.clientX}px`,
      //     display: 'block'
      //   },
      //   refName: this.refName
      // })
      this.showImg = true
      this.hoveredChartName = row?.chart_name || ''
      this.hoveredImage = `https://d1wrgh3h32hjn2.cloudfront.net/${row.url}_250.png`
      // if(this.enlarged) {_t=`${_t}px`;_r=`10%`}
      _t=`${_t}px`;_l= `${column.realWidth || 300}px`
      this.hoverStyle = {
        top: _t,
        left: _l,
        display: 'block'
      }
    }
    }, 0),
    handleCellMouseLeave() {
      this.showImg = false
      this.hoveredChartName = ''
      this.hoveredImage = ''
      this.hoverStyle = {
        display: 'none'
      }
    },
		updateChart(row) {
      console.log(row)
      this.$emit("updateChart", row || {})
      // window.location.href = `/backtester/sr/setup?index=${row.market_symbol || 'SPX'}&indicator=${row.url}`;return
    },
    onLoad() {
      this.showImg = true
    },
    onError() {
      this.showImg = false
    },
		async deleteRow(row, isAdd) {
			console.log(row)
			if(row.source === 'Backtest Engine v2.0') {
				this.loading = true
				try {
					// 可以移除
					// 查找 URL 所在的索引
					const favList = cloneDeep(this.favoritesBtv2List)
					let index = favList.findIndex(item => item.url === row.url);
					if (index !== -1 && !isAdd) favList.splice(index, 1);
					if (index === -1 && isAdd) favList.push({url: row.url, name: row.chart_name})
					if(index !== -1 && isAdd) {this.popUpMsgBox('This indicator already exists in favorites'); this.loading = false; return}
					await this.update_favorite({
						indicator: JSON.stringify(favList),
						symbol: JSON.stringify(this._favoriteSymbolList)
					})
					await this.see()
					this.popUpMsgBox('Successful deleted')
				} catch (error) {
        	this.popUpMsgBox('Failed to remove favorites')
				} finally {
					this.loading = false
				}
			}else if(row.source === 'Backtest Engine v1.0') {
					// 请在主站的收藏夹中移除
			}
		},
    changeTableSort(column){
			var sortingOrder = column.order
			var colName = column.prop
			  // 数字字符串转数字类型排序
        if (['last_value', 'last_change', 'z_score', 'win_rate', 'avg_return', 'avg_net_return', 'sentiment'].indexOf(colName) !== -1) {
            if (sortingOrder == 'ascending') {
                this.tableData.sort((a, b) => {
                    let _b = b[colName].match(/-?\d+([\/.]\d+)?/g)
                    let _a = a[colName].match(/-?\d+([\/.]\d+)?/g)
                    _b = _b ? _b.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                    _a = _a ? _a.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                    return _b - _a
                })
            } else if (sortingOrder == 'descending') {
                this.tableData.sort((a, b) => {
                    let _b = b[colName].match(/-?\d+([\/.]\d+)?/g)
                    let _a = a[colName].match(/-?\d+([\/.]\d+)?/g)
                    _b = _b ? _b.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                    _a = _a ? _a.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                    return _a - _b
                })
            }
        }
			// 数字类型排序
			if(['WinRate', 'ExpectedReturn', 'Z_Score', 'Close'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.data.content.sort((a,b) => {
						return b[colName] - a[colName]
					})
				}else if(sortingOrder == 'descending'){
					this.data.content.sort((a,b) => {
						return a[colName] - b[colName]
					})
				}else{
				}
			}
			// 日期类型排序
			if(['last_update'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.tableData.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.tableData.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
      if (['last_update'].indexOf(colName) !== -1) {
        // 处理日期字符串
        const isValidDate = date => !isNaN(Date.parse(date));
        const sortedData = this.tableData.sort((a, b) => {
        const dateA = new Date(a[colName])
        const dateB = new Date(b[colName])
        const isDateAValid = isValidDate(a[colName])
        const isDateBValid = isValidDate(b[colName])
        // 都是无效日期，保持原顺序
        if (!isDateAValid && !isDateBValid) return 0

        //a 是无效日期，排到最后 
        if (!isDateAValid) return 1;

        // b 是无效日期，排到最后
        if (!isDateBValid) return -1

        // 都是有效日期，按日期排序
        if (sortingOrder === 'ascending') {
        return dateB - dateA;
        } else if (sortingOrder === 'descending') {
        return dateA - dateB;
        }
        return 0
        })
        this.tableData = sortedData
        }
			// 字符串类型排序
			if(['chart_name','groups','timeframe','url', 'underlying_name'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.tableData.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.tableData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}
			}
		},
  }
}
</script>

<style lang="less" scoped>
.virtualScroll {
	position: relative;
	.image-hover {
			position: absolute;
			z-index: 2000;
	}
	.chart-name-btn:hover {
			color: #1d4ed7;
			text-decoration: underline;
	}
	/deep/ .el-icon-close {
		font-weight: 700;
		color: #5b9bd1;
	}
}
.image-hover {
    position: absolute;
    z-index: 2000;
  }
.virtual-table {
  /deep/ .el-table {
    border: 1px solid #d9d9d9;
  }
  /deep/ tr th.el-table__cell
   {
    text-align: center;
    background-color: #d9d9d9;
    font-weight: 600;
    color: #333;
    padding: 0px;
    .cell {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  /deep/ .el-icon-plus {
		font-weight: 700;
		color: #5b9bd1;
	}
  /deep/ tr th.is-leaf.el-table__cell {
    background-color: #ffffff;
    text-align: left;
    .cell {
      font-weight: 600;
      color: #333;
      padding-left: 0px;
    }
  }
  /deep/ th.el-table__cell.gutter:last-of-type{
    border-bottom: none;
    border-bottom-width: 1px;
    background-color: #e5e7eb;
  }
  /deep/ .el-select {
    width: 100%;
  }
  /deep/ .el-select .el-input__inner {
    background-color: #d9d9d9;
    font-weight: 600;
    color: #333;
    padding: 0px;
    margin: 0px;
    width: 100%;
    border: 1px solid #d9d9d9;
    border-color: #d9d9d9;
  }
  /deep/ .el-select .el-input .el-select__caret {
    font-weight: 600;
    color: #333;
  }
  .header-span {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border: 2px solid #d9d9d9;
    span {
      display: inline-block;
      flex-grow: 1;
      padding: 2px 0;
      border-left: 2px solid #d9d9d9;
    }
    .el-icon-full-screen {
      padding: 0px;
      font-size: 18px;
      margin-right: 10px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .span {
      cursor: pointer;
      &:hover{
      background-color: #ffffff;
      }
    }
    .activated {
      background-color: #ffffff;
    }
  }
  /deep/ .el-button--mini, .el-button--small {
    font-size: 10px;
  }
  /deep/ .el-button--mini, .el-button--mini.is-round {
    padding: 0px;
  }
  /deep/ .el-table__cell gutter {
    width: 0px !important;
  }
  .chart-name-btn:hover {
    color: #1d4ed7;
    text-decoration: underline;
  }
}
</style>