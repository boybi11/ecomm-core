module.exports = function(apiRoutes, { SettingController, PolicyController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/settings/:group?', SettingController.get)
    apiRoutes.patch('/backoffice/settings', AuthMiddleware.auth, SettingController.update)

    apiRoutes.get('/backoffice/policies', AuthMiddleware.auth, PolicyController.get)
    apiRoutes.post('/backoffice/policies', AuthMiddleware.auth, PolicyController.store)
    apiRoutes.get('/backoffice/policies/:id', AuthMiddleware.auth, PolicyController.edit)
    apiRoutes.patch('/backoffice/policies/:id', AuthMiddleware.auth, PolicyController.update)
    apiRoutes.delete('/backoffice/policies', AuthMiddleware.auth, PolicyController.delete)

    return apiRoutes
}