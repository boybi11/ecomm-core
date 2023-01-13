const moment    = require('moment')
const EncHelper = require('../helpers/EncHelper')
const config    = require('../config')
class AuthMiddleware {

    auth = async (req, res, next) => {
        const token = req.get('Authorization') || req.get('authorization')

        if (!token) {
            res.status(403).send({ message: 'Unauthorized entity.' })
            res.end()
        } else {
            const User      = require('../models/User')
            const referer   = req.get("referer")
            const origin    = req.get("origin")
            const userAgent = req.get("user-agent")
            const result    = EncHelper.decrypt(token.replace("Bearer", "").trim())

            if (result) {
                const timeStamp = moment().format()
                if ( result.last_activity && result.cms ) {
                    if (result.role !== undefined && this.#checkSessionHealth(result.last_activity)) {
                        res.status(401).send({ message: "Your session expired due to inactivity." })
                        return res.end()
                    }
                    else if ((referer || origin) === config.URL.site && userAgent && (userAgent !== result.userAgent)) {
                        res.status(403).send({ message: 'Unauthorized entity.' })
                        return res.end()
                    }
                    
                }
                
                const updated   = await new User().where({ id: { value: result.id } }).update({ last_activity: timeStamp })
                req.authUser    = updated && updated.data
                res.xrtoken     = EncHelper.encrypt({
                                    id: req.authUser.id,
                                    cms: req.authUser.cms,
                                    last_activity: timeStamp,
                                    ip: req.ip,
                                    userAgent
                                })
                next()
            }
            else {
                res.status(403).send({ message: 'Unauthorized entity.' })
                res.end()
            }
        }
    }

    #checkSessionHealth = (last_activity) => {
        const inactivityLimit       = 30
        const timeStamp             = moment()
        const inactivityDuration    = Math.abs(moment(last_activity).diff(timeStamp, 'minutes'))
        
        return inactivityLimit <= inactivityDuration
    }
}

module.exports = new AuthMiddleware