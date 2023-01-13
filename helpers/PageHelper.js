const moment = require('moment')
const PageContent = require('../models/PageContent')
const PageClientContent = require('../models/PageClientContent')
const PageControl = require('../models/PageControl')

const GeneralHelper = require('../helpers/GeneralHelper')
const BaseController = require('../core/BaseController')
class PageHelper extends BaseController {

    contentCleanUp = async ( pageId, content ) => {
        const pageContent = await new PageContent()
                                        .where({ page_id: {value: pageId}, slug: {value: content.slug} })
                                        .first()
                                        
        if (pageContent && !pageContent.error && (content.is_editable !== pageContent.is_editable || !content.is_editable)) {
            await new PageClientContent().where({ template_slug: { value: pageContent.slug } }).delete([])
        }

        await new PageContent().where({ page_id: {value: pageId}, slug: {value: content.slug} }).delete([])
    }
    
    saveContents = async ({ pageId, contents }) => {
        
        contents.forEach(async content => {
            await this.contentCleanUp(pageId, content)
            const pageContent = await new PageContent().create(content)

            if (pageContent && !pageContent.error) {
                if (!content.is_editable) {
                    let defaultClientContent = { template_slug: content.slug, publish_date: moment().format(), sort_order: 0 }
                    await new PageClientContent().create(defaultClientContent)
                }
                if (content.controls) {
                    // process control data structure
                    const controls = content.controls.map((control, ctrIndex) => ({
                        ...control,
                        page_content_id: pageContent.result.insertId,
                        slug: control.slug ? control.slug : GeneralHelper.slugify(`${control.field_name} ${GeneralHelper.randomStr(15)}`),
                        order_index: ctrIndex
                    }))
                    await this.saveControls({ contentId: pageContent.result.insertId, controls})
                }
            }
        })
    }

    saveControls = async ({ contentId, controls }) => {
        await new PageControl().where({page_content_id: {value: contentId}}).delete([])
        return await new PageControl().create(controls)
    }
}

module.exports = PageHelper