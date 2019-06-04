const db = require('../db');
const bcrypt = require('bcrypt');

// import Error classes
let RouteNotFoundError = require('../errors/route-not-found');

const TABLE = 'customer';

module.exports.findAll = (params, done, next) => {
    return done(null, []);
};

exports.find = (id, done, next) => {
    db(TABLE).where(`${TABLE}_id`, id)
    .timeout(1000)
    .then(rows => { 
        if (rows.length < 1) throw new RouteNotFoundError('Customer record not found');
        
        done(rows[0]);
    } )
    .catch(next);
};

module.exports.findOneBy = (params, done, next) => {
    db(TABLE).where(params).timeout(1000).then(done).catch(next);
};

module.exports.create = (params, done, next) => {
    const { name, email, password } = params;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        db(TABLE).insert({
            name: name, 
            email: email, 
            password: hash
        })
        .timeout(1000)
        .then(rows => {
            module.exports.find(rows[0], done, next);
        })
        .catch(next);
    });
};