const fs = require('fs')

const AssetHelper = require('../../helpers/AssetHelper')
const Asset = require('../../models/Asset')
const AssetGroup = require('../../models/AssetGroup')
const AssetGroupPivot = require('../../models/AssetGroupPivot')

const BaseController = require('../../core/BaseController')

class AssetController extends BaseController {
    get = async (req, response) => {
        const { query } = req
        
        const result = await new Asset().paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    edit = async (req, response) => {
        const ids = req.params.ids
        if (ids) {
            const result = await new Asset().whereIn({ id: ids.split(':') }).get()
            this.response(result, response)
        }
        else this.sendError("Missing request paramter.", response)
    }

    getFromGroup = async (req, response) => {
        const id = req.params.id
        
        if (id) {
            const result = await new AssetGroupPivot().where({ asset_group_id: { value: id } }).get()
            this.response(result, response)
        }
        else this.sendError("Missing request paramter.", response)
    }

    initGroup = async (req, response) => {

        let result = await new AssetGroup().create({ is_temp: 1 })
        if (result && !result.error) result = { group: result.result.insertId }
        this.response(result, response)
    }

    uploadTemp = async (req, response) => {
        if (req.files && req.files.length) {
            let assets = []

            req.files.map(f => {
                let asset = {
                    name: f.originalname,
                    path: `/${f.destination}${f.filename}`,
                    type: f.mimetype,
                    alt: f.filename,
                    size: f.size,
                    is_temp: 1
                }

                assets.push(asset)
            })

            const create = await new Asset().create(assets)
            
            if (create && !create.error) {
                const ids =     [...Array(create.result.affectedRows)].map((v, i) => create.result.insertId + i)
                const result =  await new Asset().whereIn({id: ids}).get()

                this.response(result, response)
            }
            else this.response(create, response)
        }
        else this.sendError("No files in the request.", response)
    }

    uploadRedactor = async (req, response) => {
        const imageToUpload =   req.file ? req.file : null
        let result =            await AssetHelper.upload(imageToUpload, "redactor")

        if (!result) result = { error: { message: "Cannot upload image." } }

        this.response(result, response)
    }

    cleanTempAssets = async (req, response) => {
        const reuslt = await new Asset()
                                    .where({ is_temp: { value: 1 } })
                                    .paginate(300, 1)

        if (reuslt.total) {
            const ids = reuslt.reuslt.map(d => d.id)
            reuslt.reuslt.forEach(asset => {
                try {
                    fs.unlinkSync('.' + asset.path)
                } catch (error) {
                    console.log(error)
                }
            })

            const deleted = await new Asset().delete(ids)
            response.send("Done cleaning")
        }
        else res.send("Nothing to clean up")
    }
}

module.exports = new AssetController