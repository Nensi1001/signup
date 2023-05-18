const User = require('../models/signup');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

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


module.exports = {
    postSignup
}