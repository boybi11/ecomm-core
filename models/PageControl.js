const Base = require('../core/BaseModelV2')

class PageControl extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "page_controls"
        this.fillables  = {
                            "page_content_id": "int",
                            "field_name": "string",
                            "label": "string",
                            "slug": "string",
                            "type": "string",
                            "predefined_value": "string",
                            "is_required": "int",
                            "is_displayed": "int",
                            "order_index": "int",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }
}

module.exports = PageControl