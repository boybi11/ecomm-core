const moment = require('moment')
const PageContent = require('../../models/PageContent')
const PageClientContent = require('../../models/PageClientContent')
const PageClientControl = require('../../models/PageClientControl')

const AssetHelper = require('../../helpers/AssetHelper')
const BaseController = require('../../core/BaseController')

class PageClientContentController extends BaseController {

    get = async (req, response) => {
        const template = await new PageContent()
                                    .with(["page", "controls"])
                                    .where({ id: { value: req.params.contentId } })
                                    .whereRaw(`publish_date <= '${moment().format()}'`)
                                    .first()
                                    
        if (template && !template.error) {
            let contents =  new PageClientContent().with('values:(asset-control)').where({ template_slug: {value: template.slug } })
            const {query} = req

            if (query.filters) {
                const filters = JSON.parse(query.filters)
                Object.keys(filters).map(key => {
                    if (key !== "published") {
                        filters[key] = {
                            value: `${filters[key]}%`,
                            operation: " LIKE "
                        }
                    } else if (key === "published") {
                        if (filters[key] === "true") contents = contents.whereRaw(`publish_date <= '${moment().format('YYYY-MM-DD')}'`)
                        else contents = contents.whereRaw(`publish_date >= '${moment().format('YYYY-MM-DD')}' OR publish_date IS NULL`)

                        delete filters.published
                    }
                })
                
                contents = contents.where(filters)
            }

            if (query.published) contents = contents.where({publish_date: {value: moment().format('YYYY-MM-DD'), operation: "<="}})
            this.sort(contents, query.sort)

            let result = await contents.paginate(query.pageSize, query.page)
            if (result && !result.error) result = { ...result, template }

            this.response(result, response)
        }
        else this.response(template, response)
    }

    store = async (req, response) => {
        const content = { template_slug: req.body.template }
        if (req.body.publish_date) content.publish_date = req.body.publish_date
        const clientContent = await new PageClientContent().where({ template_slug: { value: req.body.template } }).get()
        
        if (clientContent && !clientContent.error) {
            content.sort_order = clientContent.length
            const result = await new PageClientContent().create(content)
            
            if (result && !result.error) {
                const controls = await Promise.all(req.body.controls.map(async control => {
                                            const ctrl = {
                                                        content_id: result.result.insertId,
                                                        control_slug: control.slug,
                                                        type: control.type,
                                                        value: req.body.values[control.field_name],
                                                        value_draft: control.type === "redactor" ? req.body.values[control.field_name + "_draft"] : ''
                                                    }

                                            if (control.type === "image") await AssetHelper.upload(req.body.values[control.field_name])
                                            else if (control.type === "image-multi") ctrl.value = await AssetHelper.uploadGroup(req.body.values[control.field_name])
                                        
                                            return ctrl
                                        }))
                
                await new PageClientControl().create(controls)
            }
            
            this.response(result, response)
        }
        else this.response(clientContent, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) this.sendError("Missing request parameter", response)
        else {
            const result = await new PageClientContent()
                                        .with(["template:controls-page", "values:(asset)"])
                                        .where({"id": {value: req.params.id}})
                                        .first()

            this.response(result, response)
        }
    }

    update = async (req, response) => {
        if (req.params.id) {
            const clientContentId = req.params.id
            const result = await new PageClientContent().where({id: {value: clientContentId }}).update({publish_date: req.body.publish_date})
            if (result && !result.error) {
                await new PageClientControl().where({ content_id : { value: clientContentId } }).delete([])
                const controls = await Promise.all(req.body.controls.map(async control => {
                                            const ctrl = {
                                                        content_id: clientContentId,
                                                        control_slug: control.slug,
                                                        type: control.type,
                                                        value: req.body.values[control.field_name],
                                                        value_draft: control.type === "redactor" ? req.body.values[control.field_name + "_draft"] : ''
                                                    }

                                            if (control.type === "image") await AssetHelper.upload(req.body.values[control.field_name])
                                            else if (control.type === "image-multi") ctrl.value = await AssetHelper.uploadGroup(req.body.values[control.field_name])
                                        
                                            return ctrl
                                        }))

                await new PageClientControl().create(controls)
            }

            this.response(result, response)
        }
        else this.sendError("Missing required parameter.", response)
    }

    delete = async (req, response) => await this.deleteAll(req, response, new PageClientContent().with("values"))

    reorder(req, res) {
        new PageContent()
            .where({ 
                id: { value: req.body.contentId }
            })
            .first(function(fErr, template) {
                if (template) {
                    new PageClientContent()
                        .where({ template_slug: {value: template.slug } })
                        .get(function(gErr, gData) {
                            const targetContent = gData.find(d => d.id === req.body.clientContentId)
                            let newClientContents = gData
                                                    .filter(d => d.id !== req.body.clientContentId)
                            newClientContents.splice(req.body.order, 0, targetContent)
                            newClientContents = newClientContents.map((content, index) => ({ ...content, ...{ order: index } }))

                            reorderRecurr(newClientContents, 0, () => res.send(newClientContents))
                        })
                }
                else res.status(400).send({ message: "Something went wrong!" })
            })
    }
}

//PRIVATE METHODS
const reorderRecurr = (map, currIndex, callback) => {

    new PageClientContent()
        .where({ id: { value: map[currIndex].id } })
        .update({ sort_order: map[currIndex].order }, function() {
            if (map[currIndex + 1]) reorderRecurr(map, currIndex + 1, callback)
            else callback()
        })
}

module.exports = new PageClientContentController