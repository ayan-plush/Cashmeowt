const express = require('express');
const stripeController = require('../../controllers/stripeController')
const { authMiddleware, adminMiddleware } = require('../../middleware/authMiddleware')


const router = require('express').Router()

router.post('/webhooks/withdrawal', express.raw({ type: 'application/json' }), stripeController.handleWithdrawalWebhook )
router.post('/webhooks', express.raw({ type: 'application/json' }), stripeController.handleStripeWebhook )


module.exports = router

