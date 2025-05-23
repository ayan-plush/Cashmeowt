const transactionController = require('../../controllers/transaction/transactionController')
const { authMiddleware, adminMiddleware } = require('../../middleware/authMiddleware')


const router = require('express').Router()

router.get('/get-transaction', adminMiddleware, transactionController.get_transaction )
router.post('/transfer-funds', authMiddleware, transactionController.transfer_funds )

module.exports = router

