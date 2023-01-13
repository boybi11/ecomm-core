const Base = require('../core/BaseModelV2')

class PageClientControl extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "page_client_controls"
        this.fillables  = {
                            "content_id": "int",
                            "control_slug": "string",
                            "value": "string",
                            "value_draft": "string",
                            "type": "string",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }
    }

    control = () => this.hasOne('PageControl', 'slug', 'control_slug')

    asset = () => this.hasOne('Asset', 'id', 'value')
}

module.exports = PageClientControl