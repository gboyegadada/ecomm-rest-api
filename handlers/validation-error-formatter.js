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
            case 'The Shipping Region ID is not a number.':
                error.code = 'USR_09';
                break;
            case 'The Department ID is not a number.':
                error.code = 'DEP_01';
                break;
            case 'A department with this ID does not exist.':
                error.code = 'DEP_02';
                break;
            case 'A category with this ID does not exist.':
                error.code = 'CAT_01';
                break;
            case 'The Category ID is not a number.':
                error.code = 'CAT_01';
                break;
            case 'The Attribute ID is not a number.':
                error.code = 'ATR_01';
                break;
            case 'The Product ID is not a number.':
                error.code = 'PRD_01';
                break;
            case 'The Value ID is not a number.':
                error.code = 'VAL_01';
                break;
            default:
                error.code = 'USR_02';
                break;
        }

        return error;
    }
});

module.exports = result;