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

        wallet_withdrawl = async (req,res) => {
            const userId = req.id
            const user = await userModel.findById(userId);
            const { amount } = req.body

            if(!user||!user.stripeId){
                return responseReturn(res,400,{error: "Stripe account for user not found"})
            }

            if(user.balance < amount){
                return responseReturn(res,400,{error: "Insufficient funds"})
            }

            try {
                const transfer = await stripe.transfers.create({
                    amount: Math.trunc(amount),
                    currency: 'usd',
                    destination: user.stripeId,
                    description: 'User withdrawal',
                    metadata: {
                    userId: userId,
                    userEmail: user.email, // optional, useful for debugging
                    }

                })

                return responseReturn(res,200, {message: "withdrawl initiated", transfer})

            }
            catch (error){
                return responseReturn(res,500, {error: error.message})
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

        handleWithdrawlWebhook = async (req, res) => {
            
            const sig = req.headers['stripe-signature'];
            //for debugging purposes 
            // console.log(sig,req.body)
            // console.log("reached")
            let event;
            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    sig,
                    process.env.WEBHOOK_WITHDRAWL_SECRET
                );
            } catch (error) {
                console.error("Webhook verification failed:", error.message);
                return responseReturn(res, 400, `Webhook error ${error.message}`);
            }

            if (event.type === 'transfer.created') {
                const session = event.data.object;
                const userId = session.metadata.userId;
                const amount = parseFloat(session.amount);


                if (!userId || isNaN(amount)) {
                    return responseReturn(res,500,{error: "Invalid metadata"})
                }


                try {
                    const user = await userModel.findById(userId);
                    if (user) {
                        user.balance -= amount;
                        user.transactionvolume += amount;
                        await user.save();
                        console.log(`✅ $${amount} withdrawn from ${user.email}`);
                    }
                } catch (error) {
                    console.error("Error Withdrawing:", error.message);
                }
            }

            res.status(200).json({ received: true });
        };

    
}

module.exports = new stripeControllers()