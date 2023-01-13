module.exports = function(apiRoutes, { ShippingFeeController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/shipping_fees', AuthMiddleware.auth, ShippingFeeController.get);
    apiRoutes.post('/backoffice/shipping_fees', AuthMiddleware.auth, ShippingFeeController.store);
    apiRoutes.get('/backoffice/shipping_fees/:id', AuthMiddleware.auth, ShippingFeeController.edit);
    apiRoutes.patch('/backoffice/shipping_fees/:id', AuthMiddleware.auth, ShippingFeeController.update);
    apiRoutes.delete('/backoffice/shipping_fees', AuthMiddleware.auth, ShippingFeeController.delete);
    apiRoutes.get('/backoffice/shipping_fees/excluded-zones', AuthMiddleware.auth, ShippingFeeController.getExcludedZones);
    apiRoutes.get('/backoffice/shipping_zones/get-shipping-fees', AuthMiddleware.auth, ShippingFeeController.getShippingZoneFee);
    apiRoutes.get('/backoffice/shipping-zones/available-zones/:shipping_id?', AuthMiddleware.auth, ShippingFeeController.getAvailableShippingZones);

    return apiRoutes;
};