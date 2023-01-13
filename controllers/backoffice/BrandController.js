const moment = require('moment')

const BaseController = require('../../core/BaseController')
const Brand = require('../../models/Brand')

const AssetHelper = require('../../helpers/AssetHelper')
const GeneralHelper = require('../../helpers/GeneralHelper')

class BrandController extends BaseController {

    get = async (req, response) => {
        let brands = new Brand().with('asset')
        const { query } = req

        this.filter(brands, query)
        this.sort(brands, query.sort)
        const result = await brands.paginate(query.pageSize, query.page)
        
        this.response(result, response)
    }

    store = async (req, response) => {
        await AssetHelper.upload(req.body.image)
        const slug = GeneralHelper.slugify(`${req.body.name} ${GeneralHelper.randomStr(5)}`)
            
        const result = await new Brand().create({ ...req.body, slug })
        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) response.status(204).send("Missing id request parameter")

        const result = await new Brand()
                                    .with('asset')
                                    .where({"id": {value: req.params.id}})
                                    .first()

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            await AssetHelper.upload(req.body.image)
            const result = await new Brand()
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .update(req.body)

            this.response(result, response)
        }
        else res.status(400).send("Id request parameter is required.")
    }

    delete = async (req, response) => this.deleteAll(req, response, new Brand())
}

module.exports = new BrandController