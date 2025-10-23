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
        :showConstituentConditions="showConstituentConditions"
        :subTypeOptions="subTypeOptions"
        :breadthIndicatorsOption="breadthIndicatorsOption"
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
import { getUserWatchlistTrend } from '@/service/service'

export default {
  props: {
    tableInfo: Object,
    selectedTitle: String,
    blog_results: Array,
    related: Array,
    constituentConditions: Array,
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
        Russell3000: 'russell_3000_complete_list',
        Russell1000: 'russell_1000_complete_list',
        Russell2000: 'russell_2000_complete_list',
        SP1500Score: 'sp1500',
        SP500Score: 'spx',
        NDX100Score: 'ndx',
        CRPScore: 'crp',
        RussellScore: 'russell',
        WatchList: 'watchlist',
        DomesticETFScore: 'etf_domestic',
        ForeignETFScore: 'etf_foreign',
        OtherAssetsETFScore: 'etf_other',
        TrendSector: 'sector_trend_score',
        bond: 'bond_complete_list',
        BondSeasonality: 'bond_seasonality',
        IndexSeasonality: 'index_seasonality',
        CommoditySeasonality: 'commod_seasonality',
        ETFSeasonality: 'etf_seasonality',
        ETFSector: 'etf_complete_list',
        ETFFundFlow: 'etf_flow',
        ETFMonthlyFund: 'monthly_fund_flows',
        ETFShares: 'shares_outstanding',
        popular: 'most_popular',
        commodity: 'commodity_complete_list',
        CHMinMax: 'cot_max_min',
        cssScreen: 'commod_sentiment_seasonality',
        cstScreen: 'commod_optix_trend',
        CRP: 'crypt_complete_list',
        TSCRP: 'crp',
        RTSCRP: 'crp&rel_trend=1',
        ETFSectorBreadth: 'etf_breadth',
        GlobalIndexBreadth: 'country_breadth',
        CryptoCurrencyBreadth: 'crypto_breadth',
        SectorTrendRelTrend: 'sector_trend_reltrend',
        macroeconomic: 'macro_indicator_list',
        GlobalBreadthOverview: 'country_breadth_overview',
        CCSOverview: 'commod_spotlight',
        ETFSectorOverview: 'sector_spotlight',
        ETFCountryOverview: 'country_spotlight'
      },
      firstRow: {},
      blog_results_length: 0,
      showReport: false,
      showRelated: false,
      showConstituentConditions: false,
      subTypeOptions: [],
      breadthIndicatorsOption: [],
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
        if(this.$route.path.includes('/sector_trend_score') || this.$route.path.includes('/trend_score')) {
          this.showRelated = false
          this.tableData = []
          return
        }
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
                russell_trend_reltrend: 'Trend',
                etf_trend_reltrend: 'Trend',
                etf_domestic_trend_reltrend: 'Domestic ETF Trend',
                etf_foreign_trend_reltrend: 'Foreign ETF Trend',
                etf_other_trend_reltrend: 'Other Assets ETF Trend',
                crp_stock: 'CRP'
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
    },
    constituentConditions: {
      handler (arr) {
        if(Array.isArray(arr)) {
          this.showConstituentConditions = true
          this.tableData = arr.map(obj => {
            for (const key in obj) {
              if (Object.hasOwnProperty.call(obj, key)) {
                if(!isNaN(obj[key])) {
                  obj[key] = unifyNumber(obj[key], 2)
                }else if(key === 'Date') {
                  obj['Date'] = typeof obj['Date'] === 'string' ? obj['Date'].slice(0, 10) : '-'
                }else if(key === 'Symbol') {
                  obj['url'] = obj[key]
                }
              }
            }
            return obj
          })
        }else {
          this.showConstituentConditions = false
          this.tableData = []
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
      debugger
      const isTrendScore = ['SP1500Score', 'SP500Score', 'NDX100Score', 'CRPScore', 'RussellScore', 'DomesticETFScore', 'ForeignETFScore', 'OtherAssetsETFScore', 'TSCRP'].includes(type)
      const indicator = this.$route.query.indicator
      this.optionsChecked = type
      this.loading = true
      let _results
      try {
        let url = this.urlMap[this.optionsChecked]
        if((!url || url === 'sector_trend_score') && url !== 'watchlist') {this.loading = false;return}
        if(condition === 'relative' && isTrendScore) url = `${url}&rel_trend=1`
        if(type === 'SectorTrendRelTrend' && this.$route.query.index) url = `sector_trend_reltrend?index=${this.$route.query.index}${condition === 'relative' ? `&rel_trend=1` : ''}`
        if(url !== 'watchlist') {
          await this.fetchIndicatorsPageList(url)
          _results = isJson(this.indicatorsListData[url]) ? JSON.parse(this.indicatorsListData[url]) : []
        }else if(url === 'watchlist'){
          const res = await getUserWatchlistTrend()
          _results = res.data
          if(!Array.isArray(_results) && _results.code == 404) {
            _results = []
          }
          console.log('watchlist _results', _results)
        }
        if(type === 'GlobalIndexBreadth') {
          if(Array.isArray(_results) && _results.length !== 0) {
            const results = Array.from(new Set([..._results.map(item => (item.sub_type))]))
            this.subTypeOptions = [{value: '', label: '----'},...results.map(item => ({value: item, label: item}))]
          }
        }else this.subTypeOptions = []
        if(type === 'GlobalIndexBreadth' || type === 'CryptoCurrencyBreadth') {
          if(Array.isArray(_results) && _results.length !== 0) {
            const chartNames = Array.from(new Set([..._results.map(item => (item.chart_name))]))
            const subTypes = Array.from(new Set([..._results.map(item => (item.sub_type))]))
            this.breadthIndicatorsOption = this.extractFilters(chartNames, subTypes)
          }
        }else this.breadthIndicatorsOption = []
          console.log(url, _results)
      } catch (error) {
        console.log('error', error)
        _results = []
      }
      this.tableData = [..._results]
      this.firstRow = this.tableData[0] || {}
      if(isUpdateChart || (isTrendScore && !indicator && (condition !== 'related' && condition !== 'constituent_conditions')) || (this.$route.fullPath.includes('?enlarge=stock') && this.tableInfo.refName === 'stockVirtualScroll') || (this.$route.fullPath.includes('sector_trend_score') && this.tableInfo.refName === 'SectorTrendRelTrendVirtualScroll')) this.$emit('updateChart', this.firstRow)
      if(this.selectedTitle === 'Popular' && !this.isShowDetails) this.$emit('updateChart', this.firstRow)
      this.loading = false
    if(this.$route.fullPath.includes('sector_trend_score') && this.$route.query.index && this.tableInfo.refName === 'SectorTrendRelTrendVirtualScroll') {
      this.$nextTick(() => {
        this.$refs['virtualScroll'].changeTableSort(
          {
            order: 'ascending',
            prop: 'trend_last_value'
          }
        )
      })
    }
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
    extractFilters(chartNames, subTypes) {
      let filters = new Set();

      chartNames.forEach(name => {
          // 移除开头的 "% Of " 和 sub_type 相关的部分
          let cleanedName = name.replace(/^% Of (All Countries|Asia Pacific|Developed Markets|Emerging Markets|Europe|South America|Cryptocurrencies) /, '').trim();
          filters.add(cleanedName);
      });

      return [{ value: '', label: '----' },...Array.from(filters).sort().map(item => ({value: item, label: item}))] // 转换为数组并排序
    }
  }

}
</script>

<style lang="less" scoped>
.outsideTable {
  margin-bottom: 5px;
}
</style>