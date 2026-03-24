const path = require('path')
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const Timestamp = new Date()
const utcTimestamp = Date.UTC(
	Timestamp.getUTCFullYear(),
	Timestamp.getUTCMonth(),
	Timestamp.getUTCDate(),
	Timestamp.getUTCHours(),
	Timestamp.getUTCMinutes(),
	Timestamp.getUTCSeconds()
)
function resolve(dir) {
	return path.join(__dirname, dir)
}



const { writeFile, existsSync } = require('fs')
// 动态生成版本号
const createVersion = () => {
//检测目录是否存在
if (existsSync('./public')) {
	writeFile(`./public/version.json`, `{"version":"${Date.now()}"}`, (err) => {
	if (err) {
		console.log('写入version.json失败')
		console.log(err)
	} else {
		console.log('写入version.json成功')
	}
	})
} else {
	setTimeout(createVersion, 1000)
}
}
setTimeout(createVersion, 10000)


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
				},
			{
					test: /\.js$/,
					include: [require.resolve('highcharts')],
					use: 'babel-loader' // 使用babel-loader来处理Highcharts的模块
				},
				{
					test: /\.js$/,
					include: path.resolve(__dirname, 'node_modules/chartiq'),
					use: 'babel-loader' // 使用babel-loader来处理chartiq的模块
				},
				// 在这里添加 lru-cache 的配置
				{
					test: /node_modules[\\/]lru-cache[\\/]/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					]
				}
			]
		},
		plugins: [
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
						{ path: '/', skeletonId: 'homeSkeleton' }
					]
				}
			})
			// new UglifyJsPlugin({
			//     uglifyOptions: {
			//         compress:{
			//             drop_console:true,
			// 			dead_code:true,
			// 			drop_debugger:true,
			//         },
			// 		warnings: false
			//     },
			// 	sourceMap: false,
			// 	parallel: true	//多进程提高构建速度
			// }),
			// new CompressionPlugin({
			// 	// 压缩成gzip
			// 	algorithm: 'gzip',
			// 	// 使用正则给匹配到的文件做压缩，这里是给html、css、js以及字体做压缩
			// 	test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/,
			// 	// 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
			// 	threshold: 10240,
			// 	// 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
			// 	minRatio: 0.8
			// })
		],
		output: {
			filename: `js/[name].${utcTimestamp}.js`,
			chunkFilename: `js/[name].${utcTimestamp}.js`
		}
	},
	css: {
		// Whether to use CSS separation plug-in extracttextplugin
		extract: {
			filename: `css/[name].${utcTimestamp}.css`,
			chunkFilename: `css/[name].${utcTimestamp}.css`
		},
		// Open CSS source maps?
		sourceMap: false,
		// Enable CSS modules for all CSS / pre processor files
		modules: false
	},
	//chainWebpack 通过链式编程的形式，来修改默认的webpack配置
	chainWebpack: config => {
		config.resolve.alias
			.set('assets', resolve('src/assets'))
			.set('styles', resolve('src/assets/styles'))
		config.plugin('copy').tap(args => {
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
			.tap(options => {
				return options
			})
		// 「尽量将第三方库拆为独立分包」
		// 「保持按路由分包，减少首屏资源负载」
		// 「尽量保持」 chunks = 'all'
		//分包1
		config.optimization.splitChunks({
			cacheGroups: {
				vendors: {
					//
					// 自定义打包模块
					name: 'chunk-vendors', // 打包后的文件名
					test: /[\\/]node_modules[\\/]/, // 匹配对应文件
					priority: 1, // 优先级，先打包到哪个组里面，值越大，优先级越高
					// initial: 对于匹配文件，非动态模块打包进该vendor,动态模块优化打包
					// async: 对于匹配文件，动态模块打包进该vendor,非动态模块不进行优化打包
					// all: 匹配文件无论是否动态模块，都打包进该vendor
					chunks: 'initial',
					enforce: true, // true/false。为true时，忽略minSize，minChunks
					reuseExistingChunk: true
				},
				'element-ui': {
					name: 'element-ui',
					test: /[\\/]node_modules[\\/](element-ui)[\\/]/,
					priority: 2,
					chunks: 'initial',
					enforce: true,
					reuseExistingChunk: true
				},
				chartiq: {
					name: 'chartiq',
					test: /[\\/]node_modules[\\/](chartiq)[\\/]/,
					priority: 2,
					chunks: 'initial',
					enforce: true,
					reuseExistingChunk: true
				}
			}
		})

		//分包2
		// config.optimization.splitChunks({
		// 	chunks: 'all',
		// 	maxInitialRequests: Infinity,
		// 	minSize: 300000, // 依赖包超过300000bit将被单独打包
		// 	automaticNameDelimiter:'-',
		// 	cacheGroups: {
		// 	  vendor: {
		// 		test: /[\\/]node_modules[\\/]/,
		// 		name(module) {
		// 		  const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
		// 		  return `chunk.${packageName.replace('@', '')}`;
		// 		},
		// 		priority:10
		// 	  },
		// 	}
		// })

		//分包3
		// config.optimization.splitChunks({
		// 	chunks: 'all',
		// 	maxInitialRequests: Infinity,
		//  	minSize: 300000, // 依赖包超过300000bit将被单独打包
		// 	cacheGroups: {
		// 	  vendors: {
		// 		name: 'chunk-vendors',
		// 		test: /[\\/]node_modules[\\/]/,
		// 		priority: 10,
		// 		chunks: 'initial'
		// 	  },
		// 	  'element-ui': {
		// 		name: 'element-ui',
		// 		priority: 20,
		// 		test: /[\\/]node_modules[\\/]_?element-ui(.*)/
		// 	  },
		// 	  chartiq: {
		// 		name: 'chartiq',
		// 		priority: 20,
		// 		test: /[\\/]node_modules[\\/]_?chartiq(.*)/
		// 	  },
		// 	  'aws-sdk': {
		// 		name: 'aws-sdk',
		// 		priority: 20,
		// 		test: /[\\/]node_modules[\\/]_?aws-sdk(.*)/
		// 	  },
		// 	//   commons: {
		// 	// 	name: 'chunk-commons',
		// 	// 	minChunks: 2,
		// 	// 	priority: 5,
		// 	// 	chunks: 'initial',
		// 	// 	reuseExistingChunk: true
		// 	//   }
		// 	}
		// })

		//分包4
		// 先把大体积包拆分出来* 先大体积包 echarts 拆分出来；* 再把 node_modules 中体积大于 160000B 的依赖包拆出来（这里参考 next.js，将阈值设置为 160000B）；
		// 再考虑将 node_modules 中的剩余项打成一个 chunk；
		// 将被引用次数大于等于 3 次的公共模块拆分出来；
		// config.optimization.splitChunks({
		// 	chunks: 'all',
		// 	cacheGroups: {
		// 		vendor: {
		// 			name: 'chunk-vendors',
		// 			test: /[\\/]node_modules[\\/]/,
		// 			priority: 10, chunks: 'initial'
		// 		},
		// 		chartiq: {
		// 			name: 'chunk-chartiq',
		// 			priority: 20,
		// 			test: /[\\/]node_modules[\\/]_?chartiq|zrender(.*)/
		// 		},
		// 		'aws-sdk': {
		// 			name: 'chunk-aws-sdk',
		// 			priority: 20,
		// 			test: /[\\/]node_modules[\\/]_?aws-sdk|zrender(.*)/
		// 		},
		// 		'element-ui': {
		// 			name: 'chunk-element-ui',
		// 			priority: 20,
		// 			test: /[\\/]node_modules[\\/]_?element-ui|zrender(.*)/
		// 		},
		// 		commons: {
		// 			name: 'chunk-commons',
		// 			minChunks: 3,
		// 			// minimum common number
		// 			priority: 5,
		// 			reuseExistingChunk: true
		// 		},
		// 		lib: {
		// 			test(module) {
		// 				return (module.size() > 160000 &&/node_modules[/\\]/.test(module.nameForCondition() || ''))
		// 			},
		// 			name(module) {
		// 				const packageNameArr = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
		// 				const packageName = packageNameArr ? packageNameArr[1] : '';
		// 				// npm package names are URL-safe, but some servers don't like @ symbols
		// 				return `chunk-lib.${packageName.replace("@", "")}`;
		// 			},
		// 			priority: 15,
		// 			minChunks: 1,
		// 			reuseExistingChunk: true,
		// 		},
		// 	}
		// })

		//CDN代理挂载，打包忽略nodemoudle内的以下包
		// config.externals({
		// 	vue: 'Vue',
		// 	vuex: 'Vuex',
		// 	'vue-router': 'VueRouter'
		// })

		// if(process.env.ST_ENV === "prod"){
		// 	config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
		// 		{
		// 			analyzerMode: 'static'
		// 		}
		// 	])
		// }
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
				//target: "http://10.131.9.217:8000",
				//target: 'https://devbt2api.sentimentrader.com/',
				target: "https://bt2api.sentimentrader.com",
				ws:true,
				changeOrigin: true,
				pathRewrite: {
					'^/dev': ''
				}
			},
			'/api': {
				//target: "https://ggfdkkraph.execute-api.us-east-1.amazonaws.com/",
				// target: "http://10.131.9.217:8000",
				target: 'http://localhost:5001',
				// ws:true,
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/api'
				}
			},
			'/ai': {
				target: 'https://ai.sentdevsite.com',
				ws: true,
				changOrigin: true,
				pathRewrite: {
					'^/ai': ''
				}
			},
			'/sn': {
				target: 'http://192.168.2.101:5000',
				ws: true,
				changOrigin: true,
				pathRewrite: {
					'^/sn': ''
				}
			},
			'/bt': {
				target: "https://bt2api.sentimentrader.com",
				//target: 'https://devbt2api.sentimentrader.com/',
				//target: 'http://10.131.9.217:8000/my_indicator',
				ws: true,
				changOrigin: true,
				pathRewrite: {
					'^/bt': ''
				}
			}
		}
	}
}

module.exports = config
