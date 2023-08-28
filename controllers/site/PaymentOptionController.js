const BaseController = require('../../core/BaseController')
const PaymentOption = require('../../models/PaymentOptions')

class PaymentOptionController extends BaseController {

    get = async (req, response) => {
        let paymentOptions  = await new PaymentOption()
                                        .select([ "payment_name", "description", "publish_date", "sort_order", "slug", "image" ])
                                        .with('asset')
                                        .orderBy("sort_order", "asc")
                                        .isPublished()
                                        .get()
        
        this.response(paymentOptions, response)
    }
}

module.exports = new PaymentOptionController