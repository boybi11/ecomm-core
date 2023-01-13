const moment    = require('moment')
const Base      = require('../core/BaseModelV2')
const OrderItem = require('./OrderItem')
class ProductInventory extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "product_inventories"
        this.fillables  = {
                            "product_id": "int",
                            "location": "int",
                            "quantity": "decimal",
                            "expiration_date": "date",
                            "created_at": "datetime",
                            "updated_at": "datetime",
                            "deleted_at": "datetime"
                        }
        
        this.appends    = [ "shelf_life" ]
    }

    sloc                    = () => this.hasOne("InventoryLocation", "id", "location")
    product                 = () => this.hasOne("Product", "id", "product_id")
    appendToFulfill         = async (data) => {
                                const orderItem = await new OrderItem()
                                                        .select([ "SUM(quantity) as total", "product_id", "is_prepared", "status" ])
                                                        .where({
                                                            product_id: { value: data.product_id },
                                                            is_prepared: { value: 0 }
                                                        })
                                                        .whereRaw(`(status = "placed" OR status = "processing" OR status = "fulfilled" OR status = "booked")`)
                                                        .first()
                                
                                data.toFulfill = orderItem
                                return data
                            }
    withAvailableStocks     = (ratio = 0) => {
                                const sumQuery = "SUM(inventory_histories.quantity * IF(action = 'restock', 1, -1))"
                                return this.join("inventory_histories", "inventory_histories.product_id = product_inventories.product_id AND inventory_histories.location = product_inventories.location AND (inventory_histories.expiration_date = product_inventories.expiration_date OR product_inventories.expiration_date IS NULL)", "left")
                                    .select(["product_inventories.*", "action", `IF(${ sumQuery } IS NULL, 0, ${ sumQuery }) as available`])
                                    .groupBy(['product_inventories.product_id', "product_inventories.location", "product_inventories.expiration_date"])
                                    .having(`available > ${ ratio ? ratio - 1 : 0 }`)
                            }
    appendShelfLife         = (data) => {
                                let shelf_life

                                if (data.expiration_date) shelf_life = moment(data.expiration_date).diff(moment(), "days") + 1
                                data.shelf_life = shelf_life

                                return data
                            }
}

module.exports = ProductInventory