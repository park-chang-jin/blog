// const JwtStrategy = require('passport-jwt').Strategy; //만들고
// const ExtractJwt = require('passport-jwt').ExtractJwt; //풀고
// const mongoose = require('mongoose');
// const userModel = mongoose.model('users');
// const keys = require('../config/keys');

// const opts = {};
// // hearder beare token 넣어라
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = keys.secretOrKey;

// module.exports = passport => {
//     passport.use(
//         new JwtStrategy(opts, (jwt_payload, done) => {
//             userModel
//                 .findById(jwt_payload.id)
//                 .then(user => {
//                     if (user) {
//                         return done(null, user);
//                     } else {
//                         return done(null, false);
//                     }
//                 })
//                 .catch(err => console.log(err));
//         })
//     );
// };

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};