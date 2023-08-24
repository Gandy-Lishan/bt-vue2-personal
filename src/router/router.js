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
				component: resolve =>
					require([
						'@/components/backtester/components/setupResults/index.vue'
					], resolve),
				children: [
					{
						path: 'setup',
						name: 'SetUp',
						meta: { activeItem: 'setup' },
						component: resolve =>
							require([
								'@/components/backtester/components/setup/index.vue'
							], resolve)
					},
					{
						path: 'results',
						name: 'Results',
						meta: { activeItem: 'results' },
						component: resolve =>
							require([
								'@/components/backtester/components/results/index.vue'
							], resolve)
					}
				]
			},
			{
				path: 'list',
				name: 'List',
				redirect: '/backtester/list/history',
				component: resolve =>
					require([
						'@/components/backtester/components/list/index.vue'
					], resolve),
				children: [
					{
						path: 'history',
						name: 'History',
						meta: { activeItem: 'history' },
						component: resolve =>
							require([
								'@/components/backtester/components/list/history/index.vue'
							], resolve)
					},
					{
						path: 'favorites',
						name: 'Favorites',
						meta: { activeItem: 'favorites' },
						component: resolve =>
							require([
								'@/components/backtester/components/list/favorites/index.vue'
							], resolve)
					},
					{
						path: 'sample',
						name: 'Sample',
						meta: { activeItem: 'sample' },
						component: resolve =>
							require([
								'@/components/backtester/components/list/sample/index.vue'
							], resolve)
					},
					{
						path: 'analyst',
						name: 'Analyst',
						meta: { activeItem: 'analyst' },
						component: resolve =>
							require([
								'@/components/backtester/components/list/analyst/index.vue'
							], resolve)
					}
				]
			}
		]
	}
]

export default routes
