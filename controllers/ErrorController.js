require("express-session")
require('dotenv').config()

class ErrorController {
    error(req, res) {
        res.status(404)
        res.render('error', { title: "404 - Page Not Found" })
    }
}

module.exports = new ErrorController
