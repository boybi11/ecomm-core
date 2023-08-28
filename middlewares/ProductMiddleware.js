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
            return res.end()
        } else {
            const slug      = GeneralHelper.slugify(`${req.body.name}`)
            const duplicate = await ProductHelper.findDuplicate({ slug, id, sku: req.body.sku })

            if (duplicate.length) {
                if (duplicate.error) res.status(400).send(duplicate.error)
                else {
                    const errors = {}
                    if (duplicate.find(d => d.sku === req.body.sku)) errors.sku = "SKU is already existing"
                    if (duplicate.find(d => d.slug === slug)) errors.name = "Product name is already existing"
                    return res.status(400).send({errors})
                }
            }
            else {
                req.body.slug = slug
                next()
            }
        }
    }

    async processBody (req, res, next) {
        const product = { ...req.body }
        delete product.children
        delete product.variants
        delete product.uoms
        delete product.tags
        product.with_variant = product.variants && Object.keys(product.variants).length ? 1 : 0

        if (product.parent) {
            product.name    = `${ req.body.baseProduct.name } ${ product.options.map(option => `(${ option.value })` ).join(' ')}`
            product.options = product.options.map(option => `${ option.group }:${ option.value }` ).join('--')
        }

        const newBody = {
                            product,
                            variants: req.body.variants,
                            uoms: req.body.uoms,
                            tags: req.body.tags
                        }

        req.body = newBody
        next()
    }
}

module.exports = new ProductMiddleware