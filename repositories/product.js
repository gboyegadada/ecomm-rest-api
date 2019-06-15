const db = require('../services/db');

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
 * Returns matching rows;
 *
 * @param {object} - A standard object param
 * @param {string} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     search(query, sort).then(rows => rows.map())
 */
module.exports.search = (query, sort = { all_words: 'on', page: 1, limit: 20, description_length: 200}) => {
    let offset = (sort.page-1) * sort.limit;

    return db.raw(
                'Call catalog_search(?, ?, ?, ?, ?)',
                [query, sort.all_words, sort.description_length, sort.limit, offset]
            )
            .then(res => res[0][0])
            .timeout(1000);
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
 *     findAll(params, sort).then(rows => rows.map())
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
 *     findByCategory(category_id).then(rows => rows.map())
 */
exports.findByCategory = (category_id) => {
    return db(`${TABLE} as p`)
        .leftJoin('product_category as pc', 'p.product_id', 'pc.product_id')
        .where('pc.category_id', category_id)
        .select('p.*')
        .timeout(1000);
};

/**
 * Returns products in a department.
 *
 * @param {integer} - A number param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findByDepartment(department_id).then(rows => rows.map())
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

/**
 * Returns products locations (categories and departments).
 *
 * @param {integer} - A number param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     getProductLocations(product_id).then(rows => rows.map())
 */
exports.getProductLocations = (product_id) => {
    return db(`${TABLE} as p`)
        .leftJoin('product_category as pc', 'p.product_id', 'pc.product_id')
        .leftJoin('category as c', 'c.category_id', 'pc.category_id')
        .leftJoin('department as d', 'd.department_id', 'c.department_id')
        .where('p.product_id', product_id)
        .select('c.category_id', 'c.name as category_name', 'd.department_id', 'd.name as department_name')
        .timeout(1000)
        .then(rows => (rows.length > 0) ? rows[0] : null);
};

/**
 * Returns product reviews.
 *
 * @param {integer} - A number param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     getProductReviews(product_id).then(rows => rows.map())
 */
exports.getProductReviews = (product_id) => {
    return db(`review`)
        .where('product_id', product_id)
        .timeout(1000);
};

/**
 * Insert product review.
 *
 * @param {object} - Plain js object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     getProductReviews(product_id).then(rows => rows.map())
 */
exports.createProductReview = (params) => {
    return db(`review`)
        .insert({
            product_id: params.product_id, 
            customer_id: params.customer_id,
            review: params.review,
            rating: params.rating,
            created_on: new Date()
        })
        .timeout(1000);
};