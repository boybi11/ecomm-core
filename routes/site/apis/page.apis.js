
module.exports = function(apiRoutes, { PageController }, { StoreGateMiddleware }) {
    apiRoutes.get('/page/:slug', StoreGateMiddleware.auth, PageController.find)
    
    return apiRoutes
}