const path = require('path')
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin		

function resolve(dir) {
	return path.join(__dirname, dir)
}

const config = {
	publicPath: '/',
	//去除生产环境的productionSourceMap减少了很大体积
	productionSourceMap: false,
	//configureWebpack 通过操作对象的形式，来修改默认的webpack配置，该对象将会被 webpack-merge 合并入最终的 webpack 配置
	configureWebpack: {
		module: {
			rules: [
				/* import.meta support for webpack 4 */
				{
					test: /\.js$/,
					include: path.resolve(__dirname, 'node_modules/cesium/Source'),
					loader: require.resolve('@open-wc/webpack-import-meta-loader')
				}
			]
		},
		plugins:[
			// Skeleton screen
			new SkeletonWebpackPlugin({
				webpackConfig: {
					entry: {
						app: path.join(__dirname, './src/Skeleton.js')
					}
				},
				minimize: true,
				quiet: true,
				router: {
					mode: 'history',
					routes: [
						{ path: '/home', skeletonId: 'homeSkeleton' },
						{ path: '/', skeletonId: 'homeSkeleton' },
					]
				}
			})
        ]
	},
	css: {
        // Whether to use CSS separation plug-in extracttextplugin
        extract: true,
        // Open CSS source maps?
        sourceMap: false,
        // Enable CSS modules for all CSS / pre processor files
        modules: false
    },
	//chainWebpack 通过链式编程的形式，来修改默认的webpack配置
	chainWebpack: (config) => {  
		config.resolve.alias
			.set('assets', resolve('src/assets'))
			.set('styles', resolve('src/assets/styles'))
		config.plugin('copy').tap((args) => {
			args[0].push({
				from: path.resolve(__dirname, './node_modules/chartiq/js/thirdparty/'),
				to: path.resolve(__dirname, 'dist/js/thirdparty'),
				toType: 'dir'
			})
			return args
		})
		config.module
			.rule('images')
			/* ChartIQ using cur files so it is important to add file support to config */
			.test(/\.(png|jpe?g|gif|webp|cur)(\?.*)?$/)
			.use('url-loader')
			.tap((options) => {
				return options
			})
		//分包
		config.optimization.splitChunks({
			cacheGroups:{
				vendors: { // 自定义打包模块
					name: 'chunk-vendors', // 打包后的文件名
					test: /[\\/]node_modules[\\/]/, // 匹配对应文件
					priority: 1, // 优先级，先打包到哪个组里面，值越大，优先级越高
					// initial: 对于匹配文件，非动态模块打包进该vendor,动态模块优化打包
					// async: 对于匹配文件，动态模块打包进该vendor,非动态模块不进行优化打包
					// all: 匹配文件无论是否动态模块，都打包进该vendor
					chunks: 'initial',
					enforce: true, // true/false。为true时，忽略minSize，minChunks
					reuseExistingChunk: true,
				},
				'element-ui': {
					name: 'element-ui',
					test: /[\\/]node_modules[\\/](element-ui)[\\/]/,
					priority: 2,
					chunks: 'initial',
					enforce: true,
					reuseExistingChunk: true,
				},
				'chartiq': {
					name: 'chartiq',
					test: /[\\/]node_modules[\\/](chartiq)[\\/]/,
					priority: 2,
					chunks: 'initial',
					enforce: true,
					reuseExistingChunk: true,
				},
				'aws-sdk': {
					name: 'aws-sdk',
					test: /[\\/]node_modules[\\/](aws-sdk)[\\/]/,
					priority: 2,
					chunks: 'initial',
					enforce: true,
					reuseExistingChunk: true,
				},
				// 'vue': {
				// 	name: 'vue',
				// 	test: /[\\/]node_modules[\\/](vue)[\\/]/,
				// 	priority: 2,
				// 	chunks: 'initial',
				// 	enforce: true,
				// 	reuseExistingChunk: true,
				// },
				// 'vue-router': {
				// 	name: 'vue-router',
				// 	test: /[\\/]node_modules[\\/](vue-router)[\\/]/,
				// 	priority: 2,
				// 	chunks: 'initial',
				// 	enforce: true,
				// 	reuseExistingChunk: true,
				// },
				// 'vuex': {
				// 	name: 'vuex',
				// 	test: /[\\/]node_modules[\\/](vuex)[\\/]/,
				// 	priority: 2,
				// 	chunks: 'initial',
				// 	enforce: true,
				// 	reuseExistingChunk: true,
				// },
			}
		})
		//CDN代理挂载，打包忽略nodemoudle内的以下包
		config.externals({
			vue: 'Vue',
			vuex: 'Vuex',
			'vue-router': 'VueRouter',
		});
		config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
			{
			  analyzerMode: 'static'
			}
		])
	},
	devServer: {
		// open:true,
		// port: 8080,
		// host:"localhost",
		// https:false,
		// test ip 18.216.210.200
		// http://10.131.3.74:8000
		// http://3.140.194.24:80
		// http://3.144.31.178:8000
		// 10.131.3.17:8000
		// 10.131.9.60:8000
		hot: true,
		disableHostCheck: true,
		proxy: {
			'/dev': {
				target: "https://ggfdkkraph.execute-api.us-east-1.amazonaws.com/",
				// ws:true,
				changeOrigin: true,
				pathRewrite: {
					'^/dev': '/dev'
				}
			},
		}
	}
}

module.exports = config
