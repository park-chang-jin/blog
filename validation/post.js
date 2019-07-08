const Validator = require('validator');
const isEmpty = require('../validation/is-empty');

module.exports = function validatePostInput(data) {

    let errors= {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if (!Validator.isLength(data.text,{min: 10, max: 300})) {
        errors.text = 'Text between 10 and 30 write';
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = 'Text is fields required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};