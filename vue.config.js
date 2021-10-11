const path = require("path")

function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    publicPath: "/",
    chainWebpack: config => {
        config.resolve.alias
            .set("assets", resolve("src/assets"))
            .set("styles", resolve("src/assets/styles"))
    },
    devServer: {
        // open:true,
        // port: 8080,
        // host:"localhost",
        // https:false,
        proxy:{
            "/demo":{
                target: "http://10.131.3.74:8000",
                // ws:true,
                changeOrigin:true,
                pathRewrite:{
                    "^/demo":"/demo"
                }
            }
        }
    }
}

