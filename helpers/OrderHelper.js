const moment            = require('moment')
const Order             = require('../models/Order')
const OrderFee          = require('../models/OrderFee')
const OrderItemModel    = require('../models/OrderItem')
const OrderAddressModel = require('../models/OrderAddress')
const LogHelper         = require('./LogHelper')

class OrderHelper {
    generateGetFilter = (orders, filters) => {

        if (filters) {
            filters = JSON.parse(filters)
            if (filters["delivery_date"]) {
                let deliveryDate = filters["delivery_date"]
                delete filters["delivery_date"]
                if (deliveryDate === "overdue") {
                    orders = orders.whereRaw(`((status!="delivered" AND status!="received" AND status!="cancelled") AND delivery_end_date < "${moment().format('YYYY-MM-DD HH:mm:ss')}")`)
                }
                else {
                    let status = ""
                    if (filters["delivery_status"] === "tbd") {
                        status = `AND (status = "processing" OR status = "placed")`
                        delete filters["delivery_status"]
                    }
    
                    orders = orders.whereRaw(`(((delivery_start_date >= "${deliveryDate} 00:00:00" AND delivery_start_date <= "${deliveryDate} 23:59:59") OR (delivery_end_date >= "${deliveryDate} 00:00:00" AND delivery_end_date <= "${deliveryDate} 23:59:59") OR (delivery_start_date >= "${deliveryDate} 00:00:00" AND delivery_end_date <= "${deliveryDate} 23:59:59")) ${status})`)
                }
            }
    
            Object.keys(filters).map(key => {
                filters[key] = {
                    value: `${filters[key]}%`,
                    operation: " LIKE "
                }
            })
        }
        else filters = {}
        
        if (filters['status'] === undefined) filters['status'] = {value: "cart", operation: "!="}

        return filters
    }

    getSubtotal = (order) => {
        let subtotal = 0
        const items = order.items ? [...order.items] : []
        
        items.map(i => {
            subtotal += parseFloat(i.price) * parseFloat(i.quantity)
            return 1
        })

        return subtotal
    }

    getGrandTotal (order) {
        let total = this.getSubtotal(order)
        const fees = order.fees ? order.fees : []

        fees.map(fee => {
            total += parseFloat(fee.amount)
        })

        if (order.discount_amount) {
            total -= parseFloat(order.discount_amount)
        }

        return total
    }

    updateTotals = async (orderId) => {
        if (orderId) {
            const order         = await new Order()
                                    .with(['items', 'fees'])
                                    .where({id: {value: orderId}})
                                    .first()

            const orderDetails  = {
                                    subtotal: this.getSubtotal(order),
                                    total: this.getGrandTotal(order),
                                    status: !order.items.length && order.is_paid ? "cancelled" : order.status
                                }

            await new Order().where({id: {value: orderId}}).update(orderDetails)
        }
    }

    logPayment = async ({req, currentOrder, socket}) => {
        const newOrder = req.body
        
        if ((newOrder.is_paid !== currentOrder.is_paid) || !currentOrder) {
            await LogHelper.logOrderActivity({
                order_id: req.body.ids ? req.body.ids : currentOrder.id,
                user_id: req.authUser.id,
                action: newOrder.is_paid === 1 ? 'paid' : 'unpaid'
            })
            
            if (socket) {
                socket.connect()
                socket.emit("orderPayment")
                socket.emit("forceDC")
            }
        }
    }

    saveFees = async (orderId, data) => {
        const orderFees = data.fees ? data.fees.map(fee => Object.assign({}, fee, {order_id: orderId})) : []

        await new OrderFee().where({ order_id: { value: orderId} }).delete([])
        return await new OrderFee().create(orderFees)
    }

    saveOrderItems = async (data, orderId, status = "placed") => {
        const toCreate      = []
        const toUpdate      = []
        const currentIds    = []

        data.forEach(d => {
            d.order_id = orderId
            d.status = status

            if (d.order_item_id) {
                toUpdate.push(d)
                currentIds.push(d.order_item_id)
            }
            else toCreate.push(d)
        })

        await new OrderItemModel()
                .where({ order_id: { value: +orderId } })
                .whereNotIn({ id: currentIds })
                .delete([])

        if (toCreate.length) await new OrderItemModel().create(toCreate)
        if (toUpdate.length) {
            await Promise.all(toUpdate.map(async item => {
                const currentItemState = await new OrderItemModel().find(item.order_item_id)
                if (+currentItemState.quantity !== +item.quantity) item.is_prepared = 0
                return await new OrderItemModel().where({ id: { value: item.order_item_id } }).update(item)
            }))
        }
        
        const orderItems = await new OrderItemModel().where({ order_id: { value: +orderId } }).get()
        return orderItems
    }

    saveOrderAddress = async (data, orderId) => {
        
        await new OrderAddressModel().where({order_id: {value: orderId}}).delete([])
        const delivery_address = data.delivery_address
        const billing_address = data.billing_address ? data.billing_address : data.delivery_address
        const addresses = [
            {...delivery_address, type: "delivery", order_id: orderId },
            { ...( billing_address.same === "delivery_address" ? delivery_address : billing_address ), type: "billing", order_id: orderId}
        ]

        return await new OrderAddressModel().create(addresses)
    }

    log = async ({ order_id, user_id, action, message = '' }) => {
        await LogHelper.logOrderActivity({
                            order_id,
                            user_id: user_id,
                            action,
                            message
                        })
    }
}

module.exports = new OrderHelper