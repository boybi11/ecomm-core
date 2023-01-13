const crypto = require('crypto-js')
class PayloadMiddleware {
    
    decrypt = (req, res, next, field = "") => {
        let data = {}

        if (field && req.body[field]) {
            const unSuffixed = req.body[field].slice(0, req.body[field].length - 3)
            try { data = JSON.parse(crypto.enc.Hex.parse(unSuffixed).toString(crypto.enc.Utf8)) }
            catch(err) {
                return res.send(400, { message: "Your data is unreadable." })
            }
        }

        req.body[field] = data
        next()
    }
}

module.exports = new PayloadMiddleware