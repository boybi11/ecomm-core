const Base = require('../core/BaseModelV2')

class CancelledItem extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "cancelled_items"
        this.fillables  = {
                            "product_id": "int",
                            "product_parent_id": "int",
                            "order_id": "int",
                            "price": "decimal",
                            "refund_amount": "decimal",
                            "quantity": "decimal",
                            "restock_quantity": "decimal",
                            "selling_unit": "string",
                            "uom_ratio": "int",
                            "coupon_id": "int",
                            "promotion_id": "int",
                            "original_price": "decimal",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }

    product = () => this.hasOne('Product', 'id', 'product_id')
}

module.exports = CancelledItem