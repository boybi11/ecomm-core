const Base              = require('../core/BaseModelV2')
const ProductInventory  = require('./ProductInventory')

class InventoryLocation extends Base {
    constructor(connection) {
        super(connection)
        this.product_inventorties   = []
        this.table                  = "inventory_locations"
        this.searchables            = [ "name" ]
        this.fillables              = {
                                        "name": "string",
                                        "created_at": "datetime",
                                        "deleted_at": "datetime"
                                    }
    }

    withProductID = async (product_id, ratio) => {
        const result    = await new ProductInventory(this.connection)
                                    .withAvailableStocks(ratio)
                                    .where({ "product_inventories.product_id": { value: product_id }})
                                    .get()

        const locations = result && result.length ? result.map(r => {
                                this.product_inventorties.push(r.id)
                                return r.location
                        }) : [ 0 ]

        return this.whereIn({ id: locations }).with("productInventory")
    }

    withAvailableStock = (productId) => {
        const groupBy  = ["inventory_locations.id"]
        const sumQuery = "SUM(inventory_histories.quantity * IF(action = 'restock', 1, -1))"

        if (productId) {
            this.where({ "inventory_histories.product_id": { value: productId }})
            groupBy.push("inventory_histories.product_id")
        }

        return this.join("inventory_histories", "inventory_histories.location = inventory_locations.id", "left")
                    .select(["inventory_locations.*", "action", "inventory_histories.expiration_date", `${ sumQuery } as available`, "inventory_histories.product_id"])
                    .groupBy(groupBy)
    }

    productInventory = () => this.hasOne("ProductInventory", "location", "id", { whereIn: { id: this.product_inventorties } })
}

module.exports = InventoryLocation