const Base = require('../core/BaseModelV2')
class OrderItem extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "order_items"
        this.fillables  = {
                            "product_id": "int",
                            "product_parent_id": "int",
                            "order_id": "int",
                            "coupon_id": "int",
                            "promotion_id": "int",
                            "original_price": "decimal",
                            "price": "decimal",
                            "quantity": "decimal",
                            "selling_unit": "string",
                            "uom_ratio": "int",
                            "refunded_amount": "decimal",
                            "status": "string",
                            "is_prepared": "int",
                            "created_at": "datetime",
                            "updated_at": "datetime",
                            "deleted_at": "datetime"
                        }
    }
    
    order                   = () => this.hasOne("Order", "orders.id", "order_id")
    product                 = () => this.hasOne('Product', 'products.id', 'product_id', { withTrashed: '', withJoin: { ratings: false, discount: true }, forTable: '' })
    fulfillments            = () => this.hasMany('InventoryHistory', 'order_item_id', 'id')
    appendReturnedStocks    = async (data, connection) => {
                                const InventoryHistory = require('./InventoryHistory')
                                const result = await new InventoryHistory(connection)
                                                .select([ "*", "SUM(quantity) as total" ])
                                                .where({
                                                    order_item_id: { value: data.id },
                                                    action: { value: "restock" }
                                                })
                                                .first()
                                                
                                data.restock_quantity = result?.total
                                return data
                            }
    appendFulfillmentTotal  = ( data ) => {
                                let total   = 0
                                if (data.product.track_inventory && data.fulfillments) {
                                    data.fulfillments.forEach(fulfillment => {
                                        total += fulfillment.quantity * (fulfillment.action === "restock" ? -1 : 1)
                                    })
                                }
                                else if (!data.product.track_inventory && data.is_prepared) total = data.quantity

                                data.fulfillmentTotal = total
                                data.uomFulfillmentTotal = total / ( data.uom_ratio || 1 )
                                
                                return data
                            }
}

module.exports = OrderItem