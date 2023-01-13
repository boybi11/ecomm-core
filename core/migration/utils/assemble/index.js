const moment    = require('moment')
const fs        = require('fs')
const utils     = require('./utils')

class MigrationAssembler {

    assembleMigrationFile = (filename, tablename, schema) => {
        const ufn = `${ moment().unix() }_${ filename || "migration" }`
        return new Promise((resolve) => {
            fs.writeFile(`db_dump/migrations/${ ufn }.js`, utils.migration.create(tablename, schema), 'utf-8', function(err, data) {
                if (err) {
                    console.log(err)
                    process.exit()
                }
                console.log("\x1b[32m%s\x1b[0m", `${ ufn } migration created!`)
                resolve("Done!")
            })
        })
    }

    reverseMigration = async (tablename, con) => {
        const schemas = await utils.migration.reverse(tablename, con)
        await Promise.all(
            schemas.map(async (schema, index) => {
                const filename = `reverse_create_${ tablename[index] }`
                await this.assembleMigrationFile(filename, tablename[index], schema)
            })
        )
        process.exit()
    }

    assembleSeederFile = async (filename, tablename, schema) => {
        const ufn = `${ moment().unix() }_${ filename || "seed" }`
        return await new Promise((resolve) => {
            fs.writeFile(`db_dump/seeders/${ ufn }.js`, utils.seeder.create(tablename, schema), 'utf-8', function(err, data) {
                if (err) {
                    console.log(err)
                    process.exit()
                }
                console.log("\x1b[32m%s\x1b[0m", `${ ufn } seeder created!`)
                resolve("Done!")
            })
        })
    }

    reverseSeeder = async (tablename, con) => {
        if (tablename) {
            const schema = await utils.seeder.save(tablename, con)
            await this.assembleSeederFile(`reversed_${ tablename }`, tablename, schema)
            process.exit()
        }
        else {
            console.log("\x1b[31m%s\x1b[0m", "Table name is required!")
            process.exit(1)
        }
    }
}

module.exports = new MigrationAssembler