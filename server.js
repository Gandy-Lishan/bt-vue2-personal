var express = require('express')
var path = require('path')
const fs = require('fs');
const compression = require("compression")
const proxy = require("http-proxy-middleware").createProxyMiddleware;
var serveStatic = require('serve-static')
var history = require('connect-history-api-fallback');

var dataPath = './src/assets/'
// const proxy = require("express-http-proxy")

function get_env(name,value){
    if (process.env[name] === undefined){
        return value
    }
    return process.env[name]
}

var app = express()

//  gzip压缩代码
app.use(compression()); // 要放在所有其他中间件注册之前

// 支持history路由
app.use(history());


app.get('/api/indicatorsList', (req, res) => {
    fs.readFile( dataPath+'indicatorsList copy.json', 'utf8', function (err, data) {
        res.send(data);
        //res.end( data );
    });
 });
app.get('/api/stocksList', (req, res) => {
    fs.readFile( dataPath+'stocksList.json', 'utf8', function (err, data) {
        res.send(data);
       // res.end( data );
    });
});
app.get('/api/indexsList', (req, res) => {
    fs.readFile( dataPath+'indexsList.json', 'utf8', function (err, data) {
        res.send(data);
       // res.end( data );
    });
});

// 寻找静态文件夹
//app.use(serveStatic(path.join(__dirname, 'dist')))    //自带gzip
app.use(express.static(path.join(__dirname, 'dist')))

// if (process.env.ST_ENV === "dev" || process.env.ST_ENV === undefined){
//     // let url =get_env("api_url",'https://h7r34cgfvh.execute-api.us-east-1.amazonaws.com/')
//     // app.use('/dev',proxy({target:url,changeOrigin:true}))

//     //test
//     // app.use("/dev",proxy(get_env("API_URL",`http://18.216.210.200/dev`)))
//     let url = get_env("api_url",'https://devbt2api.sentimentrader.com/')
//     //let url =get_env("api_url",'http://10.131.9.43:8000')
//     app.use('/dev',proxy({
//         target:url,
//         changeOrigin:true,
//         pathRewrite: {
//             '^/dev': '/dev'
//         }
//     }))
//     console.log('server started dev')
// }else if(process.env.ST_ENV === "prod"){
//     // app.use("/dev",proxy(get_env("API_URL",`http://18.216.210.200/dev`)))
//     let url = get_env("api_url",'https://devbt2api.sentimentrader.com/')
//     //let url =get_env("api_url",'http://10.131.9.43:8000')
//     app.use('/dev',proxy({
//         target:url,
//         changeOrigin:true,
//         pathRewrite: {
//             '^/dev': '/dev'
//         }
//     }))
    
//     //console.log = () => {}
// }



var port = process.env.PORT || 5001
app.listen(port)
console.log('server started ' + port)
