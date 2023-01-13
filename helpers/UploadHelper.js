//helper
const GeneralHelper = require('./GeneralHelper')
const multer = require('multer')

class UploadHelper {

    initUpload(type = "assets") {
        
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `uploads/${type}/`)
            },
            filename: function (req, file, cb) {
                cb(null, GeneralHelper.randomStr(50) + '-' + file.originalname)
            }
        })
            
        const upload = multer({ storage })

        return upload
    }
}

module.exports = new UploadHelper