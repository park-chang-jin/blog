const express = require('express');
const router = express.Router();
const gravater = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');

const userModel = require('../../models/user');
const authCheck = passport.authenticate('jwt', { session: false } );
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

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
    const { errors, isValid } = validateRegisterInput(req.body);

    // check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    userModel
    // Database Email confing
        .findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                // return res.status(400).json({
                //     msg: "Email already exists"
                // });
                errors.email = 'Email already exists';
                return res.status(400).json(errors);
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

// @route POST api/users/login
// @desc lgoinUser / returning jsonwebtoken
// @access Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    userModel
    // 이메일 유무 체크
        .findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = 'Email not info';
                return res.status(400).json(errors);
            } else {
                // 패스워드 체크
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            // return res.status(200).json({
                            //     msg: "success login"
                            // });
                            const payload = { id: user.id, name: user.name, avatar: user.avatar };

                            // Sign token
                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    res.json({
                                        msg: "success login",
                                        token: 'Bearer ' + token
                                    });
                                }
                            );
                        } else {
                            errors.isMatch = 'password incorrect';
                            return res.status(400).json(errors);
                        }
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
});

// @route GET api/users/current
// @desc current User
// @access Private

router.get('/current', authCheck, (req, res) => {
    res.json({
        name: req.body.name,
        email: req.body.email,
        id: req.body.id
    });
});

module.exports = router;
