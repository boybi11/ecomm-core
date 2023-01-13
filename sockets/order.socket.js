module.exports = function(io, socket) {

    socket.on("orderPayment", () => {
        io.in("orders").emit("payment-settled", {message: "update"})
        io.in("products").emit("rankings", {message: "update"})
    })

    socket.on("order-status", ({userId = 0, status, orderIds = []}) => {
        io.in("order-statuses").emit(status)
        
        if (status !== "placed") io.in("orders").emit("status-change", { orderIds })
        else io.in("orders").emit("order-placed")
        
        if (Array.isArray(userId)) userId.forEach(uId => io.in(`user${ uId }Orders`).emit(`orderUpdate`))
        else io.in(`user${ userId }Orders`).emit(`orderUpdate`)
    })

    socket.on("order-seen-update", ({status, data = []}) => {
        data.forEach(d => {
            io.in(`order-seen-${ d.userId }`).emit("seen-update", { status, ...d.payload })
        })
    })

    return socket
}