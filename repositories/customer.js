const db = require('../services/db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const TABLE = 'customer';

/**
 * Returns single row selected using `id`;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     find(1).then(customer => console.log(customer.name))
 */
exports.find = (id) => {
    return db(TABLE)
            .where(`${TABLE}_id`, id)
            .timeout(1000)
            .then(rows => (rows.length > 0) ? rows[0] : null);
};

/**
 * Returns single row selected using `params`;
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findOneBy({ name: 'Leather Shoes'}).then(customer => console.log(customer.name))
 */
module.exports.findOneBy = (params, done, next) => {
    return db(TABLE)
        .where(params)
        .timeout(1000)
        .then(rows => (rows.length > 0) ? rows[0] : null);
    
};

/**
 * Insert and return single row;
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     create({ name: 'Leather Shoes'}).then(customer => console.log(customer.name))
 */
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

/**
 * Update and return single row;
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     update(id, { name: 'Leather Shoes'}).then(customer => console.log(customer.name))
 */
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