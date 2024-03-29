const socketClient   = require('socket.io-client')
const OrderItem      = require('../../models/OrderItem')
const Order          = require('../../models/Order')
const BaseController = require('../../core/BaseController')

class OrderItemController extends BaseController {

    constructor() {
        super()
        const config = require('../../config')
        this.socket = socketClient(config.URL.base, {transports: [ 'websocket' ]})
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
    }

    get = async (req, response) => {
        if (req.params.ref || req.authUser) {
            const whereQuery = { status: { value: "cart" } }
            
            if (req.authUser)  whereQuery.user_id = { value: req.authUser.id }
            else if (req.params.ref && req.params.ref !== 'undefined') whereQuery.reference_number = { value: req.params.ref }

            const cart = await new Order()
                                    .select([ "reference_number", "user_id" ])
                                    .where(whereQuery)
                                    .first()
            if (cart) {
                const result = await new OrderItem()
                                    .where({ order_id: { value: cart.id }})
                                    .with([ "product:asset" ])
                                    .get()

                this.response(result, response)
            }
            else this.sendError("Something went wrong")
        }
        else this.sendError("Missing request paramters", response)
    }

    findCheckoutItems = async (req, response) => {
        const result = await new OrderItem()
                                    .whereIn({ id: req.body.items })
                                    .with([ "product:asset-?withJoin" ])
                                    .get()

        this.response(result, response)
    }

    store = async (req, response) => {
        let result = await new OrderItem().create(req.body.item)

        if (result && !result.error) {
            result = await new OrderItem()
                                .with("product:(asset-?forTable)")
                                .where({ id: { value: result.result.insertId } })
                                .first()
        }

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.body.item.order_id && req.body.item.product_id) {
            const update = await new OrderItem()
                                .with("product:(asset-?forTable)")
                                .where({
                                    order_id: {value: req.body.item.order_id},
                                    product_id: { value: req.body.item.product_id }
                                })
                                .whereRaw(`deleted_at IS NULL`)
                                .update(req.body.item)

            this.response(update.data || update, response)
        }
        else this.sendError("Missing request parameter.", response)
    }

    updateItemQty = async (req, response) => {
        const { id } = req.params
        
        const update = await new OrderItem()
                                    .with("product:(asset-?forTable)")
                                    .where({ id: { value: id } })
                                    .update({ quantity: req.body.quantity })
        
        this.response(update.data || update, response)
    }

    delete = async (req, response) => {
        const result = await new OrderItem().delete([ req.params.id ])
        if (result && !result.error) result.deleted_id = req.params.id
        this.response(result, response)
    }
}

module.exports = new OrderItemController