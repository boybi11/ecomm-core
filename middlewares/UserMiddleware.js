const User = require('../models/User')

class UserMiddleware {

    store = async (req, response, next) => {
        const id = req.params && req.params.id ? req.params.id : 0

        const duplicate = await new User()
                                        .whereRaw(`(username='${req.body.username}' OR email='${req.body.email}') AND id!=${ id }`)
                                        .first()

        if (duplicate) {
            if (duplicate.error) response.status(400).send(err)
            else {
                const errors = {
                    username: duplicate.username === req.body.username ? "Username is already existing" : '',
                    email: duplicate.email === req.body.email ? "Email is already registered" : ''
                }

                response.status(400).send({errors, code: 409 })
            }

            response.end()
        }
        else next()
    }
}

module.exports = new UserMiddleware