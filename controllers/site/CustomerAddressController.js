const CustomerAddress   = require('../../models/CustomerAddress')
const User              = require('../../models/User')
const BaseController    = require('../../core/BaseController')

class CustomerAddressController extends BaseController {

    get = async (req, response) => {
        if (req.authUser) {
            const result = await new CustomerAddress()
                                    .where({ user_id: { value: req.authUser.id } })
                                    .paginate(req.body.pageSize, req.body.page)

            this.response(result, response)
        }
        else this.sendError("Unprocessable request!", response)
    }

    store = async (req, response) => {
        if (req.authUser) {
            const data  = {
                            ...req.body,
                            user_id: req.authUser.id
                        }
            const create = await new CustomerAddress().create(data)
    
            if (create && !create.error) {
    
                if (!(+req.authUser.delivery_address_id)) {
                    await new User().where({ id: { value: req.authUser.id } }).update({ delivery_address_id: create.result.insertId })
                    create.data.is_primary = 1
                }
    
                this.response(create.data || create, response)
            }
            else this.response(create, response)
        }
        else this.sendError("Unprocessable request!", response)
    }

    edit = async (req, response) => {
        if (req.authUser && req.params.id) {
            const result = await new CustomerAddress()
                                        .where({
                                            id: { value: req.params.id },
                                            user_id: { value: req.authUser.id }
                                        })
                                        .first()

            this.response(result, response)
        }
        else this.sendError("Unprocessable request!", response)
    }

    update = async (req, response) => {
        if (req.authUser && req.params.id) {
            const update = await new CustomerAddress()
                                        .where({
                                            id: { value: req.params.id },
                                            user_id: { value: req.authUser.id }
                                        })
                                        .update(req.body)

            this.response(update.data || update, response)
        }
        else this.sendError("Missing request parameter", response)
    }

    delete = async (req, response) => {
        if (req.params.id && req.authUser) {
            let result = await new CustomerAddress()
                                    .where({
                                        id: { value: req.params.id },
                                        user_id: { value: req.authUser.id }
                                    })
                                    .delete([])

            this.response(result, response)
        }
        else this.sendError("Unprocessable request!", response)
    }

    setAsDefault = async (req, response) => {
        if (req.authUser && req.params.id) {
            const address = await new CustomerAddress()
                                        .where({
                                            id: { value: req.params.id },
                                            user_id: { value: req.authUser.id }
                                        })
                                        .first()

            if (address) {
                const update = await new User().where({ id: { value: req.authUser.id }}).update({ delivery_address_id: req.params.id })
                if (update.error) this.response(update, response)
                else response.status(204).send()
            }
            else this.sendError("Unprocessable request!", response)
        }
        else this.sendError("Unprocessable request!", response)
    }
}

module.exports = new CustomerAddressController