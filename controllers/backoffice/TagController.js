const Tag = require('../../models/Tag')
const BaseControlelr = require('../../core/BaseController')

class TagController extends BaseControlelr {

    get = async (req, response) => {
        let tags = new Tag()
                            
        const {query} = req

        if (query.filters) {
            const filters = JSON.parse(query.filters)
            Object.keys(filters).map(key => {
                if (key !== "published") {
                    filters[key] = {
                        value: `${filters[key]}%`,
                        operation: " LIKE "
                    }
                }
            })
            
            tags = tags.where(filters)
        }

        if (query.sort && Array.isArray(query.sort) && query.sort.length === 2) {
            tags = tags.orderBy(query.sort[0], query.sort[1])
        }

        const result = await tags.get()
        this.response(result, response)
    }
}

module.exports = new TagController