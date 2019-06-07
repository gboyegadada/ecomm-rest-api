const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

module.exports.update = (id, params) => {
    let update = (hash = false) => {

        if (false !== hash) {
            params.password = hash;
        }
        
        return db(TABLE)
            .update(params)
            .where(`${TABLE}_id`, id)
            .timeout(1000)
            .then(rows => module.exports.find(id));
    };

    return ('password' in params) 
        ? bcrypt.hash(params.password, saltRounds).then(update)
        : update();
};