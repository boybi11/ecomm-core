const settings  = require('../config')
const mysql     = require('mysql2')
const pool      = mysql
                    .createPool({
                        multipleStatements: true,
                        charset : 'utf8mb4',
                        connectionLimit : 100,
                        waitForConnections: true,
                        queueLimit: 0,
                        ...settings.DB
                    })
                    
// pool
//     .promise()
//     .getConnection()
//         .then(con => {
//             con
//                 .query(`SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`)
//                 .then(() => con.release())
//         })

module.exports = pool