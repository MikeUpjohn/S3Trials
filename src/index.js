const express = require("express");
const app = express();
const AWS = require('aws-sdk');
const fs = require('fs');
const utilities = require('./utilities/utilities.js');

AWS.config.update({region: 'eu-west-1'});
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'home-s3-admin'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

app.post("/upload-document", async (request, response) => {
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

    try {
        await s3.putObject(uploadParams, function (error, data) {
            if (error) {
                response.send(error);
            } else {
                response.send(data);
            }
        });
    }
    catch(error) {
        response.send("Error uploading!" + error);
    }

});

app.get('/update-tags', async (request, response) => {
    const params = {
        Bucket: 'mike-upjohn',
        Key: '1575380214579.txt',
    };
    let tags = [];
    let newTags = [
        {
            "Key": "Category",
            "Value": "Final Test"
        },
        {
            "Key": "Type",
            "Value": "Final Test Two"
        }];

    try {
        await s3.getObjectTagging(params, function (error, data) {
            if (error) {
                response.send(error);
            } else {
                data.TagSet = utilities.replaceTag(data.TagSet, "Category", newTags.find(x=>x.Key === "Category").Value);
                data.TagSet = utilities.replaceTag(data.TagSet, "Type", newTags.find(x=>x.Key === "Type").Value);
                params.Tagging = {
                    TagSet: []
                };

                data.TagSet.forEach((item, index) => {
                    params.Tagging.TagSet.push({
                        Key: item.Key,
                        Value: item.Value
                    });
                });

                s3.putObjectTagging(params, function(error, data) {
                   if(error) {
                       console.log(error);
                   }
                   else {
                       console.log("success");
                       console.log(data);
                   }
                });
            }
        });
        response.send("ok!");
    } catch (error) {
        response.send("Error with adding tags!" + error);
    }
});

app.listen(3005, () => console.log("Server listening on 3005"));
