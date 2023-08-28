
// helper
const backofficeRoutes = require('./backoffice')
const siteRoutesV2 = require('./site')
const siteRoutes = require('./site_api.routes')

module.exports = (function() {
    'use strict'
    const bodyParser    = require('body-parser')
    const apiRoutes     = require('express').Router()
    const cors          = require('cors')

    apiRoutes.use(cors())
    apiRoutes.use(bodyParser.urlencoded({extended: true}))
    apiRoutes.use(bodyParser.json())
    
    backofficeRoutes(apiRoutes)
    siteRoutesV2(apiRoutes)
    siteRoutes(apiRoutes)

    return apiRoutes
})()