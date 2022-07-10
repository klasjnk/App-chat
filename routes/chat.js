const express = require('express')
const router = express.Router()

const chatController = require('../controllers/ChatController')

router.get('/', chatController.get)

module.exports = router
