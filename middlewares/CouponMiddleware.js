const moment = require('moment')
const DiscountedProduct = require('../models/DiscountedProduct')
const Coupon = require('../models/Coupon')

// helpers
const GeneralHelper = require('../helpers/GeneralHelper')

class CouponMiddleware {
    store = async (req, res, next) => {
        const id = req.params && req.params.id ? req.params.id : 0
        
        if (req.body.coupon_type === "product") req.body.shipping_discount = 0
        else if (req.body.coupon_type === "shipping") req.body.value = 0

        if (req.body.auto_generated) {
            let duplicate
            let codes = []
            do {
                codes = [ ...Array(+req.body.generate_number) ].map(() => (req.body.code + '-' + GeneralHelper.randomStr(10)))
                duplicate = await new Coupon().whereIn({code: codes}).first()
                if (duplicate && duplicate.error) break
            } while(duplicate)
            
            if (duplicate && duplicate.error) {
                res.status(400).send(duplicate.error)
                res.end()
            }
            else {
                req.body = codes.map(code => ({ ...req.body, code }) )
                next()
            }
            
        }
        else {
            const duplicate = await new Coupon().whereRaw(`(code='${req.body.code}' AND id!=${id})`).first()
            if (duplicate) {
                let errorResponse = { errors: { code: "Coupon code is already in use." }, message: "Coupon code is already existing." }
                if (duplicate.error) errorResponse = duplicate.error
                res.status(400).send(errorResponse)
                res.end()
            }
            else {
                req.body = [ req.body ]
                next()
            }
        }
    }

    prepareProducts = async (req, res, next) => {
        
        const mapOutProducts = ({products, publish_date, end_date}) => {
            return products.map(p => ({
                product_id: p.id,
                ref_id: req.params.id ? req.params.id : 0,
                discount_type: "coupons",
                amount: p.amount ? p.amount : 1,
                publish_date: publish_date ? moment(publish_date).format('YYYY-MM-DDT00:00:00.000Z') : null,
                end_date: end_date ? moment(end_date).format('YYYY-MM-DDT23:59:00.000Z') : null
            }))
        }

        if (Array.isArray(req.body)) {
            req.body = req.body.map(code => {
                            if (code.apply_to === "all") code.products = []
                            else if (code.products && code.products.length) code.products = mapOutProducts(code)

                            return code
                        })
        }
        else {
            if (req.body.apply_to === "all") req.body.products = []
            else if (req.body.products && req.body.products.length) req.body.products = mapOutProducts(req.body)
            
            if (req.params.id) await new DiscountedProduct().where({ discount_type: { value: "coupons" }, ref_id: {value: req.params.id} }).delete([])
        }

        next()
    }

    removeProducts = async (req, res, next) => {
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) await new DiscountedProduct()
                                                                        .where({ discount_type: { value: "coupons" } })
                                                                        .whereIn({ ref_id: ids })
                                                                        .delete([])

        next()
    }
}

module.exports = new CouponMiddleware