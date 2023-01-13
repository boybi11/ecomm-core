const Notification = require('../models/Notification')

module.exports = function(io, socket) {

    socket.on("alert-notification", async (userId) => {
        let notification = await new Notification()
                                        .select(["COUNT(ref_target) as total, ref_target"])
                                        .where({
                                            ref_target: { value: userId },
                                            seen_at: { value: null }
                                        })
                                        .first()

        const unseen = notification && !notification.error ? notification.total : 0
        io.in(`user-${ userId }-notification-listener`).emit("new", unseen)
    })

    return socket
}