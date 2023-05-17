const User = require('../models/signup');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const ctoken = async (id) => {
    try {
        const token = await jwt.sign({ _id: id }, SECRETKEY);
        console.log(token);
        return token;
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}

const securePassword = async (password, res) => {
    try {
        const passwordHash = bcrypt.hash(password, 10);
        return passwordHash;
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}

const postSignup = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ success: false, errors: errorMessages });
    }
    try {
        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            res.status(409).json({ success: false, msg: "This email already exists" });
        }
        else {
            const spassword = await securePassword(req.body.password);            
                const user = new User({
                    ...req.body,
                    password: spassword,
                })
            const user_data = await user.save();
            res.status(200).json({ success: true, data: user_data });
        }
    }
    catch (err) {
        res.status(400).json(err.message);
    }
}

const postSignin = async (req, res) => {
    const { validationResult } = require('express-validator');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        return res.status(400).json({ success: false, errors: errorMessages });
    }
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: req.body.email });
        if (userData) {
            const isMatch = await bcrypt.compare(password, userData.password);
            if (isMatch) {
                const tokenData = await ctoken(userData._id);
                console.log("token", tokenData);
                const user_data = {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    token: tokenData
                };
                res.status(200).json({ success: true, msg: "success" });
            } else {
                res.status(200).json({ success: false, msg: "Login details are incorrect" });
            }
        } else {
            res.status(200).json({ success: false, msg: "Login details are incorrect1" });
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
};


module.exports = {
    postSignup,
    postSignin
}