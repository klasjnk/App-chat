require("express-session")
require('dotenv').config()

class LogoutController {
    get(req, res) {
        delete req.session.email
        res.redirect('/')
    }
}

module.exports = new LogoutController
