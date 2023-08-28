
module.exports = function(apiRoutes, { PaymentOptionController }) {

    apiRoutes.get('/payment-options', PaymentOptionController.get)

    return apiRoutes;
};