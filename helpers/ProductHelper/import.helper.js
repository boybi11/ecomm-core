const SocketHelper  = require('../SocketHelper')
const GeneralHelper = require('../GeneralHelper')
const AssetHelper   = require('../AssetHelper')
const Product       = require('../../models/Product')

exports.saveFromImport = async (product) => {
    const duplicate         = await new Product().where({ sku: { value: product.sku } }).first()
    product.image           = await AssetHelper.uploadFromUrl(product.image_url)
    product.slug            = GeneralHelper.slugify(`${product.name} ${product.sku}`)
    product.publish_date    = product.is_published ? new Date() : null

    if (!duplicate) await new Product().create(product, (err) => console.log(err))
    else if(!duplicate.error) await new Product().where({ sku: { value: product.sku } }).update(product, () => {})

    const socket = await new SocketHelper().connect()
    await socket.emit("product-finish-uploading", product.authorId)
    await socket.emit("forceDC")

    return true
}