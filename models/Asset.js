const Base = require('../core/BaseModelV2')
class Asset extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "assets"
        this.searchables    = [ "name" ]
        this.fillables      = {
                                "path": "text",
                                "asset_group_id": "int",
                                "name": "string",
                                "caption": "string",
                                "alt": "string",
                                "created_at": "datetime",
                                "updated_at": "datetime",
                                "type": "string",
                                "size": "int",
                                "is_temp": "int",
                                "m_thumbnail": "text",
                                "s_thumbnail": "text"
                            }
    }
}

module.exports = Asset