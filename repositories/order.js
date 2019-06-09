const db = require('../db');

const TABLE = 'orders';

/**
 * Returns single row selected using `id`;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     find(1).then(order => console.log(order.name))
 */
exports.find = (id) => {
    return db(TABLE)
            .where(`order_id`, id)
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
 *     findOneBy({ name: 'Leather Shoes'}).then(order => console.log(order.name))
 */
module.exports.findOneBy = (params, done, next) => {
    return db(TABLE)
        .where(params)
        .timeout(1000)
        .then(rows => (rows.length > 0) ? rows[0] : null);
    
};

/**
 * Returns all orders.
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findAll().then(rows => rows.map())
 */
exports.findAll = (params = {}) => {
    return db(TABLE).where(params).timeout(1000);
};

/**
 * Returns all order details.
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     getOrderDetails().then(rows => rows.map())
 */
exports.getOrderDetails = (order_id) => {
    return db('order_detail')
            .where({ order_id: order_id })
            .timeout(1000);
};

/**
 * Insert and return single row;
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     create({ name: 'Leather Shoes'}).then(order => console.log(order.name))
 */
module.exports.create = (params) => {
    return db(TABLE)
            .insert(params)
            .timeout(1000)
            .then(rows => module.exports.find(rows[0]));
};

/**
 * Insert and return single row;
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     createLineItem({ name: 'Leather Shoes'}).then(item => console.log(item.name))
 */
module.exports.createLineItem = (params) => {
    return db('order_detail')
            .insert(params)
            .timeout(1000)
            .then(rows => module.exports.find(rows[0]));
};