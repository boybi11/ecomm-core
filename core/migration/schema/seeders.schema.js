module.exports = {
    table: "seeders",
    fields: [
        {
            name: "id",
            type: "bigint",
            autoIncrement: true,
            primary: true
        },
        { name: "file_name" },
        {
            name: "created_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP"
        }
    ]
}