
module.exports = function(apiRoutes, { ActivityController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/activities', AuthMiddleware.auth, ActivityController.get);

    return apiRoutes;
};