<template>
	<div class="StrategiesContent">
		<div class="tagBox">
			<el-tag
				v-for="tag in tags"
				:key="tag.label"
				:type="tag.type"
				@click="highlightTag(tag)"
				:class="{ 'highlighted-tag': tag.value === highlightedTag }"
				effect="plain"
			>
				{{ tag.label }}
			</el-tag>
		</div>
		<div class="strategiesTable">
			<el-table
				ref="Table"
				class="ScannerBTTable"
				header-align="center"
				:data="paginatedData"
				empty-text="No data"
				v-loading="loading"
				@sort-change="onSortChange"
				size="small"
				style="width: 100%; height: 100%; margin: 0 auto"
				stripe
			>
				<el-table-column prop="isRight" width="50px">
					<template slot="header" slot-scope="scope">
						<div>
							<el-checkbox
								v-model="selection"
								:indeterminate="isIndeterminate"
								@click.prevent.stop.native="
									handleSelectedFn('selection', 'isIndeterminate', scope)
								"
							>
							</el-checkbox>
						</div>
					</template>
					<template slot-scope="scope">
						<div>
							<el-checkbox
								v-model="scope.row.selection"
								@click.prevent.stop.native="
									handleListSelectedFn('selection', 'isIndeterminate', scope)
								"
							>
							</el-checkbox>
						</div>
					</template>
				</el-table-column>
				<template v-for="l in tableCol">
					<el-table-column
						align="center"
						:label="l.label"
						:prop="l.value"
						:key="l.key"
						show-overflow-tooltip
						:width="l.width"
						v-if="
							[
								'model_name',
								'current_state',
								'date',
								'update_frequency',
								'return'
							].includes(l.value)
						"
						:sortable="
							[
								'model_name',
								'current_state',
								'date',
								'update_frequency',
								'return'
							].includes(l.value)
								? 'custom'
								: false
						"
					>
						<template slot-scope="scope">
							<span class="tableText" v-if="l.value === 'name'">
								<el-button type="text">{{ scope.row[l.value] }}</el-button>
							</span>
							<span class="tableText" v-else>
								{{ scope.row[l.value] }}
							</span>
						</template>
					</el-table-column>
					<el-table-column
						align="center"
						:label="l.label"
						:key="l.key"
						show-overflow-tooltip
						:width="l.width"
						v-if="['btn'].includes(l.value)"
					>
						<template slot-scope="scope">
							<el-button
								round
								size="mini"
								type="primary"
								icon="el-icon-right"
								@click="handleRowClick(scope.row)"
							></el-button>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:page-sizes="[10, 30, 50, 100, 200]"
				:page-size="pageSize"
				:current-page="currentPage"
				:total="immutableTableData.length"
				layout="total, sizes, prev, pager, next, jumper"
			></el-pagination>
		</div>
	</div>
</template>

<script>
import { getStrategyList } from '@/service/service'
import { isJson } from "@/utils"
export default {
  name: 'StrategiesTable',
  data() {
    return {
      tags: [
        { type: 'info', label: 'All', value: 'All' },
        { type: 'info', label: 'Legacy Index', value: 'Legacy'},
        { type: 'info', label: 'Index', value: 'Index' },
        { type: 'info', label: 'Bond', value: 'Bond' },
        { type: 'info', label: 'Factors', value: 'Factors' },
        { type: 'info', label: 'Sector', value: 'Sector' }
      ],
      highlightedTag: 'All',
      loading: false,
      pageSize: 10, // Default page size
      currentPage: 1, // Default current page
      total: 0,
      searchKey: '',
      tableCol: [
        {
          label: 'Model Name',
          value: 'model_name',
          key: 'model_name'
        },
        {
          label: 'Current Signal: (e.g., Long, Sell, etc)',
          value: 'current_state',

          key: 'current_state'
        },
        {
          label: 'Last Signal Date: (last change in Signal)',
          value: 'date',
          key: 'date'
        },
        {
          label: 'Model Update Frequency',
          value: 'update_frequency',
          key: 'update_frequency'
        },
        {
          label: 'YTD until 04/30/23 Return(%)',
          value: 'return',
          key: 'return'
        },
        {
          label: 'To BTV3',
          value: 'btn',
          key: 'btn'
        }
      ],
      tableData: [],
      immutableTableData: [],
      currentSort: {}, // 当前的排序信息
      dataList: [],
      selection: false,
      isIndeterminate: false,
    }
  },
  computed: {
		paginatedData() {
      // 计算分页数据
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.immutableTableData.slice(startIndex, endIndex);
		},
	},
  async created() {
    await this.getDataList()
    console.log('列表返回处理数据', this.tableData)
    const data = [
      {
        model_name: 'Alternating Between Stocks and Gold Model',
        current_state: 'Long SPY (S&P 500 ETF)',
        date: '2024-03-28',
        update_frequency: 'Daily',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Legacy',
        return: '9.81 %'
      },
      {
        model_name: 'Macro Index Model',
        current_state: '100% Cash',
        date: '2022-06-01',
        update_frequency: 'Monthly',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Index',
        return: '0.0 %'
      },
      {
        model_name: 'Short Term Trading Model',
        current_state: '100% Cash',
        date: '2023-07-25',
        update_frequency: 'Daily',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Bond',
        return: '0.0 %'
      },
      {
        model_name: 'Dual Trend Model',
        current_state: 'Long QQQ (NASDAQ 100 ETF)',
        date: '2024-04-11',
        update_frequency: 'Daily',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Factors',
        return: '	7.95 %'
      },
      {
        model_name: 'Dual Trend Model With Fundamentals',
        current_state: 'Long QQQ (NASDAQ 100 ETF)',
        date: '2024-04-11',
        update_frequency: 'Daily',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Sector',
        return: '	7.95 %'
      },
      {
        model_name: 'Multi-Index Trading Model',
        current_state: 'Long SPY (S&P 500 ETF)',
        date: '2024-03-08',
        update_frequency: 'Daily',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Legacy',
        return: '	7.95 %'
      },
      {
        model_name: 'Multi-Index Trading Model',
        current_state: 'Long SPY (S&P 500 ETF)',
        date: '2024-03-08',
        update_frequency: '	Weekly',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Legacy',
        return: '7.11 %'
      },
      {
        model_name: 'Multi Index Trading Model With Fundamentals',
        current_state: 'Long SPY (S&P 500 ETF)',
        date: '2024-03-08',
        update_frequency: '	Weekly',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Legacy',
        return: '7.11 %'
      },
      {
        model_name: 'Simple Trading Model With Fundamentals',
        current_state: 'Long SPY (S&P 500 ETF)',
        date: '2020-05-29',
        update_frequency: 'Monthly',
        description: '<p>Trend following works. While most conventional trend following strategies do not significantly outperform buy and hold in the long run, they will mostly match buy and hold while reducing maximum drawdowns. The Momentum Model is a trend following strategy that goes beyond using moving averages, which are the standard for trend following.</p>\r\n\r\n<p>The Momentum Model compares 2 asset classes: stocks vs. bonds. When stocks are doing better than bond yields, stocks usually keep going up. But when stocks start to do poorly relative to bond yields, stocks have the potential to crash.</p>\r\n\r\n<p>The stock market&rsquo;s long term tops (e.g. 2007, 2000, 1972, 1968) tend to be relatively flat. This can mark turning points in the stock market, which may roll over from a bull market to a bear market.</p>\r\n\r\n<p><strong><u>Model&rsquo;s rules</u></strong></p>\r\n\r\n<ol>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &gt; the 3 month Treasury yield, go 100% long the S&amp;P 500 Total Return Index.</li>\r\n\t<li>If the S&amp;P 500 Total Return Index&rsquo;s 12 month rate-of-change &lt;= the 3 month Treasury yield, SELL.</li>\r\n</ol>\r\n\r\n<p>You can do 1 of 6 things when you SELL:</p>\r\n\r\n<ol>\r\n\t<li>Model: Shift into 100% cash</li>\r\n\t<li>Model (long/short): Short the S&P 500</li>\r\n\t<li>Model (Multi-Asset Aggregate Bonds): Buy and hold a Aggregate Bond ETF (AGG)</li>\r\n\t<li>Model (Multi-Asset Corporate Bonds): Buy and hold a US Corporate Bond ETF (LQD)</li>\r\n\t<li>Model (Multi-Asset Treasury Bonds): Buy and hold a US Treasury Bond ETF (TLT)</li>\r\n\t<li>Model (Gold): Buy and hold a Gold ETF (GLD)</li>\r\n</ol>\r\n',
        category: 'Legacy',
        return: '10.05 %'
      },
    ]
    for (let val of data) {
       val.selection = false;
    }
    this.tableData = data;
    this.immutableTableData = this.tableData
  },
  methods: {
    handleSizeChange(size) {
			this.pageSize = size;
			this.currentPage = 1; // Reset to the first page when the page size changes
		},
    handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
		},
    handleSelectedFn(selectionvalue, isIndeterminatevalue) { // 点击table头部全选框
      // 头部全选框状态改变
      this[selectionvalue] = !this[selectionvalue];
      // 列表选择框状态改变
      for (let i = 0; i < this.paginatedData.length; i++) {
        this.paginatedData[i][selectionvalue] = this[selectionvalue];
        this[isIndeterminatevalue] = false;
      }
    },
    handleListSelectedFn(selectionvalue, isIndeterminatevalue, scope) { // 点击table列表内的选择框
      // table列表内选择框状态改变
      this.paginatedData[scope.$index][selectionvalue] = !this.paginatedData[scope.$index][selectionvalue]
      // 判断是否在全选状态下
      let statusSelectio = this.allSelectionFn(selectionvalue)
      if (statusSelectio) {
        // 列表全部被选中,头部变更为选中状态
        this[selectionvalue] = true;
        this[isIndeterminatevalue] = false;
        return false
      }
      // 列表有选中且非全选，头部全选框待定状态
      for (let i = 0; i < this.paginatedData.length; i++) {
        if (this.paginatedData[i][selectionvalue] === true) {
          this[isIndeterminatevalue] = true;
          return false
        }
      }
      // 列表有没有选中，头部全选框未选状态
      this[isIndeterminatevalue] = false;
      this[selectionvalue] = false;
    },
    allSelectionFn(selectionvalue) { // 判断是否在全选状态下
      for (let i = 0; i < this.paginatedData.length; i++) {
        if (this.paginatedData[i][selectionvalue] !== true) {
          return false
        }
      }
      return true
    },
    highlightTag(tag) {
      this.highlightedTag = tag.value;
      // 重置分页和排序信息
      this.currentPage = 1;
      if (this.highlightedTag !== 'All') {
        this.immutableTableData = this.tableData.filter(item => item.category === this.highlightedTag);
      }else {
        this.immutableTableData = [...this.tableData]
      }
    },
    portfolio() {
      console.log('paginatedData', this.paginatedData.filter(item => item.selection))
    },
    async getDataList(orderby) {
      this.loading = true
      let res = null
      const page = this.currentPage
			try {
				res = await getStrategyList(page, orderby, this.searchKey)
        console.log('列表响应', res)
				if (res.status == 200) {
					let data = res.data.results
					this.tableData = data
					this.total = res.data.count
				}
			} catch(error) {
				console.log('报错了', error)
        if(error.response.status === 404) {
          const newPage = page != 1 ? page - 1 : 1
          this.handleCurrentChange(newPage)
          return
        }
        this.currentPage = 1
        this.total = 0
        this.tableData = []
        
      } finally {
        this.loading = false
      }
    },
    onSortChange(column){
			var sortingOrder = column.order
			var colName = column.prop
      console.log('colName', colName)
      this.currentSort = {
        prop: colName,
        order: sortingOrder 
      };
			// 数字字符串转数字类型排序
			if(['return'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.immutableTableData.sort((a,b) => {
            b[colName] = typeof b[colName] === 'number' ? b[colName] + '' : b[colName]
            a[colName] = typeof a[colName] === 'number' ? a[colName] + '' : a[colName]
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _b - _a
					})
				}else if(sortingOrder == 'descending'){
					this.immutableTableData.sort((a,b) => {
            b[colName] = typeof b[colName] === 'number' ? b[colName] + '' : b[colName]
            a[colName] = typeof a[colName] === 'number' ? a[colName] + '' : a[colName]
						let _b = b[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						let _a = a[colName].match(/\d+([\/.]\d+)?/g).reduce((pre,cur)=>{ return Number(pre) + Number(cur) })
						return _a - _b
					})
				}else{
				}
			}
			// 数字类型排序
			// if(['WinRate', 'ExpectedReturn', 'Z_Score', 'Close'].indexOf(colName) !== -1){
			// 	if(sortingOrder == 'ascending'){
			// 		this.tableData.sort((a,b) => {
			// 			return b[colName] - a[colName]
			// 		})
			// 	}else if(sortingOrder == 'descending'){
			// 		this.tableData.sort((a,b) => {
			// 			return a[colName] - b[colName]
			// 		})
			// 	}else{
			// 	}
			// }
			// 日期类型排序
			if(['date'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.immutableTableData.sort((a,b) => {
						return new Date(b[colName]) - new Date(a[colName])
					})
				}else if(sortingOrder == 'descending'){
					this.immutableTableData.sort((a,b) => {
						return new Date(a[colName]) - new Date(b[colName])
					})
				}else{
				}
			}
			// 字符串类型排序
			if(['update_frequency','current_state','model_name'].indexOf(colName) !== -1){
				if(sortingOrder == 'ascending'){
					this.immutableTableData.sort((a, b) => b[colName].localeCompare(a[colName], 'en', { sensitivity: 'base' }));
				}else if(sortingOrder == 'descending'){
					this.immutableTableData.sort((a, b) => a[colName].localeCompare(b[colName], 'en', { sensitivity: 'base' }));
				}else{
				}
			}
		},
  }
}
</script>

<style lang="less" scoped>
@import "../index.less";
</style>