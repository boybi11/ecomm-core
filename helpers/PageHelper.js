const moment = require('moment')
const PageContent = require('../models/PageContent')
const PageClientContent = require('../models/PageClientContent')
const PageControl = require('../models/PageControl')

const GeneralHelper = require('../helpers/GeneralHelper')
const BaseController = require('../core/BaseController')
class PageHelper extends BaseController {

    processContent = async ( content ) => {
        if (content.id) return await new PageContent().where({ id: { value: content.id }}).update(content)
        else return await new PageContent().create(content)
    }
    
    saveContents = async ({ pageId, contents }) => {
        return await Promise.all(contents.map(async content => {
            const pageContent = await this.processContent(content)

            if (pageContent && !pageContent.error) {
                if (!content.is_editable) {
                    let defaultClientContent = { template_slug: content.slug, publish_date: moment().format(), sort_order: 0 }
                    if (content.id) await new PageClientContent().where({ template_slug: { value: content.slug } }).update(defaultClientContent)
                    else await new PageClientContent().create(defaultClientContent)
                }
                if (content.controls) {
                    // process control data structure
                    const controls = content.controls.map((control, ctrIndex) => ({
                        ...control,
                        page_content_id: pageContent.result.insertId || pageContent.data.id,
                        slug: control.slug ? control.slug : GeneralHelper.slugify(`${control.field_name} ${GeneralHelper.randomStr(15)}`),
                        order_index: ctrIndex
                    }))
                    await this.saveControls({ contentId: pageContent.result.insertId, controls})
                }
            }

            return pageContent
        }))
    }

    saveControls = async ({ contentId, controls }) => {
        return await Promise.all(controls.map(async control => {
            if (control.id) return await new PageControl().where({ id: { value: control.id }}).update(control)
            else return await new PageControl().create(control)
        }))
    }
}

module.exports = PageHelper