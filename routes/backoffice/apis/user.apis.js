module.exports = function(apiRoutes, { UserController }, { AuthMiddleware, UserMiddleware, PayloadMiddleware }) {

    apiRoutes.post('/backoffice/user/auth', (req, res, next) => PayloadMiddleware.decrypt(req, res, next, "creds"), UserController.auth)
    // apiRoutes.post('/backoffice/user/password/reset', UserController.resetPassword)
    apiRoutes.get('/backoffice/:type/users', AuthMiddleware.auth, UserController.get)
    apiRoutes.post('/backoffice/:type/users', AuthMiddleware.auth, UserMiddleware.store, UserController.store)
    apiRoutes.get('/backoffice/:type/users/:id', AuthMiddleware.auth, UserController.edit)
    apiRoutes.patch('/backoffice/:type/users/:id', AuthMiddleware.auth, UserMiddleware.store, UserController.update)
    apiRoutes.patch('/backoffice/set-primary-address/:addressId', AuthMiddleware.auth, UserController.setPrimaryAddress)
    apiRoutes.delete('/backoffice/:type/users', AuthMiddleware.auth, UserController.delete)

    return apiRoutes
}