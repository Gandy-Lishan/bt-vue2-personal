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
        stripe
        border
        size="mini"
        row-key="url"
        v-loading="_loading"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
        :height="!enlarged ? 300 : 600">
        <el-table-column>
          <template #header>
            <div class="header-span">
              <span>{{ label }}</span>
              <i class="el-icon-full-screen" @click="_toggleEnlarge" v-show="!isMostPopular"></i>
            </div>
          </template>
          <el-table-column>
          <template #header>
            <div class="header-span">
              <template v-for="item in options">
                <span :key="item.label" @click="changeOption(item)" :class="{activated: (checkedType  == item.value), span: true}">{{ item.label }}</span>
              </template>
            </div>
          </template>
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
        </el-table-column>
        </el-table-column>
        <div slot="append">
          <el-divider>
            <!-- <span v-show="!isOver[checkedType]"><i class="el-icon-loading"></i> Loading...</span>
            <span v-show="isOver[checkedType]">It's over~</span> -->
            <span>It's over~</span>
          </el-divider>
        </div>
      </el-table>
      <div class="image-hover" :style="hoverStyle">
        <img style="height: 300px; width: 100%;" :src="hoveredImage" v-if="showImg" :alt="hoveredChartName"  @load="onLoad" @error="onError"/>
      </div>
    </virtual-scroll>
</template>

<script>
import VirtualScroll from 'el-table-virtual-scroll'
import ElTableInfiniteScroll from 'el-table-infinite-scroll'
const debounce = require('lodash/debounce')

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
  inject: ['sendData', 'toggleEnlarge'],
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
            ]
        ],
        ['NASDAQColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'url',
              label: 'Symbol',
              value: 'url'
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
              minWidth: '250px'
            },
            {
              key: 'url',
              label: 'Symbol',
              value: 'url'
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
              minWidth: '250px'
            },
            {
              key: 'groups',
              label: 'Group',
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
            ]
        ],
        ['commodityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'groups',
              label: 'Group',
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
            ]
        ],
        ['ETFSectorColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'groups',
              label: 'Group',
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
            ]
        ],
        ['ETFSectorBreadthColumns', 
          [
            {
              key: 'chart_name',
              label: 'Breadth Measure',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'groups',
              label: 'Group',
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
            ]
        ],
        ['ETFFundFlowColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'groups',
              label: 'Group',
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
            ]
        ],
        ['ETFMonthlyFundColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name'
            },
            {
              key: 'groups',
              label: 'Group',
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
            ]
        ],
        ['ETFSharesColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name'
            },
            {
              key: 'groups',
              label: 'Group',
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
            ]
        ],
        ['BondSeasonalityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '250px'
            },
            {
              key: 'groups',
              label: 'Group',
              value: 'groups'
            },
            {
              key: 'win_rate',
              label: 'Win Rate',
              value: 'win_rate'
            },
            {
              key: 'avg_return',
              label: 'Avg Return',
              value: 'avg_return'
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
              minWidth: '250px'
            },
            {
              key: 'groups',
              label: 'Group',
              value: 'groups'
            },
            {
              key: 'win_rate',
              label: 'Win Rate',
              value: 'win_rate'
            },
            {
              key: 'avg_return',
              label: 'Avg Return',
              value: 'avg_return'
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
              label: 'Breadth Measure',
              value: 'chart_name',
              minWidth: '250px'
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
        ]
      ]))
      const columns = columnsMap.get(`${this.checkedType}Columns`)
      let simplifiedColumnsKeys = ['chart_name', 'last_value', 'last_change', 'last_update']
      if(this.checkedType === 'BondSeasonality' || this.checkedType === 'CommoditySeasonality') simplifiedColumnsKeys = ['chart_name', 'win_rate', 'avg_return', 'last_update']
      if(!this.enlarged) return columns.filter(item => simplifiedColumnsKeys.includes(item.key))
      return columns
    }
  },
  watch: {
		label: {
			handler(newValue){
        if(newValue === 'Most Popular') {
          this.isMostPopular = true
          this.enlarged = true
        }
			},
      immediate: true
		}
	},
  methods: {
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
      this.checkedType = item.value; 
      await this.$emit('loadMore', item.value, true)
    },
    handleCellMouseEnter: debounce(function (row, column, cell, event){
      if(row.url && !this.type.includes('Seasonality') && column.property === 'chart_name') {
        let _t = '50%'
        let _r = '10%'
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
        console.log(event, this.enlarged)
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
      _t=`${_t}px`;_r=`10%`
      this.hoverStyle = {
        top: _t,
        right: _r,
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
      if(!this.enlarged) {window.location.href = `/backtester/sr/setup?index=${row.market_symbol || 'SPX'}&indicator=${row.url}`;return}
      this.$emit("updateChart", row)
    },
    onLoad() {
      this.showImg = true
    },
    onError() {
      this.showImg = false
    }
  }
}
</script>

<style lang="less" scoped>
.virtualScroll {
  position: relative;
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
    &:first-child .cell {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  /deep/ tr th.is-leaf.el-table__cell {
    background-color: #ffffff;
    text-align: left;
    .cell {
      font-weight: 600;
      color: #333;
      padding-left: 10px;
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