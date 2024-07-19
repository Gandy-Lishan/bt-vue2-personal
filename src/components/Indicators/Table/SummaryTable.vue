<template>
	<div class="virtualScroll">
    <button @click="see">Test See</button>
			<el-table
				ref="Table"
				class="virtual-table"
				:data="tableData"
				empty-text="No data"
				v-loading="loading"
				size="mini"
        border
				style="width: 100%; height: 100%; margin: 0 auto"
				stripe
				@cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
			>
			<el-table-column align="center" width="70px">
				<template slot-scope="scope">
          <el-button-group>
            <!-- <el-button type="text" icon="el-icon-plus" @click="handleRowClick(scope.row)" title="View Backtest Details" :loading="scope.row.viewLoading"></el-button> -->
            <el-button type="text" icon="el-icon-close" @click="deleteRow(scope.row)" title="Remove from favorites" :loading="scope.row.deleteLoading" element-loading-spinner="el-icon-right"></el-button>
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
						:sortable="l.sortable"
					>
					<template slot-scope="scope">
						<el-button class="chart-name-btn" type="text" v-if="l.value === 'chart_name'" size="mini" @click="updateChart(scope.row)">{{ scope.row[l.value] }}</el-button>
						<img v-else-if="l.value === 'sentiment'" :src="`https://users.sentimentrader.com/static/img/bull_bear_${scope.row[l.value]}.gif`" :alt="scope.row[l.value]" style="width: 75px;"/>
						<span v-else>{{ scope.row[l.value] }}</span>
					</template>
					</el-table-column>
				</template>
			</el-table>
			<div class="image-hover" :style="hoverStyle">
        <img style="height: 300px; width: 100%;" :src="hoveredImage" v-if="showImg" :alt="hoveredChartName"  @load="onLoad" @error="onError"/>
      </div>
	</div>
</template>

<script>
import { getIndicatorsRowData } from '@/service/service'
import { mapGetters, mapActions } from 'vuex'
import { capitalizeFirstLetter, unifyNumber } from "@/utils"
const debounce = require('lodash/debounce')
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'SummaryTable',
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
	created() {
		console.log('favoritesList', this.favoritesBtv1List)
		console.log('indicatorsList', this.indicatorsList)
		console.log('favoritesBTV2List', this.favoritesBtv2List)
	},
  methods: {
    ...mapActions('chart', ['update_favorite']),
		async see() {
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
      window.location.href = `/backtester/sr/setup?index=${row.market_symbol || 'SPX'}&indicator=${row.url}`;return
    },
    onLoad() {
      this.showImg = true
    },
    onError() {
      this.showImg = false
    },
		async deleteRow(row, isAdd) {
			console.log(row)
			debugger
			if(row.source === 'Backtest Engine v2.0') {
				this.loading = true
				try {
					// 可以移除
					// 查找 URL 所在的索引
					const favList = cloneDeep(this.favoritesBtv2List)
					let index = favList.findIndex(item => item.url === row.url);
					if (index !== -1 && !isAdd) favList.splice(index, 1);
					if (isAdd) favList.push({url: row.url, name: row.chart_name})
					await this.update_favorite({
						indicator: JSON.stringify(favList),
						symbol: JSON.stringify(this._favoriteSymbolList)
					})
					await this.see()
					this.popUpMsgBox('Successful deleted')
				} catch (error) {
					this.popUpMsgBox('Delete failed')
				} finally {
					this.loading = false
				}
			}else {

			}
		}
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
</style>