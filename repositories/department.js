const db = require('../services/db');

const TABLE = 'department';

/**
 * Returns single row selected using `params`;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     find(1).then(department => console.log(department.name))
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
 *     findOneBy({ name: 'Leather Shoes'}).then(department => console.log(department.name))
 */
module.exports.findOneBy = (params, done, next) => {
    return db(TABLE)
        .where(params)
        .timeout(1000)
        .then(rows => (rows.length > 0) ? rows[0] : null);
    
};

/**
 * Returns all departments.
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findAll().then(rows => rows.map())
 */
module.exports.findAll = (params = {}) => {
    return db(TABLE).where(params).timeout(1000);
};