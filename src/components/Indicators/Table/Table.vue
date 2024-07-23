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
import { capitalizeFirstLetter, unifyNumber } from "@/utils"
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
      this.optionsChecked = type
      if(this.tableData.length === 0) this.loading = true
      let _results
      try {
        const url = this.urlMap[this.optionsChecked]
        await this.fetchIndicatorsPageList(url)
        _results = this.indicatorsListData[url]
          _results = _results.map(obj => {
            for (const key in obj) {
              if (Object.hasOwnProperty.call(obj, key)) {
                if(key === 'timeframe') {
                  if(['Short to Intermediate', 'Intermediate to Long', 'Intermediate', 'Medium-Term'].includes(obj[key])){obj[key] = 'Medium'}
                  else if(['Short', 'Short-Term'].includes(obj[key])){obj[key] = 'Short'}
                  else if(['Long', 'Long-Term'].includes(obj[key])){obj[key] = 'Long'}
                }else if((key === 'groups' || key === 'sub_type') && ['stock_complete_list', 'etf_complete_list', 'etf_breadth', 'etf_flow', 'monthly_fund_flows', 'shares_outstanding', 'bond_seasonality', 'commod_seasonality', 'etf_seasonality'].includes(url)) {
                  // 大写首字母
                  obj[key] = capitalizeFirstLetter(obj[key])
                }
                if(['last_value', 'last_change', 'win_rate', 'avg_return', 'z_score', 'avg_net_return'].includes(key)) {
                  // 保留特定小数点
                  if(['last_value', 'last_change'].includes(key)){obj[key] = unifyNumber(obj[key], 4)}
                  else if(key === 'z_score'){obj[key] = obj[key] = unifyNumber(obj[key], 1)}
                  else if(key === 'win_rate' || key === 'avg_net_return'){obj[key] = obj[key] = unifyNumber(obj[key], 2)}
                  else if(key === 'avg_return'){obj[key] = obj[key] = unifyNumber(obj[key], 3)}
                }
                if(key === 'url' && obj['url'] === 'survey_aaii_bears') debugger
                const isInBtv1List = this.favoritesBtv1List.data.data.find(item => item.url[0] === obj['url'])
                const isInBtv2List = this.favoritesBtv2List.find(item => item.url === obj['url'])
                if(key === 'url' && isInBtv1List) {
                  obj['source'] = 'Backtest Engine v1.0'
                  obj['favorite'] = true
                }else if(key === 'url' && isInBtv2List) {
                  obj['source'] = 'Backtest Engine v2.0'
                  obj['favorite'] = true
                }else if(key === 'url' && isInBtv2List && isInBtv1List) {
                  obj['source'] = 'Backtest Engine v1.0 & v2.0'
                  obj['favorite'] = true
                }else if(key === 'url' && !isInBtv1List && !isInBtv2List) {
                  obj['source'] = 'Backtest Engine v2.0'
                  obj['favorite'] = false
                }
                // 加按钮 loading
                obj['loading'] = false

                if(
                  ((key === 'last_value' || key === 'last_change') && url === 'stock_complete_list')
                  || (key === 'win_rate' && ['bond_seasonality', 'commod_seasonality'].includes(url))
                  || (key === 'avg_return' && ['bond_seasonality', 'commod_seasonality', 'etf_seasonality'].includes(url))
                  || (key === 'avg_net_return' && url === 'etf_seasonality')
                ){
                  if(obj[key] !== '' && obj[key] !== null && obj[key] !== 'null') obj[key] =  `${obj[key]}%`
                  // 加 %
                }else if((key === 'url' && ['ndx_100_complete_list', 'sp_1500_complete_list'].includes(url))) {
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