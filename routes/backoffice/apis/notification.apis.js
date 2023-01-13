
module.exports = function(apiRoutes, { NotificationController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/notifications', AuthMiddleware.auth, NotificationController.get)
    apiRoutes.patch('/backoffice/notifications/seen', AuthMiddleware.auth, NotificationController.seen)
    apiRoutes.patch('/backoffice/notifications/read', AuthMiddleware.auth, NotificationController.read)

    return apiRoutes;
};