const moment            = require('moment')
const GeneralHelper     = require("../../../../../helpers/GeneralHelper")
const schemaStructure   = {
                            "--columns": "[column_name1, column_name2, ...etc]",
                            "--values": "[>>[column_value1, column_value2, ...etc],>>[column_value1, column_value2, ...etc]<<]"
                        }

exports.create = function (tablename, schema) {
    const className = GeneralHelper.camelCase(`${ tablename }_table` || "Table", '_')
    let content     = `class ${ className }Seed {`

    content += `\n\n\ttable = "${ tablename || "YOUR TABLE NAME HERE" }"`
    if (!schema) {
        //SAMPLE SCHEMA
        content             += "\n\n\t// SAMPLE SCHEMA\n"
        let schemacontent   = ` ${ JSON.stringify(schemaStructure).replace(/\"--/g, '\n\t//\t "') }`
        schemacontent       = ` \t//${ schemacontent.replace(/>>/g, '\n\t//\t\t') }`
        schemacontent       = schemacontent.replace(/\"\[/g, '[')
        schemacontent       = schemacontent.replace(/\]\"/g, ']')
        schemacontent       = ` ${ schemacontent.replace(/<<]/g, '\n\t//\t ]\n\t// ') }`
        content             += schemacontent
    }
    
    content += "\n\n"
    content += `\texec() {\n \t\t// write your seeder schema here \n`

    content += `\t\t${ schema ? '' : '// '}return {\n`
    if (schema) {
        content += `\t\t\tcolumns: [${ schema.columns.map(column => `"${ column }"`).join(',') }],\n`
        content += `\t\t\tvalues: [\n`
        schema.values.forEach(values => {
            const parsedValues = values.map(value => {
                                    if (value instanceof Date) return `"${ moment(value).format("YYYY-MM-DD HH:mm:ss") }"`
                                    return `"${ value }"`
                                }).join(',')
            content += `\t\t\t\t[${ parsedValues }],\n`
        })
        content +=  `\t\t\t]\n`
    }
    else content +=  "\t\t//\t...schema\n"
    content += `\t\t${ schema ? '' : '// '}}\n`
    
    content += '\t}'

    content += "\n}"
    content += `\n\nmodule.exports = new ${ className }Seed`
    return content
}

exports.save = async function (tablename, con) {
    const result    = await con.query(`SELECT * FROM ${ tablename }`)
    let columns     = []
    const values    = []
    
    if (result && result[0].length) {
        columns = Object.keys(result[0][0])
        
        result[0].forEach(row => {
            let insertValue = []
            columns.forEach(column => insertValue.push(row[column]))

            values.push(insertValue)
        })
    }

    return {
        columns,
        values
    }
}