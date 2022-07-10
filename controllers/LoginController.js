require("express-session")
require('dotenv').config()
const User = require("../models/User")

class LoginController {
    get(req, res) {
        res.render('login', {
            title: "Login"
        })
    }

    post(req, res) {
        let { email, password } = req.body

        User.findOne({ email: email }, function (err, user) {
            let error
            if (user === null) {
                error = "Email hoặc mật khẩu không đúng" // sai email
            } else {
                if (user.validPassword(password)) {
                    req.session.email = user.email
                    res.redirect('../')
                }
                else {
                    error = "Email hoặc mật khẩu không đúng" // sai mat khau
                }
            }

            if (error) {
                res.render('login', {
                    title: "Login",
                    error: error,
                    email: req.body.email
                })
            }
        })
    }
}

module.exports = new LoginController
