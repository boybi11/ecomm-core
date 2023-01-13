const OrderItem         = require('../../models/OrderItem')
const CancelledItem     = require('../../models/CancelledItem')
const InventoryHistory  = require('../../models/InventoryHistory')
const OrderHelper       = require('../../helpers/OrderHelper')
const OrderItemHelper   = require('../../helpers/OrderItemHelper')
const BaseController    = require('../../core/BaseController')

class OrderItemController extends BaseController {

    get = async (req, response) => {
        let orderItems = new OrderItem()
        const {query} = req

        if (query.filters) {
            const filters = JSON.parse(query.filters)
            Object.keys(filters).map(key => {
                filters[key] = {
                    value: `${filters[key]}%`,
                    operation: " LIKE "
                }
            })
            
            orderItems = orderItems.where(filters)
        }

        if (query.sort && Array.isArray(query.sort) && query.sort.length === 2) orderItems = orderItems.orderBy(query.sort[0], query.sort[1])

        const result = await orderItems.paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    store = async (req, response) => {
        let data        = {...req.body}
        const result    = await new OrderItem()
                            .with(["fulfillments:sloc", "product:asset"])
                            .includeAppend("fulfillmentTotal")
                            .create(data.items ? data.items : data)
        
        if (result && !result.error) {
            const items = Array.isArray(result.data) ? result.data : [ result.data ]
            
            await OrderHelper.updateTotals(items[0].order_id)
            await OrderHelper.log({
                orderId: items[0].order_id,
                userId: req.authUser.id,
                action: "update",
                message: OrderItemHelper.generateLogMessage(null, items)
            })
        }

        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.query.id) this.sendError("Missing request paramter", response)
        else {
            const result = new OrderItem()
                                    .with("product:asset")
                                    .where({"id": {value: req.query.id}})
                                    .first()

            this.response(result, response)
        }
    }

    update = async (req, response) => {
        if (req.params.id) {
            let data =          { ...req.body }
            const orderItem =   new OrderItem()
                                        .with('product')
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .first()

            if (orderItem && +orderItem.quantity !== +data.quantity) {
                const result = new OrderItem()
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .update(data)

                if (result && !result.error) {
                    await OrderHelper.updateTotals(orderItem.order_id)
                    await OrderHelper.log({
                                            order_id: fRes.order_id,
                                            user_id: req.authUser.id,
                                            action: "update",
                                            message: OrderItemHelper.generateLogMessage(fRes, data)
                                        })
                }
                
                this.response(result, response)
                
            }
            else this.sendError("Invalid paramters.", response)
        }
        else this.sendError("Missing request paramter.", response)
    }

    delete = async (req, response) => {
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) {
            const status        = req.body.action === "delete" ? "cancelled" : "refunded"
            const orderItems    = await new OrderItem().with("product").whereIn({ id: ids }).update({ status })
            if (status === "refunded") await OrderItemHelper.updateOrderItemRefundAmount(orderItems.data)

            const deletedItems = await new OrderItem().delete(ids)
            
            if (deletedItems && !deletedItems.error && orderItems.data) {
                const items = Array.isArray(orderItems.data) ? orderItems.data : [ orderItems.data ]
                await OrderHelper.updateTotals(items[0].order_id)
                OrderHelper.log({
                    order_id: items[0].order_id,
                    user_id: req.authUser.id,
                    action: "update",
                    message: OrderItemHelper.generateLogMessage(null, items, req.body.action)
                })
            }

            if (req.body.restock) {
                const restock = req.body.restock.map(location => {
                                    return {
                                        ...location,
                                        action: "restock",
                                        message: "Order fulfillment returned due to cancellation."
                                    }
                                })

                await new InventoryHistory().create(restock)
            }
            this.response(deletedItems, response)
        }
    }

    saveCancelledItems = async (req, response, next) => {
        const { items } = req.body

        if (items && items.length && req.params.orderId) {
            const whereQry =        { order_id: { value: req.params.orderId } }
            const cancelledItems =  await new CancelledItem().where(whereQry).get()
            
            items.forEach(item => item.order_id = req.params.orderId)
            if (cancelledItems && !cancelledItems.error) {
                const newCancelledItems = JSON.parse(JSON.stringify(items))
                cancelledItems.forEach(cancelledItem => {
                    const findItem = newCancelledItems.find(item => {
                                        if (item.product_id === cancelledItem.product_id) {
                                            item.quantity           = +item.quantity + +cancelledItem.quantity
                                            item.restock_quantity   = +item.restock_quantity + +cancelledItem.restock_quantity
                                            item.refund_amount      = +item.refund_amount + +cancelledItem.refund_amount
                                            return true
                                        }

                                        return false
                                    })

                    if (!findItem) newCancelledItems.push(cancelledItem)
                })

                await new CancelledItem().where(whereQry).delete([])
                const result = await new CancelledItem().create(newCancelledItems)
                if (result && !result.error) next()
                else this.response(result, response)
            }
            else this.response(cancelledItems, response)
        }
        else this.sendError("Missing request parameter", response)
    }

    updateCancelledItems = async (req, response) => {
        const { items } = req.body
        
        const orderItems = await new OrderItem()
                                        .with("product")
                                        .where({ order_id: { value: req.params.orderId } })
                                        .get()
        
        if (orderItems && !orderItems.error) {
            const newOrderItems = orderItems.map(item => {
                                        const findItem = items.find(cancelled => cancelled.product_id === item.product_id)
                                        if (findItem) {
                                            findItem.product = item.product
                                            return { ...item, quantity: +item.quantity - +findItem.quantity }
                                        }
                                        
                                        return { ...item }
                                    })
                                    .filter(item => item.quantity > 0)

            await new OrderItem().where({ order_id: { value: req.params.orderId } }).delete([])
            const result = newOrderItems.length ? await new OrderItem().create(newOrderItems) : undefined
            
            if ((result && !result.error) || !newOrderItems.length) {
                await OrderHelper.updateTotals(req.params.orderId)
                const message = await OrderItemHelper.generateCancelItemLogMessage(items)
                OrderHelper.log({
                    orderId: req.params.orderId,
                    userId: req.authUser.id,
                    action: "update",
                    message
                })
            }

            this.response(result || {}, response)
        }
        else this.response(orderItems, response)
    }

    getProductMetrics = async (req, response) => {
        const result = await new OrderItem()
                                    .select(['product_id', "SUM(quantity) as units_sold", "SUM(quantity * price) as sales"])
                                    .join("orders", 'order_items.order_id = orders.id', "left")
                                    .whereRaw(`(product_id = "${ req.params.productId }" AND orders.status != "cancelled" AND orders.is_paid = 1)`)
                                    .groupBy("product_id")
                                    .get()

        this.response(result, response)
    }

    fulfillItem = async (req, response) => {
        if (req.params.id) {
            let item = await new OrderItem().find(req.params.id)

            if (req.body.locations) {
                const inventoryFulfillments = req.body.locations.map(location => {
                                                    return {
                                                        location: location.id,
                                                        quantity: Math.abs(location.quantity) * (item.uom_ratio || 1),
                                                        product_id: req.body.product_id,
                                                        order_item_id: req.params.id,
                                                        action: location.quantity > 0 ? "fulfillment" : "restock",
                                                        message: `Order fulfillment${ location.quantity > 0 ? '' : ' returned' }`,
                                                        qty_ratio: (item.uom_ratio || 1),
                                                        item_unit: item.selling_unit,
                                                        expiration_date: location.expiration_date
                                                    }
                                                })

                await new InventoryHistory().create(inventoryFulfillments)
            }

            item = await new OrderItem()
                        .with(["fulfillments:sloc", "product:asset"])
                        .includeAppend("fulfillmentTotal")
                        .find(req.params.id)

            if ((item.quantity === item.uomFulfillmentTotal || !item.product.track_inventory) && !item.is_prepared) {
                await new OrderItem().where({ id: { value: item.id } }).update({ is_prepared: 1 })
                item.is_prepared = 1
                if (!item.product.track_inventory) {
                    item.fulfillmentTotal = item.quantity
                    item.uomFulfillmentTotal = item.quantity / (item.uom_ratio || 1)
                }
            }
            else if (item.quantity !== item.uomFulfillmentTotal && item.product.track_inventory) {
                await new OrderItem().where({ id: { value: item.id } }).update({ is_prepared: 0 })
                item.is_prepared = 0
            }
            
            this.response(item, response)
        }
        else this.sendError("Missing required parameter", response)
    }

    // FIX SCRIPTS
    fixParentField  = async (req, response) => {
        const data = await new OrderItem().with("product").get()

        new Promse.all(
                data.forEach( async d => {
                    await new OrderItem()
                                .where({ id: {value: d.id} })
                                .update({ product_parent_id: d.product ? (d.product.parent > 0 ? d.product.parent : d.product.id) : 0 })
                })
        )

    }
}

module.exports = new OrderItemController