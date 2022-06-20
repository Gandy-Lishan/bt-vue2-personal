const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin')

function resolve(dir) {
	return path.join(__dirname, dir)
}

const config = {
	publicPath: '/',
	productionSourceMap: false,
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
	},
	devServer: {
		hot: true,
		disableHostCheck: true,
		proxy: {
			'/dev': {
				target: "https://h7r34cgfvh.execute-api.us-east-1.amazonaws.com",
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