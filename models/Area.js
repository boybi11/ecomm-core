const Base = require('../core/BaseModelV2')
class Area extends Base {
    constructor(connection) {
        super(connection)

        this.table      = "areas"
        this.fillables  = {
                            "name": "string",
                            "city_id": "int"
                        }
    }
}

module.exports = Area