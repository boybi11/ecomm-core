const Page = require('../../models/Page')
const PageContent = require('../../models/PageContent')

const BaseController = require('../../core/BaseController')

class PageContentController extends BaseController {

    get = async (req, response) => {
        const page = await new Page()
                                .with("publishedContents:clientContents")
                                .where({ slug: { value: req.query.pageSlug } })
                                .first()
                                
        this.response(page, response)
    }

    edit = async (req, response) => {
        if (!req.params.slug) this.sendError("Missing request parameter", response)
        else {
            const result = await new PageContent().with(["clientContents", "page", "controls"]).where({ slug: { value: req.params.slug } }).first()
            this.response(result, response)
        }
    }
}

module.exports = new PageContentController