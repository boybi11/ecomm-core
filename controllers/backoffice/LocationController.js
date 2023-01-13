const BaseController = require('../../core/BaseController')
class LocationController extends BaseController {

    provinces = async (req, response) => {
        let Province = require('../../models/Province')
        const {query} = req
        let provinces = new Province()
        let result

        if (query.excluded) provinces = provinces.exclude(JSON.parse(query.excluded))
        
        if (!query.paginated) result = await provinces.get()
        else result = await provinces.orderBy('name', 'asc').paginate(query.pageSize, query.page)

        this.response(result, response)
    }

    cities = async (req, response) => {
        let CityModel = require('../../models/City')
        const {query} = req
        let cities = new CityModel()
        let result
        
        if (query.filters) {
            const filters = JSON.parse(query.filters)
            cities = cities.where({prov_id: {value: filters.prov_id ? filters.prov_id : 0}})
        }

        if (query.excluded) cities = cities.exclude(JSON.parse(query.excluded))

        if (!query.paginated) result = await cities.get()
        else result = await cities.orderBy('name', 'asc').paginate(query.pageSize, query.page)

        this.response(result, response)
    }

    areas = async (req, response) => {
        let AreaModel = require('../../models/Area')
        const {query} = req
        let areas = new AreaModel()

        if (query.filters) {
            const filters = JSON.parse(query.filters)
            areas = areas.where({city_id: {value: filters.city_id ? filters.city_id : 0}})
        }

        const result = await areas.get()
        this.response(result, response)
    }
}

module.exports = new LocationController