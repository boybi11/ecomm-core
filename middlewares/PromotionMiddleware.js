
const moment = require('moment')
const DiscountedProduct = require('../models/DiscountedProduct')

class PromotionMiddleware {

    prepareProducts = async (req, res, next) => {
        const { products } = req.body
        if (products && products.length) {
            req.body.products = products.map(p => ({
                                        product_id: p.id,
                                        ref_id: req.params.id ? req.params.id : 0,
                                        discount_type: "promotions",
                                        amount: p.amount ? p.amount : 1,
                                        publish_date: req.body.publish_date ? moment(req.body.publish_date).format('YYYY-MM-DDT00:00:00.000Z') : null,
                                        end_date: req.body.end_date ? moment(req.body.end_date).format('YYYY-MM-DDT23:59:00.000Z') : null
                                    }))
        }

        if (req.params.id) await new DiscountedProduct().where({ discount_type: { value: "promotions" }, ref_id: {value: req.params.id} }).delete([])

        next()
    }

    removeProducts = async (req, res, next) => {
        const ids = req.body && req.body.ids
        if (ids && Array.isArray(ids) && ids.length > 0) {
            await new DiscountedProduct().where({ discount_type: { value: "promotions" } }).whereIn({ ref_id: ids }).delete([])

            next()
        }
        else res.status(400).send({ message: "Missing IDs request parameter." })
    }

    getScheduledProducts = async (req, response) => {
        const {query} = req
        const sDate = moment(query.publish_date).format('YYYY-MM-DD')
        const eDate = query.end_date ? moment(query.end_date).format('YYYY-MM-DD') : null
        let whereQry = `((publish_date <= '${sDate}' AND (end_date >= '${sDate}' OR end_date IS NULL)) ${!eDate ? `OR (publish_date >= '${sDate}')` : ''})`
        
        if (eDate) {
            whereQry = `(${whereQry} OR (publish_date <= '${eDate}' AND (end_date >= '${eDate}' OR end_date IS NULL)) OR (publish_date >= '${sDate}' AND end_date <= '${eDate}'))`
        }

        whereQry += `AND ref_id != ${query.ref_id ? query.ref_id : 0}`
        const result = await new DiscountedProduct()
                                    .whereRaw(whereQry)
                                    .get()

        this.response(result, response)
    }
};

module.exports = new PromotionMiddleware;