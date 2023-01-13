const Base = require('../core/BaseModelV2')
class Banks extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "banks"
        this.fillables  = {
                            "name": "string",
                            "account_number": "string",
                            "is_enabled": "int"
                        }
    }
}

module.exports = Banks