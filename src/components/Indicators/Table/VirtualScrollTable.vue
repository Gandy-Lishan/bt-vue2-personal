<template>
<div>
  <div>
    <div class="header-span" v-show="(!showReport && !showRelated)">
      <span>{{ label }}</span>
      <el-tooltip effect="dark" placement="top" :content="enlarged ? 'Back to View All' : 'Enlarge to View'">
        <i class="el-icon-full-screen" @click="_toggleEnlarge" v-show="!isMostPopular"></i>
      </el-tooltip>
    </div>
    <div class="header-span" v-show="!['commodity', 'cssScreen', 'cstScreen', 'CHMinMax'].includes(type) && (!showReport && !showRelated)">
      <template v-for="item in options">
        <span :key="item.label" @click="changeOption(item)" :class="{activated: (checkedType  == item.value), span: true}">{{ item.label }}</span>
      </template>
    </div>
  </div>
  <div class="filter-div" v-show="enlarged && (!showReport && !showRelated)">
    <el-row>
      <el-col :span="18">
        <el-row>
          <div class="btns">
            <el-button size="small" @click="downloadCSV"><i class="el-icon-download" style="margin-right: 5px"></i>Download CSV</el-button>
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
            <div class="select-option" v-show="Array.isArray(indicatorOptions) && indicatorOptions.length !== 0">
              <span>Indicator</span>
              <el-select v-model="indicatorFilter" size="mini" placeholder="Please Select" label="Test"  @change="handleQuery">
              <el-option
                v-for="item in indicatorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </div>
          </div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-input
          @input="handleQuery"
          size="small"
          placeholder="Search"
          v-model="searchInput"
          clearable>
        </el-input>
      </el-col>
    </el-row>
  </div>
  <virtual-scroll
      :ref="refName"
      :data="filterData"
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
        size="mini"
        row-key="url"
        v-loading="_loading"
        :row-class-name="tableRowClassName"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
			  @sort-change="changeTableSort"
        :height="!enlarged ? 300 : 620">
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
              <a v-else-if="l.value === 'title'" :href="`https://sentimentrader.com/blog/${scope.row['blog_url']}`" target="_blank">{{ scope.row[l.value] }}</a>
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
  <div class="dataTables_info" v-show="enlarged && pageLength">
    {{`Showing 1 to ${pageLength} of ${pageLength} entries`}}
  </div>
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
    isOver: Object,
    tableData: Array,
    options: Array,
    type: String,
    label: String,
    loading: Boolean,
    firstRow: Object,
    showReport: Boolean,
    showRelated: Boolean
  },
  directives: {
    ElTableInfiniteScroll
  },
  components: {
    VirtualScroll
  },
  inject: ['toggleEnlarge', 'removeIndicatorsFavorites', 'checkedOption'],
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
      isMostPopular: false,
      groupsFilter: '',
      timeframeFilter: '',
      indicatorFilter: '',
      searchInput: '',
      filterData: []
    }
  },
  computed: {
    ...mapGetters({
      cssMonthLabel: 'getCssMonthLabel',
      favoritesBtv1List: 'getFavoriteIndicatorListBtv1',
      favoritesBtv2List: 'getFavoriteIndicatorList',
      _favoriteSymbolList: 'getFavoriteSymbolList',
      indicatorsListData: 'getIndicatorsPageListData',
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
              minWidth: '100px'
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
              minWidth: '100px',
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
        ['researchColumns', 
          [
            {
              key: 'post_date',
              label: 'Date Published',
              value: 'post_date'
            },
            {
              key: 'title',
              label: 'Title',
              value: 'title',
              minWidth: '300px'
            }
          ]
        ],
      ]))
      const columns = columnsMap.get(`${this.checkedType}Columns`)
      if(this.type === 'research') {console.log('columns', columnsMap.get(`${this.type}Columns`)); return columnsMap.get(`${this.type}Columns`)}
      if(this.type === 'related') {return columnsMap.get('stockColumns')}
      let simplifiedColumnsKeys = ['chart_name', 'last_value', 'last_change', 'last_update']
      if(this.checkedType === 'BondSeasonality' || this.checkedType === 'CommoditySeasonality') simplifiedColumnsKeys = ['chart_name', 'win_rate', 'avg_return', 'last_update']
      if(this.checkedType === 'ETFSeasonality') simplifiedColumnsKeys = ['chart_name', 'win_rate', 'avg_return', 'last_update']
      if(this.checkedType === 'cssScreen' || this.checkedType === 'cstScreen') simplifiedColumnsKeys = ['chart_name', 'name', 'last_value', 'last_update']
      if(this.checkedType === 'CHMinMax') simplifiedColumnsKeys = ['chart_name', 'symbol', 'last_value', 'last_update']
      if(!this.enlarged) return columns.filter(item => simplifiedColumnsKeys.includes(item.key)).map(item=>{
        if(item.key === 'chart_name') item.minWidth = '200px'
        return item
      })
      return columns
    },
    pageLength() {
      return this.filterData.length || 0
    },
    groupsOptions() {
      if(this.checkedType === 'stock') return [
        { value: '', label: '----' },
        { value: 'Model', label: 'Model' },
        { value: 'Breadth', label: 'Breadth' },
        { value: 'Cash', label: 'Cash' },
        { value: 'COT', label: 'COT' },
        { value: 'Index', label: 'Index' },
        { value: 'Insiders', label: 'Insiders' },
        { value: 'Optix', label: 'Optix' },
        { value: 'PutCall', label: 'PutCall' },
        { value: 'Rydex', label: 'Rydex' },
        { value: 'Shorts', label: 'Shorts' },
        { value: 'Surveys', label: 'Surveys' },
        { value: 'Volatility', label: 'Volatility' }
      ]
      if(this.checkedType === 'bond') return [
        { value: '', label: '----' },
        { value: 'Model', label: 'Model' },
        { value: '10-Year Treasury', label: '10-Year Treasury' },
        { value: '2-Year Treasury', label: '2-Year Treasury' },
        { value: '20-Year Treasury', label: '20-Year Treasury' },
        { value: '30-Year Treasury', label: '30-Year Treasury' },
        { value: 'Cot', label: 'Cot' },
        { value: 'Etf_bond', label: 'Etf_bond' },
        { value: 'Eurodollar', label: 'Eurodollar' },
        { value: 'High-Yield', label: 'High-Yield' },
        { value: 'Investment Grade', label: 'Investment Grade' },
        { value: 'Volatility', label: 'Volatility' }
      ]
      if(this.checkedType === 'commodity') return [
        { value: '', label: '----' },
        { value: 'Model', label: 'Model' },
        { value: 'Commodity', label: 'Commodity' },
        { value: 'COT', label: 'COT' },
        { value: 'Optix', label: 'Optix' },
        { value: 'PutCall', label: 'PutCall' },
        { value: 'Rydex', label: 'Rydex' },
        { value: 'Seasonality', label: 'Seasonality' },
        { value: 'Volatility', label: 'Volatility' }
      ]
      if(this.checkedType === 'ETFSector' || this.checkedType === 'ETFFundFlow'  || this.checkedType === 'ETFShares') return [
        { value: '', label: '----' },
        { value: 'Bond', label: 'Bond' },
        { value: 'Commodity', label: 'Commodity' },
        { value: 'Country', label: 'Country' },
        { value: 'Index', label: 'Index' },
        { value: 'Sector', label: 'Sector' }
      ]
      if(this.checkedType === 'ETFSectorBreadth') return [
        { value: '', label: '----' },
        { value: 'Basic Materials (XLB)', label: 'Basic Materials (XLB)' },
        { value: 'BMV IPC (MEXBOL)', label: 'BMV IPC (MEXBOL)' },
        { value: 'Brazil Stock Index (IBOV)', label: 'Brazil Stock Index (IBOV)' },
        { value: 'CAC 40 (CAC)', label: 'CAC 40 (CAC)' },
        { value: 'Consumer Disc. (XLY)', label: 'Consumer Disc. (XLY)' },
        { value: 'Consumer Staples (XLP)', label: 'Consumer Staples (XLP)' },
        { value: 'DAX (DAX)', label: 'DAX (DAX)' },
        { value: 'Dow Jones Ind. (DIA)', label: 'Dow Jones Ind. (DIA)' },
        { value: 'Emerging Markets (MXEF)', label: 'Emerging Markets (MXEF)' },
        { value: 'Energy (XLE)', label: 'Energy (XLE)' },
        { value: 'Financials (XLF)', label: 'Financials (XLF)' },
        { value: 'FTSE 100 (FTSE)', label: 'FTSE 100 (FTSE)' },
        { value: 'Hang Seng (HSI)', label: 'Hang Seng (HSI)' },
        { value: 'Healthcare (XLV)', label: 'Healthcare (XLV)' },
        { value: 'Ind.s (XLI)', label: 'Ind.s (XLI)' },
        { value: 'Korea Stock Index (KOSPI)', label: 'Korea Stock Index (KOSPI)' },
        { value: 'NASDAQ 100 ETF (QQQ)', label: 'NASDAQ 100 ETF (QQQ)' },
        { value: 'NASDAQ Composite (COMP)', label: 'NASDAQ Composite (COMP)' },
        { value: 'NIfty 50 Index', label: 'NIfty 50 Index' },
        { value: 'Nikkei 225 (NKY)', label: 'Nikkei 225 (NKY)' },
        { value: 'Russell 2000 ETF (IWM)', label: 'Russell 2000 ETF (IWM)' },
        { value: 'S&P 500 ETF (SPY)', label: 'S&P 500 ETF (SPY)' },
        { value: 'SENSEX Index', label: 'SENSEX Index' },
        { value: 'Shanghai (SHCOMP)', label: 'Shanghai (SHCOMP)' },
        { value: 'Swiss Market Index (SMI)', label: 'Swiss Market Index (SMI)' },
        { value: 'Technology (XLK)', label: 'Technology (XLK)' },
        { value: 'Toronto Stock Exchange (TSX)', label: 'Toronto Stock Exchange (TSX)' },
        { value: 'Utilities (XLU)', label: 'Utilities (XLU)' }
      ]
      if(this.checkedType === 'ETFMonthlyFund') return [
        { value: '', label: '----' },
        { value: 'Bond', label: 'Bond' },
        { value: 'Commodity', label: 'Commodity' },
        { value: 'Sector', label: 'Sector' },
        { value: 'Stocks', label: 'Stocks' }
      ]
      if(this.isMostPopular) return [
        { value: '', label: '----' },
        { value: 'Model', label: 'Model' },
        { value: 'Breadth', label: 'Breadth' },
        { value: 'Commodity', label: 'Commodity' },
        { value: 'COT', label: 'COT' },
        { value: 'Index', label: 'Index' },
        { value: 'Optix', label: 'Optix' },
        { value: 'PutCall', label: 'PutCall' },
        { value: 'Shorts', label: 'Shorts' },
        { value: 'Rydex', label: 'Rydex' },
        { value: 'Surveys', label: 'Surveys' },
        { value: 'Volatility', label: 'Volatility' }
      ]
      return []
    },
    timeframeOptions() {
      if(['stock', 'bond', 'commodity', 'ETFSectorBreadth'].includes(this.checkedType) || this.isMostPopular) return [
        { value: '', label: '----' },
        { value: 'Short', label: 'Short' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Long', label: 'Long' }
      ]
      if(this.checkedType === 'ETFSector') return [
        { value: '', label: '----' },
        { value: 'Short', label: 'Short' },
        { value: 'Medium', label: 'Medium' }
      ]
      if(this.checkedType === 'ETFFundFlow') return [
        { value: '', label: '----' },
        { value: 'Short', label: 'Short' }
      ]
      if(this.checkedType === 'ETFMonthlyFund') return [
        { value: '', label: '----' },
        { value: 'Long', label: 'Long' }
      ]
      if(this.checkedType === 'ETFShares') return [
        { value: '', label: '----' },
        { value: 'Medium', label: 'Medium' }
      ]
      return []
    },
    indicatorOptions() {
      if(this.checkedType === 'ETFSectorBreadth') return [
        { value: '', label: '----' },
        { value: '10 A/D Ratio', label: '10-Day Sum Advance/Decline Ratio' },
        { value: '12W High', label: '12 Week High' },
        { value: '12W Low', label: '12 Week Low' },
        { value: '3M ROC', label: '3-month ROC' },
        { value: '4W High', label: '4 Week High' },
        { value: '4W Low', label: '4 Week Low' },
        { value: 'Above BB', label: 'Above Bband' },
        { value: 'A/Decline', label: 'Advance / Decline' },
        { value: 'Below BB', label: 'Below Bband' },
        { value: '> 10 Day', label: 'Breadth ( > 10 Day Avg)' },
        { value: '> 200 Day', label: 'Breadth ( > 200 Day Avg)' },
        { value: '> 50 Day', label: 'Breadth ( > 50 Day Avg)' },
        { value: 'Cumulative A/D Line', label: 'Cumulative A/D Line' },
        { value: 'MC Osc', label: 'McClellan Oscillator' },
        { value: 'MC Summ', label: 'McClellan Summation' },
        { value: 'New High', label: 'New High' },
        { value: 'New Low', label: 'New Low' },
        { value: 'Panic Composite', label: 'Panic Breadth Composite' },
        { value: 'RSI < 30', label: 'RSI 14-Day < 30' },
        { value: 'RSI > 70', label: 'RSI 14-Day > 70' }
      ]
      return []
    }
  },
  watch: {
		label: {
			handler(newValue){
        console.log('newValue', newValue)
        if(newValue === 'Most Popular') {
          this.isMostPopular = true
          this.enlarged = true
        }
        if(newValue === 'Research & Blog Posts' || newValue === 'Related Charts') {
          this.enlarged = true
        }
			},
      immediate: true
		},
    tableData: {
      handler(newValue) {
        if(Array.isArray(newValue) && newValue.length !== 0) this.filterData = newValue
      },
      immediate: true,
      depp: true
    }
	},
  methods: {
    ...mapActions('chart', ['update_indicators_favorite', 'fetchIndicatorsPageList']),
    async _toggleEnlarge(checked, row) {
      if(this._loading) return
      if(((checked && checked instanceof PointerEvent) || !checked) && !row) {this.enlarged = !this.enlarged;this.toggleEnlarge(this.label);this.checkedOption( this.enlarged ? this.checkedType : null)}
      if(checked && typeof checked === 'string' && this.checkedType !== checked && row) {
        const option = this.options.find(item => item.value === checked)
        if(option) await this.changeOption(option, false)
      }
      if(checked && typeof checked === 'string' && row && row?.chart_name) {
        // 图表显示和排序高亮
        if(!this.enlarged) {this.toggleEnlarge(this.label);this.enlarged = true}
        this.$emit("updateChart", row || {})
        console.log('图表显示和排序高亮 Table', this.checkedType)
        this.updateChart(row)
        return
      }
      this.$emit("updateChart", this.firstRow || {})
    },
    async loadMore () {
      // await this.$emit('loadMore', this.checkedType)
    },
    async changeOption(item, isUpdateChart) {
      if(this.loading) return
      if(this.options.length === 1) return
      this.$refs[`${this.refName}Table`].clearSort()
      this.searchInput = ''
      this.groupsFilter = ''
      this.timeframeFilter = ''
      this.indicatorFilter = ''
      this.checkedType = item.value; 
      this.checkedOption(this.checkedType)
      await this.$nextTick(async () => {
        await this.$emit('loadMore', item.value, isUpdateChart === undefined ? true : isUpdateChart)
      })
      // this.$forceUpdate()
    },
    handleCellMouseEnter: debounce(function (row, column, cell, event){
      if(row.url && !this.type.includes('Seasonality') && column.property === 'chart_name') {
        let _t = '50%'
        let _l = 0
        let {url} = row
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
      if(row.type === 'stock_nasdaq' || row.type === 'stock_sent') url = url.toLowerCase()
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
      if(this.showRelated) return
      // if(!this.enlarged) {window.open(`/backtester/sr/setup?index=${row.market_symbol || 'Unknown'}&indicator=${row.url}`, '_blank');return}
      if(!this.enlarged) {
        this.enlarged = true
        this.toggleEnlarge(this.label);
        this.checkedOption( this.enlarged ? this.checkedType : null)
      }
      this.$emit("updateChart", row)
      this.$emit("showDetails", row, true, this.checkedType)
    },
    onLoad() {
      this.showImg = true
    },
    onError() {
      this.showImg = false
    },
    async addRow(scope) {
      try {
        if(scope.row.source !== 'Backtest Engine v2.0') {
          this.popUpMsgBox('This indicator is from BTV1. Please remove it from your BTV1 favorites')
          return
        }
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
        const url = scope.row.source_list
        // const  _results = isJson(this.indicatorsListData[url]) ? JSON.parse(this.indicatorsListData[url]) : []
        // const findIndex = _results.findIndex(ele => ele.url === scope.row.url)
        // if(findIndex !== -1) {
        //   const find = _results[findIndex]
        //   _results.splice(findIndex, 1, {...find, favorite: !find.favorite})
        //   this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url, data: this.tableData})
        // }
        console.log('VirtaulScroll 保存之前的 URL', url) // todo
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
              this.filterData.sort((a, b) => {
                  b[colName] = typeof b[colName] === 'number' ? String(b[colName]) : b[colName]
                  a[colName] = typeof a[colName] === 'number' ? String(a[colName]): a[colName]
                  let _b = b[colName].match(/-?\d+([\/.]\d+)?/g)
                  let _a = a[colName].match(/-?\d+([\/.]\d+)?/g)
                  _b = _b ? _b.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                  _a = _a ? _a.reduce((pre, cur) => { return Number(pre) + Number(cur) }) : 0
                  return _b - _a
              })
          } else if (sortingOrder == 'descending') {
              this.filterData.sort((a, b) => {
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
			if(['chart_name','groups','timeframe','url', 'underlying_name', 'name', 'sub_type'].indexOf(colName) !== -1){
        if(sortingOrder === 'ascending') {
          this.filterData.sort((a, b) => {
          const aValue = a[colName] || '';
          const bValue = b[colName] || '';
          if (!aValue) return 1;
          if (!bValue) return -1;
            return aValue.localeCompare(bValue, 'en', { sensitivity: 'base' });
          });
          } else if(sortingOrder === 'descending') {
          this.filterData.sort((a, b) => {
          const aValue = a[colName] || '';
          const bValue = b[colName] || '';
          if (!aValue) return 1;
          if (!bValue) return -1;
            return bValue.localeCompare(aValue, 'en', { sensitivity: 'base' });
          });
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
          label: 'ETF Seasonality',
          value: 'etf_seasonality',
          type: 'ETFSeasonality'
        },
        {
          label: 'Most Popular Charts',
          value: 'most_popular',
          type: 'popular'
        },
        // {
        //   label: 'My Favorites',
        //   value: 'my_favorites',
        //   type: 'favorite'
        // }
      ]
      const type = checks.find(item => item.type === this.checkedType)?.value
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
      if(type === 'commod_seasonality' || type === 'bond_seasonality' || type === 'etf_seasonality') keysSort = ['Symbol','Name', 'Group', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date', "Sentiment"]
      const keysMap = new Map([
        ['chart_name', 'Name'],
        ['sub_type', 'Group'],
        ['timeframe', 'Time Frame'],
        ['time_frame', 'Time Frame'],
        ['last_value', 'Value'],
        ['last_change', 'Change'],
        ['last_update', 'Date'],
        ['sentiment', 'Sentiment'],
      ])
      if(type === 'etf_breadth') {keysMap.set('chart_name', 'Breadth Measure');keysMap.set('underlying_name', 'Name');}
      if(type === 'bond_seasonality' || type === 'commod_seasonality' || type === 'etf_seasonality'){keysMap.set('win_rate', 'Win Rate');keysMap.set('avg_return', 'Avg Return')}
      if(type === 'commod_seasonality' || type === 'etf_seasonality') {keysMap.set('chart_name', 'Symbol');keysMap.set('underlying_name', 'Name')}
      if(type === 'etf_seasonality') {keysMap.set('avg_net_return', 'Avg Net Return'); keysMap.delete('sub_type');keysMap.set('groups', 'Group');}
      if(type === 'ndx_100_complete_list' || type === 'sp_1500_complete_list') {keysMap.set('url', 'Symbol'); keysMap.set('z_score', 'Z-Score')}
      if(['etf_complete_list', 'etf_flow', 'monthly_fund_flows', 'shares_outstanding', 'commod_seasonality', 'etf_seasonality'].includes(type)) {keysMap.set('chart_name', 'Symbol')}
      if(['etf_complete_list', 'etf_flow', 'commod_seasonality', 'etf_seasonality'].includes(type)) {keysMap.set('underlying_name', 'Name')}
      if(type === 'commod_sentiment_seasonality' || type === 'commod_optix_trend') {keysMap.set('chart_name', 'Optix');keysMap.set('name', 'Name');keysMap.set('last_value', 'Optix Value');}
      if(type === 'commod_sentiment_seasonality') {keysMap.set('last_update', 'Optix Date');keysMap.set('AvgReturn', `Avg Return (%) for ${cssMonthLabel}`);}
      if(type === 'commod_optix_trend') {keysMap.set('close', 'Close');keysMap.set('MA', '200-Day Moving Average');}
      if(type === 'cot_max_min') {keysMap.set('chart_name', 'Name');keysMap.set('symbol', 'Symbol');keysMap.set('last_value', 'Last Value');keysMap.set('last_update', 'Last Update');keysMap.set('three_year_max', '3-Year Max');keysMap.set('three_year_min', '3-Year Min');}
      if(type === 'ndx_100_complete_list' || type === 'sp_1500_complete_list') {
        // Name 放在 Symbol 前面
        keysSort = ['Optix', 'Name', 'Symbol', 'Breadth Measure', 'Group', 'Time Frame', 'Value', 'Optix Value', 'Last Value', 'Z-Score', 'Change', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date', 'Optix Date', 'Last Update', '3-Year Max', '3-Year Min', 'Sentiment'];
      }

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
      let csvContent = sortedArray.map(row => _keySort.map(key => `"${row[key]}"`).join(',')).join('\n');
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
    tableRowClassName({ row, rowIndex }) {
      if(rowIndex % 2 === 0) return 'even'
      return ''
    },
    handleQuery: debounce(function () { this._filterData(); this.handleCellMouseLeave()}, 500),
    _filterData(){
		  this.filterData = this.filterGroups(this.filterTimeFrame(this.filterIndicator(this.getSearchResult())))
      console.log('this.filterData', this.filterGroups(this.filterTimeFrame(this.filterIndicator(this.getSearchResult()))))
    },
    filterGroups(searchResult){
      debugger
      if (this.groupsFilter) {
        return searchResult
        .filter(item=>(item["groups"].toLowerCase() == this.groupsFilter.toLocaleLowerCase() || item["sub_type"].toLowerCase() == this.groupsFilter.toLocaleLowerCase()))
      }else {
        return searchResult
      }
	  },
    filterTimeFrame(searchResult){
      if (this.timeframeFilter) {
        return searchResult
        .filter(item=>item["timeframe"].toLowerCase() == this.timeframeFilter.toLocaleLowerCase())
      }else {
        return searchResult
      }
	  },
    filterIndicator(searchResult) {
  if (this.indicatorFilter) {
    // 将过滤条件转换为小写，并将其拆分成关键字数组
    const filterKeywords = this.indicatorFilter.toLowerCase().split('').filter(item => item);
    console.log('filterKeywords', filterKeywords);
    
    return searchResult.filter(item => {
      const chartName = item["chart_name"].toLowerCase();
      
      // 检查关键字是否按顺序出现在 chartName 中
      let currentIndex = 0;
      for (const keyword of filterKeywords) {
        currentIndex = chartName.indexOf(keyword, currentIndex);
        if (currentIndex === -1) {
          return false; // 如果某个关键字未找到，则过滤掉该项
        }
        currentIndex++; // 移动到下一个字符的位置
      }
      return true; // 所有关键字都按顺序找到
    });
  } else {
    return searchResult;
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
              item['url'],
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
    height: 575px !important
  }
  border: 2px solid  #e9e9e9;
  /deep/ .el-button--text {
    color: rgb(31, 119, 180);
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
    svg {
      cursor: pointer;
      margin-right: 10px;
    }
    span {
      display: inline-block;
      flex-grow: 1;
      padding: 2px 0;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      border: 2px solid #d9d9d9;
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
      padding: 5px 0px 5px 0px;
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
  /deep/ .highlighted {
    background-color: yellow;
  }
}
.dataTables_info {
  color: #333;
  font-weight: 500;
  margin-top: 10px;
}
.filter-div {
  padding: 10px 5px;
  border-left: 2px solid #d9d9d9;
  border-right: 2px solid #d9d9d9;
  /deep/ .el-input__inner {
    margin-left: 0px;
  }
  .btns {
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
    margin-right: 10px;
    padding: 3px;
    span {
      font-size: 14px;
      margin-right: 5px
    }
  }
}
</style>