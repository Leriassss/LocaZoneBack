const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/houses');
  },
  filename: (req, file, callback) => {
    console.log(' ff ----------------------')
    console.log(file.fieldname)
    file.fieldname = file.fieldname +'_'+ Date.now()+'.' + MIME_TYPES[file.mimetype];
    callback(null, file.fieldname);
  }
});

module.exports = multer({storage: storage}).any()
