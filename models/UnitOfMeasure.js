const Base = require('../core/BaseModelV2')

class UnitOfMeasure extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "unit_of_measures"
        this.fillables  = {
                            "product_id": "int",
                            "name": "string",
                            "unit": "string",
                            "ratio": "int",
                            "ratio_eq": "string",
                            "length": "decimal",
                            "width": "decimal",
                            "height": "decimal",
                            "original_price": "decimal",
                            "price": "decimal",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }
}

module.exports = UnitOfMeasure