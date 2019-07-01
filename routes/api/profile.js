const express = require('express');
const router = express.Router();
const passport = require('passport');
const authCheck = passport.authenticate('jwt', { session: false } );

// model
const profileModel = require('../../models/pofile');
const userModel = require('../../models/user');



// vaildation
const validateProfileInput = require('../../validation/profile');
const validateEducationInput = require('../../validation/education');
const validateExperienceInput = require('../../validation/experience');


// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get('/test', (req, res) => {
    res.json({
        msg: "profile Works"
    });
});

// @route GET api/profile/all
// @desc get all profiles
// @access Public
router.get('/all', (req, res) => {

    const errros = {};

    profileModel
        .find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errrors.noprofile = 'There are no profiles';
                return res.status(404).json(errros);
            } else {
                res.status(200).json(profiles);
            }
        })
        .catch(err => res.json({
            profile: 'There are no profile'
        }));

});

// @route GET api/profile/handle/:handle
// @desc get profile by handle
// @access Public
router.get('/handle/:handle', (req, res) => {

    const errors = {};
    const handle = req.params.handle;
    profileModel
        .findOne({ handle: handle})
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.handle = 'There is no profile for this user';
                return res.status(404).json(errors);
            } else {
                res.status(200).json(profile);
            }
        })
        .catch(err => res.json(err));
});

// @route GET api/profile/userid/:userid
// @desc get profile by userid
// @access Public
router.get('/userid/:userid', (req, res) => {
    
    const errors = {};
    const userid = req.params.userid;

    profileModel
        .findOne({ user: userid })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errrors.pofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            } else {
                res.status(200).json(profile);
            }
        })
        .catch(err => res.json(err));

});

// @route POST api/profile
// @desc register & edit userProfile
// @access private
router.post('/', authCheck, (req, res) => {

    const {errors, isValid} = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }


    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location= req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - Split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instgram) profileFields.social.instgram = req.body.instgram;

    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            if (profile) {
                // update
                profileModel
                    .findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    )
                    .then(profile => res.json(profile))
                    .catch(err => res.json(err));

            } else {
                // Check if handle exists
                profileModel
                    .findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if (profile) {
                            errrors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }
                        new profileModel(profileFields)
                            .save()
                            .then(profile => res.json(profile))
                            .catch(err => res.json(err)); 
                    })
                    .catch(err => res.json(err)); 
            }
        })
        .catch(err => res.json(err));

});

// @route POST api/profile/education
// @desc add education to profiile
// @access Private
router.post('/education', authCheck, (req, res) => {

    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                from: req.body.from,
                to: req.body.to,
                fieldofstudy: req.body.fieldofstudy,
                current: req.body.current,
                description: req.body.description
            };

            profile.education.unshift(newEdu);
            profile
                .save()
                .then(profile => {
                    res.status(200).json(profile);
                })
                .catch(err => res.json(err));

        })
        .catch(err => res.json(err));


});

// @route POST api/profile/experience
// @desc add experience to profile
// @access Private
router.post('/experience', authCheck, (req, res) => {

    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            profile.experience.unshift(newExp);
            profile
                .save()
                .then(profile => {
                    res.status(200).json(profile);
                })
                .catch(err => res.json(err));
            
                

        })
        .catch(err => res.json(err));

});



module.exports = router;