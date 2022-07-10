const express = require('express')
const router = express.Router()

const logoutController = require('../controllers/LogoutController')

router.get('/', logoutController.get)


module.exports = router
