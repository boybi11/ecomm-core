
module.exports = function(apiRoutes, { CartController, OrderItemController }, { CartMiddleware, StoreGateMiddleware }) {

    apiRoutes.post('/cart', StoreGateMiddleware.validateClientToken,StoreGateMiddleware.auth, CartController.store)
    apiRoutes.get('/cart/:ref?', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CartController.get)
    apiRoutes.post('/cart/save-address/:token/:ref', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CartMiddleware.retrieveCart, CartController.saveCartAddress)
    apiRoutes.post('/update-fees/:order_id', StoreGateMiddleware.auth, CartController.updateCartFees)
    apiRoutes.post('/add-to-cart', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, OrderItemController.store);
    apiRoutes.patch('/add-to-cart', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, OrderItemController.update);
    apiRoutes.patch('/cart-item/:id', StoreGateMiddleware.validateClientToken, OrderItemController.updateItemQty);
    apiRoutes.delete('/remove-item-cart/:id', StoreGateMiddleware.auth, OrderItemController.delete);

    apiRoutes.get('/cart/items/:ref?', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, OrderItemController.get)

    return apiRoutes
}