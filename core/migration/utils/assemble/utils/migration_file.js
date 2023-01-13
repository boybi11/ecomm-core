const GeneralHelper     = require("../../../../../helpers/GeneralHelper")
const schemaStructure   = {
                            "--action": "create | delete | update (default)",
                            "--fields": [
                                {
                                    ">>name"            : "field_name",
                                    ">>rename"          : "new name (applicable for action update only)",
                                    ">>type"            : "varchar | int | datetime ... (database datatype)",
                                    ">>default"         : "default value",
                                    ">>autoIncrement"   : "true | false",
                                    ">>primary"         : "true | false",
                                    ">>notNull"         : "true | false",
                                    ">>index"           : "true | false",
                                    ">>enum"            : "value1, value2, value3.... (for enum type only)",
                                    ">>action"          : "create (default) | update | drop (if drop true all fields will be disregarded except for name)"
                                }
                            ]
                        }

exports.create = function (tablename, schema) {
                    const className = GeneralHelper.camelCase(`${ tablename }_table` || "Table", '_')
                    const streams   = ["up", "down"]
                    let content     = `class ${ className } {`

                    content += `\n\n\ttable = "${ tablename || "YOUR TABLE NAME HERE" }"`
                    //SAMPLE SCHEMA
                    content             += "\n\n\t// SAMPLE SCHEMA\n"
                    let schemacontent   = `\t//${ JSON.stringify(schemaStructure).replace(/\"--/g, '\n\t// "') }`
                    schemacontent       = schemacontent.replace(/\[\{/g, '[\n\t//\t\t{')
                    schemacontent       = schemacontent.replace(/\">>/g, '\n\t//\t\t\t"')
                    schemacontent       = schemacontent.replace(/\}\]/g, '\n\t//\t\t}\n\t//\t]\n\t//')
                    content             += schemacontent
                    // UPSTREAM AND DOWNSTREAM MIGRATION SCHEMA
                    streams.forEach(stream => {
                        content += "\n\n"
                        content += `\t${ stream }() {\n \t\t// write your ${ stream }stream table schema here \n`
                        content += `\t\t${ schema ? '' : "//" } return {\n`
                        if (schema) {
                            const indexes = Object.values(schema.indexes)
                            content +=  `\t\t\taction: "${ stream === "up" ? "create" : "drop" }",\n`
                            if (stream === "up") {
                                content +=  `\t\t\tfields: [\n`
                                Array.from(Object.keys(schema.fields), key =>{
                                    const field = schema.fields[key]
                                    content +=  `\t\t\t\t{\n`
                                    content +=  `\t\t\t\t\t"name": "${key}",\n`
                                    content +=  `\t\t\t\t\t"type": "${field.type}",\n`
                                    if (field.size) content +=  `\t\t\t\t\t"size": "${field.size}",\n`
                                    if (field.default) content +=  `\t\t\t\t\t"default": ${isNaN(field.default) ? `"${ field.default }"` : +field.default},\n`
                                    if (field.autoIncement) content +=  `\t\t\t\t\t"autoIncrement": true,\n`
                                    if (field.primary) content +=  `\t\t\t\t\t"primary": true,\n`
                                    if (field.notNull) content +=  `\t\t\t\t\t"notNull": true,\n`
                                    content +=  `\t\t\t\t},\n`
                                })
                                content +=  `\t\t\t],\n`

                                if (indexes.length) {
                                    content +=  `\t\t\tindexes: [\n`
                                    indexes.forEach(index => {
                                        content +=  `\t\t\t\t{ "columns": [ ${ index.map(column => `"${column}"`) } ] },\n`
                                    })
                                    content +=  `\t\t\t]\n`
                                }
                            }                            
                        }
                        else content +=  "\t\t//\t...schema\n"
                        content += `\t\t${ schema ? '' : "//" } }\n`
                        content += '\t}'
                    })

                    content += "\n}"
                    content += `\n\nmodule.exports = new ${ className }`
                    return content
                }

exports.reverse = async function (tablenames, con) {
                    return await Promise.all(tablenames.map(async tablename => {
                        return await con.query(`DESC ${ tablename };SHOW INDEXES FROM ${ tablename }`)
                                        .then(res => {
                                            const schema = {
                                                fields: {},
                                                indexes: {}
                                            }
                                            
                                            Array.from(res[0][0], column => {
                                                const [type, size] = column.Type.replace('(', ">>>").replace(')', '').split(">>>")
                                                
                                                schema.fields[column.Field] = {
                                                    notNull: column.Null === "NO",
                                                    type,
                                                    size,
                                                    autoIncement: column.Extra === "auto_increment",
                                                    primary: column.Key === "PRI" && column.Extra !== "auto_increment"
                                                }

                                                if (column.Default) schema.fields[column.Field].default = column.Default
                                            })
                                            
                                            
                                            Array.from(res[0][1], index => {
                                                if (index.Non_unique) {
                                                    if (!schema.indexes[index.Key_name]) schema.indexes[index.Key_name] = []
                                                    schema.indexes[index.Key_name].push(index.Column_name)
                                                }
                                            })

                                            return schema
                                        })
                                        .catch(async err => {
                                            console.log("\x1b[31m%s\x1b[0m", "Migration Aborted!")
                                            console.log(err)
                                            await con.release()
                                            process.exit(1)
                                        })
                    }))
                }