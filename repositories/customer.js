const db = require('../db');
const bcrypt = require('bcrypt');

const TABLE = 'customer';

exports.find = (id) => {
    return db(TABLE)
            .where(`${TABLE}_id`, id)
            .timeout(1000)
            .then(rows => (rows.length > 0) ? rows[0] : null);
};

module.exports.findOneBy = (params, done, next) => {
    return db(TABLE)
        .where(params)
        .timeout(1000)
        .then(rows => (rows.length > 0) ? rows[0] : null);
    
};

module.exports.create = (params) => {
    const { name, email, password } = params;
    const saltRounds = 10;

    return bcrypt.hash(password, saltRounds)
            .then(hash => {
                return db(TABLE).insert({
                    name: name, 
                    email: email, 
                    password: hash
                }).timeout(1000);
            })
            .then(rows => module.exports.find(rows[0]));
};