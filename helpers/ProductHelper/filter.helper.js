exports.relatedTo   = function (relatedTo, products) {
                        if (relatedTo) {
                            let relatedQry = ""
                            Object.keys(relatedTo).forEach(key => {
                                if (relatedTo[key]) relatedQry += `${relatedQry ? " OR" : ''} ${key} = "${relatedTo[key]}"`
                            })
                            
                            products = products.whereRaw(`(${ relatedQry })`)
                        }
                    }
exports.ids         = function (ids = [], products) {
                        if (ids.length) products.whereIn({ "products.id": ids })
                    }
exports.categories  = function (categories, products) { if (categories) products = products.whereIn({ brand_id: categories }) }
exports.brands      = function (brands, products) { if (brands) products = products.whereIn({ brand_id: brands }) }
exports.ratings     = async function (ratings, products) {
                        if (ratings) {
                            const floorRating = Math.floor(+ratings) 
                            products          = products.having(`ratings >= ${ floorRating }.00 AND ratings <= ${ floorRating }.99`)
                        }
                    }
exports.stock       = function (stock, products) {
                        if (stock) {
                            if (stock !== "untracked") {
                                products = products
                                        .where({ track_inventory: { value: 1 }})
                                        .having(`stock ${ stock === "oos" ? '=' : '>' } 0${ stock === "oos" ? " OR stock IS NULL" : ''}`)
                            }
                            else products = products.where({ track_inventory: { value: 0 }})
                        }
                    }
exports.sale        = function (sale, products) {
                        if (sale) {
                            products.having("active_discount > 0")
                        }
                    }
exports.price        = function (price, products) {
                        if (Array.isArray(price)) {
                            let query = ''
                            if (+price[0]) query += `active_price >= ${ price[0] }`
                            if (+price[1]) query += `${ query ? " AND " : '' }active_price <= ${ price[1] }`
                            
                            products.having(query)
                        }
                    }