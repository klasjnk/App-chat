const express = require('express')
const router = express.Router()
const registerController = require('../controllers/RegisterController')
const upload = require('../middleware/upload')
const validate = require('../middleware/validate')

router.get('/', registerController.get)

router.post('/', upload.single('image'), validate, registerController.post)

module.exports = router
