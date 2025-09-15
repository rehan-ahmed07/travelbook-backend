var ImageKit = require("imagekit");

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
});


function uploadFile(file) {
    return new Promise((resolve, reject) => {
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        imagekit.upload({
            file: file.buffer,
            fileName: uniqueFileName,
            folder: '/travel-journal'
        }, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = uploadFile;