const Base = require('../core/BaseModelV2')
class Brand extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "brands"
        this.searchables    = [ "name" ]
        this.fillables      = {
                                "name": "string",
                                "description": "text",
                                "description_draft": "text",
                                "slug": "string",
                                "image": "int",
                                "is_featured": "int",
                                "publish_date": "datetime",
                                "created_at": "datetime",
                                "updated_at": "datetime"
                            }
    }

    asset = () => this.hasOne('Asset', 'id', 'image')
}

module.exports = Brand