<template>
  <div class="outsideTable">
    <div class="post-title" v-if="showReport">
      <h3 style="font-size: 23px; font-weight: 300;">This chart has been mentioned in {{ blog_results_length }} blog post(s). The
      posts are listed below.</h3>
    <hr style="border-top: 1px solid #eee; margin: 20px 0">
    </div>
    <VirtualScrollTable
        v-bind="$attrs"
        v-on="$listeners"
        ref="virtualScroll"
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
        :showReport="showReport"
        :showRelated="showRelated"
        @loadMore="loadMore"
        @updateChart="$emit('updateChart', row)"
        @showDetails="$emit('showDetails', row, isShowDetails)"
        >
    </VirtualScrollTable>
  </div>
</template>

<script>
import VirtualScrollTable from "./VirtualScrollTable"
import { mapActions, mapGetters } from 'vuex'
import { isJson, capitalizeFirstLetter, unifyNumber, timestampToTime } from '@/utils'

export default {
  props: {
    tableInfo: Object,
    selectedTitle: String,
    blog_results: Array,
    related: Array
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
      firstRow: {},
      blog_results_length: 0,
      showReport: false,
      showRelated: false
    }
  },
  components: {
    VirtualScrollTable,
  },
  computed: {
    ...mapGetters({
      indicatorsListData: 'getIndicatorsPageListData',
      favoritesBtv1List: 'getFavoriteIndicatorListBtv1',
      favoritesBtv2List: 'getFavoriteIndicatorList'
    })
  },
  watch: {
    selectedTitle: {
      handler (title) {
        if(title === 'Popular') this.$emit('updateChart', this.firstRow)
      },
    },
    blog_results: {
      handler (arr) {
        if(Array.isArray(arr) && arr.length > 0) {
            console.log('blog_results', arr)
            this.showReport = true
            this.blog_results_length = arr.length
            this.tableData = arr.map((item, index) => {
              const dateStr = item.publish_date
              const formattedDate = dateStr ? new Date(dateStr.replace(' ', 'T')).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
              return {
                ...item,
                publish_date: formattedDate,
                url: `${item.title}_${index}`
              }
            })
        }
      }
    },
    related: {
      handler (arr) {
        console.log('related', arr)
        if(Array.isArray(arr) && arr.length > 0) {
          this.tableData = arr.map(obj => {
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
                models: 'Model',
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
              if((key === 'last_value' || key === 'last_change') && (subType === 'stock' || subType === 'Stock')){
                if(obj[key] !== '' && obj[key] !== null && obj[key] !== 'null') obj[key] =  `${obj[key]}%`
                // 加 %
              }
            }
          }
          return obj
      })
          this.showRelated = true
        }
      }
    }
  },
  async mounted() {
    await this.loadMore(this.tableInfo['type'])
  },
  methods: {
    ...mapActions('chart', ['fetchIndicatorsPageList']),
    async loadMore (type, isUpdateChart) {
      this.optionsChecked = type
      this.loading = true
      let _results
      try {
        const url = this.urlMap[this.optionsChecked]
        if(!url) {this.loading = false;return}
        await this.fetchIndicatorsPageList(url)
        _results = isJson(this.indicatorsListData[url]) ? JSON.parse(this.indicatorsListData[url]) : []
          console.log(url, _results)
      } catch (error) {
        console.log('error', error)
        _results = []
      }
      this.tableData = [..._results]
      this.firstRow = this.tableData[0] || {}
      if(isUpdateChart) this.$emit('updateChart', this.firstRow)
      this.loading = false
    },
    async enLargeTable(checked, row) {
      await this.$refs['virtualScroll']._toggleEnlarge(checked, row)
    },
    async clearEnlarge() {
      console.log("this.$refs['virtualScroll']", this.$refs['virtualScroll'].enlarged)
      this.$refs['virtualScroll'].clearHighlightValue()
      if(this.$refs['virtualScroll'].enlarged) {
        await this.$refs['virtualScroll']._toggleEnlarge()
      }
    }
  }

}
</script>

<style lang="less" scoped>
.outsideTable {
  margin-bottom: 5px;
}
</style>