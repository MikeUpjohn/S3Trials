const mime = require('mime-types');

const getMimeType = (fileType) => {
    var mimeType = mime.lookup(`.${fileType}`);
    if (!mimeType) {
        console.log("bad mime type");
    }

    return mimeType;
}

exports.getMimeType = getMimeType;
