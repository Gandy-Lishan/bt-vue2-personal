<template>
  <div class="outsideTable">
    <VirtualScrollTable
        v-bind="$attrs"
        v-on="$listeners"
        :refName="tableInfo['refName']"
        :itemSize="tableInfo['itemSize']"
        :options="tableInfo['options']"
        :type="tableInfo['type']"
        :label="tableInfo['label']"
        :tableData="tableData"
        :isOver="isOver"
        :loading="loading"
        :firstRow="firstRow"
        @loadMore="loadMore"
        >
    </VirtualScrollTable>
  </div>
</template>

<script>
import VirtualScrollTable from "./VirtualScrollTable"
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    tableInfo: Object,
    selectedTitle: String
  },
  name: 'Table',
  data() {
    return {
      tableData: [],
      page: 0,
      isOver: {
      },
      loading: false,
      optionsChecked: '', // 默认值
      urlMap:{
        stock: 'stock_complete_list',
        NASDAQ: 'ndx_100_complete_list',
        SP1500: 'sp_1500_complete_list',
        bond: 'bond_complete_list',
        // commodity: 'commodity_complete_list',
        BondSeasonality: 'bond_seasonality',
        CommoditySeasonality: 'commod_seasonality',
        ETFSeasonality: 'etf_seasonality',
        ETFSector: 'etf_complete_list',
        ETFSectorBreadth: 'etf_breadth',
        ETFFundFlow: 'etf_flow',
        ETFMonthlyFund: 'monthly_fund_flows',
        ETFShares: 'shares_outstanding'
      },
      firstRow: {}
    }
  },
  components: {
    VirtualScrollTable,
  },
  computed: {
    ...mapGetters(['getIndicatorsPageListData']),
    indicatorsListData() {
      return this.getIndicatorsPageListData
    },
    columns() {
      const columnsMap = new Map(([
        ['stockColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name'
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
              value: 'chart_name'
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
              value: 'chart_name'
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
        ['commodityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
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
        ['ETFSectorColumns', 
          [
            {
              key: 'url',
              label: 'Symbol',
              value: 'url'
            },
            {
              key: 'chart_name',
              label: 'Name',
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
        ['ETFSectorBreadthColumns', 
          [
            {
              key: 'breadth_measure',
              label: 'Breadth Measure',
              value: 'breadth_measure'
            },
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name'
            },
            {
              key: 'group',
              label: 'Group',
              value: 'group'
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
        ['ETFFoundFlowColumns', 
          [
            {
              key: 'url',
              label: 'Symbol',
              value: 'url'
            },
            {
              key: 'chart_name',
              label: 'Name',
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
        ['ETFMonthlyFundFlowColumns', 
          [
            {
              key: 'url',
              label: 'Symbol',
              value: 'url'
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
              key: 'url',
              label: 'Symbol',
              value: 'url'
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
        ['bondSeasonalityColumns', 
          [
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name'
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
        ['commoditySeasonalityColumns', 
          [
            {
              key: 'url',
              label: 'Symbol',
              value: 'url'
            },
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name'
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
              key: 'breadth_measure',
              label: 'Breadth Measure',
              value: 'breadth_measure'
            },
            {
              key: 'chart_name',
              label: 'Name',
              value: 'chart_name'
            },
            {
              
              key: 'time_frame',
              label: 'Time Frame',
              value: 'time_frame'
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
      return columnsMap.get(`${this.tableInfo['type']}Columns`)
    }
  },
  watch: {
    selectedTitle: {
      handler (title) {
        if(title === 'Popular') this.$emit('updateChart', this.firstRow)
      },
    }
  },
  async mounted() {
    await this.loadMore(this.tableInfo['type'])
  },
  methods: {
    // async loadMore (type, resetPage) {
    //   this.optionsChecked = type
    //   if(resetPage) {this['isOver'][this.optionsChecked] = false;this.tableData = []; this.page = 0}
    //   if(this.tableData.length === 0) this.loading = true
    //   if(this['isOver'][this.optionsChecked]) {this.loading = false; return}
    //   let _results
    //   try {
    //     const {data: {results}} = await obtainIndicatorsList(this.urlMap[this.optionsChecked], ++this.page)
    //     console.log(this.urlMap[this.optionsChecked], results)
    //     _results = results
    //   } catch (error) {
    //     console.log('error', error)
    //     _results = []
    //     this['isOver'][this.optionsChecked] = true
    //   }
    //   this.tableData = [...this.tableData, ..._results]
    //   console.log('this.tableData', this.tableData)
    //   this.loading = false
    // },
    ...mapActions('states', ['fetchIndicatorsPageList']),
    async loadMore (type) {
      debugger
      this.optionsChecked = type
      if(this.tableData.length === 0) this.loading = true
      let _results
      try {
        const key = this.urlMap[this.optionsChecked]
        await this.fetchIndicatorsPageList(key)
        _results = this.indicatorsListData[key]
      } catch (error) {
        console.log('error', error)
        _results = []
       this.loading = false
      }
      debugger
      this.tableData = [..._results]
      this.firstRow = this.tableData[0] || {}
      this.loading = false
    },
  }

}
</script>

<style lang="less" scoped>
.outsideTable {
  margin-bottom: 10px;
}
</style>