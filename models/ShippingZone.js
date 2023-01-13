const Base = require('../core/BaseModelV2')
class ShippingZones extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "shipping_zones"
        this.fillables  = {
                            "shipping_fee_id": "int",
                            "province_id": "int"
                        }
    }

    province = () => this.hasOne('Province', 'id', 'province_id')
}

module.exports = ShippingZones