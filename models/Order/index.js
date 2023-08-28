const Base      = require('../../core/BaseModelV2')
const config    = require('./config')
const utils     = require('./utils')

class Order extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "orders"
        this.searchables    = config.searchables
        this.fillables      = config.fillables
        this.appends        = config.appends
    }

    fees = () => this.hasMany('OrderFee', 'order_id', 'id')
    
    shippingFees = () => this.hasMany('OrderFee', 'order_id', 'id', {where: {name: {value: "shipping_fee"}}})

    customer = () => this.hasOne('User', 'id', 'user_id')

    items = () => this.hasMany('OrderItem', 'order_id', 'id')

    cancelled_items = () => this.hasMany('OrderItem', 'order_id', 'id', { withTrashed: "", whereRaw: '(status = "cancelled" OR status = "refunded")' })

    delivery_address = () => this.hasOne('OrderAddress', 'order_id', 'id', {whereRaw: "(type = 'delivery' OR type = 'pickup')"})

    billing_address = () => this.hasOne('OrderAddress', 'order_id', 'id', {where: {type: {value: "billing"}}})

    forTable = () => this.select([ "id", "reference_number", "status", "source", "total", "payment_method", "is_paid" ])

    appendRefundRequest = utils.getRefundRequest
    
    appendStatusDate = utils.getStatusDates

    appendItemCount = utils.getItemCount
}

module.exports = Order