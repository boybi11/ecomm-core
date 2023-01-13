const utils = require('./utils')

class MigrationWriter {
    migrations = []

    init = async (con) => {
        const migrationSchema = require('../../schema/migrations.schema')
        await utils.tables.createTable(migrationSchema, con)
        console.log("\x1b[32m%s\x1b[0m", "Migrations table created!")
        return "Done!"
    }

    writeMigration = async (filename, rollback = false, con) => {
        if (!this.migrations.includes(filename)) {
            const tableMigration    = require(`../../../../db_dump/migrations/${ filename }`)
            const tableSchema       = tableMigration[rollback ? "down" : "up"]()
            
            switch(tableSchema.action) {
                case "create":
                    await utils.tables.createTable({ ...tableSchema, table: tableMigration.table }, con)
                    break
                case "drop":
                    await utils.tables.dropTable(tableMigration.table, con)
                    break
                default:
                    await utils.columns.process(tableSchema.fields, tableMigration.table, con)
            }

            // INDEXES migration process
            if (tableSchema.indexes && tableSchema.indexes.length && tableSchema.action !== "drop") {
                await utils.indexes.process(tableSchema.indexes, tableMigration.table, con)
            }

            if (rollback) await this.removeMigration(filename, tableMigration.table, con)
            else await this.insertMigration(filename, tableMigration.table, con)
        }
        
        return "Done!"
    }

    insertMigration = async (filename, tablename, con) => {
        return await con.query(`INSERT INTO migrations (file_name, table_name) VALUES ("${ filename }", "${ tablename }")`)
    }

    removeMigration = async (filename, tablename, con) => {
        return await con.query(`DELETE FROM migrations WHERE file_name="${ filename }" AND table_name="${ tablename }"`)
    }
}

module.exports = new MigrationWriter