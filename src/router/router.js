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
						component: resolve =>
							require([
								'@/components/backtester/components/setup/index.vue'
							], resolve)
					},
					{
						path: 'results',
						name: 'Results',
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
				component: resolve =>
					require([
						'@/components/backtester/components/list/index.vue'
					], resolve)
			}
		]
	}
]

export default routes
