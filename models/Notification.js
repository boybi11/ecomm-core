const moment                = require("moment")
const Base                  = require('../core/BaseModelV2')
const SocketHelper          = require('../helpers/SocketHelper')

class Notification extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "notifications"
        this.fillables  = {
                            "ref_target": "string",
                            "message": "string",
                            "hyperlink": "string",
                            "created_at": "datetime",
                            "seen_at": "datetime",
                            "read_at": "datetime"
                        }

    }

    send = async (data) => {
        const result = await this.create(data)
        if (result && !result.error) this.emitNotification(data.ref_target)
        
        return result
    }

    sendToAll = async (userIds = [], message = "") => {
        const createData    = userIds.map(id => ({ user_id: id, message, seen: 0 }))
        const result        = await this.create(createData)

        if (result && !result.error) this.emitNotification(userIds)
        
        return result
    }

    seen = async (userId) => {
        const result = await this
                                .where({
                                    ref_target: { value: userId },
                                    seen_at: { value: null }
                                })
                                .update({ seen_at: moment().format() })

        if (result && !result.error) this.emitNotification(userId)
        
        return result
    }

    read = async (notifId) => {
        const result = await this
                                .where({ id: { value: notifId } })
                                .update({ read_at: moment().format() })
                                
        return result
    }

    emitNotification = (target) => {
        const socket = new SocketHelper().connect()
        socket.emit("alert-notification", target)
        socket.emit("forceDC")
    }
}

module.exports = Notification