
module.exports = function(apiRoutes, { DashboardController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/dashboard/sales', AuthMiddleware.auth, DashboardController.getSales);
    apiRoutes.get('/backoffice/dashboard/feed/new-orders', AuthMiddleware.auth, DashboardController.getNewOrders);
    apiRoutes.get('/backoffice/dashboard/feed/tbd', AuthMiddleware.auth, DashboardController.getTBDOrders);
    apiRoutes.get('/backoffice/dashboard/feed/overdue', AuthMiddleware.auth, DashboardController.getOverdueOrders);
    apiRoutes.get('/backoffice/dashboard/feed/inactive', AuthMiddleware.auth, DashboardController.getInactiveCarts);
    apiRoutes.get('/backoffice/dashboard/rankings/unit-sold', AuthMiddleware.auth, DashboardController.getUnitSoldRankings);
    apiRoutes.get('/backoffice/dashboard/rankings/unit-sales', AuthMiddleware.auth, DashboardController.getUnitSalesRankings);
    apiRoutes.get('/backoffice/dashboard/rankings/unit-rating', AuthMiddleware.auth, DashboardController.getUnitRatingRankings);
    apiRoutes.get('/backoffice/dashboard/top-spenders', AuthMiddleware.auth, DashboardController.getTopSpenders);
    apiRoutes.get('/backoffice/dashboard/customers', AuthMiddleware.auth, DashboardController.getCustomers);
    apiRoutes.get('/backoffice/dashboard/by-location', AuthMiddleware.auth, DashboardController.getSalesByLocation);

    return apiRoutes;
};