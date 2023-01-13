const Category = require('../models/Category')

exports.getPath = async function (parentId) {
    let path = ''
    if (parentId) {
        const parent = await new Category().find(parentId)
        if (parent.path) path = parent.path
        path += `${ path ? ':' : '' }${ parent.id }`
    }

    return path
}