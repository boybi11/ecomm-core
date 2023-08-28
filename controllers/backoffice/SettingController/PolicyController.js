// models
const Settings          = require('../../../models/Settings')
const BaseController    = require('../../../core/BaseController')
const GeneralHelper     = require('../../../helpers/GeneralHelper')

class PolicyController extends BaseController {

    get = async (req, response) => {
        let result = new Settings().where({ slug: { value: "%-policy", operation: " LIKE " }})
        
        result = this.filter(result, req.query)
        this.sort(result, req.query.sort)
        result = await result.paginate()
        this.response(result, response)
    }

    store = async (req, response) => {
        const name = req.body.name
        const slug = GeneralHelper.slugify(req.body.name) + "-policy"
        const value = req.body.description
        const type  = "text"

        const create  = await new Settings().create([
                            {
                                name,
                                value,
                                type,
                                slug
                            },
                            {
                                name: `${ name } Draft`,
                                slug: `${ slug }-draft`,
                                type,
                                value: req.body.description_draft
                            }
                        ])
        this.response(create, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) res.status(204).send("Missing id request parameter")

        const result = await new Settings()
                                .where({"id": {value: req.params.id}})
                                .first()
        const draft     = await new Settings().where({ slug: { value: result.slug + "-draft" }}).first()
        result.draft    = draft.value
        result.draft_id = draft.id

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            const result = await new Settings()
                            .where({id: { value: req.params.id }})
                            .update({
                                name: req.body.name,
                                slug: GeneralHelper.slugify(req.body.name) + "-policy",
                                value: req.body.description
                            })

            // SAVE DRAFT
            await new Settings()
                .where({id: { value: req.body.draft_id }})
                .update({
                    name: `${ req.body.name } Draft`,
                    slug: GeneralHelper.slugify(req.body.name) + "-policy-draft",
                    value: req.body.description_draft
                })
            this.response(result, response)
        }
        else res.status(400).send("Id request parameter is required.")
    }

    delete = async (req, response) => {
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) {
            const slugs = await new Settings().whereIn({ id: ids }).pluck(["slug"])
            const result = await new Settings().delete(ids)
            // REMOVE DRAFTS AS WELL
            await new Settings().whereIn({ slug: slugs.map(slug => `${ slug }-draft`) }).delete()

            this.response(result, response)   
        }
        else response.status(400).send({ message: "Missing request parameter" })
    }
}

module.exports = new PolicyController