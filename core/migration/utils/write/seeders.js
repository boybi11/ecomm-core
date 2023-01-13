const utils = require('./utils')

class SeederWriter {
    init = async (con) => {
        const seederSchema = require('../../schema/seeders.schema')
        await utils.tables.createTable(seederSchema, con)
        console.log("\x1b[32m%s\x1b[0m", "Seeders table created!")
        return "Done!"
    }

    writeSeeder = async (filename, con) => {
        const tableSeeder   = require(`../../../../db_dump/seeders/${ filename }`)
        const seeder        = tableSeeder.exec()

        await utils.tables.insertValues(tableSeeder.table, seeder, con)
        await this.insertSeeder(filename, con)
        
        return "Done!"
    }

    insertSeeder = async (filename, con) => {
        return await con.query(`INSERT INTO seeders (file_name) VALUES ("${ filename }")`)
    }
}

module.exports = new SeederWriter