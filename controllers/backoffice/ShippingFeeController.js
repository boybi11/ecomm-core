const ShippingFee = require('../../models/ShippingFee')
const ShippingZone = require('../../models/ShippingZone')

const BaseController = require('../../core/BaseController')
const ShippingFeeHelper = require('../../helpers/ShippingFeeHelper')
const Province = require('../../models/Province')
const ShippingRate = require('../../models/ShippingRate')

class ShippingFeeController extends BaseController {

    get = async (req, response) => {
        let shipping = new ShippingFee().with('rates')
                            
        const {query} = req
        
        this.filter(shipping, query)
        this.sort(shipping, query.sort)

        const result = await shipping.paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    store = async (req, response) => {
        const { body } = req
        const result = await new ShippingFee().create(req.body)

        if (result && !result.error) {
            const shippingFeeId = result.result.insertId
            await processZones(shippingFeeId, body.zones)
            await processRates(shippingFeeId, body.rates)
        }

        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) this.sendError("Missing request paramter.", response)
        else {
            const result = await new ShippingFee()
                                        .with(['zones:province', 'rates'])
                                        .where({"id": {value: req.params.id}})
                                        .first()

            this.response(result, response)
        }
    }

    update = async (req, response) => {
        if (req.params.id) {
            const { body } = req
            const result = await new ShippingFee()
                                        .where({id: { value: req.params.id }})
                                        .update(req.body)

            if (result && !result.error) {
                const shippingFeeId = req.params.id
                await processZones(shippingFeeId, body.zones)
                await processRates(shippingFeeId, body.rates)
            }

            this.response(result, response)
        }
        else this.sendError("Missing request paramter.", response)
    }

    delete = (req, res) => this.deleteAll(req, res, new ShippingFee().with(['zones:province', 'rates']))

    // custom requests
    getExcludedZones = async (req, response) => {
        let zones = new ShippingZone()

        if (req.query.shipping_fee_id) zones = zones.where({shipping_fee_id: {value: req.query.shipping_fee_id, operation: "!="}})

        const result = await zones.get()
        this.response(result, response)
    }

    getShippingZoneFee = async (req, response) => {
        const { province_id } = req.query
        if (province_id) {
            const zones = await new ShippingZone().where({province_id: {value: province_id}}).get()
            if (zones?.length && !zones.error) {
                const fees = await new ShippingFee()
                                        .with("rates")
                                        .whereIn({id: zones.map(g => g.shipping_fee_id)})
                                        .get()

                return this.response(fees, response)
            }

            return this.response(zones, response)
        }
        else if ( req.query.shippingRate ) {
            const [ fee, rate ] = req.query.shippingRate.split(':')

            if (fee && rate) {
                const shippingFee = await new ShippingFee().find(fee)
                shippingFee.rate  = await new ShippingRate().find(rate)

                return this.response(shippingFee, response)
            }
            else return this.sendError("Missing required parameter", response)
        }
        
        return this.sendError("Missing required parameter", response)
    }

    getAvailableShippingZones = async (req, response) => {
        let shippingZones = new ShippingZone()
        if (req.params.shipping_id) shippingZones = shippingZones.where({ shipping_fee_id: { value: req.params.shipping_id, operation: "!=" } })
        const zones = await shippingZones.get()

        if (zones && !zones.error) {
            const { query } = req
            let zoneIds = zones.map(zone => zone.province_id)
                
            const result = await new Province().whereNotIn({ id: zoneIds }).paginate(query.pageSize, query.page)
            this.response(result, response)
        }
        else this.response(zones, response)
    }
}

const processZones = async (shippingFeeId, zones) => {
    
    await new ShippingZone().where({shipping_fee_id: {value: shippingFeeId}}).delete([])
    if (zones) {
        zones = zones.map(z => {
            return {
                shipping_fee_id: shippingFeeId,
                province_id: z.id
            }
        })
        const result = await new ShippingZone().create(zones)
        return result
    }

    return null
}

const processRates = async (shippingFeeId, rates) => {
    await new ShippingRate().where({shipping_fee_id: {value: shippingFeeId}}).delete([])

    if (rates) {
        rates = rates.map(z => {
            z.shipping_fee_id = shippingFeeId
            return z
        })
        const result = await new ShippingRate().create(rates)
        return result
    }

    return null
}

module.exports = new ShippingFeeController