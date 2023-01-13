
// helper
const backofficeRoutes = require('./backoffice');
const siteRoutes = require('./site_api.routes');

module.exports = (function() {
    'use strict';
    const bodyParser = require('body-parser');
    const apiRoutes = require('express').Router();
    const cors = require('cors');

    apiRoutes.use(cors());
    apiRoutes.use(bodyParser.urlencoded({extended: true}));
    apiRoutes.use(bodyParser.json());
    
    backofficeRoutes(apiRoutes);
    siteRoutes(apiRoutes);

    return apiRoutes;
})();