const userModel = require("../models/userModel");
const { responseReturn } = require("../utils/responseReturn");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);


class stripeControllers {


        wallet_topup = async (req, res) => {
            const { amount } = req.body;
            const userId = req.id; // From auth middleware

            if (!amount || amount <= 0) {
                return responseReturn(res, 400, { error: "Invalid amount" });
            }

            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Wallet Top-Up'
                            },
                            unit_amount: Math.round(amount * 100), // in cents
                        },
                        quantity: 1
                    }],
                    mode: 'payment',
                    success_url: 'https://cashmeowt.com/success',
                    cancel_url: 'https://cashmeowt.com/cancel',
                    metadata: {
                        userId: userId,
                        amount
                    }
                });

                responseReturn(res, 200, { url: session.url });
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        };

        handleStripeWebhook = async (req, res) => {
            
            const sig = req.headers['stripe-signature'];
            //for debugging purposes 
            // console.log(sig,req.body)
            // console.log("reached")
            let event;
            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    sig,
                    process.env.WEBHOOK_SECRET
                );
            } catch (error) {
                console.error("Webhook verification failed:", error.message);
                return responseReturn(res, 400, `Webhook error ${error.message}`);
            }

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const userId = session.metadata.userId;
                const amount = parseFloat(session.metadata.amount);

                try {
                    const user = await userModel.findById(userId);
                    if (user) {
                        user.balance += amount;
                        user.transactionvolume += amount;
                        await user.save();
                        console.log(`✅ $${amount} added to ${user.email}`);
                    }
                } catch (error) {
                    console.error("Error updating wallet:", error.message);
                }
            }

            res.status(200).json({ received: true });
        };

    
}

module.exports = new stripeControllers()