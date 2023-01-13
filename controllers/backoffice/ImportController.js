const BaseController    = require('../../core/BaseController')
const XLSXHelper        = require('../../helpers/XLSXHelper')

class ImportController extends BaseController {

    validate = async (req, response) => {
        const {
            body: {
                rules,
                template
            },
            file
        }                   = req
        const isValid       = XLSXHelper.validateFileType(file)
        if (isValid) {
            const roa           = await XLSXHelper.readData(file)
            const firstSheet    = Object.values(roa)[0]
            const result        = XLSXHelper.validateValues(firstSheet, JSON.parse(rules), JSON.parse(template))

            this.response({ result, roa: firstSheet.length, ref: file.path }, response)
        }
        else this.sendError("Invalid file type", response)
    }
}

module.exports = new ImportController