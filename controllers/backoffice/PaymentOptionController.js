const BaseController = require('../../core/BaseController')
const PaymentOption = require('../../models/PaymentOptions')

const AssetHelper = require('../../helpers/AssetHelper')

class PaymentOptionController extends BaseController {

    get = async (req, response) => {
        let paymentOptions = new PaymentOption().with('asset')
        const { query } = req
        
        this.filter(paymentOptions, query)
        this.sort(paymentOptions, query.sort || [ "sort_order", "asc" ])
        const result = await (query.list ? paymentOptions.get() : paymentOptions.paginate(query.pageSize, query.page))
        
        this.response(result, response)
    }

    store = async (req, response) => {
        await AssetHelper.upload(req.body.image)
            
        const result = await new PaymentOption().create(req.body)
        await new PaymentOption().where({id: {value: result.data.id}}).update({ sort_order: result.data.id })
        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) response.status(204).send("Missing id request parameter")

        const result = await new PaymentOption()
                                    .with('asset')
                                    .where({"id": {value: req.params.id}})
                                    .first()

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            await AssetHelper.upload(req.body.image)
            const result = await new PaymentOption()
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .update(req.body)

            this.response(result, response)
        }
        else res.status(400).send("Id request parameter is required.")
    }

    delete = async (req, response) => this.deleteAll(req, response, new PaymentOption())
}

module.exports = new PaymentOptionController