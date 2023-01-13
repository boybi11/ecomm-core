const utils = require('./utils')
const pool = require('../../core/dbconnect')

if (process.env.npm_config_create) {
    const filename  = process.env.npm_config_file
    const tablename = process.env.npm_config_table
    const reverse   = process.env.npm_config_reverse
    
    if (process.env.npm_config_seed) {
        if (reverse === "true") {
            pool.promise().getConnection()
                .then(async con => await utils.assemble.reverseSeeder(tablename, con))
        }
        else utils.assemble.assembleSeederFile(filename, tablename)
    }
    else {
        if (reverse === "true") {
            if (tablename) {
                pool.promise().getConnection()
                    .then(async con => await utils.assemble.reverseMigration(tablename.split(','), con))
            }
            else {
                console.log("\x1b[31m%s\x1b[0m", "Migration Aborted!")
                console.log("\x1b[31m%s\x1b[0m", "--table=TABLE_NAME is required")
                process.exit(1)
            }
        }
        else utils.assemble.assembleMigrationFile(filename, tablename)
    }
}
else {
    let rollback = process.env.npm_config_rb
    // INITIALIZE DATABASE
    utils.writer.initDB().then(async () => {
        const con = await pool.promise().getConnection()
                            .then(con => con)
                            .catch(err => {
                                console.log(err)
                                process.exit()
                            })

        if (process.env.npm_config_rst === "true") {
            await con.query("DROP TABLE migrations; DROP TABLE oxen_queue; DROP TABLE seeders;")
            console.log("\x1b[33m%s\x1b[0m", "RESET!")
            process.exit()
        }
        else {
            rollback = utils.reader.rollback(rollback)

            // INITIALIZE ESSENTIAL TABLES
            if (!(await utils.reader.checkTable("migrations", con))) await utils.writer.migrations.init(con)
            if (!(await utils.reader.checkTable("seeders", con))) await utils.writer.seeders.init(con)
            if (!(await utils.reader.checkTable("oxen_queue", con))) await utils.writer.initOxen() // for deprac

            await utils.reader.readFiles("migrations", con, rollback).then(async res => {
                if (res && res.length) {
                    await writeRecursive(res, 0, rollback > 0, con)
                    console.log("\x1b[34m%s\x1b[0m", `Migration${ rollback ? " rollback " : ' '}complete!`)
                }
                else console.log("\x1b[33m%s\x1b[0m", "Nothing to migrate!")
            })

            if (process.env.npm_config_seed) {
                await utils.reader.readFiles("seeders", con).then(async res => {
                    if (res && res.length) {
                        await writeRecursive(res, 0, false, con, "seeders")
                        console.log("\x1b[34m%s\x1b[0m", `Seeding complete!`)
                    }
                    else console.log("\x1b[33m%s\x1b[0m", "Nothing to seed!")
                })
            }

            con.release()
            process.exit()
        }
    })
}

async function writeRecursive (files, index, rollback, con, ref = "migrations") {
    if (files[index]) {
        const filename = files[index]
        try {
            if (ref === "migrations") await utils.writer.migrations.writeMigration(filename, rollback > 0, con)
            if (ref === "seeders") await utils.writer.seeders.writeSeeder(filename, con)
            console.log("\x1b[32m%s\x1b[0m", `${ filename } ${ ref } Done!`)

            await writeRecursive(files, index + 1, rollback, con, ref)
        }
        catch (err) {
            console.log("\x1b[31m%s\x1b[0m", "Migration Aborted!")
            console.log(err)
            await con.release()
            process.exit(1)
        }
    }
}