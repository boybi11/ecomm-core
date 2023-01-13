const Base = require('../core/BaseModelV2')
class VariantGroup extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "variant_groups"
        this.fillables  = {
                            "product_id": "int",
                            "name": "string"
                        }
    }

    options = () => this.hasMany("VariantOption", "variant_group_id", "id")
}

module.exports = VariantGroup