/**
 *	2.2.0
 *	aws s3 upload tool initiation, data will store in S3 bucket before a backtest start running
 */
import AWS from "aws-sdk"

var bucketName = "sentimentrader-backtestv2-dailyreturnresults";
var bucketRegion = "us-east-1";
var IdentityPoolId = 'us-east-1:a276f16b-4c8c-4252-895f-b8c738be0438';

// set the default config object

//plan A，setup IdentityPoolId
// initiate Amazon Cognito
AWS.config.region = bucketRegion; // 区域
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
});
let temp = AWS.config.credentials.params.IdentityId
if(temp){
    for (;;){
        if (temp.indexOf("\"") ===-1 && temp.indexOf("\\") ===-1 && temp.indexOf("\'") ===-1){
            break;
        }
        temp = temp.replace('\\','').replace("\'","").replace("\"","")
    }
}

AWS.config.credentials.params.IdentityId = temp
// console.log(AWS.config.credentials.params.IdentityId)

//plan b，setup accessKeyId & secretAccessKey，it works
// AWS.config.update({
// //   region: bucketRegion,
// //   credentials: new AWS.CognitoIdentityCredentials({
// //     IdentityPoolId: IdentityPoolId
// //   })
// });


//plan c，setup accessKeyId & secretAccessKey in local config file，it works
//AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'default'});


//////////////////////////////
var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
  });

const s3_tool = {};
s3_tool.upload = async (params) => {
    var uploadParams = {Bucket: bucketName, Key: params.key, Body: params.val};

    var upload = new AWS.S3.ManagedUpload({
        params: uploadParams
    });
    var promise = upload.promise();
    return promise

};

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

export default s3_tool;