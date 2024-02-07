const routes = [
	{ path: '/', redirect: '/home' },
	{
		path: '/home',
		component: resolve =>
			require(['@/components/BacktestEdge/index.vue'], resolve),
		redirect: '/home/backtester',
		children: [
			{
				path: 'backtester',
				name: 'backtester',
				component: resolve =>
					require(['@/components/BacktestEdge/Home.vue'], resolve),
				children: [
					{
						path: 'brainstorm',
						name: 'brainstorm',
						component: resolve =>
							require([
								'@/components/BacktestEdge/Brainstorm/index.vue'
							], resolve),
						redirect: '/home/backtester/brainstorm/exit_with_custom_TIM_frame',
						children: [
							{
								path: 'exit_with_custom_TIM_frame',
								name: 'ExitWithCustomTIMFrame',
								component: resolve =>
									require([
										'@/components/BacktestEdge/Brainstorm/ExitWithCustomTIMFrame.vue'
									], resolve)
							}
						]
					},
					{
						path: 'strategy',
						name: 'strategy',
						component: resolve =>
							require(['@/components/BacktestEdge/Strategy.vue'], resolve)
					},
					{
						path: 'backtests',
						name: 'Backtests',
						component: resolve =>
							require(['@/components/BacktestEdge/Backtests.vue'], resolve)
					}
					// { path: 'chat', name: 'Chat', component: resolve => require(['@/components/BacktestEdge/Chat.vue'], resolve), },
				]
			},
			{
				path: 'scannerai',
				component: resolve =>
					require(['@/components/BacktestEdge/AIScanner/index.vue'], resolve),
				children: [
					{
						path: '',
						name: 'scannerai',
						component: resolve =>
							require([
								'@/components/BacktestEdge/AIScanner/AIScanner.vue'
							], resolve)
					},
					{
						path: 'scannerai_chart',
						name: 'scannerai_chart',
						component: resolve =>
							require([
								'@/components/BacktestEdge/AIScanner/ScannerChart/index.vue'
							], resolve)
					}
				]
			}
		]
	},
	{
		path: '/doc',
		component: resolve => require(['@/components/Menu/Doc.vue'], resolve),
		redirect: '/doc/home',
		children: [
			{
				path: '/doc/home',
				component: resolve =>
					require(['@/components/Menu/components/Doc.vue'], resolve)
			},
			{
				path: '/doc/guide/:id',
				component: resolve =>
					require(['@/components/Menu/components/Guide.vue'], resolve)
			},
			{
				path: '/doc/scanner',
				component: resolve =>
					require(['@/components/Menu/components/AIScanner.vue'], resolve)
			},
			{
				path: '/doc/disclaimer',
				component: resolve =>
					require(['@/components/Menu/components/Disclaimer.vue'], resolve)
			}
		]
	},
	{
		path: '/404',
		component: resolve => require(['@/components/404.vue'], resolve)
	}
]

export default routes
