const userModel = require("../../models/userModel")
const { responseReturn } = require("../../utils/responseReturn")


class walletControllers {

    get_balance = async (req,res) => {
        const userId = req.id
        try {
            const user = await userModel.findById(userId)
            const balance = user.balance
            return responseReturn(res, 200, {balance, message: "balance returned successfully"})
        }
        catch(error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

}

module.exports = new walletControllers()