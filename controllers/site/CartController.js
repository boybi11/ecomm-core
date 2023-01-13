const moment         = require('moment')
const Order          = require('../../models/Order')
const OrderFee       = require('../../models/OrderFee')
const BaseController = require('../../core/BaseController')
const { encrypt }    = require('../../helpers/EncHelper')
class CartController extends BaseController {

    store = async (req, response) => {
        const cart = {
            source: "store",
            status: "cart",
            subtotal: 0,
            total: 0,
            user_id: req.authUser ? req.authUser.id : 0
        }

        const create = await new Order().create(cart)

        if (create && !create.error) {
            const orderId       = create.result.insertId
            const refNum        = moment().unix() + '-' + orderId + '-' + parseInt(Math.random() * 9999)
            const checkoutRef   = moment().unix() + '' + orderId
            const update        = await new Order().where({id: {value: orderId}}).update({reference_number: refNum, checkout_reference: checkoutRef})

            this.response(update, response)
        }
        else this.response(create, response)
    }

    get = async (req, response) => {
        if (req.params.ref || req.authUser) {
            const whereQuery = { status: { value: "cart" } }
            
            if (req.authUser)  whereQuery.user_id = { value: req.authUser.id }
            else if (req.params.ref && req.params.ref !== 'undefined') whereQuery.reference_number = { value: req.params.ref }

            const result = await new Order()
                                        .with([
                                            "items:product:(asset)",
                                            "delivery_address",
                                            "billing_address"
                                        ])
                                        .where(whereQuery)
                                        .first()

            if (!result) this.store(req, response)
            else this.response(result, response)
        }
        else this.sendError("Missing request paramters", response)
    }

    updateCartFees(req, res) {
        if (req.params.order_id || req.authUser) {
            const whereQuery = {
                status: {value: "cart"}
            }
            
            if (req.authUser)  whereQuery.user_id = { value: req.authUser.id }
            else if (req.params.order_id && req.params.order_id !== 'undefined') whereQuery.id = { value: req.params.order_id }
            
            new Order()
                .where(whereQuery)
                .first(function(err, result) {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        if (result) {
                            let data = {...req.body}
                            const orderFees = data.fees ? data.fees.map(fee => Object.assign({}, fee, {order_id: result.id, json_data: fee.json_data ? JSON.stringify(fee.json_data) : ''})) : []
                            new OrderFee()
                                .where({ order_id: { value: result.id } })
                                .delete([], () => {
                                    new OrderFee()
                                        .create(orderFees, function() {
                                            res.send(result)
                                        })
                                })
                        } else {
                            res.status(400).send({message: "Cart record not found."})
                        }
                    }
                })
        }
        else res.status(400).send({message: "No reference number provided"})
    }

    saveCartAddress = async (req, response) => {
        const OrderAddressModel = require('../../models/OrderAddress')
        const orderId = req.body.authCart.id
        
        if (req.body.delivery_address) {
            const address                = { ...req.body.delivery_address, type: "delivery", order_id: orderId }
            const currentDeliveryAddress = await new OrderAddressModel()
                                                .where({
                                                    order_id: { value: orderId },
                                                    type: { value: "delivery" }
                                                })
                                                .first()
            let newDeliveryAddress       = new OrderAddressModel()

            if (currentDeliveryAddress) newDeliveryAddress = newDeliveryAddress.where({ id: { value: currentDeliveryAddress.id }})
            const result = await newDeliveryAddress[ currentDeliveryAddress ? "update" : "create" ](address)
            this.response(result, response)
        }
        else res.status(400).send({message: "Unprocessable payload."})
    }

    initiateCheckout = async (req, response) => {
        if (req.body.authCart) {
            const update = await new Order().where({ id: { value: req.body.authCart.id }}).update({ token: moment().unix() })
            this.response({ data: update.data.token }, response)
        }
        else this.sendError("Unprocessable data", response)
    }
}

module.exports = new CartController