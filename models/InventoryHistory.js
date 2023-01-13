const moment    = require('moment')
const Base      = require('../core/BaseModelV2')
const OrderItem = require('./OrderItem')

class InventoryHistory extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "inventory_histories"
        this.fillables  = {
                            "product_id": "int",
                            "parent_id": "int",
                            "order_item_id": "int",
                            "quantity": "decimal",
                            "action": "string",
                            "location": "int",
                            "location_2": "int",
                            "message": "string",
                            "item_unit": "string",
                            "qty_ratio": "int",
                            "expiration_date": "date",
                            "created_at": "datetime",
                            "updated_at": "datetime",
                            "deleted_at": "datetime"
                        }
    }

    sloc                = () => this.hasOne("InventoryLocation", "id", "location")
    product             = () => this.hasOne("Product", "id", "product_id", { withTrashed: "" })
    orderItem           = () => this.hasOne("OrderItem", "id", "order_item_id")
    availableStocks     = (locationId, productId) => {
                            this.select([
                                "id",
                                "SUM(quantity * IF(action = 'restock', 1, -1)) as available",
                                "action",
                                "location",
                                "product_id",
                                "parent_id",
                                "expiration_date"
                            ])
                            
                            if (locationId) this.where({ location: { value: locationId }})
                            if (productId) this.where({ product_id: { value: productId }})

                            return this
                                    .with([ "product", "sloc" ])
                                    .groupBy([ "product_id", "location", "expiration_date" ])
                                    .whereRaw(`(expiration_date >= "${ moment().format("YYYY-MM-DD")}" OR expiration_date IS NULL)`)
                                    .having(`available > 0`)
                        }
    appendToFulfill     = async (data) => {
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
    appendOrderDetails  = async (data, connection) => {
                            const orderItem = await new OrderItem(connection)
                                                .select(["orders.id as order_id", "reference_number"])
                                                .join("orders", "orders.id = order_items.order_id", "left")
                                                .where({ "order_items.id": { value: data.order_item_id }})
                                                .first()
                                                
                            data.order_details = orderItem
                            return data
                        }
}

module.exports = InventoryHistory