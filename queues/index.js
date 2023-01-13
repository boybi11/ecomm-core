const { createBullBoard } = require('@bull-board/api')
const { BullAdapter } = require('@bull-board/api/bullAdapter')
const { ExpressAdapter } = require('@bull-board/express')
const serverAdapter = new ExpressAdapter();

const productImport = require('./product_import')

createBullBoard({
    queues: [
        new BullAdapter(productImport.bull)
    ],
    serverAdapter:serverAdapter
})

serverAdapter.setBasePath('/admin/queues')

exports.router = serverAdapter.getRouter()
exports.queues = {
    products: {
        import: productImport
    }
}