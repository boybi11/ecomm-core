class Indexes {

    process = async (indexes, table, con) => {
        let indexQry = []

        if (indexes && indexes.length) {
            indexQry = indexes.map(index => {
                        let action      = (index.action || "CREATE").toUpperCase()
                        const indexName = Array.isArray(index.columns) ? index.columns.join("__") : index.columns
                        let qry         = `${ action } INDEX ${ indexName } ON ${ table }`

                        if (action === "CREATE") qry += ` (${ indexName.replace(/__/g, ',') })`
                        return qry
                        
                    }).join(';') + ';'
        }
        return await con.query(indexQry)
                        .catch(async err => {
                            console.log(12332323)
                            throw(err)
                        })
    }
}

module.exports = new Indexes