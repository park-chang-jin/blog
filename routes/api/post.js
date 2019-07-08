const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// model
const postModel = require('../../models/post');

// validation
const validatePostInput = require('../../validation/post');

const authCheck = passport.authenticate('jwt', { session: false });



// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => {
    res.json({
        msg: "post Works"
    });
});

// @route POST api/post
// @desc post register
// @access Private

router.post('/', authCheck, (req, res) => {
   const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new postModel({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost
        .save()
        .then(post => {
            res.status(200).json(post)
        })
        .catch(err => res.json(err));

});

module.exports = router;