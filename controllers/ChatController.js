require("express-session")
require('dotenv').config()
const User = require("../models/User")
const Message = require("../models/Message")
class ChatController {
    async get(req, res) {
        let messages
        let guest

        await User.findOne({ _id: req.query.id })
            .then(user => {
                guest = user
            }).catch(() => {
                res.render("error", { title: "404 - Page Not Found" })
            })

        await Message.find({ $or: [{ host_email: req.session.email, guest_email: guest.email }, { host_email: guest.email, guest_email: req.session.email }] })
            .then(mess => {
                messages = mess
            })
            .catch(() => {
                res.render("error", { title: "404 - Page Not Found" })
            })

        await User.findOne({ email: req.session.email })
            .then(host => {
                res.render('chat', {
                    title: "Chat",
                    host: host,
                    guest: guest,
                    messages: messages
                })
            }).catch(() => {
                res.render("error", { title: "404 - Page Not Found" })
            })
    }
}

module.exports = new ChatController
