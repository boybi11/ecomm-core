const Product = require('../../models/Product')

const BaseController    = require('../../core/BaseController')
const AssetHelper       = require('../../helpers/AssetHelper')
const GeneralHelper     = require('../../helpers/GeneralHelper')
const ProductHelper     = require('../../helpers/ProductHelper')
const { queues }        = require('../../queues/index')
const SocketHelper      = require('../../helpers/SocketHelper')
const XLSXHelper        = require('../../helpers/XLSXHelper')
const FileHelper        = require('../../helpers/FileHelper')

class ProductController extends BaseController {

    get = async (req, response) => {
        const { query } = req
        const filters   = query.filters ? JSON.parse(query.filters) : {}
        let products    = new Product()
                            .forTable()
                            .withJoin()
                            .with(['asset', "children:(asset-uoms-?withJoin-?forTable)", "uoms"])
        
        if (!filters.search || (filters.search && query.selector)) {
            if (query.selector) products = products.where({with_variant: {value: 1, operation: "!="}})
            else products = products.where({parent: {value: 0}})
        }
        
        products = this.filter(products, query, ProductHelper.filters())
        if (query.excluded) products =  products.exclude(JSON.parse(query.excluded))

        ProductHelper.generateSorting(products, query.sort)

        products = await products.paginate(query.pageSize, query.page, query.pageRowCount)
        this.response(products, response)
    }
    
    store = async (req, response) => {
        await AssetHelper.upload(req.body.image)
        const variants          = req.body.variants ? [...req.body.variants] : []
        req.body.with_variant   = variants.length > 0 ? 1 : 0
        const product           = await new Product().log(req.body, req.authUser.id).create(req.body)

        await ProductHelper.saveRelationships(product.result.insertId, req.body)
        this.response(product, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) response.status(400).send({ message: "Missing id request parameter" })

        const relations =   [ 'tags', 'variants:options', 'children:asset', 'uoms', 'baseProduct:asset' ]
        const product =     await new Product()
                                        .select([ "products.*" ])
                                        .withJoin()
                                        .with(relations)
                                        .where({"products.id": {value: req.params.id}})
                                        .first()

        this.response(product, response)
    }

    update = async (req, response) => {
        await AssetHelper.upload(req.body.image)
        const data          = { ...req.body }
        
        if (Object.keys(req.body).length > 1) {
            if (data.parent) {
                delete data.options
                delete data.variants
            }
            else {
                const variants      = req.body.variants ? [...req.body.variants] : []
                data.with_variant   = variants.length > 0 ? 1 : 0
    
                if (!req.body.options) data.options = ""
            }
        }

        const update = await new Product()
                                    .log(data, req.authUser.id, req.params.id)
                                    .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                    .update(data)

        await ProductHelper.saveRelationships(req.params.id, req.body)
        this.response(update, response)
    }

    delete = async (req, response) => this.deleteAll(req, response, new Product(), true)

    import = async (req, response) => {
        const exportableData = await XLSXHelper.generateExportableData(req.body, { authorId: req.authUser.id }, "bullBulk")
        
        if (exportableData && exportableData.length) {
            const socket = new SocketHelper().connect()
            socket.emit("products-start-uploading", exportableData.length, req.authUser.id)
            socket.emit("forceDC")

            // new QueueHelper("product_import").addJobs({
            //     payload: exportableData,
            //     onProcess: (data) => ProductHelper.s aveFromImport(data, req.authUser.id),
            //     concurrency: 1
            // })
            queues.products.import.addJobs(exportableData)
            FileHelper.removeFile(req.body.ref)
            this.response({ message: "Your import is being processed!" }, response)
        }
        else this.sendError("No data for request", response)
    }

    findBySKU = async (req, response) => {
        const { params: { sku } } = req

        if (sku) {
            const product = await new Product()
                                .with("asset")
                                .where({ sku: { value: sku } })
                                .first()

            if (product) return this.response(product, response)
        }
        
        this.sendError("Invalid SKU", response)
    }

    getOOSCount = async (req, response) => {
        const product = await new Product()
                            .withJoin({ ratings: false })
                            .where({
                                track_inventory: { value: 1 },
                                with_variant: { value: 1, operation: "!=" }
                            })
                            .having(`stock = 0 OR stock IS NULL`)
                            .paginate(1)
            
        return this.response(product, response)
    }
}

module.exports = new ProductController