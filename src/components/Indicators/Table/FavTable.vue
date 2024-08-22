<template>
<div>
  <div>
    <div class="header-span">
      <span>My Favorites</span>
    </div>
    <div class="header-span">
      <template v-for="item in tableInfo['options']">
        <span :key="item.label" :class="{activated: true, span: true}">{{ item.label }}</span>
        <el-tooltip effect="dark" placement="top" content="Download List" :key="`${item.label}_svg`">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" @click="downloadCSV">
            <path d="M1 8.5C1 4.96474 1 3.19632 2.09816 2.09816C3.19632 1 4.96395 1 8.5 1C12.0353 1 13.8037 1 14.9018 2.09816C16 3.19632 16 4.96395 16 8.5C16 12.0353 16 13.8037 14.9018 14.9018C13.8037 16 12.0361 16 8.5 16C4.96474 16 3.19632 16 2.09816 14.9018C1 13.8037 1 12.0361 1 8.5Z" stroke="#333333" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8.49865 4.58203V10.1478C8.75602 10.151 9.00944 9.97414 9.19734 9.75861L10.4526 8.35098M8.49786 10.1478C8.24997 10.1447 7.99812 9.96861 7.79918 9.75782L6.53839 8.35177M5.32812 12.4776H11.6439" stroke="#333333" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </el-tooltip>
      </template>
    </div>
  </div>
    <virtual-scroll
      :data="tableData"
      key-prop="url"
      class="virtualScroll"
      @change="(renderData) => virtualList = renderData">
			<el-table
				ref="Table"
				class="indicator-fav-table"
				:data="virtualList"
				empty-text="No data"
				v-loading="loading"
				size="mini"
        row-key="url"
				stripe
				@cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
			  @sort-change="changeTableSort"
				height="620"
			>
			<!-- <el-table-column> -->
				<!-- <template #header>
					<div class="header-span">
						<span>My Favorites</span>
					</div>
				</template> -->
			<el-table-column align="center" width="35px">
				<template slot-scope="scope">
          <el-button-group>
            <!-- <el-button type="text" icon="el-icon-plus" @click="handleRowClick(scope.row)" title="View Backtest Details" :loading="scope.row.viewLoading"></el-button> -->
            <el-button v-show="scope.row.source === 'Backtest Engine v2.0'" type="text" size="mini" icon="el-icon-star-on" @click="addRow(scope)" title="Remove from favorites" :loading="scope.row.deleteLoading" element-loading-spinner="el-icon-right"></el-button>
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
			<!-- </el-table-column> -->
			</el-table>
			<div class="image-hover" :style="hoverStyle">
        <img style="height: 300px; width: 100%;" :src="hoveredImage" v-if="showImg" :alt="hoveredChartName"  @load="onLoad" @error="onError"/>
      </div>
  </virtual-scroll>
</div>
</template>

<script>
import { getIndicatorsRowData } from '@/service/service'
import { mapGetters, mapActions } from 'vuex'
import { capitalizeFirstLetter, unifyNumber, isJson, timestampToTime } from "@/utils"
const debounce = require('lodash/debounce')
import VirtualScroll from 'el-table-virtual-scroll'
import cloneDeep from 'lodash/cloneDeep'
const XLSX = require('xlsx');

export default {
	props: {
		selectedTitle: String,
    tableInfo: Object
	},
  name: 'FavTable',
  components: {
    VirtualScroll
  },
  inject: ['removeIndicatorsFavorites'],
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
						key: 'sub_type',
						label: 'Groups',
						value: 'sub_type'
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
    ...mapGetters({
      cssMonthLabel: 'getCssMonthLabel',
      favoritesBtv1List: 'getIndicatorPageBtv1List',
      favoritesBtv2List: 'getFavoriteIndicatorList',
      _favoriteSymbolList: 'getFavoriteSymbolList',
      indicatorsListData: 'getIndicatorsPageListData'
    })
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
		console.log('favoritesBTV1List', this.favoritesBtv1List)
		console.log('indicatorsList', this.indicatorsList)
		console.log('favoritesBTV2List', this.favoritesBtv2List)
	},
  methods: {
    ...mapActions('chart', ['update_indicators_favorite', 'fetchIndicatorsPageList']),
		async see() {
			this.loading = true
			console.log('favoritesBTV1List', this.favoritesBtv1List)
			console.log('indicatorsList', this.indicatorsList)
			console.log('favoritesBTV2List', this.favoritesBtv2List)
			const fetchData = async (res) => {
			try {
					const responses = await Promise.all(res.map(indi => getIndicatorsRowData(indi.url)));
					const dataPromises = responses.map(response => response);
					const allData = await Promise.all(dataPromises);
          console.log('allData', allData)
					const detailData = allData.map(data => data.data);
					console.log('detailData',detailData)
          return detailData
			} catch (error) {
					console.error('Error:', error);
					return []
			} finally {
				this.loading = false
			}
			}

			let resu = []
											
			// btv2 fav
			resu = await fetchData(this.favoritesBtv2List)
			resu = resu.map(item => ({...item, source:'Backtest Engine v2.0'}))
			// btv1 fav
			resu.push(...this.favoritesBtv1List.map(item=>({
        ...item,
				source:'Backtest Engine v1.0'})))
      console.log('BTV1', resu)
			// 去重
			resu = Array.from(new Set(resu.map(item => item.url))).map(url => {
					return resu.find(item => item.url === url);
			});
      console.log('resu', resu)

      this.tableData = this.processFavoriteData(resu)
      this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url: 'my_favorites', data: this.tableData})
		},
    processFavoriteData(data) {
      return data.map(obj => {
        const subType = obj['sub_type']
        for (const key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            if(key === 'timeframe') {
              if(['Short to Intermediate', 'Intermediate to Long', 'Intermediate', 'Medium-Term'].includes(obj[key])){obj[key] = 'Medium'}
              else if(['Short', 'Short-Term'].includes(obj[key])){obj[key] = 'Short'}
              else if(['Long', 'Long-Term'].includes(obj[key])){obj[key] = 'Long'}
            }
            const subTypeMapping = {
              model: 'Model',
              more: 'More',
              breadth: 'Breadth',
              surveys: 'Surveys',
              shorts: 'Shorts',
              cash: 'Cash',
              insiders: 'Insiders',
              rydex: 'Rydex',
              seasonality: 'Seasonality',
              etf_index: 'Index',
              etf_bond: 'Bond',
              etf_social: 'Social',
              etf_commod: 'Commodity',
              etf_breadth: 'Sector Breadth',
              etf_country: 'Country',
              etf_etf: 'Sector',
              pc_ratio: 'PutCall',
              stock_sent: 'Stock',
              equity: 'COT',
              cot: 'COT',
              optix: 'Optix',
              vol: 'Volatility',
              etf_fund_index: 'Index',
              etf_social_index: 'Index',
              etf_fund_sector: 'Sector',
              etf_social_sector: 'Sector',
              etf_fund_commodity: 'Commodity',
              etf_social_commod: 'Commodity',
              etf_fund_bond: 'Bond',
              etf_social_bond: 'Bond',
              etf_fund_country: 'Country',
              etf_social_country: 'Country',
            }
            if(key === 'sub_type') obj[key] = capitalizeFirstLetter(subTypeMapping[obj[key]] || obj[key])
            if(['last_value', 'last_change'].includes(key)) {
              // 保留特定小数点
              if(['last_value', 'last_change'].includes(key)) obj[key] = unifyNumber(obj[key], 4)
							if((key === 'last_value' || key === 'last_change') && obj['last_change_type'] === 'percent') obj[key] = `${obj[key]}%`

            }
            if(key === 'last_update') obj[key] = timestampToTime(obj[key])
            obj['loading'] = false
            obj['favorite'] = true
            if((key === 'last_value' || key === 'last_change') && (subType === 'stock' || subType === 'Stock')){
              if(obj[key] !== '' && obj[key] !== null && obj[key] !== 'null') obj[key] =  `${obj[key]}%`
              // 加 %
            }
          }
        }
        return obj
      })
    },
    handleCellMouseEnter: debounce(function (row, column, cell, event){
      if(row.url && !row.sub_type.includes('Seasonality') && column.property === 'chart_name') {
        let _t = '50%'
        let _l = 0
        const hoverElement = event.target
        const container = this.$el.querySelector('.indicator-fav-table')
        if(hoverElement && container && column.realWidth) {
          let moveUp = 0
          const containerRect = container.getBoundingClientRect()
          const hoverElementRect = hoverElement.getBoundingClientRect()
          // 计算相对于顶部的位置
          const topPosition = hoverElementRect.top - containerRect.top + container.scrollTop
          const containerHeight = container.clientHeight
          // 如果高度超过容器, 向上移
          if((topPosition + 350) > containerHeight)  moveUp = - (topPosition + 350 - containerHeight)
          _t = topPosition + 50 + moveUp
        }
      this.showImg = true
      this.hoveredChartName = row?.chart_name || ''
      this.hoveredImage = `https://d1wrgh3h32hjn2.cloudfront.net/${row.url}_250.png`
      // if(this.enlarged) {_t=`${_t}px`;_r=`10%`}
      _t=`${_t}px`;_l=`${column.realWidth}px`
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
    async addRow(scope) {
      try {
        debugger
        if(scope.row.source !== 'Backtest Engine v2.0') return
        this.loading = true
        scope.row.loading = true
        const isFavorite = Boolean(scope.row.favorite) // 看原本的状态
        let favList = cloneDeep(this.favoritesBtv2List)
        let index = favList.findIndex(item => item.url === scope.row.url)
          // 添加收藏夹但是已经在收藏夹里面了
          console.log(index, isFavorite)
        // 在收藏夹中但是要移除
        if(index !== -1 && isFavorite) {
          favList.splice(index, 1)
          await this.update_indicators_favorite({
            indicator: JSON.stringify(favList),
            symbol: JSON.stringify(this._favoriteSymbolList)
          })
          // 遍历出来, 要只要是哪张表
          const urlTypes = Array.from(Object.keys(this.indicatorsListData))
          let sourceTable = urlTypes.map(url => {
            const list = isJson(this.indicatorsListData[url]) ? JSON.parse(this.indicatorsListData[url]) : []
              return list.map(item => {
                if(item.url === scope.row.url) return item
              }).filter(item => item !== undefined)
          }).filter(item => item.length > 0).flat()
          console.log('sourceTable', sourceTable) // [{}]
          sourceTable = sourceTable.filter(item => (item.favorite));
          //是否同步 most_popular
          const isSyncPopular = !sourceTable.find(item => item.source_list === 'most_popular')
          sourceTable.forEach(item => {
            const {url, source_list: _sourceRowUrl} = item
            if(url) {
              const  _results = isJson(this.indicatorsListData[_sourceRowUrl]) ? JSON.parse(this.indicatorsListData[_sourceRowUrl]) : []
              const find = _results.find(ele => ele.url === url)
              if(find) this.removeIndicatorsFavorites([find], isSyncPopular)
            }
          })
        }
        // 改变 table, vueX 中的数据并接口改变 favorite 列表
        this.tableData.splice(scope.$index, 1)
        this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url: 'my_favorites', data: this.tableData})
        console.log('this.tableData', this.tableData)
      } catch (error) {
        console.warn('移除收藏夹失败', error)
      } finally {
        scope.row.loading = false
        this.loading = false
      }
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
					await this.update_indicators_favorite({
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

    async downloadCSV() {
      // 访问组件示例数据
      const checks = [
        {
          label: 'Stocks Indicator List',
          value: 'stock_complete_list',
          type: 'stock'
        },
        {
          label: 'NASDAQ 100 Optix',
          value: 'ndx_100_complete_list',
          type: 'NASDAQ'
        },
        {
          label: 'S&P 1500 Optix',
          value: 'sp_1500_complete_list',
          type: 'SP1500'
        },
        {
          label: 'Bond Indicator List',
          value: 'bond_complete_list',
          type: 'bond'
        },
        {
          label: 'ETF Sector List',
          value: 'etf_complete_list',
          type: 'ETFSector'
        },
        {
          label: 'ETF Sector Breadth',
          value: 'etf_breadth',
          type: 'ETFSectorBreadth'
        },
        {
          label: 'ETF Fund Flow',
          value: 'etf_flow',
          type: 'ETFFundFlow'
        },
        {
          label: 'ETF Monthly Fund Flow',
          value: 'monthly_fund_flows',
          type: 'ETFMonthlyFund'
        },
        {
          label: 'ETF Shares Outstanding',
          value: 'shares_outstanding',
          type: 'ETFShares'
        },
        {
          label: 'Commodity Seasonality',
          value: 'commod_seasonality',
          value: 'CommoditySeasonality'
        },
        {
          label: 'Bond Seasonality',
          value: 'bond_seasonality',
          type: 'BondSeasonality'
        },
        {
          label: 'ETF Seasonality',
          value: 'etf_seasonality',
          type: 'ETFSeasonality'
        },
        {
          label: 'Most Popular Charts',
          value: 'most_popular',
          type: 'popular'
        },
        {
          label: 'My Favorites',
          value: 'my_favorites',
          type: 'favorite'
        }
      ]
      const checkedType = 'favorite'
      debugger
      const type = checks.find(item => item.type === checkedType)?.value
      if(!type) return
      let data = isJson(this.indicatorsListData[type]) ? JSON.parse(this.indicatorsListData[type]) : []
      let cssMonthLabel = this.cssMonthLabel
      let xlsxName = null
      if(!data || !data.length) {
        await this.fetchIndicatorsPageList(type)
        data = isJson(this.indicatorsListData[type]) ? JSON.parse(this.indicatorsListData[type]) : []
      }
      if (!data.length) {
        this.popUpMsgBox('No data available for download')
        return
      }
      /* 
      NASDAQColumns 多 url(Symbol) z_score
      SP1500Columns 多 url(Symbol) z_score
      ETFSectorColumns chart_name 名为 Symbol
      ETFSectorBreadthColumns chart_name 名为 Breadth Measure
      ETFFundFlowColumns chart_name 名为 Symbol
      ETFMonthlyFundColumns chart_name 名为 Symbol
      ETFSharesColumns chart_name 名为 Symbol
      BondSeasonalityColumns 多 win_rate, avg_return
      CommoditySeasonalityColumns chart_name 名为 Symbol,  多 win_rate, avg_return
      ETFSeasonalityColumns chart_name 名为 Symbol
      */
      let keysSort = ['Optix', 'Symbol', 'Name', 'Breadth Measure', 'Symbol', 'Groups', 'Time Frame', 'Value', 'Optix Value', 'Last Value', 'Z-Score', 'Change', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date', 'Optix Date', 'Last Update', '3-Year Max', '3-Year Min', 'Sentiment' ]
      if(type === 'commod_sentiment_seasonality') {const insertIndex = keysSort.findIndex(key => key === 'Avg Return'); if(insertIndex !== -1) keysSort.splice(insertIndex, 0, `Avg Return (%) for ${cssMonthLabel}`)}
      if(type === 'commod_seasonality' || type === 'bond_seasonality' || type === 'etf_seasonality') keysSort = ['Symbol','Name', 'Groups', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date']
      const keysMap = new Map([
        ['chart_name', 'Name'],
        ['sub_type', 'Groups'],
        ['timeframe', 'Time Frame'],
        ['time_frame', 'Time Frame'],
        ['last_value', 'Value'],
        ['last_change', 'Change'],
        ['last_update', 'Date'],
        ['sentiment', 'Sentiment']
      ])
      if(type === 'etf_breadth') keysMap.set('chart_name', 'Breadth Measure')
      if(type === 'bond_seasonality' || type === 'commod_seasonality' || type === 'etf_seasonality'){keysMap.set('win_rate', 'Win Rate');keysMap.set('avg_return', 'Avg Return')}
      if(type === 'commod_seasonality' || type === 'etf_seasonality') {keysMap.set('chart_name', 'Symbol');keysMap.set('underlying_name', 'Name')}
      if(type === 'etf_seasonality') keysMap.set('avg_net_return', 'Avg Net Return')
      if(type === 'ndx_100_complete_list' || type === 'sp_1500_complete_list') {keysMap.set('url', 'Symbol'); keysMap.set('z_score', 'Z-Score')}
      if(['etf_complete_list', 'etf_flow', 'monthly_fund_flows', 'shares_outstanding', 'commod_seasonality', 'etf_seasonality'].includes(type)) keysMap.set('chart_name', 'Symbol')
      if(type === 'commod_sentiment_seasonality' || type === 'commod_optix_trend') {keysMap.set('chart_name', 'Optix');keysMap.set('name', 'Name');keysMap.set('last_value', 'Optix Value');}
      if(type === 'commod_sentiment_seasonality') {keysMap.set('last_update', 'Optix Date');keysMap.set('AvgReturn', `Avg Return (%) for ${cssMonthLabel}`);}
      if(type === 'commod_optix_trend') {keysMap.set('close', 'Close');keysMap.set('MA', '200-Day Moving Average');}
      if(type === 'cot_max_min') {keysMap.set('chart_name', 'Name');keysMap.set('symbol', 'Symbol');keysMap.set('last_value', 'Last Value');keysMap.set('last_update', 'Last Update');keysMap.set('three_year_max', '3-Year Max');keysMap.set('three_year_min', '3-Year Min');}

			const processedData = data.map(item => {
        const obj = {}
        const itemKeys = Array.from(Object.keys(item))
        itemKeys.forEach(key => {
          if(keysMap.get(key)) obj[keysMap.get(key)] = item[key]
        })
        return obj
			})
      const sortObjectKeys = (obj) => {
      const sortedObj = {}
        keysSort.forEach(key => {
            if (key in obj) {
                sortedObj[key] = obj[key]
            }
        })
        return sortedObj
      }
      const sortedArray = processedData.map(obj => sortObjectKeys(obj))
      const category = checks.find(item => item.value === type)
      if(!['commod_sentiment_seasonality', 'commod_optix_trend', 'cot_max_min'].includes(type)) xlsxName = category.label
      if(['commod_sentiment_seasonality', 'commod_optix_trend', 'cot_max_min'].includes(type)) xlsxName = category.name
			const ws = XLSX.utils.json_to_sheet(sortedArray);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, xlsxName);
      XLSX.writeFile(wb, `${xlsxName}.xlsx`);
    },
  }
}
</script>

<style lang="less" scoped>
.virtualScroll {
	position: relative;
	.chart-name-btn:hover {
			color: #1d4ed7;
			text-decoration: underline;
	}
	/deep/ .el-icon-close {
		font-weight: 700;
		color: #5b9bd1;
	}
  /deep/ .el-table .sort-caret {
    left: 2px;
  }
  /deep/ .el-table .caret-wrapper {
    width: 10px;
  }
  /deep/.el-table__body-wrapper.is-scrolling-none {
    height: 585px !important;
  }
}

.image-hover {
			position: absolute;
			z-index: 2000;
	}
  
  .header-span {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    &:first-child {
      background-color: #d9d9d9;
    }
    span {
      display: inline-block;
      flex-grow: 1;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      padding: 5px 0;
      border-left: 2px solid #d9d9d9;
    }
    svg {
      cursor: pointer;
      margin-right: 10px;
      background-color: #ffffff;
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
.image-hover {
    position: absolute;
    z-index: 2000;
  }
.indicator-fav-table {
  /deep/ .el-table {
    border: 1px solid #d9d9d9;
  }
  /deep/ tr th.el-table__cell
   {
    text-align: center;
    background-color: #d9d9d9;
    font-weight: 700;
    color: #333;
    padding: 4px 0;
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
      font-weight: 700;
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
  /deep/ .el-button--mini, .el-button--small {
    font-size: 14px;
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