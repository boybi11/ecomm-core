const Base      = require('../../core/BaseModelV2')
const moment    = require("moment")

const {
    fillables,
    appends,
    searchables,
    tableFields
}               = require('./confirg')
const utils     = require('./utils')

class Product extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "products"
        this.searchables    = searchables
        this.appends        = appends
        this.fillables      = fillables
    }

    asset               = () => this.hasOne('Asset', 'id', 'image')
    category            = () => this.hasOne('Category', 'id', 'category_id')
    brand               = () => this.hasOne('Brand', 'id', 'brand_id')
    variants            = () => this.hasMany('VariantGroup', 'product_id', 'id')
    children            = () => this.hasMany('Product', 'parent', 'id')
    baseProduct         = () => this.hasOne('Product', 'id', 'parent')
    uoms                = () => this.hasMany('UnitOfMeasure', 'product_id', 'id')
    forTable            = () => this.select(tableFields)
    forSEO              = () => {
                            return this.select([ "name", "description", "image" ])
                                    .with([
                                        'asset',
                                        'category',
                                        'brand',
                                        'tags'
                                    ])
                                    .withJoin({ stock: false, ratings: false, discount: true })
                        }
    withJoin            = (data = {}) => utils.getJoinColumns(this, data)
    appendAssets        = utils.getAssets
    appendOptions       = utils.processOptions
    appendActivePromo   = utils.getActivePromo
    appendIsPublished   = (data) => {
                            data.is_published = data.publish_date && moment().isSameOrAfter(data.publish_date)
                            return data
                        }
    appendStock         = utils.getStock
}

module.exports = Product