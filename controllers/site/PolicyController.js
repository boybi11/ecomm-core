// models
const Settings          = require('../../models/Settings')
const BaseController    = require('../../core/BaseController')

class PolicyController extends BaseController {

    get = async (req, response) => {
        let result = new Settings()
                        .select([ "name", "slug" ])
                        .where({ slug: { value: "%-policy", operation: " LIKE " }})

        result = await result.get()
        this.response(result, response)
    }

    find = async (req, response) => {
        if (!req.params.slug) return res.status(204).send("Missing id request parameter")

        const result = await new Settings()
                                .select([ "name", "value" ])
                                .where({"slug": {value: req.params.slug}})
                                .first()

        this.response(result, response)
    }
}

module.exports = new PolicyController