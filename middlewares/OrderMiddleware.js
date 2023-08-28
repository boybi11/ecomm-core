const moment = require('moment')
class OrderMiddleware {

    processDirectOrder = async (req, res, next) => {
        const order     = req.body.order
        let total       = 0
        let subtotal    = 0

        req.body.items.forEach((item) => {
            subtotal += +item.quantity * +item.price
        })

        req.body.fees.forEach(fee => {
            total += +fee.amount
        })

        order.subtotal  = subtotal
        order.total     = total

        if (order.is_paid) {
            order.payment_amount = order.total;
            order.paid_at = order.paid_at ? order.paid_at : moment().format();
        }
        else {
            order.paid_at = null;
            order.payment_amount = 0;
        }

        next()
    }

    // FOR SITE SIDE ONLY
    processOrder = async (req, res, next) => {
        const checkout  = req.body.checkout
        let subtotal    = 0
        let total       = 0
        const duration  = req.body.checkout.order.delivery_duration.split(":")
        const cartItems = []

        req.body.checkout.items.forEach(item => {
            subtotal += +item.quantity * +item.price
            cartItems.push(item.product_id)
        })

        req.body.checkout.fees.forEach(fee => {
            total += +fee.amount
        })

        total += subtotal
        checkout.cartItems      = cartItems
        checkout.order.subtotal = subtotal
        checkout.order.total    = total
        checkout.order.source   = "store"
        checkout.order.status   = "placed"
        checkout.order.delivery_start_date  = moment().add(duration[0], "hours").format("YYYY-MM-DD 00:00:00")
        checkout.order.delivery_end_date    = duration[1] ? moment().add(duration[1], "hours").format("YYYY-MM-DD 23:59:59") : moment().add(duration[0], "hours").format("YYYY-MM-DD 23:59:59")
        checkout.order.checkout_reference   = checkout.token
        checkout.order.payment_method       = checkout.order.payment
        checkout.order.full_address         = `${ checkout.address.address_line }, ${ checkout.address.area }, ${ checkout.address.city }, ${ checkout.address.province }, ${ checkout.address.zip }`
        next()
    }
}

module.exports = new OrderMiddleware