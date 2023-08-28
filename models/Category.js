const Base = require('../core/BaseModelV2')
class Category extends Base {
    constructor(connection) {
        super(connection)
        this.table          = "categories"
        this.searchables    = [ "name "]
        this.fillables      = {
                                "name": "string",
                                "description": "text",
                                "description_draft": "text",
                                "slug": "string",
                                "image": "int",
                                "color": "string",
                                "icon": "int",
                                "parent": "int",
                                "is_featured": "int",
                                "publish_date": "datetime",
                                "created_at": "datetime",
                                "updated_at": "datetime",
                                "deleted_at": "datetime",
                                "path": "string"
                            }
    }

    asset = () => this.hasOne('Asset', 'id', 'image')

    iconAsset = () => this.hasOne('Asset', 'id', 'icon')

    children = () => this.hasMany('Category', 'parent', 'id')

    appendProductCount = async (data, connection) => {
        const Product   = require('./Product')
        const products  = await new Product(connection)
                                    .select(["SUM(id) as total", "category_id"])
                                    .where({category_id: {value: data.id}})
                                    .groupBy('category_id')
                                    .first()
                                    
        data.productCount = 0
        if (products && !products.error) data.productCount = +products.total
        return data
    }

    appendCrumbs = async (data, connection) => {
        if (data.path) {
            const crumbs = data.path.split(':')
            data.crumbs = await new Category(connection)
                            .select([ "name", "id", "slug" ])
                            .whereIn({ id: crumbs })
                            .get()
        }

        return data
    }

    list = this.select(["slug", "name"])
}

module.exports = Category