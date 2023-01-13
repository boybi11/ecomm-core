const Bank = require('../../models/Banks')
const BaseController = require('../../core/BaseController')
class BankController extends BaseController {
    get = async (req, response) => {
        const result = await new Bank().get()
        this.response(result, response)
    }

    store = async (req, response) => {
        const result = await new Bank().create(req.bod)
        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            const result = await new Bank()
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .update(req.body)

            this.response(result, response)
        }
        else this.sendError("Missing request paranter.", response)
    }

    delete = async (req, res) => this.deleteAll(req, res, new Bank())
}

module.exports = new BankController