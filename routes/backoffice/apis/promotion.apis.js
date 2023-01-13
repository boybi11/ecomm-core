module.exports = function(apiRoutes, { PromotionController }, { AuthMiddleware, PromotionMiddleware }) {

    apiRoutes.get('/backoffice/promotions', AuthMiddleware.auth, PromotionController.get);
    apiRoutes.post('/backoffice/promotions', AuthMiddleware.auth, PromotionMiddleware.prepareProducts, PromotionController.store);
    apiRoutes.get('/backoffice/promotions/:id', AuthMiddleware.auth, PromotionController.edit);
    apiRoutes.patch('/backoffice/promotions/:id', AuthMiddleware.auth, PromotionMiddleware.prepareProducts, PromotionController.update);
    apiRoutes.delete('/backoffice/promotions', AuthMiddleware.auth, PromotionMiddleware.removeProducts, PromotionController.delete);
    apiRoutes.get('/backoffice/promotions/products', AuthMiddleware.auth, PromotionMiddleware.getScheduledProducts);

    return apiRoutes;
};