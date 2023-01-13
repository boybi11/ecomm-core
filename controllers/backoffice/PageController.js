const Page = require('../../models/Page')
const PageContent = require('../../models/PageContent')
const PageClientContent = require('../../models/PageClientContent')
const PageControl = require('../../models/PageControl')
const moment = require('moment')

const GeneralHelper = require('../../helpers/GeneralHelper')
const PageHelper = require('../../helpers/PageHelper')
class PageController extends PageHelper {

    get = async (req, response) => {
        let pages =     new Page()           
        let getAll =    false
        const {query} = req

        if (query.filters) {
            const filters = JSON.parse(query.filters)
            Object.keys(filters).map(key => {
                if (key !== "published") {
                    if (key === "all") getAll = true
                    else {
                        filters[key] = {
                            value: `${filters[key]}%`,
                            operation: " LIKE "
                        }
                    } 
                } else if (key === "published") {
                    if (filters[key] === "true") pages = pages.whereRaw(`publish_date <= '${moment().format('YYYY-MM-DD')}'`)  
                    else pages = pages.whereRaw(`publish_date >= '${moment().format('YYYY-MM-DD')}' OR publish_date IS NULL`)

                    delete filters.published
                }
            })
            
            pages = pages.where(filters)
        }

        if (query.published) pages = pages.where({publish_date: {value: moment().format('YYYY-MM-DD'), operation: "<="}})

        this.sort(pages, query.sort)

        let result
        if (getAll) result = await pages.get()
        else result = await pages.paginate(query.pageSize, query.currentPage)

        this.response(result, response)
    }

    store(req, res) {
        let slug = GeneralHelper.slugify(req.body.name)

        if (!req.body.dev_slug) req.body.dev_slug = slug
        slug += `-${GeneralHelper.randomStr(5)}`
        new Page()
            .create(Object.assign({}, req.body, {slug}), function (err, result) {
                if (err) {
                    res.status(500).send(err)
                } else {
                    if (result) {
                        if (req.body.contents && req.body.contents.length) {
                            const contents = req.body.contents.map(content => (
                                {
                                    ...content,
                                    ...{
                                        page_id: result.insertId,
                                        slug: GeneralHelper.slugify(`${content.name} ${GeneralHelper.randomStr(15)}`)
                                    }
                                }
                            ))
                            saveContents({ req, contents }, 0, () => {
                                res.send(result)
                            })
                        }
                        else res.send(result)
                    } else {
                        res.status(204).send({})
                    }   
                }
            })
    }

    edit = async (req, response) => {
        if (!req.params.id) response.status(204).send("Missing id request parameter")
        else {
            const result = await new Page()
                                        .with("contents:controls")
                                        .where({"id": {value: req.params.id}})
                                        .first()
                                
            this.response(result, response)
        }
    }

    update = async (req, response) => {
        if (req.params.id) {
            if (!req.body.dev_slug) req.body.dev_slug = GeneralHelper.slugify(req.body.name)
            const update = await new Page()
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .update( req.body )

            if (update && !update.error) {
                if (req.body.contents && req.body.contents.length) {
                    const contents = req.body.contents.map(content => (
                        {
                            ...content,
                            page_id: req.params.id,
                            slug: content.slug ? content.slug : GeneralHelper.slugify(`${content.name} ${GeneralHelper.randomStr(15)}`)
                        }
                    ))
                    
                    this.saveContents({ pageId: req.params.id, contents })
                }
            }
            
            this.response(update, response)
        }
        else this.sendError("Missing request parameter.", response)
    }

    delete(req, res) {
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) {
            new Page()
                .delete(ids, function(err, result) {
                    if (err) {
                        res.status(500).send(err)
                    } else {
                        if (result) {
                            res.send(result)
                        } else {
                            res.status(204).send({})
                        }
                    }
                })
        }
    }
}

//PRIVATE METHODS
/**
 * 
 * @param {object} param1 = object that contains the req and contents
 * @params {integer} index = current index serving in the recurssion
 * @param {function:required} callback = callback after the process
 */
const saveContents = ({ req, contents }, index = 0, callback) => {
    const pageContentCallback = () => {
        new PageContent()
            .where({
                page_id: {value: req.params.id},
                slug: {value: contents[index].slug}
            })
            .delete([], function () {
                new PageContent()
                    .create(contents[index], function(err, res) {
                        let defaultClientContent = null
                        if (!contents[index].is_editable) defaultClientContent = {
                            template_slug: contents[index].slug,
                            publish_date: moment().format()
                        }

                        new PageClientContent()
                            .create(defaultClientContent, () => {
                                if (contents[index].controls) {
                                    // process control data structure
                                    const controls = contents[index].controls.map((control, ctrIndex) => ({
                                        ...control,
                                        ...{
                                            page_content_id: res.insertId,
                                            slug: control.slug ? control.slug : GeneralHelper.slugify(`${control.name} ${GeneralHelper.randomStr(15)}`),
                                            order_index: ctrIndex
                                        }
                                    }))
                                    saveControls({ contentId: res.insertId, controls}, (contents[index + 1]) ? () => saveContents({ req, contents }, index + 1, callback) : callback)
                                }
                                else {
                                    if (contents[index + 1]) saveContents({ req, contents }, index + 1, callback)
                                    else callback()
                                }
                            })
                    })
            })
    }

    new PageContent()
        .where({
            page_id: {value: req.params.id},
            slug: {value: contents[index].slug}
        })
        .first((fErr, fData) => {
            if (fData && fData.is_editable !== contents[index].is_editable) {
                new PageClientContent()
                    .where({ template_slug: fData.slug })
                    .delete([], () => pageContentCallback())
            }
            else pageContentCallback()
        })
}

/**
 * 
 * @param {object} controls = array of controls for page content with content id
 * @param {function:required} callback = callback after the process
 */
const saveControls = ({ contentId, controls }, callback) => {
    new PageControl()
        .where({page_content_id: {value: contentId}})
        .delete([], function () {
            new PageControl()
                .create(controls, function(err) {
                    callback()
                })
        })
}

module.exports = new PageController