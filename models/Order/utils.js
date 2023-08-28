const OrderHistory       = require('../OrderHistory')
const OrderItem          = require('../OrderItem')
const OrderRefundRequest = require('../OrderRefundRequest')

exports.getStatusDates = async (data, connection) => {
    const statuses      = [
                            "placed",
                            "processing",
                            "fulfilled",
                            "booked",
                            "in transit",
                            "delivered",
                            "received",
                            "cancelled",
                            "refunded",
                            "paid"
                        ]
    const activities    = []
    const result        = await new OrderHistory(connection)
                                .where({ order_id: {value: data.id} })
                                .whereIn({ action: statuses })
                                .orderBy("id", "ASC")
                                .get()

    if (result && !result.error) {
        result.forEach(r => {
            data[r.action.replace(' ', '_') + "_date"] = r.created_at
            activities.push(r)
        })
    }

    data.statusActivities = activities
    return data
}

exports.getRefundRequest = async (data, connection) => {

    const result = await new OrderRefundRequest(connection)
                                .with("assets")
                                .where({ order_id: { value: data.id } })
                                .first()
    
    if (result && !result.error) data.refund_request = result
    return data
}

exports.getItemCount = async (data, connection) => {
    const result = await new OrderItem(connection)
                                .select([ "sum(quantity) as total", "order_id" ])
                                .where({ order_id: { value: data.id }})
                                .first()

    data.itemCount = +(result.total || 0)
    return data
}