
module.exports = function(apiRoutes, { PaymentOptionController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/payment-options', AuthMiddleware.auth, PaymentOptionController.get);
    apiRoutes.post('/backoffice/payment-options', AuthMiddleware.auth, PaymentOptionController.store);
    apiRoutes.get('/backoffice/payment-options/:id', AuthMiddleware.auth, PaymentOptionController.edit);
    apiRoutes.patch('/backoffice/payment-options/:id', AuthMiddleware.auth, PaymentOptionController.update);
    apiRoutes.delete('/backoffice/payment-options', AuthMiddleware.auth, PaymentOptionController.delete);

    return apiRoutes;
};