const XLSX          = require('xlsx')
const fs            = require('fs')
const path          = require('path')
const acceptedTypes = require('../accepted_types.json')
const { validate }  = require('../../ValidationHelper')

exports.validateFileType = function (file) {
    const ext = path.extname(file.originalname).replace('.', '')
    return acceptedTypes[ext]
}

exports.readData = function (file) {
    return new Promise(function (resolve) {
        const filePath = file.path
        fs.readFile(filePath, "binary", (err, data) => {
            if (!err) {
                let result      = {}
                const workbook  = XLSX.read(data, {type: 'binary'})
                workbook.SheetNames.forEach(function (sheetName) {
                    const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1})
                    if (roa.length) result[sheetName] = roa
                })

                resolve(result)
            }
            else resolve({ error: "Could not read data from path." })
        })
    })
}

exports.validateValues = function (rows, rules, template) {
    let errors = []
    const { validations, rowStartIndex } = rules

    if (validations) {
        let header = template ? ( rules.rowHeader.toString() ? template[rules.rowHeader] : [] ) : []
        if (!header.length) header = Object.keys(validations).map((value, index) => String.fromCharCode(65 + index))

        rows.forEach((values, rowIndex) => {
            if ((rowStartIndex && rowStartIndex <= rowIndex) || !rowStartIndex) {
                let rowObj = {}
                
                header.forEach((head, headIndex) => {
                    rowObj[headIndex] = validations[headIndex] && validations[headIndex].type === "number" ? +values[headIndex] : values[headIndex]
                })

                const validationResult = validate(rowObj, { properties: validations })
                if (!validationResult.valid) {
                    Object.keys(validationResult.errors).forEach(columnIndex => {
                        
                        errors.push({
                            row: rowIndex + 1,
                            column: columnIndex,
                            header: header[columnIndex],
                            currentValue: values[columnIndex],
                            message: validationResult.errors[columnIndex],
                            validationRule: validations[columnIndex]
                        })
                    })
                }
            }
        })
    }

    return errors
}