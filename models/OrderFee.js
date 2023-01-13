const Base = require('../core/BaseModelV2')

class OrderFee extends Base {
    constructor(connection) {
        super(connection)
        this.table = "order_fees"
        this.fillables = {
            "name": "string",
            "order_id": "int",
            "amount": "decimal",
            "type": "string",
            "json_data": "string"
        }
    }
}

module.exports = OrderFee