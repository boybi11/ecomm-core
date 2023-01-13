const Base = require('../core/BaseModelV2')

class AssetGroupPivot extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "asset_group_pivots"
        this.fillables  = {
                            "asset_group_id": "int",
                            "asset_id": "int",
                            "created_at": "datetime"
                        }

        this.appends    = ["asset"]
    }

    appendAsset = async (data, connection) => {
        const Asset = require('./Asset')
        data.asset  = await new Asset(connection).where({id: {value: data.asset_id}}).first()
        return data
    }
}

module.exports = AssetGroupPivot