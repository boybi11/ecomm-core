
module.exports = function(apiRoutes, { InventoryController, ProductInventoryController }, { AuthMiddleware }) {

    // product specific inventory
    apiRoutes.get('/backoffice/inventories/:productId?', AuthMiddleware.auth, ProductInventoryController.get)
    apiRoutes.get('/backoffice/inventory-histories', AuthMiddleware.auth, ProductInventoryController.history)
    apiRoutes.post('/backoffice/inventories/:productId', AuthMiddleware.auth, ProductInventoryController.store)
    apiRoutes.patch('/backoffice/inventories/:id', AuthMiddleware.auth, ProductInventoryController.update)
    apiRoutes.delete('/backoffice/inventories', AuthMiddleware.auth, ProductInventoryController.delete)

    // location specific inventory
    apiRoutes.get('/backoffice/inventory-locations', AuthMiddleware.auth, InventoryController.get)
    apiRoutes.post('/backoffice/inventory-locations', AuthMiddleware.auth, InventoryController.store)
    apiRoutes.get('/backoffice/inventory-locations/:id', AuthMiddleware.auth, InventoryController.edit)
    apiRoutes.patch('/backoffice/inventory-locations/:id', AuthMiddleware.auth, InventoryController.update)

    return apiRoutes;
};