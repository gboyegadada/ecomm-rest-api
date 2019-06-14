const db = require('../services/db');

const TABLE = 'orders';


/**
 * Returns bool;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     exists(1).then(order_exists => console.log(order_exists ? 'True' : 'False'))
 */
exports.exists = (order_id) => {
    return db(TABLE)
            .where({order_id})
            .select(db.raw('count(1) as count'))
            .timeout(1000)
            .then(res => res[0].count > 0)
};

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
exports.findOneBy = (params, done, next) => {
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
exports.create = (params) => {
    return db(TABLE)
            .insert(params)
            .timeout(1000)
            .then(rows => exports.find(rows[0]));
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
exports.createLineItem = (params) => {
    return db('order_detail')
            .insert(params)
            .timeout(1000)
            .then(rows => exports.find(rows[0]));
};

/**
 * Update and return single row;
 *
 * @param {integer} - A integer param
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     update({ total_amount: 20.00}).then(order => console.log(order.order_id))
 */
exports.update = (id, params) => {
    return db(TABLE)
        .where({ order_id: id })
        .update(params)
        .then(res => exports.find(id));
};