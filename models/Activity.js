const Base = require('../core/BaseModelV2')
class Activity extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "activities"
        this.fillables  = {
                            "user_id": "int",
                            "model": "string",
                            "ref_id": "int",
                            "type": "string",
                            "encoded_data": "text",
                            "encoded_prev_data": "text",
                            "created_at": "datetime",   
                            "message": "string"
                        }
    }

    user = () => this.hasOne('User', 'id', 'user_id')
}

module.exports = Activity