const Base = require('../core/BaseModelV2')
class DiscountedProduct extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "discounted_products"
        this.fillables  = {
                            "product_id": "int",
                            "ref_id": "int",
                            "discount_type": "string",
                            "amount": "decimal",
                            "amount_type": "string",
                            "publish_date": "datetime",
                            "end_date": "datetime"
                        }
    }

    promo = () => this.hasOne('Promotion', 'id', 'ref_id')

    product = () => this.hasOne('Product', 'id', 'product_id')
}

module.exports = DiscountedProduct