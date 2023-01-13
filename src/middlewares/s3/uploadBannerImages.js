const AWS = require('aws-sdk');
const multerS3 = require('multer-s3-transform');
const multer = require('multer');
const sharp = require('sharp');

const s3 = new AWS.S3({
  accessKeyId: process.env.SECRET_KEY_AWS_ID,
  secretAccessKey: process.env.SECRET_KEY_AWS_ACCESS,
});

const S3_BASE_URL = process.env.S3_BASE_URL;
const S3_BANNER_IMAGES_PATH = process.env.S3_BANNER_IMAGES_PATH;

const logger = console;

const multerOptions = {
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: 'todo-o-nada-imagenes',
    metadata: (req, file, callBack) => {
      callBack(null, { fieldName: file.fieldname });
    },
    key: (req, file, callBack) => {
      const fullPath = S3_BANNER_IMAGES_PATH + file.originalname; //If you want to save into a folder concat de name of the folder to the path
      callBack(null, fullPath);
    },
    shouldTransform: true,
    transforms: [
      {
        id: 'original',
        key: function (req, file, cb) {
          cb(null, S3_BANNER_IMAGES_PATH + file.originalname);
        },
        transform: function (req, file, cb) {
          //Perform desired transformations
          console.log('Transform with sharp');
          cb(null, sharp().resize(1200, 800).jpeg());
        },
      },
    ],
  }),
  limits: { fileSize: 20000000 },
};

const multerS3Instance = multer(multerOptions);

const uploadBannerS3 = multerS3Instance.array('images', 2);

exports.handleBannerImages = async (req, res, next) => {
  try {
    const startTime = Date.now();
    console.log('REQ.FILE:', req.file);
    uploadBannerS3(req, res, (error) => {
      const durationMulterTime = Date.now() - startTime;
      logger.log(
        'Duration multer execution and transform: ',
        durationMulterTime / 1000 + ' seconds'
      );
      if (error) {
        logger.error('handleBannerImages Error: ', error);
        res.status(500).json({
          status: 'fail',
          error: error,
        });
      } else {
        if (!req.files) {
          logger.log('handleBannerImages Error: No File Selected!');
          res.status(500).json({
            status: 'fail',
            message: 'Error: No File Selected',
          });
        } else {
          let fileArray = req.files,
            fileLocation;
          console.log('fileArray: ', fileArray);
          const images = [];
          fileArray.forEach((file) => {
            urlFile =
              S3_BASE_URL + '/' + S3_BANNER_IMAGES_PATH + file.originalname;
            logger.log('urlFile', urlFile);
            images.push(urlFile);
          });
          logger.log({
            status: 'ok',
            filesArray: fileArray,
            locationArray: images,
          });
          req.imagesS3Service = {
            status: 'ok',
            filesArray: fileArray,
            locationArray: images,
          };
          next();
        }
      }
    });
  } catch (err) {
    logger.error('Error in handleBannerImages Middleware: ', err.message);
  }
};
