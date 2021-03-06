const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// model
const postModel = require('../../models/post');
const profileModel = require('../../models/pofile');
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

// @route GET api/post/all
// @desc get all post
// @access publie
router.get('/all', (req, res) => {
   
    postModel
        .find()
        .sort({ date: -1 })
        .then(posts => {
            res.json(posts)
        })
        .catch(err => res.json(err));
});

// @route GET api/post/:post_id
// @desc get post by post_id
// @access Public
router.get('/:post_id', (req, res) => {

    postModel
        .findById(req.params.post_id)
        .then(post => {
            res.json(post);
        })
        .catch(err => res.json(err));

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

// @ route DELTE api/post/:post_id
// @ desc Delete post
// @ access Private
router.delete('/:post_id', authCheck, (req, res) => {
    
    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            postModel
                .findById(req.params.post_id)
                .then(post => {
                    // check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({
                            msg: 'User not authorized'
                        });
                    } 
                    post
                        .remove()
                        .then( () => res.json({ 
                            msg: 'Successful post Delete' 
                        }))
                        .catch(err => res.json(err));
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

// @route POST api/post/like/:post_id
// @desc like post
// @access Private
router.post('/like/:post_id', authCheck, (req, res) => {

    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            postModel
                .findById(req.params.post_id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({
                            msg: 'User already liked this post'
                        });
                    } 
                    // Add user id to likes array
                    post.likes.unshift({ user: req.user.id });
                    post.save().then(post => res.json(post)); 
                })
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));

});

// @route DELETE api/post/unlike/:post_id
// @desc like post delete
// @access Private
router.post('/unlike/:post_id', authCheck, (req, res) => {

    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            postModel
                .findById(req.params.post_id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0 ) {
                        return res.status(400).json({
                            msg: 'No like'
                        });
                    }
                    // get remove index
                    const remove_index = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id)

                    // splicee out of arrary 
                    post.likes.splice(remove_index, 1);
                    // save
                    post
                        .save()
                        .then(post => {
                            res.json(post);
                        })
                    
                })
                .catch(err => res.json(err));
                
        })
        .catch(err => res.json(err));

});

// @route POST api/post/comment/:post_id
// @desc add comment to post
// @access Private
router.post('/comment/:post_id', authCheck, (req, res) => {

    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    postModel
        .findById(req.params.post_id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avater: req.body.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);
            post
                .save()
                .then(post => {
                    res.json(post);
                });
        })
        .catch(err => res.json(err));


});

// @route DELETE api/post/comment/:post_id/:comment_id
// @desc comment delete
// @access Private
router.delete('/comment/:post_id/:comment_id', authCheck, (req, res) => {

    postModel
        .findById(req.params.post_id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() !== req.params.comment_id).length === 0) {
                return res.status(400).json({
                    msg: 'No comment info'
                });
            }
            // get remove index
            const remove_index = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id)

            post.comments.splice(remove_index, 1);    
            post
                .save()
                .then(post => {
                    res.json(post);
                });
        })
        .catch(err => res.json(err));
});

module.exports = router;