const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required(login)';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid(login)';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required(login)';
    }

    // if (!validator.equals(data.password, )) {
    //     error.password = 'Password inccoret';
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};