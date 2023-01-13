const Base = require('../core/BaseModelV2')

class PageContent extends Base {
    constructor(connection) {
        super(connection)
        this.table = "page_contents"
        this.fillables = {
            "page_id": "int",
            "name": "string",
            "slug": "string",
            "publish_date": "date",
            "is_editable": "int",
            "sort_order": "int",
            "created_at": "datetime",
            "updated_at": "datetime"
        }
    }

    clientContents = () => this.hasMany("PageClientContent", "template_slug", "slug")

    controls = () => this.hasMany('PageControl', 'page_content_id', 'id')

    page = () => this.hasOne('Page', 'id', 'page_id')
}

module.exports = PageContent