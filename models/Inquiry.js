const Base = require('../core/BaseModelV2')
class Inquiry extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "inquiries"
        this.fillables  = {
                            "first_name": "string",
                            "last_name": "string",
                            "email": "string",
                            "message": "text",
                            "topic": "string",
                            "created_at": "datetime"
                        }
    }
}

module.exports = Inquiry