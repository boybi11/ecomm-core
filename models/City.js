const Base = require('../core/BaseModelV2')
class City extends Base {
    constructor(connection) {
        super(connection)

        this.table      = "cities"
        this.fillables  = {
                            "name": "string",
                            "prov_id": "int"
                        }
    }
}

module.exports = City