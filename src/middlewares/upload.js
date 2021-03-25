const multer = require("multer");
const path = require('path')

__dirname = path.resolve();
const excelFilter = (req, file, cb) => {
    if (
        file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml")
    ) {
        cb(null, true);
    } else {
        cb("Please upload only excel file.", false);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/src/uploads/");
    },
    filename: (req, file, cb) => {
        console.log('file upload, filename -> ',file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;
