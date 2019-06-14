const db = require('../services/db');

const TABLE = 'attribute';

/**
 * Returns single row selected using `params`;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     find(1).then(row => console.log(row.name))
 */
exports.find = (id) => {
    return db(TABLE)
            .where(`${TABLE}_id`, id)
            .timeout(1000)
            .then(rows => (rows.length > 0) ? rows[0] : null);
};

/**
 * Returns all attributes.
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findAll().then(rows => rows.map())
 */
exports.findAll = (params = {}) => {
    return db(TABLE)
        .where(params)
        .timeout(1000);
};

/**
 * Returns attributes of a product.
 *
 * @param {integer} - A number param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findByProduct().then(rows => rows.map())
 */
exports.findByProduct = (product_id) => {
    return db(`${TABLE} as a`)
        .leftJoin('attribute_value as v', 'a.attribute_id', 'v.attribute_id')
        .leftJoin('product_attribute as pa', 'v.attribute_value_id', 'pa.attribute_value_id')
        .where('pa.product_id', product_id)
        .select('a.name as attribute_name', 'v.attribute_value_id', 'v.value as attribute_value')
        .timeout(1000);
};

/**
 * Returns values of an attribute.
 *
 * @param {integer} - A number param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     getValues().then(rows => rows.map())
 */
exports.getValues = (attribute_id) => {
    return db(`attribute_value`)
        .select('attribute_value_id', 'value')
        .where('attribute_id', attribute_id)
        .timeout(1000);
};