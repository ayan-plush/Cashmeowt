const adminModel = require("../models/adminModel")
const { createToken } = require("../utils/createToken")
const { responseReturn } = require("../utils/responseReturn")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const userModel = require("../models/userModel")



class authControllers {

    admin_register = async (req, res) => {
        const { name, email, password } = req.body;
        const image = "https://res.cloudinary.com/decks92gf/image/upload/v1738327724/4c70d8ecf0ae67eed061e162796ac3a4_x4nx7m.jpg";

        try {
            const getUser = await adminModel.findOne({ email });

            if (getUser) {
                responseReturn(res, 409, { error: "Email Already Exists" });
            } else {
                const admin = await adminModel.create({
                    name,
                    email,
                    image,
                    password: await bcrypt.hash(password, 10),
                    method: "manually"
                });

                const token = await createToken({
                    id: admin.id,
                    role: admin.role
                });

                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    httpOnly: true
                });

                responseReturn(res, 201, { token, message: "Register Successful" });
            }
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    admin_login = async (req, res) => {
        const { email, password } = req.body;

        try {
            const admin = await adminModel.findOne({ email }).select('+password');

            if (admin) {
                const match = await bcrypt.compare(password, admin.password);

                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    });

                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    });

                    responseReturn(res, 200, { token, message: "Login Successful" });
                } else {
                    responseReturn(res, 401, { error: "Password Wrong" });
                }
            } else {
                responseReturn(res, 400, { error: "Email not found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    user_register = async (req, res) => {
        const { name, email, password } = req.body;

        try {
            const getUser = await userModel.findOne({ email });

            if (getUser) {
                responseReturn(res, 409, { error: "Email Already Exists" });
            } else {
                const user = await userModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: "manually"
                });

                const token = await createToken({
                    id: user.id,
                    role: user.role
                });

                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    httpOnly: true
                });

                responseReturn(res, 201, { token, message: "Register Successful" });
            }
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    user_login = async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await userModel.findOne({ email }).select('+password');

            if (user) {
                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    const token = await createToken({
                        id: user.id,
                        role: user.role
                    });

                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    });

                    responseReturn(res, 200, { token, message: "Login Successful" });
                } else {
                    responseReturn(res, 401, { error: "Password Wrong" });
                }
            } else {
                responseReturn(res, 400, { error: "Email not found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            });

            responseReturn(res, 200, { message: 'Logout successful' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };


}

module.exports = new authControllers()