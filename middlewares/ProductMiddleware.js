const Product       = require('../models/Product')
const ProductHelper = require('../helpers/ProductHelper')
const GeneralHelper = require('../helpers/GeneralHelper')
class ProductMiddleware {

    async store (req, res, next) {
        const id = req.params && req.params.id ? req.params.id : 0
        
        if (parseFloat(req.body.original_price) < parseFloat(req.body.price) && parseFloat(req.body.original_price) > 0) {
            const errors = {
                original_price: "Original price should be higher than the price field."
            }
            
            res.status(400).send({errors})
            res.end()
        } else {
            const slug      = GeneralHelper.slugify(`${req.body.name}`)
            const duplicate = await ProductHelper.findDuplicate({ slug, id, sku: req.body.sku })

            if (duplicate.length) {
                if (duplicate.error) res.status(400).send(duplicate.error)
                else {
                    const errors = {}
                    if (duplicate.find(d => d.sku === req.body.sku)) errors.sku = "SKU is already existing"
                    if (duplicate.find(d => d.slug === slug)) errors.name = "Product name is already existing"
                    res.status(400).send({errors})
                }
            }
            else {
                req.body.slug = slug
                next()
            }
        }
    }
}

module.exports = new ProductMiddleware