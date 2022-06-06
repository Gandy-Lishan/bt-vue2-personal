// import axios from "axios"
// import qs from 'querystring'
import AWS from "aws-sdk"
//var AWS = require('aws-sdk');

var bucketName = "sentimentrader-backtestv2-dailyreturnresults";
var bucketRegion = "us-east-1";
var IdentityPoolId = 'us-east-1:a276f16b-4c8c-4252-895f-b8c738be0438';

// set the default config object

//方案1，配置IdentityPoolId，不可行
// 初始化 Amazon Cognito 凭证提供程序
AWS.config.region = bucketRegion; // 区域
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
});
let temp = AWS.config.credentials.params.IdentityId
for (;;){
    if (temp.indexOf("\"") ===-1 && temp.indexOf("\\") ===-1 && temp.indexOf("\'") ===-1){
        break;
    }
    temp = temp.replace('\\','').replace("\'","").replace("\"","")
}
AWS.config.credentials.params.IdentityId = temp
console.log(AWS.config.credentials.params.IdentityId)

//方案2，代码内配置accessKeyId和secretAccessKey，可行
// AWS.config.update({
// //   region: bucketRegion,
// //   credentials: new AWS.CognitoIdentityCredentials({
// //     IdentityPoolId: IdentityPoolId
// //   })
// });


//方案3，本地文件配置accessKeyId和secretAccessKey，可行
//AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});


//////////////////////////////
var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
  });

const s3_tool = {};
s3_tool.upload = async (params) => {
    //console.log(params)
    var uploadParams = {Bucket: bucketName, Key: params.key, Body: params.val};

    var upload = new AWS.S3.ManagedUpload({
        params: uploadParams
    });
    console.log(upload)
    var promise = upload.promise();
    return promise

};
// s3_tool.upload = async (params) => {
//     console.log(params)
//     var uploadParams = {Bucket: bucketName, Key: params.key, Body: params.val};
//     s3.upload (uploadParams, function (err, data) {
//         if (err) {
//             //console.log("Error", err);
//             return {state:-1,payload:err}
//         } if (data) {
//             console.log("Upload Success", data);
//             return {state:1,payload:data}
//         }
//     });
// };



s3_tool.getList = async () => {
    var bucketParams = {
        Bucket : bucketName,
    };
    s3.listObjects(bucketParams, function(err, data) {
        if (err) {
        console.log("Error", err);
        } else {
        console.log("Success", data);
        }
    });
}
// is abandund
// s3_tool.send_obj_server = async (params) => {
//     try {
//         console.log(params)
//         const results = await axios.post("/dev/setdata/",qs.stringify(params))
//         return results; // For unit tests.
//     } catch (err) {
//         return false
//     }
// };

//s3_tool.upload({key:'00020cd4-c288-3645-b8fa-01a4bd53cc7f/00020cd4-c288-3645-b8fa-01a4bd53cc7f_data.csv',val:'hello world'});
//s3_tool.getList();
export default s3_tool;