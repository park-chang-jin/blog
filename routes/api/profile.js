const express = require('express');
const router = express.Router();
const passport = require('passport');
const authCheck = passport.authenticate('jwt', { session: false } );

// @route GET api/profile/test
// @desc Tests profile route
// @access Public

router.get('/test', (req, res) => {
    res.json({
        msg: "profile Works"
    });
});

// @route POST api/profile/register
// @desc register userProfile
// @access private
router.post('/register', authCheck, (req, res) => {

});

module.exports = router;