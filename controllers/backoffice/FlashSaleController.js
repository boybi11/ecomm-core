const Promotion = require('../../models/Promotion')
const DiscountedProduct = require('../../models/DiscountedProduct')
const moment = require('moment')

const BaseController = require('../../core/BaseController')
const AssetHelper = require('../../helpers/AssetHelper')
const GeneralHelper = require('../../helpers/GeneralHelper')

class FlashSaleController extends BaseController {

    get = async (req, response) => {
        let promotions = new Promotion().with('asset')
                            
        const { query } = req
        promotions = this.filter(promotions, query)
        promotions = this.sort(promotions, query.sort)

        const result = await promotions
                                .whereRaw('(DATEDIFF(end_date, publish_date) < 1 OR type="flash")')
                                .paginate(query.pageSize, query.page)

        this.response(result, response)
    }

    store = async (req, response) => {
        if (req.body.end_date) req.body.end_date = `${moment(req.body.publish_date).format("YYYY-MM-DD")} ${moment(req.body.end_date).format("HH:mm:ss")}`
    
        await AssetHelper.upload(req.body.image)
        const slug =    GeneralHelper.slugify(`${req.body.name} ${GeneralHelper.randomStr(5)}`)
        const result =  await new Promotion().create({ ...req.body, slug, type: "flash"})

        if (result && !result.error && req.body.products) {
            const products = req.body.products.map(product => ({ ...product, ref_id: result.result.insertId }))
            await new DiscountedProduct().create(products)
        }

        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) response.status(400).send({ message: "Missing ID request parameter"})

        const result = await new Promotion()
                                    .with('asset')
                                    .with('discountRefs:product:asset')
                                    .where({"id": {value: req.params.id}})
                                    .first()
                                    
        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            if (req.body.end_date) req.body.end_date = `${moment(req.body.publish_date).format("YYYY-MM-DD")} ${moment(req.body.end_date).format("HH:mm:ss")}`
            await AssetHelper.upload(req.body.image)
            const result = await new Promotion()
                                        .where({id: {value: req.params.id}})
                                        .update(Object.assign({}, req.body))
                                        
            if (result && !result.error && req.body.products) await new DiscountedProduct().create(req.body.products)

            this.response(result, response)
        }
        else response.status(400).send("Id request parameter is required.")
    }

    delete = (req, res) => this.deleteAll(req, res, new Promotion())

    getConfiltedSchedule = async (req, response) => {
        const {query} = req
        const sDate = moment(query.publish_date).format()
        const eDate = query.end_date ? moment(query.end_date).format() : null

        let whereQry    = `(publish_date <= '${ sDate }' AND (end_date >= '${ sDate }' OR end_date IS NULL))`
        if (eDate) {
            whereQry = `(${ whereQry } OR ((end_date >= '${ eDate }' OR end_date IS NULL) AND publish_date <= '${ eDate }'))`
            whereQry    = `(${ whereQry } OR (publish_date >= '${ sDate }' AND (publish_date <= '${ eDate }' OR end_date IS NULL)))`
        }

        const result = await new Promotion()
                                    .with('discountRefs')
                                    .whereRaw(whereQry)
                                    .get()
                                    
        this.response(result, response)
    }
}

module.exports = new FlashSaleController