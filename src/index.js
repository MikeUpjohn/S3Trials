const express = require("express");
const app = express()
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({region: 'eu-west-1'});

app.post("/upload-document", async (request, response) => {
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    const fileName = 'C:/test/Fluent Validation.pptx';
    console.log("uploading document");
    const uploadParams = {
        Bucket: 'mike-upjohn',
        Key: '',
        Body: '',
        StorageClass: 'STANDARD',
        ContentEncoding: 'base64',
        ContentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ACL: 'public-read'
    };

    let fileStream = fs.createReadStream(fileName);
    fileStream.on('error', function (error) {
        console.log("file error ", error);
    });

    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(fileName);

    console.log("got here");

    await s3.putObject(uploadParams, function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    });
});

app.listen(3005, () => console.log("Server listening on 3005"));
