var express = require('express')
var path = require('path')
const compression = require("compression")
const proxy = require("http-proxy-middleware").createProxyMiddleware;
var serveStatic = require('serve-static')
var history = require('connect-history-api-fallback');

// const proxy = require("express-http-proxy")

function get_env(name,value){
    if (process.env[name] === undefined){
        return value
    }
    return process.env[name]
}

var app = express()


// 支持history路由
app.use(history());

//  压缩代码
app.use(compression());

// 寻找静态文件夹
app.use(serveStatic(path.join(__dirname, 'dist')))


console.log('ENV: ' + process.env.ST_ENV)
if (process.env.ST_ENV === "dev" || process.env.ST_ENV === undefined){
    let url =get_env("api_url",'https://h7r34cgfvh.execute-api.us-east-1.amazonaws.com/')
    app.use('/dev',proxy({target:url,changeOrigin:true}))
}else if(process.env.ST_ENV === "prod"){
    // app.use("/dev",proxy(get_env("API_URL",`http://18.216.210.200/dev`)))
    let url = get_env("api_url",'https://devbt2api.sentimentrader.com/')
    app.use('/dev',proxy({
        target:url,
        changeOrigin:true,
        pathRewrite: {
            '^/dev': '/dev'
        }
    }))
    
    //console.log = () => {}
}



var port = process.env.PORT || 5001
app.listen(port)
console.log('server started ' + port)
