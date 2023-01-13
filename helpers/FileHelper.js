const fs = require('fs')

class FileHelper {

    read = (path) => {
        return new Promise(resolve => {
            fs.readdir(path, async (err, filenames) => {
                if (err) throw err
                else resolve(filenames)
            })
        })
    }

    removeFile = (path) => {
        fs.unlinkSync(path)
    }
}

module.exports = new FileHelper