const express     = require("express")
const app         = express() // create express app
const path        = require("path")
const cors        = require('cors')
const apiRoutes   = require('./routes/api.routes')
const sockets     = require('./sockets')
const serverConf  = require('./core/server')
const queues      = require('./queues')
const port        = 5000

require('./core/dbconnect')

app.options('*', cors())
app.use(cors())
//ROUTES
// app.use(express.static(path.join(__dirname, "..", "build")))
app.use('/admin/queues', queues.router);

app.use('/assets', express.static(path.join(__dirname, "assets")))
app.use('/uploads', express.static(path.join(__dirname, "uploads")))
app.use('/api', apiRoutes)
app.use('/static', express.static(path.join(__dirname, "build/static")))
app.use('/_next', express.static(path.join(__dirname, "out/_next")))
app.use('/pos', express.static(path.join(__dirname, "out")))
app.use('/', express.static(path.join(__dirname, "build")))

const server = serverConf(app)
sockets.listen(server)

server.listen(port, async () => {
  console.log(`server started on port ${ port }`)
})