const Queue                 = require('../../core/queue')
const processFile           = __dirname + '/product_import.process.js'
const productImportQueue    = new Queue('product_import', {}, { process: processFile , concurrency: 1 })

productImportQueue.on("completed", async () => {
    await productImportQueue.bull.clean(0, "failed")
    await productImportQueue.bull.clean(0, "completed")
})

module.exports = productImportQueue