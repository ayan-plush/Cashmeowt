const transactionAdminController = require('../../controllers/admin/transactionAdminController')
const userStateController = require('../../controllers/admin/userStateController')
const { adminMiddleware } = require('../../middleware/authMiddleware')


const router = require('express').Router()

router.get('/admin/get-flagged-transactions', adminMiddleware, transactionAdminController.getFlaggedTransactions )
router.post('/admin/enable-user', adminMiddleware, userStateController.enableUser )
router.post('/admin/delete-user', adminMiddleware, userStateController.softDeleteUser )



module.exports = router

