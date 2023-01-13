const Base = require('../core/BaseModelV2')
class OrderHistory extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "order_histories"
        this.fillables  = {
                            "order_id": "int",
                            "user_id": "int",
                            "action": "string",
                            "items": "string",
                            "message": "string",
                            "created_at": "datetime",
                            "seen_at": "datetime"
                        }
    }

    user = () => this.hasOne('User', 'id', 'user_id')
}

module.exports = OrderHistory