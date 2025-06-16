const routes = [
	{ path: '/', redirect: '/dashboard' },
	{
		path: '/backtester',
		name: 'Backtester',
		redirect: '/backtester/sr',
		component: resolve =>
			require(['@/components/backtester/index.vue'], resolve),
		children: [
			{
				path: 'sr',
				name: 'SetUpResults',
				redirect: '/backtester/sr/setup',
				meta: {actived: 'SR'},
				component: resolve =>
					require([
						'@/components/backtester/components/setupResults/index.vue'
					], resolve),
				children: [
					{
						path: 'setup',
						name: 'SetUp',
						meta: { activeItem: 'setup', actived: 'SR' },
						component: resolve =>
							require([
								'@/components/backtester/components/setupResults/setup/index.vue'
							], resolve)
					},
					{
						path: 'results',
						name: 'Results',
						meta: { activeItem: 'results', actived: 'SR' },
						component: resolve =>
							require([
								'@/components/backtester/components/setupResults/results/index.vue'
							], resolve)
					}
				]
			},
			{
				path: 'list',
				name: 'List',
				redirect: '/backtester/list/history',
				meta: {actived: 'LIST'},
				component: resolve =>
					require([
						'@/components/backtester/components/list/index.vue'
					], resolve),
				children: [
					{
						path: 'history',
						name: 'History',
						meta: { activeItem: 'history', actived: 'LIST' },
						component: resolve =>
							require([
								'@/components/backtester/components/list/history/index.vue'
							], resolve)
					},
					{
						path: 'favorites',
						name: 'Favorites',
						meta: { activeItem: 'favorites', actived: 'LIST' },
						component: resolve =>
							require([
								'@/components/backtester/components/list/favorites/index.vue'
							], resolve)
					},
					{
						path: 'sample',
						name: 'Sample',
						meta: { activeItem: 'sample', actived: 'LIST' },
						component: resolve =>
							require([
								'@/components/backtester/components/list/sample/index.vue'
							], resolve)
					},
					{
						path: 'analyst',
						name: 'Analyst',
						meta: { activeItem: 'analyst', actived: 'LIST' },
						component: resolve =>
							require([
								'@/components/backtester/components/list/analyst/index.vue'
							], resolve)
					}
				]
			}
		]
	},
	{ path: '/home/backtester', redirect: '/backtester' },
	{ path: '/home/scannerai', redirect: '/scannerai' },
	{
		path: '/scannerai',
		component: resolve =>
			require(['@/components/AIScanner/index.vue'], resolve),
		children: [
			{
				path: '',
				name: 'scannerai',
				component: resolve =>
					require(['@/components/AIScanner/AIScanner.vue'], resolve)
			},
			{
				path: 'scannerai_chart',
				name: 'scannerai_chart',
				component: resolve =>
					require(['@/components/AIScanner/ScannerChart/index.vue'], resolve)
			},
			{
				path: 'backtest',
				name: 'scannerai_backtest',
				component: resolve =>
					require(['@/components/AIScanner/ScannerBacktest/index.vue'], resolve)
			},
		]
	},
	{ path: '/home/scannerai', component: resolve => require(['@/components/AIScanner/index.vue'], resolve), alias: '/scannerai' },
	{
		path: '/myindicator',
		component: resolve =>
			require(['@/components/MyIndicator/index.vue'], resolve),
		children: [
			{
				path: '',
				name: 'MIList',
				component: resolve =>
					require(['@/components/MyIndicator/list/index.vue'], resolve)
			},
			{
				path: 'create',
				name: 'MIcreate',
				component: resolve =>
					require(['@/components/MyIndicator/create/index.vue'], resolve)
			}
		]
	},
	{
		path: '/seasonality',
		name: 'Seasonality',
		component: resolve =>
			require(['@/components/Seasonality/index.vue'], resolve),
	},
	{
		path: '/portfolio',
		name: 'Portfolio',
		component: resolve =>
			require(['@/components/Portfolio/index.vue'], resolve),
	},
	{
		path: '/watchlist',
		name: 'WatchList',
		component: resolve =>
			require(['@/components/WatchList/index.vue'], resolve),
	},
	{
		path: '/reports',
		name: 'Reports',
		component: resolve =>
			require(['@/components/Reports/index.vue'], resolve),
	},
	{
		path: '/cpm',
		name: 'CPM',
		component: resolve =>
			require(['@/components/CPM/index.vue'], resolve),
		children: [
			{
				path: '',
				name: 'List',
				component: resolve =>
					require(['@/components/CPM/list/index.vue'], resolve)
			},
			{
				path: 'list',
				name: 'List',
				component: resolve =>
					require(['@/components/CPM/list/index.vue'], resolve)
			},
			{
				path: 'create',
				name: 'CreateCPM',
				component: resolve =>
					require(['@/components/CPM/create/index.vue'], resolve)
			},
			{
				path: 'results',
				name: 'CPMResults',
				component: resolve =>
					require(['@/components/CPM/results/index.vue'], resolve)
			},
			{
				path: 'symbol',
				name: 'SymbolCorrelation',
				component: resolve =>
					require(['@/components/CPM/SymbolCorrelation.vue'], resolve)
			},
			{
				path: 'asset',
				name: 'AssetCorrelation',
				component: resolve =>
					require(['@/components/CPM/AssetCorrelation.vue'], resolve)
			}
		]
	},
	
	{
		path: '/strategy',
		name: 'Strategy',
		component: resolve =>
			require(['@/components/Strategy/index.vue'], resolve),
		children: [
			{
				path: '',
				name: 'StrategyList',
				component: resolve =>
					require(['@/components/Strategy/Table/index.vue'], resolve)
			},
			{
				path: 'descriptions',
				name: 'Descriptions',
				component: resolve =>
					require(['@/components/Strategy/Descriptions.vue'], resolve)
			}
		]
	},
	{
		path: '/indicators',
		name: 'Indicators',
		component: resolve =>
			require(['@/components/Indicators/index.vue'], resolve),
	},
	{
		path: '/trend_score',
		name: 'TrendScore',
		component: resolve =>
			require(['@/components/Indicators/TrendScore/index.vue'], resolve)
	},
	{
		path: '/sector_trend_score',
		name: 'RelatedStockSectors',
		component: resolve =>
			require(['@/components/Indicators/RelatedStockSectors/index.vue'], resolve)
	},
	{
		path: '/doc',
		component: resolve => require(['@/components/Tutorial/Doc.vue'], resolve),
		redirect: '/doc/home',
		children: [
			{
				path: '/doc/home',
				component: resolve =>
					require(['@/components/Tutorial/components/Doc.vue'], resolve)
			},
			{
				path: '/doc/guide/:id',
				component: resolve =>
					require(['@/components/Tutorial/components/Guide.vue'], resolve)
			},
			{
				path: '/doc/scanner',
				component: resolve =>
					require(['@/components/Tutorial/components/AIScanner.vue'], resolve)
			},
			{
				path: '/doc/disclaimer',
				component: resolve =>
					require(['@/components/Tutorial/components/Disclaimer.vue'], resolve)
			}
		]
	},
	{
		path: '/MR',
		name: 'ModelReport',
		component: resolve => require(['@/components/ModelReport/index.vue'], resolve),
		children: [
			{
				path: '/MR/active_studies',
				name: 'ActiveStudies',
				component: resolve =>
					require(['@/components/ModelReport/ActiveStudies.vue'], resolve)
			},
			{
				path: '/MR/archived_studies',
				component: resolve =>
					require(['@/components/ModelReport/ArchivedStudies.vue'], resolve)
			},
			{
				path: '/MR/old_archived_reports/2014',
				component: resolve =>
					require(['@/components/ModelReport/ReportArchives2014.vue'], resolve)
			},
			{
				path: '/MR/old_archived_reports/2013',
				component: resolve =>
					require(['@/components/ModelReport/ReportArchives2013.vue'], resolve)
			},
			{
				path: '/MR/old_archived_reports/2012',
				component: resolve =>
					require(['@/components/ModelReport/ReportArchives2012.vue'], resolve)
			},
			{
				path: '/MR/favorites/:page?',
				component: resolve =>
					require(['@/components/ModelReport/Favorites.vue'], resolve)
			},
			{
				path: '/MR/archives/:serviceType(\\w+)/:page?',
				component: resolve =>
					require(['@/components/ModelReport/Archives.vue'], resolve)
			},
			{
				path: '/MR/tags/:blogTag/:page?',
				component: resolve => require(['@/components/ModelReport/BlogTags.vue'], resolve)
			},
			{
				path: '/MR/archived_reports/:year/:page?',
				component: resolve =>
					require(['@/components/ModelReport/ReportArchives.vue'], resolve)
			},
			{
				path: '/MR/old_archived_reports/:year/:page?',
				component: resolve => require(['@/components/ModelReport/OldReportArchives.vue'], resolve)
			},
			{
				path: '/MR/:serviceType(\\w+)/:reportUrl?',
				component: resolve =>
					require(['@/components/ModelReport/Sentimentedge.vue'], resolve)
			},
	]
	},
	{
		path: '/my_signals',
		name: 'MySignals',
		component: resolve => require(['@/components/MySignals/index.vue'], resolve)
	},
	{
		path: '/my_screen',
		name: 'MyScreen',
		component: resolve => require(['@/components/MyScreen/index.vue'], resolve)
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: resolve => require(['@/components/Dashboard/ViewIndex.vue'], resolve),
		children: [
			{
				path: '',  // 相对路径，不是'/'
				name: 'Dashboard',
				component: resolve =>
					require(['@/components/Dashboard/index.vue'], resolve)
			},
			{
				path: 'phase_table',  // 相对路径，不是'/board/phase_table'
				name: 'LargePhaseTable',
				component: resolve =>
					require(['@/components/Dashboard/LargePhaseTable.vue'], resolve)
			},
			{
				path: 'heatmap',  // 相对路径，不是'/board/phase_table'
				name: 'LargeHeatmap',
				component: resolve =>
					require(['@/components/Dashboard/LargeHeatmap.vue'], resolve)
			},
			{
				path: 'htop_webinar',  // 相对路径，不是'/board/phase_table'
				name: 'Webinar',
				component: resolve =>
					require(['@/components/Dashboard/Webinar.vue'], resolve)
			}
		]
	},
	{
		path: '/search',
		name: 'AlgoliaSearchVue',
		component: resolve => require(['@/components/AlgoliaSearchVue/index.vue'], resolve)
	},
	{
		path: '/notifications',
		name: 'Notifications',
		component: resolve => require(['@/components/Notifications/index.vue'], resolve)
	},
	{
		path: '/market',
		name: 'Market',
		redirect: '/market/predict',
		component: resolve => require(['@/components/Market/index.vue'], resolve),
		children: [
				{
					path: 'overview',
					name: 'MarketOverview',
					meta: { activeItem: 'overview' },
					component: resolve =>
						require(['@/components/Market/Overview.vue'], resolve)
				},
				{
					path: 'predict',
					name: 'MarketPredict',
					meta: { activeItem: 'predict' },
					component: resolve => require(['@/components/Market/Predict.vue'], resolve)
				},
			// {
			// 	path: 'equities',
			// 	name: 'Equities',
			// 	meta: { activeItem: 'equities' },
			// 	component: resolve =>
			// 		require(['@/components/Market/Equities.vue'], resolve)
			// },
			// {
			// 	path: 'commodities',
			// 	name: 'Commodities',
			// 	meta: { activeItem: 'commodities' },
			// 	component: resolve =>
			// 		require(['@/components/Market/Commodities.vue'], resolve)
			// },
			// {
			// 	path: 'earnings',
			// 	name: 'EarningsCalendar',
			// 	meta: { activeItem: 'earnings' },
			// 	component: resolve =>
			// 		require(['@/components/Market/Earnings.vue'], resolve)
			// },
			{
				path: 'sec/:symbolname',
				name: 'MarketSecDetail',
				meta: { activeItem: 'sec' },
				component: resolve => require(['@/components/Market/sec/index.vue'], resolve),
				children: [
					{
					  path: '',
					  redirect: 'chart'
					},
					{
					  path: 'chart',
					  component: resolve => require(['@/components/Market/sec/Chart.vue'], resolve),
					},
					{
						path: 'analysts',
						component: resolve => require(['@/components/Market/sec/Analysts.vue'], resolve),
					  },
					{
					  path: 'earnings',
					  component: () => import('@/components/Market/sec/Earnings.vue')
					},
					  {
						path: 'financials',
						component: resolve => require(['@/components/Market/sec/Financials.vue'], resolve),
					  },
					  {
						path: 'balancesheet',
						component: resolve => require(['@/components/Market/sec/BalanceSheet.vue'], resolve),
					  },
					  {
						path: 'cashflow',
						component: resolve => require(['@/components/Market/sec/CashFlow.vue'], resolve),
					  },
					  {
						path: 'ownership',
						component: resolve => require(['@/components/Market/sec/Ownership.vue'], resolve),
					  },
				  ]
			},
			{
				path: 'sec',
				redirect: '/market'
			}
		]
	},	
	{
		path: '/404',
		component: resolve => require(['@/components/404.vue'], resolve)
	},
	{
		path: '/testpage',
		component: resolve => require(['@/components/TestPage/index.vue'], resolve)
	},
]

export default routes
