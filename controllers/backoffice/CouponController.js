const Coupon = require('../../models/Coupon')
const DiscountedProduct = require('../../models/DiscountedProduct')
const moment = require('moment')

const BaseController = require('../../core/BaseController')
const CouponHelper = require('../../helpers/CouponHelper')

class CouponController extends BaseController {

    get = async (req, response) => {
        let coupons = new Coupon()
                            
        const {query} = req
        coupons = this.filter(coupons, query)
        this.sort(coupons, query.sort)

        const result = await coupons.paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    store = async (req, response) => {
        const result = await new Coupon().create(req.body)
        if (result && !result.error) {
            let products =  []
            let provinces = []
            const numberOfRows = [ ...Array(result.result.affectedRows) ]
            const rowIds = []

            numberOfRows.forEach((row, index) => {
                const rowProducts =     req.body[index].products
                const rowProvinces =    req.body[index].provinces
                const rowId =           result.result.insertId + index
                
                if (rowProducts) products =     [ ...products, ...rowProducts.map(product => ({ ...product, ref_id: rowId })) ]
                if (rowProvinces) provinces =   [ ...provinces, ...rowProvinces.map( zone => ({ coupon_id: rowId, province_id: zone.id }) ) ]
            })

            if (products.length) await new DiscountedProduct().create(products)
            if (provinces.length) await CouponHelper.syncFreeShippingZones( rowIds, provinces)
        }

        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) response.status(400).send({ message: "Missing id request parameter" })

        const result = await new Coupon()
                                    .with([
                                        'discountRefs:product:asset',
                                        'provinces'
                                    ])
                                    .where({"id": {value: req.params.id}})
                                    .first()

        this.response(result, response)
    }

    update = async (req, response) => {

        if (req.params.id) {
            const couponId = req.params.id
            const result = await new Coupon()
                                        .where({id: {value: couponId}})
                                        .update(req.body)

            const provinces = req.body.provinces ? req.body.provinces.map( zone => ({ coupon_id: couponId, province_id: zone.id }) ) : []
            const products = req.body.products ? req.body.products : []

            if (products.length) await new DiscountedProduct().create(products)
            if (provinces.length) await CouponHelper.syncFreeShippingZones( couponId, provinces )

            this.response(result, response)
        }
        else response.status(400).send({ message: "Missing request parameter."})
    }

    delete = async (req, response) => {
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) {
            const result = await new Coupon().delete(ids)
            this.response(result, response)   
        }
        else response.status(400).send({ message: "Missing request parameter" })
    }
}

module.exports = new CouponController