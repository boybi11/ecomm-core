module.exports = function(apiRoutes, { OrderItemController }, { AuthMiddleware }) {

    apiRoutes.post('/backoffice/order-items', AuthMiddleware.auth, OrderItemController.store)
    apiRoutes.patch('/backoffice/order-items/:id', AuthMiddleware.auth, OrderItemController.update)
    apiRoutes.delete('/backoffice/order-items', AuthMiddleware.auth, OrderItemController.delete)
    apiRoutes.post('/backoffice/order-items/cancel/:orderId', AuthMiddleware.auth, OrderItemController.saveCancelledItems, OrderItemController.updateCancelledItems)
    apiRoutes.get('/backoffice/item/metrics/:productId', AuthMiddleware.auth, OrderItemController.getProductMetrics)
    apiRoutes.post('/backoffice/item/fulfill/:id', AuthMiddleware.auth, OrderItemController.fulfillItem)
    
    return apiRoutes
}