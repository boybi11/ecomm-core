const socketClient = require('socket.io-client')
const config = require('../config')

class SocketHelper {
    static socket
    constructor() {
        this.socket = socketClient(config.URL.base, {transports: [ 'websocket' ]})
    }

    connect = () => {
        this.socket.connect()
        return this.socket
    }
}

module.exports = SocketHelper