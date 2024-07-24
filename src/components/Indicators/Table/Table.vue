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
        :cssMonthLabel="cssMonthLabel"
        @loadMore="loadMore"
        >
    </VirtualScrollTable>
  </div>
</template>

<script>
import VirtualScrollTable from "./VirtualScrollTable"
import { mapActions, mapGetters } from 'vuex'
import { capitalizeFirstLetter, isJson, unifyNumber, timestampToTime } from "@/utils"
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
      cssMonthLabel: '',
      urlMap:{
        stock: 'stock_complete_list',
        NASDAQ: 'ndx_100_complete_list',
        SP1500: 'sp_1500_complete_list',
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
      },
      firstRow: {}
    }
  },
  components: {
    VirtualScrollTable,
  },
  computed: {
    ...mapGetters(['getIndicatorsPageListData', 'getFavoriteIndicatorListBtv1', 'getFavoriteIndicatorList']),
    indicatorsListData() {
      return this.getIndicatorsPageListData
    },
    favoritesBtv1List() {
				return this.getFavoriteIndicatorListBtv1
		},
		favoritesBtv2List() {
				return this.getFavoriteIndicatorList
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
    ...mapActions('states', ['fetchIndicatorsPageList']),
    async loadMore (type) {
      this.optionsChecked = type
      if(this.tableData.length === 0) this.loading = true
      let _results
      try {
        const url = this.urlMap[this.optionsChecked]
        await this.fetchIndicatorsPageList(url)
        _results = this.indicatorsListData[url]
        if(url === 'commod_sentiment_seasonality') {
          const {month, screen_data} = _results
          this.cssMonthLabel = `for ${month}`
          _results = isJson(screen_data) ? JSON.parse(screen_data) : []
        }
        if(!this.favoritesBtv1List) await this.$store.dispatch('chart/get_myindicator')
        if(!this.favoritesBtv2List.length) await this.$store.dispatch('chart/get_favorite')
        console.log('commod_sentiment_seasonality', _results)
          _results = _results.map(obj => {
            for (const key in obj) {
              if (Object.hasOwnProperty.call(obj, key)) {
                if(key === 'timeframe') {
                  if(['Short to Intermediate', 'Intermediate to Long', 'Intermediate', 'Medium-Term'].includes(obj[key])){obj[key] = 'Medium'}
                  else if(['Short', 'Short-Term'].includes(obj[key])){obj[key] = 'Short'}
                  else if(['Long', 'Long-Term'].includes(obj[key])){obj[key] = 'Long'}
                }else if((key === 'groups' || key === 'sub_type') && ['stock_complete_list', 'etf_complete_list', 'bond_complete_list', 'etf_breadth', 'etf_flow', 'monthly_fund_flows', 'shares_outstanding', 'bond_seasonality', 'commod_seasonality', 'etf_seasonality', 'most_popular', 'commodity_complete_list', 'commod_sentiment_seasonality', 'commod_optix_trend', 'cot_max_min'].includes(url)) {
                  // 大写首字母
                  obj[key] = capitalizeFirstLetter(obj[key])
                }
                if(['last_value', 'last_change', 'win_rate', 'avg_return', 'z_score', 'avg_net_return', 'AvgReturn'].includes(key)) {
                  // 保留特定小数点
                  if(['last_value', 'last_change'].includes(key)){obj[key] = unifyNumber(obj[key], 4)}
                  else if(key === 'z_score'){obj[key] = obj[key] = unifyNumber(obj[key], 1)}
                  else if(key === 'win_rate' || key === 'avg_net_return' || key === 'AvgReturn'){obj[key] = obj[key] = unifyNumber(obj[key], 2)}
                  else if(key === 'avg_return'){obj[key] = obj[key] = unifyNumber(obj[key], 3)}
                }
                if(key === 'last_update' && (url === 'most_popular' || url === 'commod_sentiment_seasonality' || url === 'commod_optix_trend' || url === 'cot_max_min')) obj[key] = timestampToTime(obj[key])
                if(key === 'chart_url' && (url === 'commod_sentiment_seasonality' || url === 'commod_optix_trend' || url === 'cot_max_min')) obj['url'] = obj[key]
                const isInBtv1List = this.favoritesBtv1List.data.data.find(item => (item.url[0] === obj['url']))
                const isInBtv2List = this.favoritesBtv2List.find(item => (item.url === obj['url']))
                if((key === 'url') && isInBtv1List) {
                  obj['source'] = 'Backtest Engine v1.0'
                  obj['favorite'] = true
                }else if((key === 'url') && isInBtv2List) {
                  obj['source'] = 'Backtest Engine v2.0'
                  obj['favorite'] = true
                }else if((key === 'url') && isInBtv2List && isInBtv1List) {
                  obj['source'] = 'Backtest Engine v1.0 & v2.0'
                  obj['favorite'] = true
                }else if((key === 'url') && !isInBtv1List && !isInBtv2List) {
                  obj['source'] = 'Backtest Engine v2.0'
                  obj['favorite'] = false
                }
                // 加按钮 loading
                obj['loading'] = false

                if(
                  ((key === 'last_value' || key === 'last_change') && url === 'stock_complete_list')
                  || (key === 'win_rate' && ['bond_seasonality', 'commod_seasonality', 'etf_seasonality'].includes(url))
                  || (key === 'avg_return' && ['bond_seasonality', 'commod_seasonality', 'etf_seasonality'].includes(url))
                  || (key === 'avg_net_return' && url === 'etf_seasonality'
                  || (key === 'AvgReturn' && url === 'commod_sentiment_seasonality')
                  )
                ){
                  if(obj[key] !== '' && obj[key] !== null && obj[key] !== 'null') obj[key] =  `${obj[key]}%`
                  // 加 %
                }else if((key === 'url' && ['ndx_100_complete_list', 'sp_1500_complete_list', 'cot_max_min'].includes(url))) {
                  // 全部大写
                  obj[key] = obj[key].toUpperCase()
                }
              }
            }
            return obj
          })
          console.log(_results)
      } catch (error) {
        console.log('error', error)
        _results = []
       this.loading = false
      }
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