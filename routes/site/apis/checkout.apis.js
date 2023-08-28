
module.exports = function(apiRoutes, { CartController, OrderItemController }, { CartMiddleware, StoreGateMiddleware }) {

    apiRoutes.patch('/checkout/initiate/:ref', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CartMiddleware.retrieveCart, CartController.initiateCheckout)
    apiRoutes.get('/checkout/items', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, OrderItemController.findCheckoutItems)
    
    return apiRoutes
}