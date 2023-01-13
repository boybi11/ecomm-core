const axios         = require('axios')
const fs            = require('fs')
const multer        = require('multer')
const os            = require('os')
const GeneralHelper = require('../helpers/GeneralHelper')

class UploadMiddleware {

    initUpload = (type = "assets") => {
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

    uploadInTemp () {
        return multer({ dest: `uploads/temp/` })
    }

    async getFromUrl(req, res, next) {
        const token = req.get('Authorization')

        if (!token) res.status(403).send({ message: "Unauthorized request" })
        else {
            const fileToDownload="https://freepngimg.com/thumb/mario/20698-7-mario-transparent-background.png"
            const request = await axios.get(fileToDownload, { responseType: 'arraybuffer' })
            const imgbase64 = Buffer.from(request.data, 'binary').toString('base64')
            let fileExtension

            switch(imgbase64.charAt(0)) {
                case '/' :
                    fileExtension = "jpg"
                    break
                case 'i' :
                    fileExtension = "png"
                    break
                case 'R' :
                    fileExtension = "gif"
                    break
                case 'U' :
                    fileExtension = "webp"
                    break
                default: break
            }

            const test = await new Promise(resolve => {
                                        const filePath = `./uploads/assets/out.${ fileExtension }`
                                        fs.writeFile(filePath, imgbase64, 'base64', function(err) {
                                            const stat = fs.statSync(filePath)
                                            // console.log(stat)
                                            resolve(stat)
                                        })
                                    })
            console.log(test)            
            req.body.file = 123
            next()
        }
    }
}

module.exports = new UploadMiddleware