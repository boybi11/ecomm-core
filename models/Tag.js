const Base = require('../core/BaseModelV2')
class Tag extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "tags"
        this.fillables  = {
                            "name": "string",
                            "ref_type": "string",
                            "ref_id": "int",
                        }
    }

    save = async (refType, refId, tags) => {
        const currentTags = await this
                                    .where({
                                        ref_type: { value: refType },
                                        ref_id: { value: refId }
                                    })
                                    .pluck("name")
                                    .map(tag => tag.toLowerCase())

        const validTags = tags.filter(tag => !currentTags.includes(tag.toLowerCase()))
        
        if (validTags.length) {
            return this.create(validTags.map(tag => ({ ref_type: refType, ref_id: refId, name: tag })))
        }

        return {}
    }
}

module.exports = Tag