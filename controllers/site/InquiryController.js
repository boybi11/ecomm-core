const Inquiry = require('../../models/Inquiry')
const BaseController = require('../../core/BaseController')

class InquiryController extends BaseController {

    store = async (req, response) => {
        const create  = await new Inquiry().create(req.body)
        this.response(create, response)
    }
};

module.exports = new InquiryController;