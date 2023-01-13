const Notification  = require('../models/Notification')
const AdminRole     = require('../models/AdminRole')
const User          = require('../models/User')

class NotificationHelper {

    sendOrderNotif = async (orderRef) => {
        if (orderRef) {
            const roles         = await new AdminRole().get()
            let validRoleIds    = []
            
            roles.forEach(role => {
                const modules = role.modules ? JSON.parse(role.modules) : {}
                if (modules.order) validRoleIds.push(role.id)
            })

            const admins = await new User()
                                    .whereIn({ role: validRoleIds })
                                    .whereRaw("(role is NULL)", "OR")
                                    .pluck(["id"])

            new Notification().sendToAll(admins, `New incoming order ref# ${ orderRef }`)
        }
    }
}

module.exports = new NotificationHelper