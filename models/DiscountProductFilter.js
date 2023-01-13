const Base = require('../core/BaseModelV2')
class DiscountProductFilter extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "discount_product_filters"
        this.fillables  = {
                            "ref_type":     "string",
                            "ref_id":       "int",
                            "filter_type":  "string",
                            "value":        "string",
                            "created_at":   "datetime",
                            "updated_at":   "datetime"
                        }
    }
}

module.exports = DiscountProductFilter