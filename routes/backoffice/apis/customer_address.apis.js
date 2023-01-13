
module.exports = function(apiRoutes, { CustomerAddressController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/customer-address/:userId', AuthMiddleware.auth, CustomerAddressController.get);
    apiRoutes.post('/backoffice/customer-address', AuthMiddleware.auth, CustomerAddressController.store);
    apiRoutes.patch('/backoffice/customer-address/:id', AuthMiddleware.auth, CustomerAddressController.update);
    apiRoutes.delete('/backoffice/customer-address', AuthMiddleware.auth, CustomerAddressController.delete);

    return apiRoutes;
};