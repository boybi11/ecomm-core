const Base = require('../core/BaseModelV2')
class Email extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "emails"
        this.searchables    = [ "subject" ]
        this.fillables      = {
                                "send_to": "string",
                                "cc": "string",
                                "bcc": "string",
                                "subject": "string",
                                "html": "string",
                                "status": "string",
                                "attempt": "int",
                                "created_at": "datetime",
                                "updated_at": "datetime"
                            }
    }
}

module.exports = Email