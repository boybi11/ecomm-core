const Base = require('../core/BaseModelV2')
class CashIn extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "cash_ins"
        this.fillables  = {
                            "month": "string",
                            "year": "string",
                            "status": "string",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }
}

module.exports = CashIn