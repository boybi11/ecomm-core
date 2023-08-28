module.exports = function(apiRoutes, { OrderController, OrderRefundRequestController }, { AuthMiddleware, CartMiddleware, StoreGateMiddleware, OrderMiddleware }) {

    apiRoutes.get('/orders', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, OrderController.get)
    apiRoutes.get('/find-order/:ref', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, OrderController.find)
    apiRoutes.post('/place-order/:ref', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CartMiddleware.retrieveCartCheckout, OrderMiddleware.processOrder, OrderController.placeOrder)
    apiRoutes.patch('/orders/cancel/:ref', StoreGateMiddleware.auth, OrderController.cancelOrder)
    apiRoutes.patch('/orders/receive/:ref', StoreGateMiddleware.auth, OrderController.receiveOrder)
    // apiRoutes.post('/orders/refund/request', StoreGateMiddleware.auth, OrderRefundRequestController.store)
    apiRoutes.get('/order-history/unseen', AuthMiddleware.auth, OrderController.getAllUnseenHistory)
    apiRoutes.patch('/order-history/set-seen', AuthMiddleware.auth, OrderController.setSeenHistory)
    
    return apiRoutes
}