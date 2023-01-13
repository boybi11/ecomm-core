module.exports = function(apiRoutes, { CouponController }, { AuthMiddleware, CouponMiddleware }) {

    apiRoutes.get('/backoffice/coupons', AuthMiddleware.auth, CouponController.get);
    apiRoutes.post('/backoffice/coupons', AuthMiddleware.auth, CouponMiddleware.store, CouponMiddleware.prepareProducts, CouponController.store);
    apiRoutes.get('/backoffice/coupons/:id', AuthMiddleware.auth, CouponController.edit);
    apiRoutes.patch('/backoffice/coupons/:id', AuthMiddleware.auth, CouponMiddleware.prepareProducts, CouponController.update);
    apiRoutes.delete('/backoffice/coupons', AuthMiddleware.auth, CouponMiddleware.removeProducts, CouponController.delete);

    return apiRoutes;
};