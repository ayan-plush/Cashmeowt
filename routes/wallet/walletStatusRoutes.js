const walletController = require('../../controllers/wallet/walletController')
const { authMiddleware } = require('../../middleware/authMiddleware')

const router = require('express').Router()

router.get('/get-balance', authMiddleware, walletController.get_balance)


module.exports = router