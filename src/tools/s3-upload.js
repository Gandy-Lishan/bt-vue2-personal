import { S3Client, PutObjectCommand, CreateBucketCommand } from "@aws-sdk/client-s3"
import axios from "axios"
import qs from 'querystring'
// import AWS from "aws-sdk"
// var configs = {
//     accessKeyId: "AKIAQHHUATOO2UK7HZFE",
//     aecretAccessKey: "NWOKrovyyhqZYU0WUeZdnArwheT2uburyZknMLyU"
// }
// AWS.config.update(configs)

const REGION = "us-east-1"; //e.g. "us-east-1"
const s3Client = new S3Client({ region: REGION });
// missing a credential object as a part of parameter in S3Client which is nessasary for authorization
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/s3-example-photo-album-full.html


const s3_tool = {};
s3_tool.send_obj_s3 = async (filename, file) => {
    let params = {
        Bucket: "sentimentrader-backtestv2-dailyreturnresults", // The name of the bucket. For example, 'sample_bucket_101'.
        Key: filename, // The name of the object. For example, 'sample_upload.txt'.
        Body: file, // The content of the object. For example, 'Hello world!".
    };

    try {
        const results = await s3Client.send(new PutObjectCommand(params));
        return results; // For unit tests.
    } catch (err) {
        return false
    }
};

s3_tool.send_obj_server = async (params) => {
    try {
        console.log(params)
        const results = await axios.post("/dev/setdata/",qs.stringify(params))
        return results; // For unit tests.
    } catch (err) {
        return false
    }
};

// uuid/uuid_date
export default s3_tool;
//s3_tool.send_obj_server();
