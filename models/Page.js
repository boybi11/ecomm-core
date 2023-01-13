const Base = require('../core/BaseModelV2')
const moment = require('moment')

class Page extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "pages"
        this.fillables  = {
                            "name": "string",
                            "icon": "string",
                            "slug": "string",
                            "dev_slug": "string",
                            "publish_date": "date",
                            "created_at": "datetime",
                            "updated_at": "datetime",
                            "content_sortable": "int"
                        }
    }

    contents = () => this.hasMany("PageContent", "page_id", "id", { orderBy: ["sort_order", "asc"] })

    publishedContents = () => this.hasMany("PageContent", "page_id", "id", { whereRaw: `(publish_date IS NOT NULL AND publish_date <= '${ moment().format() }')`, orderBy: ["sort_order", "asc"]})
}

module.exports = Page