const express = require('express')
const router = express.Router()
const { register, login, updateCredential, getCurrentUser } = require('../controllers/auth')
const authenticateUser = require('../middleware/authentication');

router.post('/register', register)
router.post('/login', login)

// secure
router.patch('/update', authenticateUser, updateCredential)
router.get('/me', authenticateUser, getCurrentUser)


module.exports = router