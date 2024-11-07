<template>
<div>
  <div>
    <div class="header-span" v-show="(!showReport && !showRelated)">
      <span>{{ label === 'Stock Trend' ? 'Absolute and Relative Trend Scores' : label }}{{trendUpdateDate}}</span>
      <el-tooltip effect="dark" placement="top" :content="enlarged ? 'Back to View All' : 'Enlarge to View'">
        <!-- <i class="el-icon-full-screen" ></i> -->
          <svg class="icon-full-screen" width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" @click="_toggleEnlarge" v-if="!enlarged && !isMostPopular">
            <path d="M96 96H64V85.3333H85.3333V64H96V96Z" fill="black"/>
            <path d="M0 96H32V85.3333H10.6667V64H0V96Z" fill="black"/>
            <path d="M0 0H32V10.6667H10.6667V32H0V0Z" fill="black"/>
            <path d="M96 0H64V10.6667H85.3333V32H96V0Z" fill="black"/>
          </svg>
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" @click="_toggleEnlarge" v-else-if="enlarged && !isMostPopular">
            <path d="M32 32H0V21.3333H21.3333V0H32V32ZM32 64H0V74.6667H21.3333V96H32V64ZM96 64H64V96H74.6667V74.6667H96V64ZM64 32H96V21.3333H74.6667V0H64V32Z" fill="black"/>
          </svg>
      </el-tooltip>
    </div>
    <div class="header-span" v-show="!['commodity', 'cssScreen', 'cstScreen', 'CHMinMax'].includes(type) && (!showReport && !showRelated) && !isMostPopular">
      <template v-for="item in options">
        <span :key="item.label" @click="changeOption(item)" :class="{activated: (checkedType  == item.value), span: true}">{{ item.label }}</span>
      </template>
    </div>
  </div>
  <div class="filter-div" v-show="enlarged && (!showReport && !showRelated && (checkedType !== 'TrendSector'))">
    <el-row>
      <el-col :span="18">
        <el-row>
          <div class="btns">
            <el-button size="small" @click="downloadCSV"><i class="el-icon-download" style="margin-right: 5px"></i>Download CSV</el-button>
            <el-button v-if="isStockTrend && enlarged" size="small" @click="() => addCondition('trend')"><i class="el-icon-refresh" style="margin-right: 5px"></i>Trend Conditions</el-button>
            <el-button v-if="isStockTrend && enlarged" size="small" @click="() => addCondition('relative')"><i class="el-icon-refresh" style="margin-right: 5px"></i>Relative Trend Conditions</el-button>
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
      v-show="checkedType !== 'TrendSector'"
      :ref="refName"
      :data="filterData"
      :item-size="itemSize"
      :class="{'enlargeStockTrend': enlarged && isStockTrend}"
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
          <el-table-column align="center" width="35px" v-if="!showRelated">
            <template slot-scope="scope" v-if="enlarged">
              <el-button-group>
                <el-button v-if="scope.row.favorite === false" size="small" type="text" icon="el-icon-star-off" @click="addRow(scope)" title="Add to favorites" :loading="scope.row.loading"></el-button>
                <el-button v-else-if="scope.row.favorite === true" size="small" type="text" icon="el-icon-star-on" @click="addRow(scope)" title="Remove from favorites" :loading="scope.row.loading"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <template v-for="l in columns">
            <el-table-column
              :key="l.value"
              :prop="l.value"
              show-overflow-tooltip
              :min-width="l.minWidth"
              :max-width="l.maxWidth"
              :width="l.width"
              sortable="custom"
              :align="['chart_name', 'market_symbol'].includes(l.value) ? 'left' : 'center'"
            >
            <template #header>
              <span v-html="`${l.label}${(cssMonthLabel && l.value == 'AvgReturn') ? ` ${cssMonthLabel}` : ''}`"></span>
            </template>
            <template slot-scope="scope">
              <el-button class="chart-name-btn" type="text" v-if="(l.value === 'chart_name' && l.type !== 'SP1500Score') || (l.value === 'market_symbol' && l.type === 'SP1500Score')" size="mini" @click="updateChart(scope.row)">{{ scope.row[l.value] }}</el-button>
              <a v-else-if="l.value === 'title'" :href="`https://sentimentrader.com/blog/${scope.row['blog_url']}`" target="_blank">{{ scope.row[l.value] }}</a>
              <img v-else-if="l.value === 'sentiment'" :src="`https://users.sentimentrader.com/static/img/bull_bear_${scope.row[l.value]}.gif`" :alt="scope.row[l.value]" style="width: 90px;"/>
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
  <div class="dataTables_info" v-show="enlarged && pageLength && (checkedType !== 'TrendSector')">
    {{`Showing 1 to ${pageLength} of ${pageLength} entries`}}
  </div>
  <TrendScoreTable v-if="checkedType === 'TrendSector'" :enlarged="enlarged"></TrendScoreTable>
</div>
</template>

<script>
import VirtualScroll from 'el-table-virtual-scroll'
import ElTableInfiniteScroll from 'el-table-infinite-scroll'
import TrendScoreTable from "./TrendScoreTable";
import { mapGetters, mapActions } from 'vuex'
import { isJson } from '@/utils'
import { getIndicatorsRowData } from "@/service/service";
import Vue from 'vue';
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
    showRelated: Boolean,
    sourceType: String
  },
  directives: {
    ElTableInfiniteScroll
  },
  components: {
    VirtualScroll,
    TrendScoreTable
  },
  inject: ['toggleEnlarge', 'removeIndicatorsFavorites', 'checkedOption', 'enLargeTableFromIndex'],
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
      filterData: [],
      hideColumn: true,
      columnsMap: new Map(),
      condition: '',
      trendUpdateDate: ''
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
      this.columnsMap = new Map(([
        ['stockColumns', 
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
              value: 'last_update',
              minWidth: '90px'
            },
            {
              key: 'sentiment',
              label: 'Sentiment',
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['NASDAQColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '120px'
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
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['SP1500Columns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '140px'
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
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['SP1500ScoreColumns', 
          [
            {
              key: 'market_symbol',
              label: 'Symbol',
              value: 'market_symbol',
              type: 'SP1500Score',
              minWidth: '80px'
            },
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              type: 'SP1500Score',
              minWidth: '100px'
            },
            {
              key: 'trend_last_value',
              label: 'Trend Score',
              value: 'trend_last_value'
            },
            {
              key: 'trend_five_day_score_chg',
              label: '5-Day Score Chg',
              value: 'trend_five_day_score_chg'
            },
            {
              key: 'reltrend_last_value',
              label: 'Relative Score',
              value: 'reltrend_last_value'
            },
            {
              key: 'reltrend_five_day_score_chg',
              label: '5-Day Score Chg',
              value: 'reltrend_five_day_score_chg'
            },
            ]
        ],
        ['bondColumns', 
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
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['ETFSectorColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '70px'
            },
            {
              key: 'underlying_name',
              label: 'Name',
              value: 'underlying_name',
              minWidth: '120px'
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
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['ETFSectorBreadthColumns', 
          [
            {
              key: 'chart_name',
              label: 'Breadth Measure',
              value: 'chart_name',
              minWidth: '180px'
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
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['ETFFundFlowColumns', 
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
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['ETFMonthlyFundColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '170px'
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
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['ETFSharesColumns', 
          [
            {
              key: 'chart_name',
              label: 'Symbol',
              value: 'chart_name',
              minWidth: '130px'
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
              value: 'sentiment',
              minWidth: '100px'
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
              value: 'sentiment',
              minWidth: '100px'
            }
            ]
        ],
        ['BondSeasonalityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name',
              minWidth: '120px'
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
              value: 'sentiment',
              minWidth: '100px'
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
              value: 'sentiment',
              minWidth: '100px'
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
              value: 'sentiment',
              minWidth: '100px'
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
              value: 'sentiment',
              minWidth: '100px'
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
      const columnsMap = this.columnsMap
      let _checkedType = this.checkedType
      const isStockTrend = ['SP1500Score', 'SP500Score', 'NDX100Score', 'DomesticETFScore', 'ForeignETFScore', 'OtherAssetsETFScore'].includes(this.checkedType)
      if(isStockTrend) _checkedType = 'SP1500Score'
      if(isStockTrend && this.condition === 'trend') {
        const saveColumns = ['market_symbol', 'chart_name']
        columnsMap.set('SP1500ScoreColumns', [...columnsMap.get('SP1500ScoreColumns').filter(item => saveColumns.includes(item.key)), ...[
            {
              key: 'trend_last_value',
              label: 'Trend<br/>Score',
              value: 'trend_last_value'
            },    
            {
              key: 'trend_five_day_score_chg',
              label: '5-Day<br/>Score Chg',
              value: 'trend_five_day_score_chg'
            },
            {
              key: 'reltrend_last_value',
              label: 'Relative<br/>Score',
              value: 'reltrend_last_value'
            },
            {
              key: 'reltrend_five_day_score_chg',
              label: '5-Day<br/>Score Chg',
              value: 'reltrend_five_day_score_chg'
            },
           {
              key: 'close_over_ma1',
              label: 'Close ><br/>50-Day Avg',
              value: 'close_over_ma1',
              minWidth: '120px'
            },
            {
              key: 'close_over_ma2',
              label: 'Close ><br/>100-Day Avg',
              value: 'close_over_ma2',
              minWidth: '120px'
            },
            {
              key: 'close_over_ma3',
              label: 'Close ><br/>200-Day Avg',
              value: 'close_over_ma3',
              minWidth: '120px'
            },
            {
              key: 'ma1_over_ma2',
              label: '50-Day Avg ><br/>100-Day Avg',
              value: 'ma1_over_ma2',
              minWidth: '150px'
            },
            {
              key: 'ma1_over_ma3',
              label: '50-Day Avg ><br/>200-Day Avg',
              value: 'ma1_over_ma3',
              minWidth: '150px'
            },
            {
              key: 'ma2_over_ma3',
              label: '100-Day Avg ><br/>200-Day Avg',
              value: 'ma2_over_ma3',
              minWidth: '150px'
            },
            {
              key: 'ma1_over_ma1p',
              label: '50-Day<br/>Avg Rising',
              value: 'ma1_over_ma1p',
              minWidth: '120px'
            },
            {
              key: 'ma2_over_ma2p',
              label: '100-Day<br/>Avg Rising',
              value: 'ma2_over_ma2p',
              minWidth: '120px'
            },
            {
              key: 'ma3_over_ma3p',
              label: '200-Day<br/>Avg Rising',
              value: 'ma3_over_ma3p',
              minWidth: '120px'
            },
            {
              key: 'channel_trend',
              label: '63-Day<br/>Breakout Trend',
              value: 'channel_trend',
              minWidth: '150px'
            }
        ]])
      }
      if(isStockTrend && this.condition === 'relative') {
        const saveColumns = ['market_symbol', 'chart_name']
        columnsMap.set('SP1500ScoreColumns', [...columnsMap.get('SP1500ScoreColumns').filter(item => saveColumns.includes(item.key)), ...[
            {
              key: 'reltrend_last_value',
              label: 'Relative<br/>Score',
              value: 'reltrend_last_value'
            },
            {
              key: 'reltrend_five_day_score_chg',
              label: '5-Day<br/>Score Chg',
              value: 'reltrend_five_day_score_chg'
            },
            {
              key: 'close_over_ma1',
              label: 'Ratio ><br/>50-Day Avg',
              value: 'close_over_ma1',
              minWidth: '120px'
            },
            {
              key: 'close_over_ma2',
              label: 'Ratio ><br/>100-Day Avg',
              value: 'close_over_ma2',
              minWidth: '120px'
            },
            {
              key: 'close_over_ma3',
              label: 'Ratio ><br/>200-Day Avg',
              value: 'close_over_ma3',
              minWidth: '120px'
            },
            {
              key: 'ma1_over_ma2',
              label: '50-Day Avg Ratio ><br/>100-Day Avg Ratio',
              value: 'ma1_over_ma2',
              minWidth: '150px'
            },
            {
              key: 'ma1_over_ma3',
              label: '50-Day Avg Ratio ><br/>200-Day Avg Ratio',
              value: 'ma1_over_ma3',
              minWidth: '150px'
            },
            {
              key: 'ma2_over_ma3',
              label: '100-Day Avg Ratio ><br/>200-Day Avg Ratio',
              value: 'ma2_over_ma3',
              minWidth: '150px'
            },
            {
              key: 'ma1_over_ma1p',
              label: '50-Day Avg<br/>Ratio Rising',
              value: 'ma1_over_ma1p',
              minWidth: '150px'
            },
            {
              key: 'ma2_over_ma2p',
              label: '100-Day Avg<br/>Ratio Rising',
              value: 'ma2_over_ma2p',
              minWidth: '150px'
            },
            {
              key: 'ma3_over_ma3p',
              label: '200-Day Avg<br/>Ratio Rising',
              value: 'ma3_over_ma3p',
              minWidth: '150px'
            },
            {
              key: 'channel_trend',
              label: '63-Day Ratio<br/>Breakout Trend',
              value: 'channel_trend',
              minWidth: '150px'
            }
        ]])
      }
      const columns = columnsMap.get(`${_checkedType}Columns`)
      if(this.checkedType === 'TrendSector') return []
      if(this.type === 'research') {console.log('columns', columnsMap.get(`${this.type}Columns`)); return columnsMap.get(`${this.type}Columns`)}
      if(this.type === 'related' && !this.sourceType.includes('trend_reltrend')) {return columnsMap.get('stockColumns')}
      if(this.type === 'related' && this.sourceType.includes('trend_reltrend')) {return columnsMap.get('stockColumns').filter(l => l.value !== 'sentiment')}
      let simplifiedColumnsKeys = ['chart_name', 'last_value', 'last_change', 'last_update']
      if(isStockTrend) simplifiedColumnsKeys = ['market_symbol', 'chart_name', 'trend_last_value', 'trend_five_day_score_chg']
      if(this.checkedType === 'BondSeasonality' || this.checkedType === 'CommoditySeasonality') simplifiedColumnsKeys = ['chart_name', 'win_rate', 'avg_return', 'last_update']
      if(this.checkedType === 'ETFSeasonality') simplifiedColumnsKeys = ['chart_name', 'win_rate', 'avg_return', 'last_update']
      if(this.checkedType === 'cssScreen' || this.checkedType === 'cstScreen') simplifiedColumnsKeys = ['chart_name', 'name', 'last_value', 'last_update']
      if(this.checkedType === 'CHMinMax') simplifiedColumnsKeys = ['chart_name', 'symbol', 'last_value', 'last_update']
      if(!this.enlarged) return columns.filter(item => simplifiedColumnsKeys.includes(item.key)).map(item=>{
        if(item.key === 'chart_name' && !isStockTrend) item.minWidth = '200px'
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
    },
    isStockTrend() {
      return ['SP1500Score', 'SP500Score', 'NDX100Score', 'DomesticETFScore', 'ForeignETFScore', 'OtherAssetsETFScore'].includes(this.checkedType)
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
        if(Array.isArray(newValue)) this.filterData = newValue
          if(this.isStockTrend && Array.isArray(this.filterData) && this.filterData.length) {
            const trendUpdateDate = this.filterData.reduce((latest, item) => {
            const itemDate = new Date(`${item.last_update}T00:00:00Z`);  // 使用 UTC 时间
            const latestDate = new Date(`${latest.last_update}T00:00:00Z`);
            return itemDate > latestDate ? item : latest;
          })?.last_update
          this.trendUpdateDate = ` (${trendUpdateDate || this.filterData[0]?.last_update})`
        }
      },
      immediate: true,
      depp: true
    }
	},
  methods: {
    ...mapActions('chart', ['update_indicators_favorite', 'fetchIndicatorsPageList']),
    async _toggleEnlarge(checked, row) {
      debugger
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
      if(row.url && !this.type.includes('Seasonality') && ((column.property === 'chart_name' && row.type !== 'trend_reltrend') || (row.type === 'trend_reltrend' && column.property === 'market_symbol'))) {
        let _t = '50%'
        let _l = 0
        let {url} = row
        const hoverElement = event.target
        const container = this.$el.querySelector('.virtual-table')
        console.log('column.realWidth', column.realWidth)
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
      if(row.type === 'stock_nasdaq' || row.type === 'stock_sent' || row.type === 'trend_reltrend') url = url.toLowerCase()
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
    async updateChart(row) {
      if(this.showRelated) {
        await this.clickRelated(row)
        return
      }
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
    async clickRelated(row) {
      debugger
      const {url:searchUrl} = row
        if(searchUrl === 'vol_vix_transform') {
          this.$message({
            message: `<strong>Unable to find the corresponding indicator</strong>`,
            center: true,
            dangerouslyUseHTMLString: true,
            showClose: true,
            duration: 8000,
            customClass: 'no-icon',
            type: 'warning'
          })
          return
        }
        const urlTypes = Array.from(Object.keys(this.indicatorsListData))
        let sourceTable = urlTypes.map(type => {
          const list = isJson(this.indicatorsListData[type]) ? JSON.parse(this.indicatorsListData[type]) : []
            return list.map(item => {
              if(item.url.toLowerCase() === searchUrl.toLowerCase()) return item
            }).filter(item => item !== undefined)
        }).filter(item => item.length > 0).flat()
        if(sourceTable.length) {
          const source_list = sourceTable[0].source_list // 只取第一个匹配到的 Table
          this.enLargeTableFromIndex(source_list, sourceTable[0])
        }else {
          let res = {}
          try {
            const {data:rowData} = await getIndicatorsRowData(searchUrl)
            res = rowData
          } catch (error) {
            if(error?.response?.status === 404) {
              this.$message({
                message: `<strong>Unable to find the corresponding indicator</strong>`,
                center: true,
                dangerouslyUseHTMLString: true,
                showClose: true,
                duration: 8000,
                customClass: 'no-icon',
                type: 'warning'
              })
              return
            }
          }
          const {type, groups} = res
          let requireUrl = ''
          if(type === 'stock_nasdaq') {
            requireUrl = 'ndx_100_complete_list'
          }else if(type === 'stock_sent') {
            requireUrl = 'sp_1500_complete_list'
          }else if(type === 'etf_opt') {
            requireUrl = 'etf_breadth'
          }else if(type === 'etf_fund') {
            requireUrl = 'etf_flow'
          }else if(type === 'mff') {
            requireUrl = 'monthly_fund_flows'
          }else if(type === 'shares') {
            requireUrl = 'shares_outstanding'
          }else if(type === 'etf_seasonality') {
            requireUrl = 'etf_seasonality'
          }else if(type === 'bond_seasonality') {
            requireUrl = 'bond_seasonality'
          }else if(groups === 'commod') {
            requireUrl = 'commodity_complete_list'
          }else if(groups === 'bonds'){
            requireUrl = 'bonds_complete_list'
          }else if(type === 'etf_opt') {
            reportUrl = 'etf_complete_list'
          }else if(type === 'commod_seasonality') {
            url = 'commod_seasonality'
          }else if(groups === 'stocks') {
            requireUrl = 'stock_complete_list'
          }
          if(!requireUrl) return
          await this.fetchIndicatorsPageList(requireUrl)
          const _list = isJson(this.indicatorsListData[requireUrl]) ? JSON.parse(this.indicatorsListData[requireUrl]) : []
          const _sourceList = _list.map(item => {
              if(item.url.toLowerCase() === searchUrl.toLowerCase()) return item
          }).filter(item => item !== undefined).shift()
          console.log('_sourceList', _sourceList)
          // 如果是对象并且对象为空, 说明没有匹配到数据
          if(!_sourceList || (((_sourceList !== null && typeof _sourceList === 'object' && !Array.isArray(_sourceList)) && Object.keys(_sourceList).length === 0))) {
            this.$message({
              message: `<strong>Unable to find the corresponding indicator</strong>`,
              center: true,
              dangerouslyUseHTMLString: true,
              showClose: true,
              duration: 8000,
              customClass: 'no-icon',
              type: 'warning'
            })
            return
          }
          await this.enLargeTableFromIndex(_sourceList.source_list, _sourceList)
        /* 如果匹配不到, 使用下面的规则请求个别表单
        ndx_100_complete_list: type: stock_nasdaq
        sp_1500_complete_list: type: stock_sent
        commodity_complete_list: groups: commod
        etf_breadth: type: etf_opt
        etf_flow: type: etf_fund
        monthly_fund_flows： type: mff
        shares_outstanding: type: shares
        etf_seasonality: type: etf_seasonality
        bond_seasonality: type: bond_seasonality
        */
        // window.location.assign(url);
        }
    },
    async addRow(scope) {
      try {
        if(scope.row.source !== 'Backtest Engine v2.0') {
          this.popUpMsgBox(`This indicator is migrated from user website. Please remove it from <a href="https://users.sentimentrader.com/users/favorites/" target="_blank">your favorites</a>.`)
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
        if (['last_value', 'last_change', 'z_score', 'win_rate', 'avg_return', 'avg_net_return', 'close', 'MA', 'AvgReturn', 'sentiment', 'trend_last_value', 'trend_five_day_score_chg', 'reltrend_last_value', 'reltrend_five_day_score_chg', 'close_over_ma1', 'close_over_ma2', 'close_over_ma3', 'ma1_over_ma2', 'ma1_over_ma3', 'ma2_over_ma3', 'ma1_over_ma1p', 'ma2_over_ma2p', 'ma3_over_ma3p', 'channel_trend'].indexOf(colName) !== -1) {
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
			if(['chart_name','groups','timeframe','url', 'underlying_name', 'name', 'sub_type', 'market_symbol'].indexOf(colName) !== -1){
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
          label: 'S&P 1500 Scores',
          value: 'sp1500',
          type: 'SP1500Score'
        },
        {
          label: 'S&P 500 Scores',
          value: 'spx',
          type: 'SP500Score'
        },
        {
          label: 'NDX 100 Scores',
          value: 'ndx',
          type: 'NDX100Score'
        },
        {
          label: 'Domestic ETF',
          value: 'etf_domestic',
          type: 'DomesticETFScore'
        },
        {
          label: 'Foreign ETF',
          value: 'etf_foreign',
          type: 'ForeignETFScore'
        },
        {
          label: 'Other Assets ETF',
          value: 'etf_other',
          type: 'OtherAssetsETFScore'
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
      let keysSort = ['Optix', 'Symbol', 'Name', 'Breadth Measure', 'Symbol', 'Group', 'Time Frame', 'Value', 'Optix Value', 'Last Value', 'Z-Score', 'Change', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date', 'Optix Date', 'Last Update', '3-Year Max', '3-Year Min', 'Sentiment', 'Trend Score', 'Trend 5-Day Score Change', 'RelTrend Score', 'RelTrend 5-Day Score Change']
      if(type === 'commod_sentiment_seasonality') {const insertIndex = keysSort.findIndex(key => key === 'Avg Return'); if(insertIndex !== -1) keysSort.splice(insertIndex, 0, `Avg Return (%) for ${cssMonthLabel}`)}
      if(type === 'commod_seasonality' || type === 'bond_seasonality' || type === 'etf_seasonality') keysSort = ['Symbol','Name', 'Group', 'Win Rate', 'Avg Return', 'Avg Net Return', 'Date', "Sentiment"]
      let keysMap = new Map([
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
      const isTrendScore = ['sp1500', 'spx', 'ndx', 'etf_domestic', 'etf_foreign', 'etf_other'].includes(type)
      if(isTrendScore) {
        keysMap = new Map([
        ['market_symbol', 'Symbol'],
        ['chart_name', 'Name'],
        ['trend_last_value', 'Trend Score'],
        ['trend_five_day_score_chg', '5-Day Score Chg'],
        ['reltrend_last_value', 'Relative Score']
        ['reltrend_five_day_score_chg', '5-Day Score Chg']
      ])
      if(this.condition === 'trend') {
        const resetKeys = [
            {
              key: 'close_over_ma1',
              label: 'Close > 50-Day Avg'
            },
            {
              key: 'close_over_ma2',
              label: 'Close > 100-Day Avg'
            },
            {
              key: 'close_over_ma3',
              label: 'Close > 200-Day Avg'
            },
            {
              key: 'ma1_over_ma2',
              label: '50-Day Avg > 100-Day Avg'
            },
            {
              key: 'ma1_over_ma3',
              label: '50-Day Avg > 200-Day Avg'
            },
            {
              key: 'ma2_over_ma3',
              label: '100-Day Avg > 200-Day Avg'
            },
            {
              key: 'ma1_over_ma1p',
              label: '50-Day Avg Rising'
            },
            {
              key: 'ma2_over_ma2p',
              label: '100-Day Avg Rising'
            },
            {
              key: 'ma3_over_ma3p',
              label: '200-Day Avg Rising'
            },
            {
              key: 'channel_trend',
              label: '63-Day Breakout Trend'
            }
        ]
        resetKeys.forEach(item => {
          keysMap.set(item.key, item.label)
        })
      }else if(this.condition === 'relative') {
        keysMap.delete('trend_last_value')
        keysMap.delete('trend_five_day_score_chg')
        const resetKeys = [
            {
              key: 'close_over_ma1',
              label: 'Ratio > 50-Day Avg'
            },
            {
              key: 'close_over_ma2',
              label: 'Ratio > 100-Day Avg'
            },
            {
              key: 'close_over_ma3',
              label: 'Ratio > 200-Day Avg'
            },
            {
              key: 'ma1_over_ma2',
              label: '50-Day Avg Ratio > 100-Day Avg Ratio'
            },
            {
              key: 'ma1_over_ma3',
              label: '50-Day Avg Ratio > 200-Day Avg Ratio'
            },
            {
              key: 'ma2_over_ma3',
              label: '100-Day Avg Ratio > 200-Day Avg Ratio'
            },
            {
              key: 'ma1_over_ma1p',
              label: '50-Day Avg Ratio Rising'
            },
            {
              key: 'ma2_over_ma2p',
              label: '100-Day Avg Ratio Rising'
            },
            {
              key: 'ma3_over_ma3p',
              label: '200-Day Avg Ratio Rising'
            },
            {
              key: 'channel_trend',
              label: '63-Day Ratio Breakout Trend'
            }
        ]
        resetKeys.forEach(item => {
          keysMap.set(item.key, item.label)
        })
      }
      keysSort = Array.from(keysMap.values())
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
      if (this.groupsFilter) {
        return searchResult
        .filter(item=>(((item["groups"] && item["groups"].toLowerCase()) == this.groupsFilter.toLowerCase()) || ((item["sub_type"] && item["sub_type"].toLowerCase()) == this.groupsFilter.toLowerCase()) ||  ((item["underlying_name"] && item["underlying_name"].toLowerCase()) == this.groupsFilter.toLowerCase())))
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
    async addCondition(type) {
      // this.condition = type
      debugger
      if(this.condition !== type) {this.condition = type}
      else if(this.condition === type && this.condition !== '') {this.condition = ''}
      console.log('this.condition', this.condition)
      // .el-table--scrollable-x .el-table__body-wrapper
      const urlMap = {
        stock: 'stock_complete_list',
        NASDAQ: 'ndx_100_complete_list',
        SP1500: 'sp_1500_complete_list',
        SP1500Score: 'sp1500',
        SP500Score: 'spx',
        NDX100Score: 'ndx',
        DomesticETFScore: 'etf_domestic',
        ForeignETFScore: 'etf_foreign',
        OtherAssetsETFScore: 'etf_other',
        bond: 'bond_complete_list',
        BondSeasonality: 'bond_seasonality',
        CommoditySeasonality: 'commod_seasonality',
        ETFSeasonality: 'etf_seasonality',
        ETFSector: 'etf_complete_list',
        ETFSectorBreadth: 'etf_breadth',
        ETFFundFlow: 'etf_flow',
        ETFMonthlyFund: 'monthly_fund_flows',
        ETFShares: 'shares_outstanding',
        popular: 'most_popular',
        commodity: 'commodity_complete_list',
        cssScreen: 'commod_sentiment_seasonality',
        cstScreen: 'commod_optix_trend',
        CHMinMax: 'cot_max_min'
      }
      let url = urlMap[this.checkedType]
      if(this.condition === 'relative') url = `${url}&rel_trend=1`
      debugger
      this.$store.commit('chart/SET_INDICATORS_PAGE_LIST_DATA', {url, data: ''})
      await this.$nextTick(async () => {
        this.$emit('forceUpdateTable', this.checkedType, this.condition)
      });
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
    height: 575px !important;
  }
  /deep/ .el-table__body-wrapper.is-scrolling-left {
    overflow-x: scroll !important;
  }
  border: 2px solid  #e9e9e9;
  /deep/ .el-button--text {
    color: rgb(31, 119, 180);
  }
  /deep/ .el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: scroll !important;
  }
}
.enlargeStockTrend {
  /deep/ .el-loading-mask {
    height: 700px !important;
  }
  /deep/ .el-table {
    overflow: visible !important;
  }
  /deep/ .el-table__body-wrapper {
    height: 575px !important;
    width: 100% !important; /* 确保宽度占满父容器 */
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
      width: 20px;
      height: 20px;
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
    text-align: center;
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
  margin-top: 24px;
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