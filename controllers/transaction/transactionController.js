const mongoose = require('mongoose')
const userModel = require("../../models/userModel")
const { responseReturn } = require("../../utils/responseReturn")
const transactionModel = require('../../models/transactionModel')

class transactionControllers {
    
    get_transaction = async (req,res) => {

        const userId = req.id
        const {transactionId} = req.body

        const user = await userModel.findById(userId)


        try {
            const transaction = await transactionModel.findById(transactionId)
            if(!transaction){
                return responseReturn(res, 409, {error: "transaction Id invalid"})
            }
            else {
                return responseReturn(res, 200, {message: "transaction retrieved successfully", transaction: transaction})
            }
        }
        catch (error) {
            return responseReturn(res, 500, {error: error.message})
        }
    }
    
    transfer_funds = async (req, res) => {
        const senderId = req.id;
        const { recipientId, amount, spendType } = req.body;
        const amountNum = Number(amount)

        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const recentTransactions = await transactionModel.countDocuments({
            createdAt: { $gte: twoHoursAgo }
        })

        if(recentTransactions>5){
            const fraudUser = await userModel.findByIdAndUpdate(senderId,
                {
                    $push: {
                        fraudFlags: {
                            reason: "Too many transactions in a short time. Transfer blocked",
                            date: new Date()

                        }
                    }
                },
                { new: true, session  }
            )
            return responseReturn(res,400,{error: "Too many transactions in a short time. Transfer blocked"});
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const sender = await userModel.findById(senderId).session(session);
            if (!sender || sender.isdeleted || sender.disabled) {
                throw new Error("sender can't be found");
            }

            const limit = sender.balance / 2;
            if (amountNum > limit) {
                throw new Error("Transfer exceeds limit");
            }

            const recipient = await userModel.findById(recipientId).session(session);
            
            if (!recipient || recipient.isdeleted || recipient.disabled) {
                throw new Error("recipient user can't be found");
            }

            let flag = false;
            if (amountNum >= recipient.balance / 2) {
                flag = true;
            }

            sender.balance -= amountNum;
            recipient.balance += amountNum;

            sender.transactionvolume += amountNum;
            recipient.transactionvolume += amountNum;

            const transaction = await transactionModel.create([{
                userId: senderId,
                toUserId: recipientId,
                userName: sender.name,
                toUserName: recipient.name,
                spendType,
                amount: amountNum,
                flag
            }], { session });

            // future implementation of transaction summaries
            // const transactionSummary = {
            //     id: transaction[0]._id,
            //     spendType: transaction[0].spendType,
            //     amount: transaction[0].amount,
            //     to: recipient.name,
            //     from: sender.name
            // };

            // sender.transactions.push(transactionSummary);
            // recipient.transactions.push(transactionSummary);

            await sender.save({ session });
            await recipient.save({ session });

            await session.commitTransaction();
            session.endSession();

            return responseReturn(res, 200, {
                message: "Transfer successful",
                transaction: transaction[0]
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            return responseReturn(res, 400, { error: error.message });
        }
    };

}

module.exports = new transactionControllers()