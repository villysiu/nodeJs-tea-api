const express = require('express')
const router = express.Router()
const { register, login, updateUser } = require('../controllers/auth')
const authenticateUser = require('../middleware/authentication');

router.post('/register', register)
router.post('/login', login)

// secure
router.patch('/update', authenticateUser, updateCredential)



module.exports = router