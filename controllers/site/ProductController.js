const Product = require('../../models/Product')
const moment = require("moment")
const ProductHelper = require('../../helpers/ProductHelper')
const BaseController = require('../../core/BaseController')
const ProductView = require('../../models/ProductView')

class ProductController extends BaseController {

    constructor() {
        super()
        this.bestSellers = this.bestSellers.bind(this)
        this.relatedProducts = this.relatedProducts.bind(this)
    }

    get = async (req, response) => {
        const { query } = req
        const filters   = query.filters ? JSON.parse(query.filters) : {}
        let products    = new Product()
                            .select([ "category_id" ])
                            .forTable()
                            .includeAppend([ "stock" ])
                            .withJoin({ stock: false, discount: true })
                            .with(['asset', "children:(?forTable)", "category" ])
                            
        if (!filters.search || (filters.search && query.selector)) {
            if (query.selector) products = products.where({with_variant: {value: 1, operation: "!="}})
            else products = products.where({parent: {value: 0}})
        }
        
        products = this.filter(products, query, ProductHelper.filters())
        if (query.excluded) products =  products.exclude(JSON.parse(query.excluded))
        
        ProductHelper.generateSorting(products, query.sort)

        products = await products
                    .isPublished()
                    .paginate(query.pageSize, query.page, query.pageRowCount)

        this.response(products, response)
    }

    bestSellers(req, res) {
        const OrderItem = require("../../models/OrderItem")

        new OrderItem()
            .select(['product_parent_id', "COUNT(product_parent_id) as count", "products.deleted_at", "products.publish_date", "products.parent"])
            .join("products", "order_items.product_parent_id = products.id")
            .whereRaw(`(status != "cart" OR status != "cancelled" OR status != "refunded") AND products.deleted_at IS NULL AND publish_date <= '${moment().format('YYYY-MM-DD HH:mm:ss')}'`)
            .max(req.query.pageSize ? req.query.pageSize : 5)
            .groupBy("product_parent_id")
            .orderBy("count", "DESC")
            .get((err, orderItems) => {
                req.ids = orderItems ? orderItems.map(item => item.product_parent_id) : null
                this.get(req, res)
            })
    }

    relatedProducts = async (req, res) => {
        const product = await new Product()
                            .select([ "category_id", "brand_id", "parent", "products.id" ])
                            .where({slug: {value: req.params.slug}})
                            .with("tags")
                            .first()

        if (product && !product.error) {
            const filters = {}
            let searchQry = ''
            let filtered  = new Product()
                                .search(product.tags)

            req.query.pageSize = req.query.pageSize || 4
            if (+product.category_id) searchQry = `category_id = ${ product.category_id }`
            if (+product.brand_id) searchQry += ` ${ searchQry ? " OR " : '' } brand_id = ${ product.brand_id }`
            if (searchQry) filtered = filtered.whereRaw(`(${ searchQry })`)
            
            filtered = await filtered
                            .exclude({ id: [ product.id ]})
                            .max(req.query.pageSize)
                            .pluck([ "id" ])
                            
            if (filtered.length === 0) {    
                filters.parent   = 0
                filters.exclude  = { id : [ product.id ] }
            }
            else {
                filters.ids = [ ...filtered ]
                if (filters.ids.length < req.query.pageSize) {
                    const fillers = await new Product()
                                        .exclude({ id: [ product.id, ...filters.ids ]})
                                        .max(req.query.pageSize - filters.ids.length)
                                        .orderBy("RAND()")
                                        .pluck([ "id" ])

                    filters.ids = filters.ids.concat(fillers)
                }
            }
            req.query.filters = JSON.stringify(filters)

            this.get(req, res)
        }
        else this.response(product, res)
    }

    find = async (req, response) => {
        if (req.params.slug) {
            let result = new Product()
            if (req.query.seo) result = result.forSEO()
            else {
                result = result.select(["products.*"])
                            .with([
                                'asset',
                                'category:iconAsset',
                                'brand:asset',
                                'tags',
                                'variants:options',
                                'children:asset->assets'
                            ])
                            .includeAppend([ "stock", "assets" ])
                            .withJoin({ stock: false, discount: true })
            }

            result = await result.where({"slug": { value: req.params.slug }}).first()
            if (result && !result.error && !req.query.seo) await new ProductView().create({ product_id: result.id, user_id: req.authUser ? req.authUser.id : 0 })
            this.response(result, response)
        }
        else this.sendError("Missing request parameter.", response)
    }

    getAllSlugs (req, res) {
        new Product()
            .select(['slug'])
            .get(function(err, data) {
                res.send(data)
            })
    }
}

module.exports = new ProductController