const Order = require('../models/Order')

class CartMiddleware {

    retrieveCart = async (req, res, next) => {
        if (req.params.ref || req.params.token || req.authUser) {
            const whereQuery = { status: { value: "cart" } }
            
            if (req.authUser) whereQuery.user_id = { value: req.authUser.id }
            if (req.params.ref && req.params.ref !== 'undefined') whereQuery.reference_number = { value: req.params.ref }
            if (req.params.token && req.params.token !== 'undefined') whereQuery.token = { value: req.params.token }

            const result = await new Order().where(whereQuery).first()
            if (!result) return res.status(403).send({ message: 'Access forbidden!' })
            else req.body.authCart = result

            next()
        }
        else return res.status(403).send({ message: 'Access forbidden!' })
    }
}

module.exports = new CartMiddleware