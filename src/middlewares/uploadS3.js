const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require('multer')

const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
});

const uploadS3 = multer({

    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'todo-o-nada-imagenes',
        metadata: (req, file, callBack) => {
            callBack(null, { fieldName: file.fieldname })
        },
        key: (req, file, callBack) => {
            const fullPath = 'images/' + file.originalname; //If you want to save into a folder concat de name of the folder to the path
            callBack(null, fullPath)
        }
    }),
    limits: { fileSize: 2000000 },
}).array('pictures', 3);


exports.uploadImagesS3 = async (req, res) => {


    uploadS3(req, res, (error) => {
        console.log('files', req.files);
        if (error) {
            console.log('errors', error);
            res.status(500).json({
                status: 'fail',
                error: error
            });
        } else {
            // If File not found
            if (req.files === undefined) {
                console.log('uploadProductsImages Error: No File Selected!');
                res.status(500).json({
                    status: 'fail',
                    message: 'Error: No File Selected'
                });
            } else {
                // If Success
                let fileArray = req.files,
                    fileLocation;
                const images = [];
                for (let i = 0; i < fileArray.length; i++) {
                    fileLocation = fileArray[i].location;
                    console.log('filenm', fileLocation);
                    images.push(fileLocation)
                }
                // Save the file name into database
                return res.status(200).json({
                    status: 'ok',
                    filesArray: fileArray,
                    locationArray: images
                });

            }
        }
    })
};
