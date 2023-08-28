// models
const Settings          = require('../../../models/Settings')
const BaseController    = require('../../../core/BaseController')
const AssetHelper       = require('../../../helpers/AssetHelper')

class SettingController extends BaseController {

    get = async (req, response) => {
        let result = new Settings()

        if (req.query.group) result = result.filterGroup(req.query.group)
        result = await result.get()
        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.body) {
            const slugs =       []
            const settings =    []
            Object.keys(req.body).forEach(key => {
                slugs.push(req.body[key].slug)
                settings.push(req.body[key])
            })

            const deleted = await new Settings().whereIn({ slug: slugs }).delete([])
            
            if (deleted && !deleted.error) {
                const storeImages = settings.find(setting => setting.name === "store_images")
                const id = await AssetHelper.uploadGroup(storeImages ? storeImages.value : null)

                if (storeImages) storeImages.value = id
                const create = await new Settings().create(settings)

                if (create && !create.error) {
                    const result = await new Settings().get()

                    if (result && !result.error) {
                        result.loggable = {
                            ref_id: 0,
                            user_id: req.authUser.id,
                            model: "Settings",
                            type: "upate",
                            encoded_data: JSON.stringify(result)
                        }
                    }
                    
                    this.response(result, response)
                }
                else this.response(create, response)
            }
            else this.response(deleted, response)
        }
        else response.status(204).send()
    }
}

module.exports = new SettingController