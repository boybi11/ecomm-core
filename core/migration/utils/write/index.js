const settings  = require('../../../../config')
const Oxen      = require('oxen-queue')
const reader    = require('../read')

exports.initDB = () => {
    return new Promise(async resolve => {
        const mysql         = require('mysql2')
        const dbsettings    = { ...settings.DB }
        delete dbsettings.database
        const pool          = mysql
                                .createPool({
                                    multipleStatements: true,
                                    charset : 'utf8mb4',
                                    connectionLimit : 100,
                                    waitForConnections: true,
                                    queueLimit: 0,
                                    ...dbsettings,
                                })
        
        const con           = await pool.promise().getConnection()

        if (!(await reader.checkDB(con))) {
            await con.query(`CREATE DATABASE ${ settings.DB.database }`).catch(err => console.log(err))
            console.log("\x1b[32m%s\x1b[0m", "Database created!")
        }
        
        resolve("Done!")
    })
}

exports.initOxen = async () => {
    const ox = new Oxen({
                    mysql_config: settings.DB,
                    job_type: "init"
                })
    await ox.createTable()
    console.log("\x1b[32m%s\x1b[0m", "Oxen table created!")
    return "Done!"
}

exports.migrations = require('./migrations')
exports.seeders = require('./seeders')