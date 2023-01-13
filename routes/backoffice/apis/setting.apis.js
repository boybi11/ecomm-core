module.exports = function(apiRoutes, { SettingController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/settings/:group?', SettingController.get)
    apiRoutes.patch('/backoffice/settings', AuthMiddleware.auth, SettingController.update)

    return apiRoutes
}