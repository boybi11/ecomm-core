const Base = require('../core/BaseModelV2')
class AdminRole extends Base {
    constructor(connection) {
        super(connection)

        this.table      = "admin_roles"
        this.fillables  = {
                            "name": "string",
                            "description": "string",
                            "modules": "string",
                            "created_at": "datetime"
                        }
    }
}

module.exports = AdminRole