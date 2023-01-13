const Product           = require('../../models/Product')
const VariantGroup      = require('../../models/VariantGroup')
const VariantOption     = require('../../models/VariantOption')

// helpers
const GeneralHelper = require('../GeneralHelper')
const AssetHelper   = require('../AssetHelper')

exports.saveVariants = async (productId, variants = []) => {
    await new VariantGroup().where({product_id: {value: productId}}).delete([])
    if (variants.length) {
        const newVariants = variants.map(v => ({
                name: v.name,
                product_id: productId
        }))

        const newVariantGroup = await new VariantGroup().create(newVariants)
        if (newVariantGroup.error) return newVariantGroup
        else {
            const newOptions = []
            for (let ctr = 0; ctr < newVariantGroup.result.affectedRows; ctr++) {
                variants[ctr].options.forEach(o => {
                            newOptions.push({
                                name: o.name,
                                slug: o.name.toLowerCase().replace(new RegExp(' ', 'g'), ''),
                                variant_group_id: newVariantGroup.result.insertId + ctr
                            })
                        })
            }

            await new VariantOption().create(newOptions)

            return true
        }
    }

    return true
}

exports.saveChildren = async (productId, children = []) => {
    if (productId) {
        const signatures = children.map(c => c.variant_signature)
        let productModel = new Product().where({parent: {value: productId}})

        if (signatures && signatures.length) productModel = productModel.exclude({ variant_signature: signatures })
        await productModel.delete([])

        if (children && children.length) await Promise.all( children.map(child => updateProductChild(productId, child)) )
    }

    return true
}

const updateProductChild = async (parent, child) => {
    child.parent = parent
    
    await AssetHelper.upload(child.image)
    child.images        = await AssetHelper.uploadGroup(child.images)
    child.slug          = GeneralHelper.slugify(`${child.name} ${child.sku}`)
    const childEntry    = await new Product().where({variant_signature: {value: child.variant_signature}}).first()
    
    await new Product().where({variant_signature: {value: child.variant_signature}})[childEntry ? "update" : "create"](child)
}