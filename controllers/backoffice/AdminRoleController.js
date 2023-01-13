const AdminRole = require('../../models/AdminRole')
const BaseController = require('../../core/BaseController')

class AdminRoleController extends BaseController {
    get = async (req, response) => {
        let roles = new AdminRole()
        const {
            query,
            authUser
        } = req

        this.filter(roles, query)
        this.sort(roles, query.sort)
        
        if (authUser.role) {
            roles = roles.where({ id: { value: authUser.role, operation: "!=" }})
        }
        
        const result = await roles
                                .paginate(query.pageSize, query.page)
                                
        this.response(result, response)
    }

    store = async (req, response) => {
        const data = { ...req.body }
        if (data.modules) data.modules = JSON.stringify(data.modules)
        const result = new AdminRole().create(data)

        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) this.sendError("Missing request parameter.", response)
        
        const result = await new AdminRole().where({"id": {value: req.params.id}}).first()
        this.response(result, response)
    }

    update = async (req, response) => {
        const data = req.body

        if (data.modules) data.modules = JSON.stringify(data.modules)
        const result = new AdminRole()
                                .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                .update(data)
        
        this.response(result, response)
    }

    delete = (req, res) => this.deleteAll(req, res, new AdminRole())

    list = async (req, response) => {
        const result = await new AdminRole().get()
        this.response(result, response)
    }
}

module.exports = new AdminRoleController