const Base = require('../core/BaseModelV2')
class Promotion extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "promotions"
        this.searchables    = [ "name "]
        this.fillables      = {
                                "name": 'string',
                                "description": 'text',
                                "description_draft": 'text',
                                "slug": 'string',
                                "image": "int",
                                "type": "string",
                                "apply_to": "string",
                                "discount_all": "decimal",
                                "amount_type": "string",
                                "publish_date": "datetime",
                                "end_date": "datetime",
                                "created_at": "datetime",
                                "updated_at": "datetime",
                                "deleted_at": "datetime"
                            }
    }

    asset = () => this.hasOne('Asset', 'id', 'image')

    discountRefs() {
        const additionalQry = {"discount_type": {value: "promotions"}}
        return this.hasMany('DiscountedProduct', 'ref_id', 'id', {where: additionalQry})
    }
}

module.exports = Promotion