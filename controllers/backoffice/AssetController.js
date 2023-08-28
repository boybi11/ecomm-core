const AssetHelper       = require('../../helpers/AssetHelper')
const Asset             = require('../../models/Asset')
const AssetGroup        = require('../../models/AssetGroup')
const AssetGroupPivot   = require('../../models/AssetGroupPivot')

const BaseController    = require('../../core/BaseController')
const FileHelper        = require('../../helpers/FileHelper')

class AssetController extends BaseController {
    get = async (req, response) => {
        const { query } = req
        let result      = new Asset()

        this.filter(result, query)
        this.sort(result, query.sort)
        this.response(await result.paginate(query.pageSize, query.page), response)
    }

    edit = async (req, response) => {
        const ids = req.params.ids
        if (ids) {
            const result = await new Asset().with("tags").whereIn({ id: ids.split(':') }).get()
            this.response(result, response)
        }
        else this.sendError("Missing request paramter.", response)
    }

    update = async (req, response) => {
        const { id }    = req.params
        const { tags }  = req.body
        if (id) {
            const result = await new Asset()
                                        .tag(tags || [])
                                        .where({ id: { value: id } })
                                        .update(req.body)

            this.response(result, response)
        }
        else this.sendError("Missing request paramter.", response)
    }

    delete = async (req, response) => {
        const beforeDelete = async ids => {
                                const assets = await new Asset().whereIn({ id: ids }).pluck(["path"])
                                assets.map(asset => {
                                    FileHelper.removeFile(asset.replace("/uploads", "uploads"))
                                })
                            }
        this.deleteAll(req, response, new Asset(), true, beforeDelete)
    }

    getFromGroup = async (req, response) => {
        const { ids } = req.query
        if (ids) {
            const result = await new Asset().whereIn({ id: ids }).get()
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
            const { tags }  = req.body
            let assets      = []

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
            
            const create = await new Asset().tag(tags).create(assets) 
            if (create && !create.error) {
                const ids       = [...Array(create.result.affectedRows)].map((v, i) => create.result.insertId + i)
                const result    = await new Asset().whereIn({id: ids}).get()

                this.response(result, response)
            }
            else this.response(create, response)
        }
        else this.sendError("No files in the request.", response)
    }

    uploadRedactor = async (req, response) => {
        const imageToUpload = req.file ? req.file : null
        let result          = await AssetHelper.upload(imageToUpload, "redactor")

        if (!result) result = { error: { message: "Cannot upload image." } }

        this.response(result, response)
    }

    cleanTempAssets = async (req, response) => {
        const filenames = await FileHelper.read('uploads/assets')
        const toCleanup = filenames && filenames.length ? filenames.splice(0, 500) : []

        if (toCleanup.length) {
            await Promise.all(toCleanup.map(async file => {
                const asset = await new Asset().where({ alt: { value: file } }).first()
                
                if (!asset) FileHelper.removeFile(`uploads/assets/${ file }`)
            }))
        }

        response.send("This sould run on Cron schedule")
    }
}

module.exports = new AssetController