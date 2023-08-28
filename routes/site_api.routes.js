// helpers
const UploadHelper = require('../helpers/UploadHelper');

module.exports = function(apiRoutes) {
    'use strict';
    
    //CONTROLLERS
    const {
        ProductController,
        CategoryController,
        SettingController,
        PromotionController,
        BrandController,
        ProductRatingController,
        UserController,
        OrderItemController,
        CustomerAddressController,
        WishlistController,
        PageController,
        ProductViewController
    } = require('../controllers/site');
    const {
        LocationController,
        ShippingFeeController,
        AssetController,
        InquiryController
    } = require('../controllers/backoffice');

    //MIDDLEWARES
    const {
        AuthMiddleware,
        StoreGateMiddleware,
        UserMiddleware,
        // UploadMiddleware,
        // AssetMiddleware,
        OrderMiddleware,
        CartMiddleware
    } = require('../middlewares');

    //USER ROUTES
    apiRoutes.post('/user/auth', StoreGateMiddleware.validateClientToken, UserController.auth);
    apiRoutes.post('/user/validate', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, UserController.validate);
    // apiRoutes.post('/user/password/reset', UserController.resetPassword);
    apiRoutes.patch('/user/password/update', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, UserController.changePassword);
    apiRoutes.post('/users', UserMiddleware.store, UserController.store);
    apiRoutes.get('/users/find', AuthMiddleware.auth, UserController.find);
    apiRoutes.patch('/user', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, UserController.update);
    apiRoutes.post('/user/verify', UserController.verifyAccount);
    apiRoutes.get('/users/order-count', AuthMiddleware.auth, UserController.getOrderStatusCount);
    apiRoutes.post('/users/logout', AuthMiddleware.auth, UserController.logout);
    apiRoutes.get('/users/ranked-items', AuthMiddleware.auth, UserController.getRankedItems);

    //CUSTOMER ADDRESS ROUTES
    apiRoutes.get('/customer-address', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CustomerAddressController.get);
    apiRoutes.get('/customer-address/find/:id', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CustomerAddressController.edit);
    apiRoutes.post('/customer-address', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CustomerAddressController.store);
    apiRoutes.post('/customer-address/set-as-default/:id',StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CustomerAddressController.setAsDefault)
    apiRoutes.put('/customer-address/:id', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CustomerAddressController.update);
    apiRoutes.delete('/customer-address/:id', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, CustomerAddressController.delete);

    //PRODUCT ROUTES
    apiRoutes.get('/products', StoreGateMiddleware.validateClientToken, ProductController.get);
    apiRoutes.get('/best-sellers', StoreGateMiddleware.validateClientToken, ProductController.bestSellers);
    apiRoutes.get('/related-products/:slug', StoreGateMiddleware.validateClientToken, ProductController.relatedProducts);
    apiRoutes.get('/products/:slug', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, ProductController.find);

    //PRODUCT RATING
    apiRoutes.get('/product-ratings/:slug?', ProductRatingController.get);
    apiRoutes.post('/product-ratings', ProductRatingController.store);
    apiRoutes.get('/product-rating-stats/:product', ProductRatingController.getRatingStats);

    //WISHLIST
    apiRoutes.get('/wishlists', AuthMiddleware.auth, WishlistController.get);
    apiRoutes.post('/wishlists', AuthMiddleware.auth, WishlistController.store);
    apiRoutes.delete('/wishlists', AuthMiddleware.auth, WishlistController.delete);
    apiRoutes.get('/wishlists/:product_id', AuthMiddleware.auth, WishlistController.find);

    //LOCATION ROUTES
    apiRoutes.get('/provinces', StoreGateMiddleware.validateClientToken, LocationController.provinces);
    apiRoutes.get('/cities', LocationController.cities);
    apiRoutes.get('/areas', LocationController.areas);

    //CATEGORY ROUTES
    apiRoutes.get('/categories', StoreGateMiddleware.validateClientToken, CategoryController.get);
    apiRoutes.get('/categories/:slug', StoreGateMiddleware.validateClientToken, CategoryController.find);

    //BRANDS ROUTES
    apiRoutes.get('/brands', BrandController.get);

    //PROMO ROUTES
    apiRoutes.get('/promos', PromotionController.get);

    //SHIPPING FEE
    apiRoutes.get('/shipping-zones/get-shipping-fees', StoreGateMiddleware.validateClientToken, ShippingFeeController.getShippingZoneFee);

    //SETTINGS ROUTES
    apiRoutes.get('/settings', StoreGateMiddleware.validateClientToken, SettingController.get);

    //ASSETS
    apiRoutes.post('/assets/upload-temp', UploadHelper.initUpload().array('files'), AssetController.uploadTemp);

    //REDACTOR
    apiRoutes.post('/assets/redactor', UploadHelper.initUpload().single('image'), AssetController.uploadRedactor);

    //INQUIRY
    apiRoutes.post('/inquiry', InquiryController.store);

    //PRODUCT VIEWS
    apiRoutes.get('/product-viewed', StoreGateMiddleware.validateClientToken, StoreGateMiddleware.auth, ProductViewController.get)

    return apiRoutes;
};