const cluster = require('cluster')

if (cluster.isMaster) {
    const cpus = require('os').cpus()
    cpus.forEach(() => cluster.fork())

    cluster.on("online", (worker) => {
        console.log(`${ worker.process.pid } is online`)
    })

    cluster.on("exit", (worker) => {
        console.log(`${ worker.process.pid } exited, opening new cluster fork`)
        cluster.fork()
    })
}
else {
    require('./index')
}