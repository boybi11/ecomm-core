module.exports = function(apiRoutes, { LocationController }) {

    apiRoutes.get('/backoffice/provinces', LocationController.provinces);
    apiRoutes.get('/backoffice/cities', LocationController.cities);
    apiRoutes.get('/backoffice/areas', LocationController.areas);

    return apiRoutes;
};