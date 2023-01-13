const Base = require('../core/BaseModelV2')
class OrderAddress extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "order_addresses"
        this.fillables  = {
                            "order_id": "int",
                            "first_name": "string",
                            "last_name": "string",
                            "email": "string",
                            "address_line": "string",
                            "country_id": "int",
                            "province_id": "int",
                            "city_id": "int",
                            "area_id": "int",
                            "zip": "string",
                            "mobile_number": "string",
                            "type": "string",
                            "created_at": "datetime",
                            "updated_at": "datetime"
                        }

        this.appends    = ['province', 'city', 'area']
    }

    appendProvince = async (data, connection) => {
        const Province = require('./Province')
        const province = await new Province(connection)
                                    .where({id: {value: data.province_id}})
                                    .first()

        if (province && !province.error) data.province = province.name
        return data
    }

    appendCity = async (data, connection) => {
        const City = require('./City')
        const city = await new City(connection)
                                .where({id: {value: data.city_id}})
                                .first()

        if (city && !city.error) data.city = city.name
        return data
    }

    appendArea = async (data, connection) => {
        const Area = require('./Area')
        const area = await new Area(connection)
                                .where({id: {value: data.area_id}})
                                .first()

        if (area && !area.error) data.area = area.name
        return data
    }
}

module.exports = OrderAddress