
module.exports = function(apiRoutes, { InquiryController }, { StoreGateMiddleware }) {

    apiRoutes.post('/inquiry', StoreGateMiddleware.validateClientToken, InquiryController.store)

    return apiRoutes
}