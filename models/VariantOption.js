const Base = require('../core/BaseModelV2')
class VariantOption extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "variant_options"
        this.fillables  = {
                            "variant_group_id": "int",
                            "name": "string",
                            "slug": "string"
                        }
    }
}

module.exports = VariantOption