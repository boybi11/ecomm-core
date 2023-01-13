const BaseController = require('../../core/BaseController')
const ProductView = require('../../models/ProductView')

class ProductViewController extends BaseController {

    constructor() {
        super()
    }

    get = async (req, response) => {
        let products = await new ProductView()
                                .with([ "product:asset-category" ])
                                .where({ user_id: { value: req.authUser?.id || 0 } })
                                .max(5)
                                .orderBy("id", "desc")
                                .groupBy("product_id")
                                .get()

        this.response(products, response)
    }

}

module.exports = new ProductViewController