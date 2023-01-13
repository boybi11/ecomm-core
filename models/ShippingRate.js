const Base = require('../core/BaseModelV2')
class ShippingRate extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "shipping_rates"
        this.fillables  = {
                            "category": "string",
                            "shipping_fee_id": "int",
                            "minimum": "decimal",
                            "maximum": "decimal",
                            "amount": "decimal",
                            "duration": "decimal",
                            "duration_max": "decimal"
                        }
    }
}

module.exports = ShippingRate