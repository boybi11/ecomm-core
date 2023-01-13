const Base      = require('../core/BaseModelV2')
const Province  = require('./Province')

class CouponFreeShippingZone extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "coupon_freeshipping_zones"
        this.fillables  = {
                            "coupon_id": "int",
                            "province_id": "int"
                        }

        this.appends = ["province"]
    }

    appendProvince = async (data, connection) => {
        const result = await new Province(connection)
                                    .where({id: {value: data.province_id}})
                                    .first()

        data.province = result && result.error ? null : result
        return data
    }
}

module.exports = CouponFreeShippingZone