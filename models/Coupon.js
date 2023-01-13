const Base = require('../core/BaseModelV2')
class Coupon extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "coupons"
        this.searchables    = [ "code" ]
        this.fillables      = {
                                "code": 'string',
                                "coupon_type": "string",
                                "value": "decimal",
                                "value_type": "string",
                                "min_spend": "decimal",
                                "usage_limit": "decimal",
                                "apply_to": "string",
                                "start_date": "datetime",
                                "end_date": "datetime",
                                "shipping_discount": "decimal",
                                "created_at": "datetime",
                                "updated_at": "datetime",
                                "deleted_at": "datetime"
                            }
    }

    discountRefs = () => this.hasMany('DiscountedProduct', 'ref_id', 'id', {where: {"discount_type": {value: "coupons"}}})

    provinces() {
        const transform = (result) => {
            if (result) {
                return result.map(r => r.province)
            }

            return result
        }

        return this.hasMany('CouponFreeShippingZone', 'coupon_id', 'id', null, transform)
    }
}

module.exports = Coupon