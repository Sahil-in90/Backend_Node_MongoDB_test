const mongoose = require('mongoose');

const DB = process.env.DATABASE;

//Database connection
mongoose.connect(DB).then(() => {
    console.log('connected with database')
}).catch((err) => console.log("no connection"))