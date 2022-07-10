const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema({
    host_email: String,
    guest_email: String,
    guest_id: String,
    message: String,
    createdAt: String,
})

module.exports = mongoose.model('Message', Message)
