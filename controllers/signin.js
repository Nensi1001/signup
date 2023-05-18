const User = require('../models/signup');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const Otp = require('../models/otp');
const nodemailer = require('nodemailer');

require('dotenv').config();

const ctoken = async (id,res) => {
    try {
        const token = await jwt.sign({ _id: id }, process.env.SECRETKEY);
        return token;
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}
const secureOtp = async (otp, res) => {
    try {
        const otpHash = bcrypt.hash(otp, 10);
        return otpHash;
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}

const sendotp = async (email, otp,res) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }

        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'For Authentication',
            html: `<p>Enter <b>${otp}</b> to verify email </p>`
        }
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Mail has been sent:- ", info.response);
            }
        })
    }
    catch (err) {
        res.status(400).send({ success: false, msg: err.message });
    }
}

const postSignin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.status(400).json({ success: false, errors: errorMessages });
        }
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        if (userData) {
            const isMatch = await bcrypt.compare(password, userData.password);

            if (isMatch) {
                const tokenData = await ctoken(userData._id, res);
                userData.token = tokenData;
                await userData.save();

                const generateOTP = () => {
                    const otpLength = 6;
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    return otp.substring(0, otpLength);
                };

                const otp = generateOTP();
                const sotp = await secureOtp(otp);            

                const otpInstance = new Otp({
                    userId: userData._id,
                    otp:sotp,
                });
                await otpInstance.save();

                sendotp(userData.email, otp, res);
                const successMsg = userData.isAuth
                    ? "Successfully logged in with Authentication"
                    : "Successfully logged in";
                res.status(200).json({ success: true, msg: successMsg });
            } else {
                res.status(401).json({ success: false, msg: "Login details are incorrect" });
            }
        } else {
            res.status(401).json({ success: false, msg: "Login details are incorrect" });
        }
    } catch (err) {
        res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

module.exports = {
    postSignin
}