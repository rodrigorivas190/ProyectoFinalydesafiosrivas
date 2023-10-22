import multer from 'multer';

export const uploadGeneric = (destination) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, destination);
        },
        filename: function (req, file, cb) {
        cb(null, file.originalname);
        },
    });
    return multer({ storage });
}