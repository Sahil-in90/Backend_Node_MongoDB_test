const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

require('../model/dbconnect');
const User = require("../model/userSchema");

router.get('/', (req, res) => {
    res.send("hello world")
})

router.post('/signup', async (req, res) => {
    const { name, email, phone, password } = req.body

    //if user let any form empty then show error
    if (!name || !email || !phone || !password) {
        return res.status(422).json({ error: "Please filled form " })
    }

    try {
        //if user used already exist email id
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email already exist" })
        }



        //Hashed password
        bcrypt
            .hash(req.body.password, 10)
            .then((hashedPassword) => {
                //if user is new to signup page it save their info to the database
                const user = new User({ name, email, phone, password: hashedPassword });
                const userProfile = user.save();

                if (userProfile) {
                    res.status(201).json({ message: "User registered successfully" })
                }
            })

    } catch (err) {
        console.log(err);
    }
})


"req.body line is good for get user data"
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //if login form is empty
        if (!email || !password) {
            return res.status(400).json({ error: "Please filled the required crenditional" });
        }

        //check is email present in database
        const userLogin = await User.findOne({ email: req.body.email })

        if (userLogin) {
            //check if password entered match the password in database
            const isMatch = await bcrypt.compare(password, userLogin.password)

            if (!isMatch) {
                res.status(400).json({ error: "Invalid creditional" })
            }
            else {
                res.json({ message: "User login successfully" })
            }

            const token = jwt.sign( 
                {
                    userId: User._id,
                    email: User.email
                },
                SECRET_KEY,{expiresIn: "24h"}
            )
            //   return success response
          res.status(200).send({
            message: "Login Successful",
            email: User.email,
            token,
          });
        }
        else {
            res.status(400).json({ error: "Invalid creditional" })
        }

    } catch (err) {
        console.log(err)
    }
})

module.exports = router;