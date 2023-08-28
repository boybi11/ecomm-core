module.exports = function(apiRoutes, { OrderController }, { AuthMiddleware, OrderMiddleware }) {

    apiRoutes.get('/backoffice/orders', AuthMiddleware.auth, OrderController.get);
    apiRoutes.post('/backoffice/orders', AuthMiddleware.auth, OrderMiddleware.processDirectOrder, OrderController.store);
    apiRoutes.get('/backoffice/orders/:id', AuthMiddleware.auth, OrderController.edit);
    apiRoutes.patch('/backoffice/orders/:id', AuthMiddleware.auth, OrderController.update);
    apiRoutes.delete('/backoffice/orders', AuthMiddleware.auth, OrderController.delete);
    apiRoutes.get('/backoffice/orders/logs', AuthMiddleware.auth, OrderController.getLogs);

    return apiRoutes;
};