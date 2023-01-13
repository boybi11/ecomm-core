
module.exports = function(apiRoutes, { BankController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/banks', AuthMiddleware.auth, BankController.get);
    apiRoutes.post('/backoffice/banks', AuthMiddleware.auth, BankController.store);
    apiRoutes.patch('/backoffice/banks/:id', AuthMiddleware.auth, BankController.update);
    apiRoutes.delete('/backoffice/banks', AuthMiddleware.auth, BankController.delete);

    return apiRoutes;
};