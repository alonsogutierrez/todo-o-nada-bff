const multer = require('multer');
const path = require('path');
const fs = require('fs');

const logger = console;

__dirname = path.resolve();
const excelFilter = (req, file, cb) => {
    if (
        file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml") ||
        file.mimetype.includes("png") ||
        file.mimetype.includes("jpg")
    ) {
        cb(null, true);
    } else {
        cb("Please upload only excel file.", false);
    }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info('dirname: ', __dirname);
    const path = `/src/uploads/`;
    fs.mkdirSync(__dirname + path, { recursive: true });
    return cb(null, __dirname + path);
  },
  filename: (req, file, cb) => {
    logger.info('file upload, filename -> ', file.originalname);
    return cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadFile = multer({ storage: storage, fileFilter: excelFilter });

module.exports = uploadFile;
