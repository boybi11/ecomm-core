const Order = require('../../models/Order')
const moment = require('moment')
const socketClient = require('socket.io-client')

const BaseController = require('../../core/BaseController')
const OrderHelper = require('../../helpers/OrderHelper')
const OrderSocket = require('../../helpers/OrderSocketHelper')

const Emailer = require('../../factories/Emailer')
class OrderController extends BaseController {

    constructor() {
        super()
        const config = require('../../config')
        this.socket = socketClient(config.URL.base, {transports: [ 'websocket' ]})
    }

    get = async (req, response) => {
        const { query } = req
        let orders      = new Order()
                            .forTable()
                            .with("items")

        orders = orders.where({ status: { value: "cart", operation: "!=" }}) 
        orders = this.filter(orders, query)
        // orders = orders.where(OrderHelper.generateGetFilter(orders, query.filters))
        this.sort(orders, query.sort)

        const result = await orders.paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    store = async (req, response) => {
        let data = {...req.body}

        if (data.user_id) {
            const otherOrders = await new Order().where({ user_id: { value: data.user_id }}).first()
            if (!otherOrders) data.is_first = 1
        }

        const create = await new Order().create({ ...data.order, status: "placed", source: "direct" })
        if (create && !create.error) {
            const result            = create.result
            const referencNumber    = +result.insertId + 100000

            await new Order().where({id: {value: result.insertId }}).update({ reference_number: referencNumber })
            await OrderHelper.saveFees(result.insertId, data.fees)
            const orderItems = await OrderHelper.saveOrderItems(req.body.items, result.insertId, "placed")
            
            if (orderItems && !orderItems.error) {
                const orderAddress = await OrderHelper.saveOrderAddress(data, result.insertId)

                if (orderAddress && !orderAddress.error) {
                    const logData = { order_id: result.insertId, user_id: req.authUser.id }
                    this.socket.connect()

                    await OrderHelper.log({ ...logData, action: "placed" })
                    if (data.order.is_paid) {
                        await OrderHelper.log({ ...logData, action: "paid" })
                        this.socket.emit("orderPayment")
                    }
                    this.socket.emit("order-status", { status: "placed", userId: data.order.user_id })
                    this.socket.emit("forceDC")
                    this.response(create, response)
                }
                else this.response(orderAddress, response)
            }
            else this.response(orderItems, response)
        }
        else this.response(create, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) this.sendError("Missing request paramter.", response)
        else {
            const result = await new Order()
                                        .with([
                                            "items:(fulfillments:sloc-product:(asset-uoms)->fulfillment_total)",
                                            "cancelled_items:(product:asset->returned_stocks)",
                                            "delivery_address",
                                            "billing_address",
                                            "customer:asset",
                                            "fees"
                                        ])
                                        .where({"id": {value: req.params.id}})
                                        .first()

            if (result && !result.error) {
                if (result.status === "placed") {
                    await new Order().where({id: {value: result.id}}).update({status: "processing", seen_at: null, status_updated_at: moment().format()})

                    result.status = "processing"
                    result.processing_date = moment().format()
                    await OrderHelper.log({ order_id: result.id, user_id: req.authUser.id, action: "processing" })
                    if (result.user_id) {
                        const socketPayload = [{
                            userId: result.user_id,
                            payload: {
                                orderIds: [ result.id ],
                                affectedStatuses: [ "placed", "processing" ]
                            }
                        }]
                        OrderSocket.updateUnseenOrder({ status: "unseen", data: socketPayload }, true)
                    }
                }
                
                this.response(result, response)
            }
            else this.response(result, response)
        }
    }

    update = async (req, response) => {
        if (req.params.id) {
            let data = {...req.body}
            const currentOrder = await new Order().where({id: {value: req.params.id}}).first()

            if (currentOrder && !currentOrder.error) {
                const result = await new Order().where({id: {value: req.params.id}}).update(data)
                await OrderHelper.saveOrderItems(req.body.items, req.params.id, (data.order.status || currentOrder.status))
                if (result && !result.error) {
                    const orderAddress = await OrderHelper.saveOrderAddress(data, req.params.id)
                    if (orderAddress && !orderAddress.error) {
                        await OrderHelper.saveFees(req.params.id, data.fees)
                        OrderHelper.logPayment({ req, currentOrder, socket: this.socket })

                        if (currentOrder.status !== data.order.status) {
                            await OrderHelper.log({ order_id: currentOrder.id, user_id: currentOrder.user_id, action: data.order.status })
                            // this.socket.emit("order-status", { status: data.order.status, userId: currentOrder.user_id, orderIds: [ req.params.id ] })
                            if (currentOrder.user_id) {
                                const socketPayload = [{
                                    userId: currentOrder.user_id,
                                    payload: {
                                        orderIds: [ currentOrder.id ],
                                        affectedStatuses: [ currentOrder.status, data.order.status ]
                                    }
                                }]
                                OrderSocket.updateUnseenOrder({ status: "unseen", data: socketPayload })
                            }
                            const orderEmailTemplate = require('../../email/templates/orders')
                            await new Emailer("noreply").send({
                                to: data.address.email,
                                subject: `Order #${ currentOrder.reference_number } ${ data.order.status }`,
                                html: (siteDetails) => orderEmailTemplate({ order: { ...data, order: result.data }, type: data.order.status, siteDetails })
                            })
                        }
                        this.response(result, response)
                    }
                    else this.response(orderAddress, response)
                }
                else this.response(result, response)
            }
            else this.response(currentOrder, response)
        }
        else this.response("Missing request parameter.", response)
    }

    delete = (req, res) => this.deleteAll(req, res, new Order())

    //CUSTOM REQUESTS
    getLogs = async (req, response) => {
        if (!req.query.id) this.sendError("Missing request paramter")
        else {
            const OrderHistory = require('../../models/OrderHistory'),
            { query } = req
        
            const reulst = await new OrderHistory()
                                        .with('user')
                                        .where({order_id: {value: req.query.id}})
                                        .orderBy("id", "desc")
                                        .paginate(query.pageSize, query.page)

            this.response(result, response)
        }
    }

    updateStatus = async (req, response) => {
        if (req.body.ids) {
            let data = { ...req.body, seen_at: null, status_updated_at: moment().format()}
            const orderEmailTemplate = require('../../email/templates/orders')
            const withTables = [ "items:product:asset", "delivery_address", "billing_address", "customer:asset", "fees" ]

            const orders = await new Order().with( withTables ).whereIn({id: data.ids}).get()

            if (orders && !orders.error) {
                const update = await new Order().whereIn({id: data.ids}).update(data)
                if (update && !update.error) {
                    await OrderHelper.log({
                        order_id: req.body.ids,
                        user_id: req.authUser.id,
                        action: data.status,
                        tracking_number: data.tracking_number
                    })

                    const userIds       = []
                    const lastStatus    = []
                    const orderEmals    = orders.map(order => {
                                            if (!userIds.includes(order.user_id)) {
                                                userIds.push(order.user_id)
                                                lastStatus.push(order.status)
                                            }
                                            return {
                                                to: order.delivery_address.email,
                                                subject: `Order #${ order.reference_number } ${ order.status }`,
                                                html: (siteDetails) => orderEmailTemplate({ order, type: data.status, siteDetails })
                                            }
                                        })

                    if (userIds.length) {
                        this.socket.connect()
                        this.socket.emit("order-status", { status: data.status, userId: userIds, orderIds })
                        this.socket.emit("order-seen-update", { status: "unseen", newStatus: data.status, userId: userIds, lastStatus })
                        this.socket.emit("forceDC")
                    }

                    await new Emailer("noreply").send(orderEmals)
                    this.response(update, response)
                }
                else this.response(update, response)
            }
            else this.response(orders, response)
        }
        else this.sendError("Missing request paramter.", response)
    }

    updatePaymentStatus = async (req, response) => {
        if (req.body.ids) {
            let data = {...req.body}
            
            if (data.is_paid === 0) data.payment_amount = 0
            const result = await new Order()
                                        .whereIn({id: data.ids})
                                        .update(data)

            if (result && !result.error) await OrderHelper.logPayment({ req, currentOrder: null, socket: this.socket })
            this.response(result, response)
        }
        else this.response("Missing request paramter.", response)
    }

    updatePaymentAmount = async (req, response) => {
        if (req.body.id && req.body.payment_amount !== undefined) {
            let data = {...req.body}
            
            const order = await new Order()
                                        .where({id: {value:data.id}})
                                        .first()
            if (order && !order.error) {
                let is_paid = 1
                if (+data.payment_amount === 0) is_paid = 0

                const result = await new Order()
                                            .where({id: {value:data.id}})
                                            .update({payment_amount: data.payment_amount, is_paid})
                
                if (result && !result.error) {
                    await OrderHelper.log({
                        orderId: req.body.ids,
                        userId: req.authUser.id,
                        action: is_paid === 0 ? 'unpaid' : 'payment',
                        message: is_paid ? `changed the payment amount from <span class="txt-bold">${fRes.payment_amount}</span> to <span class="txt-bold">${data.payment_amount}</span>` : ''
                    })
                }

                this.response(result, response)
            }
            else this.response(order, response)
        }
        else this.sendError("Missing request paramters.", respone)
    }
}

module.exports = new OrderController