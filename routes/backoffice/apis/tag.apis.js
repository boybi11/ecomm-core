module.exports = function(apiRoutes, { TagController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/tags', AuthMiddleware.auth, TagController.get);

    return apiRoutes;
};