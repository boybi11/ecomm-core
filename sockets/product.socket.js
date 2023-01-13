const Notification  = require('../models/Notification')
const { queues }    = require('../queues')
let uploading       = 0
let remaining       = 0
let authorUploads   = {}
let currentProgress = 0

module.exports = function(io, socket) {

    socket.on("products-start-uploading", (numberOfUploadingProducts, authorId) => {
        uploading += numberOfUploadingProducts
        remaining += numberOfUploadingProducts
        if (!authorUploads[authorId]) authorUploads[authorId] = { start: 0, count: 0 }
        authorUploads[authorId].start += numberOfUploadingProducts
        authorUploads[authorId].count += numberOfUploadingProducts
        io.in(`product-upload-listener`).emit("on-change", { remaining, uploading })
    })

    socket.on("product-finish-uploading", async (authorId) => {
        if (remaining === 0 || uploading === 0) {
            const jobs = await queues.products.import.getJobsCount()

            uploading += jobs.waiting
            remaining += jobs.waiting
        }

        remaining -= 1
        const progress = Math.floor(((uploading - remaining) / uploading) * 100)
        if (authorUploads[authorId]) authorUploads[authorId].count -= 1

        if (progress !== currentProgress) {
            currentProgress = progress
            io.in(`product-upload-listener`).emit("on-change", { remaining, uploading })
        }
        
        if (authorUploads[authorId] && authorUploads[authorId].count === 0) {
            io.in(`product-listener`).emit("done-uploading")
            const notification = {
                ref_target: authorId,
                message: `Your product import successfully uploaded ${ authorUploads[authorId].start } item${ authorUploads[authorId].start > 1 ? 's' : '' }.`
            }
            
            delete authorUploads[authorId]
            await new Notification().send(notification)
        }

        if (remaining === 0) uploading = 0
    })

    socket.on("product-rating-update", ({ productId }) => {
        io.in("product-rating-listener").emit("update", { message: "update", productId })
    })

    return socket
}