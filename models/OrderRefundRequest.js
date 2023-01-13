const Base = require('../core/BaseModelV2')
class OrderRefundRequest extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "order_refund_requests"
        this.fillables  = {
                            "order_id": "int",
                            "attachments": "int",
                            "user_id": "int",
                            "reason": "string",
                            "status": "string",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }

    assets() {
        const transform = (result) => {
            if (result) return result.assets
            return result
        }

        return this.hasOne('AssetGroup', 'id', 'attachments', null, transform)
    }
}

module.exports = OrderRefundRequest