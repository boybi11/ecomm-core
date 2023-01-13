module.exports = function(apiRoutes, { CategoryController }, { AuthMiddleware, CategoryMiddleware }) {

    apiRoutes.get('/backoffice/categories', AuthMiddleware.auth, CategoryMiddleware.generateFilters, CategoryController.get);
    apiRoutes.post('/backoffice/categories', AuthMiddleware.auth, CategoryMiddleware.store, CategoryController.store);
    apiRoutes.get('/backoffice/categories/:id', AuthMiddleware.auth, CategoryController.edit);
    apiRoutes.patch('/backoffice/categories/:id', AuthMiddleware.auth, CategoryMiddleware.store, CategoryController.update);
    apiRoutes.delete('/backoffice/categories', AuthMiddleware.auth, CategoryController.delete);

    return apiRoutes;
};