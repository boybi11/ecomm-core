const Promotion = require('../../models/Promotion')
const DiscountedProduct = require('../../models/DiscountedProduct')
const moment = require('moment')

const BaseController = require('../../core/BaseController')
const AssetHelper = require('../../helpers/AssetHelper')
const GeneralHelper = require('../../helpers/GeneralHelper')

class PromotionController extends BaseController {

    get = async (req, response) => {
        let promotions = new Promotion()
                                .where({ type: { value: "promotion" }})
                                .with('asset')
                            
        const { query } = req
        promotions = this.filter(promotions, query)
        promotions = this.sort(promotions, query.sort)

        const result = await promotions.paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    store = async (req, response) => {
        await AssetHelper.upload(req.body.image)
        const slug = GeneralHelper.slugify(`${req.body.name} ${GeneralHelper.randomStr(5)}`)

        const result = await new Promotion().create({ ...req.body, type: "promotion", slug })
        if (result && !result.error && req.body.products) {
            const products = req.body.products.map(product => ({ ...product, ref_id: result.result.insertId }))
            await new DiscountedProduct().create(products)
        }

        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) response.status(204).send("Missing id request parameter")

        const result = await new Promotion()
                                    .with('asset')
                                    .with('discountRefs:product:asset')
                                    .where({"id": {value: req.params.id}})
                                    .first()

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            await AssetHelper.upload(req.body.image)
            const result = await new Promotion()
                                        .where({id: {value: req.params.id}})
                                        .update(req.body)
                                        
            if (result && !result.error && req.body.products) await new DiscountedProduct().create(req.body.products.map(p => ({ ...p, amount_type: req.body.amount_type })))
            this.response(result, response)
        }
        else response.status(400).send("Id request parameter is required.")
    }

    delete = async (req, response) => this.deleteAll(req, response, new Promotion())
}

module.exports = new PromotionController