const CustomerAddress = require('../../models/CustomerAddress')
const UserHelper = require('../../helpers/UserHelper')

const BaseController = require('../../core/BaseController')
class CustomerAddressController extends BaseController {

    get = async (req, response) => {
        if (req.params.userId) {
            const result = await new CustomerAddress()
                                        .where({ user_id: { value: req.params.userId } })
                                        .get()
                                        
            this.response(result, response)
        }
        else this.sendError("Missing request parameter.", response)
    }

    store = async (req, response) => {
        const data = { ...req.body, country_id: 0 }

        const address = await new CustomerAddress().create(data)
        if (address && !address.error) {
            const result = await new CustomerAddress()
                                        .where({ id: { value: address.result.insertId }})
                                        .first()
                                        
            if (result && !result.error) await new UserHelper(result.user_id).updatePrimaryAddress()
            this.response(result, response)
        }
        else this.response(address, response)
    }

    edit = async (req, response) => {
        if (!req.query.id) response.status(400).send("Missing id request parameter")

        const result = await new CustomerAddress()
                                        .where({
                                            "id": {value: req.query.id},
                                            user_id: {value: req.authUser.id}
                                        })
                                        .first()

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params && req.params.id) {
            const update = await new CustomerAddress()
                                        .where({ id: {value: req.params.id } })
                                        .update(req.body)
            
            if (update && !update.error) {
                const result = await new CustomerAddress()
                                            .where({id: {value: req.params.id}})
                                            .first()

                this.response(result, response)
            }
            else this.response(update, response)
        }
        else this.sendError("Missing request paramter", response)
    }

    delete = async (req, response) => {
        if (req.body && req.body.ids) {
            const first = await new CustomerAddress()
                                        .where({ id: { value: req.body.ids[0] } })
                                        .first()
            if (first && !first.error) {
                const deleted = await new CustomerAddress()
                                            .whereIn({id: req.body.ids})
                                            .delete([])

                if (deleted && !deleted.error) await new UserHelper(first.user_id).updatePrimaryAddress()
                this.response(deleted, response)
            }   
            else this.response(first, response)                                
            
        }
        else this.sendError("Missing request paramter", response)
    }
}

module.exports = new CustomerAddressController