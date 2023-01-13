// sockets.js
const socketIo = require('socket.io')
const productListeners = require('./product.socket')
const notificationListeners = require('./notifications.socket')
const orderListeners = require('./order.socket')

module.exports.listen = function(server){
    const io = socketIo(server)
    const Orders = require('./orders')

    io.sockets.on("connection", (socket) => {
        
        socket.on("subscribe", ({topic}) => {
            socket.join(topic)
        })

        socket.on("unsubscribe", ({unTopics}) => {
            if (unTopics) {
                unTopics.forEach(topic => {
                    socket.leave(topic)
                })
            }
        })

        productListeners(io, socket)

        notificationListeners(io, socket)

        orderListeners(io, socket)

        socket.on("inactive-carts-listen", ({socketId}) => {
            Orders.getInactiveCarts((data) => socket.emit(`inactive-carts-${socketId}`, data))
        })

        //CART ALERTS
        socket.on("cartUpdate", ({ userId, status = "updated" }) => {
            io.to(`user${ userId }Cart`).emit(status, {message: status})
        })

        socket.on("forceDC", () => {
            socket.disconnect()
        })

        socket.on("disconnect", () => {
            // console.log("Client disconnected")
            // DO SOMETHING HERE!!!
        })
    })
}