const stripeController = require('../../controllers/stripeController')
const { authMiddleware, adminMiddleware } = require('../../middleware/authMiddleware')


const router = require('express').Router()

router.get('/stripe-check', authMiddleware, stripeController.wallet_topup )


module.exports = router

