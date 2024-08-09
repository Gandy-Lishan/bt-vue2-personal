<template>
<div>
  <div>
    <div class="header-span">
      <span>{{ label }}</span>
      <i class="el-icon-full-screen" @click="_toggleEnlarge" v-show="!isMostPopular"></i>
    </div>
    <div class="header-span" v-show="!['popular', 'commodity', 'cssScreen', 'cstScreen', 'CHMinMax'].includes(type)">
      <template v-for="item in options">
        <span :key="item.label" @click="changeOption(item)" :class="{activated: (checkedType  == item.value), span: true}">{{ item.label }}</span>
      </template>
    </div>
  </div>
  <virtual-scroll
      :ref="refName"
      :data="tableData"
      :item-size="itemSize"
      key-prop="url"
      class="virtualScroll"
      @change="(renderData) => virtualList = renderData">
      <el-table
        v-el-table-infinite-scroll="loadMore"
        :ref="`${refName}Table`"
        class="virtual-table"
        :data="virtualList"
				empty-text="No data"
        stripe
        size="mini"
        row-key="url"
        v-loading="_loading"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
			  @sort-change="changeTableSort"
        :height="!enlarged ? 300 : 'auto'">
        <!-- <el-table-column> -->
          <!-- <template #header>
            <div class="header-span">
              <span>{{ label }}</span>
              <i class="el-icon-full-screen" @click="_toggleEnlarge" v-show="!isMostPopular"></i>
            </div>
            <div class="header-span" v-show="!['popular', 'commodity', 'cssScreen', 'cstScreen', 'CHMinMax'].includes(type)">
              <template v-for="item in options">
                <span :key="item.label" @click="changeOption(item)" :class="{activated: (checkedType  == item.value), span: true}">{{ item.label }}</span>
              </template>
            </div>
          </template> -->
          <!-- <el-table-column>
          <template #header>
            <div class="header-span">
              <template v-for="item in options">
                <span :key="item.label" @click="changeOption(item)" :class="{activated: (checkedType  == item.value), span: true}">{{ item.label }}</span>
              </template>
            </div>
          </template> -->
          <el-table-column align="center" width="35px" v-if="this.enlarged">
            <template slot-scope="scope">
              <el-button-group>
                <el-button v-if="scope.row.favorite === false" size="small" type="text" icon="el-icon-star-off" @click="addRow(scope)" title="Add to favorites" :loading="scope.row.loading"></el-button>
                <el-button v-else-if="scope.row.favorite === true" size="small" type="text" icon="el-icon-star-on" @click="addRow(scope)" title="Remove from favorites" :loading="scope.row.loading"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <template v-for="l in columns">
            <el-table-column
              :key="l.label"
              :label="`${l.label}${(cssMonthLabel && l.value == 'AvgReturn') ? ` ${cssMonthLabel}` : ''}`"
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
        <!-- </el-table-column> -->
        <!-- <div slot="append">
          <el-divider>
            <span>It's over~</span>
          </el-divider>
        </div> -->
      </el-table>
      <div class="image-hover" :style="hoverStyle">
        <img style="height: 300px; width: 100%;" :src="hoveredImage" v-if="showImg" :alt="hoveredChartName"  @load="onLoad" @error="onError"/>
      </div>
  </virtual-scroll>
</div>
</template>

<script>
import VirtualScroll from 'el-table-virtual-scroll'
import ElTableInfiniteScroll from 'el-table-infinite-scroll'
import { mapGetters, mapActions } from 'vuex'
import { isJson } from '@/utils'
const debounce = require('lodash/debounce')
const cloneDeep = require('lodash/cloneDeep')

export default {
  props: {
    refName: String,
    itemSize: Number,
    tableInfo: Object,
    isOver: Object,
    tableData: Array,
    options: Array,
    type: String,
    label: String,
    loading: Boolean,
    firstRow: Object
  },
  directives: {
    ElTableInfiniteScroll
  },
  components: {
    VirtualScroll
  },
  inject: ['toggleEnlarge', 'removeIndicatorsFavorites'],
  data() {
    return {
      virtualList: [],
      hoveredChartName: '',
      showImg: false,
      hoveredImage: '',
      hoverStyle: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        display: 'none'
      },
      checkedType: this.type,
      enlarged: false,
      isMostPopular: false
    }
  },
  computed: {
    ...mapGetters({
      cssMonthLabel: 'getCssMonthLabel',
      favoritesBtv1List: 'getFavoriteIndicatorListBtv1',
      favoritesBtv2List: 'getFavoriteIndicatorList',
      _favoriteSymbolList: 'getFavoriteSymbolList',
      indicatorsListData: 'getIndicatorsPageListData'
    }),
    _loading() {
      return this.loading
    },
    columns() {
      const columnsMap = new Map(([
        ['stockColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
            },
            {
              key: 'timeframe',
              label: 'Time Frame',
              value: 'timeframe'
            },
            {
              key: 'last_value',
              label: 'Value',
              value: 'last_value',
              addPercentSign: true
            },
            {
              key: 'last_change',
              label: 'Change',
              value: 'last_change',
              addPercentSign: true,
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
            ]
        ],
        ['NASDAQColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '150px'
            },
            {
              key: 'url',
              label: 'Symbol',
              value: 'url',
              allCapLetters: true
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
              key: 'z_score',
              label: 'Z-Score',
              value: 'z_score'
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
            ]
        ],
        ['SP1500Columns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '180px'
            },
            {
              key: 'url',
              label: 'Symbol',
              value: 'url',
              allCapLetters: true
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
              key: 'z_score',
              label: 'Z-Score',
              value: 'z_score'
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
            ]
        ],
        ['bondColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '200px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              minWidth: '100px',
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
            ]
        ],
        ['ETFSectorColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '150px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
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
            ]
        ],
        ['ETFSectorBreadthColumns', 
          [
            {
              key: 'chart_name',
              label: 'Breadth Measure',
              value: 'chart_name',
              minWidth: '200px'
            },
            {
              key: 'underlying_name',
              label: 'Name',
              value: 'underlying_name',
              minWidth: '150px'
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
            ]
        ],
        ['ETFFundFlowColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '150px'
            },
            {
              key: 'underlying_name',
              label: 'Name',
              value: 'underlying_name',
              minWidth: '150px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
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
            ]
        ],
        ['ETFMonthlyFundColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '200px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
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
            ]
        ],
        ['ETFSharesColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '150px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
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
            ]
        ],
        ['CommoditySeasonalityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '150px'
            },
            {
              key: 'underlying_name',
              label: 'Name',
              value: 'underlying_name',
              minWidth: '100px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
            },
            {
              key: 'win_rate',
              label: 'Win Rate',
              value: 'win_rate',
              addPercentSign: true
            },
            {
              key: 'avg_return',
              label: 'Avg Return',
              value: 'avg_return',
              addPercentSign: true
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
            ]
        ],
        ['BondSeasonalityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '150px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
            },
            {
              key: 'win_rate',
              label: 'Win Rate',
              value: 'win_rate',
              addPercentSign: true
            },
            {
              key: 'avg_return',
              label: 'Avg Return',
              value: 'avg_return',
              addPercentSign: true
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
            ]
        ],
        ['ETFSeasonalityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '100px'
            },
            {
              key: 'underlying_name',
              label: 'Name',
              value: 'underlying_name',
              minWidth: '150px'
            },
            {
              key: 'groups',
              label: 'Groups',
              value: 'groups',
              capFirstLetter: true
            },
            {
              key: 'win_rate',
              label: 'Win Rate',
              value: 'win_rate',
              addPercentSign: true
            },
            {
              key: 'avg_return',
              label: 'Avg Return',
              value: 'avg_return',
              addPercentSign: true
            },
            {
              key: 'avg_net_return',
              label: 'Avg Net Return',
              value: 'avg_net_return',
              addPercentSign: true
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
            ]
        ],
        ['popularColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
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
          ]
        ],
        ['commodityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '180px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
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
            ]
        ],
        ['cssScreenColumns', 
          [
            {
              key: 'chart_name',
              label: 'Optix',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'name',
              label: 'Name',
              value: 'name',
              minWidth: '150px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
            },
            {
              key: 'last_value',
              label: 'Optix Value',
              value: 'last_value'
            },
            {
              key: 'last_update',
              label: 'Optix Date',
              value: 'last_update'
            },
            {
              key: 'AvgReturn',
              label: 'Average Return (%)', // month 是动态变化的
              value: 'AvgReturn',
              addPercentSign: true
            }
          ]
        ],
        ['cstScreenColumns', 
          [
            {
              key: 'chart_name',
              label: 'Optix',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'name',
              label: 'Name',
              value: 'name',
              minWidth: '150px'
            },
            {
              key: 'sub_type',
              label: 'Groups',
              value: 'sub_type',
              capFirstLetter: true
            },
            {
              key: 'last_value',
              label: 'Optix Value',
              value: 'last_value'
            },
            {
              key: 'last_update',
              label: 'Optix Date',
              value: 'last_update'
            },
            {
              key: 'close',
              label: 'Close',
              value: 'close'
            },
            {
              key: 'MA',
              label: '200-Day Moving Average',
              value: 'MA'
            }
          ]
        ],
        ['CHMinMaxColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'symbol',
              label: 'Symbol',
              value: 'symbol'
            },
            {
              key: 'last_value',
              label: 'Last Value',
              value: 'last_value'
            },
            {
              key: 'last_update',
              label: 'Last Update',
              value: 'last_update'
            },
            {
              key: 'three_year_max',
              label: '3-Year Max',
              value: 'three_year_max'
            },
            {
              key: 'three_year_min',
              label: '3-Year Min',
              value: 'three_year_min'
            },
          ]
        ],
      ]))
      const columns = columnsMap.get(`${this.checkedType}Columns`)
      let simplifiedColumnsKeys = ['chart_name', 'last_value', 'last_change', 'last_update']
      if(this.checkedType === 'BondSeasonality' || this.checkedType === 'CommoditySeasonality') simplifiedColumnsKeys = ['chart_name', 'win_rate', 'avg_return', 'last_update']
      if(this.checkedType === 'ETFSeasonality') simplifiedColumnsKeys = ['chart_name', 'win_rate', 'avg_return', 'last_update']
      if(this.checkedType === 'cssScreen' || this.checkedType === 'cstScreen') simplifiedColumnsKeys = ['chart_name', 'name', 'last_value', 'last_update']
      if(this.checkedType === 'CHMinMax') simplifiedColumnsKeys = ['chart_name', 'symbol', 'last_value', 'last_update']
      if(!this.enlarged) return columns.filter(item => simplifiedColumnsKeys.includes(item.key))
      return columns
    },
  },
  watch: {
		label: {
			handler(newValue){
        if(newValue === 'Most Popular Charts') {
          this.isMostPopular = true
          this.enlarged = true
        }
			},
      immediate: true
		}
	},
  methods: {
    ...mapActions('chart', ['update_indicators_favorite']),
    _toggleEnlarge() {
      this.toggleEnlarge(this.label)
      this.enlarged = !this.enlarged
      this.$emit("updateChart", this.firstRow || {})
    },
    async loadMore () {
      // await this.$emit('loadMore', this.checkedType)
    },
    async changeOption(item) {
      if(this.options.length === 1) return
      this.$refs[`${this.refName}Table`].clearSort()
      this.checkedType = item.value;     
      await this.$nextTick(async () => {
        await this.$emit('loadMore', item.value, true)
      })
      // this.$forceUpdate()
    },
    handleCellMouseEnter: debounce(function (row, column, cell, event){
      if(row.url && !this.type.includes('Seasonality') && column.property === 'chart_name') {
        let _t = '50%'
        let _l = 0
        const hoverElement = event.target
        const container = this.$el.querySelector('.virtual-table')
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
      if(!this.enlarged) {window.open(`/backtester/sr/setup?index=${row.market_symbol || 'Unknown'}&indicator=${row.url}`, '_blank');return}
      this.$emit("updateChart", row)
    },
    onLoad() {
      this.showImg = true
    },
    onError() {
      this.showImg = false
    },
    async addRow(scope) {
      try {
        if(scope.row.source !== 'Backtest Engine v2.0') return
        scope.row.loading = true
        const isFavorite = Boolean(scope.row.favorite) // 看原本的状态
        let flag = false
        if(!flag) {scope.row.favorite = !scope.row.favorite; flag = true}
        let favList = cloneDeep(this.favoritesBtv2List)
        let index = favList.findIndex(item => item.url === scope.row.url)
          // 添加收藏夹但是已经在收藏夹里面了
          console.log(index, isFavorite)
        if(index !== -1 && !isFavorite) {this.popUpMsgBox('This indicator already exists in favorites'); this.loading = false; return}
        // 在收藏夹中但是要移除
        if(index !== -1 && isFavorite) favList.splice(index, 1)
        // 不在收藏夹中添加收藏夹
        if(index === -1 && !isFavorite) favList = [...favList, {url: scope.row.url, name: scope.row.chart_name}]
        // 接口更新
        if((index !== -1 && isFavorite) || (index === -1 && !isFavorite)) await this.update_indicators_favorite({
            indicator: JSON.stringify(favList),
            symbol: JSON.stringify(this._favoriteSymbolList)
          })
        // 不在收藏夹中但是要移除
        if(index === -1 && isFavorite) return
        // 改变 table, vueX 中的数据并接口改变 favorite 列表
        console.log('this.tableData', this.tableData)
        const url = scope.row.source_list
        // const  _results = isJson(this.indicatorsListData[url]) ? JSON.parse(this.indicatorsListData[url]) : []
        // const findIndex = _results.findIndex(ele => ele.url === scope.row.url)
        // if(findIndex !== -1) {
        //   const find = _results[findIndex]
        //   _results.splice(findIndex, 1, {...find, favorite: !find.favorite})
        //   this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url, data: this.tableData})
        // }
        this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url, data: this.tableData})
        // 在 Most Popular 去更新对应的表; 不在 Most Popular 去更新 Most Popular
        if(url !== 'most_popular') {
          const _url = 'most_popular'
          const  _popularResults = isJson(this.indicatorsListData[_url]) ? JSON.parse(this.indicatorsListData[_url]) : []
          const _find = _popularResults.find(ele => ele.url === scope.row.url)
          if(_find) {
            _find.source_list = 'most_popular'
            this.removeIndicatorsFavorites([_find], true)
          }
        }
        else if(url === 'most_popular') {
          const urlTypes = Array.from(Object.keys(this.indicatorsListData))
          let sourceTable = urlTypes.map(url => {
            const list = isJson(this.indicatorsListData[url]) ? JSON.parse(this.indicatorsListData[url]) : []
              return list.map(item => {
                if(item.url === scope.row.url) return item
              }).filter(item => item !== undefined)
          }).filter(item => item.length > 0).flat()
          console.log('sourceTable', sourceTable) // [{}]
          // Filter the dictionary to remove items with the same URL and fav: false
          sourceTable = sourceTable.filter(item => (item.source_list !== 'most_popular'));
          sourceTable.forEach(item => {
            const {url, source_list: _sourceRowUrl} = item
            if(url) {
              const  _results = isJson(this.indicatorsListData[_sourceRowUrl]) ? JSON.parse(this.indicatorsListData[_sourceRowUrl]) : []
              const find = _results.find(ele => ele.url === url)
              if(find) this.removeIndicatorsFavorites([find])
          }
          })
        }
      } catch (error) {
        console.warn('移除收藏夹失败', error)
      } finally {
        scope.row.loading = false
      }
    },
    changeTableSort(column){
			var sortingOrder = column.order
			var colName = column.prop
			  // 数字字符串转数字类型排序
        if (['last_value', 'last_change', 'z_score', 'win_rate', 'avg_return', 'avg_net_return', 'close', 'MA', 'AvgReturn', 'sentiment'].indexOf(colName) !== -1) {
          if (sortingOrder == 'ascending') {
              this.tableData.sort((a, b) => {
                  b[colName] = typeof b[colName] === 'number' ? String(b[colName]) : b[colName]
                  a[colName] = typeof a[colName] === 'number' ? String(a[colName]): a[colName]
                  let _b = b[colName].match(/-?\d+([\/.]\d+)?/g)
                  let _a = a[colName].match(/-?\d+([\/.]\d+)?/g)
                  _b = _b ? _b.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                  _a = _a ? _a.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                  return _b - _a
              })
          } else if (sortingOrder == 'descending') {
              this.tableData.sort((a, b) => {
                  b[colName] = typeof b[colName] === 'number' ? String(b[colName]) : b[colName]
                  a[colName] = typeof a[colName] === 'number' ? String(a[colName]): a[colName]
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
			if(['chart_name','groups','timeframe','url', 'underlying_name', 'name', 'sub_type'].indexOf(colName) !== -1){
        if(sortingOrder === 'ascending') {
          this.tableData.sort((a, b) => {
          const aValue = a[colName] || '';
          const bValue = b[colName] || '';
          if (!aValue) return 1;
          if (!bValue) return -1;
            return aValue.localeCompare(bValue, 'en', { sensitivity: 'base' });
          });
          } else if(sortingOrder === 'descending') {
          this.tableData.sort((a, b) => {
          const aValue = a[colName] || '';
          const bValue = b[colName] || '';
          if (!aValue) return 1;
          if (!bValue) return -1;
            return bValue.localeCompare(aValue, 'en', { sensitivity: 'base' });
          });
			  }
      }
		}
  }
}
</script>

<style lang="less" scoped>
.virtualScroll {
  position: relative;
  /deep/ .el-table .sort-caret {
    left: 2px;
  }
  /deep/ .el-table .caret-wrapper {
    width: 10px;
  }
  /deep/.el-table__body-wrapper.is-scrolling-none {
    height: 500px !important;
  }
}

.header-span {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    // border: 2px solid #d9d9d9;
    &:first-child{
      background-color: #d9d9d9;
    }
    span {
      display: inline-block;
      flex-grow: 1;
      padding: 2px 0;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      border-left: 2px solid #d9d9d9;
      padding: 5px 0;
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
      background-color: #d9d9d9;
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