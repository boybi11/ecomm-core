module.exports = function(apiRoutes, { CashInController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/cash-ins', AuthMiddleware.auth, CashInController.get);
    apiRoutes.patch('/backoffice/cash-ins/:id', AuthMiddleware.auth, CashInController.update);

    return apiRoutes;
};