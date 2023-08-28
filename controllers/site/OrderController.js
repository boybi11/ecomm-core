const Order         = require('../../models/Order')
const OrderFee      = require('../../models/OrderFee')
const OrderItem     = require('../../models/OrderItem')
const OrderAddress  = require('../../models/OrderAddress')
const socketClient  = require('socket.io-client')
const moment        = require('moment')

const LogHelper         = require('../../helpers/LogHelper')
// const OrderHelper       = require('../../helpers/OrderHelper')
// const NotifHelper       = require('../../helpers/NotificationHelper')
const OrderSocket       = require('../../helpers/OrderSocketHelper')
// const OrderItemHelper   = require('../../helpers/OrderItemHelper')
// const Emailer           = require('../../factories/Emailer')
const BaseController    = require('../../core/BaseController')

const statusMap         = {
                            processing: ["processing", "placed"],
                            "to-ship": ["fulfilled", "booked"],
                            "in-transit": [ "in-transit" ],
                            delivered: ["delivered"],
                            received: ["received"],
                            cancelled: ["cancelled"],
                            refunded: ["refunded"]
                        }

class OrderController extends BaseController {
    constructor() {
        super()
        const config = require('../../config')
        this.socket = socketClient(config.URL.base, {transports: [ 'websocket' ]})
        this.receiveOrder = this.receiveOrder.bind(this)
        this.placeOrder = this.placeOrder.bind(this)
        this.cancelOrder = this.cancelOrder.bind(this)
        this.setSeenHistory = this.setSeenHistory.bind(this)
    }

    get = async (req, response) => {
        if (req.authUser?.id) {
            const { query } = req
            let result      = new Order()
                                    .with([ "items:product:(asset)" ])
                                    .forTable()

            if (statusMap[query.status]) result = result.whereIn({ status: statusMap[query.status] })
            else result = result.where({ status: { value: "cart", operation: "!=" }})
            
            result = await result.where({ user_id: { value: req.authUser.id } })
                            .orderBy("status_updated_at", "DESC")
                            .paginate(query.pageSize, query.page)

            this.response(result, response)
        }
        else this.sendError("Unprocessable request!", response)
    }

    find = async (req, response) => {
        if (req.params.ref) {
            const result = await new Order()
                                .with([
                                    "items:product:(asset-category)",
                                    "delivery_address",
                                    "fees"
                                ])
                                .where({
                                    reference_number: { value: req.params.ref },
                                    user_id: {value: req.authUser ? req.authUser.id : 0},
                                    status: {value: "cart", operation: "!="}
                                })
                                .first()

            this.response(result, response)
        }
        else this.sendError("Invalid order reference", response)
    }

    placeOrder = async (req, response) => { 
        const {
            order,
            items,
            fees,
            address }       = req.body.checkout
        const placedOrder   = await new Order().create(order)
        const orderId       = placedOrder.data.id
        
        // update all cart items to newly placed order
        await Promise.all(items.map(async item => {
            return await new OrderItem()
                                .where({
                                    product_id: { value: item.product_id },
                                    order_id: { value: req.body.authCart.id }
                                })
                                .update({ ...item, order_id: orderId })
        }))
        await new OrderFee().create(fees.map(fee => ({ ...fee, order_id: orderId }))) // insert order fees
        await new OrderAddress().create({ ...address, order_id: orderId })

        await LogHelper.logOrderActivity({
                    order_id: orderId,
                    user_id: req.body.authCart.user_id,
                    action: "placed"
                })

        await new Order()
                .where({ id: { value: req.body.authCart.id }})
                .update({ token: '' })

        await new Order()
                .where({ id: { value: orderId }})
                .update({ reference_number: +orderId + 100000 })
        // OrderSocket.orderPalced()
        this.response("Order placed", response)
    }

    cancelOrder(req, res) {
        if (req.params.ref) {
            const self = this
            const whereQry = {
                reference_number: { value: req.params.ref },
                user_id: { value: req.authUser ? req.authUser.id : 0 }
            }

            new Order()
                .with(["items"])
                .where( whereQry )
                .first()
        }
        else res.status(400).send({message: "No reference number provided"})
    }

    receiveOrder = async (req, response) => {
        if (req.params.ref) {
            const whereQry = {
                status: { value: "delivered" },
                reference_number: { value: req.params.ref },
                user_id: { value: req.authUser ? req.authUser.id : 0 }
            }

            const order = await new Order()
                                    .with(["items"])
                                    .where( whereQry )
                                    .first()

            if (order && !order.error) {
                const result = await new Order()
                                        .where( whereQry )
                                        .update({ status: "received ", seen_at: null, status_updated_at: moment().format()})

                if (result && !result.error) {
                    this.socket.connect()
                    this.socket.emit("orderStatus", { status: "received", userId: order.user_id })
                    if (order.user_id)
                        this.socket.emit("orderSeenUpdate", { data: {status: "unseen", actions: ["received"]}, userId: order.user_id, lastStatus: [ order.status ] })
                    this.socket.emit("forceDC")
                    
                    await LogHelper.logOrderActivity({
                        order_id: order.id,
                        user_id: req.authUser ? req.authUser.id : 0,
                        action: "received"
                    })
                }

                this.response(result, response)
            }
            else this.response(order, response)
        }
        else this.sendError("Missing request parameter", response)
    }

    getAllUnseenHistory = async (req, response) => {

        const result = await new Order()
                                .select(['status', "COUNT(status) as count", "user_id"])
                                .where({ "user_id": { value: req.authUser.id } })
                                .whereRaw("seen_at IS NULL")
                                .groupBy("status")
                                .get()

        this.response(result, response)
    }

    setSeenHistory(req, res) {
        const moment = require('moment')
        

        if (req.authUser && req.authUser.id) {
            const self = this
            new Order()
                .where({
                    user_id: { value: req.authUser.id }
                })
                .whereIn({ status : statusMap[req.body.action] })
                .update({ seen_at: moment().format()}, function(err) {
                    if (req.authUser.id){
                        self.socket.connect()
                        self.socket.emit("orderSeenUpdate", { data: {status: "seen", actions: statusMap[req.body.action]}, userId: req.authUser.id })
                        self.socket.emit("forceDC")
                    }

                    res.send({ message: "Data updated" })
                })
        }
        else res.status(400).send("Missing id or action parameters.")
    }
}

module.exports = new OrderController