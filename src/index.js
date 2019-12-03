const express = require("express");
const app = express();
const AWS = require('aws-sdk');
const fs = require('fs');
const utilities = require('./utilities/utilities.js');

AWS.config.update({region: 'eu-west-1'});

app.post("/upload-document", async (request, response) => {
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    const fileName = 'C:\\research-and-development\\S3Trials\\sample-file.txt';
    const regex = /(?<=\.|^)[^.]+$/;
    const fileType = `.${fileName.match(regex)}`;
    const contentType = utilities.getMimeType(fileType);

    let fileStream = fs.createReadStream(fileName);
    fileStream.on('error', function (error) {
        console.log("file error ", error);
    });

    const uploadParams = {
        Bucket: 'mike-upjohn',
        Key: new Date().getTime() + fileType,
        Body: fileStream,
        StorageClass: 'STANDARD',
        ContentEncoding: 'base64',
        ContentType: contentType,
        ACL: 'public-read' // dangerous, but OK for now...
    };

    await s3.putObject(uploadParams, function (error, data) {
        if (error) {
            response.send(error);
        } else {
            response.send(data);
        }
    });

    response.send("Error uploading!");
});

app.listen(3005, () => console.log("Server listening on 3005"));
