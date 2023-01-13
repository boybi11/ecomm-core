const UploadHelper      = require('../../helpers/UploadHelper')
const backofficeAPIs    = require('./apis')

module.exports = function(apiRoutes) {
    'use strict';

    const controllers = require('../../controllers/backoffice')
    const middlewares = require('../../middlewares');

    backofficeAPIs.forEach(api => api(apiRoutes, controllers, middlewares, { UploadHelper }))
    
    // TEST
    // apiRoutes.get('/backoffice/test', OrderItemController.fixParentField);

    return apiRoutes
}