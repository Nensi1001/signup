
const express = require('express');
const routes = express();
const { body } = require('express-validator');
const signinController = require('../controllers/signin');
routes.use(express.json());

routes.post('/',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'), signinController.postSignin);

module.exports = routes;
