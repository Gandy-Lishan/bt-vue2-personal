const path = require('path')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")


function resolve(dir) {
	return path.join(__dirname, dir)
}

const config = {
	publicPath: '/',
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
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress:{
                        drop_console:true,
                    }
                }
            })
        ]
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
		disableHostCheck: true,
		proxy: {
			'/demo': {
				target: 'http://3.140.194.24:8000',
				// ws:true,
				changeOrigin: true,
				pathRewrite: {
					'^/demo': '/demo'
				}
			},
			'/dev': {
				target: 'http://3.140.194.24:8000',
				//target: 'http://10.131.3.74:8000', 
				// ws:true,
				changeOrigin: true,
				pathRewrite: {
					'^/dev': '/dev'
				}
			},
			'/rundev': {
				target: 'http://3.140.194.24:8000',
				// ws:true,
				changeOrigin: true,
				pathRewrite: {
					'^/rundev': '/rundev'
				}
			}
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