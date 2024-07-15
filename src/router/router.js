const routes = [
	{ path: '/', redirect: '/backtester' },
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
		children: [
			{
				path: '',
				name: 'IndicatorsList',
				component: resolve =>
					require(['@/components/Indicators/Table/index.vue'], resolve)
			}
		]
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
		path: '/404',
		component: resolve => require(['@/components/404.vue'], resolve)
	}
]

export default routes
