require("express-session")
require('dotenv').config()
const User = require("../models/User")
const Message = require("../models/Message")

class HomeController {
    async get(req, res) {
        let host
        let userSearch = []

        await User.find({ email: req.session.email })
            .then(hostInfo => {
                host = hostInfo
            }).catch(err => {
                res.send("error")
            })

        if (req.query.search_user) {
            await User.find({ name: { $regex: req.query.search_user, $options: "i" } }) // i: Case insensitivity to match upper and lower cases
                .then(users => {
                    userSearch = users
                })
        } else {
            await User.find({}).lean()
                .then(users => {
                    userSearch = users
                })
        }

        let messageArr = []
        for (const user of userSearch) {
            await Message.find({
                $or: [{ host_email: req.session.email, guest_email: user.email },
                { host_email: user.email, guest_email: req.session.email }]
            })
                .then(message => {
                    message.forEach((mess, index) => {
                        if (index == message.length - 1) {
                            messageArr.push(mess)
                        }
                    })
                })
        }

        res.render('index', {
            search_user: req.query.search_user || '',
            host: host[0],
            users: userSearch, //search users
            messageArr: messageArr
        })

    }
}

module.exports = new HomeController
