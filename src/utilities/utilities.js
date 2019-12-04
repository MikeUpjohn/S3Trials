const mime = require('mime-types');

const getMimeType = (fileType) => {
    var mimeType = mime.lookup(`.${fileType}`);
    if (!mimeType) {
        console.log("bad mime type");
    }

    return mimeType;
}

const replaceTag = (tagSet, tagName, tagValue) => {
    tagSet.filter(x=>x.Key === tagName).forEach((item, index)=> {
        item.Value = tagValue;
    });

    return tagSet;
}

exports.getMimeType = getMimeType;
exports.replaceTag = replaceTag;
