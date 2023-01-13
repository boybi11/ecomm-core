const Base = require('../core/BaseModelV2')

class AssetGroup extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "asset_groups"
        this.fillables  = {
                            "is_temp": "int",
                            "created_at": "datetime"
                        }

        this.appends    = ["assets"]
    }

    appendAssets = async (data, connection) => {
        const Asset     = require('./AssetGroupPivot')
        const result    = await new Asset(connection)
                                    .where({asset_group_id: {value: data.id}})
                                    .get()
        data.assets     = result.map(r => r.asset)
        return data
    }
}

module.exports = AssetGroup