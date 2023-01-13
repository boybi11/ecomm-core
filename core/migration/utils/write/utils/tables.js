const columns = require('./table_columns')

class Table {
    createTable = async (schema, con) => {
        let sql = `CREATE TABLE ${ schema.table } (`

        sql += columns.generateBatchAddQry(schema.fields)
        sql += ')'
        return await con.query(sql)
                        .catch(err => {
                            console.log("\x1b[31m%s\x1b[0m", "Migration stopped!")
                            console.log(err)
                            con.release()
                            process.exit(1)
                        })
    }

    dropTable = async (table, con) => {
        return await con.query(`DROP TABLE ${ table }`)
                        .catch(err => {
                            console.log("\x1b[31m%s\x1b[0m", "Migration stopped!")
                            console.log(err)
                            con.release()
                            process.exit(1)
                        })
    }

    insertValues = async (table, schema, con) => {
        let query = `INSERT INTO \`${ table }\` (`
        query += `${ schema.columns.map(c => `\`${ c }\``)}) VALUES `
        
        query += schema.values.map((values, index) => `${ index ? ',' : '' }(${ values.map(v => `"${ v }"`).join(',').replace(/\"null\"/g, 'NULL') })`).join('')
        query += ` ON DUPLICATE KEY UPDATE ${ schema.columns.map(c => `\`${ c }\` = VALUES(\`${ c }\`)`).join(',') };`

        return await con.query(query)
    }
}

module.exports = new Table