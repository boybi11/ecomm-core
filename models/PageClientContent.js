const Base = require('../core/BaseModelV2')

class PageClientContent extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "page_client_contents"
        this.fillables  = {
                            "template_slug": "string",
                            "publish_date": "date",
                            "sort_order": "int",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }

    template = () => this.hasOne('PageContent', 'slug', 'template_slug')

    values = () => this.hasMany('PageClientControl', 'content_id', 'id')
}

module.exports = PageClientContent