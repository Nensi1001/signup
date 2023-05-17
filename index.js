const express = require('express');
const app = express();
const dotenv = require('dotenv')

dotenv.config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connection successfull");
    });
const signupRoutes = require('./routes/signup');
app.use('/', signupRoutes);

app.listen(8000);