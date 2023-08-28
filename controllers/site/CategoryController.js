const Category       = require('../../models/Category')
const BaseController = require('../../core/BaseController')
const Product        = require('../../models/Product')

class CategoryController extends BaseController {

    get = async (req, response) => {
        const { query } = req
        let categories  = new Category()
                            .isPublished()
                            .with('asset')
                            .where({ parent: { value: 0 }})

        categories = this.filter(categories, query)
        categories = this.sort(categories, query.sort)

        if (query.list) categories = categories.list()

        const result = await categories
                        .with('children:>crumbs-children:>crumbs')
                        .get()
                        
        this.response(result, response)
    }

    find = async (req, response) => {
        const { slug } = req.params
        let category = await new Category()
                            .isPublished()
                            .with('asset')
                            .where({ slug: { value: slug }})
                            .first()

        this.response(category, response)
    }
}

module.exports = new CategoryController