const db = require('../db');

const TABLE = 'product';

/**
 * Returns single row selected using `params`;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     find(1).then(product => console.log(product.name))
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
 *     findOneBy({ name: 'Leather Shoes'}).then(product => console.log(product.name))
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
exports.findAll = (params = {}, sort = { page: 1, limit: 20, order_by: 'product_id', order: 'asc', description_length: 200}) => {
    let skip = (sort.page-1) * sort.limit;
    let len = [sort.description_length, sort.description_length];
    let raw_short_description = db.raw(`if(length(description) <= ?, description, concat(left(description, ?), '...')) as description`, len);

    return db(TABLE)
        .where(params)
        .select(`product_id`, `name`, raw_short_description, `price`, `discounted_price`, `image`, `image_2`, `thumbnail`, `display`)
        .limit(sort.limit)
        .offset(skip)
        .orderBy(sort.order_by, sort.order)
        .timeout(1000);
};

/**
 * Returns products in a category.
 *
 * @param {integer} - A number param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findAll().then(rows => rows.map())
 */
exports.findByCategory = (category_id) => {
    return db(`${TABLE} as p`)
        .leftJoin('product_category as pc', 'p.product_id', 'pc.product_id')
        .where('pc.category_id', category_id)
        .select('p.*')
        .timeout(1000);
};

/**
 * Returns products in a category.
 *
 * @param {integer} - A number param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findAll().then(rows => rows.map())
 */
exports.findByDepartment = (department_id) => {
    return db(`${TABLE} as p`)
        .leftJoin('product_category as pc', 'p.product_id', 'pc.product_id')
        .leftJoin('category as c', 'c.category_id', 'pc.category_id')
        .leftJoin('department as d', 'd.department_id', 'c.department_id')
        .where('d.department_id', department_id)
        .select('p.*')
        .timeout(1000);
};