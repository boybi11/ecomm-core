const config    = require('../config')
const EncHelper = require('../helpers/EncHelper')
const User = require('../models/User')
class StoreGateMiddleWare {

    auth = async (req, res, next) => {
        const token = req.get('Authorization') || req.get('authorization')

        if (token) {
            const referer   = req.get("referer")
            const origin    = req.get("origin")
            const userAgent = req.get("user-agent")
            const result    = EncHelper.decrypt(token.replace("Bearer", "").trim())

            if (result) {
                if ( result.last_activity && result.cms ) {
                    if (result.role !== undefined && this.#checkSessionHealth(result.last_activity)) {
                        res.status(401).send({ message: "Your session expired due to inactivity.", exp: 1 })
                        return res.end()
                    }
                    else if ((referer || origin) === config.URL.front && userAgent && (userAgent !== result.userAgent)) {
                        res.status(403).send({ message: 'Unauthorized entity.' })
                        return res.end()
                    }
                }

                const user = await new User().find(result.id)
                if (user) req.authUser = user
                else return res.status(403).send({ message: 'Unauthorized entity.' })
            }
        }

        next()
    }

    validateClientToken = async (req, res, next) => {
        const clientToken = req.get("x-client-token")
        const authorized  = clientToken && clientToken === config.ClientToken
        
        if (authorized) next()
        else res.status(403).send({ message: 'Access forbidden!' })
    }

    #checkSessionHealth = (last_activity) => {
        const inactivityLimit       = 30
        const timeStamp             = moment()
        const inactivityDuration    = Math.abs(moment(last_activity).diff(timeStamp, 'days'))
        
        return inactivityLimit <= inactivityDuration
    }
}

module.exports = new StoreGateMiddleWare