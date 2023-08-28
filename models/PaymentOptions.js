const Base = require('../core/BaseModelV2')

class PaymentOptions extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "payment_options"
        this.fillables      = {
                            "payment_name": "string",
                            "description": "string",
                            "slug": "string",
                            "description_draft": "string",
                            "image": "int",
                            "mid": "string",
                            "pk": "string",
                            "sk": "string",
                            "sort_order": "int",
                            "publish_date": "datetime",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
        this.searchables = [ "payment_name" ]
    }

    asset = () => this.hasOne('Asset', 'id', 'image')
}

module.exports = PaymentOptions