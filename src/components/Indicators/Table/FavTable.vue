<template>
<div>
  <div>
    <div class="header-span">
      <span>My Favorites<i class="el-icon-download" @click="downloadCSV" title="Download List" style="cursor: pointer;"></i></span>
    </div>
    <!-- <div class="header-span">
      <template v-for="item in tableInfo['options']">
        <span :key="item.label" :class="{activated: true, span: true}">{{ item.label }}</span>
      </template>
    </div> -->
  </div>
  <div class="filter-div">
    <el-row>
      <div class="search-input">
        <el-input
          class="search-input"
          @input="handleQuery"
          size="small"
          placeholder="Search"
          v-model="searchInput"
          clearable
        ><i slot="prefix" class="el-input__icon el-icon-search"></i>
       </el-input>
      </div>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row>
          <div class="btns">
            <!-- <el-button size="small" @click="downloadCSV"><i class="el-icon-download" style="margin-right: 5px"></i>Download CSV</el-button> -->
            <div class="select-option" v-show="Array.isArray(groupsOptions) && groupsOptions.length !== 0">
              <span>Group</span>
              <el-select v-model="groupsFilter" size="mini" placeholder="Please Select" label="Test" @change="handleQuery">
              <el-option
                v-for="item in groupsOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </div>
            <div class="select-option" v-show="Array.isArray(timeframeOptions) && timeframeOptions.length !== 0">
              <span>Time Frame</span>
              <el-select v-model="timeframeFilter" size="mini" placeholder="Please Select" label="Test" @change="handleQuery">
              <el-option
                v-for="item in timeframeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </div>
          </div>
        </el-row>
      </el-col>
      <!-- <el-col :span="6"> -->
      <!-- </el-col> -->
    </el-row>
  </div>
    <virtual-scroll
      :data="filterData"
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
            <el-button v-show="scope.row.source === 'Backtest Engine v2.0'" type="text" size="mini" icon="el-icon-star-on" @click="addRow(scope)" title="Remove from favorite indicators" :loading="scope.row.deleteLoading" element-loading-spinner="el-icon-right"></el-button>
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
            :align="['chart_name', 'market_symbol'].includes(l.value) ? 'left' : 'center'"
					>
					<template slot-scope="scope">
						<el-button class="chart-name-btn" type="text" v-if="l.value === 'chart_name'" size="mini" @click="updateChart(scope.row)">{{ scope.row[l.value] }}</el-button>
						<img v-else-if="l.value === 'sentiment' && !scope.row['type'].includes('trend_reltrend')" :src="`https://users.sentimentrader.com/static/img/bull_bear_${scope.row[l.value]}.gif`" :alt="scope.row[l.value]" style="width: 90px;"/>
						<span v-else-if="l.value === 'sentiment' && scope.row['type'].includes('trend_reltrend')"></span>
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
  <div class="dataTables_info" v-show="pageLength">
    {{`Showing 1 to ${pageLength} of ${pageLength} entries`}}
  </div>
</div>
</template>

<script>
import { getIndicatorsRowData } from '@/service/service'
import { mapGetters, mapActions } from 'vuex'
import { capitalizeFirstLetter, unifyNumber, isJson } from "@/utils"
const debounce = require('lodash/debounce')
import VirtualScroll from 'el-table-virtual-scroll'
import cloneDeep from 'lodash/cloneDeep'

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
						minWidth: '200px'
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
						value: 'last_update',
            minWidth: '90px'
				},
				{
						key: 'sentiment',
						label: 'Sentiment',
						value: 'sentiment',
            minWidth: '100px'
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
      groupsFilter: '',
      timeframeFilter: '',
      searchInput: '',
      filterData: [],
      groupsOptions: [],
      timeframeOptions: [],
      isExpanded: false, // 控制输入框是否展开
    }
  },
  computed: {
    ...mapGetters({
      cssMonthLabel: 'getCssMonthLabel',
      favoritesBtv1List: 'getIndicatorPageBtv1List',
      favoritesBtv2List: 'getFavoriteIndicatorList',
      _favoriteSymbolList: 'getFavoriteSymbolList',
      indicatorsListData: 'getIndicatorsPageListData'
    }),
    pageLength() {
      return this.filterData.length || 0
    },
    inputStyle() {
      return {
        width: this.isExpanded ? "200px" : "35px",
        position: "absolute",
        right: "0", // 根据需要调整位置
        top: "0px",
        transition: "width 0.3s ease-in-out",
      };
    },
    searchPlaceholder() {
      if(this.isExpanded) return 'Search'
      return ''
    },
	},
	watch: {
    tableData: {
      handler(newValue) {
        if(Array.isArray(newValue) && newValue.length !== 0)this.filterData = newValue
      },
      immediate: true,
      depp: true
    }
  },
	async created() {
		console.log('favoritesBTV1List', this.favoritesBtv1List)
		console.log('indicatorsList', this.indicatorsList)
		console.log('favoritesBTV2List', this.favoritesBtv2List)
    await this.see()
	},
  methods: {
    ...mapActions('chart', ['update_indicators_favorite', 'fetchIndicatorsPageList', 'get_indicator_page_btv1_list']),
		async see() {
			this.loading = true
      // 重置过滤条件
      this.groupsFilter = ''
      this.timeframeFilter = ''
      this.searchInput = ''
      await this.get_indicator_page_btv1_list()
      const fetchData = async (res) => {
          try {
              // 执行所有请求，并使用 Promise.allSettled 等待所有请求完成
              const responses = await Promise.allSettled(res.map(indi => getIndicatorsRowData(indi.url)));
              
              // 筛选出状态为 'fulfilled' 的请求
              const successfulResponses = responses
                  .filter(result => result.status === 'fulfilled')
                  .map(result => result.value);

              // 获取数据
              const detailData = successfulResponses.map(data => data.data);
              console.log('detailData', detailData);

              return detailData;
          } catch (error) {
              console.error('Error:', error);
              return [];
          } finally {
              this.loading = false;
          }
      };

			let resu = []
											
			// btv2 fav
			resu = await fetchData(this.favoritesBtv2List)
			resu = resu.map(item => ({...item, source:'Backtest Engine v2.0'}))
			// btv1 fav
			resu.push(...this.favoritesBtv1List.map(item=>({
        ...item,
				source:'Backtest Engine v1.0'})))
			// 去重
      resu = Object.values(
          resu.reduce((acc, item) => {
              const { url, source } = item;
              // 如果相同的 url 不存在，或者存在但 source 为 v1.0, 则更新
              if (!acc[url] || source === 'Backtest Engine v1.0') {
                  acc[url] = item;
              }
              return acc;
          }, {})
      );
      // 将 source 为 "Backtest Engine v1.0" 的项排在最后
      resu.sort((a, b) => {
        if (a.source === 'Backtest Engine v1.0' && b.source !== 'Backtest Engine v1.0') {
          return 1;
        }
        if (a.source !== 'Backtest Engine v1.0' && b.source === 'Backtest Engine v1.0') {
          return -1;
        }
        return 0;
      });
      
      console.log('resu', resu)
      this.tableData = this.processFavoriteData(resu)
      let _groups = [...new Set(this.tableData.map(item => item.sub_type))].map(item => ({label: item, value: item}))
      let _timeframe = [...new Set(this.tableData.map(item => item.timeframe))].map(item => ({label: item, value: item}))
      _groups.unshift({label: '----', value: ''})
      _timeframe.unshift({label: '----', value: ''})
      this.groupsOptions = _groups
      this.timeframeOptions = _timeframe
      this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url: 'my_favorites', data: this.tableData})
			this.$emit('updateChart', this.tableData[0] || this.filterData[0])
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
              country_breadth: 'Country Breadth',
              crypto_breadth: 'Crypto Breadth',
              etf_country: 'Country',
              etf_etf: 'Sector',
              pc_ratio: 'PutCall',
              stock_sent: 'Stock',
              stock_russell: 'Russell',
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
              trend_reltrend: 'Trend',
              sp1500_trend_reltrend: 'Trend',
              spx_trend_reltrend: 'Trend',
              ndx_trend_reltrend: 'Trend',
              crp_trend_reltrend: 'Trend',
              russell_trend_reltrend: 'Trend',
              etf_domestic_trend_reltrend: 'Trend',
              etf_foreign_trend_reltrend: 'Trend',
              etf_other_trend_reltrend: 'Trend',
              crp_stock: 'CRP',
            }
            if(key === 'sub_type') obj[key] = capitalizeFirstLetter(subTypeMapping[obj[key]] || obj[key])
            if(['last_value', 'last_change'].includes(key)) {
              // 保留特定小数点
              if(['last_value', 'last_change'].includes(key)) {
                // obj[key] = unifyNumber(obj[key], 4)
                obj[key] = unifyNumber(obj[key], 2)
              }
							if((key === 'last_value' || key === 'last_change') && obj['last_change_type'] === 'percent') obj[key] = `${obj[key]}%`

            }
            if(key === 'last_update') {
              const datatime = new Date(obj['last_update']);
              // 使用 UTC 方法获取年、月和日，以确保在不同时区显示一致的日期
              const Y = datatime.getUTCFullYear() + '-';
              const M = (datatime.getUTCMonth() + 1).toString().padStart(2, '0') + '-';
              const D = datatime.getUTCDate().toString().padStart(2, '0');
              obj['last_update'] = Y+M+D
            }
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
        let url = row.url
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
      if(row.type === 'stock_nasdaq' || row.type === 'stock_sent' || row.type === 'stock_russell' || ['trend_reltrend', 'spx_trend_reltrend', 'ndx_trend_reltrend', 'crp_trend_reltrend','russell_trend_reltrend', 'sp1500_trend_reltrend'].includes(row.type)) url = url.toLowerCase()
      this.hoveredImage = `https://d1wrgh3h32hjn2.cloudfront.net/${url}_250.png`
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
      this.$emit("showDetails", row, true)
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
          // 更新 vuex 的状态
          this.$store.commit('chart/SET_FAVORITE_INDICATOR_LIST', favList)
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
          sourceTable = sourceTable.filter(item => (item.favorite) && item.hasOwnProperty('source_list'));
          //是否同步 most_popular
          // const isSyncPopular = sourceTable.find(item => item.source_list === 'most_popular') || false
          debugger
          sourceTable.forEach(item => {
            const {url, source_list: _sourceRowUrl} = item
            if(url) {
              const  _results = isJson(this.indicatorsListData[_sourceRowUrl]) ? JSON.parse(this.indicatorsListData[_sourceRowUrl]) : []
              const findIndex = _results.findIndex(ele => ele.url === url)
              if(findIndex !== -1) _results[findIndex] = {..._results[findIndex], favorite: false, loading: false}
              this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url: _sourceRowUrl, data: _results})
              // console.log('find', find)
              // if(find) this.removeIndicatorsFavorites([find], isSyncPopular)
            }
          })
        }
        // 改变 table, vueX 中的数据并接口改变 favorite 列表
        this.tableData = this.tableData.filter(item => item.url !== scope.row.url)
        this.groupsFilter = ''
        this.timeframeFilter = ''
        this.searchInput = ''
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
          // 更新 vuex 的状态
          this.$store.commit('chart/SET_FAVORITE_INDICATOR_LIST', favList)
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
                this.filterData.sort((a, b) => {
                    let _b = b[colName].match(/-?\d+([\/.]\d+)?/g)
                    let _a = a[colName].match(/-?\d+([\/.]\d+)?/g)
                    _b = _b ? _b.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                    _a = _a ? _a.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                    return _b - _a
                })
            } else if (sortingOrder == 'descending') {
                this.filterData.sort((a, b) => {
                    let _b = b[colName].match(/-?\d+([\/.]\d+)?/g)
                    let _a = a[colName].match(/-?\d+([\/.]\d+)?/g)
                    _b = _b ? _b.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                    _a = _a ? _a.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                    return _a - _b
                })
            }
        }
			// 日期类型排序
			if(['last_update'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.filterData.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.filterData.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
      if (['last_update'].indexOf(colName) !== -1) {
        // 处理日期字符串
        const isValidDate = date => !isNaN(Date.parse(date));
        const sortedData = this.filterData.sort((a, b) => {
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
        this.filterData = sortedData
        }
			// 字符串类型排序
			if(['chart_name','groups','timeframe','url', 'underlying_name'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.filterData.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.filterData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}
			}
		},
    async downloadCSV() {
      // 访问组件示例数据
      const checks = [
        {
          label: 'Stock Market Sentiment',
          value: 'stock_complete_list',
          type: 'stock'
        },
        {
          label: 'NASDAQ 100 Stock Sentiment',
          value: 'ndx_100_complete_list',
          type: 'NASDAQ'
        },
        {
          label: 'S&P 1500 Stock Sentiment',
          value: 'sp_1500_complete_list',
          type: 'SP1500'
        },
        {
          label: 'Russell 3000 Stock Sentiment',
          value: 'russell_3000_complete_list',
          type: 'Russell3000'
        },
        {
          label: 'Russell 1000 Stock Sentiment',
          value: 'russell_1000_complete_list',
          type: 'Russell1000'
        },
        {
          label: 'Russell 2000 Stock Sentiment',
          value: 'russell_2000_complete_list',
          type: 'Russell2000'
        },
        {
          label: 'Bond Market Sentiment',
          value: 'bond_complete_list',
          type: 'bond'
        },
        {
          label: 'Commodity Market Sentiment',
          value: 'commodity_complete_list',
          type: 'commodity'
        },
        {
          label: 'Most Active ETF Sentiment',
          value: 'etf_complete_list',
          type: 'ETFSector'
        },
        {
          label: 'ETF Sector Breadth',
          value: 'etf_breadth',
          type: 'ETFSectorBreadth'
        },
        {
          label: 'Country Data Breadth',
          value: 'country_breadth',
          type: 'GlobalIndexBreadth'
        },
        {
          label: 'Crypto Data Breadth',
          value: 'crypto_breadth',
          type: 'CryptoCurrencyBreadth'
        },
        {
          label: 'Most Active ETF Fund Flow',
          value: 'etf_flow',
          type: 'ETFFundFlow'
        },
        {
          label: 'Monthly Fund Flow',
          value: 'monthly_fund_flows',
          type: 'ETFMonthlyFund'
        },
        {
          label: 'Most Active ETF Shares Outstanding',
          value: 'shares_outstanding',
          type: 'ETFShares'
        },
        {
          label: 'Commodity Market Seasonality',
          value: 'commod_seasonality',
          type: 'CommoditySeasonality'
        },
        {
          label: 'Bond Market Seasonality',
          value: 'bond_seasonality',
          type: 'BondSeasonality'
        },
        {
          label: 'Index Market Seasonality',
          value: 'index_seasonality',
          type: 'IndexSeasonality'
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
        },
        {
          label: 'Macroeconomic Conditions',
          value: 'macroeconomic',
          type: 'macro_indicator_list'
        },
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
      let keysSort = ['Optix', 'Symbol', 'Name', 'Breadth Measure', 'Symbol', 'Group', 'Time Frame', 'Value', 'Optix Value', 'Last Value', 'Z-Score', 'Change', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date', 'Optix Date', 'Last Update', '3-Year Max', '3-Year Min', 'Sentiment' ]
      if(type === 'commod_sentiment_seasonality') {const insertIndex = keysSort.findIndex(key => key === 'Avg Return'); if(insertIndex !== -1) keysSort.splice(insertIndex, 0, `Avg Return (%) for ${cssMonthLabel}`)}
      if(type === 'commod_seasonality' || type === 'bond_seasonality' || type === 'etf_seasonality' || type === 'index_seasonality') keysSort = ['Symbol','Name', 'Group', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date']
      const keysMap = new Map([
        ['chart_name', 'Name'],
        ['sub_type', 'Group'],
        ['timeframe', 'Time Frame'],
        ['time_frame', 'Time Frame'],
        ['last_value', 'Value'],
        ['last_change', 'Change'],
        ['last_update', 'Date'],
        ['sentiment', 'Sentiment']
      ])
      if(type === 'etf_breadth' || type === 'country_breadth' || type === 'crypto_breadth') keysMap.set('chart_name', 'Breadth Measure')
      if(type === 'bond_seasonality' || type === 'commod_seasonality' || type === 'etf_seasonality' || type === 'index_seasonality'){keysMap.set('win_rate', 'Win Rate');keysMap.set('avg_return', 'Avg Return')}
      if(type === 'commod_seasonality' || type === 'etf_seasonality') {keysMap.set('chart_name', 'Symbol');keysMap.set('underlying_name', 'Name')}
      if(type === 'etf_seasonality') keysMap.set('avg_net_return', 'Avg Net Return')
      if(type === 'ndx_100_complete_list' || type === 'sp_1500_complete_list' || type === 'russell_3000_complete_list'|| type === 'russell_1000_complete_list'|| type === 'russell_2000_complete_list') {keysMap.set('url', 'Symbol'); keysMap.set('z_score', 'Z-Score')}
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
      const _keySort = Array.from(Object.keys(sortedArray[0]))
      let csvContent = sortedArray.map(row => _keySort.map(key => `"${row[key] || ''}"`).join(',')).join('\n');
      csvContent = `${_keySort.join(',')}\n${csvContent}`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${xlsxName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    
    handleQuery: debounce(function () { this._filterData() }, 500),
    _filterData(){
		  this.filterData = this.filterGroups(this.filterTimeFrame(this.filterIndicator(this.getSearchResult())))
      console.log('this.filterData', this.filterGroups(this.filterTimeFrame(this.filterIndicator(this.getSearchResult()))))
    },
    filterGroups(searchResult){
      if (this.groupsFilter) {
        return searchResult
        .filter(item=>(((item["groups"] && item["groups"].toLowerCase()) == this.groupsFilter.toLowerCase()) || ((item["sub_type"] && item["sub_type"].toLowerCase()) == this.groupsFilter.toLowerCase())))
      }else {
        return searchResult
      }
	  },
    filterTimeFrame(searchResult){
      if (this.timeframeFilter) {
        return searchResult
        .filter(item=>((item["timeframe"] && item["timeframe"].toLowerCase()) == this.timeframeFilter.toLowerCase()))
      }else {
        return searchResult
      }
	  },
    filterIndicator(searchResult){
      if (this.indicatorFilter) {
        return searchResult
        .filter(item=>(((item["chart_name"] && item["chart_name"].toLowerCase()) == this.indicatorFilter.toLowerCase()) || ((item["underlying_name"] && item["underlying_name"].toLowerCase()) == this.indicatorFilter.toLowerCase())))
      }else {
        return searchResult
      }
	  },
    getSearchResult() {
      if(this.searchInput){
        // 在搜索之前对搜索关键词进行转义
        const trimmedStr = this.searchInput.trim()
        const regex = new RegExp(this.escapeRegExp(trimmedStr), "i");
        return this.tableData.filter(item => {
            // 获取所有需要匹配的属性
            const properties = [
              item['chart_name'],
              item['market_symbol'],
              item['underlying_name'],
              item['timeframe'],
              item['groups'],
              item['sub_type']
            ];
          // 检查任意一个属性是否匹配
          return properties.some(property => regex.test(property));
        });
      }else{
        return this.tableData
      }
    },
    // 使用反斜杠转义特殊字符
    escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    },
    expandSearch() {
      this.isExpanded = true; // 展开输入框
    },
    collapseSearch() {
      if (!this.searchInput) {
        this.isExpanded = false; // 收起输入框
      }
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
    height: 578px !important
  }
  border: 2px solid #e9e9e9;
  /deep/ .el-button--text {
    color: rgb(31, 119, 180);
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
      border: 2px solid #d9d9d9;
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
    color: #000000;
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
    text-align: center;
    .cell {
      font-weight: 700;
      color: #000000;
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
    color: #000000;
    padding: 0px;
    margin: 0px;
    width: 100%;
    border: 1px solid #d9d9d9;
    border-color: #d9d9d9;
  }
  /deep/ .el-select .el-input .el-select__caret {
    font-weight: 600;
    color: #000000;
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
.dataTables_info {
  color: #000000;
  font-weight: 500;
  margin-top: 5px;
}
.search-input {
  width: 218px;
  margin: 2px 0px 0px 0px;
  float: left;
}
.filter-div {
  position: relative;
  padding: 0px;
  border-left: 2px solid #d9d9d9;
  border-right: 2px solid #d9d9d9;
  // height: 35px;
  /deep/ .el-input__inner {
    margin-left: 0px;
  }
  .btns {
    display: flex;
    .el-button{
      margin-right: 10px;
    }
  }
  .select-option {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #d9d9d9;
    border-radius: 4px;
    padding: 3px;
    margin: 3px 10px 3px 3px;
    span {
      font-size: 14px;
      margin-right: 5px
    }
  }
}
/deep/ .search-input {
  height: 100%;
  overflow: visible;
  z-index: 100; /* 保证层级高于其他元素 */
  &.el-input--suffix .el-input__inner {
    padding-right: 0px;
  }
  .el-input__prefix, .el-input__suffix {
    height: 32px;
    line-height: 32px;
  }
}
</style>