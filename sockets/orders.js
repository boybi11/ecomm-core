const moment = require('moment');

//helpers
const OrderHelper = require('../helpers/OrderHelper');

// models
const Order = require('../models/Order');
const OrderHistory = require('../models/OrderHistory');
const Settings = require('../models/Settings');

module.exports = {
    getInactiveCarts: (callback) => {
        new Settings()
            .where({ slug: {value: "cart-inactivity"} })
            .first(function(err, res) {
                let inactiveHours = 24;
                if (res) { inactiveHours = parseFloat(res.value) }

                new Order()
                    .select(["COUNT(id) as total"])
                    .where({ status: {value: "cart"} })
                    .whereRaw(`(updated_at < DATE_SUB(NOW(), INTERVAL ${inactiveHours} HOUR))`)
                    .groupBy("status")
                    .first(function(oErr, oRes) {
                        callback(oRes);
                    })
            });
    },
    getOrderStatusCount: (userId, callback) => {
        new Order()
            .where({
                status: {value: "cart", operation: "!="},
                user_id: {value: userId}
            })
            .select([`COUNT("status") as total`, "status"])
            .groupBy("status")
            .get(function(err, result) {
                callback(result);
            });
    },
    getOrder: (orderParams, callback) => {
        if (!orderParams) {
            callback(null);
        } else {
            const query = JSON.parse(orderParams);
            let orders = new Order();

            if (query.filters) {
                const filters = {...query.filters};
                orders = orders.where(OrderHelper.generateGetFilter(orders, filters));
            }
    
            if (query.sort && Array.isArray(query.sort) && query.sort.length === 2) {
                orders = orders.orderBy(query.sort[0], query.sort[1]);
            } else {
                orders = orders.orderBy('id', 'DESC');
            }
    
            orders
                .paginate(query.pageSize, query.page, function (err, result) {
                    if (err) {
                        callback(null);
                    } else {
                        if (result) {
                            callback(result);
                        } else {
                            callback(null);
                        }
                    }
                });
        }
    },
    getPlacedOrder: (callback) => {
        new Order()
            .select(["COUNT(id) as total"])
            .where({status: {value: "placed"}})
            .first(function(err, res) {
                callback(res ? res.total : 0)
            });
    },
    getTBDOrder: (callback) => {
        const now = moment().format('YYYY-MM-DD');
        new Order()
            .select(["COUNT(id) as total"])
            .whereRaw(`(((delivery_start_date >= "${now} 00:00:00" AND delivery_start_date <= "${now} 23:59:59") OR (delivery_end_date >= "${now} 00:00:00" AND delivery_end_date <= "${now} 23:59:59") OR (delivery_start_date >= "${now} 00:00:00" AND delivery_end_date <= "${now} 23:59:59")) AND (status = "placed" OR status = "processing"))`)
            .first(function(err, res) {
                callback(res ? res.total : 0)
            });
    },
    getOverdueOrder: (callback) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        new Order()
            .select(["COUNT(id) as total"])
            .whereRaw(`((status!="delivered" AND status!="received" AND status!="cancelled") AND delivery_end_date < "${now}")`)
            .first(function(err, res) {
                callback(res ? res.total : 0)
            });
    },
    getSales: (params, callback) => {
        const now = moment().format("YYYY-MM-DD");
        const start = params.start ? params.start : now;
        const end = params.end ? params.end : now;

        new OrderHistory()
            .where({
                action: {value: "paid"},
            })
            .whereRaw(`(created_at >= "${start} 00:00:00" AND created_at <= "${end} 23:59:59")`)
            .get(function(gErr, gRes) {
                if (gErr) {
                    callback([]);
                } else {
                    if (gRes && gRes.length) {
                        const orderIds = gRes.map(g => g.order_id);
                        new Order()
                            .where({is_paid: {value: 1}})
                            .whereIn({id: orderIds})
                            .get(function(gErr2, gRes2) {
                                if (gErr2) {
                                    callback([]);
                                } else {
                                    callback(gRes2);
                                }
                            });
                    } else {
                        callback([]);
                    }
                }
            });
    }
}