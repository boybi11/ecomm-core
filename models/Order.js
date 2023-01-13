const Base = require('../core/BaseModelV2')
const OrderHistory = require('./OrderHistory')
const OrderRefundRequest = require('./OrderRefundRequest')

class Order extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "orders"
        this.searchables    = [ "reference_number" ]
        this.fillables      = {
                                "source": "string",
                                "user_id": "int",
                                "coupon_id": "int",
                                "reference_number": "string",
                                "checkout_reference": "string",
                                "tracking_number": "string",
                                "is_paid": "int",
                                "payment_method": "string",
                                "status": "string",
                                "subtotal": "decimal",
                                "total": "decimal",
                                "payment_amount": "decimal",
                                "discount_amount": "decimal",
                                "refunded_amount": "decimal",
                                "remarks": "string",
                                "special_instructions": "string",
                                "delivery_start_date": "datetime",
                                "delivery_end_date": "datetime",
                                "created_at": "datetime",
                                "updated_at": "datetime",
                                "status_updated_at": "datetime",
                                "deleted_at": "datetime",
                                "seen_at": "datetime",
                                "paid_at": "datetime",
                                "is_first": "int",
                                "token": "string"
                            }
        this.appends        = ["status_date", "refund_request"]
    }

    fees = () => this.hasMany('OrderFee', 'order_id', 'id')
    
    shippingFees = () => this.hasMany('OrderFee', 'order_id', 'id', {where: {name: {value: "shipping_fee"}}})

    customer = () => this.hasOne('User', 'id', 'user_id')

    items = () => this.hasMany('OrderItem', 'order_id', 'id')

    cancelled_items = () => this.hasMany('OrderItem', 'order_id', 'id', { withTrashed: "", whereRaw: '(status = "cancelled" OR status = "refunded")' })

    delivery_address = () => this.hasOne('OrderAddress', 'order_id', 'id', {whereRaw: "(type = 'delivery' OR type = 'pickup')"})

    billing_address = () => this.hasOne('OrderAddress', 'order_id', 'id', {where: {type: {value: "billing"}}})

    forTable = () => this.select([ "id", "reference_number", "status", "source", "total", "payment_method", "is_paid" ])

    appendRefundRequest = async (data, connection) => {

        const result = await new OrderRefundRequest(connection)
                                    .with("assets")
                                    .where({ order_id: { value: data.id } })
                                    .first()
        
        if (result && !result.error) data.refund_request = result
        return data
    }
    
    appendStatusDate = async (data, connection) => {
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
}

module.exports = Order