const Asset = require('../models/Asset')
const Tag   = require('../models/Tag')

class AssetMiddleware {
    saveFromFile = async (req, res, next, tags = []) => {
        const file = req.file
        
        if (file) {
            const asset = await new Asset()
                                .create({
                                    name: file.originalname,
                                    path: `/${file.destination}${file.filename}`,
                                    type: file.mimetype,
                                    alt: file.filename,
                                    size: file.size,
                                    is_temp: 0
                                })
        
            if (asset && !asset.error) {
                req.assetId = asset.result.insertId

                if (tags.length) {
                    const assetTags = tags.map(tag => ({ name: tag, ref_type: "assets", ref_id: req.assetId }))
                    await new Tag().create(assetTags)
                }
            }
        }
        
        next()
    }
}

module.exports = new AssetMiddleware