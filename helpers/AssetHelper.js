const axios = require('axios')
const fs    = require('fs')

const Asset = require('../models/Asset')
const AssetGroup = require('../models/AssetGroup')
const AssetGroupPivot = require('../models/AssetGroupPivot')

// MISC
const settings = require('../config')
const GeneralHelper = require('./GeneralHelper')

class AssetHelper {
    
    upload = async (image, type = "asset") => {
        let data = 0
        if (image) {
            if (type === "asset") {
                const result = new Asset().where({id: image}).update({ is_temp: 0 })
                if (result && !result.error) data = image
            }
            else if (type === "redactor") data = { data: { link: settings.URL.base + `/${image.destination}${image.filename}` } }
        }
        
        return data
    }

    uploadGroup = async (group) => {
        let data = 0
        
        if (group) {
            const splittedIds = group.toString().split(':')
            let groupId =       splittedIds.find(id => id.includes('*'))
            const images =      splittedIds.filter(id => !id.includes('*'))
            
            if (groupId && images.length) {
                groupId = groupId.replace("*", '')
                await new AssetGroupPivot()
                            .where({ asset_group_id: { value: groupId } })
                            .delete([])

                const pivots = images.map(image => ({ asset_group_id: groupId, asset_id: image }))
                await new AssetGroupPivot().create(pivots)
                await new Asset().whereIn({ id: images }).update({ is_temp: 0 })
                await new AssetGroup().where({ id: { value: groupId } }).update({ is_temp: 0 })

                data = groupId
            }
        }

        return data
    }

    uploadFromUrl = async (url) => {
        let image = 0
        if (url) {
            const request =             await axios.get(url, { responseType: 'arraybuffer' })
            const imgbase64 =           Buffer.from(request.data, 'binary').toString('base64')
            const fileExtension =       this.getB64FileExtension(imgbase64)

            image = await new Promise(async resolve => {
                                    let filePath
                                    let duplicate
                                    let filename

                                    do {
                                        filename =  GeneralHelper.randomStr(30)
                                        filePath =  `/uploads/assets/${ filename }.${ fileExtension }`
                                        duplicate = await new Asset().where({ path: { value: filePath }}).first()
                                    } while(duplicate)

                                    fs.writeFile(`.${ filePath }`, imgbase64, 'base64', async () => {
                                        const stat = fs.statSync(`.${ filePath }`)
                                        const data = {
                                            path: filePath,
                                            name: filename,
                                            size: stat.size,
                                            alt: filename,
                                            type: `image/${ fileExtension }`,
                                            is_temp: 0
                                        }
                                        
                                        const image = await new Asset().create(data)
                                        resolve(image && !image.error ? image.result.insertId : 0)
                                    })
                                })
        }

        return image
    }

    getB64FileExtension(b64) {
        const extensionMap = Object.freeze({
            '/': "jpg",
            'i': "png",
            'R': "gif",
            'U': "webp"
        })

        return extensionMap[b64.charAt(0)]
    }
}

module.exports = new AssetHelper