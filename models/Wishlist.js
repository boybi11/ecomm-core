const Base = require('../core/BaseModel')
class Wishlist extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "wishlists"
        this.fillables  = {
                            "product_id": "int",
                            "user_id": "int",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }

    product = () => this.hasOne('Product', 'id', 'product_id')
}

module.exports = Wishlist