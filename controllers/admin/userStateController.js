const userModel = require("../../models/userModel")
const { responseReturn } = require("../../utils/responseReturn")


class userStateController {

    enableUser = async(req,res) => {
        const {userId} = req.body

        const user = await userModel.findById(userId)

        if(!userId||!user||user.isdeleted){
            return responseReturn(res,400,{error: "userId invalid"})
        }

        try {
            if(user.disabled){
                const updateUser = await userModel.findByIdAndUpdate(userId, {disabled: false},{new: true})
                return responseReturn( res, 200, {updateUser, message: "successfully enabled"})
            }
            else {
                return responseReturn(res,300,{message: "user already enabled"})
            }
        }
        catch(error) {
            return responseReturn( res, 500, {error: error.message})
        }
    }

    softDeleteUser = async(req,res) => {
        const {userId} = req.body

        const user = await userModel.findById(userId)

        if(req.role!='admin'){
            return responseReturn(res,400,{error: "unauthorized"})
        }

        if(!userId||!user||user.isdeleted){
            return responseReturn(res,400,{error: "userId invalid"})
        }

        try {
            if(!user.isdeleted){
                const updateUser = await userModel.findByIdAndUpdate(userId, {isdeleted: true},{new: true})
                return responseReturn( res, 200, {updateUser , message: "successfully deleted"})
            }
            else {
                return responseReturn( res, 200, { message: "already deleted"})
            }
        }
        catch(error) {
            return responseReturn( res, 500, {error: error.message})
        }
    }

}

module.exports = new userStateController()