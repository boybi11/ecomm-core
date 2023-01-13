const moment            = require('moment')
const InventoryLocation = require('../models/InventoryLocation')
const InventoryHistory  = require('../models/InventoryHistory')

class InventoryHelper {

    logV2 = async (newData, action = "restock") => {

        switch (action) {
            // case "transfer": {
            //     await this.#transfer(newData, relocation)
            //     break;
            // }
            case "pull out": return this.#pullOut(newData)
            default: return await this.#restock(newData)
        }
    }

    #restock = async (data) => await new InventoryHistory().create({ ...data, action: "restock", message: "Restock" })

    #transfer = async (data, relocation) => {
        await this.#pullOut({ ...relocation })
        await this.#restock({ ...data, location_2: relocation.id })
    }

    #pullOut = async (data) => {
        let pullOutData = Array.isArray(data) ? data : [ data ]
        return await new InventoryHistory().create(pullOutData.map(d => ({ ...d, action: "pull out", message: "Pull out" })))
    }

    log = async (newData, prevData) => {
        let logData = {}

        if (!prevData) logData = { ...newData, action: "restock"}
        else {
            logData.product_id  = prevData.product_id
            logData.action      = "restock"
            logData.quantity    = +newData.quantity - +prevData.quantity
            logData.message     = ''
            logData.location    = newData.location

            if (newData.id && ((newData.id !== prevData.id) || (newData.location !== prevData.location))) {
                const prevSloc      = prevData.sloc ? prevData.sloc.name : "unregistered"
                let newSloc         = "unregistered"

                if (newData.location) {
                    newSloc = await new InventoryLocation().find(newData.location)
                    if (newSloc) newSloc = newSloc.name
                }

                logData.action      = "transfer"
                logData.message     = `Transfered stock from ${ prevSloc } to ${ newSloc }`
                logData.quantity    = newData.quantity
                logData.location_2  = prevData.sloc.id
            }
            else if (newData.id && newData.shelf_life !== prevData.shelf_life) {
                const oldExpDate    = prevData.expiration_date ? moment(prevData.expiration_date).format('MMM DD, YYYY') : "Non-expiring"
                const newExpDate    = newData.expiration_date ? moment(newData.expiration_date).format('MMM DD, YYYY') : "Non-expiring"
                logData.quantity    = newData.quantity
                logData.action      = "update"
                logData.message     = `Expiration changed from ${ oldExpDate } to ${ newExpDate } in location ${ newData.sloc ? newData.sloc.name : "unregistered" }`
            }
            
            if (logData.quantity < 0) {
                logData.action = "pull out"
                logData.quantity *= -1 // make the quantity a positive number
            }
        }

        if (logData.quantity) await new InventoryHistory().create(logData)
    }
}

module.exports = new InventoryHelper