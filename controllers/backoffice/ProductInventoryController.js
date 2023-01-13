const moment            = require('moment')
const BaseController    = require('../../core/BaseController')
const ProductInventory  = require('../../models/ProductInventory')
const InventoryHistory  = require('../../models/InventoryHistory')
const Product           = require('../../models/Product')
const InventoryHelper   = require('../../helpers/InventoryHelper')

class ProductInventoryController extends BaseController {

    get = async (req, response) => {
        const {
            params: { productId },
            query: { location }
        } = req
        
        const result = await new InventoryHistory()
                                        .availableStocks(location, productId)
                                        .includeAppend([ "to_fulfill" ])
                                        .paginate()

         this.response(result, response)
    }

    store = async (req, response) => {
        const {
            body,
            params: { productId }
        } = req

        if (productId) {
            body.product_id      = productId
            body.expiration_date = this.#expirationDateFormat(body.shelf_life)
            const result         = await InventoryHelper.logV2(body)
            this.response(result, response)
        }
        else this.sendError("Missing request parameter.", response)
    }

    update = async (req, response) => {
        const {
            body,
            params: { id }
        } = req

        if (id) {
            const result = await InventoryHelper.logV2(body, body.quantityControl.toLowerCase())
            this.response(result, response)
        }
        else this.sendError("Missing request parameter.", response)
    }

    delete = async (req, response) => {
        const { body: { inventories } } = req
        let result

        if (Array.isArray(inventories)) result = await InventoryHelper.logV2(inventories.map(i => ({ ...i, quantity: +i.available || 0})), "pull out")

        this.response(result, response)
    }

    history = async (req, response) => {
        const {
            query: { page, pageSize, filters }
        } = req

        let result = new InventoryHistory()
                            .with("product")
                            .includeAppend("orderDetails")

        if (filters.location) {
            result = result.whereRaw(`(location = ${ filters.location } OR location_2 = ${ filters.location })`)
            delete filters.location
        }
        
        this.filter(result, { filters })
        result = await result
                        .orderBy("id", "DESC")
                        .paginate(pageSize, page)

        this.response(result, response)
    }
    #expirationDateFormat = (shelfLife) => {
        return +shelfLife ? moment().add(shelfLife, "days").format("YYYY-MM-DD") : null
    }
}

module.exports = new ProductInventoryController