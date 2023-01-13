const socketClient = require('socket.io-client')

class OrderHelperSocket {
    constructor() {
        const config    = require('../config')
        this.socket     = socketClient(config.URL.base, {transports: [ 'websocket' ]})
    }

    updateUnseenOrder = ({
        status = "unseen",
        data = []
    }) => {
        this.socket.emit("order-seen-update", { status, data })
    }

    disconnect = () => this.socket.disconnect()
}

module.exports = new OrderHelperSocket