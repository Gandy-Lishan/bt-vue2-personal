
// -------------------------------------------------------------------------------------------
// Copyright 2001 - 2021, Sundial Capital Research, Inc. All rights reserved
// -------------------------------------------------------------------------------------------
import {CIQ} from "chartiq/js/standard.js"
var config = {
    indexDataUrl : "https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/index_data",
    stockDataUrl : "https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/stock_data",
    getAllSymbols : "https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols",
    /**
     *
     * dev/pair_data: 正式版
     * prod/pair_data: 测试用
     * if(process.env.NODE_ENV == production){ todo }
     */
    // pairDataUrl: "https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/pair_data",
    pairDataUrl: "https://bt2api.sentimentrader.com/st_data/pair_data",
    indicatorMetadata:"https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/indicator_metadata",
    username:"sentimentrader_backtest_api",
    password : "TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx",

    timestampToTime : function (timestamp) {
        var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate());
        var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
        return Y+M+D;
    },

    csvFileRead : function(fileName, HASH) {
        const url = `/dev/dev/csvfileread/?fileName=${fileName}&HASH=${HASH}`

        return new Promise((resolve, reject) => {
            CIQ.axios.get(url, {withCredentials: true})
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    /********************lishan modify start*************************/
    getMyIndicatorData : function(url) {
        const path = `/dev/my_indicator/get_data/?url=${url}`
        return new Promise((resolve, reject) => {
            CIQ.axios.get(path, {withCredentials: true})
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    /********************lishan modify end*************************/
}

export {config};
