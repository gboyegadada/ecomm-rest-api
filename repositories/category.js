const db = require('../services/db');

const TABLE = 'category';

/**
 * Returns single row selected using `params`;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     find(1).then(category => console.log(category.name))
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
 *     findOneBy({ name: 'Leather Shoes'}).then(category => console.log(category.name))
 */
module.exports.findOneBy = (params, done, next) => {
    return db(TABLE)
        .where(params)
        .timeout(1000)
        .then(rows => (rows.length > 0) ? rows[0] : null);
    
};

/**
 * Returns all categories.
 *
 * @param {object} - A standard object param
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findAll().then(rows => rows.map())
 */
exports.findAll = (params = {}, sort = { page: 1, limit: 20, order_by: 'category_id', order: 'asc' }) => {
    let skip = (sort.page-1) * sort.limit;
    return db(TABLE)
        .where(params)
        .limit(sort.limit)
        .offset(skip)
        .orderBy(sort.order_by, sort.order)
        .timeout(1000);
};

/**
 * Returns categories of a product.
 *
 * @param {integer} - A number param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findAll().then(rows => rows.map())
 */
exports.findByProduct = (product_id) => {
    return db(`${TABLE} as c`)
        .leftJoin('product_category as pc', 'c.category_id', 'pc.category_id')
        .where('pc.product_id', product_id)
        .select('c.*')
        .timeout(1000);
};