const BaseController    = require('../../core/BaseController')
const InventoryLocation  = require('../../models/InventoryLocation')

class InventoryController extends BaseController {
    get = async (req, response) => {
        let inventories = new InventoryLocation()
        const { query } = req

        this.filter(inventories, query)
        this.sort(inventories, query.sort)

        inventories.withAvailableStock(query.product_id)
        
        this.response(await inventories.paginate(query.pageSize, query.page), response)
    }

    store = async (req, response) => {
        const result = await new InventoryLocation().create(req.body)
        this.response(result, response)
    }

    edit = async (req, response) => {
        if (req.params.id) {
            const result = await new InventoryLocation()
                                    .withAvailableStock()
                                    .where({"inventory_locations.id": { value: req.params.id }})
                                    .first()

            this.response(result, response)
        }
        else this.sendError('Missing required parameter', response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            const result = await new InventoryLocation()
                                    .where({"id": { value: req.params.id }})
                                    .update(req.body)

            this.response(result, response)
        }
        else this.sendError('Missing required parameter', response)
    }
}

module.exports = new InventoryController