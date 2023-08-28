module.exports = function(apiRoutes, { ProductController }, { AuthMiddleware, ProductMiddleware, UploadMiddleware }) {

    apiRoutes.get('/backoffice/products', AuthMiddleware.auth, ProductController.get)
    apiRoutes.post('/backoffice/products', AuthMiddleware.auth, ProductMiddleware.store, ProductMiddleware.processBody, ProductController.store)
    apiRoutes.get('/backoffice/products/:id', AuthMiddleware.auth, ProductController.edit)
    apiRoutes.get('/backoffice/products/sku/:sku', AuthMiddleware.auth, ProductController.findBySKU)
    apiRoutes.patch('/backoffice/products/:id', AuthMiddleware.auth, ProductMiddleware.store, ProductMiddleware.processBody, ProductController.update)
    apiRoutes.delete('/backoffice/products', AuthMiddleware.auth, ProductController.delete)
    apiRoutes.post('/backoffice/import/products', AuthMiddleware.auth, UploadMiddleware.uploadInTemp().single("file"), ProductController.import)
    apiRoutes.get('/backoffice/oos/products', AuthMiddleware.auth, ProductController.getOOSCount)

    return apiRoutes
}