const express = require('express');
const stripeController = require('../../controllers/stripeController')
const { authMiddleware, adminMiddleware } = require('../../middleware/authMiddleware')


const router = require('express').Router()

router.post('/webhooks', express.raw({ type: 'application/json' }), stripeController.handleStripeWebhook )
router.post('/webhooks/withdrawl', express.raw({ type: 'application/json' }), stripeController.handleWithdrawlWebhook )


module.exports = router

