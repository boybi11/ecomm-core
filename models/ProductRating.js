const Base = require('../core/BaseModelV2')
class ProductRating extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "product_ratings"
        this.fillables  = {
                            "product_id": "int",
                            "user_id": "int",
                            "rating": "int",
                            "comment": "text",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }

    product = () => this.hasOne('Product', 'id', 'product_id')

    user = () => this.hasOne('User', 'id', 'user_id')
}

module.exports = ProductRating