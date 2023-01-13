const Category = require('../../models/Category')

const BaseController = require('../../core/BaseController')
const AssetHelper    = require('../../helpers/AssetHelper')
const GeneralHelper  = require('../../helpers/GeneralHelper')
const { getPath }    = require('../../helpers/CategoryHelper')

class CategoryController extends BaseController {

    get = async (req, response) => {
        const { query } = req
        let categories  = new Category()
                            .with('iconAsset')
                            
        categories = this.filter(categories, query)
        categories = this.sort(categories, query.sort)
        
        if (!query.isFiltered) categories = categories.with('children:(iconAsset-children:iconAsset)')

        const result = await categories.paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    store = async (req, response) => {
        await AssetHelper.upload(req.body.image)
        await AssetHelper.upload(req.body.icon)
        req.body.path = await getPath(req.body.parent)
        const create  = await new Category().create(req.body)
        this.response(create, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) res.status(204).send("Missing id request parameter")

        const result = await new Category()
                                .with('asset')
                                .with('iconAsset')
                                .where({"id": {value: req.params.id}})
                                .first()

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            await AssetHelper.upload(req.body.image)
            await AssetHelper.upload(req.body.icon)
            req.body.path = await getPath(req.body.parent)
            const result  = await new Category()
                                    .where({id: {value: req.params.id }})
                                    .update(req.body)
            
            this.response(result, response)
        }
        else res.status(400).send("ID request parameter is required.")
    }

    delete = async (req, response) => {
        let model = new Category()
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) model = model.whereRaw(`parent IN (${ids.join(',')})`)
        this.deleteAll(req, response, model)
    }
}

module.exports = new CategoryController