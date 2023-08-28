const UploadHelper      = require('../../helpers/UploadHelper')
const siteAPIs    = require('./apis')

module.exports = function(apiRoutes) {
    'use strict';

    const controllers = require('../../controllers/site')
    const middlewares = require('../../middlewares');

    siteAPIs.forEach(api => api(apiRoutes, controllers, middlewares, { UploadHelper }))

    return apiRoutes
}