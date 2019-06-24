const express = require('express');
const router = express.Router();
const gravater = require('gravatar');
const bcrypt = require('bcryptjs');

const userModel = require('../../models/user');

// @route GET api/users/test
// @desc Tests users route
// @access Public

router.get('/test', (req, res) => {
    res.json({
        msg: "users Works"
    });
});

// @route POST api/users/register
// @desc createUser route
// @access Public

router.post('/register', (req, res) => {
    // res.json({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });
    userModel
    // Database Email confing
        .findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    msg: "Email already exists"
                });
            } else {
                // avatar Create
                const avatar = gravater.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', // Rating
                    d: 'mm' //Default
                });
                // Database Schema Create
                const newUser = new userModel({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                // Password 암호화
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        // 저장하고 뿌려줌
                        newUser.save()
                                .then(user => res.json(user))
                                .catch(err => res.json(err));
                    });
                });
                

            }
        })
        .catch(err => {
            res.json(err);    
        });
});




module.exports = router;
