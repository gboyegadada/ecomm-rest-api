const { validationResult } = require('express-validator/check');

const result = validationResult.withDefaults({
    formatter: (error) => {
        let code;
        switch (error.msg) {
            case 'Email or Password is invalid.':
                error.code = 'USR_01';
                break;
            case `The '${error.param}' field is required.`:
                error.code = 'USR_02';
                break;
            case 'The email is invalid.':
                error.code = 'USR_03';
                break;
            case 'The email already exists.':
                error.code = 'USR_04';
                break;
            case 'The email doesn\'t exist.':
                error.code = 'USR_05';
                break;
            case 'This is an invalid phone number.':
                error.code = 'USR_06';
                break;
            case `This is too long <${error.param}>`:
                error.code = 'USR_07';
                break;
            case 'This is an invalid Credit Card.':
                error.code = 'USR_08';
                break;
            case 'The Shipping Region ID is not number':
                error.code = 'USR_09';
                break;
            default:
                error.code = 'USR_02';
                break;
        }

        return error;
    }
});

module.exports = result;