const multer = require('multer');
const path = require('path');

// Configure disk storage for images and videos
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/';

        // Set different directories for images and videos
        if (file.mimetype.startsWith('image')) {
            folder += 'images';
        } else if (file.mimetype.startsWith('video')) {
            folder += 'videos';
        }
        console.log('Storing file in:', folder);
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        const ext =  file.mimetype.split('/')[1];
        const fileName = `${file.fieldname}-${Date.now()}.${ext}`;
        cb(null, fileName);
    }

});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image', 'video'];
    const fileType = file.mimetype.split('/')[0];

    if (allowedTypes.includes(fileType)) {
        return cb(null, true);
    } else {
        return cb(new Error('The file must be an image or a video'), false);
    }
};

// Configure Multer for image and video uploads
const upload = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100 MB file size limit
    },
});

module.exports = upload;