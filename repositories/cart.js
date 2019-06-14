const db = require('../services/db');

const TABLE = 'shopping_cart';

let insertItem = (params) => {
    let {cart_id, product_id, attributes, quantity} = params;

    return db.raw(
        `INSERT INTO ${TABLE} (cart_id,product_id,attributes,quantity,added_on) values (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity=quantity+1`, 
        [ cart_id, product_id, attributes, quantity, new Date() ]
        )
        .timeout(1000);
}

/**
 * Returns single row selected using `id`;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     find(1).then(item => console.log(item.name))
 */
module.exports.find = (id) => {
    return db(`${TABLE} as i`)
            .leftJoin('product as p', 'i.product_id', 'p.product_id')
            .where('i.item_id', id)
            .select(
                'i.cart_id as cart_id',
                'i.item_id as item_id', 
                'p.name as name', 
                'i.attributes as attributes', 
                'i.product_id as product_id',
                'p.price as price',
                'i.quantity as quantity',
                'p.image as image',
                db.raw('(p.price*i.quantity) as subtotal')
                )
            .timeout(1000)
            .then(rows => (rows.length > 0 && `${id}` === `${rows[0].item_id}`) ? rows[0] : null);
};

/**
 * Returns single row selected using `id`;
 *
 * @param {integer} - A positive ineteger
 * @return {Promise} A Promise
 *
 * @example
 *
 *     find(1).then(item => console.log(item.name))
 */
module.exports.exists = (item_id) => {
    return db(TABLE)
            .where({item_id: item_id})
            .select(db.raw('count(1) as count'))
            .timeout(1000)
            .then(res => res[0].count > 0)
};

/**
 * Returns single row selected using `params`;
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     findOneBy({ name: 'Leather Shoes'}).then(item => console.log(item.name))
 */
module.exports.findOneBy = (params, done, next) => {
    return db(TABLE)
        .where(params)
        .timeout(1000)
        .then(rows => (rows.length > 0) ? rows[0] : null);
    
};

/**
 * Returns all cart items.
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

/**
 * Returns shopping cart items.
 *
 * @param {string} - A unique string param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     getItems().then(rows => rows.map())
 */
module.exports.getItems = (cart_id, buy_now = true) => {
    return db(`${TABLE} as i`)
            .leftJoin('product as p', 'i.product_id', 'p.product_id')
            .where('i.cart_id', cart_id)
            .where('i.buy_now', buy_now)
            .select(
                'i.item_id as item_id', 
                'p.name as name', 
                'i.attributes as attributes', 
                'i.product_id as product_id',
                'p.price as price',
                'i.quantity as quantity',
                'p.image as image',
                db.raw('(p.price*i.quantity) as subtotal')
                )
            .timeout(1000);
};

/**
 * Insert item and return all rows;
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     addItem({ 
 *                 cart_id: 'xvuyx86xc-45rt',
 *                 product_id: 1,
 *                 attributes: 'Red'
 *     })
 *     .then(customer => console.log(customer.name))
 */
module.exports.addItem = (params) => {
    let {cart_id, product_id, attributes, quantity = 1} = params;
    params.quantity = quantity;

    return db(TABLE)
        .where({ cart_id, product_id })
        .increment({quantity})
        .then(res => (res > 0) 
            ? module.exports.getItems(cart_id) 
            : insertItem(params).then(res => module.exports.getItems(cart_id))
        );
};

/**
 * Update and return single row;
 *
 * @param {object} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     updateItem({ name: 'Leather Shoes'}).then(customer => console.log(customer.name))
 */
module.exports.updateItem = (id, params) => {
    return db(TABLE)
        .where({ item_id: id })
        .update(params)
        .then(res => module.exports.find(id))
        .then(item => module.exports.getItems(item.cart_id));
};

/**
 * Delete cart items (empty cart);
 *
 * @param {string} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     emptyCart(cart_id).then(() => void)
 */
module.exports.emptyCart = (cart_id) => {
    return db(TABLE).where({ cart_id }).del();
};

/**
 * Delete item;
 *
 * @param {string} - A standard object param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     emptyCart(cart_id).then(() => void)
 */
module.exports.removeItem = (item_id) => {
    return db(TABLE).where({ item_id }).del();
};

/**
 * Returns cart total.
 *
 * @param {string} - A unique string param
 * @return {Promise} A Promise
 *
 * @example
 *
 *     getItems().then(rows => rows.map())
 */
module.exports.getTotalAmount = (cart_id) => {
    return db(`${TABLE} as i`)
            .leftJoin('product as p', 'i.product_id', 'p.product_id')
            .where('i.cart_id', cart_id)
            .where('i.buy_now', true)
            .select(db.raw('sum(p.price*i.quantity) as total_amount'))
            .timeout(1000);
};