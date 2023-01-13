const Base = require('../core/BaseModelV2')
class ShippingFee extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "shipping_fees"
        this.searchables    = [ "name "]
        this.fillables      = {
                                "name": "string",
                                "is_enabled": "int",
                                "free_shipping_threshold": "decimal",
                                "created_at": "datetime",
                                "updated_at": "datetime"
                            }
    }

    zones = () => this.hasMany('ShippingZone', 'shipping_fee_id', 'id')

    rates = () => this.hasMany('ShippingRate', 'shipping_fee_id', 'id')
}

module.exports = ShippingFee