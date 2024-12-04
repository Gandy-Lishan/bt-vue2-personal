const path = require('path')
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin

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

console.log(process.env.NODE_ENV)

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
		],
		output: {
			filename: `js/[name].${utcTimestamp}.js`,
			chunkFilename: `js/[name].${utcTimestamp}.js`
		},
		optimization: {
			usedExports: true, // 启用Tree Shaking，标记并删除未使用的导出
			minimize: true, // 启用代码压缩
			splitChunks: {
			  chunks: 'all', // 默认对所有模块进行分包
			  cacheGroups: {
				vendors: {
				  name: 'chunk-vendors',
				  test: /[\\/]node_modules[\\/]/,
				  priority: 1,
				  chunks: 'initial', // 只对初始 chunk 进行分包
				  enforce: true,
				  reuseExistingChunk: true // 重复的模块会被复用
				},
				common: {
				  name: 'common',
				  minSize: 30000, // 拆分的模块最小尺寸
				  minChunks: 2, // 被多个 chunk 引用时才拆分
				  priority: 2,
				  chunks: 'initial', // 只对初始 chunk 进行分包
				  enforce: true
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
				},
				async: {
				  name: 'async',
				  chunks: 'async', // 仅针对异步加载的模块进行分包
				  minSize: 30000, // 分包的最小大小
				  priority: 3,
				  reuseExistingChunk: true
				}
			  }
			},
			runtimeChunk: {
			  name: entrypoint => `runtime-${entrypoint.name}` // 将运行时分离成独立文件
			}
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
				target: 'https://devbt2api.sentimentrader.com/',
				//target: "https://bt2api.sentimentrader.com",
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
				//target: "https://bt2api.sentimentrader.com",
				target: 'https://devbt2api.sentimentrader.com/',
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
