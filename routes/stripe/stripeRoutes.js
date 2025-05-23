const stripeController = require('../../controllers/stripeController')
const { authMiddleware, adminMiddleware } = require('../../middleware/authMiddleware')
const { convertToUSD } = require('../../middleware/currencyMiddleware')


const router = require('express').Router()

router.get('/stripe-check', authMiddleware, convertToUSD, stripeController.wallet_topup )
router.get('/stripe-withdraw', authMiddleware, convertToUSD, stripeController.wallet_withdrawl )


module.exports = router

