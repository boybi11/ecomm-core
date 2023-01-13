module.exports = {
    table: "migrations",
    fields: [
        {
            name: "id",
            type: "bigint",
            autoIncrement: true,
            primary: true
        },
        { name: "file_name" },
        { name: "table_name" },
        {
            name: "created_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP"
        }
    ]
}