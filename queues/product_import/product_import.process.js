const { saveFromImport } = require('../../helpers/ProductHelper/import.helper')

module.exports = async (job, done) => {
    await saveFromImport(job.data)
    done()
}