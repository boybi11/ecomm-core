const policyApis        = require('./policy.apis')
const paymentOptionApis = require('./payment_option.apis')
const cartApis          = require('./cart.apis')
const checkoutApis      = require('./checkout.apis')
const orderApis         = require('./order.apis')
const inquiryApis       = require('./inquiry.apis')
const pageApis          = require('./page.apis')

module.exports = [
    policyApis,
    paymentOptionApis,
    cartApis,
    checkoutApis,
    orderApis,
    inquiryApis,
    pageApis
]