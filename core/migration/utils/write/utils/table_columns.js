class TableColumns {

    process = async (fields, table, con) => {

        return await Promise.all(fields.map(async field => {
            switch(field.action) {
                case "update":
                    await this.updateColumn(field, table, con)
                    return 1
                case "drop":
                    await this.dropColumn(field, table, con)
                    return 1
                default:
                    await this.addColumn(field, table, con)
                    return 1
            }
        }))
    }

    addColumn = async (field, table, con) => {
        let qry         = `ALTER TABLE ${ table } ADD `
        const type      = field.type || "varchar"
        const size      = field.size || ( type === "varchar" && !field.size ? 255 : '' )
        qry             += `${ field.name } ${ type }${ size ? `(${ size })` : ''}`
        qry             + this.generateColumnConfig(field)

        return await con.query(qry)
                        .catch(err => {
                            console.log("\x1b[31m%s\x1b[0m", "Migration stopped!")
                            console.log(err)
                            con.release()
                            process.exit(1)
                        })
    }

    updateColumn = async (field, table, con) => {
        let qry         = `ALTER TABLE ${ table } `
        const type      = field.type || "varchar"
        const size      = field.size || ( type === "varchar" && !field.size ? 255 : '' )

        if (field.rename) qry += `CHANGE ${ field.name } ${ field.rename } ${ type }${ size ? `(${ size })` : ''}`
        else qry += `MODIFY COLUMN ${ field.name } ${ type }${ size ? `(${ size })` : ''}`

        qry += this.generateColumnConfig(field)

        return await con.query(qry)
                        .catch(err => {
                            console.log("\x1b[31m%s\x1b[0m", "Migration stopped!")
                            console.log(err)
                            con.release()
                            process.exit(1)
                        })
    }

    dropColumn = async (field, table, con) => {
        return await con.query(`ALTER TABLE ${ table } DROP COLUMN ${ field.name }`)
                        .catch(err => {
                            console.log("\x1b[31m%s\x1b[0m", "Migration stopped!")
                            console.log(err)
                            con.release()
                            process.exit(1)
                        })
    }

    generateBatchAddQry = (fields) => {
        return fields
                .map(field => {
                    const type      = field.type || "varchar"
                    const size      = field.size || ( type === "varchar" && !field.size ? 255 : '' )
                    let fieldConf   = `${ field.name } ${ type }${ size ? `(${ size })` : ''}`
                    fieldConf       += this.generateColumnConfig(field)

                    return fieldConf
                })
                .join(',')
    }

    generateColumnConfig = (field) => {
        let qry                 = ''
        const defaultCondition  = ((isNaN(field.default) && field.default) || !isNaN(field.default)) && !field.autoIncrement
        const isText            = field.type && field.type.includes("text")

        if (isText && !field.collate) field.collate = "utf8mb4_unicode_ci"

        if (field.autoIncrement)                    qry += " NOT NULL AUTO_INCREMENT"
        if (field.notNull && !field.autoIncrement)  qry += " NOT NULL"
        if ( defaultCondition )                     qry += ` DEFAULT ${ parseDefaultValue(field.default) }`
        if (field.name === "created_at")            qry += ' ON UPDATE CURRENT_TIMESTAMP'
        if (field.collate)                          qry += ` COLLATE ${ field.collate }`

        if (field.primary || field.autoIncrement)   qry += `, PRIMARY KEY (${ field.name })`
        
        return qry
    }
}

const parseDefaultValue = (value) => {
    
    switch(value) {
        case "CURRENT_TIMESTAMP": return value
        default:
            if (isNaN(value)) return `"${ value.replace(/'/g, '') }"`
            else return +value
    }
}

module.exports = new TableColumns