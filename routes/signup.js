const express = require('express');
const routes = express();
const { body } = require('express-validator');
const signupController = require('../controllers/signup');
routes.use(express.json());

const isAlphanumeric = (value) => {
    return new RegExp(/^[a-zA-Z]+[\d]+$/).test(value);
};

routes.post('/signup',
    body('email').isEmail().withMessage('Invalid email address. Please try again.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .isLength({ max: 20 }).withMessage("Password can contain max 20 characters"),
    body('confirmpassword')
        .custom((value, { req }) => value === req.body.password).withMessage("Passwords don't match."),
    body('username')
        .isLength({ min: 4 }).withMessage('Username must be at least 4 characters long.')
        .isLength({ max: 10 }).withMessage('Username can contain a maximum of 10 characters.')
        .custom((value) => {
            return isAlphanumeric(value)
        }).withMessage('Username must be alphanumeric.'),
    signupController.postSignup);

routes.post('/',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'), signupController.postSignin)

module.exports = routes;