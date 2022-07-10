require("express-session")
require('dotenv').config()
require('express')
const User = require("../models/User")
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const unlink = promisify(fs.unlink)
const { validationResult } = require('express-validator')

class RegisterController {
    get(req, res) {
        res.render('register', {
            title: "Register"
        })
    }
    async post(req, res) {
        let result = validationResult(req)
        let error = ""

        if (!result.isEmpty()) {
            error = result.errors[0].msg
            if (req.file) {
                unlink(path.join(__dirname, '../public/images/avatar/' + req.file.filename))
            }
            res.render('./register', {
                error,
                title: "Register",
                name: req.body.name || "",
                email: req.body.email || "",
                password: req.body.password || "",
                password2: req.body.password2 || ""
            })
        } else {
            let { name, email, password } = req.body

            if (req.file) {
                if (!req.file.mimetype.match(/image.*/)) {
                    error = "Chỉ hổ trợ định dạng hình ảnh"
                } else if (req.file.size > (1024 * 1024 * 20)) {
                    error = "Size ảnh không được quá 20MB"
                }
            }

            await User.find({ email: email })
                .then(user => {
                    if (user.length > 0) {
                        error = "Email đã tồn tại"
                    }
                })

            if (error) {
                if (req.file) {
                    unlink(path.join(__dirname, '../public/images/avatar/' + req.file.filename))
                }
                res.render("register", {
                    title: "Register",
                    error: error,
                    name: req.body.name || "",
                    email: req.body.email || "",
                    password: req.body.password || "",
                    password2: req.body.password2 || ""
                })
            } else {
                let userJson = {
                    name: name,
                    email: email,
                    image: req.file.path.split("\\").slice(1).join("/")
                }
                let user = new User(userJson)
                user.setPassword(password)
                user.save()

                res.render('./login', {
                    title: "Login"
                })
            }
        }
    }
}

module.exports = new RegisterController
