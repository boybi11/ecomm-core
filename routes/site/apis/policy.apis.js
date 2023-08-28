
module.exports = function(apiRoutes, { PolicyController }) {

    apiRoutes.get('/policies', PolicyController.get)
    apiRoutes.get('/policies/:slug', PolicyController.find)

    return apiRoutes;
};