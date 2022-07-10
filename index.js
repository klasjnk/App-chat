const express = require('express')
const app = express()
const route = require('./routes')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const cookieSession = require('cookie-session')
const methodOverride = require('method-override')
const MemoryStore = require('session-memory-store')(expressSession)
// const MongoStore = require('connect-mongo')(expressSession)
const db = require('./server/server')
// const port = process.env.PORT || 3000
// websocket import
const WebsocketServer = require('ws')
const server = require('http').createServer(app)
const wws = new WebsocketServer.Server({
    server
})
//---------------------
const bodyParser = require('body-parser')

const Message = require("./models/Message")

require('ejs')
require('dotenv').config()

// connect to db
db.connect()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(cookieParser())
app.use(cookieSession({
    secret: 'secret',
    store: new MemoryStore(60 * 60 * 12),
    cookie: { maxAge: 60 * 60 * 1000 }
}))
// app.use(expressSession({
//     resave: false,
//     saveUninitialized: false,
//     secret: 'secret',
//     // store: new MongoStore(),
// }))

// custom method 
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')

//websocket
wws.on('connection', function connection(ws) {
    ws.on('message', function incoming(jsonMessage) {
        let json = JSON.parse(jsonMessage)
        let message = new Message(json)
        message.save()
        wws.clients.forEach(function (client) {
            if (client !== ws && client.readyState == WebsocketServer.OPEN) {
                client.send(JSON.stringify(json))
            }
        })
    })
})


//---------

route(app)

server.listen(process.env.PORT || 3000,() => {
    console.log('listening on port '+process.env.PORT)
}) 