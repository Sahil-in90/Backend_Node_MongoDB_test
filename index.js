const dotenv = require('dotenv');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;
const app = express();
dotenv.config({path: './config.env'})
require('./model/dbconnect');
app.use(express.json());
const User = require('./model/userSchema');

app.use(require('./Controller/router'))



//listening port
app.listen(PORT, ()=> {
    console.log(`Server on port ${PORT}`)
});