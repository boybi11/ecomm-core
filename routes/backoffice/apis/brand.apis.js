
module.exports = function(apiRoutes, { BrandController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/brands', AuthMiddleware.auth, BrandController.get);
    apiRoutes.post('/backoffice/brands', AuthMiddleware.auth, BrandController.store);
    apiRoutes.get('/backoffice/brands/:id', AuthMiddleware.auth, BrandController.edit);
    apiRoutes.patch('/backoffice/brands/:id', AuthMiddleware.auth, BrandController.update);
    apiRoutes.delete('/backoffice/brands', AuthMiddleware.auth, BrandController.delete);

    return apiRoutes;
};