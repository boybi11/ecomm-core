const fs        = require('fs')
const config    = require('../../../config')

class MigrationReader {

    checkDB = async (con) => {
        console.log("\x1b[33m%s\x1b[0m", `Evaluating ${ config.DB.database } Database...`)
        const result = await con.query(`SELECT * from information_schema.SCHEMATA WHERE SCHEMA_NAME = "${ config.DB.database }"`)
                                .catch(err => {
                                    console.log("\x1b[31m%s\x1b[0m", "Migration Aborted!")
                                    console.log(err)
                                    con.release()
                                    process.exit(1)
                                })

        return result && result[0].length ? result[0][0] : null
    }

    rollback = (count) => {
        let rollbackCount
        if (count === "true" || process.env.npm_config_file) rollbackCount = 1
        else if (count === "false" || count === undefined)  rollbackCount = 0
        else if (count === "all") rollbackCount = 99999999999
        else rollbackCount = +count
        
        if (count === "all") console.log("\x1b[33m%s\x1b[0m", `Rolling back all migrations!`)
        else if (rollbackCount) console.log("\x1b[33m%s\x1b[0m", `Rolling back last ${ rollbackCount > 1 ? `${ rollbackCount } ` : '' }migration${ rollbackCount > 1 ? 's' : '' }!`)
        
        return rollbackCount
    }

    checkTable = async (tableName, con) => {
        console.log("\x1b[33m%s\x1b[0m", `Evaluating ${ tableName } table...`)
        const result = await con.query(`SELECT * from information_schema.TABLES WHERE TABLE_SCHEMA = "${ config.DB.database }" AND TABLE_NAME = "${ tableName }"`)
                                .catch(err => {
                                    console.log("\x1b[31m%s\x1b[0m", "Migration Aborted!")
                                    console.log(err)
                                    con.release()
                                    process.exit(1)
                                })

        return result && result[0].length ? result[0][0] : null
    }

    readFiles = async (table, con, rollback = 0) => {
        return new Promise(async (resolve) => {
                    fs.readdir(`db_dump/${ table }/`, async (err, filenames) => {
                        if (err) throw err
                        if (rollback) {
                            const targetFile    = process.env.npm_config_file
                            const rollbackCount = targetFile ? 1 :( rollback > filenames.length ? filenames.length : rollback )
                            const targetFiles   = targetFile && filenames && filenames.includes(targetFile) ? [ targetFile ] : filenames
                            const files         = await this.filterFiles(table, targetFiles, con, true)
                            
                            resolve(files.reverse().splice(0, rollbackCount))
                        }
                        else resolve(await this.filterFiles(table, filenames, con))
                    })
                })
    }

    filterFiles = async (table, filenames = [], con, included = false) => {
        let filteredFiles = []
        
        if (filenames.length) {
            const migrations = await con.query(`SELECT * from ${ table }`)
                                        .then(res => res[0].map(m => m.file_name))
                                        .catch(err => {
                                            console.log("\x1b[31m%s\x1b[0m", "Migration Aborted!")
                                            console.log(err)
                                            con.release()
                                            process.exit(1)
                                        })

            filenames.forEach(filename => {
                if (migrations.includes(filename) === included) filteredFiles.push(filename)
            })
        }
        return filteredFiles
    }
}

module.exports = new MigrationReader