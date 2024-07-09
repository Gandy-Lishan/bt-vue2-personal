var express = require('express')
var path = require('path')
const fs = require('fs');
const compression = require("compression")
const proxy = require("http-proxy-middleware").createProxyMiddleware;
var serveStatic = require('serve-static')
var history = require('connect-history-api-fallback');
// // algolia search
// const algoliasearch = require('algoliasearch')
// const searchClient = algoliasearch(
//     'PV3Q0OLVHA',
//     'fca7a5c6e8b1aba5d7d909e68dce9ad9'
// )


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
    fs.readFile( dataPath+'indicatorsList.json', 'utf8', function (err, data) {
        res.send(data);
        //res.end( data );
    });
    // 用algolia index导出来代替本地文件读取（这个操作是出现在首屏加载，用来首次获取数据列表，但是这样反而增加首屏加载时间）
    // const index_indicatorList = searchClient.initIndex('indicatorList');
    // let hits = [];
    // index_indicatorList.browseObjects({
    //     batch: batch => {
    //     hits = hits.concat(batch);
    //     }
    // }).then(() => res.send(hits));
 });
app.get('/api/stocksList', (req, res) => {
    fs.readFile( dataPath+'stocksList.json', 'utf8', function (err, data) {
        res.send(data);
        //res.end( data );
    });
});
app.get('/api/indexsList', (req, res) => {
    fs.readFile( dataPath+'indexsList.json', 'utf8', function (err, data) {
        res.send(data);
        //res.end( data );
    });
});

app.get('/api/strategiesJSON', (req, res) => {
    fs.readFile( dataPath+'btv3_strategies.json', 'utf8', function (err, data) {
        res.send(data);
        //res.end( data );
    });
});

// 寻找静态文件夹
//app.use(serveStatic(path.join(__dirname, 'dist')))    //自带gzip
app.use(express.static(path.join(__dirname, 'dist')))

// 中间件：

// 设置响应头来针对/ai路径禁用缓存
// 备选方案：
//  const nocache = require('nocache');
//  app.use('/ai', nocache());
app.use('/ai', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});


if (process.env.ST_ENV === "dev" || process.env.ST_ENV === undefined){
    let url =get_env("api_url",'https://h7r34cgfvh.execute-api.us-east-1.amazonaws.com/')
    app.use('/dev',proxy({
        target:url,
        changeOrigin:true,
        pathRewrite: {
            '^/dev': ''
        }
    }))

    let url2 = get_env("ai_url",'https://auto-trader-prod.herokuapp.com')
    app.use('/ai',proxy({
        target:url2,
        changeOrigin:true,
        pathRewrite: {
            '^/ai': ''
        }
    }))

    // let url3= get_env("bt_url",'https://devbt2api.sentimentrader.com/')
    let url3= get_env("bt_url",'https://bt2api.sentimentrader.com')
    app.use('/bt',proxy({
        target:url3,
        ws: true,
        changeOrigin:true,
        pathRewrite: {
            '^/bt': ''
        }
    }))
}else if(process.env.ST_ENV === "prod"){
    // app.use("/dev",proxy(get_env("API_URL",`http://18.216.210.200/dev`)))
    let url = get_env("api_url",'https://devbt2api.sentimentrader.com/')
    app.use('/dev',proxy({
        target:url,
        changeOrigin:true,
        pathRewrite: {
            '^/dev': ''
        }
    }))

    let url2 = get_env("ai_url",'https://ai.sentdevsite.com')
    app.use('/ai',proxy({
        target:url2,
        changeOrigin:true,
        pathRewrite: {
            '^/ai': ''
        }
    }))

    // let url3= get_env("bt_url",'https://devbt2api.sentimentrader.com/')
    let url3= get_env("bt_url",'https://bt2api.sentimentrader.com')
    app.use('/bt',proxy({
        target:url3,
        ws: true,
        changeOrigin:true,
        pathRewrite: {
            '^/bt': ''
        }
    }))
}



var port = process.env.PORT || 5001
app.listen(port)
console.log('server started ' + port)