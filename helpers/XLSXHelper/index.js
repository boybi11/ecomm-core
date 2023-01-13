const XLSX          = require('xlsx')
const moment        = require('moment')
const reader        = require('./utils/reader')

exports.validateFileType    = reader.validateFileType
exports.readData            = reader.readData
exports.validateValues      = reader.validateValues

exports.exportData = function (sheets, fileName) {

    function Workbook() {
        this.SheetNames = []
        this.Sheets = {}
      }
    const wb = new Workbook()

    sheets.forEach(sheet => {
        wb.SheetNames.push(sheet.sheetName)
        wb.Sheets[sheet.sheetName] = sheet.data
    })
    /* write file */
    const file = `${ fileName.toUpperCase() }.xlsx`
    XLSX.writeFile(wb, file)
}

exports.aoaToSheet = function (aoa) {
    let sheet = {}
    let lastColumn = 65
    let lastRow = aoa.length
    let objectMaxLength = [];

    aoa.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            const column = 65 + cellIndex
            sheet[`${ String.fromCharCode(column) }${ rowIndex + 1 }`] = {v: cell}
            lastColumn = lastColumn < column ? column : lastColumn
            objectMaxLength[cellIndex] = objectMaxLength[cellIndex] >= cell.length ? objectMaxLength[cellIndex] : cell.length
        })
    })

    const wscols = objectMaxLength.map((w) => ({width: w}))
    sheet['!ref'] = `A1:${ String.fromCharCode(lastColumn) }${ lastRow }`
    sheet["!cols"] = wscols;

    return sheet
}

exports.generateExportableData = async function ({ref, fields, startIndex, resolved}, customData = {}, format = "default") {
    if (ref) {
        const wb    = await reader.readData({ path: ref })
        const roa   = Object.values(wb)[0]
        let data    = []

        for(let ctr = startIndex; ctr < roa.length; ctr++) {
            let exportable = { ...customData }
            
            if (fields) {
                fields.forEach((field, index) => {
                    exportable[field] = resolved[`${ ctr }-${ index }`] || roa[ctr][index]
                })
            }
            else roa.forEach((value, index) => exportable[index] = value)

            if (format === "bullBulk") data.push({ name: moment().unix(), data: exportable })
            else data.push(exportable)
        }

        return data
    }
}