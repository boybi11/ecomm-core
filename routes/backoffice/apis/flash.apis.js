module.exports = function(apiRoutes, { FlashSaleController }, { AuthMiddleware, PromotionMiddleware }) {

    apiRoutes.get('/backoffice/flashsales', AuthMiddleware.auth, FlashSaleController.get)
    apiRoutes.post('/backoffice/flashsales', AuthMiddleware.auth, PromotionMiddleware.prepareProducts, FlashSaleController.store)
    apiRoutes.patch('/backoffice/flashsales/:id', AuthMiddleware.auth, PromotionMiddleware.prepareProducts, FlashSaleController.update)
    apiRoutes.delete('/backoffice/flashsales', AuthMiddleware.auth, PromotionMiddleware.removeProducts, FlashSaleController.delete)
    apiRoutes.get('/backoffice/flashsales/products', AuthMiddleware.auth, PromotionMiddleware.getScheduledProducts)
    apiRoutes.get('/backoffice/flashsales/conflicts', AuthMiddleware.auth, FlashSaleController.getConfiltedSchedule)
    apiRoutes.get('/backoffice/flashsales/:id', AuthMiddleware.auth, FlashSaleController.edit)

    return apiRoutes;
};