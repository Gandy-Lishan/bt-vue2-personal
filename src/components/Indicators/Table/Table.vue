<template>
  <div class="outsideTable">
    <div class="post-title" v-if="showReport">
      <h3 style="font-size: 23px; font-weight: 300; margin: 10px 0;">This chart has been mentioned in {{ blog_results_length }} blog post(s). The
      posts are listed below.</h3>
    </div>
    <VirtualScrollTable
        v-bind="$attrs"
        v-on="$listeners"
        ref="virtualScroll"
        :refName="tableInfo['refName']"
        :itemSize="tableInfo['itemSize']"
        :options="tableInfo['options']"
        :type="tableInfo['type']"
        :sourceType="type"
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
        @showDetails="$emit('showDetails', row, isShowDetails, checkedType)"
        @forceUpdateTable="$emit('_forceUpdateTable', type, condition)"
        >
    </VirtualScrollTable>
  </div>
</template>

<script>
import VirtualScrollTable from "./VirtualScrollTable"
import { mapActions, mapGetters } from 'vuex'
import { isJson, capitalizeFirstLetter, unifyNumber } from '@/utils'

export default {
  props: {
    tableInfo: Object,
    selectedTitle: String,
    blog_results: Array,
    related: Array,
    selectedTitle: String,
    isShowDetails: [Boolean, Object],
    type: String
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
        SP1500Score: 'sp1500',
        SP500Score: 'spx',
        NDX100Score: 'ndx',
        equityETFScore: 'etf',
        TrendSector: 'sector_trend_score',
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
        if(title === 'Popular' && !this.isShowDetails) this.$emit('updateChart', this.firstRow)
      },
    },
    blog_results: {
      handler (arr) {
        if(Array.isArray(arr)) this.showReport = true
        if(Array.isArray(arr)) {
            console.log('blog_results', arr)
            this.loading = true
            this.blog_results_length = arr.length
            this.tableData = arr.map((item, index) => {
              const dateStr = item.post_date
              let formattedDate = ''
              if (dateStr) {
                const dateObj = new Date(dateStr);
  
                if (!isNaN(dateObj)) {
                    const options = { year: 'numeric', month: 'long', day: '2-digit' };
                    formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
                } else {
                    console.log("Invalid date format");
                }
              } else {
                  console.log("Date is null or undefined");
              }
              return {
                ...item,
                blog_url: item.url,
                post_date: formattedDate,
                url: `${item.title}_${index}`
              }
            })
            const _this = this
            _this.$nextTick(() => {
              _this.loading = false
            })
            console.log('this.tableData ', this.tableData )
        }
      }
    },
    related: {
      handler (arr) {
        if(Array.isArray(arr)) this.showRelated = true
        if(Array.isArray(arr)) {
          this.loading = true
          const uniqueData = Array.from(
            arr.reduce((map, item) => {
              if (!map.has(item.url)) {
                map.set(item.url, item);
              }
              return map;
            }, new Map()).values()
          )
          this.tableData = uniqueData.map(obj => {
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
                trend_reltrend: 'Trend RelTrend',
                sp1500_trend_reltrend: 'Trend RelTrend',
                spx_trend_reltrend: 'Trend RelTrend',
                ndx_trend_reltrend: 'Trend RelTrend',
                etf_trend_reltrend: 'Trend RelTrend'
              }
              if(key === 'sub_type') obj[key] = capitalizeFirstLetter(subTypeMapping[obj[key]] || obj[key])
              if(['last_value', 'last_change'].includes(key)) {
                // 保留特定小数点
                if(['last_value', 'last_change'].includes(key)) obj[key] = unifyNumber(obj[key], 4)
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
              if((key === 'last_value' || key === 'last_change') && (subType === 'stock' || subType === 'Stock')){
                if(obj[key] !== '' && obj[key] !== null && obj[key] !== 'null') obj[key] =  `${obj[key]}%`
                // 加 %
              }
            }
          }
          return obj
        })
        console.log('this.tableData', this.tableData)
        const _this = this
        _this.$nextTick(() => {
          _this.loading = false
        })
        }
      }
    }
  },
  async mounted() {
    await this.loadMore(this.tableInfo['type'])
  },
  methods: {
    ...mapActions('chart', ['fetchIndicatorsPageList']),
    async loadMore (type, isUpdateChart, condition) {
      this.optionsChecked = type
      this.loading = true
      let _results
      try {
        let url = this.urlMap[this.optionsChecked]
        if(!url || url === 'sector_trend_score') {this.loading = false;return}
        const isTrendScore = ['SP1500Score', 'SP500Score', 'NDX100Score', 'equityETFScore'].includes(type)
        if(condition === 'relative' && isTrendScore) url = `${url}&rel_trend=1`
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
      if(this.$refs['virtualScroll'].enlarged) {
        await this.$refs['virtualScroll']._toggleEnlarge()
      }
    },
  }

}
</script>

<style lang="less" scoped>
.outsideTable {
  margin-bottom: 5px;
}
</style>