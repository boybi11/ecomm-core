// models
const Order = require('../../models/Order')
const Settings = require('../../models/Settings')
const OrderItem = require('../../models/OrderItem')
const Product = require('../../models/Product')
const moment = require('moment')

const BaseController = require('../../core/BaseController')
class DashboardController extends BaseController {

    getSales = async (req, response) => {
        const {query} = req

        if (query.start && query.end) {
            let labelQry    = ''
            let result      = new Order().with("shippingFees")
            result.appends  = []

            switch(query.type) {
                case "daily": {
                    labelQry = "TIME_FORMAT(created_at, '%H') as label"
                    break       
                }
                default: {
                    labelQry = "DATE_FORMAT(created_at, '%Y-%m-%d') as label"
                }
            }

            result = await result
                                .select([ "orders.*", labelQry, "SUM(total) as total", "SUM(subtotal) as subtotal", "SUM(total - refunded_amount) as payment_amount", "COUNT(id) as order_count"])
                                .where({is_paid: {value: 1}})
                                .whereRaw(`(created_at >= "${ query.start } 00:00:00" AND created_at <= "${ query.end } 23:59:59")`)
                                .where({ status: { value: "cart", operation: "!=" } })
                                .groupBy(["label", "source"])
                                .orderBy("created_at", "asc")
                                .get()  
                                        
            this.response(result, response)

        }
        else res.status(204).send([])
    }

    getNewOrders = async (req, response) => {
        const result = await new Order()
                                    .select(["COUNT(id) as total"])
                                    .where({status: {value: "placed"}})
                                    .first()

        this.response(result, response)
    }

    getTBDOrders = async (req, response) => {
        const now = moment().format('YYYY-MM-DD')
        const result = await new Order()
                                    .select(["COUNT(id) as total"])
                                    .whereRaw(`(((delivery_start_date >= "${now} 00:00:00" AND delivery_start_date <= "${now} 23:59:59") OR (delivery_end_date >= "${now} 00:00:00" AND delivery_end_date <= "${now} 23:59:59") OR (delivery_start_date >= "${now} 00:00:00" AND delivery_end_date <= "${now} 23:59:59")) AND (status = "placed" OR status = "processing"))`)
                                    .first()

        this.response(result, response)
    }

    getOverdueOrders = async (req, response) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const result = await new Order()
                                    .select(["COUNT(id) as total"])
                                    .whereRaw(`((status!="delivered" AND status!="received" AND status!="cancelled") AND delivery_end_date < "${now}")`)
                                    .first()

        this.response(result, response)
    }

    getInactiveCarts = async (req, response) => {
        const settings = new Settings().where({ slug: {value: "cart-inactivity"} }).first()
        let inactiveHours = 24
        if (settings) inactiveHours = settings.value ? +settings.value : 0

        const result = await new Order()
                                    .select(["COUNT(id) as total"])
                                    .where({ status: {value: "cart"} })
                                    .whereRaw(`(updated_at < DATE_SUB(NOW(), INTERVAL ${inactiveHours} HOUR))`)
                                    .groupBy("status")
                                    .first()

        this.response(result, response)
    }

    getUnitSoldRankings = async (req, response) => {
        const { query } = req

        const result = await new OrderItem()
                                    .with(["product:(asset)"])
                                    .select(['product_id', "SUM(quantity) as count", "order_items.price" ])
                                    .join("orders", 'order_items.order_id = orders.id', "left")
                                    .whereRaw('(orders.status != "cancelled" AND orders.is_paid = 1)')
                                    .max(query.size ? query.size : 5)
                                    .groupBy("product_id")
                                    .orderBy("count", query.sort ? query.sort : "DESC")
                                    .get()

        this.response(result, response)
    }

    getUnitSalesRankings = async (req, response) => {
        const { query } = req
        
        const result = await new OrderItem()
                                    .with(["product:asset"])
                                    .select(['product_id', "SUM(order_items.price * quantity) as count", "products.deleted_at", "products.parent", "order_items.price"])
                                    .join("products", "order_items.product_id = products.id", "inner")
                                    .join("orders", 'order_items.order_id = orders.id', "left")
                                    .whereRaw('(products.deleted_at IS NULL AND orders.status != "cancelled" AND orders.is_paid = 1)')
                                    .max(query.size ? query.size : 5)
                                    .groupBy("product_id")
                                    .orderBy("count", query.sort ? query.sort : "DESC")
                                    .get()

        this.response(result, response)
    }

    getUnitRatingRankings = async (req, response) => {
        const { query } = req

        const result = await new Product()
                                    .with(["asset"])
                                    .withJoin({ stock: false })
                                    .max(query.size ? query.size : 5)
                                    .orderBy("ratings", query.sort ? query.sort : "DESC")
                                    .get()

        this.response(result, response)
    }

    getTopSpenders = async (req, response) => {
        const { query } = req

        const result = await new Order()
                                    .with(["customer:asset"])
                                    .select(["user_id", "SUM(total) as spendings"])
                                    .where({
                                        user_id: { value: 0, operation: "!=" },
                                        is_paid: { value: 1 }
                                    })
                                    .max(query.size ? query.size : 5)
                                    .groupBy("user_id")
                                    .orderBy("spendings", query.sort ? query.sort : "DESC")
                                    .get()

        this.response(result, response)
    }

    getCustomers = async (req, response) => {
        const User      = require('../../models/User')
        const {query}   = req
        let users
        let labelQry    = ''

        switch(query.rangeType) {
            case "daily": {
                labelQry = `TIME_FORMAT(orders.created_at, '%H') as label`
                break       
            }
            default: {
                labelQry = `DATE_FORMAT(orders.created_at, '%Y-%m-%d') as label`
            }
        }

        users = await new User()
                            .select([ "users.*", labelQry, "users.id" ])
                            .join("orders", "orders.user_id = users.id", "left")
                            .where({
                                is_paid: { value: 1 },
                                is_first: { value: query.type === "returning" ? null : 1 }
                            })
                            .whereRaw(`(orders.created_at >= "${ query.start } 00:00:00" AND orders.created_at <= "${ query.end } 23:59:59")`)
                            .groupBy(["label", "users.id"])
                            .orderBy("orders.created_at", "asc")
                            .get()
        
        if (query.type === "returning") {
            let repeatRate = 0

            const repeat = await new User()
                            .select([ labelQry, "users.id" ])
                            .join("orders", "orders.user_id = users.id", "left")
                            .where({
                                is_paid: { value: 1 },
                                is_first: { value: null }
                            })
                            .whereRaw(`(orders.created_at >= "${ query.start } 00:00:00" AND orders.created_at <= "${ query.end } 23:59:59")`)
                            .groupBy(["users.id"])
                            .orderBy("orders.created_at", "asc")
                            .get()

            const customerCount = await new User()
                                    .select([ "users.id" ])
                                    .join("orders", "orders.user_id = users.id", "left")
                                    .where({
                                        is_paid: { value: 1 },
                                        is_first: { value: 1 }
                                    })
                                    .groupBy(["users.id"])
                                    .get()

            repeatRate  = parseFloat((repeat.length / customerCount.length) * 100).toFixed(2)
            users       = { list: users, rate: repeatRate }
        }

        this.response(users, response)
    }

    getSalesByLocation = async (req, response) => {
        const { query }         = req
        const OrderAddress      = require('../../models/OrderAddress')
        let byLocation          = new OrderAddress()
                                    .select([ "SUM(total - refunded_amount) as total", "province_id", "area_id", "city_id", "orders.created_at" ])
                                    .join("orders", "orders.id = order_addresses.order_id AND orders.status != 'cart' AND order_addresses.type = 'delivery'", "left")
                                    .where({ is_paid: { value: 1 } })
                                    .whereRaw(`(orders.created_at >= "${ query.start } 00:00:00" AND orders.created_at <= "${ query.end } 23:59:59")`)
                                    .orderBy("total", "desc")
                                    .max(7)
        
        switch(query.type) {
            case "area": {
                byLocation = byLocation.groupBy("area_id")
                break
            }
            case "city": {
                byLocation = byLocation.groupBy("city_id")
                break
            }
            default: {
                byLocation = byLocation.groupBy("province_id")
                break
            }
        }
        
        byLocation = await byLocation.get()

        this.response(byLocation, response)
    }
}

module.exports = new DashboardController