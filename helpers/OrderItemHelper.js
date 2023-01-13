const OrderItem = require('../models/OrderItem')
const Order = require('../models/Order')
const Settings = require('../models/Settings')
const GeneralHelper = require('../helpers/GeneralHelper')
class OrderItemHelper {
    generateLogMessage (prevData, newData, action = "create") {
        let message = ""

        if (prevData) {
            if (newData.quantity) {
                message = `changed the quantity of <a href="/products/edit/${prevData.product_id}" class="txt-bold txt-primary">${prevData.product.name}</a> from <b>${prevData.quantity}</b> to <b>${newData.quantity}</b>`
            }
        } else {
            if (newData && Array.isArray(newData)) {
                let items = ''
                newData.map(p => items += `<div><a href="/products/edit/${p.product_id}" class="txt-bold txt-${action === "create" ? "primary" : "error"}">${p.product.name}</a></div>`)
                if (action === "create") {
                    message = `added new order item${newData.length > 1 ? 's' : ''}:${items}`
                } else {
                    message = `${action === "delete" ? "removed" : "refunded"} ${newData.length > 1 ? newData.length : 'an'} order item${newData.length > 1 ? 's' : ''}:${items}`
                }
            }
        }
        return message
    }


    generateCancelItemLogMessage = async (items) => {
        const currency            = await new Settings().where({ slug: { value: "currency-symbol" } }).first()
        const generateProductLink = (product) => `<a href="/products/edit/${product.id}" class="txt-bold txt-primary">${product.name}</a>`

        return items.map(item => {
                    const refundAmount = item.refund_amount ? GeneralHelper.numberWithCommas(item.refund_amount) : 0
                    return `cancelled ${ item.quantity } ${ generateProductLink(item.product) }  ${ refundAmount ? `with a refund amounting to ${ currency ? currency.value : '' }${ refundAmount }` : ''}`
                })
    }

    updateOrderItemRefundAmount = async (items) => {
        let totalRefunded   = 0
        const refundedItems = Array.isArray(items) ? items : [ items ]

        if (items && refundedItems.length) {
            const orderId = refundedItems[0].order_id

            await Promise.all(refundedItems.map(async currentItem => {
                const amount = +currentItem.quantity * +currentItem.price
                totalRefunded += amount
                await new OrderItem().withTrashed().where({id: {value: currentItem.id}}).update({refunded_amount: amount})
            }))
            
            const order = await new Order().where({id: orderId}).first()

            if (order && !order.error) {
                const newFefundedAmount = order.refunded_amount + totalRefunded
                const newPaymentAmount  = order.payment_amount - totalRefunded
                        
                await new Order().where({id: orderId}).update({ refunded_amount: newFefundedAmount, payment_amount: newPaymentAmount })
            }
        }
    }
}

module.exports = new OrderItemHelper