const multer = require('multer');
const { failCode, notFoundCode } = require('./response');

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const { folder } = req.query;
    cb(null, `${process.cwd()}/public/img/${folder}/`);
  },
  filename: (_req, file, cb) => {
    const date = new Date();
    const newName = `${date.getTime()}_${file.originalname}`;
    cb(null, newName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      return failCode(req.res, 'Only .png, .jpg and .jpeg format allowed!');
    }
  },
}).single('file');

const uploadSingle = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return notFoundCode(res);
    } else {
      next();
    }
  });
};

module.exports = uploadSingle;
