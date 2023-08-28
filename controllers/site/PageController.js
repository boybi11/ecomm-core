const Page = require('../../models/Page')

const BaseController = require('../../core/BaseController')
class PageController extends BaseController {

    find = async (req, response) => {
        if (req.params.slug) {
            const { slug } = req.params

            const page = await new Page()
                                    .with("publishedContents:(clientContents:(values:(control-asset)))")
                                    .where({ dev_slug: { value: slug } })
                                    .isPublished()
                                    .first()
                                    
            if (page && !page.error) {
                let contents = {}
                if (page.publishedContents.length) {

                    page.publishedContents.forEach(content => {
                        const key = content.name.toLowerCase().replace(/ /g, '_')
                        contents[key] = []

                        if (content.clientContents) {
                            if (content.is_editable) {
                                content.clientContents
                                    .filter(clientContent => clientContent.publish_date !== null)
                                    .sort(function(a, b) { return a.sort_order - b.sort_order })
                                    .forEach(clientContent => {
                                        const contentJSON = {}
                                        
                                        clientContent.values.forEach(clientControl => {
                                            contentJSON[clientControl.control.field_name] = clientControl.type === "image" ? clientControl.asset.path : clientControl.value
                                        })
                                        contents[key].push(contentJSON)
                                    })
                            }
                            else {
                                const contentJSON = {}
                                if (content.clientContents[0]) {
                                    content.clientContents[0].values.forEach(clientControl => contentJSON[clientControl.control.field_name] = clientControl.type === "image" ? clientControl.asset.path : clientControl.value)
                                }
                                contents[key] = contentJSON
                            }
                        }
                    })
                }

                delete page.publishedContents
                this.response({ name: page.name , ...contents }, response)
            }
            else this.response(page, response)
        }
        else this.sendError("Missing slug parameter", response)
    }
}

module.exports = new PageController