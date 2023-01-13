const Base = require('../core/BaseModelV2')
class Province extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "provinces"
        this.fillables  = {
                            "name": "string",
                            "country_id": "int",
                            "deleted_at": "datetime"
                        }
    }
}

module.exports = Province