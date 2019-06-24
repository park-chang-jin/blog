const express = require('express');
const router = express.Router();

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
    res.json({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
});




module.exports = router;
