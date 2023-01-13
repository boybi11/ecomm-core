const Activity = require('../../models/Activity')
const BaseController = require('../../core/BaseController')

class ActivityController extends BaseController {
    get = async (req, response) => {
        let activities = await new Activity()
                                        .with("user")
                                        .where({
                                            ref_id: { value: req.query.refId ? req.query.refId : 0 },
                                            model: { value: req.query.model ? req.query.model : '' }
                                        })
                                        .orderBy("created_at", "DESC")
                                        .paginate(req.query.pageSize, req.query.page)

        this.response(activities, response)
    }
}

module.exports = new ActivityController