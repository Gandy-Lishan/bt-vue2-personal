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
            // new UglifyJsPlugin({
            //     uglifyOptions: {
            //         compress:{
            //             drop_console:true,
			// 			dead_code:true,
			// 			drop_debugger:true,
            //         }
            //     }
            // }),
			// 骨架屏
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
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // 启用 CSS modules for all css / pre-processor files.
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
		// config.module
		//     .rule('file-loader')
		//     .test(/\.(jpg|gif|png|svg|cur)$/)
		//     .use('file-loader')
		//     .loader('file-loader')
		//     .end()

		// config.module
		//     .rule('sass-loader')
		//     .test(/\.(s)?css$/)
		//     .use('sass-loader')
		//     .loader('sass-loader')
		//     .end()
	},
	devServer: {
		// open:true,
		// port: 8080,
		// host:"localhost",
		// https:false,
		// 测试的ip 18.216.210.200
		// http://10.131.3.74:8000
		// http://3.140.194.24:80
		// http://3.144.31.178:8000
		// 10.131.3.17:8000
		disableHostCheck: true,
		proxy: {
			'/dev': {
				//target: 'http://18.216.210.200',
				 //target: 'http://10.131.3.232:8000', 
				//target: 'http://3.140.194.24:8000',
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

// if (process.env.ST_ENV !== "dev" && process.env.ST_ENV !== undefined){
//     config.configureWebpack = {
//         Plugins:[
//             new UglifyJsPlugin({
//                 uglifyOptions: {
//                     compress:{
//                         drop_console:true,
//                     }
//                 }
//             })
//         ]
//     }
// }


module.exports = config