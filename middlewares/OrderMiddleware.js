const moment            = require('moment')
const CustomerAddress   = require('../models/CustomerAddress')
const OrderHelper       = require('../helpers/OrderHelper')
const OrderItem = require('../models/OrderItem')
const OrderAddress = require('../models/OrderAddress')

class OrderMiddleware {

    dataCorrection = (req, res, next) => {
        const data = req.body
        data.subtotal = OrderHelper.getSubtotal(data);
        data.total = OrderHelper.getGrandTotal(data);

        if (data.is_paid) {
            data.payment_amount = data.total;
            data.paid_at = data.paid_at ? data.paid_at : moment().format();
        }
        else {
            data.paid_at = null;
            data.payment_amount = 0;
        }

        req.body.data = data
        next()
    }

    // FOR SITE SIDE ONLY
    processOrder = async (req, res, next) => {
        const items      = req.body.items.split(':')
        const orderItems = await new OrderItem()
                            .with([ "product" ])
                            .where({ order_id: { value: req.body.authCart.id} })
                            .whereIn({ product_id: items })
                            .get()
        const duration   = req.body.shippingDuration.split(":")
        let order        = {
                                subtotal: 0,
                                status: "placed",
                                source: "store",
                                payment_method: req.body.payment,
                                user_id: req.body.authCart.user_id,
                                status_updated_at: moment().format(),
                                reference_number: `${ req.body.authCart.reference_number }-${ req.body.authCart.token }`
                            }
        const fees       = [{ name: "shipping_fee", amount: req.body.shippingFee }]
        const newItems   = orderItems.map(item => {
                                const price = +item.product.active_price / 1
                                order.subtotal += price * +item.quantity
                                return {
                                    id: item.id,
                                    product_id: item.product_id,
                                    price,
                                    original_price: price > item.original_price ? item.original_price : 0,
                                    status: "placed"
                                }
                        })
        let address
        
        order.delivery_start_date = moment().add(duration[0], "hours").format()
        if (duration[1]) order.delivery_end_date = moment().add(duration[1], "hours").format()
        order.total = order.subtotal + req.body.shippingFee
        
        if (req.authUser) address = await new CustomerAddress().find(req.authUser.delivery_address_id)
        else address = await new OrderAddress().where({ order_id: { value: req.body.authCart.id }}).first()
        
        req.body = {
            order,
            fees,
            items: newItems,
            authCart: req.body.authCart,
            address
        }
        
        next()
    }
}

module.exports = new OrderMiddleware