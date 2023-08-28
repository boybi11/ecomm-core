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

exports.saveChildren = async ({ productId, name }, children = []) => {
    if (productId && children.length) {
        const skus       = children.map(c => c.sku)
        let productModel = new Product().where({parent: {value: productId}})

        if (skus && skus.length) productModel = productModel.exclude({ sku: skus })
        await productModel.delete([])

        if (children && children.length) await Promise.all( children.map(async child => await updateProductChild({ productId, name }, child)) )
    }

    return true
}

const updateProductChild = async ({ productId, name }, child) => {
    await AssetHelper.upload(child.image)
    child.name          = `${ name } ${ child.options.map(option => `(${ option.value })` ).join(' ')}`
    child.slug          = GeneralHelper.slugify(child.name)
    child.parent        = productId
    child.options       = child.options.map(option => `${ option.group }:${ option.value }` ).join('--')

    return await new Product().where({sku: { value: child.sku }})[child.id ? "update" : "create"](child)
}