const moment            = require('moment')
const InventoryHistory  = require('../InventoryHistory')
const Asset             = require('../Asset')

exports.processOptions = (data) => {
    if (data.options && !Array.isArray(data.options)) {
        let variantName         = ''
        let optionCombinations  = data.options.split('--')
        
        data.options            = optionCombinations.map(combination => {
                                    const combinationArray = combination.split(':')
                                    variantName += ` (${ combinationArray[1] })`
                                    return {
                                        group: combinationArray[0],
                                        value: combinationArray[1]
                                    }
                                })

        data.variant_name = variantName
    }

    return data
}

exports.getJoinColumns = (model, data = {}) => {
    const { stock, ratings, discount } = { stock: true, ratings: true, discount: false, ...data }
    
    if (stock || ratings || discount) {

        if (stock) {
            const stockQry = "SUM(inventory_histories.quantity * IF(action = 'restock', 1, -1))"
            model.select([`${ stockQry } as stock`, `IF (${ stockQry } OR products.track_inventory = 0, 0 , 1) as is_oos`])
                            .join("inventory_histories", "inventory_histories.product_id = products.id", "left")
        }

        if (ratings) {
            model.select(["IF (AVG(product_ratings.rating), AVG(product_ratings.rating), 0) as ratings"])
                            .join("product_ratings", "product_ratings.product_id = products.id", "left")
        }

        if (discount) {
            const now            = moment().format()
            const priceBase      = "IF (products.original_price > 0 && discounted_products.amount, products.original_price, products.price)"
            const percentage     = `((${ priceBase }) * (discounted_products.amount / 100))`
            const priceDiscount  = "IF (products.original_price > 0, (products.original_price - products.price), 0)"
            const activeDiscount = `IF(discounted_products.amount, (IF (amount_type = "fixed", discounted_products.amount, ${ percentage })), ${ priceDiscount })`
            const publish_date   = `((discounted_products.publish_date <= "${ now }" AND (end_date >= "${ now }" OR end_date is NULL)) OR discounted_products.publish_date IS NULL)`
            
            model.select([`(${ priceBase } - ${ activeDiscount }) as active_price`, `${ activeDiscount } as active_discount`])
                            .join("discounted_products", `discounted_products.product_id = products.id AND discount_type = 'promotions' AND ${ publish_date }`, "left")
        }

        return model.groupBy("products.id")
    }
    
    return model
}

exports.getStock = async (data, connection) => {

    data.stock  = 0
    data.is_oos = 0
    
    if (data.children?.length) {
        const withTracking = data.children.find(c => c.track_inventory)
        if (!withTracking) data.track_inventory = 0
        else {
            const childStock = await new InventoryHistory(connection)
                                .where({ parent_id: { value: data.id }})
                                .select(["product_id", "action", "quantity", "SUM(quantity * IF(action = 'restock', 1, -1)) as stock"])
                                .first()
            data.childStock = (childStock?.stock || 0) / 1
            if (!data.childStock) data.is_oos = 1
        }
    }
    else if (data.track_inventory) {
        const result = await new InventoryHistory(connection)
                        .where({ product_id: { value: data.id }})
                        .select(["product_id", "action", "quantity", "SUM(quantity * IF(action = 'restock', 1, -1)) as stock"])
                        .first()

        data.stock = (result?.stock || 0) / 1
        if (!data.stock) data.is_oos = 1
    }

    
    
    return data
}

exports.getActivePromo = async (data, connection) => {
    const DiscountedProduct = require("../DiscountedProduct")
    const Promotion         = require("../Promotion")
    const now               = moment().format()
    const publish_date      = `(publish_date <= "${ now }" AND (end_date >= "${ now }" OR end_date is NULL))`
    data.promo              = []

    const discountedProducts = await new DiscountedProduct(connection)
                                        .with("promo")
                                        .where({
                                            product_id: {value: data.id},
                                            discount_type: {value: "promotions"}
                                        })
                                        .whereRaw(publish_date)
                                        .get()

    if (discountedProducts && !discountedProducts.error) data.promo = [ ...discountedProducts ]

    const promotions = await new Promotion(connection)
                                .where({ apply_to: { value: "all" } })
                                .whereRaw(publish_date)
                                .get()

    if (promotions && !promotions.error) data.promo = [ ...promotions ].map(promo => ({
                                                        amount: promo.discount_all,
                                                        publish_date: promo.publish_date,
                                                        end_date: promo.end_date,
                                                        promo
                                                    }))

    return data
}

exports.getAssets = async (data, connection) => {
    if (data.images) data.assets = await new Asset(connection).whereIn({ id: data.images.split(':') }).get()
    return data
}