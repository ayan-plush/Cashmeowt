const transactionModel = require("../../models/transactionModel");
const { responseReturn } = require("../../utils/responseReturn");


class transactionAdminControllers {
    getFlaggedTransactions = async(req,res) => {

        try {
            const flaggedTransactions = await transactionModel.find({ flag: true }).sort({ createdAt: -1 });
            return responseReturn(res,200, {flaggedTransactions})
        }
        catch(error) {
            return responseReturn(res,500, {error: error.message})
        }

    }
}

module.exports = new transactionAdminControllers()