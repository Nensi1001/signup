const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("connection successfull");
    });
const signupRoutes = require('./routes/signup');
const signinRoutes = require('./routes/signin');

app.use('/', signupRoutes);
app.use(signinRoutes);

app.listen(8000);