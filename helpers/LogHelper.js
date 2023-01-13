const Activity = require('../models/Activity')
const OrderHistory = require('../models/OrderHistory')

class LogHelper {

    async logActivity(data) {
        const targetModel =     Array.isArray(data) ? data[0].model : data.model
        const targetIds =       Array.isArray(data) ? data.map(d => d.ref_id) : [data.ref_id]
        const DataModel =       require(`../models/${targetModel}`)
        
        const result = await new DataModel()
                                    .whereIn({id: targetIds})
                                    .withTrashed()
                                    .get()

        if (result && !result.error && result.length) {
            result.map(r => {
                if (Array.isArray(data)) {
                    data.find(d => {
                        if (d.ref_id === r.id) d.encoded_prev_data = JSON.stringify(r)
                    })
                } else {
                    if (data.ref_id === r.id) data.encoded_prev_data = JSON.stringify(r)
                }

                return r
            })
        }
        
        await new Activity().create(data)

        return true
    }

    logOrderActivity = async (data) => {
        let message = data.message ? data.message : ""
        let logs = []

        if (!message) {
            if (data.action !== "create") {
                if (data.action === "placed" || data.action === "booked") {
                    message = `<span class="txt-bold txt-success">${data.action}</span> this order ${data.action === "booked" ? `with the tracking number <span class="txt-bold txt-warning">${data.tracking_number}</span>` : ''}`
                } else {
                    message = `marked this order as <span class="txt-bold txt-${data.action === "refunded" || data.action === "cancelled" ? 'error' : 'success'}">${data.action}</span>`
                }
            }
            else message = "created this order"
        }

        if (Array.isArray(data.order_id)) {
            logs = data.order_id.map(id => {
                return {
                    ...data,
                    ...{
                        order_id: id,
                        message
                    }
                }
            })
        }
        else {
            if (Array.isArray(data.message)) {
                logs = data.message.map(logMessage => {
                    return {
                        ...data,
                        message: logMessage
                    }
                })
            }
            else logs = {...data, ...{message}}
        }
        
        return await new OrderHistory().create(logs)
    }
}

module.exports = new LogHelper