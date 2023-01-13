const ProductRating  = require('../../models/ProductRating')
const BaseController = require('../../core/BaseController')
const Product        = require('../../models/Product')
const socketClient   = require('socket.io-client')

class ProductRatingController extends BaseController {

    constructor() {
        super()
        const config =  require('../../config')
        this.socket =   socketClient(config.URL.base, {transports: [ 'websocket' ]})
    }

    get = async (req, response) => {
        let productRatings  = new ProductRating().with(["user:asset"])
        const { query }     = req

        if (req.params.slug) {
            const product = await new Product().select([ "id" ]).where({ slug: { value: req.params.slug }}).first()
            if (product && !product.error) productRatings = productRatings.where({ product_id: { value: product.id }})
            else return this.response(product, response)
        }

        this.filter(productRatings, query)
        this.sort(productRatings, ["created_at", "DESC"])

        const result = await productRatings.paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    getRatingStats = async (req, response) => {
        let ratings =   {
                            1: { total: 0, count: 0},
                            2: { total: 0, count: 0},
                            3: { total: 0, count: 0},
                            4: { total: 0, count: 0},
                            5: { total: 0, count: 0},
                            total: { total: 0, count: 0}
                        }
        const result =  await new ProductRating()
                            .select(["SUM(rating) as total", "COUNT(rating) as count", "rating"])
                            .where({ product_id: { value: req.params.product } })
                            .groupBy("rating")
                            .get()

        if (result && !result.error) {
            result.forEach(rate => {
                ratings[rate.rating] = { total: rate.total, count: rate.count }
                ratings.total.total += +rate.total
                ratings.total.count += +rate.count
            })
        }
        this.response(ratings, response)
    }

    store = async (req, response) => {
        if (req.body.product_id) {
            let result = await new ProductRating().create(req.body)
            if (result && !result.error) {
                this.socket.connect()
                this.socket.emit("product-rating-update", ({ productId: req.body.product_id }))
                this.socket.emit("forceDC")
            }

            if (result && !result.error) result = await new ProductRating().where({ id: { value: result.result.insertId } }).first()

            this.response(result, response)
        }
        else this.sendError("Missing request parameter.", response)
    }
}

module.exports = new ProductRatingController