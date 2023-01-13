const Base          = require('../core/BaseModelV2')
const Asset         = require('./Asset')
const AssetGroup    = require('./AssetGroup')

class Settings extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "settings"
        this.fillables  = {
                            "name": "string",
                            "slug": "string",
                            "type": "string",
                            "value": "string",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }

        this.appends = ["asset"]
    }

    filterGroup = (group) => {
        switch (group) {
            case "payment": {
                this.whereIn({
                            slug: [
                                "allow-cod",
                                "allow-cod-description",
                                "allow-cod-description-draft",
                                "allow-pickup",
                                "allow-pickup-description",
                                "allow-pickup-description-draft",
                                "allow-deposit",
                                "allow-deposit-description",
                                "allow-deposit-description-draft"
                            ]
                        })

                break
            }
            case "policy": {
                this.whereIn({
                    slug: [
                        "data-policy",
                        "data-policy-draft",
                        "shipping-policy",
                        "shipping-policy-draft",
                        "return-policy",
                        "return-policy-draft"
                    ]
                })

                break
            }
            default: break
        }

        return this
    }

    appendAsset = async (data, connection) => {
        if (data.type === "asset") {
            const asset = await new Asset(connection)
                                        .where({id: {value: data.value}})
                                        .first()

            if (asset && !asset.error) data.asset = asset
        }
        else if (data.type === "asset-group") {
            const assets = await new AssetGroup(connection)
                                        .where({id: {value: data.value}})
                                        .first()

            if (assets && !assets.error) data.assets = assets
        }

        return data
    }
}

module.exports = Settings