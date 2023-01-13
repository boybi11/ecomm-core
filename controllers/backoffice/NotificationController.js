const Notification = require('../../models/Notification')
const BaseController = require('../../core/BaseController')

class NotificationController extends BaseController {

    get = async (req, response) => {
        const { query }     = req
        let notifications   = await new Notification()
                                .where({ ref_target: { value: req.authUser.id } })
                                .orderBy("id", "DESC")
                                .paginate(query.pageSize, query.page)
        
        this.response(notifications, response)
    }

    seen = async (req, response) => {
        const result = await new Notification().seen(req.authUser.id)

        this.response(result, response)
    }

    read = async (req, response) => {
        const result = await new Notification().read(req.body.id)

        this.response(result, response)
    }
}

module.exports = new NotificationController