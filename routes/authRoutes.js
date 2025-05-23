const authControllers = require('../controllers/authControllers')


const router = require('express').Router()

router.put('/user-register', authControllers.user_register)
router.post('/user-login', authControllers.user_login)
router.put('/admin-register', authControllers.admin_register)
router.post('/admin-login', authControllers.admin_login)
router.get('/logout', authControllers.logout)

module.exports = router