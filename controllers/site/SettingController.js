const Settings = require('../../models/Settings');
const BaseController = require('../../core/BaseController')

class SettingController extends BaseController {

    get = async (req, response) => {
        const result = await new Settings().includeAppend("asset").where({ slug: { value: "%-policy%", operation: " NOT LIKE " }}).get()
        this.response(result, response)
    }
};

module.exports = new SettingController;