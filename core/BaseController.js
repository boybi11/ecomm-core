const moment    = require('moment')
const LogHelper = require('../helpers/LogHelper')
const EncHelper = require('../helpers/EncHelper')
class BaseController {
    dates = [
        "published",
        "publish_date",
        "end_date",
        "start_date"
    ]

    response = async (result, response, send = true) => {
        if (result) {
            if (result.error) this.sendError(`${ result.error.table ? result.error.table + ':' : '' }${ result.error.message }`, response)
            else {
                await this.log(result)
                if (response?.xrtoken) {
                    result.xrtoken = EncHelper.encrypt({ token: response.xrtoken })
                }
                if (send) response.send(result)
            }
        }
        else response.status(204).send()

        if (send || !result) response.end() 
    }

    sendError = (message, response, additionalData = {}) => {
        message = message ? message : "Server could not process the request at the moment."
        if (response.xrtoken) additionalData.xrtoken = response.xrtoken
        response.status(400).send({ message, ...additionalData })
        return response.end() 
    }
    
    log = async (result) => {
        if (result && result.loggable) await LogHelper.logActivity(result.loggable)
        delete result.loggable
    }

    sort = (model, sort) => {
        if (sort && Array.isArray(sort) && sort.length === 2) return model.orderBy(sort[0], sort[1])
        return model.orderBy("id", "DESC")
    }

    filter = (model, { filters, filterConfigurations }, customFilters = {} ) => {
        if (filters) {
            const filterObj     = typeof filters === "string" ? JSON.parse(filters) : filters
            const configs       = filterConfigurations ? JSON.parse(filterConfigurations) : {}
            const filterKeys    = Object.keys(filterObj)

            filterKeys.forEach(filterKey => {
                if (filterKey === "search") model.search(filterObj[filterKey])
                else if (filterKey === "exclude") model.exclude(filterObj[filterKey])
                else if (!this.dates.includes(filterKey)) {
                    if (customFilters[filterKey]) customFilters[filterKey](filterObj[filterKey], model)
                    else {
                        let fieldName = filterKey
                        const config  = configs[filterKey] || { operation: " LIKE " }
                        const value   = filterObj[filterKey] + (!configs[filterKey] || config.operation === " LIKE " ? `%` : '')

                        if (config.name) {
                            fieldName = config.name
                            delete config.name
                        }

                        model.where({ [fieldName]: { value, ...config } })
                    }
                }
                else {
                    if (filterKey === "published" || filterKey === "publish_date") {
                        if (filters[filterKey] === "true") model = model.whereRaw(`publish_date <= '${moment().format('YYYY-MM-DD HH:mm:ss')}'`) 
                        else {
                            const withEnd = filterKeys.includes("end_date")
                            model = model.whereRaw(`publish_date ${ withEnd ? '>' : '' }= '${moment(filterObj[filterKey]).format('YYYY-MM-DD 00:00:00')}'`)
                        }
                    }
                    else if (filterKey === "start_date") {
                        const withEnd = filterKeys.includes("end_date")
                        model = model.whereRaw(`start_date ${ withEnd ? '>' : '' }= '${moment(filterObj[filterKey]).format('YYYY-MM-DD 00:00:00')}'`)
                    }
                    else if (filterKey === "end_date") {
                        const withStart = filterKeys.includes("published") || filterKeys.includes("publish_date") || filterKeys.includes("start_date")
                        model = model.whereRaw(`end_date ${ withStart ? '<' : '' }= '${moment(filterObj[filterKey]).format('YYYY-MM-DD 23:59:59')}'`)
                    }
                }
            })
        } 

        return model
    }

    deleteAll = async (req, response, model, log = false, beforeDelete) => {
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) {

            model.withTables.forEach(async relation => {
                try {
                    const realationTableModel = require(`../models/${ relation.model }`)
                    await new realationTableModel().whereIn({ [relation.fKey]: ids }).delete([])
                }
                catch (err) { }
            })

            if (log) model = model.log({}, req.authUser.id)
            if (typeof beforeDelete === "function") await beforeDelete(ids)
            const deleted = await model.delete(ids)

            this.response(deleted, response)
        }
        else this.sendError("Missing request paramater", response)
    }
}

module.exports = BaseController