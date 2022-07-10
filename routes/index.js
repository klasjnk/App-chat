const loginRouter = require('./login')
const homeRouter = require('./home')
const chatRouter = require('./chat')
const registerRouter = require('./register')
const logoutRouter = require('./logout')
const errorRouter = require('./error')
const checkLogin = require('../middleware/checkLogin')
const rejectLogin = require('../middleware/rejectLogin')

function route(app) {
    app.use('/login', rejectLogin, loginRouter)
    app.use('/logout', logoutRouter)
    app.use('/chat', checkLogin, chatRouter)
    app.use('/register', rejectLogin, registerRouter)
    app.use('/', checkLogin, homeRouter)
    app.use(errorRouter)
}

module.exports = route
