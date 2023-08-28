const Product           = require('../../models/Product')
const InventoryHistory  = require('../../models/InventoryHistory')
const UnitOfMeasure     = require('../../models/UnitOfMeasure')

// helpers
const GeneralHelper = require('../GeneralHelper')
const filters       = require('./filter.helper')
const imports       = require('./import.helper')
const variants      = require('./variant.helper')
class ProductHelper {
    filters = () => ({
        "avgRating": filters.ratings,
        ...filters
    })

    findDuplicate = async ({ slug, sku, id }) => {
        let duplicate = new Product()
                            .select([ "id", "slug", "sku" ])
                            .whereRaw(`(sku = '${ sku }' OR slug = '${ slug }')`)

        if (+id) duplicate = duplicate.where({ id: { value: id, operation: "!=" }})
        
        return await duplicate.get()
    }

    generateSorting(products, sort) {
        if (sort && Array.isArray(sort) && sort.length === 2) products = products.orderBy(sort[0], sort[1])
        else products = products.orderBy("products.id", "DESC")

        return products
    }

    async saveUoMs(productId, uoms = []) {
        if (productId) {
            await new UnitOfMeasure()
                .where({ product_id: { value: productId } })
                .delete([])
                
            if (uoms.length) {
                const newUoms = uoms.map(uom => ({ ...uom, ...{ product_id: productId} }) )
                await new UnitOfMeasure().create(newUoms)
            }
        }
        
        return true
    }

    async saveRelationships (productId, requestBody) {
        const uoms      = requestBody.uoms
        const variants  = requestBody.variants ? Object.values(requestBody.variants) : {}
        
        await this.saveUoMs(productId, uoms)
        await this.saveChildren({ productId, name: requestBody.product.name }, variants)

        if (requestBody.stock) {
            const restockData = {
                product_id: productId,
                quantity: requestBody.stock,
                action: "restock"
            }

            await new InventoryHistory().create(restockData)
        }
        
        return true
    }

    saveFromImport = imports.saveFromImport
    saveVariants = variants.saveVariants
    saveChildren = variants.saveChildren
}

module.exports = new ProductHelper