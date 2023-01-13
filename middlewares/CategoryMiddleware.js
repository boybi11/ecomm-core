const moment        = require('moment')
const GeneralHelper = require('../helpers/GeneralHelper')
const Category      = require('../models/Category')
class CategoryMiddleware {
    
    generateFilters = (req, res, next) => {
        const { query } = req
        query.whereRaw = []
        const filters = query.filters ? JSON.parse(query.filters) : {}
        const configs = query.filterConfigurations ? JSON.parse(query.filterConfigurations) : {}

        if (!Object.keys(filters).length) {
            filters.parent = 0
            configs.parent = { operation: "=" }
        }
        else query.isFiltered = true
        
        if (query.published) {
            filters.publish_date = moment().format('YYYY-MM-DD')
            configs.publish_date = { operation: "<=" }
        }

        query.filters               = JSON.stringify(filters)
        query.filterConfigurations  = JSON.stringify(configs)
        
        next()
    }

    store = async (req, res, next) => {
        const id        = req.params && req.params.id ? req.params.id : 0
        const slug      = GeneralHelper.slugify(`${req.body.name}`)
        const duplicate = await new Category()
                            .select([ "id", "slug" ])
                            .where({
                                slug: { value: slug },
                                id: { value: `${ id }`, operation: "!=" }
                            })
                            .first()

        if (duplicate) {
            if (duplicate.error) res.status(400).send(duplicate.error)
            else {
                const errors = { name: "Category name is already existing" }
                res.status(400).send({errors})
            }
        }
        else {
            req.body.slug = slug
            next()
        }
    }
}

module.exports = new CategoryMiddleware